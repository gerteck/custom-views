/**
 * CustomViews Plugin for MarkBind
 * Injects the CustomViews script into every page and initializes the library.
 */
export function getScripts() {
  return [
    // '<script src="https://unpkg.com/@customviews-js/customviews/dist/custom-views.umd.min.js"/>',
    '<script type="module" src="../../../dist/custom-views.esm.js"/>',
    `<script>
        const config = {
          "allToggles": ["mac", "linux", "windows"],
          "defaultState": {
            "toggles": ["mac", "linux", "windows"]
          }
        };

        window.addEventListener('DOMContentLoaded', async () => {

          const customviewsCore = await window.CustomViews.initFromJson({
            config,
            assetsJsonPath: '/configs/assets.json',
            baseURL: '/customviews',
          });

          const widget = new window.CustomViewsWidget({
            core: customviewsCore,
            position: 'middle-left',
            showReset: false,
            title: 'Customize your view here',
            description: 'This is a widget that allows you to customize your view here',
            showWelcome: true,
            welcomeTitle: 'Welcome to Custom Views!',
            welcomeMessage: 'This documentation uses Custom Views to personalize your experience. Click the gear icon (⚙) on the side to show or hide sections based on your operating system or preferences.'
          });
          
          widget.render();
        });
      </script>`
  ];
};
