<frontmatter>
  title: Configuration Options
</frontmatter>

<br>

# Configuration Options

<frontmatter>
  title: Configuration Options
</frontmatter>

<br>

# Configuration Options

The `customviews.init(options, callback)` function accepts a configuration object defining placeholders, toggles, and states (profiles).  

---

## Sample Configuration

```json
{
  "placeholders": {
    "logo": ["default", "nus", "ntu"],
    "heroText": ["welcome", "student", "teacher"]
  },
  "toggles": [
    "showAdvancedExplanation",
    "showDiagram",
    "enableDarkMode"
  ],
  "states": {
    "default": {
      "placeholders": {
        "logo": "default",
        "heroText": "welcome"
      },
      "toggles": []
    },
    "student": {
      "placeholders": {
        "logo": "nus",
        "heroText": "student"
      },
      "toggles": ["showDiagram"]
    },
    "teacher": {
      "placeholders": {
        "logo": "ntu",
        "heroText": "teacher"
      },
      "toggles": ["showDiagram", "showAdvancedExplanation"]
    }
  }
}
```


### Explanation
placeholders: Mutually exclusive slots; each key has an array of valid options.

toggles: Optional content that can coexist; each toggle is independent.

states: Named configurations defining which placeholder value is active and which toggles are enabled.

```javascript
// Initialize CustomViews with this configuration
customviews.init(config, () => {
  console.log("CustomViews initialized!");
});
```
