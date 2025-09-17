<frontmatter>
  title: Custom Views Library - Interactive Documentation & Demo
  layout: default.md
  pageNav: 4
  pageNavTitle: "Topics"
</frontmatter>

<div class="bg-primary text-white px-2 py-5 mb-4">
   Welcome to Custom Views Library - Interactive Documentation & Demo
</div>

## Introduction

Custom Views Library is a lightweight JavaScript library for managing both static and dynamic content views using data attributes. This documentation serves as both a user guide and a live demo of the library's capabilities.

It allows you to define static placeholders in your HTML while dynamically populating or toggling content based on configuration and state, providing a flexible way to manage content that can change based on user interactions, preferences, or URL parameters.

### Interactive Demo

**Look for the "Custom Views" widget in the top-right corner** to interact with this demo in real-time! This entire page demonstrates the library's capabilities.

### Try It Out

1. **Use the Widget**: Look for the "Custom Views" widget in the top-right corner
2. **Switch Profiles**: Try "Profile A" and "Profile B" from the widget dropdown
3. **Change States**: Select different states within each profile
4. **Persistence**: Refresh the page - your selections will be remembered!
5. **URL Sharing**: You can still use direct URLs:
   * `?profile=profileA&state=alt`
   * `?profile=profileB&state=all`

## Live Demo Examples

### Placeholder Example
This logo changes based on the current profile and state:

<div data-customviews-placeholder="logo" style="width:150px; height:150px; border: 2px dashed #ccc; padding: 10px; text-align: center;"></div>

### Toggle Examples

<div data-customviews-toggle="beginner" data-customviews-id="intro"></div>

<div data-customviews-toggle="beginner">    

## Beginner View
This content is only visible when the "beginner" toggle is active. Perfect for showing introductory content to new users.

</div>

<div data-customviews-toggle="advanced" data-customviews-id="advancedIntro"></div>

<div data-customviews-toggle="advanced">    

## Advanced View
This content appears when "advanced" toggle is active. Great for showing detailed technical information.

</div>

<div data-customviews-toggle="expert" data-customviews-id="expertIntro"></div>

<div data-customviews-toggle="expert">    

## Expert View
This section is visible only in expert mode. Use for power-user features and advanced configurations.

</div>

## Why Use Custom Views?

The concept behind Custom Views is very simple — showing or hiding elements, or swapping content based on state, can be done with just plain JavaScript manipulating the DOM. However, this library provides several benefits that make it more robust, maintainable, and scalable:

* **Config-driven:** Define all your view states and content externally in JSON instead of hardcoding logic in JS.
* **Placeholder-based:** Use intuitive `data-` attributes to mark dynamic content slots directly in your HTML.
* **State management:** Built-in support for mutually exclusive placeholders or toggleable views, without writing extra JS logic.
* **Modularity:** Easily integrate into existing projects with minimal footprint, no dependencies required.
* **Consistency:** Standardized way to manage dynamic content, reducing the risk of bugs and repetitive code.
* **Use-case flexibility:** Ideal for A/B testing, regional customization, user preference-based content, and multi-tenant applications.
* **Persistence:** Built-in localStorage support for remembering user preferences
* **Widget Support:** Optional floating widget for easy user interaction

## Key Features

* **Placeholder-based** - Use data attributes to define content slots
* **Config-driven** - External JSON configuration for easy updates
* **Dynamic** - Content changes based on state/conditions
* **Modular** - Support for both placeholder values and toggle views
* **Lightweight** - No dependencies, minimal footprint
* **Persistent** - Remembers user preferences across sessions
* **URL-friendly** - Supports deep linking with query parameters

## Core Concepts

### State Management
The library supports two types of state:
* **Placeholder Values** - Mutually exclusive content (0 or 1 active)
* **Toggle Values** - Multiple can be active simultaneously (0 or more)

### Architecture Components
* **Core** - Main engine that handles state management and rendering
* **Widget** - Optional UI component for user interaction
* **Persistence** - localStorage management for user preferences
* **Assets Manager** - Handles loading and rendering of different asset types

## Use Cases

* A/B testing different UI variants
* Regional content customization
* User preference-based views
* Multi-tenant applications
* Dynamic content switching
* Educational content with different skill levels
* Feature flagging and gradual rollouts

## Quick Start

### Installation
```bash
npm install custom-views
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

## Documentation Navigation

* **[Concepts](/contents/concepts.html)** - Detailed explanation of library concepts and terminology
* **[Configuration](/contents/configuration.html)** - How to set up and configure the library
* **[Syntax](/contents/syntax.html)** - HTML data attributes and JavaScript API reference
* **[Demo](/contents/demo.html)** - Interactive examples and use cases
* **[Architecture](/contents/architecture.html)** - Developer guide and library internals

## References
* [GitHub Repository](https://github.com/gerteck/custom-views)
* [NPM Package](https://www.npmjs.com/package/custom-views)
* [i18n library](https://www.i18next.com/) - Similar concept for internationalization
* [mixitup](https://github.com/patrickkunka/mixitup) - DOM manipulation library


