## Custom Views

v1.1.0

[npm package link](https://www.npmjs.com/package/@customviews-js/customviews)

A lightweight JavaScript library for creating contextual, adaptive web content. Perfect for documentation, tutorials, and sites with multiple audiences or platforms.

## Quick Start

### Mark content with toggles

Use the `data-cv-toggle` attribute to mark content that should be shown only for specific categories (for example `mac`, `linux`, `windows`). 

```html
<!-- Mark content with data-cv-toggle attribute -->
<div data-cv-toggle="mac">
  <p>Mac content here</p>
</div>

<div data-cv-toggle="linux">
  <p>Linux content here</p>
</div>

<div data-cv-toggle="windows">
  <p>Windows content here</p>
</div>

<!-- Dynamic content with ID -->
<div data-cv-toggle="mac" data-cv-id="mac-picture"></div>
```

**Configuration Integration**
To expose toggles in the widget and provide defaults, list them in your config file under `config.allToggles` and set `config.defaultState.toggles`:

```json
{
  "config": {
    "allToggles": ["mac", "linux", "windows"],
    "defaultState": { "toggles": ["mac"] }
  }
}
```


## Tabs

Tabs let you create mutually exclusive, synchronized content sections using the custom elements `<cv-tabgroup>` and `<cv-tab>`. All tab groups on the page that share the same `id` stay in sync — changing a tab in one group updates the others automatically.

Basic example (automatic navigation):

```html
<cv-tabgroup id="fruit">
  <cv-tab id="apple" header="Apple">I love Apples!</cv-tab>
  <cv-tab id="orange" header="Orange">I love Oranges!</cv-tab>
  <cv-tab id="pear" header="Pear">I love Pears!</cv-tab>
</cv-tabgroup>
```

Attributes and options
- `id` (on `<cv-tabgroup>`) — required group identifier. Groups with the same `id` synchronize.
- `nav` (on `<cv-tabgroup>`) — navigation mode. Use `nav="none"` to hide navigation when you want to control tabs only via the widget or programmatically.
- `id` (on `<cv-tab>`) — tab identifier inside the group (required).
- `header` (on `<cv-tab>`) — text/HTML used for the tab label. Emojis are supported, for example `header="🍎 Apple"`.

**Config integration**:
If you declare tab groups in `customviews.config.json` under `config.tabGroups`, they will appear in the widget with friendly labels and default selections. Example:

```json
{
  "config": {
    "tabGroups": [
      {
        "id": "fruit",
        "label": "Fruit Selection",
        "default": "apple",
        "tabs": [
          { "id": "apple", "label": "Apple" },
          { "id": "orange", "label": "Orange" },
          { "id": "pear", "label": "Pear" }
        ]
      }
    ]
  }
}
```

Resolution order of tabs and toggles is as follows: 
* URL state (if present) → persisted localStorage state → `config.defaultState`. 


### Simple Setup (auto-init)

Include the bundle and let the library auto-initialize from a config file:

```html
<script src="https://unpkg.com/@customviews-js/customviews"></script>
```

By default the auto-init script will:
1. Load configuration (default path `/customviews.config.json`)
1. Automatically load configuration from `/customviews.config.json`
2. Initialize the core library
3. Create and render the widget if enabled

## Configuration

The config file uses a flat top-level structure. Key fields:

Example `customviews.config.json`:

```json
{
  "config": {
    "allToggles": ["mac", "linux", "windows"],
    "defaultState": {
      "toggles": ["mac", "linux", "windows"],
      "tabs": { "fruit": "apple" }
    },
    "tabGroups": [
      {
        "id": "fruit",
        "label": "Fruit Selection",
        "default": "apple",
        "tabs": [
          { "id": "apple", "label": "Apple" },
          { "id": "orange", "label": "Orange" },
          { "id": "pear", "label": "Pear" }
        ]
      }
    ]
  },
  "assetsJsonPath": "/assets/assets.json",
  "baseUrl": "/customviews",
  "showUrl": false,
  "widget": {
    "enabled": true,
    "position": "middle-left",
    "showReset": false,
    "title": "Customize your view here",
    "description": "Toggle content sections and switch between different tab views.",
    "showWelcome": true
  }
}
```

#### Script Attributes

The auto-init script supports these data attributes:
- `data-base-url`: Base URL for all paths (e.g., `/customviews`)
- `data-config-path`: Custom path to config file (default: `/customviews.config.json`)

```html
<script 
  src="https://unpkg.com/@customviews-js/customviews" 
  data-base-url="/my-site"
  data-config-path="/configs/customviews.config.json">
</script>
```


## Widget Features

- Floating widget with optional welcome modal and reset
- Config-driven (enable/disable, position, theme, labels)
- Shows toggles and tab groups declared in `config` for quick switching
- Can persist state to URL for sharing

```typescript
{
  core: CustomViewsCore;           // Required: core instance
  position?: string;               // Default: 'middle-left'
  theme?: 'light' | 'dark';       // Default: 'light'
  showReset?: boolean;            // Default: true
  showWelcome?: boolean;          // Default: false
  welcomeTitle?: string;          // Custom welcome title
  welcomeMessage?: string;        // Custom welcome message
  title?: string;                 // Widget tooltip
  description?: string;           // Widget modal description
}
```

## Assets JSON

Assets are still defined in a JSON file referenced by `assetsJsonPath`. Example snippets are unchanged — asset keys map to HTML, text, or images and are rendered into elements that have `data-cv-id` (or legacy `data-customviews-id`).

The `assets.json` file defines reusable content that can be dynamically injected into your pages. Each asset is referenced by a unique key and can contain images, HTML, or text.
* Note that `baseURL` defined during initialization is automatically prepended to all asset `src` paths.

### Structure

```json
{
  "htmlContent": {
    "content": "<h2>Dynamic HTML</h2><p>This content is injected dynamically.</p>"
  },
  "textContent": {
    "content": "Plain text content"
  },
  "imageContent": {
    "src": "/assets/mac.png"
  },
  "assetKey": {
    "src": "/path/to/image.png",
    "alt": "Description",
    "className": "custom-class",
    "style": "border-radius: 8px;"
  },
}
```

### Usage in HTML

```html
<!-- Reference asset by key using data-cv-id (or data-customviews-id for backward compatibility) -->
<div data-cv-toggle="beginner" data-cv-id="assetKey"></div>
```

When the toggle is active, the asset will be automatically rendered into the element.


## API & Integration Notes

- Public globals: `window.CustomViews`, `window.CustomViewsWidget`, and `window.customViewsInstance` (contains `{ core, widget? }`) when auto-initialized.
- Important events: `customviews:ready` (auto-init done) and `customviews:tab-change` (dispatched when a tab group selection changes).
- URL state helpers: `URLStateManager.generateShareableURL` and `URLStateManager.parseURL` (used internally by the widget).

## License

MIT