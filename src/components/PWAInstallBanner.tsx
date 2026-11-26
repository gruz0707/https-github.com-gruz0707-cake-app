import { useState } from 'react';
import { Check, Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { btnGhost, focus } from '../ui';

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-card px-3 py-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src="/pwa-192x192.png"
              alt=""
              className="h-8 w-8 shrink-0 rounded-lg"
            />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-ink">
                Install Esai Cakes POS
              </p>
              <p className="truncate text-[10px] text-muted">
                Fullscreen offline billing. Native Bluetooth receipts need the Android APK.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={isInstallable ? install : () => setShowIOSGuide(true)}
              className={`inline-flex h-8 items-center gap-1.5 rounded-lg bg-berry px-2.5 text-[10.5px] font-bold text-white transition-colors hover:bg-berry-deep ${focus}`}
            >
              {isInstallable ? (
                <Download className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Smartphone className="h-3 w-3" aria-hidden="true" />
              )}
              <span>Install</span>
            </button>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss install banner"
              className={`grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-panel hover:text-ink ${focus}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4 backdrop-blur-sm"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm space-y-3 rounded-2xl border border-line bg-card p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="ios-install-title"
              className="text-[15px] font-extrabold tracking-[-0.01em] text-ink"
            >
              Install on iPhone / iPad
            </h2>
            <p className="text-xs leading-relaxed text-muted">
              1. Tap the <strong className="text-ink">Share</strong> icon in Safari&apos;s toolbar.
              <br />
              2. Scroll down and tap <strong className="text-ink">Add to Home Screen</strong>.
            </p>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="h-10 w-full rounded-xl bg-berry text-xs font-bold text-white transition-colors hover:bg-berry-deep"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function AndroidInstallCard() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showManualSteps, setShowManualSteps] = useState(false);

  return (
    <section
      aria-label="Android App Installation"
      className="flex flex-col justify-between gap-3 rounded-2xl border border-line bg-card p-4 sm:flex-row sm:items-center"
    >
      <div className="flex items-start gap-3">
        <img
          src="/pwa-192x192.png"
          alt=""
          className="h-10 w-10 shrink-0 rounded-xl"
        />
        <div>
          <h2 className="text-[13px] font-semibold text-ink">
            Android app · offline POS
          </h2>
          <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted">
            {isInstalled
              ? 'Running in standalone app mode with offline menu and receipt caching.'
              : 'Install this browser app for offline billing. Native Classic/BLE printing requires the Android APK (Web Bluetooth works only in supported browsers).'}
          </p>

          {showManualSteps && !isInstalled && (
            <p className="mt-2 rounded-lg border border-line bg-panel p-2.5 text-[10.5px] leading-relaxed text-ink">
              {isIOS ? (
                <>
                  In Safari: tap <strong>Share</strong> → <strong>Add to Home Screen</strong>.
                </>
              ) : (
                <>
                  In Chrome: open the <strong>⋮</strong> menu and tap{' '}
                  <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                </>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 sm:pl-3">
        {isInstalled ? (
          <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-pistachio-tint px-3 text-[11px] font-bold text-pistachio">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Installed</span>
          </span>
        ) : isInstallable ? (
          <button
            type="button"
            onClick={install}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-berry px-3 text-[11px] font-bold text-white transition-colors hover:bg-berry-deep"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Install app</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowManualSteps((v) => !v)}
            aria-expanded={showManualSteps}
            className={`${btnGhost} h-9 text-[11px]`}
          >
            <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{showManualSteps ? 'Hide steps' : 'Install steps'}</span>
          </button>
        )}
      </div>
    </section>
  );
}
