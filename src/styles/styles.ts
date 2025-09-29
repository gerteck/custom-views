const CORE_STYLES = `
[data-customviews-toggle] {
  transition: opacity 150ms ease,
              transform 150ms ease,
              max-height 200ms ease,
              margin 150ms ease;
  will-change: opacity, transform, max-height, margin;
}

.cv-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
  max-height: var(--cv-max-height, 9999px) !important;
}

.cv-hidden {
  opacity: 0 !important;
  transform: translateY(-4px) !important;
  pointer-events: none !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border-top-width: 0 !important;
  border-bottom-width: 0 !important;
  max-height: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  overflow: hidden !important;
}
`;

/**
 * Add styles for hiding and showing toggles animations and transitions to the document head
 */
export function injectCoreStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.querySelector('#cv-core-styles')) return;
  const style = document.createElement('style');
  style.id = 'cv-core-styles';
  style.textContent = CORE_STYLES;
  document.head.appendChild(style);
}


