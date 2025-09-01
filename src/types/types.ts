import type { AssetsManager } from "assets/AssetsManager";

export interface CustomViewAsset {
  id: string;
  type: 'image' | 'text' | 'html' | string;
  src?: string;
  alt?: string;
  content?: string;
  [key: string]: any; // allow extra fields
}


// ============================================
// Configurations
// ============================================

export interface State {
  placeholders?: Record<string, string>; // placeholderName -> assetId
  toggles?: string[];    // toggleCategory
}


// Holds all assets and a default State to show if no localConfig Profile specified in URL.
export class GlobalConfig {
  assetManager: AssetsManager;
  defaultState: State;

  constructor(assetManager: AssetsManager, defaultState: State) {
    this.assetManager = assetManager;
    this.defaultState = defaultState;
  }
}

// A Local Config is a Profile with constraints on placeholders & toggles, and 
// predefined states and a default State
export class LocalConfig {
  allowedPlaceholders?: string[] | undefined;
  allowedToggles?: string[] | undefined; // category -> allowed toggleIds
  states: Record<string, State>;
  defaultState: string;

  constructor(opts: {
    allowedPlaceholders?: string[];
    allowedToggles?: string[];
    states: Record<string, State>;
    defaultState: string;
  }) {
    this.allowedPlaceholders = opts.allowedPlaceholders;
    this.allowedToggles = opts.allowedToggles;
    this.states = opts.states;
    this.defaultState = opts.defaultState;
  }
}

