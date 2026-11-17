import { useState } from 'react';
import { Bluetooth, Check, Copy, Printer, X } from 'lucide-react';
import type { BillOrder, BluetoothPrinterState, PrintMode, ShopSettings } from '../types/pos';
import { encodeEscPosReceipt, formatBytesHexPreview, formatReceiptLines } from '../utils/escpos';

interface ReceiptPreviewModalProps {
  order: BillOrder;
  settings: ShopSettings;
  printer: BluetoothPrinterState;
  onClose: () => void;
  onPrintBluetooth: (
    order: BillOrder,
    lines: string[],
  ) => Promise<{ ok: boolean; mode?: PrintMode; error?: string }>;
  onBrowserPrint: (orderId: string) => void;
  onOpenPrinterSetup: () => void;
}

export function ReceiptPreviewModal({
  order,
  settings,
  printer,
  onClose,
  onPrintBluetooth,
  onBrowserPrint,
  onOpenPrinterSetup,
}: ReceiptPreviewModalProps) {
  const [printing, setPrinting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const displayLines = formatReceiptLines(order, settings, false);
  const escPosLines = formatReceiptLines(order, settings, true);
  const escPosBytes = encodeEscPosReceipt(order, settings);

  const handleBluetoothPrint = async () => {
    setPrinting(true);
    setFeedback(null);
    const result = await onPrintBluetooth(order, escPosLines);
    setPrinting(false);
    if (result.ok) {
      setFeedback({
        type: 'ok',
        text:
          result.mode === 'simulated'
            ? `Printed ${escPosBytes.length} ESC/POS bytes to Virtual ${settings.paperWidth}mm Printer.`
            : `Sent ${escPosBytes.length} ESC/POS bytes to ${printer.deviceName || 'Bluetooth Printer'}.`,
      });
    } else {
      setFeedback({
        type: 'err',
        text: result.error || 'Failed to print via Bluetooth.',
      });
    }
  };

  const handleBrowserPrint = () => {
    onBrowserPrint(order.id);
    window.print();
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(displayLines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setFeedback({ type: 'err', text: 'Clipboard copy not permitted in this browser.' });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div>
            <h2 id="receipt-modal-title" className="font-display text-lg font-semibold text-slate-900">
              Receipt {order.billNumber}
            </h2>
            <p className="text-xs text-slate-500">
              {settings.paperWidth}mm thermal layout · {escPosBytes.length} ESC/POS bytes
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close receipt preview"
            className="w-11 h-11 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 focus-visible:outline-2 focus-visible:outline-slate-900"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto bg-slate-100/80 flex-1 flex flex-col items-center gap-4">
          {feedback && (
            <div
              role="status"
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border ${
                feedback.type === 'ok'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* Thermal Paper Receipt Sheet */}
          <div
            id="thermal-receipt-print-area"
            className={`animate-paper-feed bg-white text-slate-950 border border-slate-200 shadow-sm px-4 py-5 font-mono text-[11px] sm:text-xs leading-relaxed whitespace-pre overflow-x-auto ${
              settings.paperWidth === 80 ? 'w-full max-w-[390px]' : 'w-full max-w-[300px]'
            }`}
          >
            {displayLines.join('\n')}
          </div>

          <p className="text-[11px] font-mono text-slate-500 text-center max-w-sm break-all">
            ESC/POS: {formatBytesHexPreview(escPosBytes, 24)}
          </p>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white space-y-2.5">
          {printer.status === 'connected' ? (
            <button
              type="button"
              onClick={handleBluetoothPrint}
              disabled={printing}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <Bluetooth className="w-4 h-4" aria-hidden="true" />
              <span>
                {printing
                  ? 'Sending to Thermal Printer...'
                  : printer.mode === 'simulated'
                    ? 'Print to Virtual Bluetooth Printer'
                    : `Print on ${printer.deviceName || 'Bluetooth Printer'}`}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenPrinterSetup}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <Bluetooth className="w-4 h-4" aria-hidden="true" />
              <span>Connect Bluetooth Printer to Print</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleBrowserPrint}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>System Print</span>
            </button>
            <button
              type="button"
              onClick={handleCopyText}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 inline-flex items-center justify-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>Copy Receipt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
