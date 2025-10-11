## Custom Views

[npm package link](https://www.npmjs.com/package/@customviews-js/customviews)

_Custom Views_ allows developers and designers to define reusable content views that can be toggled, personalized, or adapted dynamically for different users and contexts. It is framework-agnostic, meaning it works with plain HTML, JavaScript, or alongside modern frameworks without imposing additional dependencies.

With Custom Views, you can:

- Show or hide sections of a page based on user preferences.
- Persist user-selected content variants (e.g., "CLI view" vs "GUI view").
- Enhance accessibility and provide tailored experiences without bloating your site.

Whether you are building a static site, a dashboard, or a documentation portal, Custom Views gives you the tools to make your content interactive and adaptable while keeping things lightweight and simple.

[:fa-brands-github: GitHub Link&nbsp; :fa-solid-arrow-up-right-from-square:](https://github.com/customviews-js/customviews)

## Components

Custom Views provides two main components:

- **Toggles**: Show or hide sections of a page based on categories (e.g., platform-specific content).
- **Tabs**: Create mutually exclusive, synchronized content sections for different views.

Both components work out of the box without configuration, but can be enhanced with the widget and config file for better user experience.

## Quick Start

### Mark content with toggles

Use the `data-cv-toggle` attribute or `<cv-toggle>` element to mark content that should be shown only for specific categories (for example `mac`, `linux`, `windows`). 

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

<!-- Or use the cv-toggle element -->
<cv-toggle category="mac">
  <p>Mac content here</p>
</cv-toggle>

<!-- Dynamic content with ID -->
<div data-cv-toggle="mac" data-cv-id="mac-picture"></div>
```

You can apply multiple toggles to a single element by separating categories with spaces. This allows content to appear as long as one toggle category is active.

```html
<div data-cv-toggle="mac linux">
  This section appears for both macOS and Linux users.
</div>

<cv-toggle category="mac linux">
  This section appears for both macOS and Linux users.
</cv-toggle>
```

### Attributes & Options

| Name | Type | Default | Description |
|------|------|----------|-------------|
| `data-cv-toggle` | string | **required** for data attribute usage | Defines the category for the element. Example: `data-cv-toggle="mac"`. |
| `category` | string | **required** for `<cv-toggle>` | Defines the category for the cv-toggle element. Example: `category="mac"`. |
| `data-cv-id` / `data-customviews-id` | string | - | Marks the element as an asset render target. When visible, matching assets from `assets.json` will be dynamically inserted. |

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

Basic example with synchronized groups:

```html
<cv-tabgroup id="fruit">
  <cv-tab id="apple" header="Apple">
  
**Apple Information**

Apples are crisp, sweet fruits that come in many varieties. They are rich in fiber and vitamin C.

  </cv-tab>
  <cv-tab id="orange" header="Orange">
  
**Orange Information**

Oranges are citrus fruits known for their high vitamin C content and refreshing juice.

  </cv-tab>
  <cv-tab id="pear" header="Pear">
  
**Pear Information**

Pears are sweet, bell-shaped fruits with a soft texture when ripe. They're high in fiber and antioxidants.

  </cv-tab>
</cv-tabgroup>

<cv-tabgroup id="fruit" nav="auto">
  <cv-tab id="apple" header="Apple Types">

Apple types include **Granny Smith** and the **Cosmic Crisp**.

  </cv-tab>
  <cv-tab id="orange" header="Orange Types">

Orange types include the **Blood orange** and **Valencia orange**. 
  </cv-tab>
  <cv-tab id="pear" header="Pear">

Pear types include the **Asian pear** and the **European pear**
  </cv-tab>
</cv-tabgroup>
```

* **Synchronized Tab Groups** Multiple tab groups with the same `id` will automatically synchronize. When you switch tabs in one group, all other groups with the same ID will update simultaneously.

### Attributes & Options

#### `<cv-tabgroup>` Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | **(required)** | Unique identifier for the tab group. Tab groups with the same ID will synchronize. |
| `nav` | string | `"auto"` | Navigation display mode. Use `"auto"` to automatically generate navigation, or `"none"` to hide navigation. |

#### `<cv-tab>` Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | **(required)** | Unique identifier for the tab within its group. |
| `header` | string | Tab ID | Display label for the tab in the navigation bar. Supports text and font-awesome emojis. |

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

To get started quickly, add the following snippet to your site's `<head>` or right before `</body>`:

```html
<!-- Load from CDN or your hosted bundle -->
<script src="https://unpkg.com/@customviews-js/customviews/dist/custom-views.min.js"
        data-base-url="/customviews"
        ></script>
```

This snippet loads:
* The CustomViews runtime, a lightweight JavaScript that auto-initializes on page load.
* The base URL and config path, which tell the runtime where to find your assets and configuration.

By default the auto-init script will:
1. Load configuration (default path `/customviews.config.json`)
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
    "showReset": true,
    "title": "Customize your view here",
    "description": "Toggle content sections and switch between different tab views.",
    "showWelcome": true
  }
}
```

#### Key Fields

| Field | Description |
| ------ | ------------ |
| `config.allToggles` | List of toggle IDs recognized by CustomViews. |
| `config.defaultState` | Toggles and tabs per tab group enabled by default on first load. |
| `assetsJsonPath` | Path to your compiled assets manifest (resolved relative to `baseURL`). |
| `widget` | Floating widget settings — control position, visibility, and welcome prompt. |
| `showUrl` | When true, CustomViews encodes the active state into the browser URL for shareable links. |

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

Widget configuration options:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `enabled` | boolean | true | Whether to show the widget. |
| `position` | string | 'middle-left' | Position of the widget (e.g., 'middle-left', 'bottom-right'). |
| `showReset` | boolean | true | Whether to show the reset button. |
| `showWelcome` | boolean | false | Whether to show a welcome modal on first visit. |

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


## Troubleshooting

* Toggles not appearing in widget?
	* Check `config.allToggles` includes your toggle IDs.

* No effect when toggling?
	* Ensure the element uses `data-cv-toggle` or `<cv-toggle>` with `category`, and matches an active toggle ID.

* URL state not persisting in URL bar?
	* Enable `showUrl` in the configuration.

* Widget not loading?
	* Verify the script is included and `customviews.config.json` is accessible.

* Tab groups not synchronizing?
	* Ensure they share the same `id` attribute.

* Assets not rendering?
	* Check `data-cv-id` matches a key in `assets.json`, and the toggle is active.

## API & Integration Notes

- Public globals: `window.CustomViews`, `window.CustomViewsWidget`, and `window.customViewsInstance` (contains `{ core, widget? }`) when auto-initialized.
- Important events: `customviews:ready` (auto-init done) and `customviews:tab-change` (dispatched when a tab group selection changes).
- URL state helpers: `URLStateManager.generateShareableURL` and `URLStateManager.parseURL` (used internally by the widget).

## License

MIT