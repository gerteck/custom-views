
// Main CustomViews class
class CustomViews {
  constructor(options = {}) {
    this.configUrl = options.configUrl || 'views.json';
    this.rootEl = options.rootEl || document.getElementById('view-container') || document.body;
    this.config = null;
    this.currentViewId = null;
    this.currentView = null;
    this.assetRenderers = {
      image: this.renderImage.bind(this),
      // Extendable: add more asset types here
    };
    this.onViewChange = options.onViewChange || null;
  }

  async init() {
    await this.loadConfig();
    this.renderFromUrl();
    this.listenForUrlChanges();
  }

  async loadConfig() {
    try {
      const res = await fetch(this.configUrl);
      this.config = await res.json();
      if (!this.config.views) throw new Error('Invalid config: missing views');
    } catch (err) {
      console.error('[CustomViews] Failed to load config:', err);
    }
  }

  renderFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const viewId = urlParams.get('view') || this.config?.defaultView || Object.keys(this.config.views)[0];
    this.selectView(viewId);
  }

  selectView(viewId) {
    if (!this.config || !this.config.views[viewId]) {
      console.warn('[CustomViews] View not found:', viewId);
      return;
    }
    this.currentViewId = viewId;
    this.currentView = this.config.views[viewId];
    // Update URL with selected view
    const url = new URL(window.location);
    url.searchParams.set('view', viewId);
    window.history.pushState({}, '', url);
    this.renderView();
    if (typeof this.onViewChange === 'function') {
      this.onViewChange(viewId, this.currentView);
    }
  }

  renderView() {
    if (!this.rootEl || !this.currentView) return;
    this.rootEl.innerHTML = '';
    (this.currentView.assets || []).forEach(asset => {
      const renderer = this.assetRenderers[asset.type];
      if (renderer) {
        renderer(asset);
      }
    });
  }

  renderImage(asset) {
    const img = document.createElement('img');
    img.src = asset.src;
    img.alt = this.currentView.title || 'Custom View Image';
    this.rootEl.appendChild(img);
  }

  listenForUrlChanges() {
    window.addEventListener('popstate', () => {
      this.renderFromUrl();
    });
  }

  // Extensibility: allow registering custom asset renderers
  registerAssetRenderer(type, fn) {
    this.assetRenderers[type] = fn;
  }
}

// Export for different module systems
export default CustomViews;
export { CustomViews };