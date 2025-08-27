<frontmatter>
  title: Introduction
  layout: default.md
  pageNav: 4
  pageNavTitle: "Topics"
</frontmatter>


## Introduction

Custom Views Library is a lightweight JavaScript library for managing dynamic content views based on data attributes.

Custom Views allows you to define placeholder elements in your HTML and dynamically populate them with content based on configuration.

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


