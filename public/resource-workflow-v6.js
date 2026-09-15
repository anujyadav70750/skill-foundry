(() => {
  const normalize = value => String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  const findNode = (body, label) => {
    const wanted = normalize(label);
    return [...body.querySelectorAll('.workflow-node')].find(node => {
      const text = normalize(node.querySelector('span')?.textContent || '');
      return text === wanted || text.includes(wanted) || wanted.includes(text);
    });
  };
  const nodeText = (body, label) => {
    const node = findNode(body, label);
    return node?.querySelector('p,strong')?.textContent?.trim() || '';
  };
  const parseJson = value => {
    try { return JSON.parse(value || ''); } catch { return null; }
  };
  const copy = async text => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };
  const pdf = (text, name) => {
    const esc = s => String(s).replace(/[^\x20-\x7E]/g, '?').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    const lines = [];
    String(text || '').split(/\r?\n/).forEach(line => {
      let x = line;
      while (x.length > 82) { let n = x.lastIndexOf(' ', 82); if (n < 1) n = 82; lines.push(x.slice(0, n)); x = x.slice(n).trimStart(); }
      lines.push(x);
    });
    const enc = new TextEncoder(), chunks = [], add = s => chunks.push(enc.encode(s));
    add('%PDF-1.4\n');
    const body = ['BT', '/F1 10 Tf', '48 760 Td', '13 TL'];
    lines.forEach(x => body.push(`(${esc(x)}) Tj`, 'T*'));
    body.push('ET');
    const stream = body.join('\n');
    const objects = [
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n',
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n',
      '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Courier >> endobj\n',
      `5 0 obj << /Length ${enc.encode(stream).length} >> stream\n${stream}\nendstream endobj\n`
    ];
    const offsets = [];
    objects.forEach(o => { offsets.push(chunks.reduce((a, b) => a + b.length, 0)); add(o); });
    const start = chunks.reduce((a, b) => a + b.length, 0);
    add(`xref\n0 6\n0000000000 65535 f \n${offsets.map(n => String(n).padStart(10, '0') + ' 00000 n ').join('\n')}\ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`);
    const url = URL.createObjectURL(new Blob(chunks, { type: 'application/pdf' }));
    const a = document.createElement('a'); a.href = url; a.download = (String(name).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'skill-foundry') + '.pdf'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const inputType = value => {
    const x = String(value || '').toLowerCase();
    if (/document|pdf|docx|file/.test(x)) return 'document';
    if (/video|clip|footage|mp4|mov/.test(x)) return 'video';
    if (/audio|voice|sound|music|wav|mp3/.test(x)) return 'audio';
    if (/image|photo|picture|visual|png|jpg|jpeg|reference image/.test(x)) return 'image';
    return 'text';
  };
  const makeChip = data => {
    const hasImage = data.src && data.type === 'image';
    const el = document.createElement(hasImage ? 'figure' : 'div');
    el.className = 'sf-input-chip' + (hasImage ? ' sf-image-chip' : '');
    const type = document.createElement('span'); type.className = `sf-input-type ${data.type}`; type.textContent = String(data.type || 'text').toUpperCase(); el.append(type);
    if (hasImage) { const img = document.createElement('img'); img.src = data.src; img.alt = data.label || 'Input'; img.loading = 'lazy'; el.append(img); }
    const label = document.createElement(hasImage ? 'figcaption' : 'strong'); label.className = 'sf-input-role'; label.textContent = data.label || data.role || 'Input'; el.append(label);
    if (data.value && data.value !== data.src) { const value = document.createElement('span'); value.className = 'sf-input-value'; value.textContent = data.value; el.append(value); }
    return el;
  };
  const init = () => {
    const section = document.querySelector('.workflow-section');
    if (!section) return;
    const cards = [...section.querySelectorAll('.workflow-card')];
    if (!cards.length) return;
    if (!document.querySelector('#sf-workflow-v6-style')) {
      const style = document.createElement('style');
      style.id = 'sf-workflow-v6-style';
      style.textContent = `
        .workflow-section.sf-v6,.workflow-section.sf-v6 *{box-sizing:border-box}
        .workflow-section.sf-v6 .workflow-list{display:grid!important;gap:28px!important;width:100%!important;min-width:0!important}
        .workflow-section.sf-v6 .workflow-card{position:relative;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:20px 16px!important;border:1px solid rgba(148,163,184,.18)!important;border-radius:22px!important;background:linear-gradient(180deg,rgba(12,27,43,.96),rgba(7,20,34,.94))!important;overflow:visible!important}
        .workflow-section.sf-v6 .workflow-body{display:grid!important;gap:16px!important;width:100%!important;min-width:0!important;margin-top:18px!important;opacity:1!important;overflow:visible!important}
        .workflow-section.sf-v6 .workflow-chevron{display:none!important}
        .workflow-section.sf-v6 .workflow-connector{display:block!important;position:absolute!important;left:39px!important;bottom:-28px!important;width:1px!important;height:27px!important;background:rgba(61,214,208,.28)!important}
        .workflow-section.sf-v6 .workflow-connector:after{content:'↓';position:absolute;left:-7px;bottom:-9px;color:var(--accent);font-size:13px;line-height:1}
        .workflow-section.sf-v6 .sf-tool-row{display:flex!important;align-items:center!important;gap:12px!important;width:100%!important;min-width:0!important}
        .workflow-section.sf-v6 .sf-tool-logo-link{display:grid!important;place-items:center!important;flex:0 0 46px!important;width:46px!important;height:46px!important;padding:4px!important;border:1px solid rgba(148,163,184,.28)!important;border-radius:14px!important;background:rgba(255,255,255,.04)!important;overflow:hidden!important;text-decoration:none!important}
        .workflow-section.sf-v6 .sf-tool-logo-link img{display:block!important;width:38px!important;height:38px!important;max-width:38px!important;max-height:38px!important;object-fit:contain!important;border-radius:9px!important}
        .workflow-section.sf-v6 .sf-tool-purpose{display:grid!important;gap:3px!important;min-width:0!important}
        .workflow-section.sf-v6 .sf-tool-purpose-label{color:var(--accent)!important;font-size:8px!important;line-height:1.1!important;font-weight:900!important;letter-spacing:.14em!important;text-transform:uppercase!important}
        .workflow-section.sf-v6 .sf-tool-purpose-text{color:var(--text)!important;font-size:11px!important;line-height:1.4!important;font-weight:700!important;overflow-wrap:anywhere!important}
        .workflow-section.sf-v6 .sf-rail{display:flex!important;gap:8px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 8px!important;scrollbar-width:thin!important;scroll-snap-type:x proximity!important}
        .workflow-section.sf-v6 .sf-input-chip{position:relative!important;display:grid!important;grid-template-rows:auto auto 1fr!important;align-content:start!important;gap:8px!important;flex:0 0 210px!important;max-width:82vw!important;padding:0 12px 12px!important;border:1px solid var(--line)!important;border-radius:16px!important;background:rgba(16,34,56,.42)!important;color:var(--text)!important;font-size:12px!important;line-height:1.4!important;scroll-snap-align:start!important;overflow:hidden!important}
        .workflow-section.sf-v6 .sf-input-chip:not(.sf-image-chip){padding-top:0!important}
        .workflow-section.sf-v6 .sf-input-chip .sf-input-type{display:inline-flex!important;align-items:center!important;width:max-content!important;margin:0 -12px!important;padding:5px 10px!important;border-bottom-right-radius:10px!important;font-size:8px!important;font-weight:950!important;letter-spacing:.12em!important;text-transform:uppercase!important;color:#07111f!important}
        .workflow-section.sf-v6 .sf-input-chip .sf-input-type.image{background:#67e8f9!important}.workflow-section.sf-v6 .sf-input-chip .sf-input-type.video{background:#c4b5fd!important}.workflow-section.sf-v6 .sf-input-chip .sf-input-type.audio{background:#86efac!important}.workflow-section.sf-v6 .sf-input-chip .sf-input-type.text{background:#fde68a!important}.workflow-section.sf-v6 .sf-input-chip .sf-input-type.document{background:#fdba74!important}
        .workflow-section.sf-v6 .sf-input-chip .sf-input-role{display:block!important;color:var(--text)!important;font-size:12px!important;font-weight:800!important;overflow-wrap:anywhere!important}
        .workflow-section.sf-v6 .sf-input-chip .sf-input-value{display:block!important;color:var(--muted)!important;font-size:11px!important;line-height:1.45!important;overflow-wrap:anywhere!important}
        .workflow-section.sf-v6 .sf-image-chip{padding:0!important;grid-template-rows:auto auto auto!important}
        .workflow-section.sf-v6 .sf-image-chip img{display:block!important;width:100%!important;aspect-ratio:16/10!important;object-fit:cover!important}
        .workflow-section.sf-v6 .sf-image-chip .sf-input-type{margin:0!important}
        .workflow-section.sf-v6 .sf-image-chip .sf-input-role,.workflow-section.sf-v6 .sf-image-chip .sf-input-value{padding:0 12px!important}.workflow-section.sf-v6 .sf-image-chip .sf-input-value{padding-bottom:12px!important}
        .workflow-section.sf-v6 .sf-arrow{display:flex!important;align-items:center!important;gap:8px!important;color:var(--muted)!important;font-size:9px!important;font-weight:850!important;letter-spacing:.12em!important;text-transform:uppercase!important}
        .workflow-section.sf-v6 .sf-arrow:before{content:'↓';display:grid;place-items:center;width:24px;height:24px;border:1px solid rgba(61,214,208,.28);border-radius:50%;color:var(--accent);font-size:13px!important;flex:0 0 24px}
        .workflow-section.sf-v6 .sf-settings{display:flex!important;gap:7px!important;width:100%!important;min-width:0!important;overflow-x:auto!important;padding-bottom:2px!important}
        .workflow-section.sf-v6 .sf-setting{flex:0 0 auto!important;padding:8px 10px!important;border:1px solid var(--line)!important;border-radius:11px!important;background:rgba(16,34,56,.32)!important}
        .workflow-section.sf-v6 .sf-setting-label{display:block!important;color:var(--muted)!important;font-size:8px!important;font-weight:850!important;letter-spacing:.1em!important;text-transform:uppercase!important}.workflow-section.sf-v6 .sf-setting-value{display:block!important;margin-top:2px!important;color:var(--text)!important;font-size:11px!important;font-weight:800!important}
        .workflow-section.sf-v6 .sf-action{width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important;border:1px solid var(--line)!important;border-radius:15px!important;background:var(--surface)!important}
        .workflow-section.sf-v6 .sf-action-head{display:grid!important;grid-template-columns:56px minmax(0,1fr) 66px!important;width:100%!important;min-width:0!important}
        .workflow-section.sf-v6 .sf-action button{min-width:0!important;min-height:42px!important;white-space:nowrap!important;padding:0 7px!important;border:0!important;background:rgba(16,34,56,.45)!important;color:var(--text)!important;font:inherit!important;font-size:11px!important;font-weight:850!important;overflow:hidden!important}
        .workflow-section.sf-v6 .sf-action-title{min-width:0!important;display:flex!important;align-items:center!important;justify-content:center!important;color:var(--muted)!important;font-size:9px!important;font-weight:850!important;letter-spacing:.12em!important;text-transform:uppercase!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
        .workflow-section.sf-v6 .sf-action pre{display:block!important;width:100%!important;max-width:100%!important;height:132px!important;min-height:132px!important;max-height:132px!important;margin:0!important;padding:13px 14px!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important;word-break:break-word!important}
        .workflow-section.sf-v6 .sf-download{display:block!important;width:100%!important;min-height:40px!important;border:0!important;border-top:1px solid var(--line)!important;background:rgba(16,34,56,.45)!important;color:var(--text)!important;font:inherit!important;font-size:11px!important;font-weight:850!important}
        .workflow-section.sf-v6 .sf-output{width:100%!important;max-width:100%!important;padding:13px 14px!important;border:1px solid rgba(61,214,208,.22)!important;border-radius:14px!important;background:rgba(7,24,35,.36)!important;color:var(--text)!important;font-size:12px!important;line-height:1.5!important;overflow-wrap:anywhere!important}
        .workflow-section.sf-v6 .workflow-card:last-child .sf-arrow:last-child{display:none!important}
        .workflow-section.sf-v6 .sf-tool-logo-link.is-fallback{font-size:9px!important;font-weight:900!important;color:var(--muted)!important;text-transform:uppercase!important}
        .workflow-final-result{margin-top:22px;padding-top:24px;border-top:1px solid var(--line)}
        .workflow-final-result .results-gallery{display:grid;gap:14px}.workflow-final-result .result-card{margin:0;overflow:hidden;border:1px solid var(--line);border-radius:18px;background:var(--surface)}.workflow-final-result .result-card img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.workflow-final-result figcaption{display:grid;gap:3px;padding:10px 12px 12px}.workflow-final-result figcaption span{color:var(--accent);font-size:8px;font-weight:850;letter-spacing:.14em}.workflow-final-result figcaption strong{color:var(--text);font-size:12px}
        @media(max-width:420px){.workflow-section.sf-v6 .workflow-card{padding:18px 14px!important;border-radius:20px!important}.workflow-section.sf-v6 .workflow-list{gap:26px!important}.workflow-section.sf-v6 .workflow-body{gap:15px!important}.workflow-section.sf-v6 .sf-action-head{grid-template-columns:54px minmax(0,1fr) 64px!important}.workflow-section.sf-v6 .sf-action button{font-size:10px!important;padding-left:5px!important;padding-right:5px!important}.workflow-section.sf-v6 .sf-input-chip{flex-basis:190px!important}}
      `;
      document.head.appendChild(style);
    }
    const inputImages = [...document.querySelectorAll('.results-gallery .input-result img')];
    const resultImgs = [...document.querySelectorAll('.results-gallery .result-card:not(.input-result) img')];
    const cardsData = cards.map((card, i) => {
      const body = card.querySelector('.workflow-body');
      const structured = parseJson(card.dataset.workflowInputs || '') || [];
      const settings = parseJson(card.dataset.workflowSettings || '') || [];
      const tool = card.dataset.workflowTool || nodeText(body, 'TOOL');
      const legacyInput = card.dataset.workflowInput || nodeText(body, 'INPUT');
      const process = card.dataset.workflowProcess || nodeText(body, 'PROCESS / PROMPT') || nodeText(body, 'PROCESS');
      const output = card.dataset.workflowOutput || nodeText(body, 'OUTPUT');
      const next = card.dataset.workflowNext || nodeText(body, 'NEXT STEP');
      return { card, body, tool, legacyInput, inputs: structured, settings, process, output, next, title: card.querySelector('.workflow-step h3')?.textContent?.trim() || `Step ${i + 1}` };
    });
    cardsData.forEach((item, i) => {
      if (!item.body) return;
      item.body.innerHTML = '';
      if (item.tool) {
        const row = document.createElement('div'); row.className = 'sf-tool-row';
        const link = document.createElement('a'); link.className = 'sf-tool-logo-link'; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.setAttribute('aria-label', `Open ${item.tool}`); link.title = `Open ${item.tool}`;
        const nodes = [...document.querySelectorAll('.tools-list .tool-card,.tools-list .tool-logo-link')];
        const toolNode = nodes.find(n => normalize(n.dataset.toolName || n.querySelector('h3')?.textContent || n.getAttribute('aria-label')?.replace(/^Open /i, '')) === normalize(item.tool));
        const href = toolNode?.href || toolNode?.querySelector('.tool-link')?.href || '';
        const purpose = toolNode?.dataset.toolPurpose || toolNode?.querySelector('p')?.textContent?.trim() || '';
        if (href) link.href = href;
        const img = document.createElement('img'); img.alt = ''; img.width = 38; img.height = 38; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer';
        const fallback = () => { if (img.isConnected) img.remove(); link.classList.add('is-fallback'); link.textContent = item.tool.slice(0, 1).toUpperCase(); };
        img.onerror = fallback;
        const logoUrl = toolNode?.querySelector('img')?.currentSrc || toolNode?.querySelector('img')?.src || '';
        if (logoUrl) img.src = logoUrl; else if (href) { fetch('/api/tool-logo?url=' + encodeURIComponent(href), { credentials: 'same-origin', cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(d => { if (d?.logoUrl) img.src = d.logoUrl; else fallback(); }).catch(fallback); } else fallback();
        link.append(img);
        const purposeBox = document.createElement('div'); purposeBox.className = 'sf-tool-purpose'; const pl = document.createElement('span'); pl.className = 'sf-tool-purpose-label'; pl.textContent = 'TOOL USED FOR'; const pt = document.createElement('strong'); pt.className = 'sf-tool-purpose-text'; pt.textContent = purpose || 'Used at this step to create the output.'; purposeBox.append(pl, pt); row.append(link, purposeBox); item.body.append(row);
      }
      const stage = document.createElement('div'); stage.className = 'sf-stage'; const start = document.createElement('span'); start.className = 'sf-label'; start.textContent = 'START WITH'; stage.append(start);
      const rail = document.createElement('div'); rail.className = 'sf-rail';
      let inputs = item.inputs.length ? item.inputs : String(item.legacyInput || '').split(/\r?\n/).map(x => x.trim()).filter(Boolean).map(x => ({ type: inputType(x), label: x, role: '', value: x, src: '' }));
      if (!inputs.length && i === 0) inputs = inputImages.map((img, n) => ({ type: 'image', label: n ? `Starting image ${n + 1}` : 'Starting image', value: img.currentSrc || img.src, src: img.currentSrc || img.src }));
      inputs.slice(0, 10).forEach(input => rail.append(makeChip({ type: input.type || inputType(input.value), label: input.label || input.role, role: input.role, value: input.value, src: input.src })));
      stage.append(rail); item.body.append(stage);
      if (item.settings.length) { const settings = document.createElement('div'); settings.className = 'sf-settings'; item.settings.forEach(s => { const chip = document.createElement('div'); chip.className = 'sf-setting'; chip.innerHTML = `<span class="sf-setting-label"></span><strong class="sf-setting-value"></strong>`; chip.querySelector('.sf-setting-label').textContent = s.label || ''; chip.querySelector('.sf-setting-value').textContent = s.value || ''; settings.append(chip); }); item.body.append(settings); }
      if (item.process) {
        const arrow = document.createElement('div'); arrow.className = 'sf-arrow'; arrow.textContent = 'DO THIS'; item.body.append(arrow);
        const box = document.createElement('div'); box.className = 'sf-action'; const head = document.createElement('div'); head.className = 'sf-action-head';
        const cp = document.createElement('button'); cp.type = 'button'; cp.textContent = 'Copy';
        const title = document.createElement('div'); title.className = 'sf-action-title'; title.textContent = 'STEP ACTION';
        const ex = document.createElement('button'); ex.type = 'button'; ex.textContent = 'Expand'; head.append(cp, title, ex);
        const pre = document.createElement('pre'); pre.textContent = item.process; const dl = document.createElement('button'); dl.type = 'button'; dl.className = 'sf-download'; dl.textContent = 'Download PDF'; box.append(head, pre, dl); item.body.append(box);
        cp.onclick = () => copy(item.process); ex.onclick = () => { const dialog = document.querySelector('[data-dialog]'); const dt = dialog?.querySelector('pre'); const dh = dialog?.querySelector('#prompt-dialog-title'); if (dialog && dt) { if (dh) dh.textContent = item.title + ' — Step Action'; dt.textContent = item.process; dialog.showModal(); } }; dl.onclick = () => pdf(item.process, item.title);
      }
      if (item.output) { const arrow = document.createElement('div'); arrow.className = 'sf-arrow'; arrow.textContent = 'YOU GET'; item.body.append(arrow); const out = document.createElement('div'); out.className = 'sf-output'; out.textContent = item.output; item.body.append(out); }
      if (item.next) { const arrow = document.createElement('div'); arrow.className = 'sf-arrow'; arrow.textContent = 'NEXT STEP'; item.body.append(arrow); const out = document.createElement('div'); out.className = 'sf-output'; out.textContent = item.next; item.body.append(out); }
    });
    section.classList.add('sf-v6');
    const results = document.querySelector('.results-section');
    if (results && resultImgs.length) {
      results.remove();
      const f = document.createElement('section'); f.className = 'resource-section results-section workflow-final-result';
      f.innerHTML = '<div class="section-heading"><div><p class="eyebrow">FINAL RESULT</p><h2>See the finished result</h2><p class="section-subcopy">The finished output of the workflow.</p></div></div><div class="results-gallery"></div>';
      const g = f.querySelector('.results-gallery'); resultImgs.forEach((im, n) => { const q = document.createElement('figure'); q.className = 'result-card'; q.innerHTML = `<img src="${im.currentSrc || im.src}" alt="${im.alt || 'Final result'}" loading="lazy"><figcaption><span>${resultImgs.length > 1 ? 'RESULT ' + (n + 1) : 'RESULT'}</span><strong>${resultImgs.length > 1 ? 'Final result ' + (n + 1) : 'Final result'}</strong></figcaption>`; g.append(q); });
      section.parentNode.insertBefore(f, section.nextSibling);
    }
    document.querySelector('.prompt-section')?.remove();
    document.querySelectorAll('a[href="#prompt"]').forEach(a => a.remove());
    section.classList.add('sf-v6-ready');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();