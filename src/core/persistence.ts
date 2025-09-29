import type { State } from "../types/types";

/**
 * Manages persistence of custom views state using browser localStorage
 */
export class PersistenceManager {
  // Storage keys for localStorage
  private static readonly STORAGE_KEYS = {
    STATE: 'customviews-state'
  } as const;

  /**
   * Check if localStorage is available in the current environment
   */
  private isStorageAvailable(): boolean {
    return typeof window !== 'undefined' && window.localStorage !== undefined;
  }

  
  public persistState(state: State): void {
    if (!this.isStorageAvailable()) return;

    try {
      localStorage.setItem(PersistenceManager.STORAGE_KEYS.STATE, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to persist state:', error);
    }
  }

  
  public getPersistedState(): State | null {
    if (!this.isStorageAvailable()) return null;
    try {
      const raw = localStorage.getItem(PersistenceManager.STORAGE_KEYS.STATE);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('Failed to parse persisted state:', error);
      return null;
    }
  }

 
  /**
   * Clear persisted state
   */
  public clearAll(): void {
    if (!this.isStorageAvailable()) return;

    localStorage.removeItem(PersistenceManager.STORAGE_KEYS.STATE);
  }

  /**
   * Check if any persistence data exists
   */
  public hasPersistedData(): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }
    return !!this.getPersistedState();
  }

}
