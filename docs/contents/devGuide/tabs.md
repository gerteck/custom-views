<frontmatter>
  title: DevGuide - Tabs
</frontmatter>

## How do the Tabs and TabGroups work in CustomViews?

In the State object, we have a property called tab?: Record<string, string>.
* This tab object is a mapping of groupId -> tabId. This is for identifying which is the current active tab for a tabgroup for a given state.

## Core Module

When we run `init`, it will build the navigation bars for tabgroups. Core passes in a stateful function that will allow it to register the changes to state when each tab nav is pressed.

Then, everytime we `renderState`, on every state change, we wil call the functions in `TabManager`to hide or show tabs accordingly.

## Tab Manager

In the core module, we have the `TabManager`.

The TabManager is a static utility class that handles all the logic for discovering, rendering, and synchronizing tab groups across the page. 
  * It acts as the bridge between the core state management and the DOM elements.
  * It doesn't hold any state and is just utility class.


### Main methods:

* `applySelections()` -> Apply CSS based on state
* `buildNavs()` -> Builds the navigation bar
* `updateNavActiveState()` -> Updates the active states for a tabgroup id
* `updateAllNavActiveStates()` -> For all


applySelections() is the main visibility controller
* Finds all the `<cv-tabgroup>` elements in the DOM. 
* For each group, determines the active tab
* Applies visibility css (`cv-visible` or `cv-hidden` css selectors)

`buildNavs()` is the navigation builder 
* Looks for all cv-tabgroup elements with nav="auto" or no nav attributes
* For each group, builds the nav if don't exist (`.cv-tabs-nav`)
    * (Builds a navLink for each tabElement and sets active) 

`updateNavActiveState()` finds the tabgroup elements and updates the navbar.
`updateAllNavActiveStates()` Same, but for all tabgroups.


