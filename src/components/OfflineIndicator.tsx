import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-3"
    >
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2 text-xs font-medium text-amber-950 inline-flex items-center gap-2">
        <WifiOff className="w-3.5 h-3.5 text-amber-800 shrink-0" aria-hidden="true" />
        <span>Offline Mode — Menu, billing, and Bluetooth printing work from local device cache.</span>
      </div>
    </div>
  );
}
