import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { connectWebBluetoothPrinter } from '../services/bluetoothPrinter';
import {
  ensureNativeBluetoothReady,
  isNativePrinterAvailable,
  scanNativePrinters,
  type NativePrinterDevice,
} from '../services/nativePrinter';
import {
  connectNativeHandle,
  createSimulatedHandle,
  disconnectActivePrinter,
  setActivePrinterHandle,
  submitPrintJob,
} from '../services/printerManager';
import type {
  ActiveBillState,
  BillOrder,
  Fulfilment,
  FulfilmentType,
  OrderStatus,
  PaymentRecord,
  BluetoothPrinterState,
  CakeItem,
  CartItem,
  PaymentMethod,
  PrintMode,
  RememberedPrinter,
  ShopSettings,
} from '../types/pos';
import { calculateBillTotals, formatCurrency, generateBillNumber } from '../utils/billing';
import {
  buildOrderWhatsAppMessage,
  formatDueLabel,
  orderAdvance,
  orderBalance,
  orderStatus,
  validateFulfilment,
  whatsappUrl,
} from '../utils/orders';
import {
  encodeEscPosReceipt,
  encodeKitchenTicket,
  encodeTestSlip,
  formatBytesHexPreview,
  formatKitchenTicketLines,
  formatReceiptLines,
  getReceiptEncodingWarnings,
} from '../utils/escpos';
import type { PriceBreakdown } from '../utils/pricing';
import { toCartItem } from '../utils/pricing';
import {
  applyBackupToStorage,
  backupFilename,
  billsToCsv,
  clearPreRestore,
  createBackupPayload,
  deliverTextFile,
  listLegacyBackups,
  readAutoBackup,
  readLastExport,
  readPreRestore,
  recordExport,
  serializeBackup,
  shouldAutoBackup,
  storageUsageBytes,
  writeAutoBackup,
  type BackupPayload,
  type DeliveryResult,
  type RestoreResult,
} from '../utils/backup';
import {
  clearActiveBill,
  createMemoryStorage,
  getBrowserStorage,
  loadOrMigrateState,
  readPaymentPreference,
  saveActiveBill,
  saveCakes,
  saveOrders,
  savePaymentPreference,
  saveRememberedPrinter,
  saveSettings,
  type StorageLike,
  type StorageMeta,
} from '../utils/storage';

export interface LastPrintLog {
  id: string;
  timestamp: string;
  title: string;
  mode: PrintMode;
  byteCount: number;
  hexPreview: string;
  lines: string[];
}

export interface PrintOutcome {
  ok: boolean;
  uncertain: boolean;
  mode?: PrintMode;
  error?: string;
  warnings: string[];
}

export type CheckoutStatus =
  | 'printed'
  | 'saved'
  | 'print-failed'
  | 'print-uncertain'
  | 'save-failed'
  | 'busy'
  | 'empty';

export interface CheckoutResult {
  status: CheckoutStatus;
  order?: BillOrder;
  error?: string;
}

export interface CheckoutNotice {
  status: Exclude<CheckoutStatus, 'busy' | 'empty' | 'save-failed'> | 'save-failed';
  order?: BillOrder;
  title: string;
  detail: string;
  error?: string;
}

export interface BackupInfo {
  autoBackupAt: string | null;
  preRestoreAt: string | null;
  lastExportAt: string | null;
  usageBytes: number;
  legacyBackups: Array<{ key: string; bytes: number }>;
  cakeCount: number;
  orderCount: number;
  realOrderCount: number;
}

export interface BackupNotice {
  kind: 'exported' | 'restored' | 'undo' | 'error';
  text: string;
}

function createPrinterState(remembered: RememberedPrinter | null): BluetoothPrinterState {
  if (remembered) {
    return {
      status: 'disconnected',
      mode: remembered.mode,
      transport: remembered.transport,
      deviceName: remembered.deviceName,
      deviceId: remembered.deviceId,
      serviceUuid: null,
      characteristicUuid: null,
      lastError: null,
      lastPrintedAt: null,
      printCount: 0,
      lastJobState: 'idle',
      lastJobError: null,
    };
  }
  return {
    status: 'disconnected',
    mode: 'none',
    transport: 'none',
    deviceName: null,
    deviceId: null,
    serviceUuid: null,
    characteristicUuid: null,
    lastError: null,
    lastPrintedAt: null,
    printCount: 0,
    lastJobState: 'idle',
    lastJobError: null,
  };
}

function cloneItems(items: CartItem[]): CartItem[] {
  return items.map((item) => ({ ...item }));
}

export function usePosStore() {
  const [storage] = useState<StorageLike>(
    () => getBrowserStorage() ?? createMemoryStorage(),
  );
  const [initial] = useState(() => loadOrMigrateState(storage));

  const [cakes, setCakes] = useState<CakeItem[]>(initial.cakes);
  const [orders, setOrders] = useState<BillOrder[]>(initial.orders);
  const [settings, setSettings] = useState<ShopSettings>(initial.settings);
  const [catalogMeta] = useState<StorageMeta>(initial.meta);
  const [migrationReport] = useState(initial.report);

  const [cart, setCart] = useState<CartItem[]>(initial.activeBill?.cart ?? []);
  const [discountAmount, setDiscountAmountState] = useState<number>(
    initial.activeBill?.discountAmount ?? 0,
  );
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod>(
    initial.activeBill?.paymentMethod ?? readPaymentPreference(storage),
  );
  const [customerName, setCustomerName] = useState(initial.activeBill?.customerName ?? '');
  const [customerPhone, setCustomerPhone] = useState(initial.activeBill?.customerPhone ?? '');
  const [orderNote, setOrderNote] = useState(initial.activeBill?.orderNote ?? '');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>(
    initial.activeBill?.scheduleMode ?? 'now',
  );
  const [fulfilmentType, setFulfilmentType] = useState<FulfilmentType>(
    initial.activeBill?.fulfilmentType ?? 'pickup',
  );
  const [fulfilmentDate, setFulfilmentDate] = useState(initial.activeBill?.fulfilmentDate ?? '');
  const [fulfilmentTime, setFulfilmentTime] = useState(initial.activeBill?.fulfilmentTime ?? '');
  const [deliveryAddress, setDeliveryAddress] = useState(
    initial.activeBill?.deliveryAddress ?? '',
  );
  const [advanceAmount, setAdvanceAmount] = useState(initial.activeBill?.advanceAmount ?? 0);
  const [orderNotice, setOrderNotice] = useState<{
    kind: 'status' | 'settled' | 'cancelled' | 'undo' | 'error';
    text: string;
  } | null>(null);
  const lastCancelRef = useRef<{ id: string; previousStatus: OrderStatus } | null>(null);

  const [rememberedPrinter, setRememberedPrinter] = useState<RememberedPrinter | null>(
    initial.rememberedPrinter,
  );
  const [printer, setPrinter] = useState<BluetoothPrinterState>(() =>
    createPrinterState(initial.rememberedPrinter),
  );
  const [lastPrintLog, setLastPrintLog] = useState<LastPrintLog | null>(null);
  const [storageError, setStorageError] = useState<string | null>(() =>
    getBrowserStorage()
      ? null
      : 'Device storage is unavailable in this browser. Bills will not survive a reload.',
  );
  const [checkoutNotice, setCheckoutNotice] = useState<CheckoutNotice | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [backupRevision, setBackupRevision] = useState(0);
  const [backupNotice, setBackupNotice] = useState<BackupNotice | null>(null);

  const ordersRef = useRef(orders);
  ordersRef.current = orders;
  const checkoutLockRef = useRef(false);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const printerRef = useRef(printer);
  printerRef.current = printer;
  const cakesRef = useRef(cakes);
  cakesRef.current = cakes;

  const refreshBackupInfo = useCallback(() => setBackupRevision((v) => v + 1), []);

  const backupInfo = useMemo<BackupInfo>(() => {
    void backupRevision;
    const auto = readAutoBackup(storage);
    const pre = readPreRestore(storage);
    return {
      autoBackupAt: auto?.exportedAt ?? null,
      preRestoreAt: pre?.exportedAt ?? null,
      lastExportAt: readLastExport(storage),
      usageBytes: storageUsageBytes(storage),
      legacyBackups: listLegacyBackups(storage),
      cakeCount: cakes.length,
      orderCount: orders.length,
      realOrderCount: orders.filter((o) => !o.isDemo).length,
    };
  }, [storage, cakes, orders, backupRevision]);

  const currentActiveBill = useCallback((): ActiveBillState | null => {
    const empty =
      cart.length === 0 &&
      discountAmount === 0 &&
      !customerName.trim() &&
      !customerPhone.trim() &&
      !orderNote.trim() &&
      scheduleMode === 'now' &&
      !fulfilmentDate &&
      !deliveryAddress.trim() &&
      advanceAmount === 0;
    if (empty) return null;
    return {
      cart,
      discountAmount,
      paymentMethod,
      customerName,
      customerPhone,
      orderNote,
      updatedAt: new Date().toISOString(),
      scheduleMode,
      fulfilmentType,
      fulfilmentDate,
      fulfilmentTime,
      deliveryAddress,
      advanceAmount,
    };
  }, [
    cart,
    discountAmount,
    paymentMethod,
    customerName,
    customerPhone,
    orderNote,
    scheduleMode,
    fulfilmentType,
    fulfilmentDate,
    fulfilmentTime,
    deliveryAddress,
    advanceAmount,
  ]);

  const buildBackup = useCallback(
    (): BackupPayload =>
      createBackupPayload({
        cakes,
        orders,
        settings,
        activeBill: currentActiveBill(),
      }),
    [cakes, orders, settings, currentActiveBill],
  );

  const applyRestoredData = useCallback(
    (next: {
      cakes: CakeItem[];
      orders: BillOrder[];
      settings: ShopSettings;
      activeBill: ActiveBillState | null;
    }) => {
      setCakes(next.cakes);
      setOrders(next.orders);
      ordersRef.current = next.orders;
      setSettings(next.settings);
      const ab = next.activeBill;
      setCart(ab?.cart ?? []);
      setDiscountAmountState(ab?.discountAmount ?? 0);
      setPaymentMethodState(ab?.paymentMethod ?? readPaymentPreference(storage));
      setCustomerName(ab?.customerName ?? '');
      setCustomerPhone(ab?.customerPhone ?? '');
      setOrderNote(ab?.orderNote ?? '');
    },
    [storage],
  );

  const exportPayload = useCallback(
    async (payload: BackupPayload, prefix: string): Promise<DeliveryResult> => {
      const result = await deliverTextFile(
        `${backupFilename(prefix)}.json`,
        serializeBackup(payload),
        'application/json',
      );
      if (result.ok) {
        recordExport(storage);
        refreshBackupInfo();
        setBackupNotice({
          kind: 'exported',
          text:
            result.method === 'share'
              ? 'Backup handed to the share sheet. Save it to Files, Drive, or WhatsApp.'
              : result.method === 'clipboard'
                ? 'Backup copied to the clipboard. Paste it into a safe note or file.'
                : 'Backup file downloaded. Keep a copy off this device.',
        });
      } else {
        setBackupNotice({ kind: 'error', text: result.error ?? 'Export failed.' });
      }
      return result;
    },
    [refreshBackupInfo, storage],
  );

  const exportBackupJson = useCallback(
    (): Promise<DeliveryResult> => exportPayload(buildBackup(), 'esai-cakes-backup'),
    [buildBackup, exportPayload],
  );

  const getAutoBackupPayload = useCallback(() => readAutoBackup(storage), [storage]);
  const getPreRestorePayload = useCallback(() => readPreRestore(storage), [storage]);

  const exportLegacyBackup = useCallback(
    async (key: string): Promise<DeliveryResult> => {
      let text: string | null = null;
      try {
        text = storage.getItem(key);
      } catch {
        text = null;
      }
      if (!text) {
        const message = 'That safety copy is no longer on this device.';
        setBackupNotice({ kind: 'error', text: message });
        return { ok: false, error: message };
      }
      const result = await deliverTextFile(`${key}.json`, text, 'application/json');
      if (!result.ok) setBackupNotice({ kind: 'error', text: result.error ?? 'Export failed.' });
      return result;
    },
    [storage],
  );

  const exportBillsCsv = useCallback(async (): Promise<DeliveryResult> => {
    const result = await deliverTextFile(
      `${backupFilename('esai-cakes-bills')}.csv`,
      billsToCsv(orders),
      'text/csv',
    );
    if (result.ok) {
      recordExport(storage);
      refreshBackupInfo();
      setBackupNotice({
        kind: 'exported',
        text: `Bills spreadsheet (${orders.length} rows) ${
          result.method === 'share' ? 'shared' : result.method === 'clipboard' ? 'copied' : 'downloaded'
        }.`,
      });
    } else {
      setBackupNotice({ kind: 'error', text: result.error ?? 'CSV export failed.' });
    }
    return result;
  }, [orders, refreshBackupInfo, storage]);

  const copyBackupToClipboard = useCallback(async (): Promise<DeliveryResult> => {
    const text = serializeBackup(buildBackup());
    try {
      await navigator.clipboard.writeText(text);
      recordExport(storage);
      refreshBackupInfo();
      setBackupNotice({ kind: 'exported', text: 'Full backup copied to the clipboard.' });
      return { ok: true, method: 'clipboard' };
    } catch {
      const message = 'Clipboard is not available here. Use Download or Share instead.';
      setBackupNotice({ kind: 'error', text: message });
      return { ok: false, error: message };
    }
  }, [buildBackup, refreshBackupInfo, storage]);

  const restoreBackup = useCallback(
    (payload: BackupPayload, mode: 'replace' | 'merge'): RestoreResult => {
      const result = applyBackupToStorage(storage, payload, mode);
      if (!result.ok || !result.next || !result.summary) {
        setBackupNotice({ kind: 'error', text: result.error ?? 'Restore failed.' });
        return result;
      }
      applyRestoredData(result.next);
      refreshBackupInfo();
      setBackupNotice({
        kind: 'restored',
        text:
          mode === 'replace'
            ? `Restored ${result.summary.orders} bills and ${result.summary.cakes} cakes from ${new Date(
                payload.exportedAt,
              ).toLocaleString('en-IN')}. Undo is available below.`
            : `Merged ${result.summary.addedOrders} new bill(s) and ${result.summary.addedCakes} new cake(s). Existing local data was kept.`,
      });
      return result;
    },
    [applyRestoredData, refreshBackupInfo, storage],
  );

  const undoRestore = useCallback((): RestoreResult => {
    const pre = readPreRestore(storage);
    if (!pre) {
      const message = 'There is no pre-restore snapshot to undo.';
      setBackupNotice({ kind: 'error', text: message });
      return { ok: false, error: message };
    }
    const result = applyBackupToStorage(storage, pre, 'replace', { writeSafety: false });
    if (!result.ok || !result.next) {
      setBackupNotice({ kind: 'error', text: result.error ?? 'Undo failed.' });
      return result;
    }
    applyRestoredData(result.next);
    clearPreRestore(storage);
    refreshBackupInfo();
    setBackupNotice({
      kind: 'undo',
      text: 'Restore undone. Your data is exactly as it was before the restore.',
    });
    return result;
  }, [applyRestoredData, refreshBackupInfo, storage]);

  const dismissBackupNotice = useCallback(() => setBackupNotice(null), []);

  const runAutoBackupIfDue = useCallback(
    (nextOrders: BillOrder[]) => {
      if (!shouldAutoBackup(storage)) return;
      const payload = createBackupPayload({
        cakes: cakesRef.current,
        orders: nextOrders,
        settings: settingsRef.current,
        activeBill: null,
      });
      if (!writeAutoBackup(storage, payload)) {
        setStorageError(
          'The automatic daily backup could not be saved (device storage is full). Download a manual backup from the Backup tab.',
        );
      }
      refreshBackupInfo();
    },
    [refreshBackupInfo, storage],
  );

  const persistOrders = useCallback(
    (next: BillOrder[]): { ok: boolean; error?: string } => {
      const result = saveOrders(storage, next);
      if (!result.ok) {
        const message = `Could not save bills to device storage (${result.error ?? 'unknown error'}). The bill was not completed.`;
        setStorageError(message);
        return { ok: false, error: message };
      }
      return { ok: true };
    },
    [storage],
  );

  // Catalog write-behind: local edits are authoritative after the v2 import.
  useEffect(() => {
    const result = saveCakes(storage, cakes);
    if (!result.ok) {
      setStorageError(`Menu changes could not be saved (${result.error ?? 'unknown error'}).`);
    }
  }, [cakes, storage]);

  useEffect(() => {
    const result = saveSettings(storage, settings);
    if (!result.ok) {
      setStorageError(`Shop settings could not be saved (${result.error ?? 'unknown error'}).`);
    }
  }, [settings, storage]);

  // Persist the active bill so an app kill or Android Back never loses work.
  useEffect(() => {
    const empty =
      cart.length === 0 &&
      discountAmount === 0 &&
      !customerName.trim() &&
      !customerPhone.trim() &&
      !orderNote.trim() &&
      scheduleMode === 'now' &&
      !fulfilmentDate &&
      !deliveryAddress.trim() &&
      advanceAmount === 0;
    if (empty) {
      clearActiveBill(storage);
      return;
    }
    const active: ActiveBillState = {
      cart,
      discountAmount,
      paymentMethod,
      customerName,
      customerPhone,
      orderNote,
      updatedAt: new Date().toISOString(),
      scheduleMode,
      fulfilmentType,
      fulfilmentDate,
      fulfilmentTime,
      deliveryAddress,
      advanceAmount,
    };
    const result = saveActiveBill(storage, active);
    if (!result.ok) {
      setStorageError(`Active bill could not be saved (${result.error ?? 'unknown error'}).`);
    }
  }, [
    cart,
    discountAmount,
    paymentMethod,
    customerName,
    customerPhone,
    orderNote,
    scheduleMode,
    fulfilmentType,
    fulfilmentDate,
    fulfilmentTime,
    deliveryAddress,
    advanceAmount,
    storage,
  ]);

  const setPaymentMethod = useCallback(
    (method: PaymentMethod) => {
      setPaymentMethodState(method);
      savePaymentPreference(storage, method);
    },
    [storage],
  );

  const setDiscountAmount = useCallback((value: number) => {
    setDiscountAmountState(Number.isFinite(value) && value >= 0 ? value : 0);
  }, []);

  const addConfiguredItem = useCallback(
    (cake: CakeItem, pricing: PriceBreakdown, cakeMessage?: string, notes?: string) => {
      if (!cake.inStock) return;
      const item = toCartItem(cake, pricing, cakeMessage, notes);
      setCart((prev) => {
        const existing = prev.find((line) => line.key === item.key);
        if (existing) {
          return prev.map((line) =>
            line.key === item.key
              ? { ...line, quantity: line.quantity + item.quantity }
              : line,
          );
        }
        return [...prev, item];
      });
    },
    [],
  );

  const updateConfiguredItem = useCallback(
    (oldKey: string, cake: CakeItem, pricing: PriceBreakdown, cakeMessage?: string, notes?: string) => {
      const replacement = toCartItem(cake, pricing, cakeMessage, notes);
      setCart((prev) => {
        const old = prev.find((line) => line.key === oldKey);
        if (!old) return prev;
        const withQuantity = { ...replacement, quantity: old.quantity };
        const rest = prev.filter((line) => line.key !== oldKey);
        const mergeIndex = rest.findIndex((line) => line.key === withQuantity.key);
        if (mergeIndex >= 0) {
          return rest.map((line, index) =>
            index === mergeIndex
              ? { ...line, quantity: line.quantity + withQuantity.quantity }
              : line,
          );
        }
        return [...rest, withQuantity];
      });
    },
    [],
  );

  const updateCartItemQty = useCallback((key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeCartItem = useCallback((key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscountAmountState(0);
    setCustomerName('');
    setCustomerPhone('');
    setOrderNote('');
    setScheduleMode('now');
    setFulfilmentType('pickup');
    setFulfilmentDate('');
    setFulfilmentTime('');
    setDeliveryAddress('');
    setAdvanceAmount(0);
    clearActiveBill(storage);
  }, [storage]);

  const saveCake = useCallback(
    (cakeData: Omit<CakeItem, 'id' | 'createdAt'>, editId?: string) => {
      if (editId) {
        setCakes((prev) =>
          prev.map((c) => (c.id === editId ? { ...c, ...cakeData, id: c.id, createdAt: c.createdAt } : c)),
        );
      } else {
        const newCake: CakeItem = {
          ...cakeData,
          id: `cake-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        setCakes((prev) => [newCake, ...prev]);
      }
    },
    [],
  );

  const toggleCakeStock = useCallback((cakeId: string) => {
    setCakes((prev) =>
      prev.map((c) => (c.id === cakeId ? { ...c, inStock: !c.inStock } : c)),
    );
  }, []);

  const deleteCake = useCallback((cakeId: string) => {
    setCakes((prev) => prev.filter((c) => c.id !== cakeId));
    setCart((prev) => prev.filter((item) => item.cakeId !== cakeId));
  }, []);

  const updateSettings = useCallback((next: ShopSettings) => {
    setSettings(next);
  }, []);

  const rememberPrinter = useCallback((remembered: RememberedPrinter | null) => {
    setRememberedPrinter(remembered);
    saveRememberedPrinter(storage, remembered);
  }, [storage]);

  const markDisconnected = useCallback(
    (message?: string) => {
      setActivePrinterHandle(null);
      setPrinter((prev) => ({
        ...prev,
        status: 'disconnected',
        serviceUuid: null,
        characteristicUuid: null,
        lastError: message ?? null,
        lastJobState: 'idle',
      }));
    },
    [],
  );

  const connectWebBluetooth = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    setPrinter((prev) => ({ ...prev, status: 'connecting', lastError: null }));
    try {
      disconnectActivePrinter();
      const handle = await connectWebBluetoothPrinter(() => {
        markDisconnected('Bluetooth printer disconnected.');
      });
      setActivePrinterHandle(handle);
      setPrinter((prev) => ({
        ...prev,
        status: 'connected',
        mode: 'web-bluetooth',
        transport: 'web-ble',
        deviceName: handle.deviceName,
        deviceId: handle.deviceId,
        serviceUuid: handle.serviceUuid ?? null,
        characteristicUuid: handle.characteristicUuid ?? null,
        lastError: null,
        lastJobState: 'idle',
      }));
      rememberPrinter({
        mode: 'web-bluetooth',
        transport: 'web-ble',
        deviceId: handle.deviceId,
        deviceName: handle.deviceName,
      });
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to connect Bluetooth printer.';
      setPrinter((prev) => ({
        ...prev,
        status: 'error',
        mode: 'none',
        lastError: message,
        lastJobState: 'failed',
        lastJobError: message,
      }));
      return { ok: false, error: message };
    }
  }, [markDisconnected, rememberPrinter]);

  const scanNative = useCallback(async (): Promise<{
    ok: boolean;
    devices?: NativePrinterDevice[];
    error?: string;
    code?: string;
  }> => {
    if (!isNativePrinterAvailable()) {
      return {
        ok: false,
        code: 'UNSUPPORTED',
        error: 'Native printing is available in the Android app. In a browser, use Web Bluetooth if supported.',
      };
    }
    const ready = await ensureNativeBluetoothReady();
    if (!ready.ok) return { ok: false, error: ready.error, code: ready.code };
    try {
      const devices = await scanNativePrinters(8000);
      return { ok: true, devices };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Bluetooth scan failed.',
      };
    }
  }, []);

  const connectNativeDevice = useCallback(
    async (device: NativePrinterDevice): Promise<{ ok: boolean; error?: string }> => {
      setPrinter((prev) => ({ ...prev, status: 'connecting', lastError: null }));
      try {
        const ready = await ensureNativeBluetoothReady();
        if (!ready.ok) {
          throw new Error(ready.error || 'Bluetooth is not ready.');
        }
        disconnectActivePrinter();
        const handle = await connectNativeHandle(device);
        setPrinter((prev) => ({
          ...prev,
          status: 'connected',
          mode: handle.mode,
          transport: handle.mode === 'native-classic' ? 'classic' : 'ble',
          deviceName: handle.deviceName,
          deviceId: handle.deviceId,
          serviceUuid: handle.serviceUuid ?? null,
          characteristicUuid: handle.characteristicUuid ?? null,
          lastError: null,
          lastJobState: 'idle',
        }));
        rememberPrinter({
          mode: handle.mode,
          transport: handle.mode === 'native-classic' ? 'classic' : 'ble',
          deviceId: handle.deviceId,
          deviceName: handle.deviceName,
        });
        return { ok: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Could not connect to the Bluetooth printer.';
        setPrinter((prev) => ({
          ...prev,
          status: 'error',
          lastError: message,
          lastJobState: 'failed',
          lastJobError: message,
        }));
        return { ok: false, error: message };
      }
    },
    [rememberPrinter],
  );

  const reconnectRemembered = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    if (!rememberedPrinter) {
      return { ok: false, error: 'No printer has been remembered yet.' };
    }
    if (rememberedPrinter.mode === 'web-bluetooth') {
      return connectWebBluetooth();
    }
    return connectNativeDevice({
      address: rememberedPrinter.deviceId,
      name: rememberedPrinter.deviceName,
      bonded: true,
      transport: rememberedPrinter.mode === 'native-classic' ? 'classic' : 'ble',
    });
  }, [connectNativeDevice, connectWebBluetooth, rememberedPrinter]);

  const connectSimulatedPrinter = useCallback(
    (paperWidth?: 58 | 80) => {
      disconnectActivePrinter();
      const width = paperWidth ?? settingsRef.current.paperWidth;
      const handle = createSimulatedHandle(width);
      setPrinter((prev) => ({
        ...prev,
        status: 'connected',
        mode: 'simulated',
        transport: 'none',
        deviceName: handle.deviceName,
        deviceId: handle.deviceId,
        serviceUuid: null,
        characteristicUuid: null,
        lastError: null,
        lastJobState: 'idle',
        lastJobError: null,
      }));
      // Simulated printing is deliberately not remembered across launches.
    },
    [],
  );

  const disconnectPrinter = useCallback(() => {
    disconnectActivePrinter();
    setPrinter((prev) => ({
      ...prev,
      status: 'disconnected',
      mode: 'none',
      transport: 'none',
      serviceUuid: null,
      characteristicUuid: null,
      lastError: null,
      lastJobState: 'idle',
      lastJobError: null,
    }));
  }, []);

  const forgetRememberedPrinter = useCallback(() => {
    disconnectPrinter();
    rememberPrinter(null);
    setPrinter(createPrinterState(null));
  }, [disconnectPrinter, rememberPrinter]);

  const updateOrderPrintState = useCallback(
    (orderId: string, patch: Partial<BillOrder>): BillOrder | null => {
      let updated: BillOrder | null = null;
      const next = ordersRef.current.map((order) => {
        if (order.id !== orderId) return order;
        updated = { ...order, ...patch };
        return updated;
      });
      ordersRef.current = next;
      setOrders(next);
      persistOrders(next);
      return updated;
    },
    [persistOrders],
  );

  const submitOrderToPrinter = useCallback(
    async (order: BillOrder): Promise<PrintOutcome> => {
      const activeSettings = settingsRef.current;
      const payload = encodeEscPosReceipt(order, activeSettings);
      const warnings = getReceiptEncodingWarnings(order, activeSettings);
      const attemptedAt = new Date().toISOString();

      setPrinter((prev) => ({
        ...prev,
        lastJobState: 'sending',
        lastJobError: null,
      }));

      const { mode, outcome } = await submitPrintJob(payload);
      const printMode: PrintMode | undefined =
        mode === 'simulated' ? 'simulated' : mode ? 'bluetooth' : undefined;
      const sentAt = outcome.ok ? new Date().toISOString() : undefined;

      if (outcome.ok) {
        updateOrderPrintState(order.id, {
          printedAt: sentAt,
          printMode,
          printState: 'sent',
          printError: undefined,
          lastPrintAttemptAt: sentAt,
        });
        setPrinter((prev) => ({
          ...prev,
          status: 'connected',
          lastPrintedAt: sentAt ?? null,
          printCount: prev.printCount + 1,
          lastJobState: 'sent',
          lastJobError: null,
        }));
        setLastPrintLog({
          id: `log-${Date.now()}`,
          timestamp: sentAt ?? attemptedAt,
          title: `Bill ${order.billNumber}`,
          mode: printMode ?? 'bluetooth',
          byteCount: payload.length,
          hexPreview: formatBytesHexPreview(payload),
          lines: formatReceiptLines(order, activeSettings, true),
        });
      } else {
        updateOrderPrintState(order.id, {
          printState: outcome.uncertain ? 'uncertain' : 'failed',
          printError: outcome.error ?? 'Printing failed.',
          lastPrintAttemptAt: attemptedAt,
        });
        setPrinter((prev) => ({
          ...prev,
          lastJobState: outcome.uncertain ? 'uncertain' : 'failed',
          lastJobError: outcome.error ?? 'Printing failed.',
          lastError: outcome.error ?? prev.lastError,
        }));
      }

      return {
        ok: outcome.ok,
        uncertain: outcome.uncertain,
        mode: printMode,
        error: outcome.error,
        warnings,
      };
    },
    [updateOrderPrintState],
  );

  const printOrder = useCallback(
    async (order: BillOrder): Promise<PrintOutcome> => {
      return submitOrderToPrinter(order);
    },
    [submitOrderToPrinter],
  );

  const printTestSlip = useCallback(
    async (testLines: string[]): Promise<{ ok: boolean; error?: string }> => {
      const activeSettings = settingsRef.current;
      const payload = encodeTestSlip(activeSettings);
      setPrinter((prev) => ({ ...prev, lastJobState: 'sending', lastJobError: null }));
      const { mode, outcome } = await submitPrintJob(payload);
      const printMode: PrintMode | undefined =
        mode === 'simulated' ? 'simulated' : mode ? 'bluetooth' : undefined;
      if (outcome.ok) {
        const now = new Date().toISOString();
        setPrinter((prev) => ({
          ...prev,
          lastPrintedAt: now,
          printCount: prev.printCount + 1,
          lastJobState: 'sent',
          lastJobError: null,
          lastError: null,
        }));
        setLastPrintLog({
          id: `log-${Date.now()}`,
          timestamp: now,
          title: 'Bluetooth Test Slip',
          mode: printMode ?? 'bluetooth',
          byteCount: payload.length,
          hexPreview: formatBytesHexPreview(payload),
          lines: testLines,
        });
        return { ok: true };
      }
      setPrinter((prev) => ({
        ...prev,
        lastJobState: outcome.uncertain ? 'uncertain' : 'failed',
        lastJobError: outcome.error ?? 'Test print failed.',
      }));
      return { ok: false, error: outcome.error };
    },
    [],
  );

  const checkoutAndPrint = useCallback(async (): Promise<CheckoutResult> => {
    // Synchronous lock: not just a delayed disabled attribute.
    if (checkoutLockRef.current) {
      return { status: 'busy' };
    }
    if (cart.length === 0) {
      return { status: 'empty' };
    }

    checkoutLockRef.current = true;
    setIsCheckingOut(true);
    setCheckoutNotice(null);

    try {
      const activeSettings = settingsRef.current;
      const now = new Date();
      const items = cloneItems(cart);
      const calc = calculateBillTotals(items, discountAmount, activeSettings.taxRate);
      const willAutoPrint =
        printerRef.current.status === 'connected' && activeSettings.autoPrintOnCheckout;

      const scheduling = scheduleMode === 'schedule';
      let fulfilment: Fulfilment | null = null;
      if (scheduling) {
        const validation = validateFulfilment({
          type: fulfilmentType,
          date: fulfilmentDate,
          time: fulfilmentTime,
          address: deliveryAddress,
          customerName,
          customerPhone,
        });
        if (!validation.valid) {
          const message = validation.errors.join(' ');
          setCheckoutNotice({
            status: 'save-failed',
            title: 'Order not saved',
            detail: message,
          });
          return { status: 'save-failed', error: message };
        }
        fulfilment = {
          type: fulfilmentType,
          date: fulfilmentDate,
          time: fulfilmentTime,
          address: fulfilmentType === 'delivery' ? deliveryAddress.trim() : undefined,
        };
      }
      const advance = scheduling
        ? Math.min(Math.max(0, advanceAmount), calc.total)
        : calc.total;
      const balance = Math.max(0, calc.total - advance);
      const payments: PaymentRecord[] =
        advance > 0
          ? [
              {
                amount: advance,
                method: paymentMethod,
                at: now.toISOString(),
                kind: scheduling ? 'advance' : 'full',
              },
            ]
          : [];

      const newOrder: BillOrder = {
        id: `ord-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
        billNumber: generateBillNumber(ordersRef.current, now),
        createdAt: now.toISOString(),
        items,
        subtotal: calc.subtotal,
        discountAmount: calc.discountAmount,
        taxRate: activeSettings.taxRate,
        taxAmount: calc.taxAmount,
        total: calc.total,
        paymentMethod,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        orderNote: orderNote.trim() || undefined,
        printState: willAutoPrint ? 'pending' : undefined,
        status: scheduling ? 'scheduled' : 'completed',
        fulfilment,
        payments,
        advancePaid: advance,
        balanceDue: balance,
        version: 2,
      };

      const nextOrders = [newOrder, ...ordersRef.current];
      // Durable save before any bytes are sent.
      const saved = persistOrders(nextOrders);
      if (!saved.ok) {
        setCheckoutNotice({
          status: 'save-failed',
          title: 'Bill not saved',
          detail:
            'Nothing was cleared and nothing was printed. Free up device storage, then try again.',
          error: saved.error,
        });
        return { status: 'save-failed', error: saved.error ?? 'Could not save the bill.' };
      }

      ordersRef.current = nextOrders;
      setOrders(nextOrders);
      runAutoBackupIfDue(nextOrders);

      // Only the finalized snapshot is cleared. Items added while the receipt is
      // in flight belong to the next bill and stay untouched.
      setCart([]);
      setDiscountAmountState(0);
      setCustomerName('');
      setCustomerPhone('');
      setOrderNote('');
      setScheduleMode('now');
      setFulfilmentType('pickup');
      setFulfilmentDate('');
      setFulfilmentTime('');
      setDeliveryAddress('');
      setAdvanceAmount(0);
      clearActiveBill(storage);
      savePaymentPreference(storage, paymentMethod);

      if (willAutoPrint) {
        const outcome = await submitOrderToPrinter(newOrder);
        const refreshed = ordersRef.current.find((o) => o.id === newOrder.id) ?? newOrder;
        if (outcome.ok) {
          const isSimulated = printerRef.current.mode === 'simulated';
          setCheckoutNotice({
            status: 'printed',
            order: refreshed,
            title: scheduling
              ? `Order ${newOrder.billNumber} scheduled`
              : `Bill ${newOrder.billNumber} saved`,
            detail: isSimulated
              ? 'Test simulator only — no physical paper was printed.'
              : `ESC/POS data was sent to ${
                  printerRef.current.deviceName ?? 'the printer'
                }. Check the paper to confirm output.`,
          });
          return { status: 'printed', order: refreshed };
        }
        setCheckoutNotice({
          status: outcome.uncertain ? 'print-uncertain' : 'print-failed',
          order: refreshed,
          title: `Bill ${newOrder.billNumber} saved — printing ${
            outcome.uncertain ? 'may be incomplete' : 'failed'
          }`,
          detail: outcome.uncertain
            ? 'Part of the receipt may have printed. Check the paper before reprinting so you do not print a duplicate.'
            : 'The sale is saved once. Reconnect the printer and retry this same bill; it will not be counted twice.',
          error: outcome.error,
        });
        return {
          status: outcome.uncertain ? 'print-uncertain' : 'print-failed',
          order: refreshed,
          error: outcome.error,
        };
      }

      setCheckoutNotice({
        status: 'saved',
        order: newOrder,
        title: scheduling
          ? `Order ${newOrder.billNumber} scheduled`
          : `Bill ${newOrder.billNumber} saved`,
        detail: scheduling
          ? `${formatDueLabel(newOrder)} · ${
              fulfilment?.type === 'delivery' ? 'Delivery' : 'Pickup'
            } · advance ${formatCurrency(advance, activeSettings.currencySymbol)} · balance ${formatCurrency(
              balance,
              activeSettings.currencySymbol,
            )}. Track it in Bills → Production.`
          : printerRef.current.status === 'connected'
            ? 'Auto-print is off. You can print this bill from Bills history.'
            : 'Printer offline — no receipt was sent. Reconnect and print from Bills history.',
      });
      return { status: 'saved', order: newOrder };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Checkout failed.';
      setCheckoutNotice({
        status: 'save-failed',
        title: 'Bill not completed',
        detail: 'The bill could not be saved; the cart has been kept.',
        error: message,
      });
      return { status: 'save-failed', error: message };
    } finally {
      // Keep the synchronous lock through the next interaction window. React's
      // disabled state is not enough to stop two clicks in the same tick.
      window.setTimeout(() => {
        checkoutLockRef.current = false;
        setIsCheckingOut(false);
      }, 900);
    }
  }, [
    cart,
    customerName,
    customerPhone,
    discountAmount,
    orderNote,
    paymentMethod,
    persistOrders,
    runAutoBackupIfDue,
    storage,
    submitOrderToPrinter,
    scheduleMode,
    fulfilmentType,
    fulfilmentDate,
    fulfilmentTime,
    deliveryAddress,
    advanceAmount,
  ]);

  const markOrderBrowserPrinted = useCallback(
    (orderId: string) => {
      updateOrderPrintState(orderId, {
        printedAt: new Date().toISOString(),
        printMode: 'browser',
        printState: 'sent',
      });
    },
    [updateOrderPrintState],
  );

  const retryCheckoutNotice = useCallback(async (): Promise<PrintOutcome> => {
    const order = checkoutNotice?.order;
    if (!order) {
      return { ok: false, uncertain: false, error: 'No saved bill to retry.', warnings: [] };
    }
    const outcome = await submitOrderToPrinter(order);
    const refreshed = ordersRef.current.find((o) => o.id === order.id) ?? order;
    if (outcome.ok) {
      setCheckoutNotice({
        status: 'printed',
        order: refreshed,
        title: `Bill ${refreshed.billNumber} sent to printer`,
        detail:
          refreshed.printMode === 'simulated'
            ? 'Test simulator only — no physical paper was printed.'
            : 'The same bill was reprinted; it was not counted as another sale. Check the paper.',
      });
    } else {
      setCheckoutNotice({
        status: outcome.uncertain ? 'print-uncertain' : 'print-failed',
        order: refreshed,
        title: `Bill ${refreshed.billNumber} saved — printing ${
          outcome.uncertain ? 'may be incomplete' : 'failed'
        }`,
        detail: outcome.uncertain
          ? 'Part of the receipt may have printed. Check the paper before retrying again.'
          : 'The sale is still saved once. Reconnect the printer, then retry this same bill.',
        error: outcome.error,
      });
    }
    return outcome;
  }, [checkoutNotice?.order, submitOrderToPrinter]);

  const patchOrder = useCallback(
    (orderId: string, patch: Partial<BillOrder>): BillOrder | null =>
      updateOrderPrintState(orderId, patch),
    [updateOrderPrintState],
  );

  const setOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      const order = ordersRef.current.find((o) => o.id === orderId);
      if (!order) return;
      patchOrder(orderId, { status, cancelReason: status === 'cancelled' ? order.cancelReason : undefined });
      setOrderNotice({
        kind: 'status',
        text: `${order.billNumber} marked ${status}.`,
      });
    },
    [patchOrder],
  );

  const cancelOrder = useCallback(
    (orderId: string, reason: string) => {
      const order = ordersRef.current.find((o) => o.id === orderId);
      if (!order) return;
      lastCancelRef.current = { id: orderId, previousStatus: orderStatus(order) };
      patchOrder(orderId, { status: 'cancelled', cancelReason: reason.trim() || 'Cancelled at counter' });
      setOrderNotice({
        kind: 'cancelled',
        text: `${order.billNumber} cancelled. It is kept in history but excluded from revenue.`,
      });
    },
    [patchOrder],
  );

  const undoCancel = useCallback(() => {
    const last = lastCancelRef.current;
    if (!last) return;
    patchOrder(last.id, { status: last.previousStatus, cancelReason: undefined });
    lastCancelRef.current = null;
    setOrderNotice({ kind: 'undo', text: 'Cancellation undone. The order is active again.' });
  }, [patchOrder]);

  const settleBalance = useCallback(
    (orderId: string, method: PaymentMethod) => {
      const order = ordersRef.current.find((o) => o.id === orderId);
      if (!order) return;
      const due = orderBalance(order);
      const at = new Date().toISOString();
      const payments: PaymentRecord[] = [
        ...(order.payments ?? []),
        ...(due > 0 ? [{ amount: due, method, at, kind: 'balance' as const }] : []),
      ];
      patchOrder(orderId, {
        payments,
        advancePaid: orderAdvance(order) + due,
        balanceDue: 0,
        status: 'completed',
        paymentMethod: method,
      });
      setOrderNotice({
        kind: 'settled',
        text:
          due > 0
            ? `${order.billNumber} settled — ${formatCurrency(due, settingsRef.current.currencySymbol)} received by ${method}.`
            : `${order.billNumber} marked completed.`,
      });
    },
    [patchOrder],
  );

  const updateOrderFulfilment = useCallback(
    (orderId: string, patch: Partial<Fulfilment>): { ok: boolean; errors?: string[] } => {
      const order = ordersRef.current.find((o) => o.id === orderId);
      if (!order || !order.fulfilment) return { ok: false, errors: ['This bill has no schedule.'] };
      const next: Fulfilment = { ...order.fulfilment, ...patch };
      const validation = validateFulfilment({
        type: next.type,
        date: next.date,
        time: next.time,
        address: next.address,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
      });
      if (!validation.valid) return { ok: false, errors: validation.errors };
      patchOrder(orderId, { fulfilment: next });
      setOrderNotice({ kind: 'status', text: `${order.billNumber} schedule updated.` });
      return { ok: true };
    },
    [patchOrder],
  );

  const printKitchenTicket = useCallback(
    async (order: BillOrder): Promise<{ ok: boolean; error?: string }> => {
      const payload = encodeKitchenTicket(order, settingsRef.current);
      setPrinter((prev) => ({ ...prev, lastJobState: 'sending', lastJobError: null }));
      const { mode, outcome } = await submitPrintJob(payload);
      if (outcome.ok) {
        const now = new Date().toISOString();
        setPrinter((prev) => ({
          ...prev,
          lastPrintedAt: now,
          printCount: prev.printCount + 1,
          lastJobState: 'sent',
          lastJobError: null,
        }));
        setLastPrintLog({
          id: `log-${Date.now()}`,
          timestamp: now,
          title: `Kitchen ticket ${order.billNumber}`,
          mode: mode === 'simulated' ? 'simulated' : 'bluetooth',
          byteCount: payload.length,
          hexPreview: formatBytesHexPreview(payload),
          lines: formatKitchenTicketLines(order, settingsRef.current),
        });
        return { ok: true };
      }
      setPrinter((prev) => ({
        ...prev,
        lastJobState: outcome.uncertain ? 'uncertain' : 'failed',
        lastJobError: outcome.error ?? 'Kitchen ticket failed.',
      }));
      return { ok: false, error: outcome.error };
    },
    [],
  );

  const orderWhatsApp = useCallback(
    (order: BillOrder): { url: string; text: string } => {
      const text = buildOrderWhatsAppMessage(order, settingsRef.current);
      return { url: whatsappUrl(order.customerPhone, text), text };
    },
    [],
  );

  const dismissOrderNotice = useCallback(() => setOrderNotice(null), []);

  const dismissCheckoutNotice = useCallback(() => setCheckoutNotice(null), []);
  const dismissStorageError = useCallback(() => setStorageError(null), []);

  return {
    cakes,
    orders,
    settings,
    catalogMeta,
    migrationReport,
    cart,
    discountAmount,
    setDiscountAmount,
    paymentMethod,
    setPaymentMethod,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    orderNote,
    setOrderNote,
    printer,
    rememberedPrinter,
    lastPrintLog,
    storageError,
    dismissStorageError,
    checkoutNotice,
    dismissCheckoutNotice,
    isCheckingOut,

    addConfiguredItem,
    updateConfiguredItem,
    updateCartItemQty,
    removeCartItem,
    clearCart,

    saveCake,
    toggleCakeStock,
    deleteCake,
    updateSettings,

    connectWebBluetooth,
    connectNativeDevice,
    scanNative,
    reconnectRemembered,
    connectSimulatedPrinter,
    disconnectPrinter,
    forgetRememberedPrinter,
    printOrder,
    retryCheckoutNotice,
    printTestSlip,
    markOrderBrowserPrinted,

    checkoutAndPrint,

    scheduleMode,
    setScheduleMode,
    fulfilmentType,
    setFulfilmentType,
    fulfilmentDate,
    setFulfilmentDate,
    fulfilmentTime,
    setFulfilmentTime,
    deliveryAddress,
    setDeliveryAddress,
    advanceAmount,
    setAdvanceAmount,
    orderNotice,
    dismissOrderNotice,
    setOrderStatus,
    cancelOrder,
    undoCancel,
    settleBalance,
    updateOrderFulfilment,
    printKitchenTicket,
    orderWhatsApp,

    backupInfo,
    backupNotice,
    dismissBackupNotice,
    buildBackup,
    exportBackupJson,
    exportPayload,
    exportBillsCsv,
    copyBackupToClipboard,
    restoreBackup,
    undoRestore,
    refreshBackupInfo,
    getAutoBackupPayload,
    getPreRestorePayload,
    exportLegacyBackup,
  };
}

export type PosStore = ReturnType<typeof usePosStore>;
