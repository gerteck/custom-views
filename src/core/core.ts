import type { State } from "../types/types";
import type { AssetsManager } from "../models/AssetsManager";
import { renderAssetInto } from "./render";
import { Config } from "models/Config";
import { PersistenceManager } from "./persistence";
import { URLStateManager } from "./url-state-manager";
import { VisibilityManager } from "./visibility-manager";
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
  private localConfig: Config;
  private stateChangeListeners: Array<() => void> = [];

  constructor(opt: CustomViewsOptions) {
    this.assetsManager = opt.assetsManager;
    this.localConfig = opt.config;
    this.rootEl = opt.rootEl || document.body;
    this.persistenceManager = new PersistenceManager();
    this.visibilityManager = new VisibilityManager();
  }

  public getLocalConfig(): Config {
    return this.localConfig;
  }

  // Inject styles, setup listeners and call rendering logic
  public async init() {
    injectCoreStyles();

    // For session history, clicks on back/forward button
    window.addEventListener("popstate", () => {
      this.loadAndRenderState();
    });
    this.loadAndRenderState();
  }

  // Priority: URL state > persisted state > default
  // Also filters using the visibility manager to persist selection
  // across back/forward button clicks
  private async loadAndRenderState() {
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
    this.renderState(this.localConfig.defaultState);
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
    this.rootEl.querySelectorAll("[data-customviews-toggle]").forEach(el => {
      const category = (el as HTMLElement).dataset.customviewsToggle;
      const shouldShow = !!category && finalToggles.includes(category);
      this.visibilityManager.applyElementVisibility(el as HTMLElement, shouldShow);
    });

    // Render toggles
    for (const category of finalToggles) {
      this.rootEl.querySelectorAll(`[data-customviews-toggle="${category}"]`).forEach(el => {
        // if it has an id, then we render the asset into it
        // if it has no id, then we assume it's a container
        const toggleId = (el as HTMLElement).dataset.customviewsId;
        if (toggleId) {
          renderAssetInto(el as HTMLElement, toggleId, this.assetsManager);
        }
      });
    }


    // Notify state change listeners (like widgets)
    this.notifyStateChangeListeners();
  }

  /**
   * Reset to default state
   */
  public resetToDefault() {
    this.stateFromUrl = null;
    this.persistenceManager.clearAll();

    if (this.localConfig) {
      this.renderState(this.localConfig.defaultState);
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
    if (this.localConfig) {
      return this.localConfig.defaultState.toggles || [];
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
    if (this.localConfig) {
      this.renderState(this.localConfig.defaultState);
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






