import('/resource-workflow-v3.js').then(() => {
  const init = () => {
    const section = document.querySelector('.workflow-section.sf-v3');
    if (!section) return;

    if (!document.querySelector('#sf-workflow-v4-style')) {
      const style = document.createElement('style');
      style.id = 'sf-workflow-v4-style';
      style.textContent = `
        .workflow-section.sf-v3 .workflow-card { transition: border-color .2s ease, background .2s ease; }
        .workflow-section.sf-v3 .workflow-step { display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:12px; min-height:44px; cursor:pointer; }
        .workflow-section.sf-v3 .workflow-step > div { min-width:0; }
        .workflow-section.sf-v3 .workflow-step .workflow-chevron { width:30px; height:30px; display:grid; place-items:center; border:1px solid var(--line); border-radius:50%; color:var(--muted); transition:transform .2s ease, color .2s ease; }
        .workflow-section.sf-v3 .workflow-step .workflow-chevron svg { width:15px; height:15px; }
        .workflow-section.sf-v3 .workflow-card .workflow-body { display:grid; grid-template-rows:0fr; gap:0; margin-top:0; overflow:hidden; opacity:0; transition:grid-template-rows .28s ease, opacity .2s ease, margin-top .28s ease; }
        .workflow-section.sf-v3 .workflow-card .workflow-body > * { min-height:0; }
        .workflow-section.sf-v3 .workflow-card.is-open .workflow-body { grid-template-rows:1fr; gap:16px; margin-top:20px; opacity:1; overflow:visible; }
        .workflow-section.sf-v3 .workflow-card.is-open .workflow-chevron { transform:rotate(180deg); color:var(--accent); }
        .workflow-section.sf-v3 .workflow-card.is-open { border-color:rgba(61,214,208,.32); }
        .sf-full-prompt { margin-top:24px; }
        .sf-full-prompt .sf-prompt-shell { overflow:hidden; border:1px solid var(--line); border-radius:18px; background:var(--surface); }
        .sf-full-prompt .sf-prompt-toolbar { display:grid; grid-template-columns:auto 1fr auto; align-items:center; border-bottom:1px solid var(--line); }
        .sf-full-prompt button { min-height:44px; padding:0 12px; border:0; color:var(--text); background:rgba(16,34,56,.45); font:inherit; font-size:11px; font-weight:850; }
        .sf-full-prompt .sf-prompt-title { text-align:center; color:var(--muted); font-size:9px; font-weight:850; letter-spacing:.12em; text-transform:uppercase; }
        .sf-full-prompt pre { max-height:300px; overflow:auto; margin:0; padding:16px; white-space:pre-wrap; overflow-wrap:anywhere; color:var(--text); font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace; }
        .sf-full-prompt .sf-prompt-download { width:100%; border-top:1px solid var(--line); }
      `;
      document.head.appendChild(style);
    }

    const dialog = document.querySelector('[data-dialog]');
    const prompt = dialog?.querySelector('pre')?.textContent?.trim() || '';
    const title = document.querySelector('.resource-intro h1')?.textContent?.trim() || 'Skill Foundry Prompt';

    [...section.querySelectorAll('.workflow-card')].forEach((card, index) => {
      const header = card.querySelector('.workflow-step');
      const body = card.querySelector('.workflow-body');
      if (!header || !body || header.dataset.accordionReady) return;
      header.dataset.accordionReady = 'true';
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-expanded', 'false');
      const chevron = document.createElement('span');
      chevron.className = 'workflow-chevron';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
      header.appendChild(chevron);
      const toggle = () => {
        const open = card.classList.toggle('is-open');
        header.setAttribute('aria-expanded', String(open));
      };
      header.addEventListener('click', toggle);
      header.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
      });
      card.setAttribute('data-step', String(index + 1));
    });

    if (prompt && !document.querySelector('.sf-full-prompt')) {
      const sectionNode = document.createElement('section');
      sectionNode.className = 'resource-section prompt-section sf-full-prompt';
      sectionNode.id = 'prompt';
      sectionNode.innerHTML = `
        <div class="section-heading"><div><p class="eyebrow">FULL GUIDE</p><h2>Use the prompt</h2><p class="section-subcopy">The complete prompt is below. Copy it, expand it, or download it when you're ready to use it.</p></div></div>
        <div class="sf-prompt-shell">
          <div class="sf-prompt-toolbar" role="toolbar" aria-label="Prompt actions">
            <button type="button" class="sf-prompt-copy">Copy</button>
            <div class="sf-prompt-title">Full Prompt</div>
            <button type="button" class="sf-prompt-expand">Expand</button>
          </div>
          <pre></pre>
          <button type="button" class="sf-prompt-download">Download PDF</button>
        </div>`;
      sectionNode.querySelector('pre').textContent = prompt;
      const copyButton = sectionNode.querySelector('.sf-prompt-copy');
      copyButton.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(prompt); copyButton.textContent = 'Copied'; setTimeout(() => copyButton.textContent = 'Copy', 1200); } catch { copyButton.textContent = 'Copy failed'; }
      });
      sectionNode.querySelector('.sf-prompt-expand').addEventListener('click', () => {
        if (dialog?.showModal) dialog.showModal();
      });
      sectionNode.querySelector('.sf-prompt-download').addEventListener('click', () => {
        const blob = new Blob([prompt], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'skill-foundry-prompt'}.txt`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
      const finalResult = section.querySelector('.workflow-final-result');
      (finalResult || section).parentNode.insertBefore(sectionNode, (finalResult || section).nextSibling);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
}).catch(() => {});
