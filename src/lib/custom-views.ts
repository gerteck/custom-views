import { CustomViewsCore, type CustomViewsOptions } from "../core/core";
import { AssetsManager } from "../core/assets-manager";
import type { CustomViewAsset, Config } from "../types/types";
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
  /** Whether to show the `view` parameter in the browser URL bar */
  showUrl?: boolean;
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
    let config: Config;
    if (opts.config) {
      config = opts.config;
    } else {
      console.error("No config provided, using minimal default config");
      // Create a minimal default config
      config = { allToggles: [], defaultState: { toggles: [] } };
    }

    const coreOptions: CustomViewsOptions = {
      assetsManager,
      config: config,
      rootEl: opts.rootEl,
    };
    if (opts.showUrl !== undefined) {
      coreOptions.showUrl = opts.showUrl;
    }
    const core = new CustomViewsCore(coreOptions);
    core.init();
    return core;
  }
}
