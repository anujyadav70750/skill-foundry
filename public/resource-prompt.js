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
        .guide-instruction{display:flex;align-items:center;justify-content:center;width:100%;min-height:46px;box-sizing:border-box;padding:12px 16px;border:1px solid var(--line);border-radius:12px;background:transparent;color:var(--text);font-size:13px;font-weight:750;line-height:1.35;text-align:center}
        @media (min-width:769px){.guide-instruction{width:fit-content;min-height:48px;padding-inline:20px}}
        .workflow-structured-body{display:grid;gap:14px;margin-top:18px}
        .workflow-structured-node{display:grid;gap:6px;padding:14px 15px;border:1px solid var(--line);border-radius:13px;background:rgba(7,17,31,.38);min-width:0}
        .workflow-structured-node span{color:var(--accent);font-size:9px;font-weight:850;letter-spacing:.14em}
        .workflow-structured-node strong,.workflow-structured-node p{margin:0;color:var(--text);font-size:13px;line-height:1.55}
        .workflow-structured-node p{color:var(--muted);white-space:pre-wrap;overflow-wrap:anywhere}
        .workflow-tool-row{display:flex;align-items:center;gap:10px}
        .workflow-tool-logo{width:34px;height:34px;flex:0 0 34px;object-fit:contain;border:1px solid var(--line);border-radius:9px;background:rgba(255,255,255,.04);padding:5px;box-sizing:border-box}
        .workflow-input-block,.workflow-output-block{display:grid;gap:9px}
        .workflow-input-rail{display:flex;gap:10px;overflow-x:auto;overflow-y:hidden;padding:2px 2px 7px;scroll-snap-type:x proximity;scrollbar-width:thin;overscroll-behavior-x:contain}
        .workflow-input-card{display:grid;gap:7px;min-width:180px;max-width:260px;flex:0 0 180px;padding:13px;border:1px solid var(--line);border-radius:13px;background:rgba(16,34,56,.42);scroll-snap-align:start}
        .workflow-input-card span{color:var(--muted);font-size:9px;font-weight:850;letter-spacing:.13em}
        .workflow-input-card p{margin:0;color:var(--text);font-size:12px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}
        .workflow-media-card{overflow:hidden;padding:0;min-width:190px;flex-basis:190px}
        .workflow-media-card img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;background:var(--surface-2)}
        .workflow-media-card .workflow-media-caption{display:grid;gap:3px;padding:9px 11px 11px}
        .workflow-media-caption span{color:var(--accent);font-size:8px}
        .workflow-media-caption strong{color:var(--text);font-size:11px}
        .workflow-output-card{overflow:hidden;padding:0;border-color:rgba(61,214,208,.22)}
        .workflow-output-card img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:var(--surface-2)}
        .workflow-output-caption{display:grid;gap:3px;padding:10px 12px 12px}
        .workflow-output-caption span{color:var(--accent);font-size:8px;font-weight:850;letter-spacing:.12em}
        .workflow-output-caption strong{color:var(--text);font-size:12px;line-height:1.4}
        .workflow-flow-note{display:flex;align-items:center;gap:8px;margin:2px 0 0 56px;color:var(--muted);font-size:11px;font-weight:750}
        .workflow-flow-note::before{content:'↓';display:grid;place-items:center;width:22px;height:22px;border:1px solid rgba(61,214,208,.25);border-radius:50%;color:var(--accent);font-size:13px}
        .workflow-structured-body>.workflow-prompt-shell{margin-top:2px}
        .workflow-prompt-shell{overflow:hidden;border:1px solid var(--line);border-radius:16px;background:var(--surface)}
        .workflow-prompt-shell .prompt-toolbar{display:grid;grid-template-columns:auto 1fr auto;align-items:stretch;min-height:46px;border-bottom:1px solid var(--line)}
        .workflow-prompt-shell .prompt-label{display:flex;align-items:center;justify-content:center;min-width:0;padding:0 10px;color:var(--muted);font-size:10px;font-weight:850;letter-spacing:.12em;text-transform:uppercase;text-align:center}
        .workflow-prompt-shell .prompt-control{min-width:88px;min-height:46px;padding:0 14px;border:0;background:rgba(16,34,56,.34);color:var(--text);font:inherit;font-size:12px;font-weight:850;cursor:pointer}
        .workflow-prompt-shell .prompt-copy{border-right:1px solid var(--line)}
        .workflow-prompt-shell .prompt-expand{border-left:1px solid var(--line)}
        .workflow-prompt-shell .prompt-control:hover,.workflow-prompt-shell .prompt-control:focus-visible{background:rgba(61,214,208,.08);color:var(--accent);outline:none}
        .workflow-prompt-shell pre{box-sizing:border-box;margin:0;padding:18px;max-height:270px;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;color:var(--text);font:inherit;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:12.5px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;scrollbar-width:thin}
        .workflow-prompt-shell .prompt-download{display:block;width:100%;min-height:44px;padding:0 14px;border:0;border-top:1px solid var(--line);background:rgba(16,34,56,.52);color:var(--text);font:inherit;font-size:12px;font-weight:850;cursor:pointer}
        .workflow-prompt-shell .prompt-download:hover,.workflow-prompt-shell .prompt-download:focus-visible{color:var(--accent);background:rgba(61,214,208,.08);outline:none}
        .workflow-card .workflow-node[data-node="next"]{border-color:rgba(61,214,208,.18)}
        .workflow-section.workflow-enhanced .workflow-card{padding-bottom:22px}
        .workflow-section.workflow-enhanced .workflow-list{gap:14px}
        .workflow-section.workflow-enhanced .workflow-connector{display:none}
        .workflow-section.workflow-enhanced .workflow-step{align-items:flex-start}
        .workflow-section.workflow-enhanced .workflow-number{margin-top:1px}
        .workflow-final-result{margin-top:10px}
        .workflow-final-result .results-gallery{display:block}
        .workflow-final-result .result-card{max-width:100%}
        .workflow-final-result .result-card img{aspect-ratio:16/9}
        .workflow-hidden-source{display:none!important}
        @media (min-width:769px){.workflow-input-card{min-width:210px;flex-basis:210px}.workflow-input-rail{max-width:100%}.workflow-flow-note{margin-left:56px}}
        @media (max-width:768px){.workflow-prompt-shell .prompt-label{font-size:9px;padding-inline:6px}.workflow-prompt-shell .prompt-control{min-width:72px;padding-inline:9px}.workflow-prompt-shell pre{font-size:12px;padding:16px;max-height:240px}.workflow-input-card{min-width:175px;flex-basis:175px}.workflow-media-card{min-width:185px;flex-basis:185px}.workflow-flow-note{margin-left:50px}.workflow-final-result .result-card img{aspect-ratio:4/3}}
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

    const toolLogoUrl = async (toolName, card) => {
      const target = card.querySelector('.workflow-tool-logo');
      if (!target || !toolName) return;
      const toolCards = [...document.querySelectorAll('.tools-list .tool-card')];
      const match = toolCards.find((item) => item.querySelector('h3')?.textContent?.trim().toLowerCase() === toolName.trim().toLowerCase());
      const url = match?.querySelector('.tool-link')?.href || '';
      if (!url) return;
      try {
        const response = await fetch(`/api/tool-logo?url=${encodeURIComponent(url)}`, { credentials: 'same-origin' });
        const data = await response.json();
        if (response.ok && data.logoUrl) {
          target.src = data.logoUrl;
          target.hidden = false;
        }
      } catch {}
    };

    const sourceInputImages = [...document.querySelectorAll('.results-gallery .input-result img')];
    const sourceResultImages = [...document.querySelectorAll('.results-gallery .result-card:not(.input-result) img')];
    const sourceInputSection = document.querySelector('.results-section');

    document.querySelectorAll('.workflow-card').forEach((card, index) => {
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

      const tool = data?.tool?.trim() || readNode('TOOL');
      const input = data?.input?.trim() || readNode('INPUT');
      const process = data?.process?.trim() || data?.description?.trim() || legacyProcess.replace(/^\[\[SF_WORKFLOW\]\].*$/s, '') || readNode('PROCESS / PROMPT');
      const output = data?.output?.trim() || readNode('OUTPUT');
      const next = data?.next?.trim() || readNode('NEXT STEP');
      if (!tool && !input && !process && !output && !next) return;

      body.className = 'workflow-structured-body';
      body.innerHTML = '';

      const addSimpleNode = (label, value, strong = false) => {
        if (!value) return null;
        const node = document.createElement('div');
        node.className = 'workflow-structured-node';
        const tag = document.createElement('span');
        tag.textContent = label;
        node.appendChild(tag);
        const content = document.createElement(strong ? 'strong' : 'p');
        content.textContent = value;
        node.appendChild(content);
        body.appendChild(node);
        return node;
      };

      if (tool) {
        const node = document.createElement('div');
        node.className = 'workflow-structured-node';
        const tag = document.createElement('span');
        tag.textContent = 'TOOL';
        const row = document.createElement('div');
        row.className = 'workflow-tool-row';
        const logo = document.createElement('img');
        logo.className = 'workflow-tool-logo';
        logo.alt = '';
        logo.hidden = true;
        const name = document.createElement('strong');
        name.textContent = tool;
        row.append(logo, name);
        node.append(tag, row);
        body.appendChild(node);
        toolLogoUrl(tool, card);
      }

      const inputBlock = document.createElement('div');
      inputBlock.className = 'workflow-input-block';
      const inputLabel = document.createElement('span');
      inputLabel.textContent = 'INPUTS';
      inputLabel.style.cssText = 'color:var(--accent);font-size:9px;font-weight:850;letter-spacing:.14em';
      inputBlock.appendChild(inputLabel);
      const rail = document.createElement('div');
      rail.className = 'workflow-input-rail';
      const inputs = String(input || '').split(/\r?\n/).map((value) => value.trim()).filter(Boolean).slice(0, 10);
      const image = sourceInputImages[index];
      if (image) {
        const cardImage = document.createElement('figure');
        cardImage.className = 'workflow-input-card workflow-media-card';
        const img = document.createElement('img');
        img.src = image.currentSrc || image.src;
        img.alt = image.alt || `Step ${index + 1} input`;
        const caption = document.createElement('figcaption');
        caption.className = 'workflow-media-caption';
        const label = document.createElement('span'); label.textContent = 'INPUT IMAGE';
        const title = document.createElement('strong'); title.textContent = 'Starting image';
        caption.append(label, title); cardImage.append(img, caption); rail.appendChild(cardImage);
      }
      inputs.forEach((value, inputIndex) => {
        const inputCard = document.createElement('div');
        inputCard.className = 'workflow-input-card';
        const label = document.createElement('span');
        label.textContent = inputs.length > 1 ? `INPUT ${inputIndex + 1}` : 'INPUT';
        const text = document.createElement('p'); text.textContent = value;
        inputCard.append(label, text); rail.appendChild(inputCard);
      });
      if (!rail.children.length) {
        const empty = document.createElement('div'); empty.className = 'workflow-input-card';
        const label = document.createElement('span'); label.textContent = 'INPUT';
        const text = document.createElement('p'); text.textContent = 'No input listed for this step.';
        empty.append(label, text); rail.appendChild(empty);
      }
      inputBlock.appendChild(rail);
      body.appendChild(inputBlock);

      if (process) {
        const node = document.createElement('div');
        node.className = 'workflow-prompt-shell';
        const toolbar = document.createElement('div');
        toolbar.className = 'prompt-toolbar'; toolbar.setAttribute('role', 'toolbar'); toolbar.setAttribute('aria-label', 'Step prompt actions');
        const copy = document.createElement('button'); copy.type = 'button'; copy.className = 'prompt-control prompt-copy'; copy.textContent = 'Copy';
        const label = document.createElement('div'); label.className = 'prompt-label'; label.textContent = 'Step Prompt';
        const expand = document.createElement('button'); expand.type = 'button'; expand.className = 'prompt-control prompt-expand'; expand.textContent = 'Expand';
        toolbar.append(copy, label, expand);
        const pre = document.createElement('pre'); pre.textContent = process;
        const download = document.createElement('button'); download.type = 'button'; download.className = 'prompt-download'; download.textContent = 'Download PDF';
        node.append(toolbar, pre, download);
        const stepTitle = card.querySelector('.workflow-step h3')?.textContent?.trim() || 'Step';
        copy.addEventListener('click', () => copyText(process));
        expand.addEventListener('click', () => openPrompt(`${stepTitle} — Step Prompt`, process));
        download.addEventListener('click', () => makePdf(process, `${pageTitle}-${stepTitle}`));
        body.appendChild(node);
      }

      if (output) {
        const outputWrap = document.createElement('div');
        outputWrap.className = 'workflow-output-block';
        const outputLabel = document.createElement('span');
        outputLabel.textContent = 'OUTPUT';
        outputLabel.style.cssText = 'color:var(--accent);font-size:9px;font-weight:850;letter-spacing:.14em';
        outputWrap.appendChild(outputLabel);
        const resultImage = sourceResultImages[index];
        if (resultImage) {
          const outputCard = document.createElement('figure');
          outputCard.className = 'workflow-structured-node workflow-output-card';
          const img = document.createElement('img'); img.src = resultImage.currentSrc || resultImage.src; img.alt = resultImage.alt || `Step ${index + 1} output`;
          const caption = document.createElement('figcaption'); caption.className = 'workflow-output-caption';
          const span = document.createElement('span'); span.textContent = 'OUTPUT';
          const strong = document.createElement('strong'); strong.textContent = output;
          caption.append(span, strong); outputCard.append(img, caption); outputWrap.appendChild(outputCard);
        } else {
          const node = document.createElement('div'); node.className = 'workflow-structured-node';
          const p = document.createElement('p'); p.textContent = output; node.appendChild(p); outputWrap.appendChild(node);
        }
        body.appendChild(outputWrap);
      }

      if (next) {
        const node = addSimpleNode('NEXT STEP', next);
        if (node) node.dataset.node = 'next';
      }

      if (index < document.querySelectorAll('.workflow-card').length - 1) {
        const note = document.createElement('div');
        note.className = 'workflow-flow-note';
        note.textContent = 'Output from this step continues into the next step';
        card.appendChild(note);
      }
    });

    const workflowSection = document.querySelector('.workflow-section');
    if (workflowSection) workflowSection.classList.add('workflow-enhanced');

    if (sourceInputSection) {
      sourceInputSection.classList.add('workflow-hidden-source');
      if (sourceResultImages.length) {
        const finalSection = sourceInputSection.cloneNode(false);
        finalSection.className = 'resource-section results-section workflow-final-result';
        const heading = document.createElement('div'); heading.className = 'section-heading';
        heading.innerHTML = '<div><p class="eyebrow">FINAL RESULT</p><h2>See the finished result</h2><p class="section-subcopy">The final output produced by the workflow above.</p></div>';
        const gallery = document.createElement('div'); gallery.className = 'results-gallery';
        sourceResultImages.forEach((image, resultIndex) => {
          const figure = document.createElement('figure'); figure.className = 'result-card';
          const img = document.createElement('img'); img.src = image.currentSrc || image.src; img.alt = image.alt || `Final result ${resultIndex + 1}`; img.loading = 'lazy';
          const caption = document.createElement('figcaption'); const span = document.createElement('span'); span.textContent = sourceResultImages.length > 1 ? `RESULT ${resultIndex + 1}` : 'RESULT'; const strong = document.createElement('strong'); strong.textContent = sourceResultImages.length > 1 ? `Final result ${resultIndex + 1}` : 'Final result'; caption.append(span, strong); figure.append(img, caption); gallery.appendChild(figure);
        });
        finalSection.append(heading, gallery);
        sourceInputSection.parentNode.insertBefore(finalSection, sourceInputSection.nextSibling);
      }
    }

    const oldPromptSection = document.querySelector('.prompt-section');
    if (oldPromptSection && document.querySelector('.workflow-card')) oldPromptSection.remove();
    document.querySelectorAll('a[href="#prompt"]').forEach((item) => item.removeAttribute('href'));

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
