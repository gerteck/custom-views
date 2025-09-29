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
}

export class CustomViews {

  // Entry Point to use CustomViews
  static async initFromJson(opts: InitFromJsonOptions): Promise<CustomViewsCore | null> {

    // Load assets JSON if provided
    let assetsManager: AssetsManager | undefined;
    if (opts.assetsJsonPath) {
      const assetsJson : Record<string, CustomViewAsset> = await (await fetch(opts.assetsJsonPath)).json();
      assetsManager = new AssetsManager(assetsJson);
    } else {
      assetsManager = new AssetsManager({});
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
        localConfig = await (await fetch(opts.configPath)).json();
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

