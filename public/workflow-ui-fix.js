(() => {
  const initWorkflowUI = () => {
    const blueprint = document.querySelector('#blueprint-inner-workflow-tray.blueprint-inner-workflow-container');
    const introSection = document.querySelector('.workflow-intro-section#workflow');
    if (!blueprint || !introSection) return;

    blueprint.classList.add('sf-workflow-ui-fixed');

    // Move the workflow heading/description into the blueprint itself so there is
    // one continuous blueprint box instead of a separate card above it.
    let intro = blueprint.querySelector('.sf-blueprint-intro');
    if (!intro) {
      const heading = introSection.querySelector('.editorial-heading');
      if (!heading) return;

      intro = document.createElement('div');
      intro.className = 'sf-blueprint-intro';
      const divider = document.createElement('div');
      divider.className = 'sf-blueprint-intro-divider';
      divider.setAttribute('aria-hidden', 'true');
      intro.appendChild(heading);
      intro.appendChild(divider);
      blueprint.prepend(intro);
    }
    introSection.classList.add('sf-workflow-intro-hidden');

    // Keep the existing expand control and its existing functionality; only move it
    // into the professional control row. Remove any older duplicate canvas control.
    let expand = blueprint.querySelector('#blueprint-board-expand-toggle');
    if (!expand) expand = blueprint.querySelector('.blueprint-inner-expand-control');

    blueprint.querySelectorAll('.blueprint-canvas-btn').forEach((button) => {
      if (button !== expand && !button.classList.contains('sf-blueprint-reset')) button.remove();
    });

    let controls = blueprint.querySelector('.sf-blueprint-controls');
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'sf-blueprint-controls';
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', 'Blueprint controls');
      intro.insertAdjacentElement('afterend', controls);
    }

    if (expand && expand.parentElement !== controls) controls.appendChild(expand);

    let reset = controls.querySelector('.sf-blueprint-reset');
    if (!reset) {
      reset = document.createElement('button');
      reset.type = 'button';
      reset.className = 'blueprint-canvas-btn sf-blueprint-reset';
      reset.setAttribute('aria-label', 'Reset blueprint view');
      reset.title = 'Reset blueprint view';
      reset.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 11a8.1 8.1 0 0 0-14.9-4A8 8 0 0 0 5 18.2"/>
          <path d="M4 5v5h5"/>
          <path d="M4 13a8.1 8.1 0 0 0 14.9 4A8 8 0 0 0 19 5.8"/>
          <path d="M20 19v-5h-5"/>
        </svg>`;
    }
    controls.insertBefore(reset, expand || null);

    // Reset functionality will be wired separately later; for now it is a visual
    // control only and must not submit a form or change the blueprint.
    if (reset.dataset.sfResetBound !== 'true') {
      reset.dataset.sfResetBound = 'true';
      reset.addEventListener('click', (event) => event.preventDefault());
    }
  };

  const style = document.createElement('style');
  style.id = 'sf-workflow-ui-fix-style';
  style.textContent = `
    .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed {
      position:relative!important;
      background:#000!important;
      border:1px solid rgba(255,255,255,.10)!important;
      border-radius:24px!important;
      overflow:hidden!important;
      box-sizing:border-box!important;
    }

    .testing-1-theme .workflow-intro-section.sf-workflow-intro-hidden { display:none!important; }

    .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .sf-blueprint-intro {
      position:relative!important;
      width:100%!important;
      box-sizing:border-box!important;
      padding:22px 48px 0!important;
      margin:0!important;
      background:#000!important;
      border:0!important;
      box-shadow:none!important;
    }

    .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .sf-blueprint-intro .editorial-heading {
      width:100%!important;
      margin:0!important;
      padding:0!important;
      background:transparent!important;
      border:0!important;
      box-shadow:none!important;
    }

    .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .sf-blueprint-intro .editorial-heading > * {
      margin-left:0!important;
      margin-right:0!important;
    }

    .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .sf-blueprint-intro-divider {
      width:calc(100% + 96px)!important;
      height:1px!important;
      margin:18px 0 0 -48px!important;
      background:rgba(255,255,255,.12)!important;
      border:0!important;
    }

    .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .sf-blueprint-controls {
      position:relative!important;
      z-index:20!important;
      display:flex!important;
      align-items:center!important;
      justify-content:flex-end!important;
      gap:8px!important;
      width:100%!important;
      box-sizing:border-box!important;
      padding:10px 20px 0!important;
      margin:0!important;
      background:#000!important;
    }

    .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .sf-blueprint-controls .blueprint-canvas-btn {
      position:relative!important;
      inset:auto!important;
      top:auto!important;
      right:auto!important;
      bottom:auto!important;
      left:auto!important;
      width:42px!important;
      height:42px!important;
      min-width:42px!important;
      min-height:42px!important;
      max-width:42px!important;
      max-height:42px!important;
      margin:0!important;
      padding:0!important;
      display:inline-flex!important;
      align-items:center!important;
      justify-content:center!important;
      box-sizing:border-box!important;
      border-radius:12px!important;
      background:#101B2E!important;
      border:1px solid rgba(94,164,255,.20)!important;
      color:#CBD5E1!important;
      box-shadow:0 8px 18px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04)!important;
    }

    .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .sf-blueprint-controls .blueprint-canvas-btn svg {
      width:18px!important;
      height:18px!important;
      display:block!important;
    }

    .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .sf-blueprint-controls .blueprint-canvas-btn:hover {
      background:#101B2E!important;
      color:#F8FAFC!important;
    }

    .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .blueprint-workflow-stream {
      padding-top:46px!important;
    }

    @media(max-width:700px){
      .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .sf-blueprint-intro {
        padding:20px 24px 0!important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .sf-blueprint-intro-divider {
        width:calc(100% + 48px)!important;
        margin:16px 0 0 -24px!important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .sf-blueprint-controls {
        padding:8px 16px 0!important;
        gap:8px!important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .sf-blueprint-controls .blueprint-canvas-btn {
        width:40px!important;
        height:40px!important;
        min-width:40px!important;
        min-height:40px!important;
        max-width:40px!important;
        max-height:40px!important;
        border-radius:11px!important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-workflow-ui-fixed .blueprint-workflow-stream {
        padding-top:44px!important;
      }
    }
  `;
  document.head.appendChild(style);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkflowUI, { once: true });
  } else {
    initWorkflowUI();
  }
})();
