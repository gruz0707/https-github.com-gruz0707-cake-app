import { Bluetooth, BluetoothConnected } from 'lucide-react';
import type { ActiveTab, BluetoothPrinterState } from '../types/pos';

interface TopNavProps {
  shopName: string;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  printer: BluetoothPrinterState;
  onOpenPrinterTab: () => void;
}

const NAV_ITEMS: Array<{ id: ActiveTab; label: string }> = [
  { id: 'pos', label: 'Counter' },
  { id: 'catalog', label: 'Cake Menu' },
  { id: 'orders', label: 'Bills' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'printer', label: 'Printer' },
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

  return (
    <header className="bg-white border-b border-slate-200 md:sticky md:top-0 md:z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-13 md:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('pos')}
          className="font-display text-lg md:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 rounded"
        >
          {shopName}
        </button>

        {/* Zone 2: Desktop Single-Line Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`py-2 text-sm font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                  active
                    ? 'border-slate-900 text-slate-950'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenPrinterTab}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
              isConnected
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isConnected ? (
              <BluetoothConnected className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
            ) : (
              <Bluetooth className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>
              {isConnecting
                ? 'Pairing...'
                : isConnected
                  ? printer.mode === 'simulated'
                    ? 'Virtual Printer'
                    : 'Printer Ready'
                  : 'Connect Printer'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
