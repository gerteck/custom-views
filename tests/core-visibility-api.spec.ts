import { describe, it, expect, beforeEach } from 'vitest';
import { CustomViewsCore } from '../src/core/core';
import { AssetsManager } from '../src/models/AssetsManager';

function createCore(): CustomViewsCore {
  const core = new CustomViewsCore({
    assetsManager: new AssetsManager({}),
    profilePath: '',
    rootEl: document.body,
  } as any);
  return core;
}

describe('CustomViewsCore visibility API', () => {
  let core: CustomViewsCore;
  beforeEach(() => {
    core = createCore();
    document.body.innerHTML = `
      <section data-customviews-toggle="mac">mac</section>
      <section data-customviews-toggle="linux">linux</section>
      <section data-customviews-toggle="windows">windows</section>
    `;
  });

  it('setToggleVisibility hides selected toggles without re-rendering assets', () => {
    // Apply a state that shows all three
    core.applyCustomState({ toggles: ['mac', 'linux', 'windows'] });

    // Hide linux
    core.setToggleVisibility('linux', false);

    const mac = document.querySelector('[data-customviews-toggle="mac"]') as HTMLElement;
    const linux = document.querySelector('[data-customviews-toggle="linux"]') as HTMLElement;
    const win = document.querySelector('[data-customviews-toggle="windows"]') as HTMLElement;

    expect(mac.classList.contains('cv-visible')).toBe(true);
    expect(linux.classList.contains('cv-hidden')).toBe(true);
    expect(win.classList.contains('cv-visible')).toBe(true);
  });

  it('getVisibleToggles/getHiddenToggles reflect API changes', () => {
    core.applyCustomState({ toggles: ['mac', 'linux'] });
    core.setToggleVisibility('linux', false);
    expect(core.getVisibleToggles().sort()).toEqual(['mac']);
    expect(core.getHiddenToggles().sort()).toEqual(['linux']);
  });
});

