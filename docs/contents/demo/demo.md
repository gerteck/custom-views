<frontmatter>
  title: Interactive Demo & Examples
</frontmatter>

# Interactive Demo & Examples

This page demonstrates various features and usage patterns of the Custom Views library with live, interactive examples.

We will use different OSes to show the different states!

## Demo Controls

**Use the "Custom Views" widget in the top-right corner** to interact with all examples on this page in real-time!

### OS-Specific Demos

Explore cross-platform development with our new operating system demos:

<box type="info">

#### :fas-terminal: [Git CLI Mastery](cliMastery.html)
Learn Git commands across **macOS**, **Linux**, and **Windows**. See platform-specific installation methods, command syntax variations, and OS-specific tools.

#### :fas-folder-tree: [File System Structures](fileStructure.html)  
Understand how different operating systems organize files, install applications, and manage configurations. Perfect for developers working across multiple platforms.

</box>

## Hide Toggles

Demonstrating the new visibility APIs:

- Hide by id:

```html
<button onclick="window.cvCore.setToggleVisibility('linux', false)">Hide Linux</button>
<button onclick="window.cvCore.setToggleVisibility('linux', true)">Show Linux</button>
```

- Hide by predicate (group):

```html
<button onclick="window.cvCore.setVisibility(id => id.startsWith('win'), false)">Hide all Windows</button>
<button onclick="window.cvCore.setVisibility(id => id.startsWith('win'), true)">Show all Windows</button>
```

- Hide all / Show all:

```html
<button onclick="window.cvCore.hideAll()">Hide All</button>
<button onclick="window.cvCore.showAll()">Show All</button>
```

Note: Hidden toggles are excluded from URL and persistence. The widget disables controls for hidden toggles automatically.

