/**
 * Widget styles for CustomViews
 * Extracted from widget.ts for better maintainability
 * 
 * Note: Styles are kept as a TypeScript string for compatibility with the build system.
 * This approach ensures the styles are properly bundled and don't require separate CSS file handling.
 */

export const WIDGET_STYLES = `
/* Simple widget icon styles */
.cv-widget-icon {
  position: fixed;
  width: 40px;
  height: 40px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9998;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.cv-widget-icon:hover {
  background: #0056b3;
  transform: scale(1.1);
}

.cv-widget-top-right {
  top: 20px;
  right: 20px;
}

.cv-widget-top-left {
  top: 20px;
  left: 20px;
}

.cv-widget-bottom-right {
  bottom: 20px;
  right: 20px;
}

.cv-widget-bottom-left {
  bottom: 20px;
  left: 20px;
}

.cv-widget-middle-left {
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
}

.cv-widget-middle-right {
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

/* Modal content styles */
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

/* Responsive design for mobile */
@media (max-width: 768px) {
  .cv-widget-top-right,
  .cv-widget-top-left {
    top: 10px;
  }

  .cv-widget-top-right,
  .cv-widget-bottom-right,
  .cv-widget-middle-right {
    right: 10px;
  }

  .cv-widget-top-left,
  .cv-widget-bottom-left,
  .cv-widget-middle-left {
    left: 10px;
  }

  .cv-widget-bottom-right,
  .cv-widget-bottom-left {
    bottom: 10px;
  }
}

/* Modal styles */
.cv-widget-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10002;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.cv-widget-modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.2s ease;
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.cv-widget-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.cv-widget-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.cv-widget-modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #666;
}

.cv-widget-modal-close:hover {
  background: #e9ecef;
}

.cv-widget-modal-content {
  padding: 20px;
}

.cv-widget-modal-actions {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.cv-widget-restore {
  width: 100%;
  padding: 10px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.cv-widget-restore:hover {
  background: #218838;
}

.cv-widget-create-state {
  width: 100%;
  padding: 10px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}

.cv-widget-create-state:hover {
  background: #0056b3;
}

/* Dark theme modal styles */
.cv-widget-theme-dark .cv-widget-modal {
  background: #2d3748;
  color: #e2e8f0;
}

.cv-widget-theme-dark .cv-widget-modal-header {
  background: #1a202c;
  border-color: #4a5568;
}

.cv-widget-theme-dark .cv-widget-modal-header h3 {
  color: #e2e8f0;
}

.cv-widget-theme-dark .cv-widget-modal-close {
  color: #a0aec0;
}

.cv-widget-theme-dark .cv-widget-modal-close:hover {
  background: #4a5568;
}

.cv-widget-theme-dark .cv-widget-modal-actions {
  border-color: #4a5568;
}

/* Custom state creator styles */
.cv-custom-state-modal {
  max-width: 500px;
}

.cv-custom-state-form h4 {
  margin: 20px 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 5px;
}

.cv-custom-state-section {
  margin-bottom: 16px;
}

.cv-custom-state-section label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #555;
}

.cv-custom-state-input,
.cv-custom-placeholder-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.cv-custom-state-input:focus,
.cv-custom-placeholder-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.cv-custom-toggles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.cv-custom-state-toggle {
  display: flex;
  align-items: center;
}

.cv-custom-state-toggle label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
  margin: 0;
}

.cv-custom-toggle-checkbox {
  margin-right: 8px;
  width: auto;
}

.cv-custom-state-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.cv-custom-state-cancel,
.cv-custom-state-copy-url {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.cv-custom-state-cancel {
  background: #6c757d;
  color: white;
}

.cv-custom-state-cancel:hover {
  background: #5a6268;
}

.cv-custom-state-copy-url {
  background: #28a745;
  color: white;
}

.cv-custom-state-copy-url:hover {
  background: #218838;
}

/* Dark theme custom state styles */
.cv-widget-theme-dark .cv-custom-state-form h4 {
  color: #e2e8f0;
  border-color: #4a5568;
}

.cv-widget-theme-dark .cv-custom-state-section label {
  color: #a0aec0;
}

.cv-widget-theme-dark .cv-custom-state-input,
.cv-widget-theme-dark .cv-custom-placeholder-select {
  background: #1a202c;
  border-color: #4a5568;
  color: #e2e8f0;
}

.cv-widget-theme-dark .cv-custom-state-actions {
  border-color: #4a5568;
}
`;

/**
 * Inject widget styles into the document head
 */
export function injectWidgetStyles(): void {
  // Check if styles are already injected
  if (document.querySelector('#cv-widget-styles')) return;

  const style = document.createElement('style');
  style.id = 'cv-widget-styles';
  style.textContent = WIDGET_STYLES;
  document.head.appendChild(style);
}
