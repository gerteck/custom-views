import type { ToggleId } from "../types/types";
import { AssetsManager } from "./assets-manager";
import { renderAssetInto } from "./render";

// Constants for selectors
const TOGGLE_DATA_SELECTOR = "[data-cv-toggle], [data-customviews-toggle]";
const TOGGLE_ELEMENT_SELECTOR = "cv-toggle";
const TOGGLE_SELECTOR = `${TOGGLE_DATA_SELECTOR}, ${TOGGLE_ELEMENT_SELECTOR}`;

/**
 * ToggleManager handles discovery, visibility, and asset rendering for toggle elements
 */
export class ToggleManager {
  /**
   * Apply toggle visibility to all toggle elements in the DOM
   */
  public static applyToggles(rootEl: HTMLElement, activeToggles: ToggleId[]): void {
    rootEl.querySelectorAll(TOGGLE_SELECTOR).forEach(el => {
      const categories = this.getToggleCategories(el as HTMLElement);
      const shouldShow = categories.some(cat => activeToggles.includes(cat));
      this.applyToggleVisibility(el as HTMLElement, shouldShow);
    });
  }

  /**
   * Render assets into toggle elements that are currently visible
   */
  public static renderAssets(rootEl: HTMLElement, activeToggles: ToggleId[], assetsManager: AssetsManager): void {
    rootEl.querySelectorAll(TOGGLE_SELECTOR).forEach(el => {
      const categories = this.getToggleCategories(el as HTMLElement);
      const toggleId = this.getToggleId(el as HTMLElement);
      if (toggleId && categories.some(cat => activeToggles.includes(cat))) {
        renderAssetInto(el as HTMLElement, toggleId, assetsManager);
      }
    });
  }

  /**
   * Get toggle categories from an element (supports both data attributes and cv-toggle elements)
   */
  private static getToggleCategories(el: HTMLElement): string[] {
    if (el.tagName.toLowerCase() === 'cv-toggle') {
      const category = el.getAttribute('category');
      return (category || '').split(/\s+/).filter(Boolean);
    } else {
      const data = el.dataset.cvToggle || el.dataset.customviewsToggle;
      return (data || '').split(/\s+/).filter(Boolean);
    }
  }

  /**
   * Get toggle ID from an element
   */
  private static getToggleId(el: HTMLElement): string | undefined {
    return el.dataset.cvId || el.dataset.customviewsId || el.getAttribute('data-cv-id') || el.getAttribute('data-customviews-id') || undefined;
  }

  /**
   * Apply simple class-based visibility to a toggle element
   */
  private static applyToggleVisibility(el: HTMLElement, visible: boolean): void {
    if (visible) {
      el.classList.remove('cv-hidden');
      el.classList.add('cv-visible');
    } else {
      el.classList.add('cv-hidden');
      el.classList.remove('cv-visible');
    }
  }
}