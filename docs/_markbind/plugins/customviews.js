/**
 * CustomViews Plugin for MarkBind
 * Injects the CustomViews auto-init script into every page.
 * Configuration is loaded from /customviews.config.json
 */
export function getScripts() {
  return [
    '<script src="../../../dist/custom-views.min.js" data-base-url="/customviews"></script>'
  ];
};