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
            configPath: '/configs/simpleConfig.json',
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
        });
      </script>`
  ];
};
