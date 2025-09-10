<frontmatter>
  title: Development Concepts
</frontmatter>

<br>

## Overall Idea

- **Custom View**: A configurable set of content and behaviors defined for a site or page.
- **Author**: The person who creates the site and defines what is possible—sets up all available views, toggles, and placeholders.
- **Adopter**: The person who provides a set of presets to create an adaptation—chooses which options are allowed and sets defaults for a specific use case or audience.
- **Viewer**: The person viewing the page in the browser—selects their preferred options within the allowed space, with the ability to share their chosen state via URL.

In short:
- The **Author** defines what is possible.
  - This means to define all placeholders, all toggles in the website content.

- The **Adopter** defines what is allowed and sets defaults.
  - Defines which presets are available for their audience, including defaults and constraints (e.g. disallow certain toggles).

- The **Viewer** picks what they want within the allowed space, with a shareable state (e.g., via URL).
  - Viewer will access the site through the adopter's preset (?) and within this adopter preset is constrained by the adopter presets.
  - The viewer will also be able to share the URL.

This separation allows for flexible site creation, adaptation for different audiences, and personalized viewing experiences, all while maintaining clear boundaries between what is possible, allowed, and chosen.


## Terminology of CustomViews

## 1. Placeholder

A placeholder is a mutually exclusive content slot — only one variant can exist at a time.
* Use cases: Used for things like logos, hero text, banners.

E.g.
```html
<div data-customviews-placeholder="logo"></div>
```

## 2. Toggle

A toggle is a set of coexisting elements — multiple toggles can be active simultaneously.
* Use case: Optional content like extra explanations, diagrams, dark mode, beginner/advanced sections.

E.g.
```html
<div data-customviews-toggle="beginner" data-customviews-id="intro"></div>
```

## 3. State

A state is to describe the current selection of placeholders and toggles selected. It is used to internally track which placeholders/toggles are active.
* `currentState` = combination of a placeholder mapping + selection of toggles enabled.

## 4. View: (A predefined State)

Each set of chosen placeholders / toggles is referred to as a view, which is
* View Definition: A named configuration consisting of one placeholder value per placeholder and zero or more toggles.

E.g.:

```json
{
  "placeholders": { "logo": "nus", "heroText": "student" },
  "toggles": ["beginner", "intermediate"]
}
```

Another way to understand a view is that one view is essentially a snapshot of the site state. This could be 
* global (applied across pages)
* per-page (future extension).

### 5.Profile / ViewScope / Local Config

A Profile/ LocalConfig is the set of placeholders and toggles that an Adopter exposes to Viewers.
* While a View is a single predefined configuration (a snapshot of placeholder values + toggles), a Profile defines the universe of options a Viewer can choose from.
* This allows the Adopter to constrain the viewer experience, e.g.,
  * lock a placeholder to a single option,
  * limit the number of toggles available,
  * provide default states.

Additionally, a profile can list multiple views within one a Profile/ViewScope.
A viewer can only select placeholder mappings and toggles as allowed by the ViewScope.

E.g. A sample Profile JSON / `LocalConfig`
```json
{
  "modifiablePlaceholderAssets": {
    "logo": ["asset-logo-v1", "asset-logo-v2"],
    "introText": ["asset-intro-v1", "asset-intro-beta"],
    "heroImage": ["asset-hero-v1", "asset-hero-beta"]
  },
  "allowedToggles": ["advanced", "betaFeatures", "charlieFeatures"],
  "defaultState": "defaultView",
  "states": {
    "defaultView": {
      "placeholders": {
        "logo": "asset-logo-v1",
        "introText": "asset-intro-v1",
        "heroImage": "asset-hero-v1"
      },
      "toggles": ["advanced"]
    },
    "betaView": {
      "placeholders": {
        "logo": "asset-logo-v2",
        "introText": "asset-intro-beta",
        "heroImage": "asset-hero-beta"
      },
      "toggles": ["advanced", "betaFeatures"]
    }
  }
}
```

### URL Formatting

URL formatting is important to encode the current view that is being shown to the viewer. This enables users to share their current view, and also for adopters to link their 
sites to custom tailor the content for the viewers.

The idea is that the URL will be able to encode the view under a specific viewscope/local config.
* The url will be something like `domain.com/path?local=_VIEWSCOPENAME_&view=_VIEW_`
* E.g. `domain.com/path?local=default&view=betaView`

We may also extend it to support custom granular control of the toggles or placeholders to allow a bespoke combination of selections.
* `/docs?local=Student&ph_logo=nus&ph_heroText=welcome&toggles=advanced`


**Default Behaviors:**

Additionally, if no `scope` param is in the URL, we will load the default scope. 

* Simple mental model → scope = which ViewScope, view = which preset.
* Graceful fallback → no scope = default.
* Customizability → can always extend with granular params.
* Readable and shareable → someone looking at the URL can guess what’s being loaded.

We could also add support for compact hashed encoding if URLs get too long or if encryption of the site is preferred.





