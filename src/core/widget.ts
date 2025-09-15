import type { CustomViewsCore } from "./core";

export interface WidgetOptions {
  /** The CustomViews core instance to control */
  core: CustomViewsCore;
  
  /** Container element where the widget should be rendered */
  container?: HTMLElement;
  
  /** Widget position: 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'inline' */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  
  /** Widget theme: 'light', 'dark', 'auto' */
  theme?: 'light' | 'dark' | 'auto';
  
  /** Whether to show profile selector */
  showProfiles?: boolean;
  
  /** Whether to show state selector */
  showStates?: boolean;
  
  /** Whether to show reset button */
  showReset?: boolean;
  
  /** Custom CSS classes to add to the widget */
  customClasses?: string[];
  
  /** Widget title */
  title?: string;
}

export class CustomViewsWidget {
  private core: CustomViewsCore;
  private container: HTMLElement;
  private widgetElement: HTMLElement | null = null;
  private options: Required<WidgetOptions>;

  constructor(options: WidgetOptions) {
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
  public render(): HTMLElement {
    this.widgetElement = this.createWidgetElement();
    this.attachEventListeners();
    
    if (this.options.position === 'inline') {
      this.container.appendChild(this.widgetElement);
    } else {
      // For positioned widgets, append to body and position absolutely
      document.body.appendChild(this.widgetElement);
    }
    
    this.updateWidgetState();
    return this.widgetElement;
  }

  /**
   * Update widget to reflect current state
   */
  public updateWidgetState(): void {
    if (!this.widgetElement) return;

    const currentView = this.core.getCurrentView();
    const availableProfiles = this.core.getAvailableProfiles();
    const availableStates = this.core.getAvailableStates();

    // Update profile selector
    const profileSelect = this.widgetElement.querySelector('.cv-widget-profile-select') as HTMLSelectElement;
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
    const stateSelect = this.widgetElement.querySelector('.cv-widget-state-select') as HTMLSelectElement;
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
  public destroy(): void {
    if (this.widgetElement) {
      this.widgetElement.remove();
      this.widgetElement = null;
    }
  }

  /**
   * Toggle widget visibility
   */
  public toggle(): void {
    if (!this.widgetElement) return;
    
    const content = this.widgetElement.querySelector('.cv-widget-content') as HTMLElement;
    if (content) {
      const isHidden = content.style.display === 'none';
      content.style.display = isHidden ? 'block' : 'none';
      
      const toggleBtn = this.widgetElement.querySelector('.cv-widget-toggle') as HTMLElement;
      if (toggleBtn) {
        toggleBtn.textContent = isHidden ? '−' : '+';
        toggleBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      }
    }
  }

  private createWidgetElement(): HTMLElement {
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

  private createProfileSelector(): string {
    return `
      <div class="cv-widget-section">
        <label for="cv-profile-select">Profile:</label>
        <select id="cv-profile-select" class="cv-widget-profile-select">
          <option value="">Default</option>
        </select>
      </div>
    `;
  }

  private createStateSelector(): string {
    return `
      <div class="cv-widget-section">
        <label for="cv-state-select">State:</label>
        <select id="cv-state-select" class="cv-widget-state-select">
          <option value="">Default</option>
        </select>
      </div>
    `;
  }

  private getWidgetClasses(): string[] {
    const classes = [
      'cv-widget',
      `cv-widget-${this.options.position}`,
      `cv-widget-theme-${this.options.theme}`,
      ...this.options.customClasses
    ];
    return classes;
  }

  private attachEventListeners(): void {
    if (!this.widgetElement) return;

    // Toggle button
    const toggleBtn = this.widgetElement.querySelector('.cv-widget-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }

    // Profile selector
    const profileSelect = this.widgetElement.querySelector('.cv-widget-profile-select') as HTMLSelectElement;
    if (profileSelect) {
      profileSelect.addEventListener('change', async (e) => {
        const target = e.target as HTMLSelectElement;
        const profileId = target.value;
        
        if (profileId) {
          await this.core.switchToProfile(profileId);
        } else {
          this.core.clearPersistence();
        }
        
        this.updateWidgetState();
      });
    }

    // State selector
    const stateSelect = this.widgetElement.querySelector('.cv-widget-state-select') as HTMLSelectElement;
    if (stateSelect) {
      stateSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        const stateId = target.value;
        
        if (stateId) {
          this.core.switchToState(stateId);
        }
        
        this.updateWidgetState();
      });
    }

    // Reset button
    const resetBtn = this.widgetElement.querySelector('.cv-widget-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.core.clearPersistence();
        this.updateWidgetState();
      });
    }
  }

  private formatProfileName(profile: string): string {
    // Convert camelCase or snake_case to Title Case
    return profile
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
      .trim();
  }

  private formatStateName(state: string): string {
    // Convert camelCase or snake_case to Title Case
    return state
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
      .trim();
  }

  private injectStyles(): void {
    // Check if styles are already injected
    if (document.querySelector('#cv-widget-styles')) return;

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
