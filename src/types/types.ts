/**
 * Represents an individual asset that can be rendered in a custom view.
 */
export interface CustomViewAsset {
  /** Used by elements to reference the asset. */
  id: string;
  type: 'image' | 'text' | 'html' | string;
  src?: string;
  alt?: string;
  content?: string;
  [key: string]: any;
}

/**
 * Represents a specific state of a custom view.
 * States contain the list of toggle categories that should be displayed in this state. 
 */
export interface State {
  toggles: ToggleId[];
}

export type ToggleId = string;
