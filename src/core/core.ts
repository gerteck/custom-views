import type { State, TabGroupConfig, Config } from "../types/types";
import type { AssetsManager } from "./assets-manager";
import { renderAssetInto } from "./render";
import { PersistenceManager } from "./persistence";
import { URLStateManager } from "./url-state-manager";
import { VisibilityManager } from "./visibility-manager";
import { TabManager } from "./tab-manager";
import { injectCoreStyles } from "../styles/styles";


export interface CustomViewsOptions {
  assetsManager: AssetsManager;
  config: Config;
  rootEl?: HTMLElement | undefined;
}

export class CustomViewsCore {
  private rootEl: HTMLElement;
  private assetsManager: AssetsManager;
  private persistenceManager: PersistenceManager;
  private visibilityManager: VisibilityManager;

  private stateFromUrl: State | null = null;
  private config: Config;
  private stateChangeListeners: Array<() => void> = [];

  constructor(opt: CustomViewsOptions) {
    this.assetsManager = opt.assetsManager;
    this.config = opt.config;
    this.rootEl = opt.rootEl || document.body;
    this.persistenceManager = new PersistenceManager();
    this.visibilityManager = new VisibilityManager();
  }

  public getConfig(): Config {
    return this.config;
  }

  /**
   * Get tab groups from config
   */
  public getTabGroups(): TabGroupConfig[] | undefined {
    return this.config.tabGroups;
  }

  /**
   * Get currently active tabs (from URL > persisted > defaults)
   */
  public getCurrentActiveTabs(): Record<string, string> {
    // Priority: URL state > persisted state > default state
    let currentState: State | null = null;

    if (this.stateFromUrl) {
      currentState = this.stateFromUrl;
    } else {
      currentState = this.persistenceManager.getPersistedState();
    }

    if (!currentState) {
      currentState = this.config.defaultState;
    }

    return currentState.tabs || {};
  }

  /**
   * Set active tab for a group and apply state
   */
  public setActiveTab(groupId: string, tabId: string): void {
    // Get current state
    const currentToggles = this.getCurrentActiveToggles();
    const currentTabs = this.getCurrentActiveTabs();

    // Merge new tab selection
    const newTabs = { ...currentTabs, [groupId]: tabId };

    // Create new state
    const newState: State = {
      toggles: currentToggles,
      tabs: newTabs
    };

    // Apply the state
    this.applyState(newState);

    // Emit custom event
    const event = new CustomEvent('customviews:tab-change', {
      detail: { groupId, tabId },
      bubbles: true
    });
    document.dispatchEvent(event);
  }

  // Inject styles, setup listeners and call rendering logic
  public async init() {
    injectCoreStyles();

    // Build navigation once (with click handlers)
    TabManager.buildNavs(this.rootEl, this.config.tabGroups, (groupId, tabId) => {
      this.setActiveTab(groupId, tabId);
    });

    // For session history, clicks on back/forward button
    window.addEventListener("popstate", () => {
      this.loadAndCallApplyState();
    });
    this.loadAndCallApplyState();
  }

  // Priority: URL state > persisted state > default
  // Also filters using the visibility manager to persist selection
  // across back/forward button clicks
  private async loadAndCallApplyState() {
    // 1. URL State
    this.stateFromUrl = URLStateManager.parseURL();
    if (this.stateFromUrl) {
      this.applyState(this.stateFromUrl);
      return;
    }

    // 2. Persisted State
    const persistedState = this.persistenceManager.getPersistedState();
    if (persistedState) {
      this.applyState(persistedState);
      return;
    }

    // 3. Local Config Fallback
    this.renderState(this.config.defaultState);
  }

  /**
  * Apply a custom state, saves to localStorage and updates the URL
  */
  public applyState(state: State) {
    this.renderState(state);
    this.persistenceManager.persistState(state);
    this.stateFromUrl = state;
    URLStateManager.updateURL(state);
  }

  /** Render all toggles for the current state */
  private renderState(state: State) {
    const toggles = state.toggles || [];
    const finalToggles = this.visibilityManager.filterVisibleToggles(toggles);

    // Toggles hide or show relevant toggles
    this.rootEl.querySelectorAll("[data-cv-toggle], [data-customviews-toggle]").forEach(el => {
      const category = (el as HTMLElement).dataset.cvToggle || (el as HTMLElement).dataset.customviewsToggle;
      const shouldShow = !!category && finalToggles.includes(category);
      this.visibilityManager.applyElementVisibility(el as HTMLElement, shouldShow);
    });

    // Render toggles
    for (const category of finalToggles) {
      this.rootEl.querySelectorAll(`[data-cv-toggle="${category}"], [data-customviews-toggle="${category}"]`).forEach(el => {
        // if it has an id, then we should render the asset into it
        // Support both (data-cv-id) and (data-customviews-id) attributes
        const toggleId = (el as HTMLElement).dataset.cvId || (el as HTMLElement).dataset.customviewsId;
        if (toggleId) {
          renderAssetInto(el as HTMLElement, toggleId, this.assetsManager);
        }
      });
    }

    // Apply tab selections
    TabManager.applySelections(this.rootEl, state.tabs || {}, this.config.tabGroups);

    // Update nav active states (without rebuilding)
    TabManager.updateAllNavActiveStates(this.rootEl, state.tabs || {}, this.config.tabGroups);

    // Notify state change listeners (like widgets)
    this.notifyStateChangeListeners();
  }

  /**
   * Reset to default state
   */
  public resetToDefault() {
    this.stateFromUrl = null;
    this.persistenceManager.clearAll();

    if (this.config) {
      this.renderState(this.config.defaultState);
    } else {
      console.warn("No configuration loaded, cannot reset to default state");
    }

    // Clear URL
    URLStateManager.clearURL();
  }


  /**
   * Get the currently active toggles regardless of whether they come from custom state or default configuration
   */
  public getCurrentActiveToggles(): string[] {
    // If we have a custom state, return its toggles
    if (this.stateFromUrl) {
      return this.stateFromUrl.toggles || [];
    }

    // Otherwise, if we have local config, return its default state toggles
    if (this.config) {
      return this.config.defaultState.toggles || [];
    }

    // No configuration or state
    return [];
  }

  /**
   * Clear all persistence and reset to default
   */
  public clearPersistence() {
    this.persistenceManager.clearAll();
    this.stateFromUrl = null;
    if (this.config) {
      this.renderState(this.config.defaultState);
    } else {
      console.warn("No configuration loaded, cannot reset to default state");
    }

    URLStateManager.clearURL();
  }

  // === STATE CHANGE LISTENER METHODS ===
  /**
   * Add a listener that will be called whenever the state changes
   */
  public addStateChangeListener(listener: () => void): void {
    this.stateChangeListeners.push(listener);
  }

  /**
   * Remove a state change listener
   */
  public removeStateChangeListener(listener: () => void): void {
    const index = this.stateChangeListeners.indexOf(listener);
    if (index > -1) {
      this.stateChangeListeners.splice(index, 1);
    }
  }

  /**
   * Notify all state change listeners
   */
  private notifyStateChangeListeners(): void {
    this.stateChangeListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.warn('Error in state change listener:', error);
      }
    });
  }

}






