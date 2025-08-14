const CustomViews = (function(){
  let currentView = 'all';
  const viewStack = [];

  function applyView(view, push = true) {
    if(push && currentView !== view) {
      viewStack.push(currentView); // store current view before changing
    }

    currentView = view;
    document.querySelectorAll('[data-view]').forEach(el => {
      if(view === 'all' || el.dataset.view.split(' ').includes(view)) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });

    // Update URL hash
    window.location.hash = 'view=' + view;
  }

  function goBack() {
    if(viewStack.length > 0) {
      const prevView = viewStack.pop();
      applyView(prevView, false); 
    }
  }

  function init({ target, toggleContainer, backButtonSelector }) {
    // Attach click listeners for view toggles
    document.querySelectorAll(toggleContainer + ' [data-view]').forEach(btn => {
      btn.addEventListener('click', () => applyView(btn.dataset.view));
    });

    // Apply initial view from URL hash
    const hashView = window.location.hash.replace('#view=', '');
    if(hashView) applyView(hashView, false);

    // Listen to hash changes (back/forward)
    window.addEventListener('hashchange', () => {
      const view = window.location.hash.replace('#view=', '');
      if(view && view !== currentView) applyView(view, false);
    });

    // Attach back button handler
    if(backButtonSelector) {
      const backBtn = document.querySelector(backButtonSelector);
      if(backBtn) {
        backBtn.addEventListener('click', () => goBack());
      }
    }
  }

  return { init };
})();
