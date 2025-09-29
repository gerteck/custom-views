import { injectWidgetStyles } from "../styles/widget-styles";
import type { CustomViewsCore } from "./core";
import type { State } from "../types/types";
import { URLStateManager } from "./url-state-manager";

export interface WidgetOptions {
  /** The CustomViews core instance to control */
  core: CustomViewsCore;
  
  /** Container element where the widget should be rendered */
  container?: HTMLElement;
  
  /** Widget position: 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'middle-left', 'middle-right' */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'middle-left' | 'middle-right';
  
  /** Widget theme: 'light', 'dark', 'auto' */
  theme?: 'light' | 'dark' | 'auto';
  
  /** Whether to show reset button */
  showReset?: boolean;
  
  /** Widget title */
  title?: string;
}

export class CustomViewsWidget {
  private core: CustomViewsCore;
  private container: HTMLElement;
  private widgetIcon: HTMLElement | null = null;
  private options: Required<WidgetOptions>;
  
  // Modal state
  private modal: HTMLElement | null = null;
  

  constructor(options: WidgetOptions) {
    this.core = options.core;
    this.container = options.container || document.body;
    
    // Set defaults
    this.options = {
      core: options.core,
      container: this.container,
      position: options.position || 'bottom-right',
      theme: options.theme || 'auto',
      showReset: options.showReset ?? true,
      title: options.title || 'Custom Views'
    };
    
    // No external state manager to initialize
  }

  /**
   * Render the widget
   */
  public render(): HTMLElement {
    this.widgetIcon = this.createWidgetIcon();
    this.attachEventListeners();
    
    // Always append to body since it's a floating icon
    document.body.appendChild(this.widgetIcon);
    
    return this.widgetIcon;
  }

  /**
   * Create the simple widget icon
   */
  private createWidgetIcon(): HTMLElement {
    const icon = document.createElement('div');
    icon.className = `cv-widget-icon cv-widget-${this.options.position}`;
    icon.innerHTML = '?';
    icon.title = this.options.title;
    icon.setAttribute('aria-label', 'Open Custom Views');
    
    // Add styles
    injectWidgetStyles();
    
    return icon;
  }

  /**
   * Remove the widget from DOM
   */
  public destroy(): void {
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

  private attachEventListeners(): void {
    if (!this.widgetIcon) return;

    // Click to open customization modal directly
    this.widgetIcon.addEventListener('click', () => this.openStateModal());
  }

  /**
   * Close the modal
   */
  private closeModal(): void {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
  }

  /**
   * Open the custom state creator
   */
  private openStateModal(): void {
    // Get toggles from current configuration and open the modal regardless of count
    const localConfig = this.core.getLocalConfig();
    const toggles = localConfig?.allToggles || [];
    this.createCustomStateModal(toggles);
  }

  /**
   * Create the custom state creator modal
   */
  private createCustomStateModal(toggles: string[]): void {
    // Close existing modal
    this.closeModal();

    this.modal = document.createElement('div');
    this.modal.className = 'cv-widget-modal-overlay';
    
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
            <p>Toggle different content sections to customize your view. Changes are applied instantly and the URL will be updated for sharing.</p>
            
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
  private attachStateModalEventListeners(): void {
    if (!this.modal) return;

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
    const toggleCheckboxes = this.modal.querySelectorAll('.cv-custom-toggle-checkbox') as NodeListOf<HTMLInputElement>;
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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }


  /**
   * Get current state from form values
   */
  private getCurrentCustomStateFromModal(): State {
    if (!this.modal) {
      return { toggles: [] };
    }

    // Collect toggle values
    const toggles: string[] = [];
    const toggleCheckboxes = this.modal.querySelectorAll('.cv-custom-toggle-checkbox') as NodeListOf<HTMLInputElement>;
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
  private copyShareableURL(): void {
    const customState = this.getCurrentCustomStateFromModal();
    const url = URLStateManager.generateShareableURL(customState);
    
    navigator.clipboard.writeText(url).then(() => {
      console.log('Shareable URL copied to clipboard!');
    }).catch(() => {console.error('Failed to copy URL!');});
  }

  /**
   * Load current state into form based on currently active toggles
   */
  private loadCurrentStateIntoForm(): void {
    if (!this.modal) return;

    // Get currently active toggles (from custom state or default configuration)
    const activeToggles = this.core.getCurrentActiveToggles();
    
    // First, uncheck all checkboxes
    const allCheckboxes = this.modal.querySelectorAll('.cv-custom-toggle-checkbox') as NodeListOf<HTMLInputElement>;
    allCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
      checkbox.disabled = false;
      checkbox.parentElement?.removeAttribute('aria-hidden');
    });

    // Then check the ones that should be active
    activeToggles.forEach(toggle => {
      const checkbox = this.modal?.querySelector(`[data-toggle="${toggle}"]`) as HTMLInputElement;
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
  private formatToggleName(toggle: string): string {
    return toggle.charAt(0).toUpperCase() + toggle.slice(1);
  }


}
