# Custom Views

v0.1.1

A JavaScript dynamic custom views library for creating contextual, adaptive web content. Perfect for educational websites, documentation, and multi-audience platforms.

## Features

- **Dynamic Content Loading**: Switch between different content views on the fly
- **Persistence**: Maintains user preferences across page navigation using localStorage
- **Interactive Widget**: Built-in UI component for easy view switching
- **Placeholders & Toggles**: Support for mutually exclusive content (placeholders) and additive content (toggles)
- **Profile-based Configuration**: Different user profiles with customizable view options
- **URL State Management**: Shareable URLs with embedded view state
- **Framework Agnostic**: Works with any web framework or vanilla JavaScript
- **Lightweight**: No external dependencies, bundled for npm (ESM, CJS, UMD builds)

## Installation

```bash
npm install custom-views
```

## Quick Start

### Basic Setup

```javascript
import { CustomViews } from 'custom-views';

const customviews = await CustomViews.initFromJson({
  assetsJsonPath: './configs/assets.json',
  defaultStateJsonPath: './configs/defaultState.json',
  localConfigPaths: {
    teacher: "./configs/teacher.json",
    student: "./configs/student.json"
  },
  rootEl: document.body
});
```

### Adding the Widget

```javascript
import { CustomViews, CustomViewsWidget } from 'custom-views';

// Initialize the core library
const customviews = await CustomViews.initFromJson({...});

// Create a floating widget
const widget = new CustomViewsWidget({
  core: customviews,
  position: 'top-right',
  theme: 'auto',
  title: 'View Settings'
});
widget.render();
```

### HTML Markup

```html
<!-- Placeholder: Only one variant shown at a time -->
<div data-customviews-placeholder="logo"></div>

<!-- Toggle: Can show/hide based on current view -->
<div data-customviews-toggle="beginner">
  <h2>Beginner Content</h2>
  <p>This content is only visible in beginner mode.</p>
</div>

<div data-customviews-toggle="advanced">
  <h2>Advanced Content</h2>
  <p>This content is only visible in advanced mode.</p>
</div>
```

## Key Concepts

### Placeholders vs Toggles

- **Placeholders**: Mutually exclusive content slots (e.g., university logos - show NUS OR NTU, not both)
- **Toggles**: Additive content sections (e.g., show beginner AND advanced topics together)

### Profiles and States

- **Profiles**: Define what content options are available to different user types
- **States**: Specific combinations of placeholder values and active toggles

### Persistence

The library automatically persists user preferences across page navigation:
- Selected profile and state are stored in localStorage
- URL parameters override stored preferences
- Shareable URLs maintain view state

## API Reference

### Core Methods

```javascript
// Switch to a different profile
await customviews.switchToProfile('teacher', 'advanced');

// Switch state within current profile
customviews.switchToState('beginner');

// Get current view information
const current = customviews.getCurrentView();
// Returns: { profile: 'teacher', state: 'advanced' }

// Clear all persistence and reset to default
customviews.clearPersistence();
```

### Widget Options

```javascript
const widget = new CustomViewsWidget({
  core: customviews,                    // Required: CustomViews instance
  position: 'top-right',               // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'inline'
  theme: 'auto',                       // 'light', 'dark', 'auto'
  showProfiles: true,                  // Show profile selector
  showStates: true,                    // Show state selector
  showReset: true,                     // Show reset button
  title: 'Custom Views'                // Widget title
});
```

## Configuration Files

### Assets Configuration (`assets.json`)
```json
{
  "logo-nus": {
    "id": "logo-nus",
    "type": "image",
    "src": "./images/nus-logo.png"
  },
  "intro-text": {
    "id": "intro-text",
    "type": "html",
    "content": "<h1>Welcome!</h1><p>Getting started...</p>"
  }
}
```

### Profile Configuration (`teacher.json`)
```json
{
  "id": "teacher",
  "modifiablePlaceholderAssets": {
    "logo": ["logo-nus", "logo-ntu"]
  },
  "allowedToggles": ["beginner", "advanced", "solutions"],
  "states": {
    "default": {
      "placeholders": { "logo": "logo-nus" },
      "toggles": ["beginner", "advanced"]
    },
    "solutions": {
      "placeholders": { "logo": "logo-nus" },
      "toggles": ["beginner", "advanced", "solutions"]
    }
  },
  "defaultState": "default"
}
```

## Use Cases

- **Educational Platforms**: Different content for students vs teachers
- **Documentation Sites**: Beginner vs advanced user guides
- **Multi-tenant Applications**: Institution-specific branding and content
- **Adaptive Learning**: Progressive content revelation based on user level

## Testing

The library includes a test page demonstrating all features:

```bash
npm run live-server
```

Then navigate to `test/usage/index.html` to see:
- Floating and inline widgets
- Profile and state switching
- Persistence across page reloads
- Programmatic API usage

## License

MIT