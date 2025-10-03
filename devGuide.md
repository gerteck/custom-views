# CustomViews Developer Guide

## Overview

CustomViews is a JavaScript library for creating personalized viewing experiences based on user preferences. It allows toggling content visibility based on selected options (like operating systems, experience levels, etc.).

## Architecture

```
src/
├── core/           # Core functionality
├── models/         # Data models
├── lib/            # Library components
├── utils/          # Utility functions
├── entry/          # Entry points
├── types/          # TypeScript types
└── index.ts        # Main entry point
```

## Initialization Flow

### Auto-Initialization (Script Tag)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Load Script    │────▶│  Fetch Config   │────▶│ Initialize Core │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Ready Event    │◀────│ Create Instance │◀────│ Render Widget   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. User adds script tag: `<script src="custom-views.min.js"></script>`
2. On DOMContentLoaded:
   - Script detects data attributes (`data-base-url`, `data-config-path`)
   - Fetches config file from `/customviews.config.json` (or specified path)
   - Initializes core with config
   - Creates and renders widget (if enabled)
   - Dispatches `customviews:ready` event

### Programmatic Usage

```typescript
// Initialize from config object
const core = await CustomViews.init({
  config: myConfig,
  baseUrl: '/my-site'
});

// Create widget
const widget = new CustomViewsWidget({
  core,
  position: 'middle-left'
});
widget.render();
```

## Key Components

### 1. CustomViews Class (`lib/custom-views.ts`)
- Main entry point for initialization
- Handles asset loading and configuration

### 2. CustomViewsCore (`core/core.ts`)
- Manages visibility state
- Processes toggle selections
- Applies visibility to DOM elements

### 3. CustomViewsWidget (`core/widget.ts`)
- UI component for toggling options
- Renders control panel for users
- Handles user interactions

### 4. Browser Entry (`entry/browser-entry.ts`)
- Handles auto-initialization
- Detects script tag attributes
- Loads configuration file

## Configuration

### Config File Structure
```json
{
  "config": {
    "allToggles": ["mac", "linux", "windows"],
    "defaultState": {
      "toggles": ["mac", "linux", "windows"]
    }
  },
  "assetsJsonPath": "/assets/assets.json",
  "baseUrl": "/customviews",
  "widget": {
    "enabled": true,
    "position": "middle-left"
  }
}
```

## HTML Usage

### Toggle Visibility
```html
<!-- Show only when "mac" is selected -->
<div data-cv-toggle="mac">
  <p>Mac-specific content</p>
</div>

<!-- Show when either "linux" or "windows" is selected -->
<div data-cv-toggle="linux windows">
  <p>Linux or Windows content</p>
</div>
```

### Asset Insertion
```html
<!-- Insert asset defined in assets.json -->
<div data-cv-toggle="mac" data-cv-id="mac"></div>
```

## Data Flow

1. Config defines available toggles
2. User selects toggles via widget
3. Core updates visibility state
4. DOM elements with `data-cv-toggle` are shown/hidden
5. Elements with `data-cv-id` are populated with assets

## Events

- `customviews:ready`: Fired when initialization completes
- `customviews:statechange`: Fired when toggle state changes

## Global Objects

When loaded via script tag:
- `window.CustomViews`: Main class
- `window.CustomViewsWidget`: Widget class
- `window.customViewsInstance`: Active instance

## Implementation Notes

- Uses native DOM APIs (no dependencies)
- Supports modern browsers
- Configurations are stored in JSON files
- Widget state can persist via localStorage
