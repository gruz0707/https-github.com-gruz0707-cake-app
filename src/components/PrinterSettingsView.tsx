import { useEffect, useState, type FormEvent } from 'react';
import {
  Bluetooth,
  BluetoothConnected,
  Check,
  Loader2,
  Printer,
  RefreshCw,
  Search,
  Settings,
  Smartphone,
  Unplug,
} from 'lucide-react';
import type { LastPrintLog } from '../hooks/usePosStore';
import {
  isNativePrinterAvailable,
  openNativeBluetoothSettings,
  type NativePrinterDevice,
} from '../services/nativePrinter';
import { isWebBluetoothSupported as webBluetoothAvailable } from '../services/bluetoothPrinter';
import type {
  BluetoothPrinterState,
  RememberedPrinter,
  ShopSettings,
} from '../types/pos';
import { formatTestSlipLines } from '../utils/escpos';
import { Segmented } from './Segmented';
import { Switch } from './Switch';
import { btnGhost, btnPrimary, card, fieldLabel, focus, input, tonePill } from '../ui';

interface PrinterSettingsViewProps {
  printer: BluetoothPrinterState;
  rememberedPrinter: RememberedPrinter | null;
  settings: ShopSettings;
  lastPrintLog: LastPrintLog | null;
  onScanNative: () => Promise<{
    ok: boolean;
    devices?: NativePrinterDevice[];
    error?: string;
    code?: string;
  }>;
  onConnectNative: (device: NativePrinterDevice) => Promise<{ ok: boolean; error?: string }>;
  onConnectWebBluetooth: () => Promise<{ ok: boolean; error?: string }>;
  onReconnectRemembered: () => Promise<{ ok: boolean; error?: string }>;
  onConnectSimulated: (paperWidth?: 58 | 80) => void;
  onDisconnectPrinter: () => void;
  onForgetPrinter: () => void;
  onPrintTestSlip: (lines: string[]) => Promise<{ ok: boolean; error?: string }>;
  onUpdateSettings: (next: ShopSettings) => void;
}

function modeLabel(printer: BluetoothPrinterState): string {
  switch (printer.mode) {
    case 'native-classic':
      return 'Classic Bluetooth SPP';
    case 'native-ble':
      return 'Native BLE GATT';
    case 'web-bluetooth':
      return 'Web Bluetooth BLE';
    case 'simulated':
      return 'Test simulator (no paper)';
    default:
      return 'Not connected';
  }
}

function jobLabel(printer: BluetoothPrinterState): string {
  switch (printer.lastJobState) {
    case 'sending':
      return 'Sending to printer…';
    case 'sent':
      return 'Bytes sent — check paper';
    case 'failed':
      return 'Last print failed';
    case 'uncertain':
      return 'Last print uncertain';
    default:
      return 'Ready';
  }
}

export function PrinterSettingsView({
  printer,
  rememberedPrinter,
  settings,
  lastPrintLog,
  onScanNative,
  onConnectNative,
  onConnectWebBluetooth,
  onReconnectRemembered,
  onConnectSimulated,
  onDisconnectPrinter,
  onForgetPrinter,
  onPrintTestSlip,
  onUpdateSettings,
}: PrinterSettingsViewProps) {
  const [formState, setFormState] = useState<ShopSettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);
  const [testNotice, setTestNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<NativePrinterDevice[] | null>(null);
  const [connectingAddress, setConnectingAddress] = useState<string | null>(null);
  const [connectingRemembered, setConnectingRemembered] = useState(false);
  const [scanError, setScanError] = useState<{ text: string; code?: string } | null>(null);

  const native = isNativePrinterAvailable();
  const webBle = webBluetoothAvailable();

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  const handleScan = async () => {
    setScanning(true);
    setScanError(null);
    setDevices(null);
    try {
      const res = await onScanNative();
      if (res.ok) {
        setDevices(res.devices ?? []);
      } else {
        setScanError({ text: res.error || 'Bluetooth scan failed.', code: res.code });
      }
    } finally {
      setScanning(false);
    }
  };

  const handleConnectDevice = async (device: NativePrinterDevice) => {
    setConnectingAddress(device.address);
    setTestNotice(null);
    const res = await onConnectNative(device);
    setConnectingAddress(null);
    if (!res.ok && res.error) {
      setTestNotice({ type: 'err', text: res.error });
    }
  };

  const handleReconnect = async () => {
    setConnectingRemembered(true);
    setTestNotice(null);
    const res = await onReconnectRemembered();
    setConnectingRemembered(false);
    if (!res.ok && res.error) setTestNotice({ type: 'err', text: res.error });
  };

  const handleConnectWeb = async () => {
    setTestNotice(null);
    const res = await onConnectWebBluetooth();
    if (!res.ok && res.error) setTestNotice({ type: 'err', text: res.error });
  };

  const handleTestSlip = async () => {
    setTesting(true);
    setTestNotice(null);
    const lines = formatTestSlipLines(settings);
    const res = await onPrintTestSlip(lines);
    setTesting(false);
    if (res.ok) {
      setTestNotice({
        type: 'ok',
        text:
          printer.mode === 'simulated'
            ? 'Test simulator accepted the slip. No physical paper was printed.'
            : 'ESC/POS bytes were sent. Check the printer paper to confirm the physical output.',
      });
    } else {
      setTestNotice({ type: 'err', text: res.error || 'Could not print the test slip.' });
    }
  };

  const handlePaperWidthChange = (width: 58 | 80) => {
    const next = { ...formState, paperWidth: width };
    setFormState(next);
    onUpdateSettings(next);
    if (printer.status === 'connected' && printer.mode === 'simulated') {
      onConnectSimulated(width);
    }
  };

  const handleSaveShopSettings = (e: FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...formState,
      shopName: formState.shopName.trim() || 'Esai Cakes',
      currencySymbol: formState.currencySymbol.trim() || '₹',
      upiId: formState.upiId?.trim() || '',
      taxRate: Math.min(100, Math.max(0, Number(formState.taxRate) || 0)),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-3 pb-24 pt-3 sm:px-6 md:space-y-5 md:pb-10 md:pt-5">
      <div>
        <h1 className="text-[23px] font-extrabold tracking-[-0.02em] text-ink sm:text-[26px]">
          Printer &amp; shop
        </h1>
        <p className="mt-0.5 text-[11px] text-muted sm:text-xs">
          Native Classic/BLE printing in the Android app; Web Bluetooth in supported browsers.
        </p>
      </div>


      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-5">
        <section
          aria-label="Bluetooth thermal printer connection"
          className={`${card} space-y-4 p-4 sm:p-5 lg:col-span-6`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pistachio-tint">
                <Printer className="h-[18px] w-[18px] text-pistachio" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="text-[14px] font-extrabold tracking-[-0.01em] text-ink">
                  Thermal receipt printer
                </h2>
                <p className="mt-0.5 truncate text-[11px] text-muted">
                  {printer.status === 'connected'
                    ? `${printer.deviceName} · ${modeLabel(printer)}`
                    : printer.status === 'connecting'
                      ? 'Connecting…'
                      : rememberedPrinter
                        ? `Remembered: ${rememberedPrinter.deviceName} (not connected)`
                        : 'No printer connected'}
                </p>
              </div>
            </div>
            <span
              className={tonePill(
                printer.status === 'connected'
                  ? 'pistachio'
                  : printer.status === 'error'
                    ? 'berry'
                    : 'neutral',
              )}
            >
              {printer.status === 'connected' ? (
                <>
                  <BluetoothConnected className="h-3 w-3" aria-hidden="true" />
                  Online
                </>
              ) : (
                <>
                  <Bluetooth className="h-3 w-3" aria-hidden="true" />
                  Offline
                </>
              )}
            </span>
          </div>

          {printer.lastError && (
            <div
              role="alert"
              className="rounded-lg border border-berry/25 bg-berry-tint px-3 py-2 text-[11px] font-medium text-berry-deep"
            >
              {printer.lastError}
            </div>
          )}

          {testNotice && (
            <div
              role="status"
              className={`rounded-lg border px-3 py-2 text-[11px] font-medium ${
                testNotice.type === 'ok'
                  ? 'border-pistachio/25 bg-pistachio-tint text-pistachio'
                  : 'border-berry/25 bg-berry-tint text-berry-deep'
              }`}
            >
              {testNotice.text}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <span className={fieldLabel}>Paper width</span>
              <Segmented
                className="w-full"
                ariaLabel="Thermal paper width"
                options={[
                  { value: 58 as const, label: '58 mm' },
                  { value: 80 as const, label: '80 mm' },
                ]}
                value={formState.paperWidth}
                onChange={handlePaperWidthChange}
              />
            </div>
            <div>
              <span className={fieldLabel}>After charge</span>
              <div className="flex h-10 items-center justify-between gap-2 rounded-xl border border-line bg-card px-3">
                <span className="text-[11px] font-semibold text-ink">Auto-print receipt</span>
                <Switch
                  checked={formState.autoPrintOnCheckout}
                  onChange={(checked) => {
                    const next = { ...formState, autoPrintOnCheckout: checked };
                    setFormState(next);
                    onUpdateSettings(next);
                  }}
                  label="Auto-print receipt after saving a bill"
                />
              </div>
            </div>
          </div>

          {printer.status === 'connected' ? (
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button type="button" onClick={handleTestSlip} disabled={testing} className={btnPrimary}>
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  <span>{testing ? 'Sending…' : 'Print test slip'}</span>
                </button>
                <button type="button" onClick={onDisconnectPrinter} className={btnGhost}>
                  <Unplug className="h-4 w-4" aria-hidden="true" />
                  <span>Disconnect</span>
                </button>
              </div>

              <div className="space-y-1.5 border-t border-line pt-3 text-[11px] text-muted">
                <div className="flex justify-between gap-3">
                  <span>Transport</span>
                  <span className="text-right font-semibold text-ink">{modeLabel(printer)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Connection state</span>
                  <span
                    className={`text-right font-semibold ${
                      printer.lastJobState === 'failed' || printer.lastJobState === 'uncertain'
                        ? 'text-berry-deep'
                        : 'text-ink'
                    }`}
                  >
                    {jobLabel(printer)}
                  </span>
                </div>
                {printer.characteristicUuid && (
                  <div className="flex justify-between gap-3">
                    <span>GATT characteristic</span>
                    <span className="truncate font-mono text-[10px] text-ink">
                      {printer.characteristicUuid}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Jobs sent</span>
                  <span className="font-bold tabular-nums text-ink">{printer.printCount}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {rememberedPrinter && (
                <div className="flex items-center justify-between gap-2 rounded-xl border border-line bg-panel/60 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[11.5px] font-bold text-ink">
                      {rememberedPrinter.deviceName}
                    </p>
                    <p className="truncate font-mono text-[9.5px] text-muted">
                      {rememberedPrinter.deviceId} · {rememberedPrinter.mode}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleReconnect}
                      disabled={connectingRemembered}
                      className={`inline-flex h-9 items-center gap-1 rounded-lg bg-berry px-2.5 text-[10.5px] font-bold text-white disabled:opacity-60 ${focus}`}
                    >
                      {connectingRemembered ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      Reconnect
                    </button>
                    <button
                      type="button"
                      onClick={onForgetPrinter}
                      className={`grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:text-ink ${focus}`}
                      aria-label="Forget remembered printer"
                    >
                      <Unplug className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              {native ? (
                <>
                  <button
                    type="button"
                    onClick={handleScan}
                    disabled={scanning || printer.status === 'connecting'}
                    className={`${btnPrimary} w-full`}
                  >
                    {scanning ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Search className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>{scanning ? 'Scanning Bluetooth…' : 'Find Bluetooth printers'}</span>
                  </button>

                  {scanError && (
                    <div className="rounded-lg border border-caramel/30 bg-caramel-tint px-3 py-2 text-[11px] font-medium text-caramel">
                      <p>{scanError.text}</p>
                      {(scanError.code === 'BLUETOOTH_DISABLED' || scanError.code === 'PERMISSION_DENIED') && (
                        <button
                          type="button"
                          onClick={() => void openNativeBluetoothSettings()}
                          className="mt-1 inline-flex items-center gap-1 font-bold underline"
                        >
                          <Settings className="h-3 w-3" aria-hidden="true" />
                          Open Android Bluetooth settings
                        </button>
                      )}
                    </div>
                  )}

                  {devices && devices.length === 0 && (
                    <div className="rounded-lg border border-line bg-panel/60 px-3 py-2 text-[11px] text-muted">
                      No printers found yet. Turn the printer on, pair Classic printers in Android
                      settings, then scan again.
                      <button
                        type="button"
                        onClick={() => void openNativeBluetoothSettings()}
                        className="mt-1 block font-bold text-berry underline"
                      >
                        Open Android Bluetooth settings
                      </button>
                    </div>
                  )}

                  {devices && devices.length > 0 && (
                    <div className="space-y-1.5">
                      {devices.map((device) => (
                        <div
                          key={`${device.address}-${device.transport}`}
                          className="flex items-center justify-between gap-2 rounded-lg border border-line bg-card px-2.5 py-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-[11.5px] font-bold text-ink">
                              {device.name}
                            </p>
                            <p className="truncate font-mono text-[9.5px] text-muted">
                              {device.address}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <span className="rounded bg-panel px-1.5 py-0.5 text-[9px] font-bold uppercase text-muted">
                              {device.bonded ? 'Paired' : 'BLE'}
                            </span>
                            <span className="text-[9px] font-semibold text-muted">
                              {device.transport === 'classic' ? 'Classic' : 'BLE'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleConnectDevice(device)}
                              disabled={connectingAddress === device.address}
                              className={`inline-flex h-8 items-center gap-1 rounded-md bg-berry px-2 text-[10px] font-bold text-white disabled:opacity-60 ${focus}`}
                            >
                              {connectingAddress === device.address && (
                                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                              )}
                              Connect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => void openNativeBluetoothSettings()}
                    className={`${btnGhost} w-full`}
                  >
                    <Settings className="h-4 w-4 text-muted" aria-hidden="true" />
                    <span>Pair a Classic printer in Android settings</span>
                  </button>
                </>
              ) : (
                <div className="rounded-xl border border-line bg-panel/60 px-3 py-2.5 text-[11px] leading-relaxed text-muted">
                  <p className="flex items-center gap-1.5 font-semibold text-ink">
                    <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                    Native printing runs in the Android app
                  </p>
                  <p className="mt-1">
                    Install the Esai Cakes POS APK for Classic SPP and BLE printing. A browser
                    WebView cannot access native Bluetooth.
                  </p>
                </div>
              )}

              {webBle && (
                <button type="button" onClick={handleConnectWeb} className={`${btnGhost} w-full`}>
                  <Bluetooth className="h-4 w-4 text-muted" aria-hidden="true" />
                  <span>Pair using Web Bluetooth (browser)</span>
                </button>
              )}

              {!native && !webBle && (
                <p className="text-[10.5px] leading-relaxed text-muted">
                  No Bluetooth adapter is available in this browser. Use the Android app for real
                  printing, or the clearly-marked test simulator.
                </p>
              )}

              <button
                type="button"
                onClick={() => onConnectSimulated(formState.paperWidth)}
                className={`${btnGhost} w-full border-dashed`}
              >
                <Printer className="h-4 w-4 text-muted" aria-hidden="true" />
                <span>Use test simulator (developer only — no paper)</span>
              </button>
            </div>
          )}

          {lastPrintLog && (
            <div className="space-y-2.5 border-t border-line pt-3">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-bold text-ink">Last output · {lastPrintLog.title}</span>
                <span className="font-mono text-[10px] tabular-nums text-muted">
                  {lastPrintLog.byteCount} bytes
                </span>
              </div>
              <div className="flex justify-center overflow-x-auto rounded-lg bg-cream p-3">
                <pre className="animate-paper-feed border border-line bg-card px-3 py-3 font-mono text-[10.5px] leading-relaxed text-ink shadow-sm">
                  {lastPrintLog.lines.join('\n')}
                </pre>
              </div>
              <p className="break-all font-mono text-[9.5px] text-muted">
                {lastPrintLog.hexPreview}
              </p>
            </div>
          )}
        </section>

        <section aria-label="Shop profile and receipt details" className={`${card} p-4 sm:p-5 lg:col-span-6`}>
          <h2 className="text-[14px] font-extrabold tracking-[-0.01em] text-ink">
            Shop &amp; receipt header
          </h2>
          <p className="mb-4 mt-0.5 text-[11px] text-muted">
            Printed at the top and bottom of every bill. Tamil text is kept in data but may not
            print on ASCII-only ESC/POS printers.
          </p>

          <form onSubmit={handleSaveShopSettings} className="space-y-3">
            <div>
              <label htmlFor="shop-name" className={fieldLabel}>
                Bakery / shop name
              </label>
              <input
                id="shop-name"
                type="text"
                value={formState.shopName}
                onChange={(e) => setFormState((s) => ({ ...s, shopName: e.target.value }))}
                className={input}
              />
            </div>

            <div>
              <label htmlFor="shop-tagline" className={fieldLabel}>
                Tagline
              </label>
              <input
                id="shop-tagline"
                type="text"
                value={formState.tagline}
                onChange={(e) => setFormState((s) => ({ ...s, tagline: e.target.value }))}
                className={input}
              />
            </div>

            <div>
              <label htmlFor="shop-address" className={fieldLabel}>
                Shop address
              </label>
              <input
                id="shop-address"
                type="text"
                value={formState.address}
                onChange={(e) => setFormState((s) => ({ ...s, address: e.target.value }))}
                className={input}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="shop-phone" className={fieldLabel}>
                  Phone number
                </label>
                <input
                  id="shop-phone"
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => setFormState((s) => ({ ...s, phone: e.target.value }))}
                  className={input}
                />
              </div>
              <div>
                <label htmlFor="shop-tax-id" className={fieldLabel}>
                  GSTIN / tax ID
                </label>
                <input
                  id="shop-tax-id"
                  type="text"
                  value={formState.taxId}
                  onChange={(e) => setFormState((s) => ({ ...s, taxId: e.target.value }))}
                  className={input}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="shop-tax-rate" className={fieldLabel}>
                  Tax rate (%)
                </label>
                <input
                  id="shop-tax-rate"
                  type="number"
                  min={0}
                  max={100}
                  step="0.5"
                  value={formState.taxRate}
                  onChange={(e) =>
                    setFormState((s) => ({
                      ...s,
                      taxRate: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  className={`${input} tabular-nums`}
                />
              </div>
              <div>
                <label htmlFor="shop-currency" className={fieldLabel}>
                  Currency symbol
                </label>
                <input
                  id="shop-currency"
                  type="text"
                  maxLength={4}
                  value={formState.currencySymbol}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, currencySymbol: e.target.value }))
                  }
                  className={input}
                />
              </div>
            </div>

            <div>
              <label htmlFor="shop-upi" className={fieldLabel}>
                UPI ID (for bill Pay QR)
              </label>
              <input
                id="shop-upi"
                type="text"
                placeholder="e.g. esaicakes@okaxis"
                value={formState.upiId ?? ''}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, upiId: e.target.value }))
                }
                className={input}
              />
            </div>

            <div>
              <label htmlFor="shop-footer" className={fieldLabel}>
                Receipt footer note
              </label>
              <input
                id="shop-footer"
                type="text"
                value={formState.receiptFooter}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, receiptFooter: e.target.value }))
                }
                className={input}
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              {savedNotice ? (
                <span
                  role="status"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-pistachio"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Saved</span>
                </span>
              ) : (
                <span />
              )}

              <button type="submit" className={`${btnPrimary} px-5`}>
                Save shop details
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
