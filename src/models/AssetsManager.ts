import type { CustomViewAsset } from "types/types";

export class AssetsManager {
  assets: Record<string, CustomViewAsset>;

  constructor(assets: Record<string, CustomViewAsset>) {
    this.assets = assets;
    if (!this.validate()) {
      console.warn('Invalid assets:', this.assets);
    }
  }

  // Check each asset has content or src
  validate(): boolean {
    return Object.values(this.assets).every(a => a.src || a.content);
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

}
