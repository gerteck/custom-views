import { describe, it, expect, beforeEach } from 'vitest';
import { CustomViewsCore } from '../src/core/core';
import { AssetsManager } from '../src/models/AssetsManager';
import { CustomViewsWidget } from '../src/core/widget';
import { LocalConfig } from '../src/models/LocalConfig';

function createCore(): CustomViewsCore {
  const core = new CustomViewsCore({
    assetsManager: new AssetsManager({}),
    profilePath: '',
    rootEl: document.body,
  } as any);
  // Inject a config so the widget shows the custom state modal with toggles
  (core as any).localConfig = new LocalConfig({ id: 'test', allowedToggles: ['mac','linux','windows'], defaultState: { toggles: [] } });
  return core;
}

describe('Widget UI responds to visibility changes', () => {
  let core: CustomViewsCore;
  beforeEach(() => {
    document.body.innerHTML = '';
    core = createCore();
  });

  it('disables hidden toggles in the custom state modal', async () => {
    const widget = new CustomViewsWidget({ core });
    const icon = widget.render();

    // Open modal
    icon.dispatchEvent(new Event('click'));

    // Hide linux
    core.setToggleVisibility('linux', false);

    const linuxCheckbox = document.querySelector('.cv-custom-toggle-checkbox[data-toggle="linux"]') as HTMLInputElement;
    expect(linuxCheckbox).toBeTruthy();
    expect(linuxCheckbox.disabled).toBe(true);
    expect(linuxCheckbox.parentElement?.getAttribute('aria-hidden')).toBe('true');
  });
});

