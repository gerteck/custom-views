import type { CustomViewAsset } from "types/types";
import type { AssetsManager } from "models/AssetsManager";

/** --- Basic renderers --- */

function renderImage(el: HTMLElement, asset: CustomViewAsset) {
  if (!asset.src) return;
  el.innerHTML = '';
  const img = document.createElement('img');
  img.src = asset.src;
  img.alt = asset.alt || '';
  img.style.maxWidth = '100%';
  img.style.height = 'auto';
  img.style.display = 'block';
  el.appendChild(img);
}

function renderText(el: HTMLElement, asset: CustomViewAsset) {
  if (asset.content != null) {
    el.textContent = asset.content;
  }
}

function renderHtml(el: HTMLElement, asset: CustomViewAsset) {
  if (asset.content != null) {
    el.innerHTML = asset.content;
  }
}

/** --- Unified asset renderer --- */

export function renderAssetInto(
  el: HTMLElement,
  assetId: string,
  assetsManager: AssetsManager
) {
  const asset = assetsManager.get(assetId);
  if (!asset) return;

  switch (asset.type) {
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
      console.warn('[CustomViews] Unknown asset type:', asset.type);
  }
}
