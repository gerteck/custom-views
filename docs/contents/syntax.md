<frontmatter>
  title: HTML Syntax & JavaScript API Reference
</frontmatter>

# HTML Syntax & JavaScript API Reference

This document explains how to use the Custom Views data attributes in your HTML and the JavaScript API for programmatic control.

## HTML Data Attributes

### Placeholder Syntax

Placeholders define content slots that can show different content based on the current state.

#### Basic Placeholder

```html
<div data-customviews-placeholder="logo"></div>
```

This creates a placeholder named "logo" that will display content based on the current state configuration. The content is dynamically rendered into this element.

#### Placeholder with ID (Container Pattern)

```html
<div data-customviews-placeholder="banner" data-customviews-id="homepage-banner">
  <p>Default banner content</p>
</div>
```

When using an ID, the element acts as a container. Content is shown/hidden based on whether the ID matches the current asset for that placeholder. This pattern is useful for:
- Static content that should only show in certain states
- Content that's already in the HTML and needs conditional display

### Toggle Syntax

Toggles define content that can be shown or hidden based on the current state.

#### Basic Toggle (Container Pattern)

```html
<div data-customviews-toggle="advanced">
  <h2>Advanced Features</h2>
  <p>This content only shows when 'advanced' toggle is active.</p>
</div>
```

The entire element and its contents are shown/hidden based on the toggle state.

#### Toggle with ID (Dynamic Content)

```html
<div data-customviews-toggle="beginner" data-customviews-id="intro-text">
  <!-- Asset content will be rendered here -->
</div>
```

When a toggle has an ID, it will display the corresponding asset content when the toggle is active. The asset is fetched from the assets configuration.

### Attribute Reference

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-customviews-placeholder` | string | Placeholder name | `"logo"` |
| `data-customviews-toggle` | string | Toggle category | `"advanced"` |
| `data-customviews-id` | string | Asset ID for dynamic content | `"intro-text"` |

### Behavior Patterns

#### Pattern 1: Dynamic Placeholder (Most Common)
```html
<div data-customviews-placeholder="logo"></div>
```
- Asset content is rendered into the element
- Content changes based on current state
- Element is hidden if no asset is mapped

#### Pattern 2: Conditional Placeholder
```html
<div data-customviews-placeholder="banner" data-customviews-id="special-banner">
  <img src="default-banner.jpg" alt="Default">
</div>
```
- Shows only when current state maps "banner" to "special-banner"
- Hidden otherwise
- Good for static content that should conditionally appear

#### Pattern 3: Toggle Container
```html
<div data-customviews-toggle="expert">
  <h2>Expert Mode</h2>
  <p>Complex content here...</p>
</div>
```
- Shows when "expert" toggle is active
- Hidden when toggle is inactive
- Good for sections of static content

#### Pattern 4: Dynamic Toggle Content
```html
<div data-customviews-toggle="help" data-customviews-id="context-help">
  <!-- Dynamic help content rendered here -->
</div>
```
- Shows when "help" toggle is active AND renders "context-help" asset
- Hidden when toggle is inactive
- Good for dynamic toggle-specific content

## JavaScript API Reference

### Core Initialization

#### `CustomViews.initFromJson(options)`

Initialize the library with JSON configuration files.

```javascript
const core = await CustomViews.initFromJson({
  assetsJsonPath: '/configs/assets.json',
  defaultStateJsonPath: '/configs/defaultState.json',
  localConfigPaths: {
    "profileA": "/configs/profileA.json",
    "profileB": "/configs/profileB.json"
  },
  rootEl: document.body,                    // Optional
  onViewChange: (stateId, state) => { }     // Optional
});
```

**Parameters:**
- `assetsJsonPath` (string) - Path to assets configuration
- `defaultStateJsonPath` (string) - Path to default state configuration  
- `localConfigPaths` (object) - Map of profile IDs to profile config paths
- `rootEl` (HTMLElement) - Root element to search for data attributes (default: document.body)
- `onViewChange` (function) - Callback fired when state changes

**Returns:** `Promise<CustomViewsCore>`

### Core Instance Methods

#### Profile Management

```javascript
// Switch to a profile with optional state
await core.switchToProfile('profileA', 'advanced');

// Switch state within current profile
core.switchToState('expert');

// Get available profiles
const profiles = core.getAvailableProfiles();
// Returns: ['profileA', 'profileB']

// Get available states for current profile
const states = core.getAvailableStates();
// Returns: ['default', 'advanced', 'expert']

// Get current view information
const currentView = core.getCurrentView();
// Returns: { profile: 'profileA', state: 'advanced' }
```

#### Persistence Management

```javascript
// Clear all saved preferences
core.clearPersistence();

// Check if any persistence data exists
const hasData = core.hasPersistedData();
// Returns: boolean

// Get currently persisted view (without changing state)
const persistedView = core.getPersistedView();
// Returns: { profile: 'profileA', state: 'advanced' }

// Get persistence manager for advanced operations
const persistence = core.getPersistenceManager();
```

#### Event Handling

```javascript
// Add listener for state changes
const listener = () => {
  console.log('State changed!');
};
core.addStateChangeListener(listener);

// Remove listener
core.removeStateChangeListener(listener);
```

### Widget API

#### Widget Creation

```javascript
const widget = new CustomViewsWidget({
  core: customViewsCore,           // Required
  container: document.body,        // Optional
  position: 'top-right',          // Optional
  theme: 'auto',                  // Optional
  showProfiles: true,             // Optional
  showStates: true,               // Optional
  showReset: true,                // Optional
  customClasses: ['my-widget'],   // Optional
  title: 'Custom Views'           // Optional
});
```

#### Widget Methods

```javascript
// Render the widget
const widgetElement = widget.render();

// Update widget to reflect current state
widget.updateWidgetState();

// Toggle widget visibility
widget.toggle();

// Remove widget from DOM
widget.destroy();
```

### Persistence Manager API

```javascript
const persistence = core.getPersistenceManager();

// Get persisted view data
const view = persistence.getPersistedView();
// Returns: { profile: string | null, state: string | null }

// Manually persist a view
persistence.persistView('profileA', 'advanced');

// Persist only profile
persistence.persistProfile('profileA');

// Persist only state
persistence.persistState('advanced');

// Clear specific data
persistence.clearProfile();
persistence.clearState();
persistence.clearAll();

// Check if data exists
const hasData = persistence.hasPersistedData();

// Debug logging (development)
persistence.debugLog();
```

## Advanced Usage Patterns

### Custom Asset Rendering

You can extend the library to handle custom asset types:

```javascript
// The library calls renderAssetInto for each asset
// You can customize this by modifying the core behavior
const core = await CustomViews.initFromJson({
  // ... configuration
  onViewChange: (stateId, state) => {
    // Custom logic when view changes
    console.log('Active state:', stateId);
    console.log('Active placeholders:', state.placeholders);
    console.log('Active toggles:', state.toggles);
  }
});
```

### Dynamic Configuration Loading

```javascript
// Load configurations dynamically
const loadConfig = async (profileId) => {
  const response = await fetch(`/api/profiles/${profileId}`);
  return response.json();
};

// Update local config paths dynamically
const localConfigPaths = {
  "dynamic": await loadConfig('user-123')
};
```

### Integration with State Management

```javascript
// React example with state management
const [currentProfile, setCurrentProfile] = useState(null);

const core = await CustomViews.initFromJson({
  // ... configuration
  onViewChange: (stateId, state) => {
    // Update React state when Custom Views state changes
    setCurrentProfile(core.getCurrentView());
  }
});

// Update Custom Views when React state changes
useEffect(() => {
  if (selectedProfile) {
    core.switchToProfile(selectedProfile);
  }
}, [selectedProfile]);
```

## Common Patterns & Examples

### Multi-Language Support

```html
<!-- Language-specific content -->
<div data-customviews-placeholder="welcome-text"></div>

<!-- Language-specific help -->
<div data-customviews-toggle="help" data-customviews-id="help-content"></div>
```

```json
// assets.json
{
  "welcome-en": {
    "id": "welcome-en",
    "type": "html",
    "content": "<h1>Welcome!</h1>"
  },
  "welcome-es": {
    "id": "welcome-es", 
    "type": "html",
    "content": "<h1>¡Bienvenido!</h1>"
  }
}

// english-profile.json
{
  "states": {
    "default": {
      "placeholders": { "welcome-text": "welcome-en" },
      "toggles": ["help"]
    }
  }
}
```

### Skill Level Adaptation

```html
<!-- Difficulty-appropriate content -->
<div data-customviews-toggle="beginner">
  <h2>Getting Started</h2>
  <div data-customviews-placeholder="tutorial"></div>
</div>

<div data-customviews-toggle="advanced">
  <h2>Advanced Features</h2>
  <div data-customviews-placeholder="api-docs"></div>
</div>
```

### A/B Testing

```html
<!-- Different call-to-action buttons -->
<div data-customviews-placeholder="cta-button"></div>

<!-- Different layouts -->
<div data-customviews-toggle="layout-a">
  <div class="sidebar-layout">
    <div data-customviews-placeholder="sidebar-content"></div>
  </div>
</div>

<div data-customviews-toggle="layout-b">
  <div class="full-width-layout">
    <div data-customviews-placeholder="main-content"></div>
  </div>
</div>
```

### Feature Flags

```html
<!-- Beta features -->
<div data-customviews-toggle="beta-features">
  <div class="beta-badge">Beta</div>
  <div data-customviews-placeholder="new-feature"></div>
</div>

<!-- Deprecated features -->
<div data-customviews-toggle="legacy-support">
  <div class="deprecated-warning">
    This feature is deprecated
  </div>
  <div data-customviews-placeholder="legacy-tool"></div>
</div>
```

## Best Practices

### HTML Structure

1. **Use semantic HTML** - Choose appropriate HTML elements
2. **Provide fallback content** - Include default content when possible
3. **Use descriptive names** - Make placeholder and toggle names self-explanatory
4. **Consider accessibility** - Ensure dynamic content is accessible
5. **Test all states** - Verify content displays correctly in all configurations

### JavaScript Usage

1. **Handle async properly** - Use await with initFromJson
2. **Clean up listeners** - Remove event listeners when components unmount
3. **Error handling** - Wrap API calls in try-catch blocks
4. **Performance** - Avoid frequent state switches
5. **Debugging** - Use persistence.debugLog() during development

### Configuration Management

1. **Validate JSON** - Ensure all configuration files are valid
2. **Use relative paths** - For better portability
3. **Version your configs** - Track changes to configuration files
4. **Test combinations** - Verify all profile/state combinations work
5. **Document your setup** - Maintain clear documentation of your configuration structure

## Troubleshooting

### Common Issues

**Content not showing**
```javascript
// Check if element exists
const element = document.querySelector('[data-customviews-placeholder="logo"]');
console.log('Element found:', element);

// Check current state
console.log('Current view:', core.getCurrentView());

// Check if asset exists in current state
const currentView = core.getCurrentView();
// Verify the asset is properly configured
```

**Widget not working**
```javascript
// Verify core is initialized
console.log('Core initialized:', core);

// Check widget configuration
console.log('Widget rendered:', widget);

// Look for console errors
```

**Persistence not working**
```javascript
// Check localStorage availability
console.log('LocalStorage available:', typeof Storage !== 'undefined');

// Debug persistence
const persistence = core.getPersistenceManager();
persistence.debugLog();
```