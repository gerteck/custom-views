# Custom Views

v0.1.1

**Status:**  
Custom Views is prototype JavaScript library for dynamic content filtering and contextual rendering in static sites.  
- Core features are implemented: view-based filtering, author-friendly syntax, persistent selections via URL, and toggle rendering.
- Supports placeholders and toggles with image, text, and HTML content types.
- Easily integrates with static sites and MarkBind.
- No external dependencies.
- Bundled for npm (ESM, CJS, UMD builds).

## Features
- **View-based filtering:** Show/hide content based on selected views or roles.
- **Author-friendly syntax:** Use HTML attributes like `<div data-customviews-toggle="linux">`.
- **Persistent selections:** Encode selected views in URL hashes or local storage.
- **Composable logic:** Support multiple views per element with AND/OR logic.
- **URL sync & shareability:** Share links that preserve view state.
- **Lightweight & framework-agnostic:** No dependencies, easy to integrate.
- **Toggle and placeholder support:** Render images, text, or HTML blocks dynamically.

## Usage
Install via npm:

```sh
npm install custom-views
```

Import and initialize.
