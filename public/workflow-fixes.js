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

  const injectWorkflowBlueprintPolish = () => {
    const styleId = 'sf-workflow-blueprint-final-polish';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
/* Final Workflow Blueprint visual polish — scoped to resource workflow only. */
.resource-page .blueprint-workflow-section .blueprint-main-heading {
  margin-bottom: 0 !important;
}
.resource-page .blueprint-workflow-section .blueprint-section-title {
  font-family: 'Plus Jakarta Sans', var(--font-sans), sans-serif !important;
  font-size: 26px !important;
  font-weight: 800 !important;
  line-height: 1.2 !important;
  letter-spacing: -0.025em !important;
  margin: 0 0 8px !important;
}
.resource-page .blueprint-workflow-section .blueprint-eyebrow {
  font-family: 'Plus Jakarta Sans', var(--font-sans), sans-serif !important;
  background: #DCEBFA !important;
  color: #1672D6 !important;
  border: 1px solid #BFD8F2 !important;
  box-shadow: 0 3px 8px rgba(28,94,160,.07) !important;
}
.resource-page .blueprint-workflow-section .blueprint-helper-text {
  font-family: 'Plus Jakarta Sans', var(--font-sans), sans-serif !important;
  margin: 0 !important;
  line-height: 1.45 !important;
  display: flex !important;
  align-items: center !important;
  gap: 5px !important;
}
.resource-page .blueprint-workflow-section .helper-chevron-cue {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  border-radius: 7px !important;
  background: #D9EAFE !important;
  color: #2563EB !important;
  box-shadow: inset 0 0 0 1px rgba(37,99,235,.14), 0 2px 6px rgba(37,99,235,.10) !important;
  vertical-align: middle !important;
}
.resource-page .blueprint-workflow-section .helper-chevron-cue svg {
  width: 13px !important;
  height: 13px !important;
  stroke: currentColor !important;
  transform: none !important;
}
.resource-page .blueprint-workflow-section .blueprint-inner-workflow-container {
  width: calc(100% - 20px) !important;
  max-width: none !important;
  margin: 28px auto 0 !important;
  padding: 58px 28px 34px !important;
  border-radius: 28px !important;
  box-sizing: border-box !important;
  background: linear-gradient(180deg, #EAF3FC 0%, #E2EDF8 100%) !important;
  border: 1px solid #D3E2F2 !important;
  box-shadow: inset 0 4px 16px rgba(20, 76, 135, 0.10), inset 0 1px 2px rgba(255,255,255,.95), 0 7px 22px rgba(30,64,100,.08) !important;
}
.resource-page .blueprint-workflow-section .blueprint-inner-expand-control {
  top: 18px !important;
  right: 18px !important;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  min-height: 40px !important;
  border-radius: 10px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: #DCEBFA !important;
  border: 1px solid #C8DDF2 !important;
  color: #1672D6 !important;
  box-shadow: 0 4px 10px rgba(31,100,170,.10), inset 0 1px 0 rgba(255,255,255,.8) !important;
}
.resource-page .blueprint-workflow-section .blueprint-inner-expand-control svg {
  width: 18px !important;
  height: 18px !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container {
  position: relative !important;
  border-radius: 18px !important;
  border-width: 1px !important;
  border-style: solid !important;
  box-shadow: 0 7px 18px rgba(35,66,102,.07), inset 0 1px 0 rgba(255,255,255,.40) !important;
  overflow: visible !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-blue {
  background: #D9EAFE !important;
  border-color: #B9D8FA !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-green {
  background: #D8F4E6 !important;
  border-color: #B5E5CF !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-orange {
  background: #FFF0BF !important;
  border-color: #F2D890 !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-cyan {
  background: #D5F5FA !important;
  border-color: #B4E5EE !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-purple {
  background: #EDE1FA !important;
  border-color: #D7C5EE !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-capsule {
  min-width: 118px !important;
  height: 36px !important;
  padding: 0 20px !important;
  border-radius: 999px !important;
  background: rgba(255,255,255,.92) !important;
  border-width: 2px !important;
  border-style: solid !important;
  box-shadow: 0 2px 7px rgba(20,55,90,.08) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.resource-page .blueprint-workflow-section .step-theme-blue .blueprint-step-capsule { border-color:#5BA8F2 !important; color:#2563EB !important; }
.resource-page .blueprint-workflow-section .step-theme-green .blueprint-step-capsule { border-color:#55C993 !important; color:#12845A !important; }
.resource-page .blueprint-workflow-section .step-theme-orange .blueprint-step-capsule { border-color:#E8B84D !important; color:#B87300 !important; }
.resource-page .blueprint-workflow-section .step-theme-cyan .blueprint-step-capsule { border-color:#5BC6D8 !important; color:#07859A !important; }
.resource-page .blueprint-workflow-section .step-theme-purple .blueprint-step-capsule { border-color:#B58AE3 !important; color:#7440A8 !important; }
.resource-page .blueprint-workflow-section .blueprint-step-capsule span {
  font-family: 'Plus Jakarta Sans', var(--font-sans), sans-serif !important;
  font-size: 11px !important;
  font-weight: 800 !important;
  letter-spacing: .12em !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-header {
  background: transparent !important;
  border-radius: 18px !important;
}
.resource-page .blueprint-workflow-section .step-header-title,
.resource-page .blueprint-workflow-section .step-header-purpose {
  font-family: 'Plus Jakarta Sans', var(--font-sans), sans-serif !important;
}
.resource-page .blueprint-workflow-section .step-expand-chevron {
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  min-height: 36px !important;
  border-radius: 10px !important;
  flex: 0 0 36px !important;
  box-sizing: border-box !important;
}
.resource-page .blueprint-workflow-section .step-theme-blue .step-expand-chevron { background:#BFDBFE !important; color:#2563EB !important; }
.resource-page .blueprint-workflow-section .step-theme-green .step-expand-chevron { background:#BCEBD4 !important; color:#12845A !important; }
.resource-page .blueprint-workflow-section .step-theme-orange .step-expand-chevron { background:#F9DEA0 !important; color:#B87300 !important; }
.resource-page .blueprint-workflow-section .step-theme-cyan .step-expand-chevron { background:#BDEBF2 !important; color:#07859A !important; }
.resource-page .blueprint-workflow-section .step-theme-purple .step-expand-chevron { background:#DCC8F1 !important; color:#7440A8 !important; }
.resource-page .blueprint-workflow-section .step-header-thumb-box {
  border-radius: 12px !important;
  overflow: hidden !important;
}
.resource-page .blueprint-workflow-section .workflow-next-connector {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
}
@media (max-width: 640px) {
  .resource-page .blueprint-workflow-section .blueprint-section-title {
    font-size: 24px !important;
    line-height: 1.2 !important;
    margin-bottom: 7px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-helper-text { font-size: 14px !important; }
  .resource-page .blueprint-workflow-section .helper-chevron-cue {
    width: 23px !important;
    height: 23px !important;
    min-width: 23px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-inner-workflow-container {
    width: calc(100% - 12px) !important;
    margin-top: 24px !important;
    padding: 54px 14px 26px !important;
    border-radius: 24px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-inner-expand-control {
    top: 14px !important;
    right: 14px !important;
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    min-height: 36px !important;
    border-radius: 9px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-step-container { border-radius: 17px !important; }
  .resource-page .blueprint-workflow-section .blueprint-step-capsule {
    min-width: 104px !important;
    height: 32px !important;
    padding: 0 17px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-step-capsule span { font-size: 10px !important; }
  .resource-page .blueprint-workflow-section .step-expand-chevron {
    width: 34px !important;
    height: 34px !important;
    min-width: 34px !important;
    min-height: 34px !important;
    flex-basis: 34px !important;
    border-radius: 9px !important;
  }
  .resource-page .blueprint-workflow-section .step-header-title {
    font-size: 15px !important;
    line-height: 1.22 !important;
  }
  .resource-page .blueprint-workflow-section .step-header-purpose {
    font-size: 11.5px !important;
    line-height: 1.28 !important;
  }
}
:root:not([data-theme="light"]) .resource-page .blueprint-workflow-section .blueprint-eyebrow,
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-eyebrow {
  background: rgba(56,189,248,.12) !important;
  color: #7CC4FF !important;
  border-color: rgba(124,196,255,.28) !important;
  box-shadow: 0 3px 10px rgba(0,0,0,.18) !important;
}
:root:not([data-theme="light"]) .resource-page .blueprint-workflow-section .helper-chevron-cue,
html:not(.light-theme) .resource-page .blueprint-workflow-section .helper-chevron-cue {
  background: #24364B !important;
  color: #7CC4FF !important;
  box-shadow: inset 0 0 0 1px rgba(124,196,255,.18), 0 2px 6px rgba(0,0,0,.18) !important;
}
:root:not([data-theme="light"]) .resource-page .blueprint-workflow-section .blueprint-inner-workflow-container,
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-inner-workflow-container {
  background: linear-gradient(180deg, #172335 0%, #111B2A 100%) !important;
  border-color: #2B3C52 !important;
  box-shadow: inset 0 4px 16px rgba(0,0,0,.42), inset 0 1px 2px rgba(255,255,255,.04), 0 7px 22px rgba(0,0,0,.20) !important;
}
:root:not([data-theme="light"]) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-blue,
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-blue { background:#1E3650 !important; border-color:#315A7E !important; }
:root:not([data-theme="light"]) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-green,
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-green { background:#193B32 !important; border-color:#2D6655 !important; }
:root:not([data-theme="light"]) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-orange,
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-orange { background:#46371D !important; border-color:#80602A !important; }
:root:not([data-theme="light"]) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-cyan,
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-cyan { background:#173B44 !important; border-color:#2D6975 !important; }
:root:not([data-theme="light"]) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-purple,
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-purple { background:#352743 !important; border-color:#62477B !important; }
:root:not([data-theme="light"]) .resource-page .blueprint-workflow-section .blueprint-step-capsule,
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-capsule {
  background:rgba(15,23,42,.92) !important;
  box-shadow:0 2px 8px rgba(0,0,0,.28) !important;
}
:root:not([data-theme="light"]) .resource-page .blueprint-workflow-section .blueprint-inner-expand-control,
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-inner-expand-control {
  background:#24364B !important;
  border-color:#3A5672 !important;
  color:#7CC4FF !important;
}
`;
    document.head.appendChild(style);
  };

  const init = () => {
    replaceFlowLogos();
    fixGuideCue();
    replaceExpandHandlers();
    fixOutputPreviews();
    injectWorkflowBlueprintPolish();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
