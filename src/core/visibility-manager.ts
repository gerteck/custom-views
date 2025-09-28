import type { State } from "../types/types";

export type ToggleId = string;

export interface ToggleVisibilityChange {
  toggleId: ToggleId;
  visible: boolean;
}

type VisibilityListener = (event: ToggleVisibilityChange) => void;

/**
 * Centralized visibility management for toggles (DOM + semantics).
 * - Owns the hidden set
 * - Provides helpers to apply visibility to DOM with a11y and transitions
 * - Filters states for URL/persistence
 */
export class VisibilityManager {
  private hiddenToggles: Set<ToggleId> = new Set();
  private listeners: VisibilityListener[] = [];

  /** Mark a toggle visible/hidden. Returns true if changed. */
  public setToggleVisibility(toggleId: ToggleId, visible: boolean): boolean {
    const wasHidden = this.hiddenToggles.has(toggleId);
    const shouldHide = !visible;
    if (shouldHide && !wasHidden) {
      this.hiddenToggles.add(toggleId);
      this.emit({ toggleId, visible: false });
      return true;
    }
    if (!shouldHide && wasHidden) {
      this.hiddenToggles.delete(toggleId);
      this.emit({ toggleId, visible: true });
      return true;
    }
    return false;
  }

  /** Bulk set using predicate over known toggles. */
  public setVisibilityByPredicate(allToggleIds: ToggleId[], predicate: (t: ToggleId) => boolean, visible: boolean): void {
    for (const id of allToggleIds) {
      if (predicate(id)) {
        this.setToggleVisibility(id, visible);
      }
    }
  }

  /** Hide all toggles in the provided set. */
  public hideAll(allToggleIds: ToggleId[]): void {
    for (const id of allToggleIds) {
      this.setToggleVisibility(id, false);
    }
  }

  /** Show all toggles in the provided set. */
  public showAll(allToggleIds: ToggleId[]): void {
    for (const id of allToggleIds) {
      this.setToggleVisibility(id, true);
    }
  }

  /** Get the globally hidden toggle ids (explicitly hidden via API). */
  public getHiddenToggles(): ToggleId[] {
    return Array.from(this.hiddenToggles);
  }

  /** Filter a list of toggles to only those visible per the hidden set. */
  public filterVisibleToggles(toggleIds: ToggleId[]): ToggleId[] {
    return toggleIds.filter(t => !this.hiddenToggles.has(t));
  }

  /**
   * Compute currently visible toggles given current state and DOM presence.
   * DOM presence is optional. If provided, it additionally filters out toggles
   * not present in the DOM.
   */
  public getVisibleToggles(stateToggles: ToggleId[], presentInDom?: Set<ToggleId>): ToggleId[] {
    const base = this.filterVisibleToggles(stateToggles);
    if (!presentInDom) return base;
    return base.filter(t => presentInDom.has(t));
  }

  /** Add listener for individual toggle visibility changes. */
  public addListener(listener: VisibilityListener): void {
    this.listeners.push(listener);
  }

  /** Remove listener. */
  public removeListener(listener: VisibilityListener): void {
    const idx = this.listeners.indexOf(listener);
    if (idx >= 0) this.listeners.splice(idx, 1);
  }

  private emit(event: ToggleVisibilityChange): void {
    for (const l of this.listeners) {
      try { l(event); } catch { /* noop */ }
    }
  }

  /**
   * Apply a11y + transition aware visibility to a toggle element.
   * The element is assumed to have data-customviews-toggle.
   */
  public applyElementVisibility(el: HTMLElement, visible: boolean): void {
    if (visible) {
      // If element is currently focused but being shown, nothing special
      el.classList.remove('cv-hidden');
      el.classList.add('cv-visible');
      el.removeAttribute('aria-hidden');
      el.removeAttribute('inert');
      // Leave hidden attribute off for transition
      this.restoreFocusability(el);
    } else {
      // Move focus if the element or its descendants are focused
      this.defocusIfContainsActiveElement(el);
      el.classList.add('cv-hidden');
      el.classList.remove('cv-visible');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('inert', '');
      this.removeFocusability(el);
    }
  }

  /** Remove focusability by setting tabindex on the element itself. */
  private removeFocusability(el: HTMLElement): void {
    // Store original tabindex if any
    if (!el.hasAttribute('data-cv-orig-tabindex')) {
      const orig = el.getAttribute('tabindex');
      if (orig !== null) {
        el.setAttribute('data-cv-orig-tabindex', orig);
      }
    }
    el.setAttribute('tabindex', '-1');
  }

  /** Restore previously stored tabindex, if any; otherwise remove attribute. */
  private restoreFocusability(el: HTMLElement): void {
    const orig = el.getAttribute('data-cv-orig-tabindex');
    if (orig !== null) {
      el.setAttribute('tabindex', orig);
      el.removeAttribute('data-cv-orig-tabindex');
    } else {
      el.removeAttribute('tabindex');
    }
  }

  private defocusIfContainsActiveElement(el: HTMLElement): void {
    const active = document.activeElement as HTMLElement | null;
    if (!active) return;
    if (el === active || el.contains(active)) {
      // Try to move focus to body
      (document.body as HTMLElement).focus?.();
      if (document.activeElement === active) {
        // As a fallback, blur
        active.blur();
      }
    }
  }

  /** Given a state, returns a filtered state safe for URL/persistence. */
  public filterStateForPersistence(state: State): State {
    return {
      toggles: this.filterVisibleToggles(state.toggles || [])
    };
  }
}

