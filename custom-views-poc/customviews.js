// Url -> Determines JSON file
// JSON file -> determines views, asset-urls, etc. Configs
// Configs -> Does dynamic loading of page



class CustomViews {
  constructor(configUrl = "views.json") {
    this.currentUrl = window.location.href;
    this.configUrl = configUrl;
    this.config = null;
    this.currentView = null;
    this.rootEl = document.getElementById("view-container");
  }

  /**
   * Initialize the CustomViews system
   */
  async init() {
    console.log("[CustomViews] Initializing...");
    this.logCurrentUrl();

    // Load master config
    await this.loadConfig();

    // Determine and render initial view
    this.renderFromUrl();

    // Watch for URL changes
    this.listenForUrlChanges();
  }

  /**
   * Fetches config.json
   */
  async loadConfig() {
    try {
      const res = await fetch(this.configUrl);
      this.config = await res.json();
      console.log("[CustomViews] Config loaded:", this.config);
    } catch (err) {
      console.error("[CustomViews] Failed to load config:", err);
    }
  }

  /**
   * Logs the current URL
   */
  logCurrentUrl() {
    console.log("[CustomViews] Current URL:", this.currentUrl);
  }

  /**
   * Renders view based on URL param (?view=...)
   */
  renderFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const viewId = urlParams.get("view") || this.config.defaultView;

    console.log("[CustomViews] Rendering view:", viewId);
    this.renderView(viewId);
  }


 /**
   * Render a specific view by ID
   */
  renderView(viewId) {
    if (!this.config || !this.config.views[viewId]) {
      console.warn("[CustomViews] View not found:", viewId);
      return;
    }

    this.currentView = this.config.views[viewId];

    // Clear container first
    this.rootEl.innerHTML = "";

    // Render assets
    this.currentView.assets.forEach(asset => {
      if (asset.type === "image") {
        const img = document.createElement("img");
        img.src = asset.src;
        img.alt = this.currentView.title || "Custom View Image";
        this.rootEl.appendChild(img);
      }

      // Later: add support for video, script, css, etc.
    });
  }

  /**
   * Sets up a listener for URL changes (hash or query params)
   */
  listenForUrlChanges() {
    window.addEventListener("popstate", () => {
      this.currentUrl = window.location.href;
      console.log("[CustomViews] URL changed:", this.currentUrl);
      this.renderFromUrl();
    });
  }
}

// Export as a global variable (browser-friendly)
window.customViews = CustomViews;

