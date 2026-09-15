(() => {
  const init = () => {
    const link = document.querySelector('.quick-actions a[href="#prompt"]');
    if (link) {
      const guide = document.createElement('div');
      guide.className = 'guide-instruction';
      guide.textContent = 'Follow the detailed guide below ↓';
      guide.setAttribute('aria-label', 'Follow the detailed guide below');
      link.replaceWith(guide);
    }

    if (!document.querySelector('#sf-guide-instruction-style')) {
      const style = document.createElement('style');
      style.id = 'sf-guide-instruction-style';
      style.textContent = `
        .guide-instruction {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 46px;
          box-sizing: border-box;
          padding: 12px 16px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: transparent;
          color: var(--text);
          font-size: 13px;
          font-weight: 750;
          line-height: 1.35;
          text-align: center;
        }
        @media (min-width: 769px) {
          .guide-instruction { width: fit-content; min-height: 48px; padding-inline: 20px; }
        }
        .workflow-structured-body{display:grid;gap:10px;margin-top:18px}
        .workflow-structured-node{display:grid;gap:5px;padding:14px 15px;border:1px solid var(--line);border-radius:13px;background:rgba(7,17,31,.38)}
        .workflow-structured-node span{color:var(--accent);font-size:9px;font-weight:850;letter-spacing:.14em}
        .workflow-structured-node strong,.workflow-structured-node p{margin:0;color:var(--text);font-size:13px;line-height:1.55}
        .workflow-structured-node p{color:var(--muted);white-space:pre-wrap}
        .workflow-structured-arrow{display:grid;place-items:center;color:var(--muted);font-size:16px;line-height:1}
        .workflow-prompt-link{display:inline-flex;margin-top:18px}
        @media (min-width:769px){
          .workflow-structured-body{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 12px}
          .workflow-structured-arrow{display:none}
        }
      `;
      document.head.appendChild(style);
    }

    document.querySelectorAll('.workflow-card').forEach(card => {
      const process = card.querySelector('.workflow-action p');
      if (!process) return;
      const raw = process.textContent?.trim() || '';
      if (!raw.startsWith('[[SF_WORKFLOW]]')) return;
      let data;
      try {
        data = JSON.parse(raw.slice('[[SF_WORKFLOW]]'.length));
      } catch {
        return;
      }

      const body = card.querySelector('.workflow-body');
      if (!body) return;
      body.className = 'workflow-structured-body';
      body.innerHTML = '';

      const addNode = (label, value, strong = false) => {
        if (!value) return;
        const node = document.createElement('div');
        node.className = 'workflow-structured-node';
        const tag = document.createElement('span');
        tag.textContent = label;
        node.appendChild(tag);
        const content = document.createElement(strong ? 'strong' : 'p');
        content.textContent = value;
        node.appendChild(content);
        body.appendChild(node);
      };

      addNode('TOOL', data.tool, true);
      addNode('INPUT', data.input);
      addNode('PROCESS / PROMPT', data.process || data.description);
      addNode('OUTPUT', data.output);
      addNode('NEXT STEP', data.next);
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
