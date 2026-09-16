(() => {
  const FLOW_ICON = '/google-flow-icon.svg';

  const replaceFlowLogos = () => {
    document.querySelectorAll('a[href*="flow.google"] img[alt$=" logo"]').forEach((img) => {
      if (img.getAttribute('src') !== FLOW_ICON) img.setAttribute('src', FLOW_ICON);
    });
  };

  const makeOutputPlaceholder = (label, description) => {
    const el = document.createElement('div');
    el.className = 'output-preview-placeholder';
    el.innerHTML = `<span>OUTPUT PREVIEW</span><strong></strong><small></small>`;
    el.querySelector('strong').textContent = label || 'Output from this step';
    el.querySelector('small').textContent = description || 'Preview media has not been provided for this step.';
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
      const outputMedia = outputFrame?.querySelector('.media-main');
      const outputSrc = outputMedia?.getAttribute('src');

      if (outputFrame && (!outputSrc || allInputSources.has(outputSrc))) {
        const label = outputCard.querySelector('.media-caption strong')?.textContent?.trim();
        const description = outputCard.querySelector('.media-caption small')?.textContent?.trim();
        outputFrame.replaceWith(makeOutputPlaceholder(label, description));
      }

      const outputText = outputCard.querySelector('.output-text');
      if (outputText && !outputCard.querySelector('.output-preview-placeholder')) {
        const label = outputCard.querySelector('.media-caption strong')?.textContent?.trim() || outputText.textContent.trim();
        const description = outputCard.querySelector('.media-caption small')?.textContent?.trim();
        outputText.replaceWith(makeOutputPlaceholder(label, description));
      }
    });

    const finalPlaceholder = document.querySelector('.final-result-placeholder');
    if (finalPlaceholder) {
      finalPlaceholder.innerHTML = '<span>FINAL OUTPUT PREVIEW</span><strong></strong><small>Final media preview has not been provided for this resource.</small>';
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
      try { await navigator.clipboard.writeText(pre.textContent?.trim() || ''); } catch {}
    });
    modal.querySelector('[data-modal-download]')?.addEventListener('click', () => {
      const event = new CustomEvent('skill-foundry-download-prompt', { detail: { text: pre.textContent || '' } });
      document.dispatchEvent(event);
    });

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
    replaceExpandHandlers();
    fixOutputPreviews();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
