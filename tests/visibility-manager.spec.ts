import { describe, it, expect, beforeEach } from 'vitest';
import { VisibilityManager } from '../src/core/visibility-manager';

describe('VisibilityManager', () => {
  let vm: VisibilityManager;
  beforeEach(() => {
    vm = new VisibilityManager();
    document.body.innerHTML = '';
  });

  it('tracks hidden toggles and filters visible list', () => {
    vm.setToggleVisibility('linux', false);
    expect(vm.getHiddenToggles()).toEqual(['linux']);
    expect(vm.filterVisibleToggles(['mac', 'linux', 'windows'])).toEqual(['mac', 'windows']);
  });

  it('applies a11y and classes to elements when hiding/showing', () => {
    const el = document.createElement('div');
    el.dataset.customviewsToggle = 'linux';
    document.body.appendChild(el);

    vm.applyElementVisibility(el, true);
    expect(el.classList.contains('cv-visible')).toBe(true);
    expect(el.getAttribute('aria-hidden')).toBeNull();

    vm.applyElementVisibility(el, false);
    expect(el.classList.contains('cv-hidden')).toBe(true);
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.hasAttribute('inert')).toBe(true);
  });
});

