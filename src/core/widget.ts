import { injectWidgetStyles } from "./widget-styles";
import { CustomStateManager, type ProfileConstraints } from "./custom-state-manager";
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
  
  /** Whether to show profile selector */
  showProfiles?: boolean;
  
  /** Whether to show state selector */
  showStates?: boolean;
  
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
      showProfiles: options.showProfiles ?? false,
      showStates: options.showStates ?? true,
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

    // Click to open modal
    this.widgetIcon.addEventListener('click', () => this.openModal());
  }

  private setupStateChangeListener(): void {
    this.stateChangeListener = () => {
      // Icon doesn't need updates, but modal should be updated if open
      if (this.modal) {
        this.updateModalState();
      }
    };
    
    this.core.addStateChangeListener(this.stateChangeListener);
  }

  /**
   * Open the modal with widget controls
   */
  private openModal(): void {
    if (this.modal) return;
    
    this.modal = document.createElement('div');
    this.modal.className = 'cv-widget-modal-overlay';
    
    this.modal.innerHTML = `
      <div class="cv-widget-modal">
        <div class="cv-widget-modal-header">
          <h3>${this.options.title}</h3>
          <button class="cv-widget-modal-close" aria-label="Close modal">x</button>
        </div>
        <div class="cv-widget-modal-content">
          ${this.options.showProfiles ? this.createProfileSelector() : ''}
          ${this.options.showStates ? this.createStateSelector() : ''}
          <div class="cv-widget-current">
            <label>Current View:</label>
            <div class="cv-widget-current-view">Default → Default</div>
          </div>
          ${this.options.showReset ? '<button class="cv-widget-reset">Reset to Default</button>' : ''}
          <div class="cv-widget-modal-actions">
            <button class="cv-widget-create-state" id="cv-create-state-btn">Customize View</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.modal);
    
    // Add event listeners for modal
    this.attachModalEventListeners();
    
    // Update the modal state
    this.updateModalState();
    
    // Focus trap
    const closeBtn = this.modal.querySelector('.cv-widget-modal-close') as HTMLElement;
    if (closeBtn) closeBtn.focus();
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
   * Attach event listeners to modal elements
   */
  private attachModalEventListeners(): void {
    if (!this.modal) return;

    // Close button
    const closeBtn = this.modal.querySelector('.cv-widget-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
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

    // Profile selector
    const profileSelect = this.modal.querySelector('.cv-widget-profile-select') as HTMLSelectElement;
    if (profileSelect) {
      profileSelect.addEventListener('change', async (e) => {
        const target = e.target as HTMLSelectElement;
        const profileId = target.value;
        
        if (profileId) {
          await this.core.switchToProfile(profileId);
    } else {
          this.core.clearPersistence();
        }
        
        this.updateModalState();
      });
    }

    // State selector
    const stateSelect = this.modal.querySelector('.cv-widget-state-select') as HTMLSelectElement;
    if (stateSelect) {
      stateSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        const stateId = target.value;
        
        if (stateId) {
          this.core.switchToState(stateId);
        }
        
        this.updateModalState();
      });
    }

    // Reset button
    const resetBtn = this.modal.querySelector('.cv-widget-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.core.clearPersistence();
        this.updateModalState();
      });
    }

    // Create state button
    const createStateBtn = this.modal.querySelector('.cv-widget-create-state');
    if (createStateBtn) {
      createStateBtn.addEventListener('click', () => {
        this.openCustomStateCreator();
      });
    }
  }

  /**
   * Update modal state to reflect current view
   */
  private updateModalState(): void {
    if (!this.modal) return;

    const currentView = this.core.getCurrentView();
    const availableProfiles = this.core.getAvailableProfiles();
    const availableStates = this.core.getAvailableStates();

    // Update profile selector
    const profileSelect = this.modal.querySelector('.cv-widget-profile-select') as HTMLSelectElement;
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
    const stateSelect = this.modal.querySelector('.cv-widget-state-select') as HTMLSelectElement;
    if (stateSelect) {
      stateSelect.innerHTML = '';
      
      // Only show global "Default" option if no profile is selected
      if (!currentView.profile) {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Default';
        defaultOption.selected = !currentView.state;
        stateSelect.appendChild(defaultOption);
      }
      
      // Add profile-specific states
      availableStates.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = this.formatStateName(state);
        option.selected = state === currentView.state;
        stateSelect.appendChild(option);
      });
      
      stateSelect.disabled = !currentView.profile;
    }

    // Update current view display
    const currentViewDisplay = this.modal.querySelector('.cv-widget-current-view');
    if (currentViewDisplay) {
      const profileText = currentView.profile ? this.formatProfileName(currentView.profile) : 'Default';
      const stateText = currentView.state ? this.formatStateName(currentView.state) : 'Default';
      currentViewDisplay.textContent = `${profileText} → ${stateText}`;
    }

    // Show/hide create state button based on profile selection
    const createStateBtn = this.modal.querySelector('.cv-widget-create-state') as HTMLElement;
    if (createStateBtn) {
      createStateBtn.style.display = currentView.profile ? 'block' : 'none';
    }
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

  /**
   * Open the custom state creator
   */
  private openCustomStateCreator(): void {
    const currentView = this.core.getCurrentView();
    if (!currentView.profile) {
      alert('Please select a profile first to customize the view.');
      return;
    }

    // Get profile constraints
    const constraints = this.customStateManager.getProfileConstraints();
    if (!constraints) {
      alert('Unable to load profile constraints.');
      return;
    }

    // Create custom state creator modal
    this.createCustomStateModal(constraints);
  }

  /**
   * Create the custom state creator modal
   */
  private createCustomStateModal(constraints: ProfileConstraints): void {
    // Close existing modal
    this.closeModal();

    this.modal = document.createElement('div');
    this.modal.className = 'cv-widget-modal-overlay';
    
    const placeholderControls = Object.entries(constraints.modifiablePlaceholders)
      .map(([placeholder, assets]) => `
        <div class="cv-custom-state-section">
          <label for="cv-placeholder-${placeholder}">${this.formatPlaceholderName(placeholder)}:</label>
          <select id="cv-placeholder-${placeholder}" class="cv-custom-placeholder-select" data-placeholder="${placeholder}">
            <option value="">None</option>
            ${assets.map(asset => `<option value="${asset}">${this.formatAssetName(asset)}</option>`).join('')}
          </select>
        </div>
      `).join('');

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
            <p>Customize your view by selecting different assets and toggles. Changes are applied instantly and the URL will be updated for sharing.</p>
            
            <h4>Placeholders</h4>
            ${placeholderControls}
            
            <h4>Toggles</h4>
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
        this.openModal(); // Reopen main modal
      });
    }

    // Cancel button
    const cancelBtn = this.modal.querySelector('.cv-custom-state-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.closeModal();
        this.openModal(); // Reopen main modal
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
        this.openModal(); // Reopen main modal
      }
    });

    // Escape key to close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeModal();
        this.openModal(); // Reopen main modal
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

    // Listen to placeholder selects
    const placeholderSelects = this.modal.querySelectorAll('.cv-custom-placeholder-select') as NodeListOf<HTMLSelectElement>;
    placeholderSelects.forEach(select => {
      select.addEventListener('change', () => {
        this.applyCurrentCustomState();
      });
    });

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
      return { placeholders: {}, toggles: [] };
    }

    // Collect placeholder values
    const placeholders: Record<string, string> = {};
    const placeholderSelects = this.modal.querySelectorAll('.cv-custom-placeholder-select') as NodeListOf<HTMLSelectElement>;
    placeholderSelects.forEach(select => {
      const placeholder = select.dataset.placeholder;
      const value = select.value;
      if (placeholder) {
        // Always include the placeholder, even if value is empty (None selected)
        placeholders[placeholder] = value || '';
      }
    });

    // Collect toggle values
    const toggles: string[] = [];
    const toggleCheckboxes = this.modal.querySelectorAll('.cv-custom-toggle-checkbox') as NodeListOf<HTMLInputElement>;
    toggleCheckboxes.forEach(checkbox => {
      const toggle = checkbox.dataset.toggle;
      if (toggle && checkbox.checked) {
        toggles.push(toggle);
      }
    });

    return { placeholders, toggles };
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
   * Load current state into form if we're viewing a custom state
   */
  private loadCurrentStateIntoForm(): void {
    if (!this.modal) return;

    const currentView = this.core.getCurrentView();
    if (!currentView.customState) return;

    // Load placeholder values
    Object.entries(currentView.customState.placeholders).forEach(([placeholder, asset]) => {
      const select = this.modal?.querySelector(`[data-placeholder="${placeholder}"]`) as HTMLSelectElement;
      if (select) {
        select.value = asset;
      }
    });

    // Load toggle values
    currentView.customState.toggles.forEach(toggle => {
      const checkbox = this.modal?.querySelector(`[data-toggle="${toggle}"]`) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = true;
      }
    });
  }

  /**
   * Format placeholder name for display
   */
  private formatPlaceholderName(placeholder: string): string {
    return this.customStateManager.formatPlaceholderName(placeholder);
  }

  /**
   * Format asset name for display
   */
  private formatAssetName(asset: string): string {
    return this.customStateManager.formatAssetName(asset);
  }

  /**
   * Format toggle name for display
   */
  private formatToggleName(toggle: string): string {
    return this.customStateManager.formatToggleName(toggle);
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
}
