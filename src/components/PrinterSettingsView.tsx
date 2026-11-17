import { useState, type FormEvent } from 'react';
import { Bluetooth, BluetoothConnected, Check, Printer, Unplug } from 'lucide-react';
import type { LastPrintLog } from '../hooks/usePosStore';
import { isWebBluetoothSupported } from '../services/bluetoothPrinter';
import type { BluetoothPrinterState, ShopSettings } from '../types/pos';
import { formatTestSlipLines } from '../utils/escpos';
import { AndroidInstallCard } from './PWAInstallBanner';

interface PrinterSettingsViewProps {
  printer: BluetoothPrinterState;
  settings: ShopSettings;
  lastPrintLog: LastPrintLog | null;
  onConnectBluetooth: () => Promise<{ ok: boolean; error?: string }>;
  onConnectSimulated: (paperWidth?: 58 | 80) => void;
  onDisconnectPrinter: () => void;
  onPrintTestSlip: (lines: string[]) => Promise<{ ok: boolean; error?: string }>;
  onUpdateSettings: (next: ShopSettings) => void;
}

export function PrinterSettingsView({
  printer,
  settings,
  lastPrintLog,
  onConnectBluetooth,
  onConnectSimulated,
  onDisconnectPrinter,
  onPrintTestSlip,
  onUpdateSettings,
}: PrinterSettingsViewProps) {
  const [formState, setFormState] = useState<ShopSettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);
  const [testNotice, setTestNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [testing, setTesting] = useState(false);

  const webBleAvailable = isWebBluetoothSupported();

  const handleConnectReal = async () => {
    setTestNotice(null);
    const res = await onConnectBluetooth();
    if (!res.ok && res.error) {
      setTestNotice({ type: 'err', text: res.error });
    }
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
        text: 'Test slip dispatched over ESC/POS Bluetooth channel.',
      });
    } else {
      setTestNotice({
        type: 'err',
        text: res.error || 'Could not print test slip.',
      });
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
      shopName: formState.shopName.trim() || 'Crème & Crumb',
      currencySymbol: formState.currencySymbol.trim() || '₹',
      taxRate: Math.min(100, Math.max(0, Number(formState.taxRate) || 0)),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 pb-24 md:pb-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
          Bluetooth Printer &amp; Shop Setup
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Pair a 58mm or 80mm BLE ESC/POS thermal receipt printer directly from your phone browser.
        </p>
      </div>

      <AndroidInstallCard />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Bluetooth Printer Pairing & Test Output */}
        <section
          aria-label="Bluetooth Thermal Printer Connection"
          className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 space-y-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Thermal Printer Connection
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {printer.status === 'connected'
                  ? `Connected · ${printer.deviceName}`
                  : printer.status === 'connecting'
                    ? 'Scanning for Bluetooth devices...'
                    : 'Not connected to any thermal printer'}
              </p>
            </div>
            <span
              className={`text-xs font-semibold inline-flex items-center gap-1.5 ${
                printer.status === 'connected' ? 'text-emerald-800' : 'text-slate-500'
              }`}
            >
              {printer.status === 'connected' ? (
                <>
                  <BluetoothConnected className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <Bluetooth className="w-4 h-4" aria-hidden="true" />
                  <span>Offline</span>
                </>
              )}
            </span>
          </div>

          {printer.lastError && (
            <div
              role="alert"
              className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900"
            >
              {printer.lastError}
            </div>
          )}

          {testNotice && (
            <div
              role="status"
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-medium ${
                testNotice.type === 'ok'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              {testNotice.text}
            </div>
          )}

          {/* Paper Width & Auto Print */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                Thermal Paper Width
              </span>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {([58, 80] as const).map((w) => {
                  const active = formState.paperWidth === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => handlePaperWidthChange(w)}
                      aria-pressed={active}
                      className={`min-h-[40px] rounded-lg text-xs font-semibold transition-colors ${
                        active
                          ? 'bg-white text-slate-950 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {w}mm ({w === 58 ? '32 col' : '48 col'})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-end">
              <label className="w-full min-h-[48px] px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 cursor-pointer text-xs font-medium text-slate-800">
                <span>Auto-print after Charge</span>
                <input
                  type="checkbox"
                  checked={formState.autoPrintOnCheckout}
                  onChange={(e) => {
                    const next = { ...formState, autoPrintOnCheckout: e.target.checked };
                    setFormState(next);
                    onUpdateSettings(next);
                  }}
                  className="w-4 h-4 accent-slate-900 rounded"
                />
              </label>
            </div>
          </div>

          {/* Connection Buttons */}
          <div className="space-y-2.5">
            {printer.status === 'connected' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleTestSlip}
                  disabled={testing}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Printer className="w-4 h-4" aria-hidden="true" />
                  <span>{testing ? 'Printing...' : 'Print Test Slip'}</span>
                </button>
                <button
                  type="button"
                  onClick={onDisconnectPrinter}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold inline-flex items-center justify-center gap-2"
                >
                  <Unplug className="w-4 h-4" aria-hidden="true" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleConnectReal}
                  disabled={printer.status === 'connecting'}
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Bluetooth className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {printer.status === 'connecting'
                      ? 'Opening Bluetooth Picker...'
                      : 'Pair Real Bluetooth Printer (Web BLE)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onConnectSimulated(formState.paperWidth)}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold inline-flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-slate-600" aria-hidden="true" />
                  <span>Use Virtual {formState.paperWidth}mm Thermal Printer (Test Mode)</span>
                </button>
              </div>
            )}

            <p className="text-[11px] text-slate-500 leading-relaxed">
              {webBleAvailable
                ? 'Web Bluetooth is supported in this browser. Supports standard BLE thermal printers (Rongta, Sunmi, Xprinter, Munbyn, Goojprt, Epson TM-P) over GATT UART.'
                : 'This browser does not expose Web Bluetooth (e.g. desktop Firefox/iOS Safari). Use Android Chrome for physical BLE pairing, or use Virtual Thermal Printer to preview ESC/POS output.'}
            </p>
          </div>

          {/* Connected Metadata & Last Printed Paper Feed */}
          {printer.status === 'connected' && (
            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Mode</span>
                <span className="font-medium text-slate-900">
                  {printer.mode === 'web-bluetooth' ? 'Hardware Web Bluetooth' : 'Virtual ESC/POS Simulator'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GATT Service</span>
                <span className="font-mono text-[11px] text-slate-800">
                  {printer.serviceUuid}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Jobs Printed</span>
                <span className="font-semibold tabular-nums text-slate-900">
                  {printer.printCount}
                </span>
              </div>
            </div>
          )}

          {lastPrintLog && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">
                  Last Output: {lastPrintLog.title}
                </span>
                <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                  {lastPrintLog.byteCount} bytes
                </span>
              </div>
              <div className="bg-slate-100 rounded-xl p-4 flex justify-center overflow-x-auto">
                <pre className="animate-paper-feed bg-white border border-slate-200 px-3.5 py-4 font-mono text-[11px] leading-relaxed text-slate-900 shadow-sm">
                  {lastPrintLog.lines.join('\n')}
                </pre>
              </div>
              <p className="font-mono text-[10px] text-slate-500 break-all">
                {lastPrintLog.hexPreview}
              </p>
            </div>
          )}
        </section>

        {/* Right: Bakery Shop Profile & Receipt Header */}
        <section
          aria-label="Shop Profile and Receipt Details"
          className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5"
        >
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Bakery Profile &amp; Receipt Header
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Printed at the top and bottom of every thermal customer bill.
          </p>

          <form onSubmit={handleSaveShopSettings} className="space-y-3.5">
            <div>
              <label htmlFor="shop-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Bakery / Shop Name
              </label>
              <input
                id="shop-name"
                type="text"
                value={formState.shopName}
                onChange={(e) => setFormState((s) => ({ ...s, shopName: e.target.value }))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="shop-tagline" className="block text-xs font-semibold text-slate-700 mb-1">
                Tagline
              </label>
              <input
                id="shop-tagline"
                type="text"
                value={formState.tagline}
                onChange={(e) => setFormState((s) => ({ ...s, tagline: e.target.value }))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="shop-address" className="block text-xs font-semibold text-slate-700 mb-1">
                Shop Address
              </label>
              <input
                id="shop-address"
                type="text"
                value={formState.address}
                onChange={(e) => setFormState((s) => ({ ...s, address: e.target.value }))}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="shop-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="shop-phone"
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => setFormState((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="shop-tax-id" className="block text-xs font-semibold text-slate-700 mb-1">
                  GSTIN / Tax ID
                </label>
                <input
                  id="shop-tax-id"
                  type="text"
                  value={formState.taxId}
                  onChange={(e) => setFormState((s) => ({ ...s, taxId: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="shop-tax-rate" className="block text-xs font-semibold text-slate-700 mb-1">
                  Tax Rate (%)
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
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 tabular-nums focus:border-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="shop-currency" className="block text-xs font-semibold text-slate-700 mb-1">
                  Currency Symbol
                </label>
                <input
                  id="shop-currency"
                  type="text"
                  maxLength={4}
                  value={formState.currencySymbol}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, currencySymbol: e.target.value }))
                  }
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="shop-footer" className="block text-xs font-semibold text-slate-700 mb-1">
                Receipt Footer Note
              </label>
              <input
                id="shop-footer"
                type="text"
                value={formState.receiptFooter}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, receiptFooter: e.target.value }))
                }
                className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              {savedNotice ? (
                <span role="status" className="text-xs font-semibold text-emerald-800 inline-flex items-center gap-1">
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Shop settings saved</span>
                </span>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
              >
                Save Shop Details
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
