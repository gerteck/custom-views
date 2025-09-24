import type { State } from "../types/types";
import type { AssetsManager } from "../models/AssetsManager";
import { renderAssetInto } from "./render";
import { LocalConfig } from "models/LocalConfig";
import { PersistenceManager } from "./persistence";
import { URLStateManager, type CustomState } from "./url-state-manager";


export interface CustomViewsOptions {
  assetsManager: AssetsManager;
  defaultState: State;
  // Option 1: Direct configuration
  config?: {
    modifiablePlaceholderAssets?: Record<string, string[]>;
    allowedToggles?: string[];
  };
  // Option 2: Single profile path
  profilePath?: string;
  rootEl?: HTMLElement | undefined;
  onViewChange?: (stateId: string, state: State) => void | undefined;
}

export class CustomViewsCore {
  private rootEl: HTMLElement;
  private assetsManager: AssetsManager;
  private persistenceManager: PersistenceManager;

  private profilePath?: string | undefined;
  private directConfig?: {
    modifiablePlaceholderAssets?: Record<string, string[]>;
    allowedToggles?: string[];
  } | undefined;
  private defaultState: State;
  private onViewChange: any;

  private stateIdFromUrl: string | null = null;
  private customStateFromUrl: CustomState | null = null;

  private localConfig: LocalConfig | null = null;
  
  // Event listeners for state changes
  private stateChangeListeners: Array<() => void> = [];

  constructor(options: CustomViewsOptions) {
    this.assetsManager = options.assetsManager;
    this.profilePath = options.profilePath || undefined;
    this.directConfig = options.config || undefined;
    this.defaultState = options.defaultState;
    this.rootEl = options.rootEl || document.body;
    this.onViewChange = options.onViewChange;
    this.persistenceManager = new PersistenceManager();

    // Validate that exactly one configuration method is provided
    if (this.profilePath && this.directConfig) {
      throw new Error('Cannot provide both profilePath and config. Choose one configuration method.');
    }
    if (!this.profilePath && !this.directConfig) {
      console.warn('No configuration provided. Only defaultState will be available.');
    }
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
   * Load configuration from either profilePath or directConfig
   */
  private async loadConfiguration(): Promise<void> {
    if (this.profilePath) {
      // Load from JSON file
      try {
        const response = await fetch(this.profilePath);
        const configJson = await response.json();
        this.localConfig = new LocalConfig(configJson);
      } catch (err) {
        console.warn("Failed to load profile configuration:", err);
        this.localConfig = null;
      }
    } else if (this.directConfig) {
      // Create LocalConfig from direct configuration
      const configId = 'direct-config';
      
      const configOptions: {
        id: string;
        defaultState: State;
        modifiablePlaceholderAssets?: Record<string, string[]>;
        allowedToggles?: string[];
      } = {
        id: configId,
        defaultState: this.defaultState
      };
      
      if (this.directConfig.modifiablePlaceholderAssets) {
        configOptions.modifiablePlaceholderAssets = this.directConfig.modifiablePlaceholderAssets;
      }
      
      if (this.directConfig.allowedToggles) {
        configOptions.allowedToggles = this.directConfig.allowedToggles;
      }
      
      this.localConfig = new LocalConfig(configOptions);
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
      this.renderState(this.defaultState);
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

  /** Render all placeholders and toggles for the current state */
  private renderState(state: State) {
    if (!state) return;

    const placeholders = state.placeholders || {};
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

    // Placeholders
    // In the html, there can be two types of placeholders:
    // Just has the key,
    // Has both key and id (container, asset stored directly in html)
    this.rootEl.querySelectorAll("[data-customviews-placeholder]").forEach(el => {
      const key = (el as HTMLElement).dataset.customviewsPlaceholder;
      // if no key, skip
      if (!key) return;

      // check in the state, what is the mapping for the placeholder key
      const assetId = placeholders[key];
      if (!assetId) {
        // If no assetId is mapped for this placeholder key, hide the element
        el.setAttribute("hidden", "");
        return;
      }
           
      // Only show the element if placeholderId matches assetId, otherwise hide it
      const placeholderId = (el as HTMLElement).dataset.customviewsId;
      if (placeholderId) {
        if (placeholderId === assetId) {
          el.removeAttribute("hidden");
        } else {
          el.setAttribute("hidden", "");
        }
      }
      else {
        // if not placeholderId, means is positional, show and render asset
        renderAssetInto(el as HTMLElement, assetId, this.assetsManager);
      }

    });

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
    this.renderState(this.defaultState);
    
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
    this.renderState(this.defaultState);
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






