import type { State } from "../types/types";

/**
 * Manages persistence of custom views state using browser localStorage
 */
export class PersistenceManager {
  // Storage keys for localStorage
  private static readonly STORAGE_KEYS = {
    PROFILE: 'customviews-profile',
    STATE: 'customviews-state',
    CUSTOM_STATE: 'customviews-custom-state'
  } as const;

  /**
   * Check if localStorage is available in the current environment
   */
  private isStorageAvailable(): boolean {
    return typeof window !== 'undefined' && window.localStorage !== undefined;
  }

  // === PROFILE PERSISTENCE ===

  /**
   * Persists the current profile to localStorage
   */
  public persistProfile(profile: string | null): void {
    if (!this.isStorageAvailable()) return;

    if (profile) {
      localStorage.setItem(PersistenceManager.STORAGE_KEYS.PROFILE, profile);
    } else {
      localStorage.removeItem(PersistenceManager.STORAGE_KEYS.PROFILE);
    }
  }

  /**
   * Retrieves the persisted profile from localStorage
   */
  public getPersistedProfile(): string | null {
    if (!this.isStorageAvailable()) return null;
    
    return localStorage.getItem(PersistenceManager.STORAGE_KEYS.PROFILE);
  }

  // === STATE PERSISTENCE ===

  /**
   * Persists the current state to localStorage
   */
  public persistState(state: string | null): void {
    if (!this.isStorageAvailable()) return;

    if (state) {
      localStorage.setItem(PersistenceManager.STORAGE_KEYS.STATE, state);
    } else {
      localStorage.removeItem(PersistenceManager.STORAGE_KEYS.STATE);
    }
  }

  /**
   * Retrieves the persisted state from localStorage
   */
  public getPersistedState(): string | null {
    if (!this.isStorageAvailable()) return null;
    
    return localStorage.getItem(PersistenceManager.STORAGE_KEYS.STATE);
  }

  // === CUSTOM STATE PERSISTENCE ===

  /**
   * Persists a custom state configuration to localStorage
   * @param customState - The custom state configuration to persist
   */
  public persistCustomState(customState: State): void {
    if (!this.isStorageAvailable()) return;

    try {
      const serialized = JSON.stringify(customState);
      localStorage.setItem(PersistenceManager.STORAGE_KEYS.CUSTOM_STATE, serialized);
    } catch (error) {
      console.warn('Failed to persist custom state:', error);
    }
  }

  /**
   * Retrieves a custom state configuration from localStorage
   */
  public getPersistedCustomState(): State | null {
    if (!this.isStorageAvailable()) return null;

    try {
      const stored = localStorage.getItem(PersistenceManager.STORAGE_KEYS.CUSTOM_STATE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse persisted custom state:', error);
    }
    
    return null;
  }

  // === UTILITY METHODS ===

  /**
   * Get both persisted profile and state in one call
   */
  public getPersistedView(): { profile: string | null; state: string | null } {
    return {
      profile: this.getPersistedProfile(),
      state: this.getPersistedState()
    };
  }

  /**
   * Persist both profile and state in one call
   */
  public persistView(profile: string | null, state: string | null): void {
    this.persistProfile(profile);
    this.persistState(state);
  }

  /**
   * Clear all persisted data and reset to defaults
   */
  public clearAll(): void {
    if (!this.isStorageAvailable()) return;

    localStorage.removeItem(PersistenceManager.STORAGE_KEYS.PROFILE);
    localStorage.removeItem(PersistenceManager.STORAGE_KEYS.STATE);
    localStorage.removeItem(PersistenceManager.STORAGE_KEYS.CUSTOM_STATE);
  }

  /**
   * Check if any persistence data exists
   */
  public hasPersistedData(): boolean {
    if (!this.isStorageAvailable()) return false;

    return !!(
      this.getPersistedProfile() || 
      this.getPersistedState() || 
      this.getPersistedCustomState()
    );
  }

  /**
   * Get all storage keys used by CustomViews (useful for debugging)
   */
  public getStorageKeys(): typeof PersistenceManager.STORAGE_KEYS {
    return PersistenceManager.STORAGE_KEYS;
  }

  /**
   * Debug method to log current persistence state
   */
  public debugLog(): void {
    if (!this.isStorageAvailable()) {
      console.log('LocalStorage not available');
      return;
    }

    console.group('CustomViews Persistence State');
    console.log('Profile:', this.getPersistedProfile());
    console.log('State:', this.getPersistedState());
    console.log('Custom State:', this.getPersistedCustomState());
    console.log('Has Data:', this.hasPersistedData());
    console.groupEnd();
  }
}
