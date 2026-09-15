import('/resource-workflow-v8.js?v=20260915-4').then(() => {
  const setupPrompts = () => {
    const section = document.querySelector('.workflow-section.sf-v7');
    if (!section) return false;

    const actions = section.querySelectorAll('.sf-v7-action');
    if (!actions.length) return false;

    const downloadPdf = (text, name) => {
      const esc = (value) => String(value).replace(/[^\x20-\x7E]/g, '?').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      const lines = [];
      String(text).split(/\r?\n/).forEach((line) => {
        let current = line;
        while (current.length > 78) {
          let cut = current.lastIndexOf(' ', 78);
          if (cut < 1) cut = 78;
          lines.push(current.slice(0, cut));
          current = current.slice(cut).trimStart();
        }
        lines.push(current);
      });
      const encoder = new TextEncoder();
      const chunks = [];
      const add = (value) => chunks.push(encoder.encode(value));
      add('%PDF-1.4\n');
      const body = ['BT', '/F1 10 Tf', '48 760 Td', '13 TL'];
      lines.forEach((line) => body.push(`(${esc(line)}) Tj`, 'T*'));
      body.push('ET');
      const stream = body.join('\n');
      const objects = [
        '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
        '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n',
        '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n',
        '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Courier >> endobj\n',
        `5 0 obj << /Length ${encoder.encode(stream).length} >> stream\n${stream}\nendstream endobj\n`
      ];
      const offsets = [];
      objects.forEach((object) => { offsets.push(chunks.reduce((sum, chunk) => sum + chunk.length, 0)); add(object); });
      const start = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      add(`xref\n0 6\n0000000000 65535 f \n${offsets.map((offset) => String(offset).padStart(10, '0') + ' 00000 n ').join('\n')}\ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`);
      const url = URL.createObjectURL(new Blob(chunks, { type: 'application/pdf' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = (String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'skill-foundry-prompt') + '.pdf';
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const openDialog = (text, title) => {
      const dialog = document.createElement('dialog');
      dialog.className = 'prompt-dialog';
      dialog.setAttribute('aria-labelledby', 'sf-workflow-prompt-title');
      dialog.innerHTML = `<div class="dialog-card"><div class="section-heading"><div><p class="eyebrow">FULL PROMPT</p><h2 id="sf-workflow-prompt-title"></h2></div><button type="button" class="dialog-close" data-close aria-label="Close prompt">×</button></div><pre></pre><button class="button button-primary" type="button" data-copy>Copy full prompt</button></div>`;
      dialog.querySelector('h2').textContent = title || 'Full Prompt';
      dialog.querySelector('pre').textContent = text;
      const close = () => dialog.close();
      dialog.querySelector('[data-close]').addEventListener('click', close);
      dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
      dialog.querySelector('[data-copy]').addEventListener('click', async (event) => {
        try {
          await navigator.clipboard.writeText(text);
          event.currentTarget.textContent = 'Copied';
          setTimeout(() => { if (event.currentTarget.isConnected) event.currentTarget.textContent = 'Copy full prompt'; }, 1200);
        } catch {}
      });
      document.body.appendChild(dialog);
      dialog.addEventListener('close', () => dialog.remove(), { once: true });
      dialog.showModal();
    };

    actions.forEach((action, index) => {
      const oldPrompt = action.querySelector('.sf-v7-prompt');
      if (!oldPrompt || action.dataset.sfPromptReady === 'true') return;
      const text = oldPrompt.textContent || '';
      const heading = action.closest('.workflow-card')?.querySelector('h3')?.textContent?.trim() || `Step ${String(index + 1).padStart(2, '0')}`;

      const shell = document.createElement('div');
      shell.className = 'prompt-shell';
      const toolbar = document.createElement('div');
      toolbar.className = 'prompt-toolbar';
      toolbar.setAttribute('role', 'toolbar');
      toolbar.setAttribute('aria-label', 'Prompt actions');

      const copy = document.createElement('button');
      copy.className = 'prompt-control';
      copy.type = 'button';
      copy.textContent = 'Copy';

      const label = document.createElement('div');
      label.className = 'prompt-label';
      label.textContent = 'Full Prompt';

      const expand = document.createElement('button');
      expand.className = 'prompt-control';
      expand.type = 'button';
      expand.textContent = 'Expand';

      toolbar.append(copy, label, expand);
      const pre = document.createElement('pre');
      pre.textContent = text;
      const download = document.createElement('button');
      download.className = 'prompt-download';
      download.type = 'button';
      download.textContent = 'Download PDF';
      shell.append(toolbar, pre, download);
      action.replaceChildren(shell);
      action.dataset.sfPromptReady = 'true';

      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(text);
          copy.textContent = 'Copied';
          setTimeout(() => { if (copy.isConnected) copy.textContent = 'Copy'; }, 1200);
        } catch {}
      });
      expand.addEventListener('click', () => openDialog(text, heading));
      download.addEventListener('click', () => downloadPdf(text, heading));
    });
    return true;
  };

  const runWhenReady = () => {
    if (setupPrompts()) return;
    let attempts = 0;
    const retry = () => {
      attempts += 1;
      if (setupPrompts() || attempts >= 60) return;
      setTimeout(retry, 50);
    };
    retry();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runWhenReady, { once: true });
  } else {
    runWhenReady();
  }
});