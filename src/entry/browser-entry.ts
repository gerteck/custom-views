import { CustomViews } from "../lib/custom-views";
import { CustomViewsWidget } from "../core/widget";
import { prependBaseURL } from "../utils/url-utils";

/**
 * Initialize CustomViews from script tag attributes and config file
 * This function handles the automatic initialization of CustomViews when included via script tag
 */
export default function initializeFromScript(): void {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  // Use the typed global `window` (see src/types/global.d.ts)
  // Idempotency guard: if already initialized, skip setting up listener again.
  if (window.__customViewsInitialized) {
    // Informational for developers; harmless in production.
    console.info('[CustomViews] Auto-init skipped: already initialized.');
    return;
  }

  document.addEventListener('DOMContentLoaded', async function() {
    // Prevent concurrent initialization runs (race conditions when script is loaded twice)
    if (window.__customViewsInitInProgress || window.__customViewsInitialized) {
      return;
    }
    window.__customViewsInitInProgress = true;
    try {
      // Find the script tag
      let scriptTag = document.currentScript as HTMLScriptElement;
      
      // Fallback if currentScript is not available (executed after page load)
      if (!scriptTag) {
        // Try to find the script tag by looking for our script
        const scripts = document.querySelectorAll('script[src*="custom-views"]');
        if (scripts.length > 0) {
          // Find the most specific match (to avoid matching other custom-views scripts)
          for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i] as HTMLScriptElement;
            const src = script.getAttribute('src') || '';
            // Look for .min.js or .js at the end
            if (src.match(/custom-views(\.min)?\.js($|\?)/)) {
              scriptTag = script;
              break;
            }
          }
          // If no specific match found, use the first one
          if (!scriptTag) {
            scriptTag = scripts[0] as HTMLScriptElement;
          }
        }
      }

      // Read data attributes from script tag
      let baseURL = '';
      let configPath = '/customviews.config.json';

      if (scriptTag) {
        baseURL = scriptTag.getAttribute('data-base-url') || '';
        configPath = scriptTag.getAttribute('data-config-path') || configPath;
      }

      // Fetch config file
      let config;
      try {
        const fullConfigPath = prependBaseURL(configPath, baseURL);
        const response = await fetch(fullConfigPath);
        
        if (!response.ok) {
          console.warn(`[CustomViews] Config file not found at ${fullConfigPath}. Using defaults.`);
          config = { core: {} };
        } else {
          config = await response.json();
        }
      } catch (error) {
        console.error('[CustomViews] Error loading config file:', error);
        return; // Abort initialization
      }

      // Determine effective baseURL (data attribute takes precedence over config)
      const effectiveBaseURL = baseURL || config.core.baseURL || '';

      // Initialize CustomViews core
      const core = await CustomViews.initFromJson({
        config: config.core.config,
        configPath: config.core.configPath,
        assetsJsonPath: config.core.assetsJsonPath,
        baseURL: effectiveBaseURL,
      });

      if (!core) {
        console.error('[CustomViews] Failed to initialize core.');
        return; // Abort widget creation
      }

      // Store instance
      window.customViewsInstance = { core };

      // Initialize widget if enabled in config
      let widget;
      if (config.widget?.enabled !== false) {
        widget = new CustomViewsWidget({
          core,
          ...config.widget
        });
        widget.render();
        
        // Store widget instance
        window.customViewsInstance.widget = widget;
      }

      // Dispatch ready event
      const readyEvent = new CustomEvent('customviews:ready', {
        detail: {
          core,
          widget
        }
      });
      document.dispatchEvent(readyEvent);

      // Mark initialized and clear in-progress flag
      window.__customViewsInitialized = true;
      window.__customViewsInitInProgress = false;

    } catch (error) {
      // Clear in-progress flag so a future attempt can retry
      window.__customViewsInitInProgress = false;
      console.error('[CustomViews] Auto-initialization error:', error);
    }
  });
}
