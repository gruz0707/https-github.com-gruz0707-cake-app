import { Bluetooth, BluetoothConnected, CakeSlice } from 'lucide-react';
import { motion } from 'motion/react';
import type { ActiveTab, BluetoothPrinterState } from '../types/pos';
import { focus } from '../ui';

interface TopNavProps {
  shopName: string;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  printer: BluetoothPrinterState;
  onOpenPrinterTab: () => void;
}

const NAV_ITEMS: Array<{ id: ActiveTab; label: string }> = [
  { id: 'pos', label: 'Counter' },
  { id: 'catalog', label: 'Menu' },
  { id: 'orders', label: 'Bills' },
  { id: 'dashboard', label: 'Sales' },
  { id: 'printer', label: 'Settings' },
  { id: 'data', label: 'Backup' },
];

export function TopNav({
  shopName,
  activeTab,
  onSelectTab,
  printer,
  onOpenPrinterTab,
}: TopNavProps) {
  const isConnected = printer.status === 'connected';
  const isConnecting = printer.status === 'connecting';

  const printerLabel = isConnecting
    ? 'Connecting…'
    : isConnected
      ? printer.mode === 'simulated'
        ? 'Test simulator'
        : printer.deviceName || 'Printer ready'
      : printer.status === 'error'
        ? 'Printer error'
        : printer.lastJobState === 'failed' || printer.lastJobState === 'uncertain'
          ? 'Print needs attention'
          : 'Printer offline';

  const printerAria = isConnected ? printerLabel : 'Printer offline';

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onSelectTab('pos')}
          className={`flex min-w-0 items-center gap-2.5 rounded-xl ${focus}`}
          aria-label={`${shopName} — go to counter`}
        >
          <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px] bg-berry text-white">
            <CakeSlice className="h-[17px] w-[17px]" aria-hidden="true" />
          </span>
          <span className="min-w-0 text-left">
            <span className="block truncate text-[14px] font-extrabold tracking-[-0.01em] text-ink">
              {shopName}
            </span>
            <span className="hidden text-[9.5px] font-medium leading-tight text-muted sm:block">
              Cake counter
            </span>
          </span>
        </button>

        <nav
          aria-label="Primary Navigation"
          className="ml-2 hidden items-center gap-0.5 rounded-full border border-line bg-card p-1 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${focus} ${
                  active ? 'text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="top-nav-active"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-[11px] font-medium tabular-nums text-muted lg:block">
            {today}
          </span>

          <button
            type="button"
            onClick={onOpenPrinterTab}
            aria-label={`Printer status: ${printerAria}. Open printer settings`}
            className={`inline-flex h-8 max-w-[160px] items-center gap-2 rounded-full border border-line bg-card px-3 text-[11px] font-semibold text-ink transition-colors hover:border-line-strong hover:bg-panel ${focus}`}
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                isConnected
                  ? 'bg-pistachio'
                  : isConnecting
                    ? 'animate-pulse bg-caramel'
                    : printer.status === 'error'
                      ? 'bg-berry'
                      : 'bg-muted-soft'
              }`}
              aria-hidden="true"
            />
            {isConnected ? (
              <BluetoothConnected className="h-3.5 w-3.5 shrink-0 text-pistachio" aria-hidden="true" />
            ) : (
              <Bluetooth className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
            )}
            <span className="truncate">{printerLabel}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
