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

<cv-tabgroup id="fruit" nav="auto">
  <cv-tab id="apple" header="Apple">
  
**Apple Information**

Apples are crisp, sweet fruits that come in many varieties. They are rich in fiber and vitamin C.

<box type="success" icon=":apple:">
    An apple a day keeps the doctor away!
</box>

  </cv-tab>
  <cv-tab id="orange" header="Orange">
  
**Orange Information**

Oranges are citrus fruits known for their high vitamin C content and refreshing juice.

  </cv-tab>
  <cv-tab id="pear" header="Pear">
  
**Pear Information**

Pears are sweet, bell-shaped fruits with a soft texture when ripe. They're high in fiber and antioxidants.

  </cv-tab>
</cv-tabgroup>

<cv-tabgroup id="fruit" nav="auto">
  <cv-tab id="apple" header="Apple">
  
I love Apples!

  </cv-tab>
  <cv-tab id="orange" header="Orange">
  
I love Oranges!

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


## Why Use Custom Views?

The concept behind Custom Views is very simple — showing or hiding elements based on state can be done with just plain JavaScript manipulating the DOM. However, this library provides several benefits that make it more robust, maintainable, and scalable.

Currently work in progress.

## References
* [GitHub Repository](https://github.com/customviews-js/customviews)
* [NPM Package](https://www.npmjs.com/package/customviews)

Others:
* [i18n library](https://www.i18next.com/) - Similar concept for internationalization
* [mixitup](https://github.com/patrickkunka/mixitup) - DOM manipulation library


