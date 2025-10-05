import type { TabGroupConfig } from "../types/types";

/**
 * TabManager handles discovery, visibility, and navigation for tab groups and tabs
 */
export class TabManager {
  /**
   * Apply tab selections to all tab groups in the DOM
   */
  public static applySelections(
    rootEl: HTMLElement,
    tabs: Record<string, string>,
    cfgGroups?: TabGroupConfig[]
  ): void {
    // Find all cv-tabgroup elements
    const tabGroups = rootEl.querySelectorAll('cv-tabgroup');
    
    tabGroups.forEach((groupEl) => {
      const groupId = groupEl.getAttribute('id');
      if (!groupId) return;

      // Determine the active tab for this group
      const activeTabId = this.resolveActiveTab(groupId, tabs, cfgGroups, groupEl as HTMLElement);
      
      // Apply visibility to child cv-tab elements
      const tabElements = groupEl.querySelectorAll('cv-tab');
      tabElements.forEach((tabEl) => {
        const tabId = tabEl.getAttribute('id');
        if (!tabId) return;

        const isActive = tabId === activeTabId;
        this.applyTabVisibility(tabEl as HTMLElement, isActive);
      });
    });
  }

  /**
   * Resolve the active tab for a group based on state, config, and DOM
   */
  private static resolveActiveTab(
    groupId: string,
    tabs: Record<string, string>,
    cfgGroups: TabGroupConfig[] | undefined,
    groupEl: HTMLElement
  ): string | null {
    // 1. Check state
    if (tabs[groupId]) {
      return tabs[groupId];
    }

    // 2. Check config default
    if (cfgGroups) {
      const groupCfg = cfgGroups.find(g => g.id === groupId);
      if (groupCfg) {
        if (groupCfg.default) {
          return groupCfg.default;
        }
        // Fallback to first tab in config
        const firstConfigTab = groupCfg.tabs[0];
        if (firstConfigTab) {
          return firstConfigTab.id;
        }
      }
    }

    // 3. Fallback to first cv-tab child in DOM
    const firstTab = groupEl.querySelector('cv-tab');
    if (firstTab) {
      return firstTab.getAttribute('id');
    }

    return null;
  }

  /**
   * Apply visibility classes to a tab element
   */
  private static applyTabVisibility(tabEl: HTMLElement, isActive: boolean): void {
    if (isActive) {
      tabEl.classList.remove('cv-hidden');
      tabEl.classList.add('cv-visible');
    } else {
      tabEl.classList.add('cv-hidden');
      tabEl.classList.remove('cv-visible');
    }
  }

  /**
   * Build or refresh navigation for tab groups with nav="auto"
   */
  public static refreshNavs(
    rootEl: HTMLElement,
    cfgGroups?: TabGroupConfig[],
    onTabClick?: (groupId: string, tabId: string) => void
  ): void {
    const tabGroups = rootEl.querySelectorAll('cv-tabgroup[nav="auto"], cv-tabgroup:not([nav])');
    
    tabGroups.forEach((groupEl) => {
      const groupId = groupEl.getAttribute('id');
      if (!groupId) return;

      // Check if nav already exists
      let navContainer = groupEl.querySelector('.cv-tabs-nav');
      
      // Get all child tabs
      const tabElements = Array.from(groupEl.querySelectorAll('cv-tab'));
      if (tabElements.length === 0) return;

      // Create nav if it doesn't exist
      if (!navContainer) {
        navContainer = document.createElement('div');
        navContainer.className = 'cv-tabs-nav';
        groupEl.insertBefore(navContainer, groupEl.firstChild);
      }

      // Clear existing nav items
      navContainer.innerHTML = '';

      // Build nav items
      tabElements.forEach((tabEl) => {
        const tabId = tabEl.getAttribute('id');
        if (!tabId) return;

        const header = tabEl.getAttribute('header') || this.getTabLabel(tabId, groupId, cfgGroups) || tabId;
        
        const navItem = document.createElement('button');
        navItem.className = 'cv-tabs-nav-item';
        navItem.textContent = header;
        navItem.setAttribute('data-tab-id', tabId);
        navItem.setAttribute('data-group-id', groupId);
        
        // Check if this tab is currently active
        const isActive = tabEl.classList.contains('cv-visible');
        if (isActive) {
          navItem.classList.add('active');
        }

        // Add click handler
        if (onTabClick) {
          navItem.addEventListener('click', (e) => {
            e.preventDefault();
            onTabClick(groupId, tabId);
          });
        }

        navContainer.appendChild(navItem);
      });
    });
  }

  /**
   * Get tab label from config
   */
  private static getTabLabel(
    tabId: string,
    groupId: string,
    cfgGroups?: TabGroupConfig[]
  ): string | null {
    if (!cfgGroups) return null;

    const groupCfg = cfgGroups.find(g => g.id === groupId);
    if (!groupCfg) return null;

    const tabCfg = groupCfg.tabs.find(t => t.id === tabId);
    return tabCfg?.label || null;
  }

  /**
   * Update active state in navs after selection change
   */
  public static updateNavActiveState(rootEl: HTMLElement, groupId: string, activeTabId: string): void {
    const tabGroups = rootEl.querySelectorAll(`cv-tabgroup[id="${groupId}"]`);
    
    tabGroups.forEach((groupEl) => {
      const navItems = groupEl.querySelectorAll('.cv-tabs-nav-item');
      navItems.forEach((item) => {
        const tabId = item.getAttribute('data-tab-id');
        if (tabId === activeTabId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    });
  }
}
