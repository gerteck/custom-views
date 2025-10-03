import { CustomViewsCore, type CustomViewsOptions } from "../core/core";
import { AssetsManager } from "../models/AssetsManager";
import type { CustomViewAsset } from "../types/types";
import { Config } from "../models/Config";
import { prependBaseURL } from "../utils/url-utils";

/**
 * Options for initializing CustomViews from JSON
 */
export type InitFromJsonOptions = {
  /** Path to the assets JSON file */
  assetsJsonPath?: string;
  /** Root element to apply custom views */
  rootEl?: HTMLElement;
  /** Config object with allToggles and defaultState */
  config?: Config;
  /** Path to JSON config file */
  configPath?: string;
  /** Base URL for all paths */
  baseURL?: string;
}

/**
 * Main CustomViews class for initializing and managing custom views
 */
export class CustomViews {
  /**
   * Entry Point to use CustomViews
   * @param opts Initialization options
   * @returns Promise resolving to the CustomViewsCore instance or null if initialization fails
   */
  static async initFromJson(opts: InitFromJsonOptions): Promise<CustomViewsCore | null> {
    // Load assets JSON if provided
    let assetsManager: AssetsManager | undefined;
    const baseURL = opts.baseURL || '';
    if (opts.assetsJsonPath) {
      const assetsPath = prependBaseURL(opts.assetsJsonPath, baseURL);
      const assetsJson: Record<string, CustomViewAsset> = await (await fetch(assetsPath)).json();
      assetsManager = new AssetsManager(assetsJson, baseURL);
    } else {
      assetsManager = new AssetsManager({}, baseURL);
    }

    // Load config JSON if provided, else just log error and don't load the custom views
    let localConfig: Config;
    if (opts.config) {
      localConfig = opts.config;
    } else {
      if (!opts.configPath) {
        console.error("No config path provided, skipping custom views");
        return null;
      }
      try {
        const configPath = prependBaseURL(opts.configPath, baseURL);
        localConfig = await (await fetch(configPath)).json();
      } catch (error) {
        console.error("Error loading config:", error);
        return null;
      }
    } 

    const coreOptions: CustomViewsOptions = {
      assetsManager,
      config: localConfig,
      rootEl: opts.rootEl,
    };
    const core = new CustomViewsCore(coreOptions);
    core.init();
    return core;
  }
}
