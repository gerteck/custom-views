import renderImage from './renderTypes/image.js';
import renderText from './renderTypes/text.js';
import renderHtml from './renderTypes/html.js';

/**
 * Render a toggle into matching elements
 * @param {HTMLElement} el - target element
 * @param {string} toggleCategory - toggle name
 * @param {string} toggleId - toggle id (from data-customviews-id)
 * @param {Object} config - loaded master JSON
 * @param {number} idx - optional index if multiple entries exist
 */
export function renderToggleInto(el, toggleCategory, toggleId, config, idx = 0) {
  const toggleData = config.data?.toggles?.[toggleCategory]?.[toggleId];
  if (!toggleData) return;

  // If toggleData is an array, use idx; otherwise, use directly
  const item = Array.isArray(toggleData) ? toggleData[idx] : toggleData;
  if (!item) return;

  switch (item.type) {
    case 'image':
      renderImage(el, item);
      break;
    case 'text':
      renderText(el, item);
      break;
    case 'html':
      renderHtml(el, item);
      break;
    default:
      el.innerHTML = item.content || item;
      console.warn('[CustomViews] Unknown toggle type:', item.type);
  };
}