import { useEffect, useState } from 'react';
import {
  Bluetooth,
  Check,
  ChefHat,
  Copy,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Printer,
  X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useSheetHistory } from '../hooks/useSheetHistory';
import type { PrintOutcome } from '../hooks/usePosStore';
import type { BillOrder, BluetoothPrinterState, ShopSettings } from '../types/pos';
import {
  encodeEscPosReceipt,
  formatBytesHexPreview,
  formatReceiptLines,
  getReceiptEncodingWarnings,
} from '../utils/escpos';
import { formatCurrency } from '../utils/billing';
import { buildOrderWhatsAppMessage, whatsappUrl } from '../utils/orders';
import {
  buildUpiPayUri,
  exportReceiptPdf,
  exportReceiptPng,
  getUpiPayAmount,
  shouldShowUpiQr,
  STORE_WEBSITE_URL,
} from '../utils/receiptExport';
import { btnGhost, btnPrimary, focus } from '../ui';

interface ReceiptPreviewModalProps {
  order: BillOrder;
  settings: ShopSettings;
  printer: BluetoothPrinterState;
  onClose: () => void;
  onPrintBluetooth: (order: BillOrder) => Promise<PrintOutcome>;
  onPrintKitchenTicket: (order: BillOrder) => Promise<{ ok: boolean; error?: string }>;
  onBrowserPrint: (orderId: string) => void;
  onOpenPrinterSetup: () => void;
}

export function ReceiptPreviewModal({
  order,
  settings,
  printer,
  onClose,
  onPrintBluetooth,
  onPrintKitchenTicket,
  onBrowserPrint,
  onOpenPrinterSetup,
}: ReceiptPreviewModalProps) {
  const [printing, setPrinting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'warn' | 'err'; text: string } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [kitchenBusy, setKitchenBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState<'pdf' | 'png' | null>(null);

  const displayLines = formatReceiptLines(order, settings, false);
  const escPosBytes = encodeEscPosReceipt(order, settings);
  const encodingWarnings = getReceiptEncodingWarnings(order, settings);
  const closeReceipt = useSheetHistory(true, onClose);
  const showUpiQr = shouldShowUpiQr(order, settings);
  const upiAmount = getUpiPayAmount(order);

  const curr = settings.currencySymbol;
  const fmt = (n: number) => formatCurrency(n, curr);

  const dt = new Date(order.createdAt);
  const dateStr = dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const weightLabel = (item: { weightKg: number; weightLabel: string; flavour: string | null; eggless: boolean }) => {
    const kg = item.weightKg >= 1 ? `${item.weightKg} kg` : `${item.weightKg * 1000}g`;
    const extras: string[] = [];
    if (item.flavour) extras.push(item.flavour);
    if (item.eggless) extras.push('Eggless');
    return [kg, ...extras].join(' · ');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeReceipt();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [closeReceipt]);

  const handleBluetoothPrint = async () => {
    setPrinting(true);
    setFeedback(null);
    const result = await onPrintBluetooth(order);
    setPrinting(false);
    if (result.ok) {
      const warningText = result.warnings.length > 0 ? ` ${result.warnings.join(' ')}` : '';
      setFeedback({
        type: result.warnings.length > 0 ? 'warn' : 'ok',
        text:
          (result.mode === 'simulated'
            ? `Simulated ${escPosBytes.length} ESC/POS bytes. No physical paper was printed.`
            : `Sent ${escPosBytes.length} bytes to ${printer.deviceName || 'the Bluetooth printer'}. Check the paper to confirm output.`) +
          warningText,
      });
    } else {
      setFeedback({
        type: 'err',
        text: result.error || 'Failed to print via Bluetooth.',
      });
    }
  };

  const handleKitchenTicket = async () => {
    setKitchenBusy(true);
    setFeedback(null);
    const result = await onPrintKitchenTicket(order);
    setKitchenBusy(false);
    setFeedback(
      result.ok
        ? {
            type: 'ok',
            text:
              printer.mode === 'simulated'
                ? 'Kitchen ticket sent to the test simulator (no paper).'
                : 'Kitchen ticket sent. Check the printer paper.',
          }
        : { type: 'err', text: result.error ?? 'Kitchen ticket failed.' },
    );
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
      setFeedback({ type: 'err', text: 'Clipboard copy is not permitted in this browser.' });
    }
  };

  const handleExportPdf = async () => {
    setExportBusy('pdf');
    setFeedback(null);
    const result = await exportReceiptPdf(order, settings);
    setExportBusy(null);
    setFeedback(
      result.ok
        ? {
            type: 'ok',
            text:
              result.method === 'share'
                ? `PDF ${result.filename} ready to share.`
                : `Saved ${result.filename}.`,
          }
        : { type: 'err', text: result.error || 'Could not create PDF.' },
    );
  };

  const handleExportPng = async () => {
    setExportBusy('png');
    setFeedback(null);
    const result = await exportReceiptPng(order, settings);
    setExportBusy(null);
    setFeedback(
      result.ok
        ? {
            type: 'ok',
            text:
              result.method === 'share'
                ? `Image ${result.filename} ready to share.`
                : `Saved ${result.filename}.`,
          }
        : { type: 'err', text: result.error || 'Could not create receipt image.' },
    );
  };

  const handleWhatsApp = () => {
    const message = buildOrderWhatsAppMessage(order, settings);
    const url = whatsappUrl(order.customerPhone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const printStateLabel =
    order.printState === 'sent'
      ? order.printMode === 'simulated'
        ? 'Simulator sent — no paper'
        : 'Bytes sent — check paper'
      : order.printState === 'failed'
        ? 'Print failed'
        : order.printState === 'uncertain'
          ? 'Print may be incomplete'
          : 'Not printed';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
      className="receipt-print-root fixed inset-0 z-50 flex items-end justify-center bg-ink/55 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={closeReceipt}
    >
      <div
        className="receipt-print-dialog animate-sheet-up flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-line bg-card shadow-2xl sm:max-w-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="min-w-0">
            <h2
              id="receipt-modal-title"
              className="truncate text-[15px] font-extrabold tracking-[-0.01em] text-ink"
            >
              Receipt {order.billNumber}
            </h2>
            <p className="mt-0.5 text-[10.5px] text-muted tabular-nums">
              {settings.paperWidth}mm thermal · {escPosBytes.length} ESC/POS bytes ·{' '}
              {printStateLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={closeReceipt}
            aria-label="Close receipt preview"
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-panel hover:text-ink ${focus}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="receipt-print-scroll flex min-h-0 flex-1 flex-col items-center gap-3 overflow-y-auto overscroll-contain bg-panel p-4 sm:p-5">
          {feedback && (
            <div
              role="status"
              className={`w-full rounded-lg border px-3 py-2 text-[11px] font-medium ${
                feedback.type === 'ok'
                  ? 'border-pistachio/25 bg-pistachio-tint text-pistachio'
                  : feedback.type === 'warn'
                    ? 'border-caramel/30 bg-caramel-tint text-caramel'
                    : 'border-berry/25 bg-berry-tint text-berry-deep'
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* ── Graphical receipt ── */}
          <div
            id="thermal-receipt-print-area"
            data-paper-width={settings.paperWidth}
            className="animate-paper-feed w-full max-w-[320px] shrink-0 overflow-hidden border border-line bg-white shadow-[0_12px_28px_rgba(26,23,18,0.10)]"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              /* Perforated top edge */
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          >
            {/* Jagged top edge */}
            <div
              className="receipt-jagged-edge h-3 w-full"
              style={{
                background:
                  'linear-gradient(135deg, #e5e7eb 25%, transparent 25%) -6px 0, ' +
                  'linear-gradient(225deg, #e5e7eb 25%, transparent 25%) -6px 0, ' +
                  'linear-gradient(315deg, #e5e7eb 25%, transparent 25%), ' +
                  'linear-gradient(45deg,  #e5e7eb 25%, transparent 25%)',
                backgroundSize: '12px 12px',
                backgroundColor: 'white',
              }}
            />

            <div className="px-5 pb-5">
              {/* Shop header */}
              <div className="flex flex-col items-center pt-3 pb-3">
                {/* Cake SVG icon */}
                <svg
                  width="52"
                  height="44"
                  viewBox="0 0 52 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-2"
                >
                  {/* Plate */}
                  <ellipse cx="26" cy="38" rx="22" ry="4" stroke="#111" strokeWidth="1.5" fill="none"/>
                  {/* Cake body */}
                  <rect x="7" y="22" width="38" height="16" rx="3" stroke="#111" strokeWidth="1.5" fill="none"/>
                  {/* Frosting waves */}
                  <path d="M7 25 Q12 21 17 25 Q22 29 27 25 Q32 21 37 25 Q42 29 45 25" stroke="#111" strokeWidth="1.5" fill="none"/>
                  {/* Candles */}
                  <rect x="17" y="13" width="4" height="9" rx="1" stroke="#111" strokeWidth="1.2" fill="none"/>
                  <rect x="31" y="13" width="4" height="9" rx="1" stroke="#111" strokeWidth="1.2" fill="none"/>
                  {/* Flames */}
                  <ellipse cx="19" cy="11.5" rx="2" ry="2.5" stroke="#111" strokeWidth="1.1" fill="none"/>
                  <ellipse cx="33" cy="11.5" rx="2" ry="2.5" stroke="#111" strokeWidth="1.1" fill="none"/>
                  {/* Cherry on top */}
                  <circle cx="26" cy="19" r="2.5" stroke="#111" strokeWidth="1.2" fill="none"/>
                  <line x1="26" y1="16.5" x2="26" y2="13" stroke="#111" strokeWidth="1.2"/>
                  <circle cx="26" cy="13" r="1.2" fill="#111"/>
                </svg>

                <p className="text-[22px] font-black tracking-tight leading-none text-black">
                  {settings.shopName.toUpperCase()}
                </p>
                {settings.tagline.trim() && (
                  <p className="mt-0.5 text-[11px] italic text-gray-600">{settings.tagline}</p>
                )}
                {settings.address.trim() && (
                  <p className="mt-0.5 text-[10.5px] text-gray-700 text-center">{settings.address}</p>
                )}
                {settings.phone.trim() && (
                  <p className="text-[10.5px] text-gray-700">Phone: {settings.phone}</p>
                )}
              </div>

              <div className="border-t border-b border-black py-2 my-1">
                <div className="flex justify-between text-[10.5px] text-black">
                  <span><strong>Bill:</strong> {order.billNumber}</span>
                </div>
                <div className="flex justify-between text-[10.5px] text-black mt-0.5">
                  <span><strong>Date:</strong> {dateStr} &nbsp; {timeStr}</span>
                </div>
                {order.customerName?.trim() && (
                  <div className="text-[10.5px] text-black mt-0.5">
                    <strong>Customer:</strong> {order.customerName}
                  </div>
                )}
                {order.customerPhone?.trim() && (
                  <div className="text-[10.5px] text-black">
                    <strong>Phone:</strong> {order.customerPhone}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="mt-2">
                <div className="flex justify-between border-b border-dashed border-gray-400 pb-1 text-[9.5px] font-bold tracking-wider text-gray-600 uppercase">
                  <span>Item</span>
                  <span>Amt</span>
                </div>
                <div className="mt-2 space-y-2.5">
                {order.items.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start">
                      <span className="text-[11.5px] font-bold text-black leading-tight">
                        {item.cakeName}
                      </span>
                      <span className="text-[11px] font-semibold text-black tabular-nums ml-2 shrink-0">
                        {fmt(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-600 mt-0.5">
                      {weightLabel(item)} × {item.quantity}
                    </div>
                    {item.cakeMessage?.trim() && (
                      <div className="text-[9.5px] text-gray-500 italic">
                        "{item.cakeMessage}"
                      </div>
                    )}
                    {item.notes?.trim() && (
                      <div className="text-[9.5px] text-gray-500">Note: {item.notes}</div>
                    )}
                  </div>
                ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-dashed border-gray-400 mt-3 pt-2 space-y-1">
                <div className="flex justify-between text-[10.5px] text-gray-700">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{fmt(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[10.5px] text-gray-700">
                  <span>Discount</span>
                  <span className="tabular-nums">{order.discountAmount > 0 ? `-${fmt(order.discountAmount)}` : fmt(0)}</span>
                </div>
                {order.taxRate > 0 && (
                  <div className="flex justify-between text-[10.5px] text-gray-700">
                    <span>Tax ({order.taxRate}%)</span>
                    <span className="tabular-nums">{fmt(order.taxAmount)}</span>
                  </div>
                )}
              </div>

              {/* Grand total */}
              <div className="flex justify-between items-baseline border-t border-black mt-2 pt-2">
                <span className="text-[16px] font-black text-black tracking-tight">TOTAL</span>
                <span className="text-[18px] font-black text-black tabular-nums tracking-tight">
                  {fmt(order.total)}
                </span>
              </div>
              <p className="text-[10px] text-gray-600 mt-1">Payment: {order.paymentMethod}</p>

              {/* Advance / balance for scheduled orders */}
              {(order.advancePaid ?? 0) > 0 && (order.balanceDue ?? 0) > 0 && (
                <div className="mt-1 space-y-0.5 border-t border-dashed border-gray-300 pt-1">
                  <div className="flex justify-between text-[10px] text-gray-600">
                    <span>Advance paid</span>
                    <span className="tabular-nums">{fmt(order.advancePaid ?? 0)}</span>
                  </div>
                  <div className="flex justify-between text-[10.5px] font-bold text-black">
                    <span>Balance due</span>
                    <span className="tabular-nums">{fmt(order.balanceDue ?? 0)}</span>
                  </div>
                </div>
              )}

              {/* Dynamic UPI Pay QR (when UPI ID is configured and UPI / balance due) */}
              {showUpiQr && settings.upiId && (
                <div className="mt-4 flex flex-col items-center border-t border-black pt-3">
                  <QRCodeSVG
                    value={buildUpiPayUri(settings.upiId, settings.shopName, upiAmount, order.billNumber)}
                    size={96}
                    bgColor="#ffffff"
                    fgColor="#111111"
                    level="M"
                    className="mb-2"
                  />
                  <p className="text-[11px] font-black text-black tracking-wider uppercase">
                    Scan to pay · {fmt(upiAmount)}
                  </p>
                  <p className="text-[9.5px] text-gray-600">UPI: {settings.upiId}</p>
                </div>
              )}

              {/* QR / website section */}
              <div className="mt-4 flex flex-col items-center border-t border-black pt-3">
                <QRCodeSVG
                  value={STORE_WEBSITE_URL}
                  size={88}
                  bgColor="#ffffff"
                  fgColor="#111111"
                  level="M"
                  className="mb-2"
                />
                <p className="text-[11px] font-black text-black tracking-wider uppercase">
                  Scan to explore our cakes
                </p>
                <p className="text-[9.5px] text-gray-600">Order again on our website</p>
              </div>

              {/* Footer */}
              <div className="border-t border-black mt-3 pt-2 text-center">
                {settings.receiptFooter.trim() ? (
                  <p className="text-[10px] italic text-gray-600">{settings.receiptFooter}</p>
                ) : (
                  <p className="text-[10px] italic text-gray-600">
                    Thank you for choosing {settings.shopName}!<br />
                    Freshly baked with love
                  </p>
                )}
              </div>
            </div>

            {/* Jagged bottom edge */}
            <div
              className="receipt-jagged-edge h-3 w-full"
              style={{
                background:
                  'linear-gradient(135deg, white 25%, transparent 25%) -6px 0, ' +
                  'linear-gradient(225deg, white 25%, transparent 25%) -6px 0, ' +
                  'linear-gradient(315deg, white 25%, transparent 25%), ' +
                  'linear-gradient(45deg,  white 25%, transparent 25%)',
                backgroundSize: '12px 12px',
                backgroundColor: '#e5e7eb',
              }}
            />
          </div>

          <p className="max-w-sm break-all text-center font-mono text-[10px] text-muted">
            ESC/POS: {formatBytesHexPreview(escPosBytes, 24)}
          </p>
        </div>

        <div className="shrink-0 space-y-2.5 border-t border-line bg-card p-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))] sm:p-4 sm:pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          {printer.status === 'connected' ? (
            <button
              type="button"
              onClick={handleBluetoothPrint}
              disabled={printing}
              className={`${btnPrimary} w-full`}
            >
              <Bluetooth className="h-4 w-4" aria-hidden="true" />
              <span>
                {printing
                  ? 'Sending…'
                  : printer.mode === 'simulated'
                    ? 'Send to test simulator'
                    : `Print on ${printer.deviceName || 'Bluetooth printer'}`}
              </span>
            </button>
          ) : (
            <button type="button" onClick={onOpenPrinterSetup} className={`${btnPrimary} w-full`}>
              <Bluetooth className="h-4 w-4" aria-hidden="true" />
              <span>Connect printer to reprint</span>
            </button>
          )}

          {encodingWarnings.length > 0 && (
            <p className="rounded-lg border border-caramel/30 bg-caramel-tint px-2.5 py-2 text-[10px] font-medium text-caramel">
              {encodingWarnings[0]}
            </p>
          )}

          <button
            type="button"
            onClick={handleKitchenTicket}
            disabled={kitchenBusy || printer.status !== 'connected'}
            className={`${btnGhost} w-full`}
          >
            <ChefHat className="h-4 w-4 text-muted" aria-hidden="true" />
            <span>{kitchenBusy ? 'Sending ticket…' : 'Print kitchen / production ticket'}</span>
          </button>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={exportBusy !== null}
              className={`${btnGhost} px-2 text-[11px] sm:px-3.5 sm:text-xs`}
            >
              <FileText className="h-3.5 w-3.5 shrink-0 text-berry sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="truncate">{exportBusy === 'pdf' ? 'PDF…' : 'Send PDF'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportPng}
              disabled={exportBusy !== null}
              className={`${btnGhost} px-2 text-[11px] sm:px-3.5 sm:text-xs`}
            >
              <ImageIcon className="h-3.5 w-3.5 shrink-0 text-caramel sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="truncate">{exportBusy === 'png' ? 'Image…' : 'Share PNG'}</span>
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className={`${btnGhost} px-2 text-[11px] sm:px-3.5 sm:text-xs`}
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0 text-pistachio sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="truncate">WhatsApp</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={handleBrowserPrint} className={btnGhost}>
              <Printer className="h-4 w-4" aria-hidden="true" />
              <span>System print</span>
            </button>
            <button type="button" onClick={handleCopyText} className={btnGhost}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-pistachio" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  <span>Copy text</span>
                </>
              )}
            </button>
          </div>
          <p className="text-center text-[9.5px] text-muted">
            Reprinting an existing bill never creates another sale.
          </p>
        </div>
      </div>
    </div>
  );
}
