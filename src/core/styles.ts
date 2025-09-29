const CORE_STYLES = `
/* Core toggle visibility transitions and a11y helpers */
[data-customviews-toggle] {
  /* Use max-height for collapsible vertical animation without JS measurements */
  transition: opacity 150ms ease,
              transform 150ms ease,
              max-height 200ms ease,
              margin 150ms ease;
  will-change: opacity, transform, max-height, margin;
}

/* When visible, allow content to take space. The large max-height is a safe cap.
   Override via --cv-max-height if your content can exceed this. */
.cv-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
  max-height: var(--cv-max-height, 9999px) !important;
}

/* Hidden elements collapse space while animating.
   We avoid the native hidden attribute to keep transitions visible. */
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


