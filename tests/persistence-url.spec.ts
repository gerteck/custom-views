import { describe, it, expect, beforeEach } from 'vitest';
import { CustomViewsCore } from '../src/core/core';
import { AssetsManager } from '../src/models/AssetsManager';
import { PersistenceManager } from '../src/core/persistence';
import { URLStateManager } from '../src/core/url-state-manager';

function createCore(): CustomViewsCore {
  const core = new CustomViewsCore({
    assetsManager: new AssetsManager({}),
    profilePath: '',
    rootEl: document.body,
  } as any);
  return core;
}

describe('Persistence & URL ignore hidden toggles', () => {
  let core: CustomViewsCore;
  beforeEach(() => {
    // Ensure jsdom has a proper URL so history.replaceState works
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost/test'),
      writable: true,
    });
    core = createCore();
    document.body.innerHTML = `
      <section data-customviews-toggle="mac">mac</section>
      <section data-customviews-toggle="linux">linux</section>
    `;
    // Reset URL to a valid same-origin path
    history.replaceState({}, '', '/test');
    // Clear storage
    new PersistenceManager().clearAll();
  });

  it('filters hidden toggles from persisted custom state and URL', () => {
    core.applyCustomState({ toggles: ['mac', 'linux'] });
    core.setToggleVisibility('linux', false);
    core.applyCustomState({ toggles: ['mac', 'linux'] });

    const pm = core.getPersistenceManager();
    const persisted = pm.getPersistedCustomState();
    expect(persisted?.toggles).toEqual(['mac']);

    // Generate shareable URL and ensure hidden toggle is excluded
    const safe = core.filterTogglesForPersistence(['mac', 'linux']);
    const shareUrl = URLStateManager.generateShareableURL({ customState: { toggles: safe } });
    const url = new URL(shareUrl);
    const customParam = url.searchParams.get('custom');
    expect(customParam).toBeTruthy();
    const padded = (customParam as string).replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - ((customParam as string).length % 4)) % 4);
    // @ts-ignore
    const decoded = (typeof atob === 'function') ? atob(padded) : Buffer.from(padded, 'base64').toString('utf-8');
    expect(decoded).toContain('"t":["mac"]');
  });
});

