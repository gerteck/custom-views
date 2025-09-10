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
  
}






