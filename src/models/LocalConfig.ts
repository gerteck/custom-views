import type { State } from "types/types";

/**
 * A LocalConfig defines a profile (ViewScope) for a viewer.
 * - `allowedPlaceholders` determines which placeholders are visible to the viewer.
 * - `modifiablePlaceholderAssets` determines which assets can be swapped into visible placeholders.
 * - `allowedToggles` determines which toggle categories are visible.
 * - `states` contains predefined views for the profile.
 * - `defaultState` is the state initially shown.
 */
export class LocalConfig {
  /** Placeholders visible to the viewer */
  allowedPlaceholders?: string[] | undefined;

  /** Assets that can be assigned to each visible placeholder */
  modifiablePlaceholderAssets?: Record<string, string[]> | undefined;

  /** Toggles visible to the viewer */
  allowedToggles?: string[] | undefined;

  /** Predefined states (snapshots of placeholder values + toggles) */
  states: Record<string, State>;

  /** Default state to render on load */
  defaultState: string;

  constructor(opts: {
    allowedPlaceholders?: string[];
    modifiablePlaceholderAssets?: Record<string, string[]>;
    allowedToggles?: string[];
    states: Record<string, State>;
    defaultState: string;
  }) {
    this.allowedPlaceholders = opts.allowedPlaceholders;
    this.modifiablePlaceholderAssets = opts.modifiablePlaceholderAssets;
    this.allowedToggles = opts.allowedToggles;
    this.states = opts.states;
    this.defaultState = opts.defaultState;
  }
}
