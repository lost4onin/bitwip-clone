/**
 * Scroll-linked motion. Every element with `data-scroll` gets a `--progress`
 * custom property between 0 and 1 that follows the scroll position; CSS turns
 * it into zooms, parallax, horizontal rows and pinned scenes.
 *
 * Modes (the attribute value):
 * - `view` (default): 0 when the element's top enters at the bottom of the
 *   viewport, 1 when its bottom leaves at the top.
 * - `exit`: 0 while the element's top is at the top of the viewport, 1 once
 *   its bottom has scrolled past it. Used for elements that start on screen.
 * - `pin`: for a tall track holding a `position: sticky` stage. 0 when the
 *   track reaches the top, 1 when its end does.
 *
 * Only elements near the viewport are measured, and all writes happen in one
 * animation frame per scroll. With reduced motion nothing is set, and the CSS
 * falls back to the static layout.
 */
type Mode = 'view' | 'exit' | 'pin';

const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

function progress(el: HTMLElement, mode: Mode, vh: number): number {
  const { top, height } = el.getBoundingClientRect();
  switch (mode) {
    case 'pin':
      return clamp(-top / Math.max(height - vh, 1));
    case 'exit':
      return clamp(-top / Math.max(height, 1));
    default:
      return clamp((vh - top) / (vh + height));
  }
}

export function initScroll(): void {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll]'));
  if (!elements.length || !('IntersectionObserver' in window)) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set<HTMLElement>();
  let queued = false;

  const update = () => {
    queued = false;
    if (reduceMotion.matches) return;
    const vh = window.innerHeight;
    for (const el of active) {
      const mode = (el.dataset.scroll || 'view') as Mode;
      el.style.setProperty('--progress', progress(el, mode, vh).toFixed(4));
    }
  };

  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  // Start measuring a little before an element appears, so it never pops.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) active.add(el);
        else active.delete(el);
      }
      queue();
    },
    { rootMargin: '50% 0px' },
  );

  elements.forEach((el) => observer.observe(el));
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);

  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) elements.forEach((el) => el.style.removeProperty('--progress'));
    queue();
  });
}
