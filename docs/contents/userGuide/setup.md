<frontmatter>
  title: User Guide - Setting up
</frontmatter>


## Using the CustomViews Plugin

### 1. Include the script

Add the `custom-views` script to your site. You can optionally pass `data-base-url` to set the base used for relative asset paths and `data-config-path` to point to a config file other than the default `/customviews.config.json`.

```html
<!-- Load from a CDN or your hosted bundle -->
<script src="/path/to/custom-views.min.js"
        data-base-url="/customviews"
        data-config-path="/customviews.config.json"
        defer></script>
```

Notes:
- The script auto-initializes on DOMContentLoaded unless you initialize programmatically.
- If you want to programmatically init (e.g., in an SPA), import `CustomViews` from the library and call `CustomViews.init(...)`.

### 2. Create `customviews.config.json`

Place a `customviews.config.json` at your project root (or use `data-config-path` to point elsewhere). The example below shows common fields: toggles, default visibility, an assets JSON path, and the `showUrl` flag that controls whether the visibility state is reflected in the browser URL.

```json
{
  "config": {
    "allToggles": ["example-toggle", "beta-feature"],
    "defaultState": {
      "toggles": ["example-toggle"]
    },
    "tabGroups": [
      {
        "id": "platform-tabs",
        "tabs": ["windows", "mac", "linux"],
        "default": "windows"
      }
    ]
  },
  "assetsJsonPath": "/assets/assets.json",
  "baseURL": "/customviews",
  "widget": {
    "enabled": true,
    "position": "middle-left",
    "showReset": true,
    "showWelcome": true,
  },
  "showUrl": true
}
```

Key fields:
- `config.allToggles`: list of known toggles.
- `config.defaultState`: toggles enabled by default.
- `assetsJsonPath`: path to an assets JSON file (relative paths are resolved against `baseURL`).
- `widget`: UI options for the floating widget.
- `showUrl`: when `true`, the plugin will encode the current state into the URL (shareable links); when `false` the URL will be kept clean.

### 3. Reference and use a custom view component

Use data attributes in your HTML to define toggle buttons and asset insertion points. The runtime supports both the newer `data-cv-*` attributes and legacy `data-customviews-*` names for compatibility.

Example: a toggle button and a target container where an asset with id `my-asset` will be rendered when the toggle is active.

```html
<!-- Toggle (either attribute name works) -->
<button data-cv-toggle="example-toggle">Show Example</button>

<!-- Target asset container; assets with id=my-asset will be inserted here when active -->
<div data-cv-id="my-asset"></div>
```


### 4. Notes and troubleshooting

- Caching: browsers may cache `customviews.config.json` and `assets.json`. If you change config or assets and don't see updates, clear the cache or use a query string (e.g., `/customviews.config.json?v=2`) during rollout.
- Base URL: if your script tag sets `data-base-url`, it overrides `baseURL` from the config. Relative `src` values for assets are automatically prepended with the effective base URL.
- URL sharing: if `showUrl` is enabled the widget will generate shareable URLs that include toggles and active tabs. If `showUrl` is false the plugin keeps the URL clean and will not append state.
- Attribute support: the runtime supports both `data-cv-*` and `data-customviews-*` attributes for toggles and ids. Use whichever fits your project, but prefer `data-cv-*` for new work.
- Multiple script tags: avoid loading multiple copies of the runtime. The auto-init guards against duplicate initialization, but for predictable behavior serve a single bundle.
- Debugging: open the browser DevTools console and watch for `customviews:ready` or other events. The plugin dispatches `customviews:tab-change` when a tab changes — useful for integrations.

If you see missing assets where you expect them to render, verify:
1. `assets.json` contains an entry with the matching `id`.
2. The effective `baseURL` is correct so relative paths resolve.
3. The toggle that controls that asset is enabled (via default state, widget, or programmatic API).

Happy toggling! If you want examples of assets.json structure or more advanced programmatic APIs, see the developer docs or the `src/` code for `URLStateManager`, the `Widget` and `Core` APIs.
