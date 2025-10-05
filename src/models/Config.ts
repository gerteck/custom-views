import type { State, TabGroupConfig } from "types/types";

/**
 * Configuration for the site, has default state and list of toggles
 */
export class Config {
  constructor(
    public allToggles: string[],
    public defaultState: State,
    public tabGroups?: TabGroupConfig[],
  ) {} 
}