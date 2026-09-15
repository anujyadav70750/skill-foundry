import('/resource-workflow-v8.js?v=20260915-4').then(() => {
  const setupPrompts = () => {
    const section = document.querySelector('.workflow-section.sf-v7');
    if (!section) return;

    if (!document.getElementById('sf-workflow-prompt-style')) {
      const style = document.createElement('style');
      style.id = 'sf-workflow-prompt-style';
      style.textContent = `
        .workflow-section.sf-v7 .sf-v7-action{position:relative;background:#050b13!important;border:1px solid var(--line)!important;border-radius:16px!important;overflow:hidden!important}
        .workflow-section.sf-v7 .sf-v7-prompt-toolbar{display:grid;grid-template-columns:auto 1fr auto;align-items:stretch;min-height:48px;border-bottom:1px solid var(--line);background:#050b13}
        .workflow-section.sf-v7 .sf-v7-prompt-control{min-width:82px;padding:0 16px;border:0;background:#0d1b2d;color:var(--text);font:inherit;font-size:12px;font-weight:800;cursor:pointer}
        .workflow-section.sf-v7 .sf-v7-prompt-control:hover,.workflow-section.sf-v7 .sf-v7-prompt-control:focus-visible{background:rgba(61,214,208,.08);color:var(--accent);outline:none}
        .workflow-section.sf-v7 .sf-v7-prompt-label{display:grid;place-items:center;padding:0 14px;border-left:1px solid var(--line);border-right:1px solid var(--line);background:#050b13;color:var(--muted);font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;cursor:default;user-select:none}
        .workflow-section.sf-v7 .sf-v7-prompt-text{margin:0;padding:22px 22px 24px;max-height:360px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;color:#dce8f4;font:14px/1.7 ui-monospace,SFMono-Regular,Menlo,monospace}
        .workflow-section.sf-v7 .sf-v7-prompt-download{display:flex;width:100%;min-height:44px;align-items:center;justify-content:center;padding:0 16px;border:0;border-top:1px solid var(--line);background:#0d1b2d;color:var(--text);font:inherit;font-size:12px;font-weight:800;cursor:pointer}
        .workflow-section.sf-v7 .sf-v7-prompt-download:hover,.workflow-section.sf-v7 .sf-v7-prompt-download:focus-visible{background:rgba(61,214,208,.08);color:var(--accent);outline:none}
        .sf-workflow-prompt-dialog{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(3,8,15,.78);backdrop-filter:blur(8px)}
        .sf-workflow-prompt-dialog.is-open{display:flex}
        .sf-workflow-prompt-dialog .card{width:min(900px,100%);max-height:90vh;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;border:1px solid var(--line);border-radius:16px;background:#050b13;box-shadow:0 24px 70px rgba(0,0,0,.45)}
        .sf-workflow-prompt-dialog .head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:14px 16px;border-bottom:1px solid var(--line)}
        .sf-workflow-prompt-dialog .head strong{color:var(--text);font-size:13px;line-height:1.35}
        .sf-workflow-prompt-dialog .close{min-width:40px;height:40px;padding:0;border:1px solid var(--line);border-radius:10px;background:#0d1b2d;color:var(--text);font:inherit;font-size:20px;cursor:pointer}
        .sf-workflow-prompt-dialog .body{margin:0;padding:18px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;color:#dce8f4;font:14px/1.7 ui-monospace,SFMono-Regular,Menlo,monospace}
        .sf-workflow-prompt-dialog .copy{min-height:44px;border:0;border-top:1px solid var(--line);background:#0d1b2d;color:var(--text);font:inherit;font-size:12px;font-weight:800;cursor:pointer}
        .sf-workflow-prompt-dialog .copy:hover,.sf-workflow-prompt-dialog .copy:focus-visible{background:rgba(61,214,208,.08);color:var(--accent);outline:none}
        @media(max-width:600px){
          .workflow-section.sf-v7 .sf-v7-prompt-control{min-width:68px;padding-inline:10px}
          .workflow-section.sf-v7 .sf-v7-prompt-label{padding-inline:10px}
          .workflow-section.sf-v7 .sf-v7-prompt-text{padding:18px 14px 20px;font-size:13px}
          .sf-workflow-prompt-dialog{padding:10px}
          .sf-workflow-prompt-dialog .card{max-height:94vh}
          .sf-workflow-prompt-dialog .body{padding:14px;font-size:13px}
        }
      `;
      document.head.appendChild(style);
    }

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
      const dialog = document.createElement('div');
      dialog.className = 'sf-workflow-prompt-dialog is-open';
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.innerHTML = `<div class="card"><div class="head"><strong></strong><button class="close" type="button" aria-label="Close prompt">×</button></div><pre class="body"></pre><button class="copy" type="button">Copy full prompt</button></div>`;
      dialog.querySelector('.head strong').textContent = title || 'Full Prompt';
      dialog.querySelector('.body').textContent = text;
      const close = () => { dialog.remove(); document.body.style.overflow = ''; };
      dialog.querySelector('.close').addEventListener('click', close);
      dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
      dialog.querySelector('.copy').addEventListener('click', async (event) => {
        try { await navigator.clipboard.writeText(text); event.currentTarget.textContent = 'Copied'; setTimeout(() => { if (event.currentTarget.isConnected) event.currentTarget.textContent = 'Copy full prompt'; }, 1200); } catch {}
      });
      document.body.appendChild(dialog);
      document.body.style.overflow = 'hidden';
    };

    section.querySelectorAll('.sf-v7-action').forEach((action, index) => {
      if (action.dataset.sfPromptReady === 'true') return;
      const oldPrompt = action.querySelector('.sf-v7-prompt');
      if (!oldPrompt) return;
      const text = oldPrompt.textContent || '';
      const card = action.closest('.workflow-card');
      const heading = card?.querySelector('h3')?.textContent?.trim() || `Step ${String(index + 1).padStart(2, '0')}`;
      const toolbar = document.createElement('div');
      toolbar.className = 'sf-v7-prompt-toolbar';
      toolbar.setAttribute('role', 'toolbar');
      toolbar.setAttribute('aria-label', 'Prompt actions');
      const copy = document.createElement('button');
      copy.className = 'sf-v7-prompt-control'; copy.type = 'button'; copy.textContent = 'Copy';
      const label = document.createElement('div');
      label.className = 'sf-v7-prompt-label'; label.textContent = 'Full Prompt';
      const expand = document.createElement('button');
      expand.className = 'sf-v7-prompt-control'; expand.type = 'button'; expand.textContent = 'Expand';
      toolbar.append(copy, label, expand);
      const pre = document.createElement('pre');
      pre.className = 'sf-v7-prompt-text'; pre.textContent = text;
      const download = document.createElement('button');
      download.className = 'sf-v7-prompt-download'; download.type = 'button'; download.textContent = 'Download PDF';
      action.innerHTML = '';
      action.append(toolbar, pre, download);
      action.dataset.sfPromptReady = 'true';

      copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(text); copy.textContent = 'Copied'; setTimeout(() => { if (copy.isConnected) copy.textContent = 'Copy'; }, 1200); } catch {}
      });
      expand.addEventListener('click', () => openDialog(text, heading));
      download.addEventListener('click', () => downloadPdf(text, heading));
    });
  };

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
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { setupPrompts(); setupExpand(); }, { once: true });
  } else {
    setupPrompts();
    setupExpand();
  }
});
