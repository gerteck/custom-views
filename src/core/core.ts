import type { State } from "../types/types";
import type { AssetsManager } from "../models/AssetsManager";
import { renderAssetInto } from "./render";
import { LocalConfig } from "models/LocalConfig";
import { PersistenceManager } from "./persistence";
import { URLStateManager, type CustomState } from "./url-state-manager";
import { VisibilityManager, type ToggleId } from "./visibility-manager";
import { injectCoreStyles } from "./styles";


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
  private visibilityManager: VisibilityManager;

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
    this.visibilityManager = new VisibilityManager();
    injectCoreStyles();
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

    // Get persisted states for fallback
    const persistedState = this.persistenceManager.getPersistedState();
    const persistedCustomState = this.persistenceManager.getPersistedCustomState();
    
    // Determine if URL has state params
    const hasUrlState = this.stateIdFromUrl !== null;
    const hasUrlCustomState = this.customStateFromUrl !== null;
    
    // Priority: URL state > persisted custom state > persisted regular state > default
    if (hasUrlState || hasUrlCustomState) {
      // URL state takes precedence - persist it and use it
      if (hasUrlCustomState && this.customStateFromUrl) {
        const customState = URLStateManager.customStateToState(this.customStateFromUrl);
        const filtered = this.visibilityManager.filterStateForPersistence(customState);
        this.persistenceManager.persistCustomState(filtered);
        this.persistenceManager.persistState(null); // Clear regular state
        this.renderState(filtered);
        // Normalize the URL to exclude hidden toggles
        URLStateManager.updateURL({
          customState: URLStateManager.stateToCustomState(filtered)
        });
      } else if (hasUrlState) {
        this.persistenceManager.persistState(this.stateIdFromUrl);
        this.persistenceManager.clearCustomState(); // Clear custom state
        if (this.localConfig) {
          this.renderLocalConfigState(this.localConfig);
        }
      }
    } else if (persistedCustomState) {
      // Load persisted custom state and update URL
      const filtered = this.visibilityManager.filterStateForPersistence(persistedCustomState);
      this.customStateFromUrl = URLStateManager.stateToCustomState(filtered);
      this.stateIdFromUrl = null;
      this.renderState(filtered);
      
      // Update URL to reflect the persisted custom state
      URLStateManager.updateURL({
        customState: this.customStateFromUrl
      });
    } else if (persistedState) {
      // Load persisted regular state
      this.stateIdFromUrl = persistedState;
      if (this.localConfig) {
        this.renderLocalConfigState(this.localConfig);
      }
    } else if (this.localConfig) {
      // No persisted state, use default configuration
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
    this.persistenceManager.clearCustomState();
    
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
   * Get the currently active toggles regardless of whether they come from custom state or default configuration
   */
  public getCurrentActiveToggles(): string[] {
    // If we have a custom state, return its toggles
    if (this.customStateFromUrl) {
      return this.customStateFromUrl.toggles || [];
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
    const filtered = this.visibilityManager.filterStateForPersistence(state);
    this.renderState(filtered);
    
    // Persist the custom state to localStorage
    this.persistenceManager.persistCustomState(filtered);
    
    // Clear any persisted regular state since we're using custom state
    this.persistenceManager.persistState(null);
    
    // Update URL
    URLStateManager.updateURL({
      customState: URLStateManager.stateToCustomState(filtered)
    });
  }

  /**
   * Get the current LocalConfig for configuration constraints
   */
  public getCurrentLocalConfig(): LocalConfig | null {
    return this.localConfig || null;
  }

  // === VISIBILITY PUBLIC API ===

  /** Explicitly show/hide a toggle category. */
  public setToggleVisibility(id: ToggleId, visible: boolean): void {
    const changed = this.visibilityManager.setToggleVisibility(id, visible);
    if (changed) this.applyVisibilityToDom();
  }

  /** Predicate-based visibility across all known toggles. */
  public setVisibility(predicate: (t: ToggleId) => boolean, visible: boolean): void {
    const all = this.getAllKnownToggles();
    this.visibilityManager.setVisibilityByPredicate(all, predicate, visible);
    this.applyVisibilityToDom();
  }

  /** Hide everything. */
  public hideAll(): void {
    const all = this.getAllKnownToggles();
    this.visibilityManager.hideAll(all);
    this.applyVisibilityToDom();
  }

  /** Show everything. */
  public showAll(): void {
    const all = this.getAllKnownToggles();
    this.visibilityManager.showAll(all);
    this.applyVisibilityToDom();
  }

  /** Visible toggles considering current state and hidden set. */
  public getVisibleToggles(): ToggleId[] {
    const active = this.getCurrentActiveToggles();
    const present = this.collectDomToggleSet();
    return this.visibilityManager.getVisibleToggles(active, present);
  }

  /** Globally hidden toggles (via API). */
  public getHiddenToggles(): ToggleId[] {
    return this.visibilityManager.getHiddenToggles();
  }

  /** Filter a list of toggles for URL/persistence safety. */
  public filterTogglesForPersistence(toggleIds: ToggleId[]): ToggleId[] {
    return this.visibilityManager.filterVisibleToggles(toggleIds);
  }

  /** Subscribe to toggle visibility changes. */
  public onToggleVisibilityChange(listener: (e: { toggleId: string; visible: boolean }) => void): () => void {
    this.visibilityManager.addListener(listener);
    return () => this.visibilityManager.removeListener(listener);
  }

  /** Apply current visibility to DOM without re-rendering assets. */
  private applyVisibilityToDom(): void {
    const active = this.getCurrentActiveToggles();
    const finalActive = this.visibilityManager.filterVisibleToggles(active);
    this.rootEl.querySelectorAll('[data-customviews-toggle]').forEach(el => {
      const category = (el as HTMLElement).dataset.customviewsToggle;
      const shouldShow = !!category && finalActive.includes(category);
      this.visibilityManager.applyElementVisibility(el as HTMLElement, shouldShow);
    });
  }

  /** Collect all known toggle ids from config or DOM. */
  private getAllKnownToggles(): ToggleId[] {
    const fromConfig = this.localConfig?.allowedToggles || [];
    const present = this.collectDomToggleSet();
    const merged = new Set<ToggleId>([...fromConfig, ...present]);
    return Array.from(merged);
  }

  private collectDomToggleSet(): Set<ToggleId> {
    const set = new Set<ToggleId>();
    this.rootEl.querySelectorAll('[data-customviews-toggle]').forEach(el => {
      const id = (el as HTMLElement).dataset.customviewsToggle;
      if (id) set.add(id);
    });
    return set;
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






