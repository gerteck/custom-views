class CustomViews {
  constructor() {
    this.currentUrl = window.location.href;
  }

  /**
   * Initialize the CustomViews system
   */
  init() {
    console.log("[CustomViews] Initializing...");
    this.logCurrentUrl();
    this.listenForUrlChanges();
  }

  /**
   * Logs the current URL
   */
  logCurrentUrl() {
    console.log("[CustomViews] Current URL:", this.currentUrl);
  }

  /**
   * Sets up a listener for URL changes (hash or query params)
   */
  listenForUrlChanges() {
    window.addEventListener("hashchange", () => {
      this.currentUrl = window.location.href;
      console.log("[CustomViews] URL changed:", this.currentUrl);
    });

    window.addEventListener("popstate", () => {
      this.currentUrl = window.location.href;
      console.log("[CustomViews] URL changed:", this.currentUrl);
    });
  }
}

// Export as a global variable (browser-friendly)
window.customViews = CustomViews;

