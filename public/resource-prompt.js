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
        .guide-instruction { display:flex; align-items:center; justify-content:center; width:100%; min-height:46px; box-sizing:border-box; padding:12px 16px; border:1px solid var(--line); border-radius:12px; background:transparent; color:var(--text); font-size:13px; font-weight:750; line-height:1.35; text-align:center; }
        @media (min-width:769px){ .guide-instruction{width:fit-content;min-height:48px;padding-inline:20px} }
        .workflow-structured-body{display:grid;gap:10px;margin-top:18px}
        .workflow-structured-node{display:grid;gap:5px;padding:14px 15px;border:1px solid var(--line);border-radius:13px;background:rgba(7,17,31,.38);min-width:0}
        .workflow-structured-node span{color:var(--accent);font-size:9px;font-weight:850;letter-spacing:.14em}
        .workflow-structured-node strong,.workflow-structured-node p{margin:0;color:var(--text);font-size:13px;line-height:1.55}
        .workflow-structured-node p{color:var(--muted);white-space:pre-wrap;overflow-wrap:anywhere}
        .workflow-prompt-link{display:inline-flex;margin-top:18px}
        .workflow-prompt-shell{margin-top:0;overflow:hidden;border:1px solid var(--line);border-radius:16px;background:var(--surface)}
        .workflow-prompt-shell .prompt-toolbar{display:grid;grid-template-columns:auto 1fr auto;align-items:stretch;min-height:46px;border-bottom:1px solid var(--line)}
        .workflow-prompt-shell .prompt-label{display:flex;align-items:center;justify-content:center;min-width:0;padding:0 10px;color:var(--muted);font-size:10px;font-weight:850;letter-spacing:.12em;text-transform:uppercase;text-align:center}
        .workflow-prompt-shell .prompt-control{min-width:88px;min-height:46px;padding:0 14px;border:0;background:rgba(16,34,56,.34);color:var(--text);font:inherit;font-size:12px;font-weight:850;cursor:pointer}
        .workflow-prompt-shell .prompt-copy{border-right:1px solid var(--line)}
        .workflow-prompt-shell .prompt-expand{border-left:1px solid var(--line)}
        .workflow-prompt-shell .prompt-control:hover,.workflow-prompt-shell .prompt-control:focus-visible{background:rgba(61,214,208,.08);color:var(--accent);outline:none}
        .workflow-prompt-shell pre{box-sizing:border-box;margin:0;padding:18px;max-height:270px;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;color:var(--text);font:inherit;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:12.5px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;scrollbar-width:thin}
        .workflow-prompt-shell .prompt-download{display:block;width:100%;min-height:44px;padding:0 14px;border:0;border-top:1px solid var(--line);background:rgba(16,34,56,.52);color:var(--text);font:inherit;font-size:12px;font-weight:850;cursor:pointer}
        .workflow-prompt-shell .prompt-download:hover,.workflow-prompt-shell .prompt-download:focus-visible{color:var(--accent);background:rgba(61,214,208,.08);outline:none}
        @media (min-width:769px){ .workflow-structured-body{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 12px} .workflow-prompt-shell{grid-column:1/-1} }
        @media (max-width:768px){ .workflow-prompt-shell .prompt-label{font-size:9px;padding-inline:6px}.workflow-prompt-shell .prompt-control{min-width:72px;padding-inline:9px}.workflow-prompt-shell pre{font-size:12px;padding:16px;max-height:240px} }
      `;
      document.head.appendChild(style);
    }

    const promptText = document.querySelector('#prompt-text');
    const status = document.querySelector('[data-status]');
    const dialog = document.querySelector('[data-dialog]');
    const dialogTitle = dialog?.querySelector('#prompt-dialog-title');
    const dialogText = dialog?.querySelector('pre');
    const pageTitle = document.title.replace(/\s*\|\s*Skill Foundry\s*$/i, '').trim() || 'Skill Foundry Prompt';

    const makePdf = (source, title = pageTitle) => {
      const lines = [];
      const maxChars = 78;
      String(source || '').split(/\r?\n/).forEach((line) => {
        if (!line) { lines.push(''); return; }
        let remaining = line;
        while (remaining.length > maxChars) {
          let cut = remaining.lastIndexOf(' ', maxChars);
          if (cut < 1) cut = maxChars;
          lines.push(remaining.slice(0, cut));
          remaining = remaining.slice(cut).trimStart();
        }
        lines.push(remaining);
      });
      const encoder = new TextEncoder();
      const chunks = [];
      const add = (text) => chunks.push(encoder.encode(text));
      add('%PDF-1.4\n');
      const objects = [];
      const contentLines = ['BT', '/F1 10 Tf', '48 760 Td', '13 TL'];
      lines.forEach((line) => {
        const safe = line.replace(/[^\x20-\x7E]/g, '?').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
        contentLines.push(`(${safe}) Tj`, 'T*');
      });
      contentLines.push('ET');
      const stream = contentLines.join('\n');
      objects.push(
        '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
        '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n',
        '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n',
        '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Courier >> endobj\n',
        `5 0 obj << /Length ${encoder.encode(stream).length} >> stream\n${stream}\nendstream endobj\n`
      );
      const offsets = [];
      objects.forEach((object) => { offsets.push(chunks.reduce((sum, chunk) => sum + chunk.length, 0)); add(object); });
      const xref = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      add(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
      const url = URL.createObjectURL(new Blob(chunks, { type: 'application/pdf' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${String(title).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'skill-foundry-prompt'}.pdf`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const copyText = async (source) => {
      try { await navigator.clipboard.writeText(source); if (status) status.textContent = 'Prompt copied.'; }
      catch { if (status) status.textContent = 'Copy failed. Select the prompt text and copy it manually.'; }
    };

    const openPrompt = (title, source) => {
      if (!dialog || !dialogTitle || !dialogText) return;
      dialogTitle.textContent = title || pageTitle;
      dialogText.textContent = source || '';
      dialog.showModal();
    };

    document.querySelectorAll('.workflow-card').forEach((card) => {
      const body = card.querySelector('.workflow-body');
      if (!body) return;

      const readNode = (label) => {
        const nodes = [...body.querySelectorAll('.workflow-node')];
        const node = nodes.find((item) => item.querySelector('span')?.textContent?.trim() === label);
        return node?.querySelector('p,strong')?.textContent?.trim() || '';
      };

      const legacyProcess = body.querySelector('.workflow-action p')?.textContent?.trim() || '';
      let data = null;
      if (legacyProcess.startsWith('[[SF_WORKFLOW]]')) {
        try { data = JSON.parse(legacyProcess.slice('[[SF_WORKFLOW]]'.length)); } catch { data = null; }
      }

      // Use structured renderer fields when available; fall back to the legacy marker.
      const tool = data?.tool?.trim() || readNode('TOOL');
      const input = data?.input?.trim() || readNode('INPUT');
      const process = data?.process?.trim() || data?.description?.trim() || legacyProcess.replace(/^\[\[SF_WORKFLOW\]\].*$/s, '') || readNode('PROCESS / PROMPT');
      const output = data?.output?.trim() || readNode('OUTPUT');
      const next = data?.next?.trim() || readNode('NEXT STEP');
      if (!tool && !input && !process && !output && !next) return;

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

      addNode('TOOL', tool, true);
      const inputs = String(input || '').split(/\r?\n/).map((value) => value.trim()).filter(Boolean).slice(0, 10);
      inputs.forEach((value, index) => addNode(inputs.length > 1 ? `INPUT ${index + 1}` : 'INPUT', value));

      if (process) {
        const node = document.createElement('div');
        node.className = 'workflow-prompt-shell';
        const toolbar = document.createElement('div');
        toolbar.className = 'prompt-toolbar';
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Step prompt actions');
        const copy = document.createElement('button');
        copy.type = 'button'; copy.className = 'prompt-control prompt-copy'; copy.textContent = 'Copy';
        const label = document.createElement('div');
        label.className = 'prompt-label'; label.textContent = 'Step Prompt';
        const expand = document.createElement('button');
        expand.type = 'button'; expand.className = 'prompt-control prompt-expand'; expand.textContent = 'Expand';
        toolbar.append(copy, label, expand);
        const pre = document.createElement('pre'); pre.textContent = process;
        const download = document.createElement('button');
        download.type = 'button'; download.className = 'prompt-download'; download.textContent = 'Download PDF';
        node.append(toolbar, pre, download);
        const stepTitle = card.querySelector('.workflow-step h3')?.textContent?.trim() || 'Step';
        copy.addEventListener('click', () => copyText(process));
        expand.addEventListener('click', () => openPrompt(`${stepTitle} — Step Prompt`, process));
        download.addEventListener('click', () => makePdf(process, `${pageTitle}-${stepTitle}`));
        body.appendChild(node);
      }

      addNode('OUTPUT', output);
      addNode('NEXT STEP', next);
    });

    document.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', () => {
      if (button.closest('.workflow-prompt-shell')) return;
      copyText(promptText?.textContent || '');
    }));
    document.querySelector('[data-download]')?.addEventListener('click', () => makePdf(promptText?.textContent || '', pageTitle));
    document.querySelector('[data-expand]')?.addEventListener('click', () => openPrompt(pageTitle, promptText?.textContent || ''));
    document.querySelector('[data-close]')?.addEventListener('click', () => dialog?.close());
    dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();