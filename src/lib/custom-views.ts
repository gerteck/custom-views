import { CustomViewsCore, type CustomViewsOptions } from "../core/core";
import { AssetsManager } from "../models/AssetsManager";
import type { CustomViewAsset } from "../types/types";
import { Config } from "../models/Config";
import { prependBaseUrl } from "../utils/url-utils";

/**
 * Options for initializing CustomViews from JSON
 */
export type initOptions = {
  /** Path to the assets JSON file */
  assetsJsonPath?: string;
  /** Root element to apply custom views */
  rootEl?: HTMLElement;
  /** Config object with allToggles and defaultState */
  config?: Config;
  /** Base URL for all paths */
  baseURL?: string;
}

/**
 * Main CustomViews class for initializing and managing custom views
 */
export class CustomViews {
  /**
   * Entry Point to use CustomViews
   * @param opts Initialization options including config object and assets path
   * @returns Promise resolving to the CustomViewsCore instance or null if initialization fails
   */
  static async init(opts: initOptions): Promise<CustomViewsCore | null> {
    // Load assets JSON if provided
    let assetsManager: AssetsManager | undefined;
    const baseURL = opts.baseURL || '';
    if (opts.assetsJsonPath) {
      const assetsPath = prependBaseUrl(opts.assetsJsonPath, baseURL);
      const assetsJson: Record<string, CustomViewAsset> = await (await fetch(assetsPath)).json();
      assetsManager = new AssetsManager(assetsJson, baseURL);
    } else {
      assetsManager = new AssetsManager({}, baseURL);
    }

    // Use provided config or create a minimal default one
    let localConfig: Config;
    if (opts.config) {
      localConfig = opts.config;
    } else {
      console.error("No config provided, using minimal default config");
      // Create a minimal default config
      localConfig = new Config([], { toggles: [] });
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
