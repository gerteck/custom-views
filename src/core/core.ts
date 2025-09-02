import type { State } from "../types/types";
import type { AssetsManager } from "../models/AssetsManager";
import { renderAssetInto } from "./render";
import type { LocalConfig } from "models/LocalConfig";
import type { GlobalConfig } from "models/globalConfig";

// TO DO: UPDATE CORE

export interface CustomViewsOptions {
  assetsManager: AssetsManager;
  globalConfig: GlobalConfig;
  localConfig?: LocalConfig | undefined;
  rootEl?: HTMLElement | undefined;
  onViewChange?: (stateId: string, state: State) => void | undefined;
}

export class CustomViewsCore {
  private rootEl: HTMLElement;
  private assetsManager: AssetsManager;
  private localConfig?: LocalConfig | undefined;
  private currentStateId: string | null = null;
  private currentState: State | null = null;
  private onViewChange: any;

  constructor(options: CustomViewsOptions) {
    this.assetsManager = options.assetsManager;
    this.localConfig = options.localConfig;
    this.rootEl = options.rootEl || document.body;
    this.onViewChange = options.onViewChange;
  }

  /** Initialize: render default or URL-specified state */
  init() {
    this.renderFromUrl();
    this.listenForUrlChanges();
  }

  /** Read ?state= from URL and render */
  private renderFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const stateId =
      urlParams.get("state") ||
      this.localConfig?.defaultState ||
      Object.keys(this.localConfig?.states || {})[0];

    if (!stateId) {
      console.warn("[CustomViews] No state found to render.");
      return;
    }

    this.selectState(stateId);
  }

  /** Switch to a given state */
  selectState(stateId: string) {
    const state = this.localConfig?.states[stateId];
    if (!state) {
      console.warn("[CustomViews] State not found:", stateId);
      return;
    }

    this.currentStateId = stateId;
    this.currentState = state;

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("state", stateId);
    window.history.pushState({}, "", url);

    this.renderState();
    if (this.onViewChange) this.onViewChange(stateId, state);
  }

  /** Render all placeholders and toggles for the current state */
  private renderState() {
    if (!this.currentState) return;

    // Placeholders
    for (const [key, assetId] of Object.entries(this.currentState.placeholders || {})) {
      if (this.localConfig?.allowedPlaceholders && !this.localConfig.allowedPlaceholders.includes(key)) continue;

      document.querySelectorAll(`[data-customviews-placeholder="${key}"]`).forEach(el => {
        renderAssetInto(el as HTMLElement, assetId, this.assetsManager);
      });
    }

    // Toggles
    for (const toggleId of this.currentState.toggles || []) {
      if (this.localConfig?.allowedToggles && !this.localConfig.allowedToggles.includes(toggleId)) continue;

      document.querySelectorAll(`[data-customviews-toggle="${toggleId}"]`).forEach(el => {
        renderAssetInto(el as HTMLElement, toggleId, this.assetsManager);
      });
    }
  }

  /** Listen to browser back/forward */
  private listenForUrlChanges() {
    window.addEventListener("popstate", () => {
      this.renderFromUrl();
    });
  }
}
