import type { State } from "../types/types";
import type { AssetsManager } from "../models/AssetsManager";
import { renderAssetInto } from "./render";
import { LocalConfig } from "models/LocalConfig";

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

  private localConfigPaths?: Record<string, string> | undefined;
  private defaultState: State;
  private onViewChange: any;

  private profileFromUrl: string | null = null;
  private stateIdFromUrl: string | null = null;

  private localConfig: LocalConfig | null = null;
  
  // Persistence keys for localStorage
  private static readonly STORAGE_KEYS = {
    PROFILE: 'customviews-profile',
    STATE: 'customviews-state',
    CUSTOM_STATE: 'customviews-custom-state'
  } as const;

  constructor(options: CustomViewsOptions) {
    this.assetsManager = options.assetsManager;
    this.localConfigPaths = options.localConfigPaths;
    this.defaultState = options.defaultState;
    this.rootEl = options.rootEl || document.body;
    this.onViewChange = options.onViewChange;
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

    // If no URL params, try to load from persistence
    if (!this.profileFromUrl && !this.stateIdFromUrl) {
      const persistedProfile = this.getPersistedProfile();
      const persistedState = this.getPersistedState();
      
      if (persistedProfile) {
        this.profileFromUrl = persistedProfile;
        this.stateIdFromUrl = persistedState;
      }
    }

    if (this.profileFromUrl) {
      const localConfig = await this.loadLocalConfig(this.profileFromUrl);
      this.localConfig = localConfig;
    }

    if (this.localConfig) {
      this.renderLocalConfigState(this.stateIdFromUrl, this.localConfig);
    } else {
      this.renderState(this.defaultState);
    }
  }
  
  /**
   * Retrieves profile and state if any, based on the current URL's query string.
   */
  private parseUrlForProfileState() {
    // Just the query string part of the URL (everything after ? but before #).
    // Can .get("param"), .has, .set(), .append()
    const urlParams = new URLSearchParams(window.location.search);
    this.profileFromUrl = urlParams.get("profile") || null;
    this.stateIdFromUrl = urlParams.get("state") || null;

    if (this.profileFromUrl &&
        this.localConfigPaths &&
      !(this.profileFromUrl in this.localConfigPaths)) {

      console.warn("Profile in URL not recognized");
      this.profileFromUrl = null;
      this.stateIdFromUrl = null;
    }

    // ToDo: Later extension: Custom State
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
      
      // check if there is a customviewsId
      const placeholderId = (el as HTMLElement).dataset.customviewsId;
      if (placeholderId) {
        // check if placeholderId matches assetId, if it is then we should show it.
        if (placeholderId === assetId) {
          el.removeAttribute("hidden");
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
  }

  // === PERSISTENCE METHODS ===

  /**
   * Persists the current profile to localStorage
   */
  private persistProfile(profile: string | null) {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (profile) {
        localStorage.setItem(CustomViewsCore.STORAGE_KEYS.PROFILE, profile);
      } else {
        localStorage.removeItem(CustomViewsCore.STORAGE_KEYS.PROFILE);
      }
    }
  }

  /**
   * Persists the current state to localStorage
   */
  private persistState(state: string | null) {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (state) {
        localStorage.setItem(CustomViewsCore.STORAGE_KEYS.STATE, state);
      } else {
        localStorage.removeItem(CustomViewsCore.STORAGE_KEYS.STATE);
      }
    }
  }

  /**
   * Retrieves the persisted profile from localStorage
   */
  private getPersistedProfile(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(CustomViewsCore.STORAGE_KEYS.PROFILE);
    }
    return null;
  }

  /**
   * Retrieves the persisted state from localStorage
   */
  private getPersistedState(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(CustomViewsCore.STORAGE_KEYS.STATE);
    }
    return null;
  }

  /**
   * Persists a custom state configuration to localStorage
   * @internal Reserved for future use
   */
  // @ts-ignore - Reserved for future use
  private persistCustomState(customState: State) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(CustomViewsCore.STORAGE_KEYS.CUSTOM_STATE, JSON.stringify(customState));
    }
  }

  /**
   * Retrieves a custom state configuration from localStorage
   * @internal Reserved for future use
   */
  // @ts-ignore - Reserved for future use
  private getPersistedCustomState(): State | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(CustomViewsCore.STORAGE_KEYS.CUSTOM_STATE);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.warn('Failed to parse persisted custom state:', e);
        }
      }
    }
    return null;
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
    
    // Persist the selection
    this.persistProfile(profileId);
    this.persistState(stateId || null);

    // Load and render
    const localConfig = await this.loadLocalConfig(profileId);
    this.localConfig = localConfig;
    
    if (this.localConfig) {
      this.renderLocalConfigState(this.stateIdFromUrl, this.localConfig);
    }

    // Update URL without triggering navigation
    this.updateUrlWithoutNavigation(profileId, stateId || null);
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
    this.persistState(stateId);
    this.renderLocalConfigState(stateId, this.localConfig);
    this.updateUrlWithoutNavigation(this.profileFromUrl, stateId);
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
  public getCurrentView(): { profile: string | null; state: string | null } {
    return {
      profile: this.profileFromUrl,
      state: this.stateIdFromUrl
    };
  }

  /**
   * Clear all persistence and reset to default
   */
  public clearPersistence() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(CustomViewsCore.STORAGE_KEYS.PROFILE);
      localStorage.removeItem(CustomViewsCore.STORAGE_KEYS.STATE);
      localStorage.removeItem(CustomViewsCore.STORAGE_KEYS.CUSTOM_STATE);
    }
    
    this.profileFromUrl = null;
    this.stateIdFromUrl = null;
    this.localConfig = null;
    this.renderState(this.defaultState);
    this.updateUrlWithoutNavigation(null, null);
  }

  /**
   * Update URL without triggering navigation
   */
  private updateUrlWithoutNavigation(profile: string | null, state: string | null) {
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      
      if (profile) {
        url.searchParams.set('profile', profile);
      } else {
        url.searchParams.delete('profile');
      }
      
      if (state) {
        url.searchParams.set('state', state);
      } else {
        url.searchParams.delete('state');
      }
      
      window.history.replaceState({}, '', url.toString());
    }
  }
  
}






