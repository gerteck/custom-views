import type { State } from "../types/types";
import type { AssetsManager } from "../models/AssetsManager";
import { renderAssetInto } from "./render";
import { LocalConfig } from "models/LocalConfig";
import { PersistenceManager } from "./persistence";
import { URLStateManager, type CustomState } from "./url-state-manager";


export interface CustomViewsOptions {
  assetsManager: AssetsManager;
  profilePath: string;
  rootEl?: HTMLElement | undefined;
  onViewChange?: (stateId: string, state: State) => void | undefined;
}

export class CustomViewsCore {
  private rootEl: HTMLElement;
  private assetsManager: AssetsManager;
  private persistenceManager: PersistenceManager;

  private profilePath: string;
  private onViewChange: any;

  private stateIdFromUrl: string | null = null;
  private customStateFromUrl: CustomState | null = null;

  private localConfig: LocalConfig | null = null;
  
  // Event listeners for state changes
  private stateChangeListeners: Array<() => void> = [];

  constructor(options: CustomViewsOptions) {
    this.assetsManager = options.assetsManager;
    this.profilePath = options.profilePath;
    this.rootEl = options.rootEl || document.body;
    this.onViewChange = options.onViewChange;
    this.persistenceManager = new PersistenceManager();
  }

  /** Initialize: render default or URL-specified state */
  public async init() {
    console.log("CustomViewsCore init");
    
    // Load configuration first
    await this.loadConfiguration();
    
    this.renderFromUrl();
    window.addEventListener("popstate", () => {
      this.renderFromUrl();
    });
  }

  /**
   * Load configuration from profilePath
   */
  private async loadConfiguration(): Promise<void> {
    try {
      const response = await fetch(this.profilePath);
      const configJson = await response.json();
      this.localConfig = new LocalConfig(configJson);
    } catch (err) {
      console.warn("Failed to load profile configuration:", err);
      this.localConfig = null;
    }
  }

  private async renderFromUrl() {
    this.parseUrlForState();

    // Get persisted state for fallback
    const persistedState = this.persistenceManager.getPersistedState();
    
    // Determine if URL state param is present
    const hasUrlState = this.stateIdFromUrl !== null;
    
    // Use URL state if available, otherwise use persistence
    if (!hasUrlState && persistedState) {
      this.stateIdFromUrl = persistedState;
    }

    // If URL state is present, persist it (URL takes precedence and should be saved)
    if (hasUrlState) {
      this.persistenceManager.persistState(this.stateIdFromUrl);
    }

    // Handle custom state
    if (this.customStateFromUrl) {
      const customState = URLStateManager.customStateToState(this.customStateFromUrl);
      this.renderState(customState);
    } else if (this.localConfig) {
      this.renderLocalConfigState(this.localConfig);
    } else {
      console.warn("No configuration loaded, cannot render any state");
    }
  }
  
  /**
   * Retrieves state and custom state from the current URL's query string.
   */
  private parseUrlForState() {
    const urlState = URLStateManager.parseURL();
    
    this.stateIdFromUrl = urlState.state || null;
    this.customStateFromUrl = urlState.customState || null;

    // If we have a custom state, clear the regular state
    if (this.customStateFromUrl) {
      this.stateIdFromUrl = null;
    }
  }


  private async renderLocalConfigState(localConfig: LocalConfig) {
    // With simplified LocalConfig, we always render the defaultState
    await this.renderState(localConfig.defaultState);
  }

  /** Render all toggles for the current state */
  private renderState(state: State) {
    if (!state) return;

    const toggles = state.toggles || [];

    // Toggles hide or show relevant toggles
    this.rootEl.querySelectorAll("[data-customviews-toggle]").forEach(el => {
      const category = (el as HTMLElement).dataset.customviewsToggle;
      if (!category || !toggles.includes(category)) {
        el.setAttribute("hidden", "");
      } else {
        el.removeAttribute("hidden");
      }
    });

    // Render toggles
    for (const category of toggles) {
      this.rootEl.querySelectorAll(`[data-customviews-toggle="${category}"]`).forEach(el => {
        // if it has an id, then we render the asset into it
        // if it has no id, then we assume it's a container and just show it
        const toggleId = (el as HTMLElement).dataset.customviewsId;
        if (!toggleId) {
          // If no ID is present, we can assume it's a container and just show it
          el.classList.remove("hidden");  
        } else {
          renderAssetInto(el as HTMLElement, toggleId, this.assetsManager);
        }
      });
    }

    // Notify consumer of state change
    if (typeof this.onViewChange === "function") {
      if (this.stateIdFromUrl) {
        this.onViewChange(this.stateIdFromUrl, state);
      } else {
        this.onViewChange("default state", state);
      }
    }

    // Notify state change listeners (like widgets)
    this.notifyStateChangeListeners();
  }


  // === PUBLIC API METHODS ===

  /**
   * Reset to default state
   */
  public resetToDefault() {
    this.stateIdFromUrl = null;
    this.customStateFromUrl = null;
    this.persistenceManager.persistState(null);
    
    if (this.localConfig) {
      this.renderState(this.localConfig.defaultState);
    } else {
      console.warn("No configuration loaded, cannot reset to default state");
    }
    
    // Clear URL
    URLStateManager.clearURL();
  }

  /**
   * Check if configuration is loaded
   */
  public hasConfiguration(): boolean {
    return this.localConfig !== null;
  }

  /**
   * Get current state
   */
  public getCurrentView(): { state: string | null; customState: CustomState | null } {
    return {
      state: this.stateIdFromUrl,
      customState: this.customStateFromUrl
    };
  }

  /**
   * Clear all persistence and reset to default
   */
  public clearPersistence() {
    this.persistenceManager.clearAll();
    
    this.stateIdFromUrl = null;
    this.customStateFromUrl = null;
    
    if (this.localConfig) {
      this.renderState(this.localConfig.defaultState);
    } else {
      console.warn("No configuration loaded, cannot reset to default state");
    }
    
    URLStateManager.clearURL();
  }

  /**
   * Get the persistence manager instance for advanced operations
   */
  public getPersistenceManager(): PersistenceManager {
    return this.persistenceManager;
  }


  /**
   * Apply a custom state
   */
  public applyCustomState(customState: CustomState) {
    this.customStateFromUrl = customState;
    this.stateIdFromUrl = null; // Clear predefined state when applying custom state
    
    const state = URLStateManager.customStateToState(customState);
    this.renderState(state);
    
    // Update URL
    URLStateManager.updateURL({
      customState: customState
    });
  }

  /**
   * Get the current LocalConfig for configuration constraints
   */
  public getCurrentLocalConfig(): LocalConfig | null {
    return this.localConfig || null;
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






