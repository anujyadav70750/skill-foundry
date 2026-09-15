(() => {
  const init = () => {
    document.querySelectorAll('.workflow-card').forEach(card => {
      if (card.dataset.workflowData) return;
      const inputNode = [...card.querySelectorAll('.workflow-node')].find(node => node.querySelector('span')?.textContent?.trim().toUpperCase() === 'INPUT');
      const raw = inputNode?.querySelector('p')?.textContent?.trim() || '';
      if (!raw.startsWith('[[SF_INPUTS]]')) return;
      try {
        const data = JSON.parse(raw.slice('[[SF_INPUTS]]'.length));
        card.dataset.workflowData = JSON.stringify(data);
      } catch {}
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
