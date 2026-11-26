import { useCallback, useEffect, useRef } from 'react';

/**
 * Makes Android Back dismiss a sheet instead of leaving the app, without
 * touching the active bill. Returns an explicit close function for buttons.
 */
export function useSheetHistory(active: boolean, onClose: () => void): () => void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const pushedRef = useRef(false);
  const markerIdRef = useRef(`esai-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!active) return;
    const marker = { __esaiSheet: markerIdRef.current };
    let pushed = false;
    try {
      window.history.pushState(marker, '');
      pushed = true;
    } catch {
      pushed = false;
    }
    pushedRef.current = pushed;

    let closed = false;
    const onPop = () => {
      if (closed) return;
      // Nested sheets each push a marker. If this sheet's marker is still the
      // current history entry, a child sheet closed — don't close the parent.
      const state = window.history.state as { __esaiSheet?: string } | null;
      if (state && state.__esaiSheet === markerIdRef.current) return;
      closed = true;
      pushedRef.current = false;
      onCloseRef.current();
    };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
    };
  }, [active]);

  const close = useCallback(() => {
    onCloseRef.current();
    if (pushedRef.current) {
      pushedRef.current = false;
      try {
        window.history.back();
      } catch {
        // Embedded webviews may not expose history; the sheet still closes.
      }
    }
  }, []);

  return close;
}
