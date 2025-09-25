/**
 * URL State Manager for CustomViews
 * Handles encoding/decoding of states in URL parameters
 */

import type { State } from "../types/types";

export interface CustomState {
  toggles: string[];
}

export interface URLState {
  state?: string | null | undefined;
  customState?: CustomState | undefined;
}

export class URLStateManager {
  /**
   * Parse current URL parameters into state object
   */
  public static parseURL(): URLState {
    const urlParams = new URLSearchParams(window.location.search);
    
    const result: URLState = {};
    
    // Get predefined state
    const state = urlParams.get('state');
    if (state) {
      result.state = state;
    }
    
    // Get custom state
    const customStateParam = urlParams.get('custom');
    if (customStateParam) {
      try {
        const decoded = this.decodeCustomState(customStateParam);
        if (decoded) {
          result.customState = decoded;
        }
      } catch (error) {
        console.warn('Failed to decode custom state from URL:', error);
      }
    }
    
    return result;
  }

  /**
   * Update URL with current state without triggering navigation
   */
  public static updateURL(urlState: URLState): void {
    if (typeof window === 'undefined' || !window.history) return;
    
    const url = new URL(window.location.href);
    
    // Clear existing parameters
    url.searchParams.delete('state');
    url.searchParams.delete('custom');
    
    // Set predefined state (only if no custom state)
    if (urlState.state && !urlState.customState) {
      url.searchParams.set('state', urlState.state);
    }
    
    // Set custom state
    if (urlState.customState) {
      const encoded = this.encodeCustomState(urlState.customState);
      if (encoded) {
        url.searchParams.set('custom', encoded);
      }
    }
    
    window.history.replaceState({}, '', url.toString());
  }

  /**
   * Encode custom state into URL-safe string
   */
  public static encodeCustomState(customState: CustomState): string | null {
    try {
      // Create a compact representation
      const compact = {
        t: customState.toggles       // toggles
      };
      
      // Convert to JSON and encode
      const json = JSON.stringify(compact);
      const encoded = btoa(json); // Base64 encode
      
      // Make URL-safe
      return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    } catch (error) {
      console.warn('Failed to encode custom state:', error);
      return null;
    }
  }

  /**
   * Decode custom state from URL parameter
   */
  public static decodeCustomState(encoded: string): CustomState | null {
    try {
      // Restore base64 padding and characters
      let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
      
      // Add padding if needed
      while (base64.length % 4) {
        base64 += '=';
      }
      
      // Decode and parse
      const json = atob(base64);
      const compact = JSON.parse(json);
      
      // Validate structure
      if (!compact || typeof compact !== 'object') {
        throw new Error('Invalid compact state structure');
      }
      
      return {
        toggles: Array.isArray(compact.t) ? compact.t : []
      };
    } catch (error) {
      console.warn('Failed to decode custom state:', error);
      return null;
    }
  }

  /**
   * Convert CustomState to State format
   */
  public static customStateToState(customState: CustomState): State {
    return {
      toggles: customState.toggles
    };
  }

  /**
   * Convert State to CustomState format
   */
  public static stateToCustomState(state: State): CustomState {
    return {
      toggles: state.toggles || []
    };
  }

  /**
   * Check if current URL has custom state
   */
  public static hasCustomState(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('custom');
  }

  /**
   * Clear all state parameters from URL
   */
  public static clearURL(): void {
    this.updateURL({});
  }

  /**
   * Generate shareable URL for current state
   */
  public static generateShareableURL(urlState: URLState): string {
    const url = new URL(window.location.href);
    
    // Clear existing parameters
    url.searchParams.delete('state');
    url.searchParams.delete('custom');
    
    // Set new parameters
    if (urlState.state && !urlState.customState) {
      url.searchParams.set('state', urlState.state);
    }
    
    if (urlState.customState) {
      const encoded = this.encodeCustomState(urlState.customState);
      if (encoded) {
        url.searchParams.set('custom', encoded);
      }
    }
    
    return url.toString();
  }
}
