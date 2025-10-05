/**
 * Custom Elements for Tab Groups and Tabs
 */

/**
 * <cv-tab> element - represents a single tab panel
 */
class CVTab extends HTMLElement {
  connectedCallback() {
    // Element is managed by TabManager
  }
}

/**
 * <cv-tabgroup> element - represents a group of tabs
 */
class CVTabgroup extends HTMLElement {
  connectedCallback() {
    // Element is managed by TabManager
    // Emit ready event after a brief delay to ensure children are parsed
    setTimeout(() => {
      const event = new CustomEvent('cv:tabgroup-ready', {
        bubbles: true,
        detail: { groupId: this.getAttribute('id') }
      });
      this.dispatchEvent(event);
    }, 0);
  }
}

/**
 * Register custom elements
 */
export function registerCustomElements(): void {
  // Only register if not already defined
  if (!customElements.get('cv-tab')) {
    customElements.define('cv-tab', CVTab);
  }
  
  if (!customElements.get('cv-tabgroup')) {
    customElements.define('cv-tabgroup', CVTabgroup);
  }
}
