package in.esaicakes.pos;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.BluetoothSocket;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Base64;
import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.OutputStream;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Small native bridge for the two transports thermal printers actually use:
 * Classic Bluetooth SPP/RFCOMM and BLE GATT.
 *
 * This exists because Web Bluetooth is not available inside the Android WebView.
 * It reports bytes submitted, not proof of paper output.
 */
@CapacitorPlugin(
    name = "ThermalPrinter",
    permissions = {
        @Permission(
            alias = "bluetooth",
            strings = { Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT }
        ),
        @Permission(alias = "location", strings = { Manifest.permission.ACCESS_FINE_LOCATION })
    }
)
public class ThermalPrinterPlugin extends Plugin {
    private static final String TAG = "ThermalPrinter";
    private static final UUID SPP_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    private static final String[][] PREFERRED_PAIRS = {
        { "000018f0-0000-1000-8000-00805f9b34fb", "00002af1-0000-1000-8000-00805f9b34fb" },
        { "e7810a71-73ae-499d-8c15-faa9aef0c3f2", "bef8d6c9-9c21-4c9e-b632-bd58c1009f9f" },
        { "49535343-fe7d-4ae5-8fa9-9fafd205e455", "49535343-8841-43f4-a8d4-ecbe34729bb3" },
        { "6e400001-b5a3-f393-e0a9-e50e24dcca9e", "6e400002-b5a3-f393-e0a9-e50e24dcca9e" },
        { "0000ff00-0000-1000-8000-00805f9b34fb", "0000ff02-0000-1000-8000-00805f9b34fb" },
        { "0000ffe0-0000-1000-8000-00805f9b34fb", "0000ffe1-0000-1000-8000-00805f9b34fb" },
        { "0000ae30-0000-1000-8000-00805f9b34fb", "0000ae01-0000-1000-8000-00805f9b34fb" }
    };

    private BluetoothAdapter adapter;
    private BluetoothSocket classicSocket;
    private OutputStream classicOut;
    private BluetoothGatt gatt;
    private BluetoothGattCharacteristic writeChar;
    private int negotiatedMtu = 23;
    private boolean writing = false;

    private PluginCall pendingConnect;
    private Runnable connectTimeout;

    private PluginCall writeCall;
    private byte[] writeBuffer;
    private int writeOffset = 0;
    private int writeBytesWritten = 0;
    private int lastBleChunkLength = 0;
    private boolean writeWithoutResponse = false;

    private final Handler handler = new Handler(Looper.getMainLooper());

    private BluetoothAdapter getAdapter() {
        if (adapter == null) {
            BluetoothManager manager = (BluetoothManager) getContext().getSystemService(Context.BLUETOOTH_SERVICE);
            if (manager != null) adapter = manager.getAdapter();
        }
        return adapter;
    }

    // ----- Permissions -----------------------------------------------------

    @PluginMethod
    public void checkPermissions(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("bluetooth", getPermissionState("bluetooth").toString());
        ret.put("location", getPermissionState("location").toString());
        call.resolve(ret);
    }

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            requestPermissionForAlias("bluetooth", call, "permissionsCallback");
        } else {
            requestPermissionForAlias("location", call, "permissionsCallback");
        }
    }

    @PermissionCallback
    private void permissionsCallback(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("bluetooth", getPermissionState("bluetooth").toString());
        ret.put("location", getPermissionState("location").toString());
        call.resolve(ret);
    }

    // ----- Adapter / scanning ---------------------------------------------

    @PluginMethod
    public void getDeviceInfo(PluginCall call) {
        JSObject ret = new JSObject();
        try {
            String androidId = Settings.Secure.getString(
                getContext().getContentResolver(),
                Settings.Secure.ANDROID_ID
            );
            if (androidId != null) ret.put("androidId", androidId);
        } catch (Exception ignored) {
            // Best effort.
        }
        try {
            long firstInstall = getContext()
                .getPackageManager()
                .getPackageInfo(getContext().getPackageName(), 0)
                .firstInstallTime;
            ret.put("firstInstallTime", firstInstall);
        } catch (Exception ignored) {
            // Best effort.
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void isSupported(PluginCall call) {
        BluetoothAdapter a = getAdapter();
        JSObject ret = new JSObject();
        ret.put("supported", a != null);
        boolean enabled = false;
        if (a != null) {
            try {
                enabled = a.isEnabled();
            } catch (SecurityException ignored) {
                enabled = false;
            }
            if (a.getName() != null) ret.put("adapterName", a.getName());
        }
        ret.put("enabled", enabled);
        call.resolve(ret);
    }

    private String safeName(BluetoothDevice device) {
        try {
            return device.getName();
        } catch (SecurityException e) {
            return null;
        }
    }

    @PluginMethod
    public void scan(PluginCall call) {
        BluetoothAdapter a = getAdapter();
        if (a == null) {
            call.reject("This device has no Bluetooth adapter.", "UNSUPPORTED");
            return;
        }
        try {
            if (!a.isEnabled()) {
                call.reject("Bluetooth is turned off.", "BLUETOOTH_DISABLED");
                return;
            }
        } catch (SecurityException e) {
            call.reject("Bluetooth permission is required.", "PERMISSION_DENIED");
            return;
        }

        int duration = call.getInt("durationMs", 8000);
        int safeDuration = Math.max(2000, Math.min(15000, duration));

        JSArray devices = new JSArray();
        Set<String> seen = new HashSet<>();
        final boolean[] finished = { false };

        // Paired printers are the most reliable Classic SPP targets.
        try {
            Set<BluetoothDevice> bonded = a.getBondedDevices();
            if (bonded != null) {
                for (BluetoothDevice device : bonded) {
                    String name = safeName(device);
                    if (name == null || name.trim().isEmpty()) {
                        name = "Paired device";
                    }
                    JSObject obj = new JSObject();
                    obj.put("address", device.getAddress());
                    obj.put("name", name);
                    obj.put("bonded", true);
                    obj.put("transport", "classic");
                    devices.put(obj);
                    seen.add(device.getAddress());
                }
            }
        } catch (SecurityException e) {
            call.reject("Bluetooth permission is required to list paired printers.", "PERMISSION_DENIED");
            return;
        }

        // Android 11 and below need location services for BLE scans. Paired
        // Classic printers remain usable without it, so only skip the BLE scan.
        boolean locationEnabled = true;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            try {
                LocationManager lm = (LocationManager) getContext().getSystemService(Context.LOCATION_SERVICE);
                locationEnabled = lm == null || lm.isLocationEnabled();
            } catch (Exception ignored) {
                locationEnabled = false;
            }
        }

        final BluetoothLeScanner scanner;
        try {
            scanner = locationEnabled ? a.getBluetoothLeScanner() : null;
        } catch (SecurityException e) {
            call.reject("Bluetooth scan permission is required.", "PERMISSION_DENIED");
            return;
        }

        if (scanner == null) {
            returnScan(call, devices);
            return;
        }

        final ScanCallback scanCallback = new ScanCallback() {
            @Override
            public void onScanResult(int callbackType, ScanResult result) {
                BluetoothDevice device = result.getDevice();
                if (device == null) return;
                String address = device.getAddress();
                if (seen.contains(address)) return;
                String name = safeName(device);
                if (name == null || name.trim().isEmpty()) return;
                seen.add(address);
                JSObject obj = new JSObject();
                obj.put("address", address);
                obj.put("name", name);
                obj.put("bonded", device.getBondState() == BluetoothDevice.BOND_BONDED);
                obj.put("transport", "ble");
                devices.put(obj);
            }

            @Override
            public void onBatchScanResults(List<ScanResult> results) {
                for (ScanResult result : results) {
                    onScanResult(ScanSettings.CALLBACK_TYPE_ALL_MATCHES, result);
                }
            }

            @Override
            public void onScanFailed(int errorCode) {
                Log.w(TAG, "BLE scan failed: " + errorCode);
            }
        };

        try {
            ScanSettings settings = new ScanSettings.Builder()
                .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                .build();
            scanner.startScan(null, settings, scanCallback);
        } catch (SecurityException e) {
            call.reject("Bluetooth scan permission was denied.", "PERMISSION_DENIED");
            return;
        } catch (Exception e) {
            call.reject("Could not start Bluetooth scan: " + e.getMessage(), "SCAN_FAILED");
            return;
        }

        handler.postDelayed(() -> {
            if (finished[0]) return;
            finished[0] = true;
            try {
                scanner.stopScan(scanCallback);
            } catch (Exception ignored) {
                // Scanner may already be stopped.
            }
            returnScan(call, devices);
        }, safeDuration);
    }

    private void returnScan(PluginCall call, JSArray devices) {
        JSObject ret = new JSObject();
        ret.put("devices", devices);
        call.resolve(ret);
    }

    // ----- Connect ---------------------------------------------------------

    @PluginMethod
    public void connect(PluginCall call) {
        String address = call.getString("address");
        String transport = call.getString("transport", "classic");
        if (address == null || address.isEmpty()) {
            call.reject("A printer address is required.", "BAD_ADDRESS");
            return;
        }
        BluetoothAdapter a = getAdapter();
        if (a == null) {
            call.reject("This device has no Bluetooth adapter.", "UNSUPPORTED");
            return;
        }
        try {
            if (!a.isEnabled()) {
                call.reject("Bluetooth is turned off.", "BLUETOOTH_DISABLED");
                return;
            }
        } catch (SecurityException e) {
            call.reject("Bluetooth permission is required.", "PERMISSION_DENIED");
            return;
        }

        disconnectInternal();
        pendingConnect = call;

        final BluetoothDevice device;
        try {
            device = a.getRemoteDevice(address);
        } catch (Exception e) {
            pendingConnect = null;
            call.reject("Invalid printer address.", "BAD_ADDRESS");
            return;
        }

        connectTimeout = () -> {
            if (pendingConnect != null) {
                PluginCall pending = pendingConnect;
                pendingConnect = null;
                disconnectInternal();
                pending.reject("The printer did not respond. Make sure it is turned on and in range.", "CONNECT_TIMEOUT");
            }
        };
        handler.postDelayed(connectTimeout, 15000);

        if ("ble".equals(transport)) {
            connectBle(device);
        } else {
            connectClassic(device);
        }
    }

    private void resolveConnect(BluetoothDevice device, String transport, String serviceUuid, String characteristicUuid) {
        if (pendingConnect == null) return;
        if (connectTimeout != null) {
            handler.removeCallbacks(connectTimeout);
            connectTimeout = null;
        }
        PluginCall call = pendingConnect;
        pendingConnect = null;
        JSObject ret = new JSObject();
        String name = safeName(device);
        ret.put("address", device.getAddress());
        ret.put("name", name != null && !name.isEmpty() ? name : "Bluetooth printer");
        ret.put("transport", transport);
        if (serviceUuid != null) ret.put("serviceUuid", serviceUuid);
        if (characteristicUuid != null) ret.put("characteristicUuid", characteristicUuid);
        call.resolve(ret);
    }

    private void rejectConnect(String message, String code) {
        if (pendingConnect == null) return;
        if (connectTimeout != null) {
            handler.removeCallbacks(connectTimeout);
            connectTimeout = null;
        }
        PluginCall call = pendingConnect;
        pendingConnect = null;
        call.reject(message, code);
    }

    private void connectClassic(final BluetoothDevice device) {
        new Thread(() -> {
            BluetoothSocket socket = null;
            Exception lastError = null;

            try {
                getAdapter().cancelDiscovery();
            } catch (Exception ignored) {
                // Discovery cancellation is best effort.
            }

            try {
                socket = device.createRfcommSocketToServiceRecord(SPP_UUID);
                socket.connect();
            } catch (Exception e) {
                lastError = e;
                closeSocketQuietly(socket);
                socket = null;
            }

            if (socket == null) {
                try {
                    socket = device.createInsecureRfcommSocketToServiceRecord(SPP_UUID);
                    socket.connect();
                } catch (Exception e) {
                    lastError = e;
                    closeSocketQuietly(socket);
                    socket = null;
                }
            }

            if (socket == null) {
                try {
                    Method method = device.getClass().getMethod("createRfcommSocket", int.class);
                    socket = (BluetoothSocket) method.invoke(device, 1);
                    socket.connect();
                } catch (Exception e) {
                    lastError = e;
                    closeSocketQuietly(socket);
                    socket = null;
                }
            }

            if (socket == null) {
                String msg = lastError != null && lastError.getMessage() != null
                    ? lastError.getMessage()
                    : "Could not open a Classic Bluetooth serial connection.";
                handler.post(() -> rejectConnect(msg, "CONNECT_FAILED"));
                return;
            }

            try {
                classicSocket = socket;
                classicOut = socket.getOutputStream();
                handler.post(() -> resolveConnect(device, "classic", null, null));
            } catch (Exception e) {
                closeSocketQuietly(socket);
                classicSocket = null;
                classicOut = null;
                handler.post(() -> rejectConnect("Could not open the printer output stream.", "CONNECT_FAILED"));
            }
        }).start();
    }

    private void connectBle(final BluetoothDevice device) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                gatt = device.connectGatt(getContext(), false, gattCallback, BluetoothDevice.TRANSPORT_LE);
            } else {
                gatt = device.connectGatt(getContext(), false, gattCallback);
            }
        } catch (SecurityException e) {
            rejectConnect("Bluetooth permission is required to connect.", "PERMISSION_DENIED");
            return;
        } catch (Exception e) {
            rejectConnect("Could not connect to the BLE printer: " + e.getMessage(), "CONNECT_FAILED");
            return;
        }
        if (gatt == null) {
            rejectConnect("Could not create a BLE connection.", "CONNECT_FAILED");
        }
    }

    private final BluetoothGattCallback gattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt g, int status, int newState) {
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                try {
                    g.requestMtu(185);
                    g.discoverServices();
                } catch (SecurityException e) {
                    handler.post(() -> rejectConnect("Bluetooth permission was revoked.", "PERMISSION_DENIED"));
                }
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                if (pendingConnect != null) {
                    handler.post(() -> rejectConnect("Printer disconnected during setup.", "CONNECT_FAILED"));
                }
                if (writing) {
                    finishWrite(false, "Printer disconnected mid-job. The receipt may be incomplete.");
                }
                closeGattQuietly();
            }
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt g, int status) {
            if (status != BluetoothGatt.GATT_SUCCESS) {
                handler.post(() -> rejectConnect("Could not discover printer services.", "SERVICE_DISCOVERY_FAILED"));
                return;
            }
            BluetoothGattService chosenService = null;
            BluetoothGattCharacteristic chosenChar = null;
            int bestScore = -1;

            for (BluetoothGattService service : g.getServices()) {
                for (BluetoothGattCharacteristic characteristic : service.getCharacteristics()) {
                    int properties = characteristic.getProperties();
                    boolean writable = (properties & BluetoothGattCharacteristic.PROPERTY_WRITE) != 0
                        || (properties & BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE) != 0;
                    if (!writable) continue;
                    int score = characteristicScore(service.getUuid(), characteristic.getUuid());
                    if (score > bestScore) {
                        bestScore = score;
                        chosenService = service;
                        chosenChar = characteristic;
                    }
                }
            }

            if (chosenChar == null) {
                handler.post(() -> rejectConnect(
                    "Connected, but no writable ESC/POS characteristic was found.",
                    "NO_WRITABLE_CHARACTERISTIC"
                ));
                return;
            }

            writeChar = chosenChar;
            writeWithoutResponse =
                (chosenChar.getProperties() & BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE) != 0;
            final String serviceUuid = chosenService.getUuid().toString();
            final String charUuid = chosenChar.getUuid().toString();
            handler.post(() -> resolveConnect(g.getDevice(), "ble", serviceUuid, charUuid));
        }

        @Override
        public void onMtuChanged(BluetoothGatt g, int mtu, int status) {
            if (status == BluetoothGatt.GATT_SUCCESS && mtu > 23) {
                negotiatedMtu = mtu;
            }
        }

        @Override
        public void onCharacteristicWrite(BluetoothGatt g, BluetoothGattCharacteristic characteristic, int status) {
            if (!writing || writeWithoutResponse) return;
            if (status != BluetoothGatt.GATT_SUCCESS) {
                finishWrite(false, "The printer rejected a write (GATT status " + status + ").");
                return;
            }
            writeOffset += lastBleChunkLength;
            writeBytesWritten += lastBleChunkLength;
            handler.post(ThermalPrinterPlugin.this::writeNextBleChunk);
        }
    };

    private int characteristicScore(UUID serviceUuid, UUID charUuid) {
        String s = serviceUuid.toString().toLowerCase();
        String c = charUuid.toString().toLowerCase();
        for (int i = 0; i < PREFERRED_PAIRS.length; i++) {
            if (PREFERRED_PAIRS[i][0].equals(s) && PREFERRED_PAIRS[i][1].equals(c)) return 100 - i;
        }
        for (String[] pair : PREFERRED_PAIRS) {
            if (pair[0].equals(s)) return 60;
        }
        return 10;
    }

    // ----- Write -----------------------------------------------------------

    @PluginMethod
    public void write(PluginCall call) {
        if (writing) {
            call.reject("A print job is already being sent to the printer.", "BUSY");
            return;
        }
        String base64 = call.getString("base64");
        if (base64 == null || base64.isEmpty()) {
            call.reject("No receipt payload was provided.", "EMPTY_PAYLOAD");
            return;
        }
        final byte[] data;
        try {
            data = Base64.decode(base64, Base64.DEFAULT);
        } catch (Exception e) {
            call.reject("Receipt payload is not valid base64.", "BAD_PAYLOAD");
            return;
        }

        if (classicOut != null) {
            writing = true;
            new Thread(() -> writeClassic(data, call)).start();
            return;
        }

        if (gatt != null && writeChar != null) {
            writing = true;
            writeCall = call;
            writeBuffer = data;
            writeOffset = 0;
            writeBytesWritten = 0;
            handler.post(this::writeNextBleChunk);
            return;
        }

        call.reject("No printer is connected.", "NOT_CONNECTED");
    }

    private void writeClassic(byte[] data, PluginCall call) {
        int chunkSize = 512;
        int written = 0;
        try {
            for (int offset = 0; offset < data.length; offset += chunkSize) {
                int length = Math.min(chunkSize, data.length - offset);
                classicOut.write(data, offset, length);
                written += length;
                Thread.sleep(20);
            }
            classicOut.flush();
            writing = false;
            JSObject ret = new JSObject();
            ret.put("ok", true);
            ret.put("bytesWritten", written);
            ret.put("totalBytes", data.length);
            handler.post(() -> call.resolve(ret));
        } catch (Exception e) {
            writing = false;
            JSObject ret = new JSObject();
            ret.put("ok", false);
            ret.put("bytesWritten", written);
            ret.put("error", e.getMessage() != null ? e.getMessage() : "Classic Bluetooth write failed.");
            handler.post(() -> call.resolve(ret));
        }
    }

    private void writeNextBleChunk() {
        if (!writing || writeCall == null) return;
        if (writeBuffer == null || writeOffset >= writeBuffer.length) {
            finishWrite(true, null);
            return;
        }

        int chunkSize = Math.max(20, Math.min(180, negotiatedMtu - 3));
        int length = Math.min(chunkSize, writeBuffer.length - writeOffset);
        lastBleChunkLength = length;
        byte[] chunk = Arrays.copyOfRange(writeBuffer, writeOffset, writeOffset + length);

        writeChar.setWriteType(
            writeWithoutResponse
                ? BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE
                : BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT
        );

        boolean queued;
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                int result = gatt.writeCharacteristic(
                    writeChar,
                    chunk,
                    writeChar.getWriteType()
                );
                queued = result == android.bluetooth.BluetoothStatusCodes.SUCCESS;
            } else {
                writeChar.setValue(chunk);
                queued = gatt.writeCharacteristic(writeChar);
            }
        } catch (SecurityException e) {
            finishWrite(false, "Bluetooth permission was revoked.");
            return;
        } catch (Exception e) {
            finishWrite(false, e.getMessage() != null ? e.getMessage() : "BLE write failed.");
            return;
        }

        if (!queued) {
            finishWrite(false, "The printer did not accept the BLE write.");
            return;
        }

        if (writeWithoutResponse) {
            writeOffset += length;
            writeBytesWritten += length;
            handler.postDelayed(this::writeNextBleChunk, 25);
        }
        // For acknowledged writes, onCharacteristicWrite advances the offset.
    }

    private void finishWrite(boolean ok, String error) {
        PluginCall call = writeCall;
        int written = writeBytesWritten;
        int total = writeBuffer != null ? writeBuffer.length : 0;
        writing = false;
        writeCall = null;
        writeBuffer = null;
        writeOffset = 0;
        writeBytesWritten = 0;

        if (call == null) return;
        JSObject ret = new JSObject();
        ret.put("ok", ok);
        ret.put("bytesWritten", written);
        if (error != null) ret.put("error", error);
        ret.put("totalBytes", total);
        call.resolve(ret);
    }

    // ----- Lifecycle -------------------------------------------------------

    @PluginMethod
    public void disconnect(PluginCall call) {
        disconnectInternal();
        call.resolve();
    }

    private void disconnectInternal() {
        if (connectTimeout != null) {
            handler.removeCallbacks(connectTimeout);
            connectTimeout = null;
        }
        if (pendingConnect != null) {
            pendingConnect = null;
        }
        if (writeCall != null) {
            JSObject ret = new JSObject();
            ret.put("ok", false);
            ret.put("bytesWritten", writeBytesWritten);
            ret.put("error", "Printer disconnected before the job finished. The receipt may be incomplete.");
            PluginCall pendingWrite = writeCall;
            handler.post(() -> pendingWrite.resolve(ret));
        }
        writing = false;
        writeCall = null;
        writeBuffer = null;
        writeOffset = 0;
        writeBytesWritten = 0;

        closeSocketQuietly(classicSocket);
        classicSocket = null;
        classicOut = null;
        closeGattQuietly();
    }

    private void closeGattQuietly() {
        if (gatt != null) {
            try {
                gatt.disconnect();
            } catch (Exception ignored) {
                // Ignore.
            }
            try {
                gatt.close();
            } catch (Exception ignored) {
                // Ignore.
            }
            gatt = null;
        }
        writeChar = null;
        negotiatedMtu = 23;
    }

    private void closeSocketQuietly(BluetoothSocket socket) {
        if (socket == null) return;
        try {
            socket.close();
        } catch (Exception ignored) {
            // Ignore.
        }
    }

    @PluginMethod
    public void openBluetoothSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_BLUETOOTH_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Could not open Bluetooth settings.", "SETTINGS_FAILED");
        }
    }

    @Override
    protected void handleOnDestroy() {
        disconnectInternal();
        super.handleOnDestroy();
    }
}
