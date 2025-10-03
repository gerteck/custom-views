# Custom Views

v1.1.0

[npm package link](https://www.npmjs.com/package/@customviews-js/customviews)

A JavaScript library for creating contextual, adaptive web content. Perfect for educational websites, documentation, and multi-audience platforms.

## Quick Start

### HTML Setup

```html
<!-- Mark content with data-cv-toggle attribute -->
<div data-cv-toggle="beginner">
  <p>Beginner content here</p>
</div>

<div data-cv-toggle="advanced">
  <p>Advanced content here</p>
</div>

<!-- Dynamic content with ID -->
<div data-cv-toggle="beginner" data-cv-id="intro-guide"></div>
```

### Simple Setup

```html
<script src="https://unpkg.com/@customviews-js/customviews"></script>
```

This auto-init script will:
1. Automatically load configuration from `/customviews.config.json`
2. Initialize the core library
3. Create and render the widget if enabled

#### Configuration File

Create a `customviews.config.json` file in your site root:

```json
{
  "core": {
    "config": {
      "allToggles": ["beginner", "advanced"],
      "defaultState": {
        "toggles": ["beginner"]
      }
    },
    "assetsJsonPath": "/assets.json"
  },
  "widget": {
    "enabled": true,
    "position": "middle-left",
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
  data-config-path="/configs/custom-views.json">
</script>
```

## Widget Features

- **Floating Widget**: Rounded rectangle design with gear icon
- **Six Positions**: top-left, top-right, bottom-left, bottom-right, middle-left, middle-right
- **Welcome Modal**: Optional first-visit modal (localStorage cached)
- **Theme Support**: Light and dark themes
- **URL Sharing**: Generate shareable URLs with custom states

## Core Initialization Options

```typescript
{
  config?: Config;                 // Config object with allToggles and defaultState
  configPath?: string;             // Path to JSON config file
  assetsJsonPath?: string;         // Path to JSON assets file
  baseURL?: string;                // Base URL prepended to all paths (e.g., '/customviews')
  rootEl?: HTMLElement;            // Root element to apply custom views (default: document.body)
}
```

**Notes**: 
- Either `config` (literal config object) or `configPath` must be provided.
- `baseURL` is automatically prepended to `configPath`, `assetsJsonPath`, and all asset `src` paths.
- Absolute URLs (starting with `http://` or `https://`) are not modified.

## Configuration File Format

When using auto-initialization, the config file follows this structure:

```typescript
{
  core: {
    config?: any;                  // Core configuration object
    configPath?: string;           // Path to the configuration file
    assetsJsonPath?: string;       // Path to the assets JSON file
    baseURL?: string;              // Base URL for all paths
  };
  
  widget?: {
    enabled?: boolean;             // Whether the widget is enabled
    position?: string;             // Widget position
    theme?: 'light' | 'dark';      // Widget theme
    showReset?: boolean;           // Whether to show reset button
    title?: string;                // Widget title
    description?: string;          // Widget description text
    showWelcome?: boolean;         // Whether to show welcome modal on first visit
    welcomeTitle?: string;         // Welcome modal title
    welcomeMessage?: string;       // Welcome modal message
  };
}
```

## Events

### `customviews:ready` Event

When using auto-initialization, a `customviews:ready` event is dispatched when CustomViews is fully initialized:

```javascript
document.addEventListener('customviews:ready', (event) => {
  const { core, widget } = event.detail;
  
  // You can now access the core and widget instances
  console.log('CustomViews initialized!');
  
  // Example: Programmatically change state
  core.applyState({ toggles: ['advanced'] });
});
```

### Global Instance Access

When using auto-initialization, the core and widget instances are stored on the `window` object:

```javascript
// Access the core instance
const core = window.customViewsInstance.core;

// Access the widget instance (if enabled)
const widget = window.customViewsInstance.widget;

// Example: Programmatically change state
core.applyState({ toggles: ['advanced'] });
```

## Widget Options

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

## Assets JSON Setup

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

### Asset Properties

- **`src`**: Image URL (makes it an image asset), **`content`**: Text or HTML content (auto-detected)
- **`alt`**: Alt text for images, **`className`**: CSS classes to apply, **`style`**: Inline CSS styles

### Usage in HTML

```html
<!-- Reference asset by key using data-cv-id (or data-customviews-id for backward compatibility) -->
<div data-cv-toggle="beginner" data-cv-id="assetKey"></div>
```

When the toggle is active, the asset will be automatically rendered into the element.


## License

MIT