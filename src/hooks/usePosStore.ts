import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createSeedOrders,
  DEFAULT_SHOP_SETTINGS,
  SEED_CAKES,
} from '../data/seedData';
import {
  connectWebBluetoothPrinter,
  type ConnectedBleHandle,
} from '../services/bluetoothPrinter';
import type {
  BillOrder,
  BluetoothPrinterState,
  CakeItem,
  CakeVariant,
  CartItem,
  PaymentMethod,
  PrintMode,
  ShopSettings,
} from '../types/pos';
import { calculateBillTotals, generateBillNumber } from '../utils/billing';
import { encodeEscPosReceipt, encodeTestSlip, formatBytesHexPreview } from '../utils/escpos';

const STORAGE_KEYS = {
  CAKES: 'crumbpos_cakes_v1',
  ORDERS: 'crumbpos_orders_v1',
  SETTINGS: 'crumbpos_settings_v1',
  SIM_PRINTER: 'crumbpos_sim_printer_v1',
} as const;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export interface LastPrintLog {
  id: string;
  timestamp: string;
  title: string;
  mode: PrintMode;
  byteCount: number;
  hexPreview: string;
  lines: string[];
}

export function usePosStore() {
  const [cakes, setCakes] = useState<CakeItem[]>(() => readJson(STORAGE_KEYS.CAKES, SEED_CAKES));
  const [orders, setOrders] = useState<BillOrder[]>(() =>
    readJson(STORAGE_KEYS.ORDERS, createSeedOrders()),
  );
  const [settings, setSettings] = useState<ShopSettings>(() =>
    readJson(STORAGE_KEYS.SETTINGS, DEFAULT_SHOP_SETTINGS),
  );

  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [orderNote, setOrderNote] = useState<string>('');

  const [printer, setPrinter] = useState<BluetoothPrinterState>(() => {
    const simSaved = readJson<boolean>(STORAGE_KEYS.SIM_PRINTER, false);
    if (simSaved) {
      return {
        status: 'connected',
        mode: 'simulated',
        deviceName: 'Rongta RPP02N (Simulated 58mm)',
        deviceId: 'sim-ble-58mm',
        serviceUuid: '000018f0-0000-1000-8000-00805f9b34fb',
        characteristicUuid: '00002af1-0000-1000-8000-00805f9b34fb',
        lastError: null,
        lastPrintedAt: null,
        printCount: 0,
      };
    }
    return {
      status: 'disconnected',
      mode: 'none',
      deviceName: null,
      deviceId: null,
      serviceUuid: null,
      characteristicUuid: null,
      lastError: null,
      lastPrintedAt: null,
      printCount: 0,
    };
  });

  const [lastPrintLog, setLastPrintLog] = useState<LastPrintLog | null>(null);
  const bleHandleRef = useRef<ConnectedBleHandle | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CAKES, JSON.stringify(cakes));
    } catch {
      // Ignore quota errors
    }
  }, [cakes]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore quota errors
    }
  }, [orders]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore quota errors
    }
  }, [settings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.SIM_PRINTER,
        JSON.stringify(printer.status === 'connected' && printer.mode === 'simulated'),
      );
    } catch {
      // Ignore
    }
  }, [printer.status, printer.mode]);

  const addToCart = useCallback((cake: CakeItem, variant: CakeVariant, eggless = false) => {
    if (!cake.inStock) return;
    const useEggless = cake.egglessAvailable ? eggless : false;
    const key = `${cake.id}__${variant.id}__${useEggless ? 'eggless' : 'std'}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          key,
          cakeId: cake.id,
          cakeName: cake.name,
          variantId: variant.id,
          variantLabel: variant.label,
          unitPrice: variant.price,
          quantity: 1,
          eggless: useEggless,
        },
      ];
    });
  }, []);

  const updateCartItemQty = useCallback((key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const toggleCartItemEggless = useCallback(
    (key: string) => {
      setCart((prev) => {
        const target = prev.find((i) => i.key === key);
        if (!target) return prev;
        const cake = cakes.find((c) => c.id === target.cakeId);
        if (!cake || !cake.egglessAvailable) return prev;
        return prev.map((item) =>
          item.key === key ? { ...item, eggless: !item.eggless } : item,
        );
      });
    },
    [cakes],
  );

  const updateCartItemMessage = useCallback((key: string, message: string) => {
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, cakeMessage: message } : item)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscountAmount(0);
    setCustomerName('');
    setCustomerPhone('');
    setOrderNote('');
  }, []);

  const saveCake = useCallback((cakeData: Omit<CakeItem, 'id' | 'createdAt'>, editId?: string) => {
    if (editId) {
      setCakes((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, ...cakeData } : c)),
      );
    } else {
      const newCake: CakeItem = {
        ...cakeData,
        id: `cake-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setCakes((prev) => [newCake, ...prev]);
    }
  }, []);

  const toggleCakeStock = useCallback((cakeId: string) => {
    setCakes((prev) =>
      prev.map((c) => (c.id === cakeId ? { ...c, inStock: !c.inStock } : c)),
    );
  }, []);

  const deleteCake = useCallback((cakeId: string) => {
    setCakes((prev) => prev.filter((c) => c.id !== cakeId));
    setCart((prev) => prev.filter((item) => item.cakeId !== cakeId));
  }, []);

  const connectRealBluetooth = useCallback(async () => {
    setPrinter((prev) => ({
      ...prev,
      status: 'connecting',
      lastError: null,
    }));
    try {
      if (bleHandleRef.current) {
        bleHandleRef.current.disconnect();
        bleHandleRef.current = null;
      }
      const handle = await connectWebBluetoothPrinter(() => {
        bleHandleRef.current = null;
        setPrinter((prev) => ({
          ...prev,
          status: 'disconnected',
          mode: 'none',
          deviceName: null,
          deviceId: null,
          serviceUuid: null,
          characteristicUuid: null,
          lastError: 'Bluetooth printer disconnected.',
        }));
      });
      bleHandleRef.current = handle;
      setPrinter((prev) => ({
        ...prev,
        status: 'connected',
        mode: 'web-bluetooth',
        deviceName: handle.deviceName,
        deviceId: handle.deviceId,
        serviceUuid: handle.serviceUuid,
        characteristicUuid: handle.characteristicUuid,
        lastError: null,
      }));
      return { ok: true as const };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to connect Bluetooth printer.';
      setPrinter((prev) => ({
        ...prev,
        status: 'error',
        mode: 'none',
        lastError: msg,
      }));
      return { ok: false as const, error: msg };
    }
  }, []);

  const connectSimulatedPrinter = useCallback((paperWidth?: 58 | 80) => {
    if (bleHandleRef.current) {
      bleHandleRef.current.disconnect();
      bleHandleRef.current = null;
    }
    const width = paperWidth ?? settings.paperWidth;
    setPrinter((prev) => ({
      ...prev,
      status: 'connected',
      mode: 'simulated',
      deviceName: width === 80 ? 'Epson TM-P80 (Simulated 80mm)' : 'Rongta RPP02N (Simulated 58mm)',
      deviceId: `sim-ble-${width}mm`,
      serviceUuid: '000018f0-0000-1000-8000-00805f9b34fb',
      characteristicUuid: '00002af1-0000-1000-8000-00805f9b34fb',
      lastError: null,
    }));
  }, [settings.paperWidth]);

  const disconnectPrinter = useCallback(() => {
    if (bleHandleRef.current) {
      bleHandleRef.current.disconnect();
      bleHandleRef.current = null;
    }
    setPrinter((prev) => ({
      ...prev,
      status: 'disconnected',
      mode: 'none',
      deviceName: null,
      deviceId: null,
      serviceUuid: null,
      characteristicUuid: null,
      lastError: null,
    }));
  }, []);

  const printOrderViaBluetooth = useCallback(
    async (
      order: BillOrder,
      renderedLines: string[],
    ): Promise<{ ok: boolean; mode?: PrintMode; error?: string }> => {
      const payload = encodeEscPosReceipt(order, settings);
      const nowIso = new Date().toISOString();

      if (printer.status === 'connected' && printer.mode === 'web-bluetooth' && bleHandleRef.current) {
        try {
          await bleHandleRef.current.writeBytes(payload);
          setOrders((prev) =>
            prev.map((o) =>
              o.id === order.id ? { ...o, printedAt: nowIso, printMode: 'bluetooth' } : o,
            ),
          );
          setPrinter((prev) => ({
            ...prev,
            lastPrintedAt: nowIso,
            printCount: prev.printCount + 1,
            lastError: null,
          }));
          setLastPrintLog({
            id: `log-${Date.now()}`,
            timestamp: nowIso,
            title: `Bill ${order.billNumber}`,
            mode: 'bluetooth',
            byteCount: payload.length,
            hexPreview: formatBytesHexPreview(payload),
            lines: renderedLines,
          });
          return { ok: true, mode: 'bluetooth' };
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Bluetooth transmission failed.';
          setPrinter((prev) => ({ ...prev, lastError: msg }));
          return { ok: false, error: msg };
        }
      }

      if (printer.status === 'connected' && printer.mode === 'simulated') {
        await new Promise((resolve) => setTimeout(resolve, 260));
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id ? { ...o, printedAt: nowIso, printMode: 'simulated' } : o,
          ),
        );
        setPrinter((prev) => ({
          ...prev,
          lastPrintedAt: nowIso,
          printCount: prev.printCount + 1,
          lastError: null,
        }));
        setLastPrintLog({
          id: `log-${Date.now()}`,
          timestamp: nowIso,
          title: `Bill ${order.billNumber}`,
          mode: 'simulated',
          byteCount: payload.length,
          hexPreview: formatBytesHexPreview(payload),
          lines: renderedLines,
        });
        return { ok: true, mode: 'simulated' };
      }

      return {
        ok: false,
        error: 'No Bluetooth printer connected. Connect a printer in the Printer tab first.',
      };
    },
    [printer.mode, printer.status, settings],
  );

  const printTestSlip = useCallback(
    async (testLines: string[]): Promise<{ ok: boolean; error?: string }> => {
      const payload = encodeTestSlip(settings);
      const nowIso = new Date().toISOString();

      if (printer.status === 'connected' && printer.mode === 'web-bluetooth' && bleHandleRef.current) {
        try {
          await bleHandleRef.current.writeBytes(payload);
          setPrinter((prev) => ({
            ...prev,
            lastPrintedAt: nowIso,
            printCount: prev.printCount + 1,
            lastError: null,
          }));
          setLastPrintLog({
            id: `log-${Date.now()}`,
            timestamp: nowIso,
            title: 'Bluetooth Test Slip',
            mode: 'bluetooth',
            byteCount: payload.length,
            hexPreview: formatBytesHexPreview(payload),
            lines: testLines,
          });
          return { ok: true };
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Test print failed.';
          setPrinter((prev) => ({ ...prev, lastError: msg }));
          return { ok: false, error: msg };
        }
      }

      if (printer.status === 'connected' && printer.mode === 'simulated') {
        await new Promise((resolve) => setTimeout(resolve, 220));
        setPrinter((prev) => ({
          ...prev,
          lastPrintedAt: nowIso,
          printCount: prev.printCount + 1,
          lastError: null,
        }));
        setLastPrintLog({
          id: `log-${Date.now()}`,
          timestamp: nowIso,
          title: 'Bluetooth Test Slip',
          mode: 'simulated',
          byteCount: payload.length,
          hexPreview: formatBytesHexPreview(payload),
          lines: testLines,
        });
        return { ok: true };
      }

      return { ok: false, error: 'Connect a Bluetooth or Simulated printer first.' };
    },
    [printer.mode, printer.status, settings],
  );

  const markOrderBrowserPrinted = useCallback((orderId: string) => {
    const nowIso = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, printedAt: nowIso, printMode: 'browser' } : o,
      ),
    );
  }, []);

  const checkoutOrder = useCallback((): BillOrder | null => {
    if (cart.length === 0) return null;
    const calc = calculateBillTotals(cart, discountAmount, settings.taxRate);
    const now = new Date();
    const newOrder: BillOrder = {
      id: `ord-${Date.now()}`,
      billNumber: generateBillNumber(orders, now),
      createdAt: now.toISOString(),
      items: cart.map((item) => ({ ...item })),
      subtotal: calc.subtotal,
      discountAmount: calc.discountAmount,
      taxRate: settings.taxRate,
      taxAmount: calc.taxAmount,
      total: calc.total,
      paymentMethod,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      orderNote: orderNote.trim() || undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  }, [
    cart,
    clearCart,
    customerName,
    customerPhone,
    discountAmount,
    orderNote,
    orders,
    paymentMethod,
    settings.taxRate,
  ]);

  const updateSettings = useCallback((next: ShopSettings) => {
    setSettings(next);
  }, []);

  return {
    cakes,
    orders,
    settings,
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
    lastPrintLog,
    addToCart,
    updateCartItemQty,
    toggleCartItemEggless,
    updateCartItemMessage,
    clearCart,
    saveCake,
    toggleCakeStock,
    deleteCake,
    connectRealBluetooth,
    connectSimulatedPrinter,
    disconnectPrinter,
    printOrderViaBluetooth,
    printTestSlip,
    markOrderBrowserPrinted,
    checkoutOrder,
    updateSettings,
  };
}
