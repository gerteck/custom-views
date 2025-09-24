/**
 * Custom State Manager for CustomViews
 * Handles creation and management of custom states
 */

import type { CustomViewsCore } from "./core";
import type { CustomState } from "./url-state-manager";
import { URLStateManager } from "./url-state-manager";

export interface ConfigConstraints {
  allowedToggles: string[];
  modifiablePlaceholders: Record<string, string[]>;
}

export class CustomStateManager {
  private core: CustomViewsCore;

  constructor(core: CustomViewsCore) {
    this.core = core;
  }

  /**
   * Get constraints for the current configuration
   */
  public getConfigConstraints(): ConfigConstraints | null {
    // Get the actual LocalConfig for the current configuration
    const localConfig = this.core.getCurrentLocalConfig();
    if (!localConfig) return null;

    return {
      allowedToggles: localConfig.allowedToggles || [],
      modifiablePlaceholders: localConfig.modifiablePlaceholderAssets || {}
    };
  }

  /**
   * Apply a custom state to the view
   */
  public applyCustomState(customState: CustomState): void {
    const state = URLStateManager.customStateToState(customState);
    
    // Apply the state through the core's rendering system
    // We need to call the private renderState method, but since it's private,
    // we'll need to add a public method to the core for this
    console.log('Applying custom state:', state);
    
    // For now, we'll trigger a re-render by updating the URL and letting the core handle it
    URLStateManager.updateURL({
      customState: customState
    });
    
    // Notify state change listeners
    this.notifyStateChange();
  }

  /**
   * Get current state as a custom state
   */
  public getCurrentCustomState(): CustomState | null {
    // Check if we're currently viewing a custom state from URL
    const urlState = URLStateManager.parseURL();
    if (urlState.customState) {
      return urlState.customState;
    }

    // If not, we could potentially create a custom state from the current view
    // This would require access to the current rendered state
    return null;
  }

  /**
   * Validate custom state against configuration constraints
   */
  public validateCustomState(customState: CustomState): { valid: boolean; errors: string[] } {
    const constraints = this.getConfigConstraints();
    if (!constraints) {
      return { valid: false, errors: ['No configuration loaded'] };
    }

    const errors: string[] = [];

    // Validate toggles
    for (const toggle of customState.toggles) {
      if (!constraints.allowedToggles.includes(toggle)) {
        errors.push(`Toggle '${toggle}' is not allowed in this configuration`);
      }
    }

    // Validate placeholders
    for (const [placeholder, asset] of Object.entries(customState.placeholders)) {
      const allowedAssets = constraints.modifiablePlaceholders[placeholder];
      if (!allowedAssets) {
        errors.push(`Placeholder '${placeholder}' is not modifiable in this configuration`);
      } else if (!allowedAssets.includes(asset)) {
        errors.push(`Asset '${asset}' is not allowed for placeholder '${placeholder}'`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Create a custom state from form data
   */
  public createCustomStateFromForm(formData: {
    placeholders: Record<string, string>;
    toggles: string[];
  }): CustomState {
    return {
      placeholders: { ...formData.placeholders },
      toggles: [...formData.toggles]
    };
  }

  /**
   * Get a shareable URL for a custom state
   */
  public getShareableURL(customState: CustomState): string {
    return URLStateManager.generateShareableURL({
      customState: customState
    });
  }

  /**
   * Format names for display
   */
  public formatPlaceholderName(placeholder: string): string {
    return placeholder.charAt(0).toUpperCase() + placeholder.slice(1);
  }

  public formatAssetName(asset: string): string {
    return asset.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  public formatToggleName(toggle: string): string {
    return toggle.charAt(0).toUpperCase() + toggle.slice(1);
  }

  /**
   * Notify state change listeners (private method to be called when state changes)
   */
  private notifyStateChange(): void {
    // This would ideally trigger the core's state change listeners
    // For now, we'll dispatch a custom event
    window.dispatchEvent(new CustomEvent('customViewsStateChange'));
  }
}
