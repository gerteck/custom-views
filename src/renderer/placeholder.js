import renderImage from './renderTypes/image.js';
import renderText from './renderTypes/text.js';
import renderHtml from './renderTypes/html.js';

/**
 * Render a placeholder into a given element
 * @param {HTMLElement} el - target element
 * @param {Object} asset - { key: placeholderKey, value: placeholderValue }
 * @param {Object} config - loaded master JSON
 */
export function renderPlaceholderInto(el, asset, config) {
  const placeholderData = config.data?.placeholders?.[asset.key]?.[asset.value];
  if (!placeholderData) return;

  switch (placeholderData.type) {
    case 'image':
      renderImage(el, placeholderData);
      break;

    case 'text':
      renderText(el, placeholderData);
      break;

    case 'html':
      renderHtml(el, placeholderData);
      break;

    default:
      console.warn('[CustomViews] Unknown placeholder type:', placeholderData.type);
  }
}
