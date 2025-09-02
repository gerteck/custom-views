import type { AssetsManager } from "models/AssetsManager";
import type { State } from "types/types";

// Holds all assets and a default State to show if no localConfig Profile specified in URL.
export class GlobalConfig {
  assetManager: AssetsManager;
  defaultState: State;

  constructor(assetManager: AssetsManager, defaultState: State) {
    this.assetManager = assetManager;
    this.defaultState = defaultState;
  }
}
