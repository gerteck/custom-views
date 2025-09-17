<frontmatter>
  title: Configuration Reference
</frontmatter>

# Configuration Reference

This document covers how to configure the Custom Views library, from basic setup to advanced configurations.

## Basic Setup

### Installation

```bash
npm install custom-views
```

Or use directly from a CDN:

```html
<script type="module" src="https://unpkg.com/custom-views/dist/custom-views.esm.js"></script>
```

### Basic HTML Setup

```html
<!-- Define a placeholder -->
<div data-customviews-placeholder="logo"></div>

<!-- Define toggleable content -->
<div data-customviews-toggle="advanced">
  <p>This content shows only in advanced mode</p>
</div>
```

### JavaScript Initialization

```javascript
// Initialize the library
const core = await CustomViews.initFromJson({
  assetsJsonPath: '/configs/assets.json',
  defaultStateJsonPath: '/configs/defaultState.json',
  localConfigPaths: {
    "profileA": "/configs/profileA.json"
  }
});

// Optional: Add a widget for user interaction
const widget = new CustomViewsWidget({
  core: core,
  position: 'top-right'
});
widget.render();
```

## Configuration Files Structure

The library uses three main types of configuration files:

1. **Assets Configuration** - Defines all available content assets
2. **Default State Configuration** - Sets the initial state
3. **Profile Configurations** - Defines what's available for each profile

### Directory Structure
```
/configs/
  ├── assets.json           # All available assets
  ├── defaultState.json     # Initial state
  ├── profileA.json         # Profile A configuration  
  └── profileB.json         # Profile B configuration
```

## Assets Configuration (`assets.json`)

Define all available assets that can be used as placeholders or toggles:

```json
{
  "logo-primary": {
    "id": "logo-primary",
    "type": "image",
    "src": "/assets/logo-primary.png",
    "alt": "Primary Logo"
  },
  "logo-secondary": {
    "id": "logo-secondary", 
    "type": "image",
    "src": "/assets/logo-secondary.png",
    "alt": "Secondary Logo"
  },
  "intro-text": {
    "id": "intro-text", 
    "type": "html",
    "content": "<h1>Welcome!</h1><p>Get started with our platform.</p>"
  },
  "welcome-message": {
    "id": "welcome-message",
    "type": "text", 
    "content": "Welcome to our amazing platform!"
  }
}
```

### Asset Types

| Type | Description | Required Fields | Optional Fields |
|------|-------------|----------------|-----------------|
| `image` | Image assets | `id`, `type`, `src` | `alt` |
| `html` | HTML content | `id`, `type`, `content` | - |
| `text` | Plain text | `id`, `type`, `content` | - |
| Custom | Custom types | `id`, `type` | Any custom fields |

## Default State Configuration (`defaultState.json`)

Define the initial state when no profile is selected:

```json
{
  "placeholders": {
    "logo": "logo-primary",
    "welcomeText": "intro-text"
  },
  "toggles": ["basic", "introduction"]
}
```

### Configuration Fields

- **`placeholders`** - Object mapping placeholder names to asset IDs
- **`toggles`** - Array of toggle categories to show by default

## Profile Configuration

Profiles define what options are available to users and provide pre-configured states.

### Complete Profile Example (`profileA.json`)

```json
{
  "id": "profileA",
  "modifiablePlaceholderAssets": {
    "logo": ["logo-primary", "logo-secondary"],
    "welcomeText": ["intro-text", "welcome-message"]
  },
  "allowedToggles": ["basic", "advanced", "expert"],
  "states": {
    "default": {
      "placeholders": {
        "logo": "logo-primary",
        "welcomeText": "intro-text"
      },
      "toggles": ["basic"]
    },
    "advanced": {
      "placeholders": {
        "logo": "logo-secondary", 
        "welcomeText": "intro-text"
      },
      "toggles": ["basic", "advanced"]
    },
    "expert": {
      "placeholders": {
        "logo": "logo-secondary",
        "welcomeText": "welcome-message"
      },
      "toggles": ["advanced", "expert"]
    }
  },
  "defaultState": "default"
}
```

### Profile Configuration Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for this profile |
| `modifiablePlaceholderAssets` | object | Maps placeholder names to arrays of allowed asset IDs |
| `allowedToggles` | array | List of toggle categories available in this profile |
| `states` | object | Pre-configured states with their placeholder/toggle settings |
| `defaultState` | string | ID of the default state for this profile |

## Widget Configuration

### Basic Widget Setup

```javascript
const widget = new CustomViewsWidget({
  core: customViewsCore,
  position: 'top-right',
  theme: 'auto',
  showProfiles: true,
  showStates: true,
  showReset: true,
  title: 'Custom Views'
});

widget.render();
```

### Widget Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `core` | CustomViewsCore | Required | The core instance to control |
| `container` | HTMLElement | document.body | Container element for inline widgets |
| `position` | string | 'top-right' | 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'inline' |
| `theme` | string | 'auto' | 'light', 'dark', 'auto' (follows system preference) |
| `showProfiles` | boolean | true | Whether to show profile selector |
| `showStates` | boolean | true | Whether to show state selector |
| `showReset` | boolean | true | Whether to show reset button |
| `customClasses` | array | [] | Additional CSS classes for the widget |
| `title` | string | 'Custom Views' | Widget title text |

### Widget Positioning

```javascript
// Fixed positions
{ position: 'top-right' }     // Fixed to top-right corner
{ position: 'top-left' }      // Fixed to top-left corner
{ position: 'bottom-right' }  // Fixed to bottom-right corner
{ position: 'bottom-left' }   // Fixed to bottom-left corner

// Inline positioning
{ 
  position: 'inline',
  container: document.getElementById('widget-area')
}
```

## Advanced Configuration

### Multiple Profiles Setup

```javascript
const localConfigPaths = {
  "student": "/configs/student-profile.json",
  "instructor": "/configs/instructor-profile.json", 
  "admin": "/configs/admin-profile.json"
};

const core = await CustomViews.initFromJson({
  assetsJsonPath: '/configs/assets.json',
  defaultStateJsonPath: '/configs/defaultState.json',
  localConfigPaths: localConfigPaths
});
```

### Custom Initialization Options

```javascript
const core = await CustomViews.initFromJson({
  assetsJsonPath: '/configs/assets.json',
  defaultStateJsonPath: '/configs/defaultState.json',
  localConfigPaths: localConfigPaths,
  
  // Optional: Custom root element (default: document.body)
  rootEl: document.getElementById('content'),
  
  // Optional: View change callback
  onViewChange: (stateId, state) => {
    console.log('View changed to:', stateId, state);
    // Track analytics, update UI, etc.
  }
});
```

### Programmatic API Usage

```javascript
// Switch profiles programmatically
await core.switchToProfile('instructor', 'advancedMode');

// Switch states within current profile
core.switchToState('expertView');

// Get current state
const currentView = core.getCurrentView();
console.log('Current:', currentView.profile, currentView.state);

// Get available options
const profiles = core.getAvailableProfiles();
const states = core.getAvailableStates();

// Clear all persistence
core.clearPersistence();

// Check if persistence data exists
const hasData = core.hasPersistedData();
```

## URL Parameters

The library automatically handles URL parameters for deep linking:

### Supported Parameters

- `profile` - Specify which profile to load
- `state` - Specify which state within the profile

### Examples

```
# Load Profile A with default state
https://yoursite.com/?profile=profileA

# Load Profile A with 'advanced' state  
https://yoursite.com/?profile=profileA&state=advanced

# Load Profile B with 'expert' state
https://yoursite.com/?profile=profileB&state=expert
```

### URL Behavior

1. URL parameters take precedence over saved preferences
2. When URL parameters are present, they're saved to localStorage
3. Removing URL parameters falls back to saved preferences
4. Widget interactions update the URL automatically

## Persistence Configuration

The library automatically saves user preferences to localStorage:

### Persistence Features

- **Automatic saving** - Selections are saved immediately
- **Cross-session** - Preferences persist across browser sessions
- **URL integration** - URL parameters are saved as preferences
- **Easy reset** - Users can clear all saved preferences

### Persistence Data Structure

```javascript
// Stored in localStorage as 'customViews-persistence'
{
  "profile": "profileA",
  "state": "advanced",
  "timestamp": 1625097600000
}
```

### Custom Persistence Handling

```javascript
const persistence = core.getPersistenceManager();

// Get current persisted data
const data = persistence.getPersistedView();

// Manually persist a view
persistence.persistView('profileA', 'advanced');

// Clear specific data
persistence.clearProfile();
persistence.clearState();
persistence.clearAll();

// Debug logging
persistence.debugLog();
```

## Integration Patterns

### MarkBind Integration

```javascript
// In your MarkBind plugin
export function getScripts() {
  return [
    '<script type="module" src="/path/to/custom-views.esm.js"></script>',
    `<script>
      window.addEventListener('DOMContentLoaded', async () => {
        const core = await window.CustomViews.initFromJson({
          assetsJsonPath: '/configs/assets.json',
          defaultStateJsonPath: '/configs/defaultState.json',
          localConfigPaths: {
            "profileA": "/configs/profileA.json"
          }
        });
        
        const widget = new window.CustomViewsWidget({ core });
        widget.render();
      });
    </script>`
  ];
}
```

### React Integration

```jsx
import { useEffect, useState } from 'react';
import { CustomViews, CustomViewsWidget } from 'custom-views';

function App() {
  const [core, setCore] = useState(null);
  
  useEffect(() => {
    const initCustomViews = async () => {
      const coreInstance = await CustomViews.initFromJson({
        assetsJsonPath: '/configs/assets.json',
        defaultStateJsonPath: '/configs/defaultState.json',
        localConfigPaths: {
          "profileA": "/configs/profileA.json"
        }
      });
      
      setCore(coreInstance);
      
      const widget = new CustomViewsWidget({
        core: coreInstance,
        position: 'inline',
        container: document.getElementById('widget-container')
      });
      widget.render();
    };
    
    initCustomViews();
  }, []);
  
  return (
    <div>
      <div id="widget-container"></div>
      <div data-customviews-placeholder="logo"></div>
    </div>
  );
}
```

## Best Practices

### Configuration Organization

1. **Use descriptive IDs** - Make asset and state IDs self-documenting
2. **Group related assets** - Organize assets by type or purpose
3. **Plan your states** - Design states that make sense for your users
4. **Test all combinations** - Ensure all profile/state combinations work

### Performance Considerations

1. **Optimize asset sizes** - Compress images and minimize HTML content
2. **Use relative paths** - For better portability and CDN support
3. **Lazy load large assets** - Consider loading assets on demand
4. **Cache configurations** - Use HTTP caching for config files

### Error Handling

1. **Validate configurations** - Test all profiles and states
2. **Provide fallbacks** - Always define default states
3. **Handle missing assets** - Gracefully handle 404s
4. **Test edge cases** - Invalid URLs, missing configs, etc.

### Accessibility

1. **Use semantic HTML** - In asset content
2. **Provide alt text** - For all images
3. **Test with screen readers** - Ensure dynamic content is accessible
4. **Maintain focus management** - When content changes

## Troubleshooting

### Common Issues

**Assets not loading**
- Check file paths in assets.json
- Verify files exist at specified locations
- Check browser network tab for 404 errors

**Profile not switching**
- Verify profile IDs match between localConfigPaths and profile files
- Check browser console for initialization errors
- Ensure profile JSON is valid

**Toggles not showing**
- Confirm toggle categories are in profile's allowedToggles
- Check HTML data-customviews-toggle attributes
- Verify state contains the toggle category

**Persistence not working**
- Check if localStorage is enabled in browser
- Look for console errors related to persistence
- Try clearing localStorage manually

**Widget not appearing**
- Check if widget.render() is called
- Verify core instance is properly initialized
- Look for CSS conflicts or z-index issues

### Debug Tools

```javascript
// Enable debug logging (development only)
if (window.location.hostname === 'localhost') {
  window.customViewsCore = core;
  window.customViewsPersistence = core.getPersistenceManager();
  
  // Debug commands
  console.log('Current view:', window.customViewsCore.getCurrentView());
  window.customViewsPersistence.debugLog();
}
```

### Testing Configurations

```javascript
// Test all profiles and states
const profiles = core.getAvailableProfiles();
for (const profile of profiles) {
  await core.switchToProfile(profile);
  const states = core.getAvailableStates();
  
  for (const state of states) {
    core.switchToState(state);
    console.log(`Testing ${profile}:${state}`);
  }
}
```