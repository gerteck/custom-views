<frontmatter>
  title: Introduction
  layout: default.md
  pageNav: 4
  pageNavTitle: "Topics"
</frontmatter>


## Introduction

Custom Views Library is a lightweight JavaScript library for managing both static and dynamic content views using data attributes.  

It allows you to define static placeholders in your HTML while dynamically populating or toggling content based on configuration and state, providing a flexible way to manage content that can change based on user interactions, preferences, or URL parameters.

### Why Use Custom Views?

The concept behind Custom Views is very simple — showing or hiding elements, or swapping content based on state, can be done with just plain JavaScript manipulating the DOM. However, this library provides several benefits that make it more robust, maintainable, and scalable:

* **Config-driven:** Define all your view states and content externally in JSON instead of hardcoding logic in JS.
* **Placeholder-based:** Use intuitive `data-` attributes to mark dynamic content slots directly in your HTML.
* **State management:** Built-in support for mutually exclusive placeholders or toggleable views, without writing extra JS logic.
* **Modularity:** Easily integrate into existing projects with minimal footprint, no dependencies required.
* **Consistency:** Standardized way to manage dynamic content, reducing the risk of bugs and repetitive code.
* **Use-case flexibility:** Ideal for A/B testing, regional customization, user preference-based content, and multi-tenant applications.

In short, while a few lines of JavaScript could achieve similar effects, Custom Views provides structure, scalability, and convenience, making it suitable for projects that need maintainable and dynamic content management.


### Basic Usage
1. Define placeholders and toggles in HTML
2. Configure your views
3. Sample configuration (views.json)

### Features
* Placeholder-based - Use data attributes to define content slots
* Config-driven - External JSON configuration for easy updates
* Dynamic - Content changes based on state/conditions
* Modular - Support for both placeholder values and toggle views
* Lightweight - No dependencies, minimal footprint


### State Management
The library supports two types of state:
* Placeholder Values - Mutually exclusive content (0 or 1 active)
* Toggle Values - Multiple can be active simultaneously (0 or more)

### Use Cases Ideal For
* A/B testing different UI variants
* Regional content customization
* User preference-based views
* Multi-tenant applications
* Dynamic content switching

### Getting Started
```bash
npm install custom-views
```

[GitHub repository](https://github.com/gerteck/custom-views)


## References
* i18n library [link](https://www.i18next.com/)
* mixitup [link](https://github.com/patrickkunka/mixitup)


