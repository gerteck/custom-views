import { CustomViewsCore } from "core/core";
import { AssetsManager } from "models/AssetsManager";
import { CustomViewsWidget } from "core/widget";
import { PersistenceManager } from "core/persistence";
import type { CustomViewAsset, State } from "types/types";

export type InitFromJsonOptions = {
  assetsJsonPath: string;
  // Option 1: Direct configuration
  config?: {
    modifiablePlaceholderAssets?: Record<string, string[]>;
    allowedToggles?: string[];
  };
  // Option 2: Single profile path
  profilePath?: string;
  
  defaultStateJsonPath: string;     
  rootEl?: HTMLElement;
  onViewChange?: any;
}

export class CustomViews {

  // Entry Point to use CustomViews
  static async initFromJson(opts: InitFromJsonOptions): Promise<CustomViewsCore> {
    // Load assets JSON
    const assetsJson : Record<string, CustomViewAsset> = await (await fetch(opts.assetsJsonPath)).json();
    const assetsManager = new AssetsManager(assetsJson);

    // Load Default State
    const defaultState: State = await (await fetch(opts.defaultStateJsonPath)).json();

    // Init CustomViews
    const coreOptions: any = {
      assetsManager,
      defaultState,
      rootEl: opts.rootEl,
      onViewChange: opts.onViewChange,
    };
    
    if (opts.config) {
      coreOptions.config = opts.config;
    }
    
    if (opts.profilePath) {
      coreOptions.profilePath = opts.profilePath;
    }
    
    const core = new CustomViewsCore(coreOptions);

    core.init();
    return core;
  }
}

// Export the core class and types
export { CustomViewsCore } from "core/core";
export type { CustomViewsOptions } from "core/core";

// Export the widget class
export { CustomViewsWidget } from "core/widget";
export type { WidgetOptions } from "core/widget";

// Export the persistence manager
export { PersistenceManager } from "core/persistence";

// Export custom state manager and types
export { CustomStateManager } from "core/custom-state-manager";
export type { ConfigConstraints } from "core/custom-state-manager";

// Export URL state manager and types
export { URLStateManager } from "core/url-state-manager";
export type { CustomState, URLState } from "core/url-state-manager";

// Export models
export { AssetsManager } from "models/AssetsManager";
export { LocalConfig } from "models/LocalConfig";

if (typeof window !== "undefined") {
  // @ts-ignore
  window.CustomViews = CustomViews;
  // @ts-ignore
  window.CustomViewsWidget = CustomViewsWidget;
  // @ts-ignore
  window.PersistenceManager = PersistenceManager;
}

