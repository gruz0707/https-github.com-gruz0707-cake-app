import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  AlertTriangle,
  Archive,
  Check,
  ClipboardCopy,
  Database,
  Download,
  FileSpreadsheet,
  HardDrive,
  History,
  RotateCcw,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import type { PosStore } from '../hooks/usePosStore';
import {
  parseBackup,
  serializeBackup,
  type ParsedBackup,
} from '../utils/backup';
import { Segmented } from './Segmented';
import { btnGhost, btnPrimary, card, fieldLabel, focus, input, tonePill } from '../ui';

interface DataBackupViewProps {
  store: PosStore;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatWhen(iso: string | null): string {
  if (!iso) return 'Never';
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return 'Unknown';
  return dt.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DataBackupView({ store }: DataBackupViewProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<ParsedBackup | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [mode, setMode] = useState<'replace' | 'merge'>('merge');
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [confirmSnapshot, setConfirmSnapshot] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);

  const info = store.backupInfo;
  const payload = useMemo(() => store.buildBackup(), [store.buildBackup]);
  const payloadSize = useMemo(() => serializeBackup(payload).length, [payload]);
  const undoAvailable = Boolean(info.preRestoreAt);

  const resetImport = () => {
    setParsed(null);
    setParseError(null);
    setConfirmRestore(false);
    setSourceName(null);
  };

  const acceptText = (text: string, name: string | null) => {
    const result = parseBackup(text);
    setParsed(result);
    setParseError(result.ok ? null : result.error);
    setConfirmRestore(false);
    setSourceName(name);
  };

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy('read');
    try {
      const text = await file.text();
      acceptText(text, file.name);
    } catch {
      setParsed(null);
      setParseError('Could not read that file. Try another copy of the backup.');
    } finally {
      setBusy(null);
    }
  };

  const run = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };

  const doRestore = () => {
    if (!parsed || !parsed.ok) return;
    store.restoreBackup(parsed.payload, mode);
    resetImport();
    setPasteText('');
  };

  const doSnapshotRestore = () => {
    const snap = store.getAutoBackupPayload();
    if (!snap) return;
    store.restoreBackup(snap, 'replace');
    setConfirmSnapshot(false);
  };

  const doUndo = () => {
    store.undoRestore();
  };

  const downloadSnapshot = () => {
    const snap = store.getAutoBackupPayload();
    if (!snap) return;
    void run('snapshot', () => store.exportPayload(snap, 'esai-cakes-snapshot'));
  };

  const downloadPreRestore = () => {
    const pre = store.getPreRestorePayload();
    if (!pre) return;
    void run('pre', () => store.exportPayload(pre, 'esai-cakes-pre-restore'));
  };

  const noticeTone =
    store.backupNotice?.kind === 'error'
      ? 'border-berry/25 bg-berry-tint text-berry-deep'
      : store.backupNotice?.kind === 'undo'
        ? 'border-pistachio/25 bg-pistachio-tint text-pistachio'
        : 'border-line bg-card text-ink';

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-3 pb-24 pt-3 sm:px-6 md:space-y-5 md:pb-10 md:pt-5">
      <div>
        <h1 className="text-[23px] font-extrabold tracking-[-0.02em] text-ink sm:text-[26px]">
          Data &amp; backup
        </h1>
        <p className="mt-0.5 text-[11px] text-muted sm:text-xs">
          Your catalog, bills and settings live on this device. Keep a copy somewhere else so a
          lost or reset phone never loses the shop&apos;s history.
        </p>
      </div>

      {store.backupNotice && (
        <div role="status" className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 ${noticeTone}`}>
          {store.backupNotice.kind === 'error' ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <p className="min-w-0 flex-1 text-[11.5px] font-semibold">{store.backupNotice.text}</p>
          {store.backupNotice.kind === 'restored' && undoAvailable && (
            <button
              type="button"
              onClick={doUndo}
              className={`inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border border-line bg-card px-2.5 text-[10.5px] font-bold text-ink ${focus}`}
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Undo
            </button>
          )}
          <button
            type="button"
            onClick={store.dismissBackupNotice}
            aria-label="Dismiss backup message"
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-md hover:bg-white/50 ${focus}`}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
          <div className="bg-card p-3.5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted">
              <Database className="h-3 w-3" aria-hidden="true" /> Cakes
            </p>
            <p className="mt-1 text-[17px] font-extrabold tabular-nums text-ink">{info.cakeCount}</p>
          </div>
          <div className="bg-card p-3.5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted">
              <Archive className="h-3 w-3" aria-hidden="true" /> Bills (real)
            </p>
            <p className="mt-1 text-[17px] font-extrabold tabular-nums text-ink">
              {info.realOrderCount}
              <span className="ml-1 text-[10px] font-semibold text-muted">
                / {info.orderCount} total
              </span>
            </p>
          </div>
          <div className="bg-card p-3.5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted">
              <HardDrive className="h-3 w-3" aria-hidden="true" /> On-device data
            </p>
            <p className="mt-1 text-[17px] font-extrabold tabular-nums text-ink">
              {formatBytes(info.usageBytes)}
            </p>
          </div>
          <div className="bg-card p-3.5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-muted">
              <Download className="h-3 w-3" aria-hidden="true" /> Last export
            </p>
            <p className="mt-1 text-[13px] font-extrabold tabular-nums text-ink">
              {formatWhen(info.lastExportAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-5">
        <section aria-label="Save a backup" className={`${card} space-y-3 p-4 sm:p-5`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[14px] font-extrabold text-ink">Save a backup</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                One file with the full catalog, every bill, shop settings and the open bill.
              </p>
            </div>
            <span className={tonePill('berry')}>{formatBytes(payloadSize)}</span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => void run('json', store.exportBackupJson)}
              disabled={busy !== null}
              className={btnPrimary}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>{busy === 'json' ? 'Preparing…' : 'Download backup (.json)'}</span>
            </button>
            <button
              type="button"
              onClick={() => void run('csv', store.exportBillsCsv)}
              disabled={busy !== null}
              className={btnGhost}
            >
              <FileSpreadsheet className="h-4 w-4 text-muted" aria-hidden="true" />
              <span>{busy === 'csv' ? 'Preparing…' : 'Bills spreadsheet (.csv)'}</span>
            </button>
            <button
              type="button"
              onClick={() => void run('copy', store.copyBackupToClipboard)}
              disabled={busy !== null}
              className={`${btnGhost} sm:col-span-2`}
            >
              <ClipboardCopy className="h-4 w-4 text-muted" aria-hidden="true" />
              <span>{busy === 'copy' ? 'Copying…' : 'Copy full backup to clipboard'}</span>
            </button>
          </div>

          <ul className="space-y-1 rounded-xl border border-line bg-panel/60 px-3 py-2.5 text-[10.5px] leading-relaxed text-muted">
            <li className="flex gap-1.5">
              <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-pistachio" aria-hidden="true" />
              Includes cake prices, weights, eggless/flavour rules, bill snapshots and totals.
            </li>
            <li className="flex gap-1.5">
              <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-pistachio" aria-hidden="true" />
              On Android the share sheet opens so you can save to Files, Drive or WhatsApp.
            </li>
            <li className="flex gap-1.5">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-caramel" aria-hidden="true" />
              Cake photos are bundled with the app and are not part of the backup file.
            </li>
          </ul>
        </section>

        <section aria-label="Automatic snapshot" className={`${card} space-y-3 p-4 sm:p-5`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[14px] font-extrabold text-ink">Automatic local snapshot</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                Saved on this device after the first bill of each day. A safety net, not a
                replacement for an off-device copy.
              </p>
            </div>
            <span className={tonePill(info.autoBackupAt ? 'pistachio' : 'neutral')}>
              {info.autoBackupAt ? 'Active' : 'Pending'}
            </span>
          </div>

          <p className="rounded-xl border border-line bg-panel/60 px-3 py-2.5 text-[11.5px] font-semibold tabular-nums text-ink">
            {info.autoBackupAt ? `Last snapshot: ${formatWhen(info.autoBackupAt)}` : 'No snapshot yet — checkout creates the first one.'}
          </p>

          {info.autoBackupAt && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={downloadSnapshot}
                disabled={busy !== null}
                className={btnGhost}
              >
                <Download className="h-4 w-4 text-muted" aria-hidden="true" />
                <span>Download snapshot</span>
              </button>
              {confirmSnapshot ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={doSnapshotRestore}
                    className={`inline-flex h-10 flex-1 items-center justify-center gap-1 rounded-xl bg-ink px-2 text-[11px] font-bold text-white ${focus}`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                    Confirm replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmSnapshot(false)}
                    className={`${btnGhost} h-10 px-2.5`}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmSnapshot(true)}
                  className={btnGhost}
                >
                  <History className="h-4 w-4 text-muted" aria-hidden="true" />
                  <span>Restore snapshot…</span>
                </button>
              )}
            </div>
          )}
          {confirmSnapshot && (
            <p className="text-[10.5px] font-medium text-caramel">
              This replaces current data with the snapshot. A safety copy is kept so you can undo.
            </p>
          )}
        </section>
      </div>

      <section aria-label="Restore from a backup file" className={`${card} space-y-3 p-4 sm:p-5`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[14px] font-extrabold text-ink">Restore from a backup</h2>
            <p className="mt-0.5 text-[11px] text-muted">
              Choose a file exported by this app, review what is inside, then restore.
            </p>
          </div>
          <span className={tonePill('neutral')}>Schema 2</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFile}
            className="sr-only"
            id="backup-file-input"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy !== null}
            className={btnPrimary}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span>{busy === 'read' ? 'Reading…' : 'Choose backup file'}</span>
          </button>
          <button
            type="button"
            onClick={() => setPasteOpen((v) => !v)}
            aria-expanded={pasteOpen}
            className={btnGhost}
          >
            <ClipboardCopy className="h-4 w-4 text-muted" aria-hidden="true" />
            <span>{pasteOpen ? 'Hide paste box' : 'Paste backup JSON'}</span>
          </button>
          {(parsed || parseError) && (
            <button type="button" onClick={resetImport} className={btnGhost}>
              <X className="h-4 w-4 text-muted" aria-hidden="true" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {pasteOpen && (
          <div>
            <label htmlFor="backup-paste" className={fieldLabel}>
              Backup JSON
            </label>
            <textarea
              id="backup-paste"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={5}
              placeholder='{"app":"esai-cakes-pos", …}'
              className={`${input} h-auto py-2 font-mono text-[10.5px]`}
            />
            <button
              type="button"
              onClick={() => acceptText(pasteText, 'pasted JSON')}
              disabled={!pasteText.trim()}
              className={`${btnGhost} mt-2`}
            >
              <Check className="h-4 w-4 text-muted" aria-hidden="true" />
              <span>Validate pasted backup</span>
            </button>
          </div>
        )}

        {parseError && (
          <p role="alert" className="flex items-start gap-1.5 rounded-lg border border-berry/25 bg-berry-tint px-3 py-2 text-[11px] font-semibold text-berry-deep">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {parseError}
          </p>
        )}

        {parsed && parsed.ok && (
          <div className="space-y-3 rounded-xl border border-line bg-panel/50 p-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
              <span className="font-bold text-ink">{sourceName ?? 'Backup file'}</span>
              <span className="tabular-nums">Exported {formatWhen(parsed.payload.exportedAt)}</span>
              <span className="tabular-nums">
                {parsed.payload.counts.cakes} cakes · {parsed.payload.counts.orders} bills (
                {parsed.payload.counts.realOrders} real)
              </span>
            </div>
            {parsed.warnings.length > 0 && (
              <ul className="space-y-0.5 text-[10.5px] font-medium text-caramel">
                {parsed.warnings.map((w) => (
                  <li key={w}>• {w}</li>
                ))}
              </ul>
            )}

            <div>
              <span className={fieldLabel}>Restore mode</span>
              <Segmented
                className="w-full sm:w-auto"
                ariaLabel="Restore mode"
                options={[
                  { value: 'merge' as const, label: 'Merge missing' },
                  { value: 'replace' as const, label: 'Replace everything' },
                ]}
                value={mode}
                onChange={(v) => {
                  setMode(v);
                  setConfirmRestore(false);
                }}
              />
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">
                {mode === 'merge'
                  ? 'Adds bills and cakes that are missing here. Your current prices, settings and open bill stay untouched.'
                  : 'Replaces catalog, bills, settings and the open bill with the backup contents. A safety copy of today’s data is kept for undo.'}
              </p>
            </div>

            {confirmRestore ? (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-caramel/40 bg-caramel-tint px-3 py-2.5">
                <p className="min-w-0 flex-1 text-[11px] font-semibold text-caramel">
                  {mode === 'replace'
                    ? `Replace all current data with ${parsed.payload.counts.orders} bills and ${parsed.payload.counts.cakes} cakes?`
                    : `Merge ${parsed.payload.counts.orders} bills and ${parsed.payload.counts.cakes} cakes into this device?`}
                </p>
                <button
                  type="button"
                  onClick={doRestore}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-xl bg-ink px-3.5 text-[11.5px] font-bold text-white ${focus}`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  Confirm restore
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRestore(false)}
                  className={`${btnGhost} h-10`}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmRestore(true)}
                className={btnPrimary}
              >
                <History className="h-4 w-4" aria-hidden="true" />
                <span>Restore this backup…</span>
              </button>
            )}
          </div>
        )}
      </section>

      <section aria-label="Safety copies on this device" className={`${card} space-y-3 p-4 sm:p-5`}>
        <div>
          <h2 className="text-[14px] font-extrabold text-ink">Safety copies on this device</h2>
          <p className="mt-0.5 text-[11px] text-muted">
            Kept automatically before risky operations. Download them if you want them off-device.
          </p>
        </div>

        {undoAvailable ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-pistachio/30 bg-pistachio-tint px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] font-bold text-pistachio">Pre-restore snapshot</p>
              <p className="text-[10.5px] tabular-nums text-pistachio/80">
                Data as it was before the last restore · {formatWhen(info.preRestoreAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={doUndo}
              className={`inline-flex h-9 items-center gap-1 rounded-lg bg-pistachio px-2.5 text-[10.5px] font-bold text-white ${focus}`}
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Undo restore
            </button>
            <button
              type="button"
              onClick={downloadPreRestore}
              disabled={busy !== null}
              className={`${btnGhost} h-9 px-2.5 text-[10.5px]`}
            >
              <Download className="h-3 w-3" aria-hidden="true" />
              Download
            </button>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-line-strong bg-panel/40 px-3 py-2.5 text-[10.5px] text-muted">
            No pre-restore snapshot right now. One is created automatically before any replace
            restore.
          </p>
        )}

        {info.legacyBackups.length > 0 ? (
          <ul className="space-y-1.5">
            {info.legacyBackups.map((entry) => (
              <li
                key={entry.key}
                className="flex items-center justify-between gap-2 rounded-lg border border-line bg-card px-2.5 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-[10px] font-semibold text-ink">{entry.key}</p>
                  <p className="text-[9.5px] tabular-nums text-muted">
                    v1 migration backup · {formatBytes(entry.bytes)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void run(entry.key, () => store.exportLegacyBackup(entry.key))}
                  disabled={busy !== null}
                  className={`${btnGhost} h-8 shrink-0 px-2 text-[10px]`}
                >
                  <Download className="h-3 w-3" aria-hidden="true" />
                  Download
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[10.5px] text-muted">
            No legacy v1 backups on this device (fresh install or already cleaned up).
          </p>
        )}
      </section>
    </div>
  );
}
