import { BarChart3, Bluetooth, CakeSlice, DatabaseBackup, ReceiptText, Store } from 'lucide-react';
import { motion } from 'motion/react';
import type { ActiveTab } from '../types/pos';
import { focus } from '../ui';

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
  { id: 'catalog', label: 'Menu', Icon: CakeSlice },
  { id: 'orders', label: 'Bills', Icon: ReceiptText },
  { id: 'dashboard', label: 'Sales', Icon: BarChart3 },
  { id: 'printer', label: 'Settings', Icon: Bluetooth },
  { id: 'data', label: 'Backup', Icon: DatabaseBackup },
];

export function BottomTabBar({
  activeTab,
  onSelectTab,
  printerConnected,
}: BottomTabBarProps) {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-card/95 backdrop-blur-xl md:hidden pb-safe"
    >
      <div className="grid h-[60px] grid-cols-6">
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTab(id)}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 transition-colors ${focus} ${
                active ? 'text-berry-deep' : 'text-muted hover:text-ink'
              }`}
            >
              <span className="relative flex h-7 w-12 items-center justify-center">
                {active && (
                  <motion.span
                    layoutId="mobile-tab-active"
                    className="absolute inset-0 rounded-full bg-berry-tint"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                    aria-hidden="true"
                  />
                )}
                <Icon
                  className={`relative z-10 h-[19px] w-[19px] ${
                    active ? 'stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                  aria-hidden="true"
                />
                {id === 'printer' && printerConnected && (
                  <span
                    className="absolute right-2 top-0 z-10 h-1.5 w-1.5 rounded-full bg-pistachio ring-2 ring-card"
                    aria-hidden="true"
                  />
                )}
                {id === 'printer' && printerConnected && (
                  <span className="sr-only">(Connected)</span>
                )}
              </span>
              <span className={`text-[10px] leading-none ${active ? 'font-bold' : 'font-semibold'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
