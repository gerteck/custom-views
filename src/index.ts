import { CustomViewsCore, type CustomViewsOptions } from "core/core";
import { AssetsManager } from "models/AssetsManager";
import { CustomViewsWidget } from "core/widget";
import type { CustomViewAsset } from "types/types";
import { Config } from "models/Config";

export type InitFromJsonOptions = {
  assetsJsonPath?: string;
  rootEl?: HTMLElement;
  config?: Config;
  configPath?: string;
  baseURL?: string;
}

export class CustomViews {

  // Helper function to prepend baseURL to a path
  private static prependBaseURL(path: string, baseURL: string): string {
    if (!baseURL) return path;
    
    // Don't prepend if the path is already absolute (starts with http:// or https://)
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Ensure baseURL doesn't end with / and path starts with /
    const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    
    return cleanBaseURL + cleanPath;
  }

  // Entry Point to use CustomViews
  static async initFromJson(opts: InitFromJsonOptions): Promise<CustomViewsCore | null> {

    // Load assets JSON if provided
    let assetsManager: AssetsManager | undefined;
    const baseURL = opts.baseURL || '';
    if (opts.assetsJsonPath) {
      const assetsPath = this.prependBaseURL(opts.assetsJsonPath, baseURL);
      const assetsJson : Record<string, CustomViewAsset> = await (await fetch(assetsPath)).json();
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
        const configPath = this.prependBaseURL(opts.configPath, baseURL);
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

// Export the core class and types
export { CustomViewsCore } from "core/core";
export type { CustomViewsOptions } from "core/core";

export { CustomViewsWidget } from "core/widget";
export type { WidgetOptions } from "core/widget";

export { PersistenceManager } from "core/persistence";

export { URLStateManager } from "core/url-state-manager";

export { AssetsManager } from "models/AssetsManager";
export { Config as LocalConfig } from "models/Config";

if (typeof window !== "undefined") {
  // @ts-ignore
  window.CustomViews = CustomViews;
  // @ts-ignore
  window.CustomViewsWidget = CustomViewsWidget;
}

