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

1. **Use the Widget**: Look for the "Custom Views" widget in the corner
2. **Switch OS**: Select macOS, Linux, or Windows from the dropdown
3. **Toggle Platforms**: Use "Customize View" to show/hide different OS sections (no asset swapping!)
4. **URL Sharing**: Share specific configurations:
   * `?state=macOS` - Show macOS-specific content
   * `?state=windows` - Show Windows-specific content

## Live Demo - Cross-Platform Development

### OS Image
<div data-customviews-placeholder="osImage" style="width:200px; height:150px; border: 2px dashed #ccc; padding: 10px; text-align: center; margin: 10px 0;"></div>

### Git Setup Instructions
<div data-customviews-placeholder="gitCommands" style="margin: 15px 0;"></div>

### Platform-Specific Content

<div data-customviews-toggle="mac">

## 🍎 macOS Development
<div data-customviews-placeholder="fileStructure"></div>

</div>

<div data-customviews-toggle="linux">

## 🐧 Linux Development  
<div data-customviews-placeholder="fileStructure"></div>

</div>

<div data-customviews-toggle="windows">

## 🪟 Windows Development
<div data-customviews-placeholder="fileStructure"></div>

</div>

## Why Use Custom Views?

The concept behind Custom Views is very simple — showing or hiding elements, or swapping content based on state, can be done with just plain JavaScript manipulating the DOM. However, this library provides several benefits that make it more robust, maintainable, and scalable.

Currently work in progress.

## References
* [GitHub Repository](https://github.com/gerteck/custom-views)
* [NPM Package](https://www.npmjs.com/package/custom-views)

Others:
* [i18n library](https://www.i18next.com/) - Similar concept for internationalization
* [mixitup](https://github.com/patrickkunka/mixitup) - DOM manipulation library


