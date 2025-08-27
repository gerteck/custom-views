export default function renderImage(el, asset) {
  el.innerHTML = '';
  const img = document.createElement('img');
  img.src = asset.src;
  img.alt = asset.alt || '';
  img.style.maxWidth = '100%';
  img.style.height = 'auto';
  img.style.display = 'block';
  el.appendChild(img);
}