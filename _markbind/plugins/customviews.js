/**
 * CustomViews Plugin for MarkBind
 * Injects the CustomViews auto-init script into every page.
 * Configuration is loaded from /customviews.config.json
 */
// '<script src="../../../dist/custom-views.min.js" data-base-url="/customviews"></script>'
export function getScripts() {
  return [
    '<script src="https://unpkg.com/@customviews-js/customviews@1.1.0/dist/custom-views.min.js" data-base-url="/customviews"></script>'
  ];
};