// Shared class recipes for the Esai Cakes POS design system.
export const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-berry';

export const card = 'rounded-2xl border border-line bg-card';

export const input =
  'w-full h-10 px-3 text-[13px] rounded-xl border border-line bg-card text-ink placeholder:text-muted/50 focus:border-berry focus:ring-[3px] focus:ring-berry/10 focus:outline-none transition';

export const inputSmall =
  'w-full h-9 px-2.5 text-xs rounded-lg border border-line bg-card text-ink placeholder:text-muted/50 focus:border-berry focus:ring-[3px] focus:ring-berry/10 focus:outline-none transition';

export const btnPrimary = `inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-berry text-white text-[13px] font-bold shadow-sm shadow-berry/20 hover:bg-berry-deep active:scale-[0.99] transition disabled:opacity-60 disabled:pointer-events-none ${focus}`;

export const btnGhost = `inline-flex items-center justify-center gap-2 h-10 px-3.5 rounded-xl border border-line bg-card text-ink text-xs font-semibold hover:bg-panel hover:border-line-strong active:scale-[0.99] transition disabled:opacity-60 disabled:pointer-events-none ${focus}`;

export const iconBtn = `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-muted transition-colors hover:bg-panel hover:text-ink hover:border-line-strong ${focus}`;

export const fieldLabel = 'block text-[11px] font-semibold text-muted mb-1.5';

export function chip(active: boolean): string {
  return `h-9 px-3 rounded-full border text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${focus} ${
    active
      ? 'bg-ink border-ink text-white shadow-sm'
      : 'bg-card border-line text-muted hover:text-ink hover:border-line-strong'
  }`;
}

export function tonePill(tone: 'pistachio' | 'caramel' | 'berry' | 'neutral'): string {
  const tones = {
    pistachio: 'bg-pistachio-tint text-pistachio',
    caramel: 'bg-caramel-tint text-caramel',
    berry: 'bg-berry-tint text-berry-deep',
    neutral: 'bg-panel text-muted border border-line',
  } as const;
  return `inline-flex items-center gap-1 min-h-[22px] px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap ${tones[tone]}`;
}
