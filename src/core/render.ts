import type { CustomViewAsset } from "types/types";
import type { AssetsManager } from "core/assets-manager";

/** --- Icon utilities --- */

export function ensureFontAwesomeInjected() {
  const isFontAwesomeLoaded = Array.from(document.styleSheets).some(
    sheet => sheet.href && (sheet.href.includes('font-awesome') || sheet.href.includes('fontawesome'))
  );
  if (isFontAwesomeLoaded) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  link.setAttribute('data-customviews-fontawesome', 'true');
  document.head.appendChild(link);
}

export function replaceIconShortcodes(text: string): string {
  // Handle Font Awesome shortcodes
  return text.replace(/:fa-([\w-]+):/g, (_, icon) => `<i class="fa fa-${icon}"></i>`);
}

/** --- Basic renderers --- */

function renderImage(el: HTMLElement, asset: CustomViewAsset) {
  if (!asset.src) return;
  el.innerHTML = '';
  const img = document.createElement('img');
  img.src = asset.src;
  img.alt = asset.alt || '';
  
  // Apply custom styling if provided
  if (asset.className) {
    img.className = asset.className;
  }
  if (asset.style) {
    img.setAttribute('style', asset.style);
  }
  
  // Default styles (can be overridden by asset.style)
  img.style.maxWidth = img.style.maxWidth || '100%';
  img.style.height = img.style.height || 'auto';
  img.style.display = img.style.display || 'block';
  el.appendChild(img);
}

function renderText(el: HTMLElement, asset: CustomViewAsset) {
  if (asset.content != null) {
    el.textContent = asset.content;
  }
  
  // Apply custom styling if provided
  if (asset.className) {
    el.className = asset.className;
  }
  if (asset.style) {
    el.setAttribute('style', asset.style);
  }
}

function renderHtml(el: HTMLElement, asset: CustomViewAsset) {
  if (asset.content != null) {
    el.innerHTML = asset.content;
  }
  
  // Apply custom styling if provided
  if (asset.className) {
    el.className = asset.className;
  }
  if (asset.style) {
    el.setAttribute('style', asset.style);
  }
}

/** --- Unified asset renderer --- */

function detectAssetType(asset: CustomViewAsset): 'image' | 'text' | 'html' {
  // If src exists, it's an image
  if (asset.src) return 'image';
  
  // If content contains HTML tags, it's HTML
  if (asset.content && /<[^>]+>/.test(asset.content)) {
    return 'html';
  }
  
  return 'text';
}

export function renderAssetInto(
  el: HTMLElement,
  assetId: string,
  assetsManager: AssetsManager
) {
  const asset = assetsManager.get(assetId);
  if (!asset) return;

  const type = asset.type || detectAssetType(asset);

  switch (type) {
    case 'image':
      renderImage(el, asset);
      break;
    case 'text':
      renderText(el, asset);
      break;
    case 'html':
      renderHtml(el, asset);
      break;
    default:
      el.innerHTML = asset.content || String(asset);
      console.warn('[CustomViews] Unknown asset type:', type);
  }
}
