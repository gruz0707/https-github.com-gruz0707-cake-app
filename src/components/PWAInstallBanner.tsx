import { useState } from 'react';
import { Check, Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3">
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/pwa-192x192.png"
              alt="Crème & Crumb POS icon"
              className="w-10 h-10 rounded-xl shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                Install Crème &amp; Crumb POS
              </p>
              <p className="text-xs text-slate-500 truncate">
                Run fullscreen on Android with offline billing &amp; Bluetooth printing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isInstallable ? (
              <button
                type="button"
                onClick={install}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Install App</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowIOSGuide(true)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Install on iOS</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss install banner"
              className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 border border-slate-200 shadow-xl space-y-3">
            <h2 id="ios-install-title" className="font-display text-lg font-semibold text-slate-900">
              Install on iPhone / iPad
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              1. Tap the <strong>Share</strong> icon in Safari&apos;s toolbar.
              <br />
              2. Scroll down and tap <strong>Add to Home Screen</strong>.
            </p>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full min-h-[44px] rounded-xl bg-slate-900 text-white text-sm font-semibold"
            >
              Got It
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
      className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3.5">
        <img
          src="/pwa-192x192.png"
          alt="Crème & Crumb Android App Icon"
          className="w-12 h-12 rounded-xl shrink-0"
        />
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Android Mobile App (Offline POS)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {isInstalled
              ? 'Running in standalone mobile app mode with offline menu & receipt caching.'
              : 'Install Crème & Crumb POS on your Android phone home screen for fullscreen offline billing and direct Web Bluetooth printing.'}
          </p>

          {showManualSteps && !isInstalled && (
            <p className="mt-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 leading-relaxed">
              {isIOS ? (
                <>
                  On iPhone/iPad Safari: tap <strong>Share</strong> →{' '}
                  <strong>Add to Home Screen</strong>.
                </>
              ) : (
                <>
                  On Android Chrome: open the browser menu (<strong>⋮</strong>) in the top right
                  and tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                </>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0">
        {isInstalled ? (
          <span className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap">
            <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
            <span>Installed App</span>
          </span>
        ) : isInstallable ? (
          <button
            type="button"
            onClick={install}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Install Android App</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowManualSteps((v) => !v)}
            aria-expanded={showManualSteps}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-semibold inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Smartphone className="w-4 h-4" aria-hidden="true" />
            <span>{showManualSteps ? 'Hide Install Steps' : 'How to Install on Android'}</span>
          </button>
        )}
      </div>
    </section>
  );
}
