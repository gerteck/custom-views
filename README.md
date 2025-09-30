# Custom Views

v0.2.0

A JavaScript library for creating contextual, adaptive web content. Perfect for educational websites, documentation, and multi-audience platforms.

## Installation

```bash
npm install customviews
```

## Quick Start

### HTML Setup

```html
<!-- Mark content with data-customviews-toggle attribute -->
<div data-customviews-toggle="beginner">
  <p>Beginner content here</p>
</div>

<div data-customviews-toggle="advanced">
  <p>Advanced content here</p>
</div>

<!-- Dynamic content with ID -->
<div data-customviews-toggle="beginner" data-customviews-id="intro-guide"></div>
```

### JavaScript Initialization

```javascript
// Initialize CustomViews
const core = await window.CustomViews.initFromJson({
  config: {
    allToggles: ['beginner', 'advanced'],
    defaultState: { toggles: ['beginner'] }
  },
  assetsJsonPath: '/assets.json'
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

## License

MIT