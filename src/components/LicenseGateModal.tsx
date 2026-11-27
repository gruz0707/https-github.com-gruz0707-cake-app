import { useState, type FormEvent } from 'react';
import { Check, Copy, Download, KeyRound, Lock, MessageCircle, ShieldAlert, X } from 'lucide-react';
import type { LicenseEvaluation } from '../utils/licensing';
import { btnGhost, btnPrimary, fieldLabel, focus, input } from '../ui';

interface LicenseGateModalProps {
  evaluation: LicenseEvaluation;
  locked: boolean;
  onActivate: (key: string) => { ok: boolean; error?: string };
  onExportBackup: () => void;
  onClose?: () => void;
}

export function LicenseGateModal({
  evaluation,
  locked,
  onActivate,
  onExportBackup,
  onClose,
}: LicenseGateModalProps) {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyDevice = async () => {
    try {
      await navigator.clipboard.writeText(evaluation.deviceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = onActivate(keyInput);
    if (!res.ok) {
      setError(res.error ?? 'Invalid activation key.');
    }
  };

  const whatsAppHref = `https://wa.me/?text=${encodeURIComponent(
    `Hi UBSC Software, please send an activation key for Esai Cakes POS.\nDevice Code: ${evaluation.deviceId}`,
  )}`;

  const expiryText = evaluation.expiresAt
    ? new Date(evaluation.expiresAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="license-gate-title"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={!locked && onClose ? onClose : undefined}
    >
      <div
        className="animate-sheet-up w-full max-w-md overflow-hidden rounded-2xl border border-line bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line bg-panel px-5 py-4">
          <div className="flex items-center gap-3">
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                evaluation.status === 'clock_tampered'
                  ? 'bg-berry-tint text-berry-deep'
                  : locked
                    ? 'bg-caramel-tint text-caramel'
                    : 'bg-berry-tint text-berry'
              }`}
            >
              {evaluation.status === 'clock_tampered' ? (
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              ) : locked ? (
                <Lock className="h-5 w-5" aria-hidden="true" />
              ) : (
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <div>
              <h2 id="license-gate-title" className="text-base font-extrabold text-ink">
                {evaluation.status === 'clock_tampered'
                  ? 'Device Clock Changed'
                  : locked
                    ? 'Trial Ended — Activate POS'
                    : 'Activate Esai Cakes POS'}
              </h2>
              <p className="mt-0.5 text-[11px] text-muted">
                {evaluation.status === 'trial' && expiryText
                  ? `${evaluation.daysLeft} ${evaluation.daysLeft === 1 ? 'day' : 'days'} left in trial (ends ${expiryText})`
                  : 'Enter your UBSC Software license key to continue'}
              </p>
            </div>
          </div>
          {!locked && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close activation modal"
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-card hover:text-ink ${focus}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="space-y-4 p-5">
          {evaluation.reason && (
            <p className="rounded-xl border border-caramel/30 bg-caramel-tint px-3.5 py-2.5 text-xs font-medium text-caramel">
              {evaluation.reason}
            </p>
          )}

          {/* Device Code */}
          <div className="rounded-xl border border-line bg-panel p-3.5">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted">
              Your Device Code
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <code className="font-mono text-base font-extrabold tracking-wider text-ink">
                {evaluation.deviceId}
              </code>
              <button
                type="button"
                onClick={handleCopyDevice}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 text-[11px] font-semibold text-ink hover:bg-cream"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-pistachio" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-1.5 text-[10.5px] text-muted">
              Send this Device Code to get your activation key.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="license-key-input" className={fieldLabel}>
                Activation Key
              </label>
              <input
                id="license-key-input"
                type="text"
                value={keyInput}
                onChange={(e) => {
                  setKeyInput(e.target.value.toUpperCase());
                  setError(null);
                }}
                placeholder="ESAI-30D-261227-XXXXXX"
                autoCapitalize="characters"
                spellCheck={false}
                className={`${input} font-mono uppercase tracking-wide`}
              />
              {error && (
                <p role="alert" className="mt-1.5 text-xs font-medium text-berry-deep">
                  {error}
                </p>
              )}
            </div>

            <button type="submit" className={`${btnPrimary} w-full`}>
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              <span>Activate License</span>
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className={btnGhost}
            >
              <MessageCircle className="h-4 w-4 text-pistachio" aria-hidden="true" />
              <span>Send Code</span>
            </a>
            <button type="button" onClick={onExportBackup} className={btnGhost}>
              <Download className="h-4 w-4 text-muted" aria-hidden="true" />
              <span>Export Backup</span>
            </button>
          </div>

          <p className="text-center text-[10px] text-muted">
            Licensed by UBSC Software · Works 100% offline
          </p>
        </div>
      </div>
    </div>
  );
}
