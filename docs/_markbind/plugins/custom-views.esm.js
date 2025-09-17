/*!
 * custom-views v0.1.1
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
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    el.appendChild(img);
}
function renderText(el, asset) {
    if (asset.content != null) {
        el.textContent = asset.content;
    }
}
function renderHtml(el, asset) {
    if (asset.content != null) {
        el.innerHTML = asset.content;
    }
}
/** --- Unified asset renderer --- */
function renderAssetInto(el, assetId, assetsManager) {
    const asset = assetsManager.get(assetId);
    if (!asset)
        return;
    switch (asset.type) {
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
            console.warn('[CustomViews] Unknown asset type:', asset.type);
    }
}

/**
 * A LocalConfig defines a profile (ViewScope) for a viewer.
 * - `modifiablePlaceholderAssets` determines which assets can be swapped into visible placeholders.
 * - `allowedToggles` determines which toggle categories are visible.
 * - `states` contains predefined views for the profile.
 * - `defaultState` is the state initially shown.
 */
class LocalConfig {
    id;
    /** Assets that can be assigned to each visible placeholder */
    modifiablePlaceholderAssets;
    /** Toggles visible to the viewer */
    allowedToggles;
    /** Predefined states (snapshots of placeholder values + toggles) */
    states;
    /** Default state to render on load */
    defaultState;
    constructor(opts) {
        this.id = opts.id;
        this.modifiablePlaceholderAssets = opts.modifiablePlaceholderAssets;
        this.allowedToggles = opts.allowedToggles;
        this.states = opts.states;
        this.defaultState = opts.defaultState;
    }
}

/**
 * Manages persistence of custom views state using browser localStorage
 */
class PersistenceManager {
    // Storage keys for localStorage
    static STORAGE_KEYS = {
        PROFILE: 'customviews-profile',
        STATE: 'customviews-state',
        CUSTOM_STATE: 'customviews-custom-state'
    };
    /**
     * Check if localStorage is available in the current environment
     */
    isStorageAvailable() {
        return typeof window !== 'undefined' && window.localStorage !== undefined;
    }
    // === PROFILE PERSISTENCE ===
    /**
     * Persists the current profile to localStorage
     */
    persistProfile(profile) {
        if (!this.isStorageAvailable())
            return;
        if (profile) {
            localStorage.setItem(PersistenceManager.STORAGE_KEYS.PROFILE, profile);
        }
        else {
            localStorage.removeItem(PersistenceManager.STORAGE_KEYS.PROFILE);
        }
    }
    /**
     * Retrieves the persisted profile from localStorage
     */
    getPersistedProfile() {
        if (!this.isStorageAvailable())
            return null;
        return localStorage.getItem(PersistenceManager.STORAGE_KEYS.PROFILE);
    }
    // === STATE PERSISTENCE ===
    /**
     * Persists the current state to localStorage
     */
    persistState(state) {
        if (!this.isStorageAvailable())
            return;
        if (state) {
            localStorage.setItem(PersistenceManager.STORAGE_KEYS.STATE, state);
        }
        else {
            localStorage.removeItem(PersistenceManager.STORAGE_KEYS.STATE);
        }
    }
    /**
     * Retrieves the persisted state from localStorage
     */
    getPersistedState() {
        if (!this.isStorageAvailable())
            return null;
        return localStorage.getItem(PersistenceManager.STORAGE_KEYS.STATE);
    }
    // === CUSTOM STATE PERSISTENCE ===
    /**
     * Persists a custom state configuration to localStorage
     * @param customState - The custom state configuration to persist
     */
    persistCustomState(customState) {
        if (!this.isStorageAvailable())
            return;
        try {
            const serialized = JSON.stringify(customState);
            localStorage.setItem(PersistenceManager.STORAGE_KEYS.CUSTOM_STATE, serialized);
        }
        catch (error) {
            console.warn('Failed to persist custom state:', error);
        }
    }
    /**
     * Retrieves a custom state configuration from localStorage
     */
    getPersistedCustomState() {
        if (!this.isStorageAvailable())
            return null;
        try {
            const stored = localStorage.getItem(PersistenceManager.STORAGE_KEYS.CUSTOM_STATE);
            if (stored) {
                return JSON.parse(stored);
            }
        }
        catch (error) {
            console.warn('Failed to parse persisted custom state:', error);
        }
        return null;
    }
    // === UTILITY METHODS ===
    /**
     * Get both persisted profile and state in one call
     */
    getPersistedView() {
        return {
            profile: this.getPersistedProfile(),
            state: this.getPersistedState()
        };
    }
    /**
     * Persist both profile and state in one call
     */
    persistView(profile, state) {
        this.persistProfile(profile);
        this.persistState(state);
    }
    /**
     * Clear all persisted data and reset to defaults
     */
    clearAll() {
        if (!this.isStorageAvailable())
            return;
        localStorage.removeItem(PersistenceManager.STORAGE_KEYS.PROFILE);
        localStorage.removeItem(PersistenceManager.STORAGE_KEYS.STATE);
        localStorage.removeItem(PersistenceManager.STORAGE_KEYS.CUSTOM_STATE);
    }
    /**
     * Check if any persistence data exists
     */
    hasPersistedData() {
        if (!this.isStorageAvailable())
            return false;
        return !!(this.getPersistedProfile() ||
            this.getPersistedState() ||
            this.getPersistedCustomState());
    }
    /**
     * Get all storage keys used by CustomViews (useful for debugging)
     */
    getStorageKeys() {
        return PersistenceManager.STORAGE_KEYS;
    }
    /**
     * Debug method to log current persistence state
     */
    debugLog() {
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

class CustomViewsCore {
    rootEl;
    assetsManager;
    persistenceManager;
    localConfigPaths;
    defaultState;
    onViewChange;
    profileFromUrl = null;
    stateIdFromUrl = null;
    localConfig = null;
    // Event listeners for state changes
    stateChangeListeners = [];
    constructor(options) {
        this.assetsManager = options.assetsManager;
        this.localConfigPaths = options.localConfigPaths;
        this.defaultState = options.defaultState;
        this.rootEl = options.rootEl || document.body;
        this.onViewChange = options.onViewChange;
        this.persistenceManager = new PersistenceManager();
    }
    /** Initialize: render default or URL-specified state */
    async init() {
        console.log("CustomViewsCore init");
        this.renderFromUrl();
        window.addEventListener("popstate", () => {
            this.renderFromUrl();
        });
    }
    async renderFromUrl() {
        this.parseUrlForProfileState();
        // Get persisted view for fallback
        const persistedView = this.persistenceManager.getPersistedView();
        // Determine if URL params are present
        const hasUrlProfile = this.profileFromUrl !== null;
        const hasUrlState = this.stateIdFromUrl !== null;
        // Use URL params if available, otherwise use persistence
        if (!hasUrlProfile && persistedView.profile) {
            this.profileFromUrl = persistedView.profile;
        }
        if (!hasUrlState && persistedView.state) {
            this.stateIdFromUrl = persistedView.state;
        }
        // If URL params are present, persist them (URL takes precedence and should be saved)
        if (hasUrlProfile || hasUrlState) {
            this.persistenceManager.persistView(this.profileFromUrl, this.stateIdFromUrl);
        }
        if (this.profileFromUrl) {
            const localConfig = await this.loadLocalConfig(this.profileFromUrl);
            this.localConfig = localConfig;
        }
        if (this.localConfig) {
            this.renderLocalConfigState(this.stateIdFromUrl, this.localConfig);
        }
        else {
            this.renderState(this.defaultState);
        }
    }
    /**
     * Retrieves profile and state if any, based on the current URL's query string.
     */
    parseUrlForProfileState() {
        // Just the query string part of the URL (everything after ? but before #).
        // Can .get("param"), .has, .set(), .append()
        const urlParams = new URLSearchParams(window.location.search);
        this.profileFromUrl = urlParams.get("profile") || null;
        this.stateIdFromUrl = urlParams.get("state") || null;
        if (this.profileFromUrl &&
            this.localConfigPaths &&
            !(this.profileFromUrl in this.localConfigPaths)) {
            console.warn("Profile in URL not recognized");
            this.profileFromUrl = null;
            this.stateIdFromUrl = null;
        }
        // ToDo: Later extension: Custom State
    }
    /**
     * Loads the local configuration for a given profile ID.
     *
     * This method attempts to fetch and parse a local configuration file
     * based on the provided `profileId`. If the profile ID is invalid,
     * missing, or not present in `localConfigPaths`, the method logs a warning
     * and returns `false`. If the configuration file is successfully fetched
     * and parsed, it initializes `this.localConfig` with the parsed data and
     * returns `true`. On failure, it logs the error, sets `this.localConfig`
     * to `null`, and returns `false`.
     *
     * @param profileId - The identifier for the profile whose local configuration should be loaded.
     * @returns A promise that resolves to `true` if the configuration was loaded successfully, or `false` otherwise.
     */
    async loadLocalConfig(profileId) {
        // Load local config based on profileId
        if (!profileId || !this.localConfigPaths ||
            (!(profileId in this.localConfigPaths))) {
            console.warn("Local Config Paths or Profile not present");
            return null;
        }
        const localConfigPath = this.localConfigPaths[profileId];
        if (!localConfigPath) {
            return null;
        }
        try {
            const response = await fetch(localConfigPath);
            const configJson = await response.json();
            const config = new LocalConfig(configJson);
            return config;
        }
        catch (err) {
            console.warn("Failed to load local config:", err);
            return null;
        }
    }
    async renderLocalConfigState(stateId, localConfig) {
        if (!stateId) {
            stateId = localConfig.defaultState;
        }
        // load state
        const state = localConfig.states[stateId];
        if (!state) {
            console.warn("State ID not found in local config, rendering default state");
            await this.renderState(this.defaultState);
        }
        else {
            await this.renderState(state);
        }
    }
    /** Render all placeholders and toggles for the current state */
    renderState(state) {
        if (!state)
            return;
        const placeholders = state.placeholders || {};
        const toggles = state.toggles || [];
        // Toggles hide or show relevant toggles
        this.rootEl.querySelectorAll("[data-customviews-toggle]").forEach(el => {
            const category = el.dataset.customviewsToggle;
            if (!category || !toggles.includes(category)) {
                el.setAttribute("hidden", "");
            }
            else {
                el.removeAttribute("hidden");
            }
        });
        // Render toggles
        for (const category of toggles) {
            this.rootEl.querySelectorAll(`[data-customviews-toggle="${category}"]`).forEach(el => {
                // if it has an id, then we render the asset into it
                // if it has no id, then we assume it's a container and just show it
                const toggleId = el.dataset.customviewsId;
                if (!toggleId) {
                    // If no ID is present, we can assume it's a container and just show it
                    el.classList.remove("hidden");
                }
                else {
                    renderAssetInto(el, toggleId, this.assetsManager);
                }
            });
        }
        // Placeholders
        // In the html, there can be two types of placeholders:
        // Just has the key,
        // Has both key and id (container, asset stored directly in html)
        this.rootEl.querySelectorAll("[data-customviews-placeholder]").forEach(el => {
            const key = el.dataset.customviewsPlaceholder;
            // if no key, skip
            if (!key)
                return;
            // check in the state, what is the mapping for the placeholder key
            const assetId = placeholders[key];
            if (!assetId) {
                // If no assetId is mapped for this placeholder key, hide the element
                el.setAttribute("hidden", "");
                return;
            }
            // check if there is a customviewsId
            const placeholderId = el.dataset.customviewsId;
            if (placeholderId) {
                // check if placeholderId matches assetId, if it is then we should show it.
                if (placeholderId === assetId) {
                    el.removeAttribute("hidden");
                }
                else {
                    el.setAttribute("hidden", "");
                }
            }
            else {
                // if not placeholderId, it means it is positional, so we render the asset into it
                renderAssetInto(el, assetId, this.assetsManager);
            }
        });
        // Notify consumer of state change
        if (typeof this.onViewChange === "function") {
            if (this.stateIdFromUrl) {
                this.onViewChange(this.stateIdFromUrl, state);
            }
            else {
                this.onViewChange("default state", state);
            }
        }
        // Notify state change listeners (like widgets)
        this.notifyStateChangeListeners();
    }
    // === PUBLIC API METHODS ===
    /**
     * Programmatically switch to a different profile and state
     */
    async switchToProfile(profileId, stateId) {
        if (!this.localConfigPaths || !(profileId in this.localConfigPaths)) {
            console.warn('Profile not found:', profileId);
            return;
        }
        this.profileFromUrl = profileId;
        this.stateIdFromUrl = stateId || null;
        // Persist the selection
        this.persistenceManager.persistView(profileId, stateId || null);
        // Load and render
        const localConfig = await this.loadLocalConfig(profileId);
        this.localConfig = localConfig;
        if (this.localConfig) {
            this.renderLocalConfigState(this.stateIdFromUrl, this.localConfig);
        }
        // Update URL without triggering navigation
        this.updateUrlWithoutNavigation(profileId, stateId || null);
    }
    /**
     * Switch to a specific state within the current profile
     */
    switchToState(stateId) {
        if (!this.localConfig) {
            console.warn('No profile loaded, cannot switch state');
            return;
        }
        if (!(stateId in this.localConfig.states)) {
            console.warn('State not found in current profile:', stateId);
            return;
        }
        this.stateIdFromUrl = stateId;
        this.persistenceManager.persistState(stateId);
        this.renderLocalConfigState(stateId, this.localConfig);
        this.updateUrlWithoutNavigation(this.profileFromUrl, stateId);
    }
    /**
     * Get available profiles
     */
    getAvailableProfiles() {
        return this.localConfigPaths ? Object.keys(this.localConfigPaths) : [];
    }
    /**
     * Get available states for current profile
     */
    getAvailableStates() {
        return this.localConfig ? Object.keys(this.localConfig.states) : [];
    }
    /**
     * Get current profile and state
     */
    getCurrentView() {
        return {
            profile: this.profileFromUrl,
            state: this.stateIdFromUrl
        };
    }
    /**
     * Clear all persistence and reset to default
     */
    clearPersistence() {
        this.persistenceManager.clearAll();
        this.profileFromUrl = null;
        this.stateIdFromUrl = null;
        this.localConfig = null;
        this.renderState(this.defaultState);
        this.updateUrlWithoutNavigation(null, null);
    }
    /**
     * Get the persistence manager instance for advanced operations
     */
    getPersistenceManager() {
        return this.persistenceManager;
    }
    /**
     * Check if any persistence data exists
     */
    hasPersistedData() {
        return this.persistenceManager.hasPersistedData();
    }
    /**
     * Get the currently persisted view without changing the current state
     */
    getPersistedView() {
        return this.persistenceManager.getPersistedView();
    }
    /**
     * Update URL without triggering navigation
     */
    updateUrlWithoutNavigation(profile, state) {
        if (typeof window !== 'undefined' && window.history) {
            const url = new URL(window.location.href);
            if (profile) {
                url.searchParams.set('profile', profile);
            }
            else {
                url.searchParams.delete('profile');
            }
            if (state) {
                url.searchParams.set('state', state);
            }
            else {
                url.searchParams.delete('state');
            }
            window.history.replaceState({}, '', url.toString());
        }
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
    validate() {
        // optional: check each asset has type, id, etc.
        return Object.values(this.assets).every(a => a.type);
    }
}

class CustomViewsWidget {
    core;
    container;
    widgetElement = null;
    options;
    stateChangeListener = null;
    constructor(options) {
        this.core = options.core;
        this.container = options.container || document.body;
        // Set defaults
        this.options = {
            core: options.core,
            container: this.container,
            position: options.position || 'top-right',
            theme: options.theme || 'auto',
            showProfiles: options.showProfiles ?? true,
            showStates: options.showStates ?? true,
            showReset: options.showReset ?? true,
            customClasses: options.customClasses || [],
            title: options.title || 'Custom Views'
        };
    }
    /**
     * Render the widget
     */
    render() {
        this.widgetElement = this.createWidgetElement();
        this.attachEventListeners();
        this.setupStateChangeListener();
        if (this.options.position === 'inline') {
            this.container.appendChild(this.widgetElement);
        }
        else {
            // For positioned widgets, append to body and position absolutely
            document.body.appendChild(this.widgetElement);
        }
        this.updateWidgetState();
        return this.widgetElement;
    }
    /**
     * Update widget to reflect current state
     */
    updateWidgetState() {
        if (!this.widgetElement)
            return;
        const currentView = this.core.getCurrentView();
        const availableProfiles = this.core.getAvailableProfiles();
        const availableStates = this.core.getAvailableStates();
        // Update profile selector
        const profileSelect = this.widgetElement.querySelector('.cv-widget-profile-select');
        if (profileSelect) {
            profileSelect.innerHTML = '<option value="">Default</option>';
            availableProfiles.forEach(profile => {
                const option = document.createElement('option');
                option.value = profile;
                option.textContent = this.formatProfileName(profile);
                option.selected = profile === currentView.profile;
                profileSelect.appendChild(option);
            });
        }
        // Update state selector
        const stateSelect = this.widgetElement.querySelector('.cv-widget-state-select');
        if (stateSelect) {
            stateSelect.innerHTML = '<option value="">Default</option>';
            availableStates.forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = this.formatStateName(state);
                option.selected = state === currentView.state;
                stateSelect.appendChild(option);
            });
            // Disable state selector if no profile is selected
            stateSelect.disabled = !currentView.profile;
        }
        // Update current view display
        const currentViewDisplay = this.widgetElement.querySelector('.cv-widget-current-view');
        if (currentViewDisplay) {
            const profileText = currentView.profile ? this.formatProfileName(currentView.profile) : 'Default';
            const stateText = currentView.state ? this.formatStateName(currentView.state) : 'Default';
            currentViewDisplay.textContent = `${profileText} → ${stateText}`;
        }
    }
    /**
     * Remove the widget from DOM
     */
    destroy() {
        // Remove state change listener
        if (this.stateChangeListener) {
            this.core.removeStateChangeListener(this.stateChangeListener);
            this.stateChangeListener = null;
        }
        if (this.widgetElement) {
            this.widgetElement.remove();
            this.widgetElement = null;
        }
    }
    /**
     * Toggle widget visibility
     */
    toggle() {
        if (!this.widgetElement)
            return;
        const content = this.widgetElement.querySelector('.cv-widget-content');
        if (content) {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            const toggleBtn = this.widgetElement.querySelector('.cv-widget-toggle');
            if (toggleBtn) {
                toggleBtn.textContent = isHidden ? '−' : '+';
                toggleBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
            }
        }
    }
    createWidgetElement() {
        const widget = document.createElement('div');
        widget.className = this.getWidgetClasses().join(' ');
        widget.innerHTML = `
      <div class="cv-widget-header">
        <span class="cv-widget-title">${this.options.title}</span>
        <button class="cv-widget-toggle" aria-label="Toggle widget" aria-expanded="true">−</button>
      </div>
      <div class="cv-widget-content">
        ${this.options.showProfiles ? this.createProfileSelector() : ''}
        ${this.options.showStates ? this.createStateSelector() : ''}
        <div class="cv-widget-current">
          <label>Current View:</label>
          <div class="cv-widget-current-view">Default → Default</div>
        </div>
        ${this.options.showReset ? '<button class="cv-widget-reset">Reset to Default</button>' : ''}
      </div>
    `;
        // Add styles
        this.injectStyles();
        return widget;
    }
    createProfileSelector() {
        return `
      <div class="cv-widget-section">
        <label for="cv-profile-select">Profile:</label>
        <select id="cv-profile-select" class="cv-widget-profile-select">
          <option value="">Default</option>
        </select>
      </div>
    `;
    }
    createStateSelector() {
        return `
      <div class="cv-widget-section">
        <label for="cv-state-select">State:</label>
        <select id="cv-state-select" class="cv-widget-state-select">
          <option value="">Default</option>
        </select>
      </div>
    `;
    }
    getWidgetClasses() {
        const classes = [
            'cv-widget',
            `cv-widget-${this.options.position}`,
            `cv-widget-theme-${this.options.theme}`,
            ...this.options.customClasses
        ];
        return classes;
    }
    attachEventListeners() {
        if (!this.widgetElement)
            return;
        // Toggle button
        const toggleBtn = this.widgetElement.querySelector('.cv-widget-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
        // Profile selector
        const profileSelect = this.widgetElement.querySelector('.cv-widget-profile-select');
        if (profileSelect) {
            profileSelect.addEventListener('change', async (e) => {
                const target = e.target;
                const profileId = target.value;
                if (profileId) {
                    await this.core.switchToProfile(profileId);
                }
                else {
                    this.core.clearPersistence();
                }
                // Widget will update automatically via state change listener
            });
        }
        // State selector
        const stateSelect = this.widgetElement.querySelector('.cv-widget-state-select');
        if (stateSelect) {
            stateSelect.addEventListener('change', (e) => {
                const target = e.target;
                const stateId = target.value;
                if (stateId) {
                    this.core.switchToState(stateId);
                }
                // Widget will update automatically via state change listener
            });
        }
        // Reset button
        const resetBtn = this.widgetElement.querySelector('.cv-widget-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.core.clearPersistence();
                // Widget will update automatically via state change listener
            });
        }
    }
    /**
     * Setup listener for state changes from the core
     */
    setupStateChangeListener() {
        this.stateChangeListener = () => {
            this.updateWidgetState();
        };
        this.core.addStateChangeListener(this.stateChangeListener);
    }
    formatProfileName(profile) {
        // Convert camelCase or snake_case to Title Case
        return profile
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^\w/, c => c.toUpperCase())
            .trim();
    }
    formatStateName(state) {
        // Convert camelCase or snake_case to Title Case
        return state
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^\w/, c => c.toUpperCase())
            .trim();
    }
    injectStyles() {
        // Check if styles are already injected
        if (document.querySelector('#cv-widget-styles'))
            return;
        const style = document.createElement('style');
        style.id = 'cv-widget-styles';
        style.textContent = `
      .cv-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        min-width: 250px;
        max-width: 300px;
      }

      .cv-widget-top-right {
        position: fixed;
        top: 20px;
        right: 20px;
      }

      .cv-widget-top-left {
        position: fixed;
        top: 20px;
        left: 20px;
      }

      .cv-widget-bottom-right {
        position: fixed;
        bottom: 20px;
        right: 20px;
      }

      .cv-widget-bottom-left {
        position: fixed;
        bottom: 20px;
        left: 20px;
      }

      .cv-widget-inline {
        position: relative;
        margin: 16px 0;
      }

      .cv-widget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        border-radius: 8px 8px 0 0;
      }

      .cv-widget-title {
        font-weight: 600;
        color: #333;
      }

      .cv-widget-toggle {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        color: #666;
      }

      .cv-widget-toggle:hover {
        background: #e9ecef;
      }

      .cv-widget-content {
        padding: 16px;
      }

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

      /* Dark theme */
      .cv-widget-theme-dark {
        background: #2d3748;
        border-color: #4a5568;
        color: #e2e8f0;
      }

      .cv-widget-theme-dark .cv-widget-header {
        background: #1a202c;
        border-color: #4a5568;
      }

      .cv-widget-theme-dark .cv-widget-title {
        color: #e2e8f0;
      }

      .cv-widget-theme-dark .cv-widget-toggle {
        color: #a0aec0;
      }

      .cv-widget-theme-dark .cv-widget-toggle:hover {
        background: #4a5568;
      }

      .cv-widget-theme-dark .cv-widget-profile-select,
      .cv-widget-theme-dark .cv-widget-state-select {
        background: #1a202c;
        border-color: #4a5568;
        color: #e2e8f0;
      }

      .cv-widget-theme-dark .cv-widget-current {
        background: #1a202c;
        border-color: #3182ce;
      }

      /* Auto theme - uses system preference */
      @media (prefers-color-scheme: dark) {
        .cv-widget-theme-auto {
          background: #2d3748;
          border-color: #4a5568;
          color: #e2e8f0;
        }

        .cv-widget-theme-auto .cv-widget-header {
          background: #1a202c;
          border-color: #4a5568;
        }

        .cv-widget-theme-auto .cv-widget-title {
          color: #e2e8f0;
        }

        .cv-widget-theme-auto .cv-widget-toggle {
          color: #a0aec0;
        }

        .cv-widget-theme-auto .cv-widget-toggle:hover {
          background: #4a5568;
        }

        .cv-widget-theme-auto .cv-widget-profile-select,
        .cv-widget-theme-auto .cv-widget-state-select {
          background: #1a202c;
          border-color: #4a5568;
          color: #e2e8f0;
        }

        .cv-widget-theme-auto .cv-widget-current {
          background: #1a202c;
          border-color: #3182ce;
        }
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .cv-widget-top-right,
        .cv-widget-top-left {
          top: 10px;
        }

        .cv-widget-top-right,
        .cv-widget-bottom-right {
          right: 10px;
        }

        .cv-widget-top-left,
        .cv-widget-bottom-left {
          left: 10px;
        }

        .cv-widget-bottom-right,
        .cv-widget-bottom-left {
          bottom: 10px;
        }

        .cv-widget {
          min-width: 200px;
          max-width: calc(100vw - 20px);
        }
      }
    `;
        document.head.appendChild(style);
    }
}

class CustomViews {
    // Entry Point to use CustomViews
    static async initFromJson(opts) {
        // Load assets JSON
        const assetsJson = await (await fetch(opts.assetsJsonPath)).json();
        const assetsManager = new AssetsManager(assetsJson);
        // Load Default State
        const defaultState = await (await fetch(opts.defaultStateJsonPath)).json();
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
    // @ts-ignore
    window.CustomViewsWidget = CustomViewsWidget;
    // @ts-ignore
    window.PersistenceManager = PersistenceManager;
}

export { CustomViews, CustomViewsWidget, PersistenceManager };
//# sourceMappingURL=custom-views.esm.js.map
