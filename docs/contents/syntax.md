<frontmatter>
  title: Syntax of the Library
</frontmatter>


### Toggles

In each site, there should be a set of toggle categories. These categories represent a set of content that will be shown or not shown on the page.

#### Toggle Category

Each toggle category is a group of related content that can be toggled on or off as a whole. When a category is toggled on, all elements belonging to that category are shown; when toggled off, all are hidden. This allows for easy control of large sections of content based on user selection or context.

* The toggle category in a `div` is defined by the custom data attribute: `data-customviews-toggle="<toggle-category>"`.

#### Toggle ID

In order to reduce the page bloat, toggles can be dynamically loaded as well.

* The id for a toggle element is uniquely identified by it's toggle category and toggle id. The togggle id is defined by the custom data attribute: `data-customviews-id="<toggle-id>"`
* The id for a toggle is just a hook for dynamic loading, not for finer toggle control. 

**Static Loading**:
* Without id: Treated as static content and always included in the HTML. It is hidden/shown only based on the toggle state. No network requests.

**Dynamic Loading**:
* With id: Treated as dynamic content slot. Starts out empty (or placeholder). When its toggle becomes active, you load its JSON (or whatever asset) and inject it. Can be cached once loaded so you don’t reload unnecessarily.




### Placeholders

Placeholders are used for mutually exclusive elements—only one variant should be visible at a time. For example, a logo placeholder can show either the “default” logo or a specific institute’s logo, but never both.

#### Static Loading

You can define a default or initial variant directly in the HTML. This static content is shown when the page loads, unless a different state is selected.

**Example:**
```html
<div data-customviews-placeholder="logo" data-customviews-state="default">
  <img src="logo-default.png">
</div>
```

#### Dynamic Loading

When a new state is selected, the placeholder fetches and injects the corresponding content (e.g., from a JSON or asset file). This replaces the static content, ensuring only one variant is visible at a time.

**Example:**
```html
<div data-customviews-placeholder="logo"></div>
```
The library will dynamically load and inject the correct logo for the selected state.

#### Behavior

- Only one child should exist inside each placeholder at any time.
- On view/state change, the library updates all placeholders to show the correct variant for the selected state.
- Static content is replaced by dynamic content when a new state is selected.
