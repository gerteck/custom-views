import { injectWidgetStyles } from "./widget-styles";
import { CustomStateManager, type ConfigConstraints } from "./custom-state-manager";
import type { CustomViewsCore } from "./core";
import type { CustomState } from "./url-state-manager";

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
  private stateChangeListener: (() => void) | null = null;
  
  // Modal state
  private modal: HTMLElement | null = null;
  
  // Custom state manager
  private customStateManager: CustomStateManager;

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
    
    // Initialize custom state manager
    this.customStateManager = new CustomStateManager(this.core);
  }

  /**
   * Render the widget
   */
  public render(): HTMLElement {
    this.widgetIcon = this.createWidgetIcon();
    this.attachEventListeners();
    this.setupStateChangeListener();
    
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
    // Remove state change listener
    if (this.stateChangeListener) {
      this.core.removeStateChangeListener(this.stateChangeListener);
      this.stateChangeListener = null;
    }

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
    this.widgetIcon.addEventListener('click', () => this.openCustomStateCreator());
  }

  private setupStateChangeListener(): void {
    this.stateChangeListener = () => {
      // Icon doesn't need updates for simplified version
      // But we need to update the modal form if it's open
      if (this.modal) {
        this.loadCurrentStateIntoForm();
      }
    };
    
    this.core.addStateChangeListener(this.stateChangeListener);

    // Also react to visibility changes to keep form in sync
    this.core.onToggleVisibilityChange(() => {
      if (this.modal) {
        this.loadCurrentStateIntoForm();
      }
    });
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
  private openCustomStateCreator(): void {
    // Get configuration constraints
    const constraints = this.customStateManager.getConfigConstraints();
    if (!constraints) {
      // If no configuration, create a basic modal with just reset option
      this.createBasicModal();
      return;
    }

    // Create custom state creator modal
    this.createCustomStateModal(constraints);
  }

  /**
   * Create a basic modal when no configuration is available
   */
  private createBasicModal(): void {
    if (this.modal) return;
    
    this.modal = document.createElement('div');
    this.modal.className = 'cv-widget-modal-overlay';
    
    this.modal.innerHTML = `
      <div class="cv-widget-modal">
        <div class="cv-widget-modal-header">
          <h3>${this.options.title}</h3>
          <button class="cv-widget-modal-close" aria-label="Close modal">×</button>
        </div>
        <div class="cv-widget-modal-content">
          <p>No configuration loaded. Only default state is available.</p>
          <div class="cv-widget-current">
            <label>Current View:</label>
            <div class="cv-widget-current-view">Default</div>
          </div>
          <button class="cv-widget-reset">Reset to Default</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.modal);
    
    // Add basic event listeners
    const closeBtn = this.modal.querySelector('.cv-widget-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }
    
    const resetBtn = this.modal.querySelector('.cv-widget-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.core.resetToDefault();
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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  /**
   * Create the custom state creator modal
   */
  private createCustomStateModal(constraints: ConfigConstraints): void {
    // Close existing modal
    this.closeModal();

    this.modal = document.createElement('div');
    this.modal.className = 'cv-widget-modal-overlay';
    
    const toggleControls = constraints.allowedToggles
      .map(toggle => `
        <div class="cv-custom-state-toggle">
          <label>
            <input type="checkbox" class="cv-custom-toggle-checkbox" data-toggle="${toggle}" />
            ${this.formatToggleName(toggle)}
          </label>
        </div>
      `).join('');

    this.modal.innerHTML = `
      <div class="cv-widget-modal cv-custom-state-modal">
        <div class="cv-widget-modal-header">
          <h3>Customize View</h3>
          <button class="cv-widget-modal-close" aria-label="Close modal">×</button>
        </div>
        <div class="cv-widget-modal-content">
          <div class="cv-custom-state-form">
            <p>Toggle different content sections to customize your view. Changes are applied instantly and the URL will be updated for sharing.</p>
            
            <h4>Content Sections</h4>
            <div class="cv-custom-toggles">
              ${toggleControls}
            </div>
            
            <div class="cv-custom-state-actions">
              <button class="cv-custom-state-cancel">Back to Main</button>
              <button class="cv-custom-state-copy-url">Copy Shareable URL</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);
    this.attachCustomStateEventListeners();

    // Load current state into form if we're already in a custom state
    this.loadCurrentStateIntoForm();
  }

  /**
   * Attach event listeners for custom state creator
   */
  private attachCustomStateEventListeners(): void {
    if (!this.modal) return;

    // Close button
    const closeBtn = this.modal.querySelector('.cv-widget-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Cancel button
    const cancelBtn = this.modal.querySelector('.cv-custom-state-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
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

    // Add change listeners for instant preview
    this.addInstantPreviewListeners();

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
   * Add instant preview listeners to form controls
   */
  private addInstantPreviewListeners(): void {
    if (!this.modal) return;

    // Listen to toggle checkboxes
    const toggleCheckboxes = this.modal.querySelectorAll('.cv-custom-toggle-checkbox') as NodeListOf<HTMLInputElement>;
    toggleCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.applyCurrentCustomState();
      });
    });
  }

  /**
   * Apply the current custom state from form values
   */
  private applyCurrentCustomState(): void {
    if (!this.modal) return;

    const customState = this.getCurrentCustomStateFromForm();
    this.core.applyCustomState(customState);
  }

  /**
   * Get current custom state from form values
   */
  private getCurrentCustomStateFromForm(): CustomState {
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
    const customState = this.getCurrentCustomStateFromForm();
    const url = this.customStateManager.getShareableURL(customState);
    
    navigator.clipboard.writeText(url).then(() => {
      alert('Shareable URL copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Shareable URL copied to clipboard!');
    });
  }

  /**
   * Load current state into form based on currently active toggles
   */
  private loadCurrentStateIntoForm(): void {
    if (!this.modal) return;

    // Get currently active toggles (from custom state or default configuration)
    const activeToggles = this.core.getCurrentActiveToggles();
    const hiddenGlobal = new Set(this.core.getHiddenToggles());
    
    // First, uncheck all checkboxes
    const allCheckboxes = this.modal.querySelectorAll('.cv-custom-toggle-checkbox') as NodeListOf<HTMLInputElement>;
    allCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
      const toggle = checkbox.dataset.toggle;
      const isHidden = toggle ? hiddenGlobal.has(toggle) : false;
      checkbox.disabled = isHidden;
      if (isHidden) {
        checkbox.parentElement?.setAttribute('aria-hidden', 'true');
      } else {
        checkbox.parentElement?.removeAttribute('aria-hidden');
      }
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
    return this.customStateManager.formatToggleName(toggle);
  }

}
