<frontmatter>
  title: User Guide - Tabs
</frontmatter>

# Tab Groups

Tab groups allow you to create synchronized, mutually exclusive content sections. All instances of the same tab group stay in sync across the page.

## Basic Usage

### CODE:

```html
<cv-tabgroup id="fruit" nav="auto">
  <cv-tab id="apple" header="Apple">
  
**Apple Information**

Apples are crisp, sweet fruits that come in many varieties. They are rich in fiber and vitamin C.

<box type="success" icon=":apple:">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit
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
```

### OUTPUT:

The above code will render a tab navigation bar with three tabs (Apple, Orange, Pear), and only the active tab's content will be visible. Clicking on any tab will switch the displayed content.

<cv-tabgroup id="fruit" nav="auto">
  <cv-tab id="apple" header="Apple">
  
**Apple Information**

Apples are crisp, sweet fruits that come in many varieties. They are rich in fiber and vitamin C.

<box type="success" icon=":apple:">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit
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




* **Synchronized Tab Groups** Multiple tab groups with the same `id` will automatically synchronize. When you switch tabs in one group, all other groups with the same ID will update simultaneously.
* E.g. Clicking "Orange" in the first group will automatically switch the second group to "Orange" as well.

## Configuration

Tab groups work out of the box without any configuration—just use the `<cv-tabgroup>` and `<cv-tab>` elements in your HTML. The first tab will be shown by default.

However, you can optionally configure tab groups in your configuration file for additional features:

### Config File (Optional)

Define tab groups in your `customviews.config.json` for:
- **Widget integration**: Tab groups appear in the Custom Views widget for easy switching
- **Custom labels**: Display friendly names in the widget
- **Default tab selection**: Specify which tab shows initially (instead of always using the first tab)

```json
{
  "config": {
    "tabGroups": [
      {
        "id": "fruit",
        "label": "Fruit Selection",
        "default": "apple",
        "tabs": [
          { "id": "apple", "label": "Apple" },
          { "id": "orange", "label": "Orange" },
          { "id": "pear", "label": "Pear" }
        ]
      }
    ]
  }
}
```

<box type="info">

**Note:** Configuration is completely optional. Tab groups will work perfectly fine without being added to the config file—they'll just default to showing the first tab and won't appear in the widget.
</box>

## Options

### `<cv-tabgroup>` Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | **(required)** | Unique identifier for the tab group. Tab groups with the same ID will synchronize. |
| `nav` | string | `"auto"` | Navigation display mode. Use `"auto"` to automatically generate navigation, or omit the attribute (defaults to auto). Use `"none"` to hide navigation. |

### `<cv-tab>` Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | **(required)** | Unique identifier for the tab within its group. |
| `header` | string | Tab ID | Display label for the tab in the navigation bar. Supports text and emojis. |

### Config File Options

#### TabGroupConfig

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | **(required)** | Group identifier (must match HTML `cv-tabgroup` id). |
| `label` | string | - | Display name shown in the widget. |
| `tabs` | TabConfig[] | **(required)** | Array of tab configurations. |
| `default` | string | First tab | Default tab ID to show on initial load. |

#### TabConfig

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | **(required)** | Tab identifier (must match HTML `cv-tab` id). |
| `label` | string | - | Display label for the tab (used in widget and as fallback for header). |

## Advanced Features

### Custom Headers with Emojis

```html
<cv-tab id="apple" header="🍎 Apple">
  Apple content here
</cv-tab>
```

### No Navigation Mode

To hide the navigation bar (useful when controlling tabs via widget only):

```html
<cv-tabgroup id="fruit" nav="none">
  <cv-tab id="apple">Apple content</cv-tab>
  <cv-tab id="orange">Orange content</cv-tab>
</cv-tabgroup>
```

### Widget Integration

When tab groups are defined in the config file with `label` properties, they automatically appear in the Custom Views widget, allowing users to switch tabs from a centralized control panel.

### URL State Persistence

Tab selections are automatically saved to the URL, allowing users to:
- Bookmark specific tab configurations
- Share links with pre-selected tabs
- Navigate back/forward through tab history
