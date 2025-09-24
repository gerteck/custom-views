import type { State } from "types/types";

/**
 * A LocalConfig defines a profile (ViewScope) for a viewer.
 * - `modifiablePlaceholderAssets` determines which assets can be swapped into visible placeholders.
 * - `allowedToggles` determines which toggle categories are visible.
 * - `states` contains predefined views for the profile.
 * - `defaultState` is the state initially shown.
 */
export class LocalConfig {
  id: string;

  /** Assets that can be assigned to each visible placeholder */
  modifiablePlaceholderAssets?: Record<string, string[]> | undefined;

  /** Toggles visible to the viewer */
  allowedToggles?: string[] | undefined;

  /** Default state to render on load */
  defaultState: State;

  constructor(opts: {
    id: string;
    modifiablePlaceholderAssets?: Record<string, string[]>;
    allowedToggles?: string[];
    defaultState: State;
  }) {
    this.id = opts.id;
    this.modifiablePlaceholderAssets = opts.modifiablePlaceholderAssets;
    this.allowedToggles = opts.allowedToggles;
    this.defaultState = opts.defaultState;
  }
}
