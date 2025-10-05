import type { TabGroupConfig } from "../types/types";

// Constants for selectors
const TABGROUP_SELECTOR = 'cv-tabgroup';
const TAB_SELECTOR = 'cv-tab';
const NAV_AUTO_SELECTOR = 'cv-tabgroup[nav="auto"], cv-tabgroup:not([nav])';
const NAV_CONTAINER_CLASS = 'cv-tabs-nav';

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
    const tabGroups = rootEl.querySelectorAll(TABGROUP_SELECTOR);
    
    tabGroups.forEach((groupEl) => {
      const groupId = groupEl.getAttribute('id');
      if (!groupId) return;

      // Determine the active tab for this group
      const activeTabId = this.resolveActiveTab(groupId, tabs, cfgGroups, groupEl as HTMLElement);
      
      // Apply visibility to child cv-tab elements
      const tabElements = groupEl.querySelectorAll(TAB_SELECTOR);
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
    const firstTab = groupEl.querySelector(TAB_SELECTOR);
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
   * Build navigation for tab groups with nav="auto" (one-time setup)
   */
  public static buildNavs(
    rootEl: HTMLElement,
    cfgGroups?: TabGroupConfig[],
    onTabClick?: (groupId: string, tabId: string) => void
  ): void {
    // Find all cv-tabgroup elements with nav="auto" or no nav attribute
    const tabGroups = rootEl.querySelectorAll(NAV_AUTO_SELECTOR);
    
    tabGroups.forEach((groupEl) => {
      const groupId = groupEl.getAttribute('id');
      if (!groupId) return;

      // Check if nav already exists - if so, skip building
      let navContainer = groupEl.querySelector(`.${NAV_CONTAINER_CLASS}`);
      if (navContainer) return; // Already built
      
      // Get all child tabs
      const tabElements = Array.from(groupEl.querySelectorAll(TAB_SELECTOR));
      if (tabElements.length === 0) return;

      // Create nav container
      navContainer = document.createElement('ul');
      navContainer.className = `${NAV_CONTAINER_CLASS} nav-tabs`;
      navContainer.setAttribute('role', 'tablist');
      groupEl.insertBefore(navContainer, groupEl.firstChild);

      // Build nav items
      tabElements.forEach((tabEl) => {
        const tabId = tabEl.getAttribute('id');
        if (!tabId) return;

        const header = tabEl.getAttribute('header') || this.getTabLabel(tabId, groupId, cfgGroups) || tabId;
        
        const listItem = document.createElement('li');
        listItem.className = 'nav-item';
        
        const navLink = document.createElement('a');
        navLink.className = 'nav-link';
        navLink.textContent = header;
        navLink.href = '#';
        navLink.setAttribute('data-tab-id', tabId);
        navLink.setAttribute('data-group-id', groupId);
        navLink.setAttribute('role', 'tab');
        
        // Check if this tab is currently active
        const isActive = tabEl.classList.contains('cv-visible');
        if (isActive) {
          navLink.classList.add('active');
          navLink.setAttribute('aria-selected', 'true');
        } else {
          navLink.setAttribute('aria-selected', 'false');
        }

        // Add click handler
        if (onTabClick) {
          navLink.addEventListener('click', (e) => {
            e.preventDefault();
            onTabClick(groupId, tabId);
          });
        }

        listItem.appendChild(navLink);
        navContainer.appendChild(listItem);
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
   * Update active state in navs after selection change (single group)
   */
  public static updateNavActiveState(rootEl: HTMLElement, groupId: string, activeTabId: string): void {
    const tabGroups = rootEl.querySelectorAll(`${TABGROUP_SELECTOR}[id="${groupId}"]`);
    
    tabGroups.forEach((groupEl) => {
      const navLinks = groupEl.querySelectorAll('.nav-link');
      navLinks.forEach((link) => {
        const tabId = link.getAttribute('data-tab-id');
        if (tabId === activeTabId) {
          link.classList.add('active');
          link.setAttribute('aria-selected', 'true');
        } else {
          link.classList.remove('active');
          link.setAttribute('aria-selected', 'false');
        }
      });
    });
  }

  /**
   * Update active states for all tab groups based on current state
   */
  public static updateAllNavActiveStates(
    rootEl: HTMLElement,
    tabs: Record<string, string>,
    cfgGroups?: TabGroupConfig[]
  ): void {
    const tabGroups = rootEl.querySelectorAll(TABGROUP_SELECTOR);
    
    tabGroups.forEach((groupEl) => {
      const groupId = groupEl.getAttribute('id');
      if (!groupId) return;

      // Determine the active tab for this group
      const activeTabId = this.resolveActiveTab(groupId, tabs, cfgGroups, groupEl as HTMLElement);
      if (!activeTabId) return;

      // Update nav links for this group
      const navLinks = groupEl.querySelectorAll('.nav-link');
      navLinks.forEach((link) => {
        const tabId = link.getAttribute('data-tab-id');
        if (tabId === activeTabId) {
          link.classList.add('active');
          link.setAttribute('aria-selected', 'true');
        } else {
          link.classList.remove('active');
          link.setAttribute('aria-selected', 'false');
        }
      });
    });
  }
}
