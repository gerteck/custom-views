# Changelog

## [0.2.0] - 2025-09-30

### Widget Redesign
* Rounded rectangle widget with gear icon (⚙) at the circular end
* Widget stays connected to screen edge on hover, extends inward
* Consistent sizing across all 6 positions (36px height, expands from 36px to 55px width)
* White background with black text for better visibility

### Welcome Modal
* **First-visit Modal**: Optional welcome screen for new users
* localStorage caching - shows only once per browser
* Configurable via `showWelcome`, `welcomeTitle`, `welcomeMessage` options
* Visual preview of widget icon in modal
* Theme support (light/dark)

### Other Improvements
* Added state change listener mechanism to core
* Widget auto-updates when core state changes from any source
* URL parameters take precedence over persistence
* Better event handling with automatic updates

---

## 2025-09-03


* Persistence across pages
* Extendible to include multiple JSONs of assets as needed.

Ideas:
  * Aggregate the assets into a singular assets json file that will point to all 
  dynamically loaded content, with unique keys.
  * Can support multiple JSON files -> Can simply add more JSON if needed. (Will need to check )


---


* Added logic for handling static elements vs dynamic elements (toggle / placeholder)
* Added master asset JSON where all assets live together (MASTER ASSET)
  * Custom views is supposed to be a web package library, so it should give a good way to init by giving url to the Assets JSON, some mapping to profiles etc.

- Change project to TypeScript.
- Add models for config, assets.
- Abstract out classes for different responsibilities
- Documentation for terminology and use cases.

---

## [0.1.1] - 2025-08-27

- Added basic dynamic fetching for content.


---

## [0.1.0] - Initial release

- Basic "Hello World"
- Setup project and rollup configs