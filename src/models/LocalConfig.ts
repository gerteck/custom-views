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

  /** Predefined states (snapshots of placeholder values + toggles) */
  states: Record<string, State>;

  /** Default state to render on load */
  defaultState: string;

  constructor(opts: {
    id: string;
    allowedPlaceholders?: string[];
    modifiablePlaceholderAssets?: Record<string, string[]>;
    allowedToggles?: string[];
    states: Record<string, State>;
    defaultState: string;
  }) {
    this.id = opts.id;
    this.modifiablePlaceholderAssets = opts.modifiablePlaceholderAssets;
    this.allowedToggles = opts.allowedToggles;
    this.states = opts.states;
    this.defaultState = opts.defaultState;
  }
}
