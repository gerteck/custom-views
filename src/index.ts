import { CustomViewsCore } from "core/core";
import { AssetsManager } from "models/AssetsManager";
import { GlobalConfig } from "models/globalConfig";
import { LocalConfig } from "models/LocalConfig";
import type { CustomViewAsset, State } from "types/types";

export type InitFromJsonOptions = {
  assetsJsonPath: string;
  defaultStateJsonPath: string;     
  localConfigPaths?: Record<string, string>;
  defaultProfile?: string;
  rootEl?: HTMLElement;
  onViewChange?: any;
}

export class CustomViews {

  static async initFromJson(opts: InitFromJsonOptions) {
    // Load assets JSON
    const assetsJson : Record<string, CustomViewAsset> = await (await fetch(opts.assetsJsonPath)).json();
    const assetsManager = new AssetsManager(assetsJson);

    // Load Default State
    const defaultState: State = await (await fetch(opts.defaultStateJsonPath)).json();
    const globalConfig = new GlobalConfig(assetsManager, defaultState);

    // Load local configs
    let localConfigs: Record<string, LocalConfig> = {};
    if (opts.localConfigPaths) {
      for (const [profile, profileJsonFilePath] of Object.entries(opts.localConfigPaths)) {
        const data = await (await fetch(profileJsonFilePath)).json();
        localConfigs[profile] = new LocalConfig(data);
      }
    }

    // Get Active local config
    // We only need to load the current profile based on URL
    const profileFromUrl = new URLSearchParams(window.location.search).get("profile");
    const profileId = profileFromUrl || opts.defaultProfile;
    const activeLocalConfig = profileId ? localConfigs[profileId] : undefined;

    // Init CustomViews
    const core = new CustomViewsCore({
      globalConfig,
      assetsManager,
      localConfig: activeLocalConfig,
      rootEl: opts.rootEl,
      onViewChange: opts.onViewChange,
    });

    core.init();
    return core;
  }
}

