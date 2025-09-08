/**
 * Represents an individual asset that can be rendered in a custom view.
 * Could be used as a placeholder or a toggle.
 */
export interface CustomViewAsset {
  /** Unique identifier for this asset. Used in States to reference it. */
  id: string;

  /** Type of asset. Determines which renderer is used. */
  type: 'image' | 'text' | 'html' | string;

  /** URL for an image asset. Required if type is 'image'. */
  src?: string;

  /** Alt text for image assets. Optional, defaults to empty string. */
  alt?: string;

  /** Content for text or HTML assets. Optional. */
  content?: string;

  /** Any additional custom properties that a specific asset might need. */
  [key: string]: any;
}

/**
 * Represents a specific state of a custom view.
 * States contain mapping of placeholder names  to asset IDs,
 * and contain the list of toggle categories that should be displayed in this state. 
 */
export interface State {
  /**
   * Mapping of placeholder names to asset IDs.
   * Example:
   * {
   *   "logo": "asset-logo",
   *   "introText": "asset-intro-text"
   * }
   */
  placeholders: Record<string, string>;

  /**
   * List of toggle categories that should be displayed in this state.
   * Example:
   * ["advancedOptions", "extraInfo"]
   */
  toggles: string[];
}
