const CORE_STYLES = `
/* Core toggle visibility transitions and a11y helpers */
[data-customviews-toggle] {
  transition: opacity 150ms ease, transform 150ms ease, height 150ms ease, margin 150ms ease;
}

.cv-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

.cv-hidden {
  opacity: 0 !important;
  transform: translateY(-4px) !important;
  pointer-events: none !important;
}

/* Screen-reader only utility for future announcements */
.cv-sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
`;

export function injectCoreStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.querySelector('#cv-core-styles')) return;
  const style = document.createElement('style');
  style.id = 'cv-core-styles';
  style.textContent = CORE_STYLES;
  document.head.appendChild(style);
}

