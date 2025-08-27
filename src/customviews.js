import renderers from "./renderer/index.js";

class CustomViews {
  /**
   * @param {Object} options - Configuration options
   * @param {string} options.configUrl - Path to the JSON config (default: master.json)
   * @param {HTMLElement} options.rootEl - Root element where views will be rendered
   * @param {Function} options.onViewChange - Optional callback triggered when view changes
   */
  constructor(options = {}) {
    this.configUrl = options.configUrl || 'master.json';
    this.rootEl = options.rootEl || document.getElementById('view-container') || document.body;
    this.config = null;
    this.currentStateId = null;
    this.currentState = null;
    this.onViewChange = options.onViewChange || null;
  }

  /**
   * Inits: Loads config json, render initial state and listen for URL change
   */
  async init() {
    await this.loadConfig();
    this.renderFromUrl();
    this.listenForUrlChanges();
  }

  /**
   * Load the JSON config file from configUrl, stores in this.config
   */
  async loadConfig() {
    try {
      const res = await fetch(this.configUrl);
      this.config = await res.json();
      if (!this.config.states) throw new Error('Invalid config: missing states');
      console.log("Config Loaded!");
      console.log(this.config);
    } catch (err) {
      console.error('[CustomViews] Failed to load config:', err);
    }
  }

  /**
   * Determine which state to render based on ?state= param in the URL
   */
  renderFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const stateId = urlParams.get('state') || this.config?.defaultState || Object.keys(this.config.states)[0];
    this.selectState(stateId);
  }

  /**
   * Change the active state
   * @param {string} stateId - ID of the state (must exist in config.states)
   */
  selectState(stateId) {
    if (!this.config || !this.config.states[stateId]) {
      console.warn('[CustomViews] State not found:', stateId);
      return;
    }
    this.currentStateId = stateId;
    this.currentState = this.config.states[stateId];

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('state', stateId);
    window.history.pushState({}, '', url);

    this.renderState();
    if (typeof this.onViewChange === 'function') {
      this.onViewChange(stateId, this.currentState);
    }
  }

  /**
   * Render the current state: Update placeholder and toggle elements
   */
  renderState() {
    if (!this.currentState) return;

    // Placeholders
    Object.entries(this.currentState.placeholders || {}).forEach(([key, value]) => {
      const els = document.querySelectorAll(`[data-customviews-placeholder="${key}"]`);
      els.forEach(el => renderers.placeholder(el, { key, value }, this.config));
    });

    // Toggles
    // Hide all toggles by default
    document.querySelectorAll('[data-customviews-toggle]').forEach(el => {
      const category = el.getAttribute('data-customviews-toggle');
      if ((this.currentState.toggles || []).includes(category)) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });

    // Add Toggles not present
    (this.currentState.toggles || []).forEach(toggleCategory => {
      const els = document.querySelectorAll(`[data-customviews-toggle="${toggleCategory}"]`);
      els.forEach((el, idx) => {
        const toggleId = el.getAttribute('data-customviews-id');
        // Pass both category and id to the renderer
        renderers.toggle(el, toggleCategory, toggleId, this.config, idx);
      });
    });

    console.log("State Rendered!");
  }

  /**
   * Handle browser back/forward navigation
   */
  listenForUrlChanges() {
    window.addEventListener('popstate', () => {
      this.renderFromUrl();
    });
  }
}

// Export for ESM + CommonJS
export default CustomViews;
export { CustomViews };
