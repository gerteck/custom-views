import type { State } from "types/types";

/**
 * A LocalConfig defines a profile (ViewScope) for a viewer.
 * - `allowedToggles` determines which toggle categories are visible.
 * - `states` contains predefined views for the profile.
 * - `defaultState` is the state initially shown.
 */
export class LocalConfig {
  id: string;

  /** Toggles visible to the viewer */
  allowedToggles?: string[] | undefined;

  /** Default state to render on load */
  defaultState: State;

  constructor(opts: {
    id: string;
    allowedToggles?: string[];
    defaultState: State;
  }) {
    this.id = opts.id;
    this.allowedToggles = opts.allowedToggles;
    this.defaultState = opts.defaultState;
  }
}
