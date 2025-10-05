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

Custom Views Library is a lightweight JavaScript library for managing dynamic content views using data attributes. This documentation serves as both a user guide and a live demo of the library's capabilities.

It allows you to dynamically toggle content based on configuration and state, providing a flexible way to manage content that can change based on user interactions, preferences, or URL parameters.

### Interactive Demo

**Look for the "Custom Views" widget in the top-right corner** to interact with this demo in real-time! This entire page demonstrates the library's capabilities.

### Try It Out

1. **Use the Widget**: Look for the "Custom Views" widget in the corner
1. **Toggle Platforms**: Use "Customize View" to show/hide different OS sections
1. **Switch Tabs**: Use the "Tab Groups" section in the widget to switch between platforms and languages
1. **URL Sharing**: Share specific configurations via URL

## Demo: Tab Groups Feature

Tab groups allow you to create synchronized, mutually exclusive content sections. All instances of the same tab group stay in sync across the page.

### Platform-Specific Installation


<tabs>
  <tab header="First tab">
    Text in the first tab
    <markdown>_some markdown_</markdown>
  </tab>
  <tab header="Second Tab">
  </tab>
</tabs>

<cv-tabgroup id="platform" nav="auto">
  <cv-tab id="windows" header="🪟 Windows">
  
#### Windows Installation

```bash
# Using npm
npm install custom-views

# Using yarn
yarn add custom-views
```

**Note**: On Windows, you may need to run your terminal as Administrator for global installations.

  </cv-tab>
  <cv-tab id="mac" header="🍎 macOS">
  
#### macOS Installation

```bash
# Using npm
npm install custom-views

# Using yarn  
yarn add custom-views

# Using Homebrew (if available)
brew install node
npm install custom-views
```

**Note**: macOS users may need to use `sudo` for global installations.

  </cv-tab>
  <cv-tab id="linux" header="🐧 Linux">
  
#### Linux Installation

```bash
# Using npm
npm install custom-views

# Using yarn
yarn add custom-views

# On Debian/Ubuntu
sudo apt-get install nodejs npm
npm install custom-views
```

**Note**: Linux users should ensure Node.js and npm are installed via their package manager first.

  </cv-tab>
</cv-tabgroup>

### Language-Specific Usage Examples

<cv-tabgroup id="language" nav="auto">
  <cv-tab id="javascript" header="JavaScript">

#### JavaScript Usage

```javascript
// Import the library
import { CustomViews } from 'custom-views';

// Initialize with config
const core = await CustomViews.init({
  config: {
    allToggles: ['feature1', 'feature2'],
    defaultState: { toggles: ['feature1'] }
  }
});

console.log('CustomViews initialized!');
```

  </cv-tab>
  <cv-tab id="typescript" header="TypeScript">

#### TypeScript Usage

```typescript
// Import with types
import { CustomViews, type initOptions } from 'custom-views';

// Initialize with typed config
const options: initOptions = {
  config: {
    allToggles: ['feature1', 'feature2'],
    defaultState: { toggles: ['feature1'] }
  }
};

const core = await CustomViews.init(options);
console.log('CustomViews initialized with TypeScript!');
```

  </cv-tab>
  <cv-tab id="python" header="Python">

#### Python Usage (Conceptual)

```python
# Note: This is a JavaScript library
# For Python projects, you can use it in your templates

# In your Jinja2/Django template:
"""
<script src="custom-views.min.js"></script>
<script>
  // Initialize from template
  window.addEventListener('customviews:ready', function(e) {
    console.log('CustomViews ready in Python project!');
  });
</script>
"""
```

  </cv-tab>
</cv-tabgroup>

### Synchronized Tab Groups Demo

Notice how changing the platform in the widget affects **both** tab groups below:

#### First Platform Tab Group

<cv-tabgroup id="platform" nav="auto">
  <cv-tab id="windows" header="Windows">
  
**Windows Environment Variables**

Set your environment variables in PowerShell:
```powershell
$env:NODE_ENV = "production"
```

  </cv-tab>
  <cv-tab id="mac" header="macOS">
  
**macOS Environment Variables**

Set your environment variables in Terminal:
```bash
export NODE_ENV=production
```

  </cv-tab>
  <cv-tab id="linux" header="Linux">
  
**Linux Environment Variables**

Set your environment variables in your shell:
```bash
export NODE_ENV=production
# Add to ~/.bashrc or ~/.zshrc for persistence
```

  </cv-tab>
</cv-tabgroup>

#### Second Platform Tab Group (Same ID = Synced!)

<cv-tabgroup id="platform" nav="auto">
  <cv-tab id="windows" header="Windows">
  
**Windows File Paths**
- Use backslashes: `C:\Users\YourName\project`
- Or forward slashes: `C:/Users/YourName/project`

  </cv-tab>
  <cv-tab id="mac" header="macOS">
  
**macOS File Paths**
- Use forward slashes: `/Users/YourName/project`
- Home directory: `~/project`

  </cv-tab>
  <cv-tab id="linux" header="Linux">
  
**Linux File Paths**
- Use forward slashes: `/home/yourname/project`
- Home directory: `~/project`

  </cv-tab>
</cv-tabgroup>

**✨ Try it**: Click any tab above and watch both groups update simultaneously! You can also use the widget to control all tab groups at once.


## Demo of Toggles

### Platform-Specific Content

<div data-cv-toggle="mac">

## 🍎 macOS Development
Content specific to macOS development environment.

</div>

<div data-cv-toggle="linux">

## 🐧 Linux Development  
Content specific to Linux development environment.

</div>

<div data-cv-toggle="windows">

## 🪟 Windows Development
Content specific to Windows development environment.

</div>

<div data-customviews-toggle="windows">

## 🪟 Windows Development
Content specific to Windows development environment.

</div>

## Why Use Custom Views?

The concept behind Custom Views is very simple — showing or hiding elements based on state can be done with just plain JavaScript manipulating the DOM. However, this library provides several benefits that make it more robust, maintainable, and scalable.

Currently work in progress.

## References
* [GitHub Repository](https://github.com/gerteck/custom-views)
* [NPM Package](https://www.npmjs.com/package/custom-views)

Others:
* [i18n library](https://www.i18next.com/) - Similar concept for internationalization
* [mixitup](https://github.com/patrickkunka/mixitup) - DOM manipulation library


