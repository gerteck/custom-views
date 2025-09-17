# Changelog

Changelog for custom-views package that will bring greater customizability to authors of websites!

## Next Ver 

* Added state change listener mechanism to core for better component synchronization
* Widget now automatically updates when core state changes from any source (URL, persistence, API calls)
* Cleaner event handling in widget with automatic updates via listeners instead of manual calls
* URL parameters now take precedence over persistence and automatically update saved state
* Better separation between URL-driven state and persisted state management

---

## Previous - 2025-09-03

* Test usage on markbind site

---

To-do: Implement:
* Persistence across pages
* We can make this extendible to include multiple JSONs of assets as needed.

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