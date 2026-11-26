import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bike,
  Check,
  ChefHat,
  MessageCircle,
  Pencil,
  Printer,
  Store,
  Wallet,
  X,
} from 'lucide-react';
import type { PosStore } from '../hooks/usePosStore';
import type { BillOrder, FulfilmentType, OrderStatus, PaymentMethod } from '../types/pos';
import { formatCurrency } from '../utils/billing';
import {
  NEXT_STATUS,
  STATUS_LABEL,
  dueBucket,
  formatDueLabel,
  isScheduled,
  orderAdvance,
  orderBalance,
  orderStatus,
} from '../utils/orders';
import { describeCartItem } from '../utils/pricing';
import { ScheduleFields } from './ScheduleFields';
import { Segmented } from './Segmented';
import { btnGhost, btnPrimary, card, fieldLabel, focus, inputSmall, tonePill } from '../ui';

interface ProductionBoardProps {
  store: PosStore;
  onSelectOrder: (order: BillOrder) => void;
}

const STATUS_TONE: Record<OrderStatus, 'berry' | 'caramel' | 'pistachio' | 'neutral'> = {
  scheduled: 'neutral',
  baking: 'caramel',
  ready: 'pistachio',
  completed: 'pistachio',
  cancelled: 'berry',
};

/** One plain list of cakes still to bake / hand over. No dashboards. */
export function ProductionBoard({ store, onSelectOrder }: ProductionBoardProps) {
  const [settlingId, setSettlingId] = useState<string | null>(null);
  const [settleMethod, setSettleMethod] = useState<PaymentMethod>('Cash');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{
    type: FulfilmentType;
    date: string;
    time: string;
    address: string;
  } | null>(null);
  const [editErrors, setEditErrors] = useState<string[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const active = useMemo(
    () =>
      store.orders
        .filter((o) => isScheduled(o))
        .sort((a, b) => {
          const ka = `${a.fulfilment?.date ?? ''} ${a.fulfilment?.time ?? ''}`;
          const kb = `${b.fulfilment?.date ?? ''} ${b.fulfilment?.time ?? ''}`;
          return ka.localeCompare(kb);
        }),
    [store.orders],
  );

  const advancesHeld = active.reduce((sum, o) => sum + orderAdvance(o), 0);
  const balanceDue = active.reduce((sum, o) => sum + orderBalance(o), 0);
  const curr = store.settings.currencySymbol;

  const startEdit = (order: BillOrder) => {
    setEditingId(order.id);
    setEditErrors([]);
    setEditDraft({
      type: order.fulfilment?.type ?? 'pickup',
      date: order.fulfilment?.date ?? '',
      time: order.fulfilment?.time ?? '',
      address: order.fulfilment?.address ?? '',
    });
  };

  const saveEdit = (order: BillOrder) => {
    if (!editDraft) return;
    const result = store.updateOrderFulfilment(order.id, editDraft);
    if (!result.ok) {
      setEditErrors(result.errors ?? ['Could not update schedule.']);
      return;
    }
    setEditingId(null);
    setEditDraft(null);
  };

  const sendWhatsApp = async (order: BillOrder) => {
    const { url, text } = store.orderWhatsApp(order);
    try {
      await navigator.clipboard.writeText(text);
      setFeedback('Order message copied. WhatsApp opens ready to send.');
    } catch {
      setFeedback('WhatsApp opens with the order message ready to send.');
    }
    window.open(url, '_blank', 'noopener');
  };

  const printTicket = async (order: BillOrder) => {
    setBusyId(order.id);
    const result = await store.printKitchenTicket(order);
    setBusyId(null);
    setFeedback(
      result.ok
        ? `Kitchen ticket for ${order.billNumber} sent${
            store.printer.mode === 'simulated' ? ' to the test simulator (no paper)' : ''
          }.`
        : result.error ?? 'Kitchen ticket failed.',
    );
  };

  return (
    <div className="space-y-3">
      <p className="px-0.5 text-[11px] font-semibold tabular-nums text-muted">
        {active.length} upcoming · advances {formatCurrency(advancesHeld, curr)} · balance to
        collect {formatCurrency(balanceDue, curr)}
      </p>

      {(store.orderNotice || feedback) && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-xl border border-line bg-card px-3 py-2.5"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-pistachio" aria-hidden="true" />
          <p className="min-w-0 flex-1 text-[11.5px] font-semibold text-ink">
            {store.orderNotice?.text ?? feedback}
          </p>
          {store.orderNotice?.kind === 'cancelled' && (
            <button
              type="button"
              onClick={store.undoCancel}
              className={`inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border border-line bg-panel px-2.5 text-[10.5px] font-bold text-ink ${focus}`}
            >
              Undo
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              store.dismissOrderNotice();
              setFeedback(null);
            }}
            aria-label="Dismiss message"
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-md hover:bg-panel ${focus}`}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {active.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-strong bg-card/60 px-6 py-10 text-center">
          <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-panel text-muted">
            <ChefHat className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="mt-2.5 text-[12.5px] font-semibold text-ink">No cakes waiting</p>
          <p className="mx-auto mt-1 max-w-sm text-[10.5px] text-muted">
            On the counter choose “Schedule”, pick a date and slot, and save the order.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {active.map((order) => {
            const status = orderStatus(order);
            const next = NEXT_STATUS[status];
            const balance = orderBalance(order);
            const overdue = dueBucket(order) === 'overdue';
            return (
              <article key={order.id} className={`${card} space-y-2 p-3`}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <button
                    type="button"
                    onClick={() => onSelectOrder(order)}
                    className={`text-[12px] font-extrabold tabular-nums text-ink underline-offset-2 hover:underline ${focus}`}
                  >
                    {order.billNumber}
                  </button>
                  <span className={tonePill(STATUS_TONE[status])}>{STATUS_LABEL[status]}</span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10.5px] font-semibold ${
                      overdue ? 'text-berry-deep' : 'text-muted'
                    }`}
                  >
                    {order.fulfilment?.type === 'delivery' ? (
                      <Bike className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <Store className="h-3 w-3" aria-hidden="true" />
                    )}
                    {formatDueLabel(order)}
                    {overdue ? ' · overdue' : ''}
                  </span>
                  <span className="ml-auto text-[12px] font-bold tabular-nums text-ink">
                    {formatCurrency(order.total, curr)}
                  </span>
                </div>

                <p className="text-[11px] font-semibold text-ink">
                  {order.customerName || 'Walk-in customer'}
                  {order.customerPhone ? (
                    <span className="ml-1.5 font-medium tabular-nums text-muted">
                      {order.customerPhone}
                    </span>
                  ) : null}
                </p>
                <p className="text-[10.5px] leading-relaxed text-muted">
                  {order.items
                    .map((i) => `${i.quantity}× ${i.cakeName} (${describeCartItem(i)})`)
                    .join(' · ')}
                </p>
                {order.fulfilment?.type === 'delivery' && order.fulfilment.address && (
                  <p className="rounded-lg bg-panel/70 px-2 py-1.5 text-[10px] text-muted">
                    {order.fulfilment.address}
                  </p>
                )}
                <p className="text-[10.5px] font-semibold tabular-nums">
                  <span className="text-pistachio">
                    Advance {formatCurrency(orderAdvance(order), curr)}
                  </span>
                  <span className="mx-1.5 text-muted">·</span>
                  <span className={balance > 0 ? 'text-caramel' : 'text-pistachio'}>
                    {balance > 0 ? `Balance ${formatCurrency(balance, curr)}` : 'Paid in full'}
                  </span>
                </p>

                <div className="flex flex-wrap items-center gap-1.5">
                  {next && next !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => store.setOrderStatus(order.id, next)}
                      className={`${btnPrimary} h-9 px-3 text-[11px]`}
                    >
                      <ChefHat className="h-3.5 w-3.5" aria-hidden="true" />
                      {next === 'baking' ? 'Start baking' : 'Mark ready'}
                    </button>
                  )}
                  {next === 'completed' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSettlingId(settlingId === order.id ? null : order.id);
                        setSettleMethod('Cash');
                      }}
                      className={`${btnPrimary} h-9 px-3 text-[11px]`}
                    >
                      <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
                      Hand over{balance > 0 ? ` · ${formatCurrency(balance, curr)}` : ''}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void printTicket(order)}
                    disabled={busyId === order.id}
                    className={`${btnGhost} h-9 px-2.5 text-[10.5px]`}
                  >
                    <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                    Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => void sendWhatsApp(order)}
                    className={`${btnGhost} h-9 px-2.5 text-[10.5px]`}
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(order)}
                    className={`${btnGhost} h-9 px-2.5 text-[10.5px]`}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCancellingId(cancellingId === order.id ? null : order.id);
                      setCancelReason('');
                    }}
                    className={`${btnGhost} h-9 px-2.5 text-[10.5px] hover:border-berry/30 hover:bg-berry-tint hover:text-berry-deep`}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                    Cancel
                  </button>
                </div>

                {settlingId === order.id && (
                  <div className="space-y-2 rounded-xl border border-line bg-panel/60 p-2.5">
                    <span className={fieldLabel}>Balance payment method</span>
                    <Segmented
                      className="w-full"
                      ariaLabel="Balance payment method"
                      options={[
                        { value: 'Cash' as const, label: 'Cash' },
                        { value: 'UPI' as const, label: 'UPI' },
                        { value: 'Card' as const, label: 'Card' },
                      ]}
                      value={settleMethod}
                      onChange={setSettleMethod}
                    />
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          store.settleBalance(order.id, settleMethod);
                          setSettlingId(null);
                        }}
                        className={`${btnPrimary} h-9 flex-1 text-[11px]`}
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        {balance > 0
                          ? `Received ${formatCurrency(balance, curr)} · complete`
                          : 'Mark completed'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettlingId(null)}
                        className={`${btnGhost} h-9 px-2.5`}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}

                {editingId === order.id && editDraft && (
                  <div className="space-y-2 rounded-xl border border-line bg-panel/60 p-2.5">
                    <ScheduleFields
                      compact
                      type={editDraft.type}
                      date={editDraft.date}
                      time={editDraft.time}
                      address={editDraft.address}
                      onType={(t) => setEditDraft({ ...editDraft, type: t })}
                      onDate={(d) => setEditDraft({ ...editDraft, date: d })}
                      onTime={(t) => setEditDraft({ ...editDraft, time: t })}
                      onAddress={(a) => setEditDraft({ ...editDraft, address: a })}
                    />
                    {editErrors.length > 0 && (
                      <ul className="space-y-0.5 text-[10px] font-semibold text-berry-deep">
                        {editErrors.map((e) => (
                          <li key={e}>• {e}</li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => saveEdit(order)}
                        className={`${btnPrimary} h-9 flex-1 text-[11px]`}
                      >
                        Save schedule
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className={`${btnGhost} h-9 px-2.5`}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}

                {cancellingId === order.id && (
                  <div className="space-y-2 rounded-xl border border-berry/25 bg-berry-tint p-2.5">
                    <label htmlFor={`cancel-${order.id}`} className={fieldLabel}>
                      Reason (kept in history)
                    </label>
                    <input
                      id={`cancel-${order.id}`}
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Customer postponed / duplicate…"
                      className={inputSmall}
                    />
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          store.cancelOrder(order.id, cancelReason);
                          setCancellingId(null);
                        }}
                        className={`inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-xl bg-ink px-2 text-[11px] font-bold text-white ${focus}`}
                      >
                        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                        Confirm cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancellingId(null)}
                        className={`${btnGhost} h-9 px-2.5`}
                      >
                        Keep
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
