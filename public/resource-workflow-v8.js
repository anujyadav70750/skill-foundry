(() => {
  const prepare = () => {
    const section = document.querySelector('.workflow-section');
    const list = section?.querySelector('.workflow-list');
    if (!section || !list) return;
    let cards = [...list.querySelectorAll('.workflow-card')];
    while (cards.length < 5 && cards.length) {
      const clone = cards[cards.length - 1].cloneNode(true);
      const index = cards.length;
      clone.querySelector('.workflow-number')?.replaceChildren(document.createTextNode(String(index + 1).padStart(2, '0')));
      clone.querySelector('.workflow-label')?.replaceChildren(document.createTextNode(`STEP ${String(index + 1).padStart(2, '0')}`));
      clone.querySelector('.workflow-body')?.replaceChildren();
      list.append(clone);
      cards = [...list.querySelectorAll('.workflow-card')];
    }
    cards = [...list.querySelectorAll('.workflow-card')];
    cards.forEach((card, index) => {
      card.querySelectorAll('.workflow-connector').forEach(node => node.remove());
      if (index < cards.length - 1) {
        const connector = document.createElement('div');
        connector.className = 'workflow-connector';
        connector.setAttribute('aria-hidden', 'true');
        card.append(connector);
      }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepare, { once: true }); else prepare();
  import('/resource-workflow-v7.js?v=20260915-2').catch(() => {});
})();
