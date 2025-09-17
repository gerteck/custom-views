<frontmatter>
  title: Interactive Demo & Examples
</frontmatter>

# Interactive Demo & Examples

This page demonstrates various features and usage patterns of the Custom Views library with live, interactive examples.

We will use different OSes to show the different states!

## Demo Controls

**Use the "Custom Views" widget in the top-right corner** to interact with all examples on this page in real-time!

### Available Profiles

- **Profile A** - Basic user profile with beginner and advanced modes
- **Profile B** - Advanced user profile with expert features  
- **Profile OS** - Operating system specific profile with Mac, Linux, and Windows toggles

### OS-Specific Demos

Explore cross-platform development with our new operating system demos:

<box type="info">

#### :fas-terminal: [Git CLI Mastery](cliMastery.html)
Learn Git commands across **macOS**, **Linux**, and **Windows**. See platform-specific installation methods, command syntax variations, and OS-specific tools.

#### :fas-folder-tree: [File System Structures](fileStructure.html)  
Understand how different operating systems organize files, install applications, and manage configurations. Perfect for developers working across multiple platforms.

</box>



## Live Examples

### 1. Placeholder Examples

#### Dynamic Logo Placeholder
This logo changes based on your current profile and state selection:

<div data-customviews-placeholder="logo" style="width:150px; height:150px; border: 2px dashed #ccc; padding: 10px; text-align: center; margin: 20px 0; background: #f9f9f9;"></div>

**How it works:**
- Uses `data-customviews-placeholder="logo"`
- Content is dynamically loaded based on current state
- Asset content is rendered directly into the element

### 2. Toggle Examples

#### Beginner Content Toggle

<div data-customviews-toggle="beginner" data-customviews-id="intro"></div>

<div data-customviews-toggle="beginner" style="border: 2px solid #28a745; padding: 15px; margin: 10px 0; border-radius: 5px; background: #d4edda;">    

### 🟢 Beginner View Active

This content is only visible when the "beginner" toggle is active. Perfect for:
- Introductory explanations
- Step-by-step guides  
- Basic concepts
- Getting started tutorials

**Implementation:**
```html
<div data-customviews-toggle="beginner">
  <!-- Content for beginners -->
</div>
```

</div>

#### Advanced Content Toggle

<div data-customviews-toggle="advanced" data-customviews-id="advancedIntro"></div>

<div data-customviews-toggle="advanced" style="border: 2px solid #ffc107; padding: 15px; margin: 10px 0; border-radius: 5px; background: #fff3cd;">    

### 🟡 Advanced View Active

This content appears when the "advanced" toggle is active. Great for:
- Detailed technical information
- Advanced configuration options
- Best practices and tips
- Performance considerations

**Implementation:**
```html
<div data-customviews-toggle="advanced">
  <!-- Advanced content -->
</div>
```

</div>

#### Expert Content Toggle

<div data-customviews-toggle="expert" data-customviews-id="expertIntro"></div>

<div data-customviews-toggle="expert" style="border: 2px solid #dc3545; padding: 15px; margin: 10px 0; border-radius: 5px; background: #f8d7da;">    

### 🔴 Expert View Active

This section is visible only in expert mode. Perfect for:
- Power-user features
- Advanced API documentation
- Custom configuration options
- Technical deep-dives

**Implementation:**
```html
<div data-customviews-toggle="expert">
  <!-- Expert-level content -->
</div>
```

</div>

### 3. Combined Examples

#### Conditional Placeholder with Toggle

<div data-customviews-toggle="advanced">

**Advanced Logo Variant:**
<div data-customviews-placeholder="logo" data-customviews-id="staticAsset" style="padding: 10px; border: 1px solid #007bff; background: #e7f3ff; margin: 10px 0;">
This shows a specific logo variant only in advanced mode.
</div>

</div>

### 4. Real-World Use Cases

#### Feature Flag Example

<div data-customviews-toggle="expert">

<div style="background: #f0f8ff; border: 1px solid #0066cc; padding: 15px; border-radius: 5px; margin: 10px 0;">

#### 🧪 Beta Feature Preview

<div data-customviews-placeholder="logo" style="width:100px; height:100px; float: right; border: 1px dashed #0066cc; margin-left: 15px;"></div>

This is a beta feature that's only shown to expert users. It demonstrates how you can use toggles for feature flagging and gradual rollouts.

**Key Benefits:**
- Progressive disclosure of features
- A/B testing capabilities  
- Role-based content visibility
- Reduced cognitive load for beginners

</div>

</div>

#### Multi-Modal Content

<div data-customviews-toggle="beginner">

<div style="background: #f0fff0; border: 1px solid #28a745; padding: 15px; border-radius: 5px; margin: 10px 0;">

#### 📚 Learning Mode

When in beginner mode, content is presented with:
- Simple explanations
- Step-by-step instructions
- Visual aids and examples
- Reduced technical jargon

</div>

</div>

<div data-customviews-toggle="advanced">

<div style="background: #fff8e1; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 10px 0;">

#### ⚙️ Configuration Mode

Advanced users see:
- Technical implementation details
- Configuration options
- Performance considerations
- Best practices and optimization tips

</div>

</div>

<div data-customviews-toggle="expert">

<div style="background: #fef2f2; border: 1px solid #dc3545; padding: 15px; border-radius: 5px; margin: 10px 0;">

#### 🔧 Developer Mode

Expert mode provides:
- Low-level API documentation
- Advanced configuration examples
- Debugging and troubleshooting guides
- Extension and customization options

</div>

</div>

## Code Examples

### Basic HTML Structure

```html
<!-- Placeholders for dynamic content -->
<div data-customviews-placeholder="logo"></div>
<div data-customviews-placeholder="welcome-text"></div>

<!-- Toggles for conditional content -->
<div data-customviews-toggle="beginner">
  <h2>Getting Started</h2>
  <p>Welcome to our beginner-friendly guide!</p>
</div>

<div data-customviews-toggle="advanced">
  <h2>Advanced Features</h2>
  <p>Explore powerful capabilities for experienced users.</p>
</div>

<!-- Combined toggle with dynamic content -->
<div data-customviews-toggle="help" data-customviews-id="context-help">
  <!-- Dynamic help content will be rendered here -->
</div>
```

### JavaScript Integration

```javascript
// Initialize the library
const core = await CustomViews.initFromJson({
  assetsJsonPath: '/configs/assets.json',
  defaultStateJsonPath: '/configs/defaultState.json',
  localConfigPaths: {
    "profileA": "/configs/profileA.json",
    "profileB": "/configs/profileB.json"
  }
});

// Add a widget for user interaction
const widget = new CustomViewsWidget({
  core: core,
  position: 'top-right',
  title: 'Demo Controls'
});
widget.render();

// Listen for view changes
core.addStateChangeListener(() => {
  console.log('View changed:', core.getCurrentView());
});
```

### Configuration Structure

```json
// assets.json - Define available content
{
  "logo-primary": {
    "id": "logo-primary",
    "type": "image", 
    "src": "/assets/logo-1.png"
  },
  "intro-text": {
    "id": "intro-text",
    "type": "html",
    "content": "<h1>Welcome!</h1><p>Get started here.</p>"
  }
}

// profileA.json - Define what's available for this profile
{
  "id": "profileA",
  "modifiablePlaceholderAssets": {
    "logo": ["logo-primary", "logo-secondary"]
  },
  "allowedToggles": ["beginner", "advanced"],
  "states": {
    "default": {
      "placeholders": { "logo": "logo-primary" },
      "toggles": ["beginner"]
    }
  },
  "defaultState": "default"
}
```

## Testing Different Scenarios

### Scenario 1: New User Experience
1. Select **Profile A** → **Beginner Friendly** state
2. Notice how only beginner content is shown
3. The interface is simplified and focused

### Scenario 2: Power User Experience  
1. Select **Profile B** → **All Features** state
2. See how expert-level content becomes available
3. Advanced features and options are exposed

### Scenario 3: Persistence Testing
1. Switch to any profile and state combination
2. Refresh the page
3. Notice your selection is remembered via localStorage

### Scenario 4: URL Sharing
1. Configure your preferred view using the widget
2. Copy the current URL (includes profile and state parameters)
3. Share with others or bookmark for later

## Performance Notes

The demo shows how the library handles:

- **Lazy loading** - Content is only loaded when needed
- **Caching** - Assets are cached after first load
- **Smooth transitions** - Content changes without page reloads
- **Memory efficiency** - Only active content is in the DOM

## Operating System Toggle Demos

See the OS-specific toggles in action! These examples show how content can be tailored for different operating systems:

### OS Image Placeholder
This image changes based on the selected operating system:

<div data-customviews-placeholder="osImage" style="width: 100px; height: 100px; margin: 20px auto; text-align: center; border: 2px solid #ddd; border-radius: 10px; padding: 10px; background: #f8f9fa;"></div>

### OS-Specific Content

<div data-customviews-toggle="mac" style="border: 2px solid #007aff; padding: 15px; margin: 10px 0; border-radius: 8px; background: #e3f2fd;">
<strong>🍎 macOS Active</strong> - This content is only visible when the Mac toggle is active. Perfect for macOS-specific instructions, Homebrew commands, or .app bundle information.
</div>

<div data-customviews-toggle="linux" style="border: 2px solid #ffc107; padding: 15px; margin: 10px 0; border-radius: 8px; background: #fff8e1;">
<strong>🐧 Linux Active</strong> - This content appears for Linux users. Great for package manager commands (apt, yum, pacman), filesystem hierarchy explanations, or distribution-specific notes.
</div>

<div data-customviews-toggle="windows" style="border: 2px solid #28a745; padding: 15px; margin: 10px 0; border-radius: 8px; background: #e8f5e8;">
<strong>🪟 Windows Active</strong> - Windows-specific content appears here. Perfect for PowerShell commands, registry information, or Windows-specific file paths.
</div>

**Try switching between OS profiles** using the Custom Views widget to see how content adapts!

---

## Browser DevTools Exploration

Open your browser's developer console to explore:

```javascript
// Access the core instance
window.customViewsCore.getCurrentView()

// Explore persistence
window.customViewsPersistence.debugLog()

// Test programmatic changes
window.customViewsCore.switchToProfile('profileB', 'all')
```

## Next Steps

After exploring this demo:

1. **[Read the Configuration Guide](/contents/configuration.html)** - Learn how to set up your own configurations
2. **[Study the Syntax Reference](/contents/syntax.html)** - Master the HTML attributes and JavaScript API
3. **[Understand the Concepts](/contents/concepts.html)** - Dive deeper into the library's architecture

Try building your own custom views based on these examples!