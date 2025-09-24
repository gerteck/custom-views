/**
 * CustomViews Plugin for MarkBind
 * Injects the CustomViews script into every page and initializes the library.
 */
export function getScripts() {
  // Return an array of <script> tags as strings
  return [
    '<script type="module" src="../../../dist/custom-views.esm.js"></script>',
    `<script>
        window.addEventListener('DOMContentLoaded', async () => {
          // Initialize CustomViews with simplified configuration
          const customviewsCore = await window.CustomViews.initFromJson({
            assetsJsonPath: '/configs/assets.json',
            defaultStateJsonPath: '/configs/defaultState.json',
            profilePath: '/configs/simpleConfig.json',  // Use simplified config file
            rootEl: document.body
          });

          // Create and render the widget
          const widget = new window.CustomViewsWidget({
            core: customviewsCore,
            position: 'middle-left',
            theme: 'auto',
            showReset: true,
            title: 'Custom Views'
          });
          
          widget.render();

          // Expose for debugging (development only)
          if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.customViewsCore = customviewsCore;
            window.customViewsPersistence = customviewsCore.getPersistenceManager();
            console.log('CustomViews Debug: Core and persistence manager available on window object');
            console.log('Try: window.customViewsPersistence.debugLog()');
          }
        });
      </script>`
  ];
};
