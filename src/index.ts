// Import from new modules
import { CustomViews } from "./lib/custom-views";
import initializeFromScript from "./entry/browser-entry";
import { CustomViewsWidget } from "./core/widget";

// Export public API
export { CustomViewsCore } from "./core/core";
export type { CustomViewsOptions } from "./core/core";
export { CustomViewsWidget } from "./core/widget";
export type { WidgetOptions } from "./core/widget";
export { CustomViews } from "./lib/custom-views";
export type { InitFromJsonOptions } from "./lib/custom-views";
export { PersistenceManager } from "./core/persistence";
export { URLStateManager } from "./core/url-state-manager";
export { AssetsManager } from "./models/AssetsManager";
export { Config as LocalConfig } from "./models/Config";
export type { ConfigFile } from "./types/types";

// Set up globals and auto-initialization
if (typeof window !== "undefined") {
  // Expose to window to enable usage (e.g. const app = new window.CustomViews(...))
  window.CustomViews = CustomViews;
  window.CustomViewsWidget = CustomViewsWidget;
  
  // Run auto-initialization
  initializeFromScript();
}