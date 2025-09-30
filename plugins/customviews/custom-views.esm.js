/*!
 * customviews v0.2.0
 * (c) 2025 Chan Ger Teck
 * Released under the MIT License.
 */
/** --- Basic renderers --- */
function renderImage(el, asset) {
    if (!asset.src)
        return;
    el.innerHTML = '';
    const img = document.createElement('img');
    img.src = asset.src;
    img.alt = asset.alt || '';
    // Apply custom styling if provided
    if (asset.className) {
        img.className = asset.className;
    }
    if (asset.style) {
        img.setAttribute('style', asset.style);
    }
    // Default styles (can be overridden by asset.style)
    img.style.maxWidth = img.style.maxWidth || '100%';
    img.style.height = img.style.height || 'auto';
    img.style.display = img.style.display || 'block';
    el.appendChild(img);
}
function renderText(el, asset) {
    if (asset.content != null) {
        el.textContent = asset.content;
    }
    // Apply custom styling if provided
    if (asset.className) {
        el.className = asset.className;
    }
    if (asset.style) {
        el.setAttribute('style', asset.style);
    }
}
function renderHtml(el, asset) {
    if (asset.content != null) {
        el.innerHTML = asset.content;
    }
    // Apply custom styling if provided
    if (asset.className) {
        el.className = asset.className;
    }
    if (asset.style) {
        el.setAttribute('style', asset.style);
    }
}
/** --- Unified asset renderer --- */
function detectAssetType(asset) {
    // If src exists, it's an image
    if (asset.src)
        return 'image';
    // If content contains HTML tags, it's HTML
    if (asset.content && /<[^>]+>/.test(asset.content)) {
        return 'html';
    }
    return 'text';
}
function renderAssetInto(el, assetId, assetsManager) {
    const asset = assetsManager.get(assetId);
    if (!asset)
        return;
    const type = asset.type || detectAssetType(asset);
    switch (type) {
        case 'image':
            renderImage(el, asset);
            break;
        case 'text':
            renderText(el, asset);
            break;
        case 'html':
            renderHtml(el, asset);
            break;
        default:
            el.innerHTML = asset.content || String(asset);
            console.warn('[CustomViews] Unknown asset type:', type);
    }
}

/**
 * Configuration for the site, has default state and list of toggles
 */
class Config {
    defaultState;
    allToggles;
    constructor(defaultState, allToggles) {
        this.defaultState = defaultState;
        this.allToggles = allToggles;
    }
}

/**
 * Manages persistence of custom views state using browser localStorage
 */
class PersistenceManager {
    // Storage keys for localStorage
    static STORAGE_KEYS = {
        STATE: 'customviews-state'
    };
    /**
     * Check if localStorage is available in the current environment
     */
    isStorageAvailable() {
        return typeof window !== 'undefined' && window.localStorage !== undefined;
    }
    persistState(state) {
        if (!this.isStorageAvailable())
            return;
        try {
            localStorage.setItem(PersistenceManager.STORAGE_KEYS.STATE, JSON.stringify(state));
        }
        catch (error) {
            console.warn('Failed to persist state:', error);
        }
    }
    getPersistedState() {
        if (!this.isStorageAvailable())
            return null;
        try {
            const raw = localStorage.getItem(PersistenceManager.STORAGE_KEYS.STATE);
            return raw ? JSON.parse(raw) : null;
        }
        catch (error) {
            console.warn('Failed to parse persisted state:', error);
            return null;
        }
    }
    /**
     * Clear persisted state
     */
    clearAll() {
        if (!this.isStorageAvailable())
            return;
        localStorage.removeItem(PersistenceManager.STORAGE_KEYS.STATE);
    }
    /**
     * Check if any persistence data exists
     */
    hasPersistedData() {
        if (!this.isStorageAvailable()) {
            return false;
        }
        return !!this.getPersistedState();
    }
}

/**
 * URL State Manager for CustomViews
 * Handles encoding/decoding of states in URL parameters
 */
class URLStateManager {
    /**
     * Parse current URL parameters into state object
     */
    static parseURL() {
        const urlParams = new URLSearchParams(window.location.search);
        // Get view state
        const viewParam = urlParams.get('view');
        let decoded = null;
        if (viewParam) {
            try {
                decoded = this.decodeState(viewParam);
            }
            catch (error) {
                console.warn('Failed to decode view state from URL:', error);
            }
        }
        return decoded;
    }
    /**
     * Update URL with current state without triggering navigation
     */
    static updateURL(state) {
        if (typeof window === 'undefined' || !window.history)
            return;
        const url = new URL(window.location.href);
        // Clear existing parameters
        url.searchParams.delete('view');
        // Set view state
        if (state) {
            const encoded = this.encodeState(state);
            if (encoded) {
                url.searchParams.set('view', encoded);
            }
        }
        // Use a relative URL to satisfy stricter environments (e.g., jsdom tests)
        const relative = url.pathname + (url.search || '') + (url.hash || '');
        window.history.replaceState({}, '', relative);
    }
    /**
     * Clear all state parameters from URL
     */
    static clearURL() {
        this.updateURL(null);
    }
    /**
     * Generate shareable URL for current state
     */
    static generateShareableURL(state) {
        const url = new URL(window.location.href);
        // Clear existing parameters
        url.searchParams.delete('view');
        // Set new parameters
        if (state) {
            const encoded = this.encodeState(state);
            if (encoded) {
                url.searchParams.set('view', encoded);
            }
        }
        return url.toString();
    }
    /**
     * Encode state into URL-safe string
     */
    static encodeState(state) {
        try {
            // Create a compact representation
            const compact = {
                t: state.toggles
            };
            // Convert to JSON and encode
            const json = JSON.stringify(compact);
            let encoded;
            if (typeof btoa === 'function') {
                encoded = btoa(json);
            }
            else {
                // Node/test fallback
                // @ts-ignore
                encoded = Buffer.from(json, 'utf-8').toString('base64');
            }
            // Make URL-safe
            const urlSafeString = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
            return urlSafeString;
        }
        catch (error) {
            console.warn('Failed to encode state:', error);
            return null;
        }
    }
    /**
     * Decode custom state from URL parameter
     */
    static decodeState(encoded) {
        try {
            // Restore base64 padding and characters
            let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
            // Add padding if needed
            while (base64.length % 4) {
                base64 += '=';
            }
            // Decode and parse
            let json;
            if (typeof atob === 'function') {
                json = atob(base64);
            }
            else {
                // Node/test fallback
                // @ts-ignore
                json = Buffer.from(base64, 'base64').toString('utf-8');
            }
            const compact = JSON.parse(json);
            // Validate structure
            if (!compact || typeof compact !== 'object') {
                throw new Error('Invalid compact state structure');
            }
            return {
                toggles: Array.isArray(compact.t) ? compact.t : []
            };
        }
        catch (error) {
            console.warn('Failed to decode view state:', error);
            return null;
        }
    }
}

/**
 * Keeps track of which toggles are hidden and which are visible in memory.
 *
 * This class keeps track of hidden toggles without reading the DOM or URL.
 */
class VisibilityManager {
    hiddenToggles = new Set();
    /** Marks a toggle as visible or hidden.
     * Returns true if changed.
     * Also updates internal set of hidden toggles.
     */
    setToggleVisibility(toggleId, visible) {
        const wasHidden = this.hiddenToggles.has(toggleId);
        const shouldHide = !visible;
        if (shouldHide && !wasHidden) {
            this.hiddenToggles.add(toggleId);
            return true;
        }
        if (!shouldHide && wasHidden) {
            this.hiddenToggles.delete(toggleId);
            return true;
        }
        return false;
    }
    /** Hide all toggles in the provided set. */
    hideAll(allToggleIds) {
        for (const id of allToggleIds) {
            this.setToggleVisibility(id, false);
        }
    }
    /** Show all toggles in the provided set. */
    showAll(allToggleIds) {
        for (const id of allToggleIds) {
            this.setToggleVisibility(id, true);
        }
    }
    /** Get the globally hidden toggle ids (explicitly hidden via API). */
    getHiddenToggles() {
        return Array.from(this.hiddenToggles);
    }
    /** Filter a list of toggles to only those visible per the hidden set. */
    filterVisibleToggles(toggleIds) {
        return toggleIds.filter(t => !this.hiddenToggles.has(t));
    }
    /**
     * Apply simple class-based visibility to a toggle element.
     * The element is assumed to have data-customviews-toggle.
     */
    applyElementVisibility(el, visible) {
        if (visible) {
            el.classList.remove('cv-hidden');
            el.classList.add('cv-visible');
        }
        else {
            el.classList.add('cv-hidden');
            el.classList.remove('cv-visible');
        }
    }
}

const CORE_STYLES = `
[data-customviews-toggle] {
  transition: opacity 150ms ease,
              transform 150ms ease,
              max-height 200ms ease,
              margin 150ms ease;
  will-change: opacity, transform, max-height, margin;
}

.cv-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
  max-height: var(--cv-max-height, 9999px) !important;
}

.cv-hidden {
  opacity: 0 !important;
  transform: translateY(-4px) !important;
  pointer-events: none !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border-top-width: 0 !important;
  border-bottom-width: 0 !important;
  max-height: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  overflow: hidden !important;
}
`;
/**
 * Add styles for hiding and showing toggles animations and transitions to the document head
 */
function injectCoreStyles() {
    if (typeof document === 'undefined')
        return;
    if (document.querySelector('#cv-core-styles'))
        return;
    const style = document.createElement('style');
    style.id = 'cv-core-styles';
    style.textContent = CORE_STYLES;
    document.head.appendChild(style);
}

class CustomViewsCore {
    rootEl;
    assetsManager;
    persistenceManager;
    visibilityManager;
    stateFromUrl = null;
    localConfig;
    stateChangeListeners = [];
    constructor(opt) {
        this.assetsManager = opt.assetsManager;
        this.localConfig = opt.config;
        this.rootEl = opt.rootEl || document.body;
        this.persistenceManager = new PersistenceManager();
        this.visibilityManager = new VisibilityManager();
    }
    getLocalConfig() {
        return this.localConfig;
    }
    // Inject styles, setup listeners and call rendering logic
    async init() {
        injectCoreStyles();
        // For session history, clicks on back/forward button
        window.addEventListener("popstate", () => {
            this.loadAndRenderState();
        });
        this.loadAndRenderState();
    }
    // Priority: URL state > persisted state > default
    // Also filters using the visibility manager to persist selection
    // across back/forward button clicks
    async loadAndRenderState() {
        // 1. URL State
        this.stateFromUrl = URLStateManager.parseURL();
        if (this.stateFromUrl) {
            this.applyState(this.stateFromUrl);
            return;
        }
        // 2. Persisted State
        const persistedState = this.persistenceManager.getPersistedState();
        if (persistedState) {
            this.applyState(persistedState);
            return;
        }
        // 3. Local Config Fallback
        this.renderState(this.localConfig.defaultState);
    }
    /**
   * Apply a custom state, saves to localStorage and updates the URL
   */
    applyState(state) {
        this.renderState(state);
        this.persistenceManager.persistState(state);
        this.stateFromUrl = state;
        URLStateManager.updateURL(state);
    }
    /** Render all toggles for the current state */
    renderState(state) {
        const toggles = state.toggles || [];
        const finalToggles = this.visibilityManager.filterVisibleToggles(toggles);
        // Toggles hide or show relevant toggles
        this.rootEl.querySelectorAll("[data-customviews-toggle]").forEach(el => {
            const category = el.dataset.customviewsToggle;
            const shouldShow = !!category && finalToggles.includes(category);
            this.visibilityManager.applyElementVisibility(el, shouldShow);
        });
        // Render toggles
        for (const category of finalToggles) {
            this.rootEl.querySelectorAll(`[data-customviews-toggle="${category}"]`).forEach(el => {
                // if it has an id, then we render the asset into it
                // if it has no id, then we assume it's a container
                const toggleId = el.dataset.customviewsId;
                if (toggleId) {
                    renderAssetInto(el, toggleId, this.assetsManager);
                }
            });
        }
        // Notify state change listeners (like widgets)
        this.notifyStateChangeListeners();
    }
    /**
     * Reset to default state
     */
    resetToDefault() {
        this.stateFromUrl = null;
        this.persistenceManager.clearAll();
        if (this.localConfig) {
            this.renderState(this.localConfig.defaultState);
        }
        else {
            console.warn("No configuration loaded, cannot reset to default state");
        }
        // Clear URL
        URLStateManager.clearURL();
    }
    /**
     * Get the currently active toggles regardless of whether they come from custom state or default configuration
     */
    getCurrentActiveToggles() {
        // If we have a custom state, return its toggles
        if (this.stateFromUrl) {
            return this.stateFromUrl.toggles || [];
        }
        // Otherwise, if we have local config, return its default state toggles
        if (this.localConfig) {
            return this.localConfig.defaultState.toggles || [];
        }
        // No configuration or state
        return [];
    }
    /**
     * Clear all persistence and reset to default
     */
    clearPersistence() {
        this.persistenceManager.clearAll();
        this.stateFromUrl = null;
        if (this.localConfig) {
            this.renderState(this.localConfig.defaultState);
        }
        else {
            console.warn("No configuration loaded, cannot reset to default state");
        }
        URLStateManager.clearURL();
    }
    // === STATE CHANGE LISTENER METHODS ===
    /**
     * Add a listener that will be called whenever the state changes
     */
    addStateChangeListener(listener) {
        this.stateChangeListeners.push(listener);
    }
    /**
     * Remove a state change listener
     */
    removeStateChangeListener(listener) {
        const index = this.stateChangeListeners.indexOf(listener);
        if (index > -1) {
            this.stateChangeListeners.splice(index, 1);
        }
    }
    /**
     * Notify all state change listeners
     */
    notifyStateChangeListeners() {
        this.stateChangeListeners.forEach(listener => {
            try {
                listener();
            }
            catch (error) {
                console.warn('Error in state change listener:', error);
            }
        });
    }
}

class AssetsManager {
    assets;
    constructor(assets) {
        this.assets = assets;
        if (!this.validate()) {
            console.warn('Invalid assets:', this.assets);
        }
    }
    // Check each asset has content or src
    validate() {
        return Object.values(this.assets).every(a => a.src || a.content);
    }
    get(assetId) {
        return this.assets[assetId];
    }
    loadFromJSON(json) {
        this.assets = json;
    }
    loadAdditionalAssets(additionalAssets) {
        this.assets = { ...this.assets, ...additionalAssets };
    }
}

/**
 * Widget styles for CustomViews
 * Extracted from widget.ts for better maintainability
 *
 * Note: Styles are kept as a TypeScript string for compatibility with the build system.
 * This approach ensures the styles are properly bundled and don't require separate CSS file handling.
 */
const WIDGET_STYLES = `
/* Rounded rectangle widget icon styles */
.cv-widget-icon {
  position: fixed;
  background: white;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9998;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.cv-widget-icon:hover {
  background: white;
  color: black;
}

/* Top-right: rounded end on left, sticks out leftward on hover */
.cv-widget-top-right {
  top: 20px;
  right: 0;
  border-radius: 18px 0 0 18px;
  padding-left: 8px;
  justify-content: flex-start;
}

/* Top-left: rounded end on right, sticks out rightward on hover */
.cv-widget-top-left {
  top: 20px;
  left: 0;
  border-radius: 0 18px 18px 0;
  padding-right: 8px;
  justify-content: flex-end;
}

/* Bottom-right: rounded end on left, sticks out leftward on hover */
.cv-widget-bottom-right {
  bottom: 20px;
  right: 0;
  border-radius: 18px 0 0 18px;
  padding-left: 8px;
  justify-content: flex-start;
}

/* Bottom-left: rounded end on right, sticks out rightward on hover */
.cv-widget-bottom-left {
  bottom: 20px;
  left: 0;
  border-radius: 0 18px 18px 0;
  padding-right: 8px;
  justify-content: flex-end;
}

/* Middle-left: rounded end on right, sticks out rightward on hover */
.cv-widget-middle-left {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  border-radius: 0 18px 18px 0;
  padding-right: 8px;
  justify-content: flex-end;
}

/* Middle-right: rounded end on left, sticks out leftward on hover */
.cv-widget-middle-right {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  border-radius: 18px 0 0 18px;
  padding-left: 8px;
  justify-content: flex-start;
}

.cv-widget-top-right,
.cv-widget-middle-right,
.cv-widget-bottom-right,
.cv-widget-top-left,
.cv-widget-middle-left,
.cv-widget-bottom-left {
  height: 36px;
  width: 36px;
}

.cv-widget-middle-right:hover,
.cv-widget-top-right:hover,
.cv-widget-bottom-right:hover,
.cv-widget-top-left:hover,
.cv-widget-middle-left:hover,
.cv-widget-bottom-left:hover {
  width: 55px;
}

/* Modal content styles */
.cv-widget-section {
  margin-bottom: 16px;
}

.cv-widget-section:last-child {
  margin-bottom: 0;
}

.cv-widget-section label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #555;
}

.cv-widget-profile-select,
.cv-widget-state-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.cv-widget-profile-select:focus,
.cv-widget-state-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.cv-widget-profile-select:disabled,
.cv-widget-state-select:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.cv-widget-current {
  margin: 16px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.cv-widget-current label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666;
  margin-bottom: 4px;
}

.cv-widget-current-view {
  font-weight: 500;
  color: #333;
}

.cv-widget-reset {
  width: 100%;
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.cv-widget-reset:hover {
  background: #c82333;
}

.cv-widget-reset:active {
  background: #bd2130;
}

/* Responsive design for mobile */
@media (max-width: 768px) {
  .cv-widget-top-right,
  .cv-widget-top-left {
    top: 10px;
  }

  .cv-widget-bottom-right,
  .cv-widget-bottom-left {
    bottom: 10px;
  }

  /* All widgets stay flush with screen edges */
  .cv-widget-top-right,
  .cv-widget-bottom-right,
  .cv-widget-middle-right {
    right: 0;
  }

  .cv-widget-top-left,
  .cv-widget-bottom-left,
  .cv-widget-middle-left {
    left: 0;
  }

  /* Slightly smaller on mobile */
  .cv-widget-icon {
    width: 60px;
    height: 32px;
  }

  .cv-widget-icon:hover {
    width: 75px;
  }
}

/* Modal styles */
.cv-widget-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10002;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.cv-widget-modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.2s ease;
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.cv-widget-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.cv-widget-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.cv-widget-modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #666;
}

.cv-widget-modal-close:hover {
  background: #e9ecef;
}

.cv-widget-modal-content {
  padding: 20px;
}

.cv-widget-modal-actions {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.cv-widget-restore {
  width: 100%;
  padding: 10px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.cv-widget-restore:hover {
  background: #218838;
}

.cv-widget-create-state {
  width: 100%;
  padding: 10px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}

.cv-widget-create-state:hover {
  background: #0056b3;
}

/* Dark theme modal styles */
.cv-widget-theme-dark .cv-widget-modal {
  background: #2d3748;
  color: #e2e8f0;
}

.cv-widget-theme-dark .cv-widget-modal-header {
  background: #1a202c;
  border-color: #4a5568;
}

.cv-widget-theme-dark .cv-widget-modal-header h3 {
  color: #e2e8f0;
}

.cv-widget-theme-dark .cv-widget-modal-close {
  color: #a0aec0;
}

.cv-widget-theme-dark .cv-widget-modal-close:hover {
  background: #4a5568;
}

.cv-widget-theme-dark .cv-widget-modal-actions {
  border-color: #4a5568;
}

/* Custom state creator styles */
.cv-custom-state-modal {
  max-width: 500px;
}

.cv-custom-state-form h4 {
  margin: 20px 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 5px;
}

.cv-custom-state-section {
  margin-bottom: 16px;
}

.cv-custom-state-section label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #555;
}

.cv-custom-state-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.cv-custom-state-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.cv-custom-toggles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.cv-custom-state-toggle {
  display: flex;
  align-items: center;
}

.cv-custom-state-toggle label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
  margin: 0;
}

.cv-custom-toggle-checkbox {
  margin-right: 8px;
  width: auto;
}

.cv-custom-state-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.cv-custom-state-cancel,
.cv-custom-state-copy-url {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.cv-custom-state-reset {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background: #dc3545;
  color: white;
}

.cv-custom-state-reset:hover {
  background: #c82333;
}

.cv-custom-state-cancel {
  background: #6c757d;
  color: white;
}

.cv-custom-state-cancel:hover {
  background: #5a6268;
}

.cv-custom-state-copy-url {
  background: #28a745;
  color: white;
}

.cv-custom-state-copy-url:hover {
  background: #218838;
}

/* Dark theme custom state styles */
.cv-widget-theme-dark .cv-custom-state-form h4 {
  color: #e2e8f0;
  border-color: #4a5568;
}

.cv-widget-theme-dark .cv-custom-state-section label {
  color: #a0aec0;
}

.cv-widget-theme-dark .cv-custom-state-input {
  background: #1a202c;
  border-color: #4a5568;
  color: #e2e8f0;
}

.cv-widget-theme-dark .cv-custom-state-actions {
  border-color: #4a5568;
}

/* Welcome modal styles */
.cv-welcome-modal {
  max-width: 500px;
}

.cv-welcome-content {
  text-align: center;
}

.cv-welcome-content p {
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 24px;
}

.cv-welcome-widget-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 24px;
}

.cv-welcome-widget-icon {
  width: 36px;
  height: 36px;
  background: white;
  color: black;
  border-radius: 0 18px 18px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cv-welcome-widget-label {
  font-size: 14px;
  color: #666;
  margin: 0;
  font-weight: 500;
}

.cv-welcome-got-it {
  width: 100%;
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.2s ease;
}

.cv-welcome-got-it:hover {
  background: #0056b3;
}

.cv-welcome-got-it:active {
  background: #004494;
}

/* Dark theme welcome modal styles */
.cv-widget-theme-dark .cv-welcome-content p {
  color: #cbd5e0;
}

.cv-widget-theme-dark .cv-welcome-widget-preview {
  background: #1a202c;
}

.cv-widget-theme-dark .cv-welcome-widget-label {
  color: #a0aec0;
}
`;
/**
 * Inject widget styles into the document head
 */
function injectWidgetStyles() {
    // Check if styles are already injected
    if (document.querySelector('#cv-widget-styles'))
        return;
    const style = document.createElement('style');
    style.id = 'cv-widget-styles';
    style.textContent = WIDGET_STYLES;
    document.head.appendChild(style);
}

class CustomViewsWidget {
    core;
    container;
    widgetIcon = null;
    options;
    // Modal state
    modal = null;
    constructor(options) {
        this.core = options.core;
        this.container = options.container || document.body;
        // Set defaults
        this.options = {
            core: options.core,
            container: this.container,
            position: options.position || 'middle-left',
            theme: options.theme || 'light',
            showReset: options.showReset ?? true,
            title: options.title || 'Custom Views',
            description: options.description || 'Toggle different content sections to customize your view. Changes are applied instantly and the URL will be updated for sharing.',
            showWelcome: options.showWelcome ?? false,
            welcomeTitle: options.welcomeTitle || 'Welcome to Custom Views!',
            welcomeMessage: options.welcomeMessage || 'This website uses Custom Views to let you personalize your experience. Use the widget on the side (⚙) to show or hide different content sections based on your preferences. Your selections will be saved and can be shared via URL.'
        };
        // No external state manager to initialize
    }
    /**
     * Render the widget
     */
    render() {
        this.widgetIcon = this.createWidgetIcon();
        this.attachEventListeners();
        // Always append to body since it's a floating icon
        document.body.appendChild(this.widgetIcon);
        // Show welcome modal on first visit if enabled
        if (this.options.showWelcome) {
            this.showWelcomeModalIfFirstVisit();
        }
        return this.widgetIcon;
    }
    /**
     * Create the simple widget icon
     */
    createWidgetIcon() {
        const icon = document.createElement('div');
        icon.className = `cv-widget-icon cv-widget-${this.options.position}`;
        icon.innerHTML = '⚙';
        icon.title = this.options.title;
        icon.setAttribute('aria-label', 'Open Custom Views');
        // Add styles
        injectWidgetStyles();
        return icon;
    }
    /**
     * Remove the widget from DOM
     */
    destroy() {
        if (this.widgetIcon) {
            this.widgetIcon.remove();
            this.widgetIcon = null;
        }
        // Clean up modal
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
    attachEventListeners() {
        if (!this.widgetIcon)
            return;
        // Click to open customization modal directly
        this.widgetIcon.addEventListener('click', () => this.openStateModal());
    }
    /**
     * Close the modal
     */
    closeModal() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
    /**
     * Open the custom state creator
     */
    openStateModal() {
        // Get toggles from current configuration and open the modal regardless of count
        const localConfig = this.core.getLocalConfig();
        const toggles = localConfig?.allToggles || [];
        this.createCustomStateModal(toggles);
    }
    /**
     * Create the custom state creator modal
     */
    createCustomStateModal(toggles) {
        // Close existing modal
        this.closeModal();
        this.modal = document.createElement('div');
        this.modal.className = 'cv-widget-modal-overlay';
        this.applyThemeToModal();
        const toggleControls = toggles.length
            ? toggles.map(toggle => `
        <div class="cv-custom-state-toggle">
          <label>
            <input type="checkbox" class="cv-custom-toggle-checkbox" data-toggle="${toggle}" />
            ${this.formatToggleName(toggle)}
          </label>
        </div>
      `).join('')
            : `<p class="cv-no-toggles">No configurable sections available.</p>`;
        this.modal.innerHTML = `
      <div class="cv-widget-modal cv-custom-state-modal">
        <div class="cv-widget-modal-header">
          <h3>Customize View</h3>
          <button class="cv-widget-modal-close" aria-label="Close modal">X</button>
        </div>
        <div class="cv-widget-modal-content">
          <div class="cv-custom-state-form">
            <p>${this.options.description}</p>
            
            <h4>Content Sections</h4>
            <div class="cv-custom-toggles">
              ${toggleControls}
            </div>
            
            <div class="cv-custom-state-actions">
              ${this.options.showReset ? `<button class="cv-custom-state-reset">Reset to Default</button>` : ''}
              <button class="cv-custom-state-copy-url">Copy Shareable URL</button>
            </div>
          </div>
        </div>
      </div>
    `;
        document.body.appendChild(this.modal);
        this.attachStateModalEventListeners();
        // Load current state into form if we're already in a custom state
        this.loadCurrentStateIntoForm();
    }
    /**
     * Attach event listeners for custom state creator
     */
    attachStateModalEventListeners() {
        if (!this.modal)
            return;
        // Close button
        const closeBtn = this.modal.querySelector('.cv-widget-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        // Copy URL button
        const copyUrlBtn = this.modal.querySelector('.cv-custom-state-copy-url');
        if (copyUrlBtn) {
            copyUrlBtn.addEventListener('click', () => {
                this.copyShareableURL();
            });
        }
        // Reset to default button
        const resetBtn = this.modal.querySelector('.cv-custom-state-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.core.resetToDefault();
                this.loadCurrentStateIntoForm();
            });
        }
        // Listen to toggle checkboxes
        const toggleCheckboxes = this.modal.querySelectorAll('.cv-custom-toggle-checkbox');
        toggleCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const state = this.getCurrentCustomStateFromModal();
                this.core.applyState(state);
            });
        });
        // Overlay click to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        // Escape key to close
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    /**
     * Apply theme class to the modal overlay based on options
     */
    applyThemeToModal() {
        if (!this.modal)
            return;
        if (this.options.theme === 'dark') {
            this.modal.classList.add('cv-widget-theme-dark');
        }
        else {
            this.modal.classList.remove('cv-widget-theme-dark');
        }
    }
    /**
     * Get current state from form values
     */
    getCurrentCustomStateFromModal() {
        if (!this.modal) {
            return { toggles: [] };
        }
        // Collect toggle values
        const toggles = [];
        const toggleCheckboxes = this.modal.querySelectorAll('.cv-custom-toggle-checkbox');
        toggleCheckboxes.forEach(checkbox => {
            const toggle = checkbox.dataset.toggle;
            if (toggle && checkbox.checked) {
                toggles.push(toggle);
            }
        });
        return { toggles };
    }
    /**
     * Copy shareable URL to clipboard
     */
    copyShareableURL() {
        const customState = this.getCurrentCustomStateFromModal();
        const url = URLStateManager.generateShareableURL(customState);
        navigator.clipboard.writeText(url).then(() => {
            console.log('Shareable URL copied to clipboard!');
        }).catch(() => { console.error('Failed to copy URL!'); });
    }
    /**
     * Load current state into form based on currently active toggles
     */
    loadCurrentStateIntoForm() {
        if (!this.modal)
            return;
        // Get currently active toggles (from custom state or default configuration)
        const activeToggles = this.core.getCurrentActiveToggles();
        // First, uncheck all checkboxes
        const allCheckboxes = this.modal.querySelectorAll('.cv-custom-toggle-checkbox');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.disabled = false;
            checkbox.parentElement?.removeAttribute('aria-hidden');
        });
        // Then check the ones that should be active
        activeToggles.forEach(toggle => {
            const checkbox = this.modal?.querySelector(`[data-toggle="${toggle}"]`);
            if (checkbox) {
                if (!checkbox.disabled) {
                    checkbox.checked = true;
                }
            }
        });
    }
    /**
     * Format toggle name for display
     */
    formatToggleName(toggle) {
        return toggle.charAt(0).toUpperCase() + toggle.slice(1);
    }
    /**
     * Check if this is the first visit and show welcome modal
     */
    showWelcomeModalIfFirstVisit() {
        const STORAGE_KEY = 'cv-welcome-shown';
        // Check if welcome has been shown before
        const hasSeenWelcome = localStorage.getItem(STORAGE_KEY);
        if (!hasSeenWelcome) {
            // Show welcome modal after a short delay to let the page settle
            setTimeout(() => {
                this.createWelcomeModal();
            }, 500);
            // Mark as shown
            localStorage.setItem(STORAGE_KEY, 'true');
        }
    }
    /**
     * Create and show the welcome modal
     */
    createWelcomeModal() {
        // Don't show if there's already a modal open
        if (this.modal)
            return;
        this.modal = document.createElement('div');
        this.modal.className = 'cv-widget-modal-overlay cv-welcome-modal-overlay';
        this.applyThemeToModal();
        this.modal.innerHTML = `
      <div class="cv-widget-modal cv-welcome-modal">
        <div class="cv-widget-modal-header">
          <h3>${this.options.welcomeTitle}</h3>
          <button class="cv-widget-modal-close" aria-label="Close modal">×</button>
        </div>
        <div class="cv-widget-modal-content">
          <div class="cv-welcome-content">
            <p>${this.options.welcomeMessage}</p>
            
            <div class="cv-welcome-widget-preview">
              <div class="cv-welcome-widget-icon">⚙</div>
              <p class="cv-welcome-widget-label">Look for this widget on the side of the screen</p>
            </div>
            
            <button class="cv-welcome-got-it">Got it!</button>
          </div>
        </div>
      </div>
    `;
        document.body.appendChild(this.modal);
        this.attachWelcomeModalEventListeners();
    }
    /**
     * Attach event listeners for welcome modal
     */
    attachWelcomeModalEventListeners() {
        if (!this.modal)
            return;
        // Close button
        const closeBtn = this.modal.querySelector('.cv-widget-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        // Got it button
        const gotItBtn = this.modal.querySelector('.cv-welcome-got-it');
        if (gotItBtn) {
            gotItBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        // Overlay click to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        // Escape key to close
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
}

class CustomViews {
    // Entry Point to use CustomViews
    static async initFromJson(opts) {
        // Load assets JSON if provided
        let assetsManager;
        if (opts.assetsJsonPath) {
            const assetsJson = await (await fetch(opts.assetsJsonPath)).json();
            assetsManager = new AssetsManager(assetsJson);
        }
        else {
            assetsManager = new AssetsManager({});
        }
        // Load config JSON if provided, else just log error and don't load the custom views
        let localConfig;
        if (opts.config) {
            localConfig = opts.config;
        }
        else {
            if (!opts.configPath) {
                console.error("No config path provided, skipping custom views");
                return null;
            }
            try {
                localConfig = await (await fetch(opts.configPath)).json();
            }
            catch (error) {
                console.error("Error loading config:", error);
                return null;
            }
        }
        const coreOptions = {
            assetsManager,
            config: localConfig,
            rootEl: opts.rootEl,
        };
        const core = new CustomViewsCore(coreOptions);
        core.init();
        return core;
    }
}
if (typeof window !== "undefined") {
    // @ts-ignore
    window.CustomViews = CustomViews;
    // @ts-ignore
    window.CustomViewsWidget = CustomViewsWidget;
}

export { AssetsManager, CustomViews, CustomViewsCore, CustomViewsWidget, Config as LocalConfig, PersistenceManager, URLStateManager };
//# sourceMappingURL=custom-views.esm.js.map
