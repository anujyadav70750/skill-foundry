import('/resource-workflow-v8.js?v=20260915-4').then(() => {
  const setupExpand = () => {
    if (document.getElementById('sf-workflow-v9-style')) return;

    const style = document.createElement('style');
    style.id = 'sf-workflow-v9-style';
    style.textContent = `
      .workflow-section.sf-v7 .sf-v7-prompt.sf-v9-expanded{
        height:60vh!important;
        min-height:60vh!important;
        max-height:60vh!important;
        overflow-y:auto!important;
      }
      @media(max-width:420px){
        .workflow-section.sf-v7 .sf-v7-prompt.sf-v9-expanded{
          height:55vh!important;
          min-height:55vh!important;
          max-height:55vh!important;
        }
      }
    `;
    document.head.appendChild(style);

    document.addEventListener('click', (event) => {
      const button = event.target.closest('.sf-v7-head button');
      if (!button) return;
      const label = button.textContent.trim().toLowerCase();
      if (label !== 'expand' && label !== 'collapse') return;

      const action = button.closest('.sf-v7-action');
      const prompt = action?.querySelector('.sf-v7-prompt');
      if (!prompt) return;

      const expanded = prompt.classList.toggle('sf-v9-expanded');
      button.textContent = expanded ? 'Collapse' : 'Expand';
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupExpand, { once: true });
  } else {
    setupExpand();
  }
});
