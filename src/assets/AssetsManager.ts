import type { CustomViewAsset, State } from "types/types";

export class AssetsManager {
  assets: Record<string, CustomViewAsset>;

  constructor(assets: Record<string, CustomViewAsset>) {
    this.assets = assets;
  }

  get(assetId: string): CustomViewAsset | undefined {
    return this.assets[assetId];
  }

  loadFromJSON(json: Record<string, CustomViewAsset>) {
    this.assets = json;
  }

  loadAdditionalAssets(additionalAssets: Record<string, CustomViewAsset>) {
    this.assets = { ...this.assets, ...additionalAssets };
  }

  validate(): boolean {
    // optional: check each asset has type, id, etc.
    return Object.values(this.assets).every(a => a.type);
  }
}

export class GlobalConfig {
  assets: AssetsManager;
  defaultState: State;

  constructor(assets: AssetsManager, defaultState: State) {
    this.assets = assets;
    this.defaultState = defaultState;
  }
}
