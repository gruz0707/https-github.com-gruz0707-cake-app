import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div role="status" className="mx-auto max-w-7xl px-4 pt-3 sm:px-6">
      <div className="inline-flex items-center gap-2 rounded-lg border border-caramel/25 bg-caramel-tint px-2.5 py-1.5 text-[10.5px] font-semibold text-ink">
        <WifiOff className="h-3 w-3 shrink-0 text-caramel" aria-hidden="true" />
        <span>Offline mode — billing, menu, and Bluetooth printing work from local cache.</span>
      </div>
    </div>
  );
}
