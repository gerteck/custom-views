# Custom Views

v1.0.3

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

### Adding script to site

```html
<script src="https://unpkg.com/@customviews-js/customviews/dist/custom-views.umd.min.js"/>
```
Additionally, you can bundle or copy the script into your own site.


### JavaScript Initialization

```javascript
// Initialize CustomViews
const core = await window.CustomViews.initFromJson({
  config: {
    allToggles: ['beginner', 'advanced'],
    defaultState: { toggles: ['beginner'] }
  },
  assetsJsonPath: '/assets.json',
  baseURL: '/customviews',
});

// Add widget
const widget = new window.CustomViewsWidget({
  core,
  position: 'middle-left',
  showWelcome: true
});
widget.render();
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