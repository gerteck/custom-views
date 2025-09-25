<frontmatter>
  title: Development Concepts
</frontmatter>

<br>

## Overall Idea

- **Custom View**: A configurable set of content and behaviors defined for a site or page.
- **Author**: The person who creates the site and defines what is possible—sets up all available views and toggles.
- **Configurator**: The person who sets up the configuration—chooses which options are available and sets defaults for the intended audience.
- **Viewer**: The person viewing the page in the browser—selects their preferred options within the configured space, with the ability to share their chosen state via URL.

In short:
- The **Author** defines what is possible.
  - This means defining all toggles in the website content.

- The **Configurator** defines what is available and sets defaults.
  - Defines which predefined states are available and what toggles can be customized.

- The **Viewer** picks what they want within the configured space, with a shareable state (e.g., via URL).
  - Viewer can select from predefined states or create custom combinations within the allowed constraints.
  - The viewer can share their chosen configuration via URL.

This separation allows for flexible site creation, targeted configuration for specific audiences, and personalized viewing experiences, all while maintaining clear boundaries between what is possible, configured, and chosen.


## Terminology of CustomViews

## Toggle

A toggle is a set of coexisting elements — multiple toggles can be active simultaneously.
* Use case: Optional content like extra explanations, diagrams, dark mode, beginner/advanced sections, or platform-specific content.

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
  "placeholders": { "osImage": "macOSImage", "gitCommands": "gitInitMac" },
  "toggles": ["mac", "linux"]
}
```

Another way to understand a view is that one view is essentially a snapshot of the site state. This could be 
* global (applied across pages)
* per-page (future extension).

### 5. Configuration / Local Config

A Configuration (LocalConfig) defines the customization constraints that a Configurator makes available to Viewers.
* The Configuration defines what options a Viewer can choose from when creating custom states.
* This allows the Configurator to constrain the viewer experience, e.g.,
  * limit which assets can be used for placeholders,
  * restrict the number of toggles available,
  * provide a default starting state.

A viewer can only create custom combinations within the constraints defined by the Configuration.

E.g. A sample Configuration JSON / `LocalConfig`
```json
{
  "id": "myConfig",
  "allowedToggles": ["mac", "linux", "windows"],
  "defaultState": {
    "toggles": ["mac"]
  }
}
```

### URL Formatting

URL formatting is important to encode the current view that is being shown to the viewer. This enables users to share their current view, and also for configurators to link their 
sites to custom tailor the content for the viewers.

The simplified URL format supports:
* `domain.com/path?custom=_ENCODEDSTATE_` - Load a custom state (automatically encoded)

Examples:
* `/docs?custom=eyJwbGFjZWhvbGRlcnMiOnt9LCJ0b2dnbGVzIjpbXX0` - Load a custom state (encoded)

**Default Behaviors:**

If no parameters are in the URL, the library will:
1. Check for saved preferences in localStorage
2. Fall back to the default state defined in the configuration
3. If no configuration, use the base defaultState

* Simple mental model → custom = bespoke combination of toggles and placeholders.
* Graceful fallback → no params = saved preferences or default.
* Automatic encoding → custom states are automatically encoded for URL safety.
* Shareable → custom configurations can be shared via URL.

The library automatically handles compact encoding to keep URLs manageable and URL-safe.





