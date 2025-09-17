import type { State } from "../types/types";
import type { AssetsManager } from "../models/AssetsManager";
import { renderAssetInto } from "./render";
import { LocalConfig } from "models/LocalConfig";
import { PersistenceManager } from "./persistence";
import { URLStateManager, type CustomState } from "./url-state-manager";

// TO DO: UPDATE CORE

export interface CustomViewsOptions {
  assetsManager: AssetsManager;
  defaultState: State,
  localConfigPaths?: Record<string, string> | undefined;
  rootEl?: HTMLElement | undefined;
  onViewChange?: (stateId: string, state: State) => void | undefined;
}

export class CustomViewsCore {
  private rootEl: HTMLElement;
  private assetsManager: AssetsManager;
  private persistenceManager: PersistenceManager;

  private localConfigPaths?: Record<string, string> | undefined;
  private defaultState: State;
  private onViewChange: any;

  private profileFromUrl: string | null = null;
  private stateIdFromUrl: string | null = null;
  private customStateFromUrl: CustomState | null = null;

  private localConfig: LocalConfig | null = null;
  
  // Event listeners for state changes
  private stateChangeListeners: Array<() => void> = [];

  constructor(options: CustomViewsOptions) {
    this.assetsManager = options.assetsManager;
    this.localConfigPaths = options.localConfigPaths;
    this.defaultState = options.defaultState;
    this.rootEl = options.rootEl || document.body;
    this.onViewChange = options.onViewChange;
    this.persistenceManager = new PersistenceManager();
  }

  /** Initialize: render default or URL-specified state */
  public async init() {
    console.log("CustomViewsCore init");
    this.renderFromUrl();
    window.addEventListener("popstate", () => {
      this.renderFromUrl();
    });
  }

  private async renderFromUrl() {
    this.parseUrlForProfileState();

    // Get persisted view for fallback
    const persistedView = this.persistenceManager.getPersistedView();
    
    // Determine if URL params are present
    const hasUrlProfile = this.profileFromUrl !== null;
    const hasUrlState = this.stateIdFromUrl !== null;
    
    // Use URL params if available, otherwise use persistence
    if (!hasUrlProfile && persistedView.profile) {
      this.profileFromUrl = persistedView.profile;
    }
    
    if (!hasUrlState && persistedView.state) {
      this.stateIdFromUrl = persistedView.state;
    }

    // If URL params are present, persist them (URL takes precedence and should be saved)
    if (hasUrlProfile || hasUrlState) {
      this.persistenceManager.persistView(this.profileFromUrl, this.stateIdFromUrl);
    }

    if (this.profileFromUrl) {
      const localConfig = await this.loadLocalConfig(this.profileFromUrl);
      this.localConfig = localConfig;
    }

    // Handle custom state
    if (this.customStateFromUrl) {
      const customState = URLStateManager.customStateToState(this.customStateFromUrl);
      this.renderState(customState);
    } else if (this.localConfig) {
      this.renderLocalConfigState(this.stateIdFromUrl, this.localConfig);
    } else {
      this.renderState(this.defaultState);
    }
  }
  
  /**
   * Retrieves profile, state, and custom state from the current URL's query string.
   */
  private parseUrlForProfileState() {
    const urlState = URLStateManager.parseURL();
    
    this.profileFromUrl = urlState.profile || null;
    this.stateIdFromUrl = urlState.state || null;
    this.customStateFromUrl = urlState.customState || null;

    // Validate profile
    if (this.profileFromUrl &&
        this.localConfigPaths &&
      !(this.profileFromUrl in this.localConfigPaths)) {

      console.warn("Profile in URL not recognized");
      this.profileFromUrl = null;
      this.stateIdFromUrl = null;
      this.customStateFromUrl = null;
    }

    // If we have a custom state, clear the regular state
    if (this.customStateFromUrl) {
      this.stateIdFromUrl = null;
    }
  }

  /**
   * Loads the local configuration for a given profile ID.
   *
   * This method attempts to fetch and parse a local configuration file
   * based on the provided `profileId`. If the profile ID is invalid,
   * missing, or not present in `localConfigPaths`, the method logs a warning
   * and returns `false`. If the configuration file is successfully fetched
   * and parsed, it initializes `this.localConfig` with the parsed data and
   * returns `true`. On failure, it logs the error, sets `this.localConfig`
   * to `null`, and returns `false`.
   *
   * @param profileId - The identifier for the profile whose local configuration should be loaded.
   * @returns A promise that resolves to `true` if the configuration was loaded successfully, or `false` otherwise.
   */
  private async loadLocalConfig(profileId: string): Promise<LocalConfig | null> {
    // Load local config based on profileId
    if (!profileId || !this.localConfigPaths || 
      (!(profileId in this.localConfigPaths))
    ) {
      console.warn("Local Config Paths or Profile not present");
      return null;
    }

    const localConfigPath = this.localConfigPaths[profileId];
    if (!localConfigPath) {
      return null;
    }

    try {
      const response = await fetch(localConfigPath);
      const configJson = await response.json();
      const config = new LocalConfig(configJson);
      return config;
    } catch (err) {
      console.warn("Failed to load local config:", err);
      return null;
    }
  }

  private async renderLocalConfigState(stateId: string | null, localConfig: LocalConfig) {
    if (!stateId) {
      stateId = localConfig.defaultState;
    }

    // load state
    const state = localConfig.states[stateId];
    if (!state) {
      console.warn("State ID not found in local config, rendering default state");
      await this.renderState(this.defaultState);
    } else {
      await this.renderState(state);
    }
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
      
      // If we have an assetId, ensure the element is visible
      el.removeAttribute("hidden");
      
      // check if there is a customviewsId
      const placeholderId = (el as HTMLElement).dataset.customviewsId;
      if (placeholderId) {
        // check if placeholderId matches assetId, if it is then we should show it.
        if (placeholderId === assetId) {
          // Element is already visible (hidden attribute removed above)
        } else {
          el.setAttribute("hidden", "");
        }
      }
      else {
        // if not placeholderId, it means it is positional, so we render the asset into it
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
   * Programmatically switch to a different profile and state
   */
  public async switchToProfile(profileId: string, stateId?: string) {
    if (!this.localConfigPaths || !(profileId in this.localConfigPaths)) {
      console.warn('Profile not found:', profileId);
      return;
    }

    this.profileFromUrl = profileId;
    this.stateIdFromUrl = stateId || null;
    this.customStateFromUrl = null; // Clear custom state when switching profiles
    
    // Persist the selection
    this.persistenceManager.persistView(profileId, stateId || null);

    // Load and render
    const localConfig = await this.loadLocalConfig(profileId);
    this.localConfig = localConfig;
    
    if (this.localConfig) {
      this.renderLocalConfigState(this.stateIdFromUrl, this.localConfig);
    }

    // Update URL without triggering navigation
    URLStateManager.updateURL({
      profile: profileId,
      state: stateId
    });
  }

  /**
   * Switch to a specific state within the current profile
   */
  public switchToState(stateId: string) {
    if (!this.localConfig) {
      console.warn('No profile loaded, cannot switch state');
      return;
    }

    if (!(stateId in this.localConfig.states)) {
      console.warn('State not found in current profile:', stateId);
      return;
    }

    this.stateIdFromUrl = stateId;
    this.customStateFromUrl = null; // Clear custom state when switching to predefined state
    this.persistenceManager.persistState(stateId);
    this.renderLocalConfigState(stateId, this.localConfig);
    
    // Update URL
    URLStateManager.updateURL({
      profile: this.profileFromUrl,
      state: stateId
    });
  }

  /**
   * Get available profiles
   */
  public getAvailableProfiles(): string[] {
    return this.localConfigPaths ? Object.keys(this.localConfigPaths) : [];
  }

  /**
   * Get available states for current profile
   */
  public getAvailableStates(): string[] {
    return this.localConfig ? Object.keys(this.localConfig.states) : [];
  }

  /**
   * Get current profile and state
   */
  public getCurrentView(): { profile: string | null; state: string | null; customState: CustomState | null } {
    return {
      profile: this.profileFromUrl,
      state: this.stateIdFromUrl,
      customState: this.customStateFromUrl
    };
  }

  /**
   * Clear all persistence and reset to default
   */
  public clearPersistence() {
    this.persistenceManager.clearAll();
    
    this.profileFromUrl = null;
    this.stateIdFromUrl = null;
    this.customStateFromUrl = null;
    this.localConfig = null;
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
   * Check if any persistence data exists
   */
  public hasPersistedData(): boolean {
    return this.persistenceManager.hasPersistedData();
  }

  /**
   * Get the currently persisted view without changing the current state
   */
  public getPersistedView(): { profile: string | null; state: string | null } {
    return this.persistenceManager.getPersistedView();
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
      profile: this.profileFromUrl,
      customState: customState
    });
  }

  /**
   * Get the current LocalConfig for profile constraints
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






