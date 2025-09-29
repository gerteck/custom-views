import type { State } from "types/types";

/**
 * Configuration for the site, has default state and list of toggles
 */
export class Config {
  constructor(
    public defaultState: State,
    public allToggles?: string[],
  ) {} 
}