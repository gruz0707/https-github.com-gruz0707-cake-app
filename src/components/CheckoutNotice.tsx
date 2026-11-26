import { useState } from 'react';
import { AlertTriangle, Check, Printer, ReceiptText, X } from 'lucide-react';
import type { CheckoutNotice as Notice } from '../hooks/usePosStore';
import type { BillOrder } from '../types/pos';
import { focus } from '../ui';

interface CheckoutNoticeProps {
  notice: Notice;
  printerConnected: boolean;
  onDismiss: () => void;
  onReprint: (order: BillOrder) => Promise<unknown>;
  onViewOrder: (order: BillOrder) => void;
}

export function CheckoutNotice({
  notice,
  printerConnected,
  onDismiss,
  onReprint,
  onViewOrder,
}: CheckoutNoticeProps) {
  const [retrying, setRetrying] = useState(false);
  const succeeded = notice.status === 'printed';
  const isFailure =
    notice.status === 'print-failed' ||
    notice.status === 'print-uncertain' ||
    notice.status === 'save-failed';

  const tone = isFailure
    ? 'border-berry/25 bg-berry-tint text-berry-deep'
    : succeeded
      ? 'border-pistachio/25 bg-pistachio-tint text-pistachio'
      : 'border-line bg-card text-ink';

  const handleRetry = async () => {
    if (!notice.order) return;
    setRetrying(true);
    try {
      await onReprint(notice.order);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className={`border-b ${tone}`} role="status" aria-live="polite">
      <div className="mx-auto flex max-w-7xl items-start gap-2.5 px-4 py-2 sm:px-6">
        <span className="mt-0.5 shrink-0">
          {isFailure ? (
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Check className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-bold leading-tight">{notice.title}</p>
          <p className="mt-0.5 text-[10.5px] font-medium opacity-80">{notice.detail}</p>
          {notice.error && (
            <p className="mt-0.5 break-words text-[10px] font-medium opacity-70">
              {notice.error}
            </p>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {notice.order && (
              <button
                type="button"
                onClick={() => onViewOrder(notice.order!)}
                className={`inline-flex h-7 items-center gap-1 rounded-md border border-black/10 bg-white/60 px-2 text-[10px] font-bold transition-colors hover:bg-white ${focus}`}
              >
                <ReceiptText className="h-3 w-3" aria-hidden="true" />
                View receipt
              </button>
            )}
            {notice.order && isFailure && (
              <button
                type="button"
                onClick={handleRetry}
                disabled={retrying || !printerConnected}
                className={`inline-flex h-7 items-center gap-1 rounded-md border border-black/10 bg-white/60 px-2 text-[10px] font-bold transition-colors hover:bg-white disabled:opacity-50 ${focus}`}
              >
                <Printer className="h-3 w-3" aria-hidden="true" />
                {retrying
                  ? 'Retrying…'
                  : printerConnected
                    ? 'Retry this bill'
                    : 'Printer offline'}
              </button>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss checkout message"
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-md transition-colors hover:bg-white/60 ${focus}`}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
