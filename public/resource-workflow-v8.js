import('/resource-workflow-v7.js?v=20260915-2').then(() => {
  const fix = () => {
    const section = document.querySelector('.workflow-section.sf-v7');
    if (!section) return;

    section.querySelectorAll('.workflow-card').forEach((card) => {
      const body = card.querySelector('.workflow-body');
      const tool = body?.querySelector('.sf-v7-tool');
      const settings = body?.querySelector('.sf-v7-settings');
      if (!body || !tool) return;

      if (settings) tool.insertAdjacentElement('afterend', settings);

      const purposeLabel = tool.querySelector('.sf-v7-purpose b');
      if (purposeLabel) purposeLabel.style.display = 'none';

      const purposeText = tool.querySelector('.sf-v7-purpose span');
      if (purposeText) {
        purposeText.style.fontSize = '12px';
        purposeText.style.fontWeight = '800';
      }

      const link = tool.querySelector('a');
      const img = tool.querySelector('img');
      if (link && img) {
        link.href = 'https://flow.google/';
        link.setAttribute('aria-label', 'Google Flow');
        img.src = 'https://flow.google/favicon.ico';
        img.onerror = () => {
          img.onerror = null;
          img.src = '/api/tool-logo?url=' + encodeURIComponent('https://flow.google/');
        };
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fix, { once: true });
  } else {
    fix();
  }
});
