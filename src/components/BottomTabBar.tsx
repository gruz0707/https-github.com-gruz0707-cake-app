import { BarChart3, Bluetooth, CakeSlice, ReceiptText, Store } from 'lucide-react';
import type { ActiveTab } from '../types/pos';

interface BottomTabBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  printerConnected: boolean;
}

const TABS: Array<{
  id: ActiveTab;
  label: string;
  Icon: typeof Store;
}> = [
  { id: 'pos', label: 'Counter', Icon: Store },
  { id: 'catalog', label: 'Cakes', Icon: CakeSlice },
  { id: 'orders', label: 'Bills', Icon: ReceiptText },
  { id: 'dashboard', label: 'Dashboard', Icon: BarChart3 },
  { id: 'printer', label: 'Printer', Icon: Bluetooth },
];

export function BottomTabBar({
  activeTab,
  onSelectTab,
  printerConnected,
}: BottomTabBarProps) {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe"
    >
      <div className="grid grid-cols-5 h-14">
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTab(id)}
              aria-current={active ? 'page' : undefined}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-slate-900 ${
                active ? 'text-slate-950' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 ${active ? 'stroke-[2.2]' : 'stroke-[1.75]'}`}
                  aria-hidden="true"
                />
                {id === 'printer' && printerConnected && (
                  <span className="sr-only">(Connected)</span>
                )}
              </div>
              <span className={active ? 'font-semibold' : ''}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
