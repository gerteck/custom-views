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
    "beginner",
    "intermediate",
    "advanced"
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
      "toggles": ["beginner", "intermediate"]
    },
    "teacher": {
      "placeholders": {
        "logo": "nus",
        "heroText": "teacher"
      },
      "toggles": ["beginner", "intermediate", "advanced"]
    }
  },
  "data": {
    "placeholders": {
      "logo": {
        "default": {
          "type": "image",
          "src": "/assets/logo-default.png",
          "alt": "Default Logo"
        },
        "nus": {
          "type": "image",
          "src": "/assets/logo-nus.png",
          "alt": "NUS Logo"
        },
        "ntu": {
          "type": "image",
          "src": "/assets/logo-ntu.png",
          "alt": "NTU Logo"
        }
      },
      "heroText": {
        "welcome": {
          "type": "text",
          "content": "Welcome to CustomViews!"
        },
        "student": {
          "type": "text",
          "content": "Hello Students, explore your learning journey."
        },
        "teacher": {
          "type": "text",
          "content": "Welcome Teachers, inspire the next generation."
        }
      }
    },
    "toggles": {
      "beginner": {
        "intro": {
          "type": "text",
          "content": "This is the beginner-friendly explanation."
        }
      },
      "intermediate": {
        "diagram": {
          "type": "image",
          "src": "/assets/intermediate-diagram.png",
          "alt": "Intermediate Diagram"
        }
      },
      "advanced": {
        "details": {
          "type": "html",
          "content": "<p>Advanced details with <strong>deep dive</strong> into the topic.</p>"
        }
      }
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
