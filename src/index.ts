import { CustomViewsCore } from "core/core";
import { AssetsManager } from "models/AssetsManager";
import type { CustomViewAsset, State } from "types/types";

export type InitFromJsonOptions = {
  assetsJsonPath: string;
  localConfigPaths?: Record<string, string> | undefined;
  
  defaultStateJsonPath: string;     
  rootEl?: HTMLElement;
  onViewChange?: any;
}

export class CustomViews {

  // Entry Point to use CustomViews
  static async initFromJson(opts: InitFromJsonOptions): Promise<CustomViewsCore> {
    // Load assets JSON
    const assetsJson : Record<string, CustomViewAsset> = await (await fetch(opts.assetsJsonPath)).json();
    const assetsManager = new AssetsManager(assetsJson);

    // Load Default State
    const defaultState: State = await (await fetch(opts.defaultStateJsonPath)).json();

    // Init CustomViews
    const core = new CustomViewsCore({
      assetsManager,
      defaultState,
      localConfigPaths: opts.localConfigPaths,
      rootEl: opts.rootEl,
      onViewChange: opts.onViewChange,
    });

    core.init();
    return core;
  }
}

if (typeof window !== "undefined") {
  // @ts-ignore
  window.CustomViews = CustomViews;
}

