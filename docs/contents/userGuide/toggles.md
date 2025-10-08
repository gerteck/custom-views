<frontmatter>
	title: User Guide - Toggles
</frontmatter>

# Toggles

Toggles let you show or hide sections of a page based on a category (for example: `mac`, `linux`, `windows`). They are ideal for platform-specific content, progressive disclosure, or audience-targeted sections.

## Basic Usage

### CODE:

```html
<div data-cv-toggle="mac">
	<!-- macOS-specific instructions here -->
  Mac Toggle
</div>

<div data-cv-toggle="linux">
	<!-- Linux-specific instructions here -->
  Linux Toggle
</div>

<div data-cv-toggle="windows">
	<!-- Windows-specific instructions here -->
  Windows Toggle
</div>

```

### OUTPUT:

<div data-cv-toggle="mac">
	<!-- macOS-specific instructions here -->
  Mac Toggle
</div>

<div data-cv-toggle="linux">
	<!-- Linux-specific instructions here -->
  Linux Toggle
</div>

<div data-cv-toggle="windows">
	<!-- Windows-specific instructions here -->
  Windows Toggle
</div>

---

When the active state includes `mac`, only the element with `data-cv-toggle="mac"` will be visible. The library applies `.cv-visible` and `.cv-hidden` classes to animate visibility transitions.

Legacy attribute names are supported for backwards compatibility: `data-customviews-toggle` behaves the same as `data-cv-toggle`.

## Configuration (required for widget integration)

To make toggles discoverable by the Custom Views widget and to provide a sensible default state, list your toggle ids in the configuration file (`customviews.config.json`). At minimum add them to `config.allToggles`. You should also configure the initial state in `config.defaultState.toggles` so the site loads with the expected visible toggles.

Example (excerpt):

```json
{
	"config": {
		"allToggles": ["mac", "linux", "windows"],
		"defaultState": {
			"toggles": ["mac", "linux", "windows"]
		}
	}
}
```

Notes:
- `allToggles` — a list of all toggle ids the site uses. The widget will use this to render toggle controls.
- `defaultState.toggles` — the toggles that should be visible on initial load when there is no URL state or persisted state.

## Attributes and Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `data-cv-toggle` | string | **(required for toggle behavior)** | Category that determines whether the element is visible. Example: `data-cv-toggle="mac"`. |
| `data-cv-id` / `data-customviews-id` | string | - | If present, the element will be used as a render target for an asset (see Assets Manager). Useful when toggles are asset placeholders. |

### How visibility is determined

The effective visible toggles are resolved in this order of precedence:
1. URL state (if shareable URL is present)
2. Persisted localStorage state
3. `config.defaultState` from your config file

Elements whose toggle ids are included in the resolved state are shown; others are hidden.

## Advanced Features

- Widget integration: When you define `allToggles` in the config and enable the widget, users get an interactive panel to switch toggles at runtime (the widget respects `config.widget` settings).
- Asset rendering: If a toggle element contains `data-cv-id` (or the legacy `data-customviews-id`), the AssetsManager will render the corresponding asset into that element when the toggle becomes visible.
- Multiple categories: Mark an element with multiple categories to make it visible for several active toggle selections (space-separated list). This is useful for shared content across platforms.
- URL state & sharing: Toggle selections are saved to the URL when `showUrl`/`showUrl` is enabled in your config, allowing bookmarking and sharing of specific views.

## Examples and Patterns

Platform-specific section (recommended pattern):

```html
<section data-cv-toggle="mac">
	<h2>macOS</h2>
	<p>macOS-specific install steps...</p>
</section>

<section data-cv-toggle="linux">
	<h2>Linux</h2>
	<p>Linux-specific install steps...</p>
</section>

<section data-cv-toggle="windows">
	<h2>Windows</h2>
	<p>Windows-specific install steps...</p>
</section>
```

Shared content for multiple platforms:

```html
<div data-cv-toggle="mac linux">
	<p>This content is shown for macOS and Linux users.</p>
</div>
```

