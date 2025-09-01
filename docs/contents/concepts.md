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
* `currentState` = combination of placeholder values + toggles.

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