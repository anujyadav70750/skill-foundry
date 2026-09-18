(() => {
  const FLOW_ICON = '/google-flow-icon.svg';
  const CAPCUT_ICON = '/capcut-icon.svg';

  const downloadPdf = (text, name = 'skill-foundry-prompt') => {
    const clean = (s) => String(s).replace(/[^\x20-\x7E]/g, '?').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    const lines = [];
    String(text).split(/\r?\n/).forEach((line) => {
      let value = clean(line);
      while (value.length > 88) { lines.push(value.slice(0, 88)); value = value.slice(88); }
      lines.push(value);
    });
    const content = ['BT','/F1 10 Tf','50 760 Td','13 TL',...lines.map((line, i) => `(${line}) Tj${i < lines.length - 1 ? ' T*' : ''}`),'ET'].join('\n');
    const pdf = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj\n4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Courier>>endobj\n5 0 obj<</Length ${content.length}>>stream\n${content}\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n0\n%%EOF`;
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.pdf`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const replaceFlowLogos = () => {
    document.querySelectorAll('a[href*="flow.google"] img, img[alt*="Flow"]').forEach((img) => {
      if (img.getAttribute('src') !== FLOW_ICON) img.setAttribute('src', FLOW_ICON);
    });
    document.querySelectorAll('a[href*="capcut.com"] img, img[alt*="CapCut"]').forEach((img) => {
      if (img.getAttribute('src') !== CAPCUT_ICON) img.setAttribute('src', CAPCUT_ICON);
    });
  };

  const fixGuideCue = () => {
    document.querySelectorAll('.resource-page .guide-cue svg').forEach((svg) => {
      svg.style.transform = 'none';
      svg.querySelector('path')?.setAttribute('d', 'M6 7l6 6 6-6M6 13l6 6 6-6');
    });
  };

  const makeOutputPlaceholder = (label, description) => {
    const el = document.createElement('div');
    el.className = 'media-frame media-frame-nonvisual output-preview-placeholder';
    el.innerHTML = `<div class="nonvisual-content"><div class="nonvisual-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><span class="nonvisual-badge">OUTPUT</span><strong class="nonvisual-title"></strong><small class="nonvisual-desc"></small></div>`;
    el.querySelector('.nonvisual-title').textContent = label || 'Output from this step';
    el.querySelector('.nonvisual-desc').textContent = description || 'Produced by this step';
    return el;
  };

  const fixOutputPreviews = () => {
    const allInputSources = new Set(
      [...document.querySelectorAll('.input-card img.media-main[src], .input-card video.media-main[src]')]
        .map((el) => el.getAttribute('src'))
        .filter(Boolean)
    );

    document.querySelectorAll('.workflow-card').forEach((card) => {
      const outputCard = card.querySelector('.output-card');
      if (!outputCard) return;

      const outputFrame = outputCard.querySelector('.media-frame');
      if (outputFrame?.classList.contains('media-frame-nonvisual')) return;

      const outputMedia = outputFrame?.querySelector('.media-main');
      const outputSrc = outputMedia?.getAttribute('src');

      if (outputFrame && (!outputSrc || allInputSources.has(outputSrc))) {
        const label = outputCard.querySelector('.media-caption strong')?.textContent?.trim();
        const description = outputCard.querySelector('.media-caption small')?.textContent?.trim();
        outputFrame.replaceWith(makeOutputPlaceholder(label, description));
      }

      const outputText = outputCard.querySelector('.output-text');
      if (outputText && !outputCard.querySelector('.media-frame')) {
        const label = outputCard.querySelector('.media-caption strong')?.textContent?.trim() || outputText.textContent.trim();
        const description = outputCard.querySelector('.media-caption small')?.textContent?.trim();
        outputText.replaceWith(makeOutputPlaceholder(label, description));
      }
    });

    const finalPlaceholder = document.querySelector('.final-result-placeholder');
    if (finalPlaceholder && !finalPlaceholder.querySelector('.final-placeholder-icon')) {
      finalPlaceholder.innerHTML = '<div class="final-placeholder-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><strong></strong><span>Completed output from the full workflow sequence.</span>';
      finalPlaceholder.querySelector('strong').textContent = finalPlaceholder.closest('.workflow-final-result')?.querySelector('h3')?.textContent?.trim() || 'Final result';
    }
  };

  const openFixedPrompt = (button) => {
    const box = button.closest('.workflow-prompt');
    const pre = box?.querySelector('[data-step-prompt]');
    if (!pre) return;

    document.querySelector('[data-prompt-modal]')?.remove();
    const modal = document.createElement('div');
    modal.setAttribute('data-prompt-modal', '');
    modal.innerHTML = '<div class="prompt-modal-backdrop"></div><div class="prompt-modal-dialog" role="dialog" aria-modal="true" aria-label="Expanded prompt"><div class="prompt-modal-head"><span>FULL PROMPT</span><button type="button" data-close-prompt>Close</button></div><pre></pre><div class="prompt-modal-actions"><button type="button" data-modal-copy>Copy</button><button type="button" data-modal-download>Download PDF</button></div></div>';
    modal.querySelector('pre').textContent = pre.textContent || '';
    document.body.appendChild(modal);
    document.body.dataset.promptModalOpen = 'true';
    document.body.style.overflow = 'hidden';

    const closeModal = () => {
      modal.remove();
      delete document.body.dataset.promptModalOpen;
      document.body.style.overflow = '';
    };

    modal.querySelector('[data-close-prompt]')?.addEventListener('click', closeModal);
    modal.querySelector('.prompt-modal-backdrop')?.addEventListener('click', closeModal);
    modal.querySelector('[data-modal-copy]')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.textContent?.trim() || '');
        const btn = modal.querySelector('[data-modal-copy]');
        if (btn) {
          const old = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = old; }, 1400);
        }
      } catch {}
    });
    modal.querySelector('[data-modal-download]')?.addEventListener('click', () => downloadPdf(pre.textContent || ''));

    const onKey = (event) => {
      if (event.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', onKey);
      }
    };
    document.addEventListener('keydown', onKey);
    modal.querySelector('[data-close-prompt]')?.focus();
  };

  const replaceExpandHandlers = () => {
    document.querySelectorAll('[data-expand-step]').forEach((button) => {
      const replacement = button.cloneNode(true);
      button.replaceWith(replacement);
      replacement.addEventListener('click', () => openFixedPrompt(replacement));
    });
  };

  const init = () => {
    replaceFlowLogos();
    fixGuideCue();
    replaceExpandHandlers();
    fixOutputPreviews();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
