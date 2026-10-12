(() => {
  const FLOW_ICON = '/logos/google-flow.png';
  const CAPCUT_ICON = '/capcut-icon.svg';
  const CHATGPT_ICON = '/logos/chatgpt.png';

  const downloadPdf = (text, name = 'skill-foundry-prompt') => {
    const clean = (s) => String(s)
      .replace(/[^\x20-\x7E]/g, '?')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
    const lines = [];
    String(text).split(/\r?\n/).forEach((line) => {
      let value = clean(line);
      while (value.length > 88) {
        lines.push(value.slice(0, 88));
        value = value.slice(88);
      }
      lines.push(value);
    });
    const stream = [
      'BT', '/F1 10 Tf', '50 760 Td', '13 TL',
      ...lines.map((line, i) => `(${line}) Tj${i < lines.length - 1 ? ' T*' : ''}`),
      'ET'
    ].join('\n');
    const pdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj
4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Courier>>endobj
5 0 obj<</Length ${stream.length}>>stream
${stream}
endstream
endobj
xref
0 6
0000000000 65535 f 
trailer<</Size 6/Root 1 0 R>>
startxref
0
%%EOF`;
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.pdf`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const replaceFlowLogos = () => {
    document.querySelectorAll(
      'a[href*="flow.google"] img, a[href*="labs.google"] img, img[alt*="Flow" i], img[alt*="Google Flow" i]'
    ).forEach((img) => {
      if (img.getAttribute('src') !== FLOW_ICON) img.setAttribute('src', FLOW_ICON);
    });
    document.querySelectorAll('a[href*="capcut.com"] img, img[alt*="CapCut" i]').forEach((img) => {
      if (img.getAttribute('src') !== CAPCUT_ICON) img.setAttribute('src', CAPCUT_ICON);
    });
    document.querySelectorAll(
      'a[href*="chatgpt.com"] img, a[href*="openai.com"] img, img[alt*="ChatGPT" i], img[alt*="Chat GPT" i], img[alt*="OpenAI" i]'
    ).forEach((img) => {
      if (img.getAttribute('src') !== CHATGPT_ICON) img.setAttribute('src', CHATGPT_ICON);
    });
  };

  const openFixedPrompt = (button) => {
    const box = button.closest('.workflow-prompt');
    const pre = box?.querySelector('[data-step-prompt]');
    if (!pre) return;

    document.querySelector('[data-prompt-modal]')?.remove();

    const modal = document.createElement('div');
    modal.setAttribute('data-prompt-modal', '');
    modal.innerHTML = `
      <div class="prompt-modal-backdrop"></div>
      <div class="prompt-modal-dialog" role="dialog" aria-modal="true" aria-label="Expanded prompt">
        <div class="prompt-modal-head">
          <span>FULL PROMPT</span>
          <button type="button" data-close-prompt>Close</button>
        </div>
        <pre></pre>
        <div class="prompt-modal-actions">
          <button type="button" data-modal-copy>Copy</button>
          <button type="button" data-modal-download>Download PDF</button>
        </div>
      </div>`;
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
    modal.querySelector('[data-modal-download]')?.addEventListener('click', () => {
      downloadPdf(pre.textContent || '');
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
      if (button.dataset.sfPromptFixed === 'true') return;
      const replacement = button.cloneNode(true);
      replacement.dataset.sfPromptFixed = 'true';
      button.replaceWith(replacement);
      replacement.addEventListener('click', () => openFixedPrompt(replacement));
    });
  };

  const blueprintStyle = () => {
    if (document.getElementById('sf-blueprint-graph-style')) return;

    const style = document.createElement('style');
    style.id = 'sf-blueprint-graph-style';
    style.textContent = `
      /* Blueprint shell: single continuous container with black background */
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint,
      .blueprint-inner-workflow-container.sf-graph-blueprint,
      .blueprint-workflow-container {
        position: relative !important;
        background: #000000 !important;
        background-color: #000000 !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        border-radius: 20px !important;
        box-shadow: 0 20px 60px rgba(0,0,0,.55) !important;
        overflow: hidden !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        width: 100% !important;
      }

      .testing-1-theme .blueprint-integrated-header,
      .blueprint-integrated-header {
        background: linear-gradient(180deg, rgba(13, 22, 38, 0.75) 0%, rgba(8, 14, 25, 0.88) 100%) !important;
        background-color: #09101d !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-workflow-stream {
        position: relative !important;
        display: grid !important;
        grid-template-columns: minmax(0,1fr) minmax(0,1fr) !important;
        grid-auto-rows: auto !important;
        column-gap: clamp(28px, 5vw, 72px) !important;
        row-gap: 26px !important;
        width: 100% !important;
        min-width: 0 !important;
        padding: 42px clamp(18px, 4vw, 48px) 42px !important;
        box-sizing: border-box !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper {
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        position: relative !important;
        z-index: 5 !important;
      }

      /* Reference composition on desktop. Additional steps continue vertically. */
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="1"] {
        grid-column: 1 !important; grid-row: 1 !important;
      }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="2"] {
        grid-column: 1 !important; grid-row: 2 !important;
      }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="3"] {
        grid-column: 2 !important; grid-row: 2 !important;
      }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="4"],
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="5"],
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="6"],
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="7"],
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="8"],
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="9"],
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="10"] {
        grid-column: 1 / span 2 !important;
        width: min(760px, 100%) !important;
        justify-self: center !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="4"] { grid-row: 3 !important; }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="5"] { grid-row: 4 !important; }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="6"] { grid-row: 5 !important; }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="7"] { grid-row: 6 !important; }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="8"] { grid-row: 7 !important; }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="9"] { grid-row: 8 !important; }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="10"] { grid-row: 9 !important; }

      /* Preserve the real step cards and their content; only normalize their shell. */
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-container {
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
        position: relative !important;
        z-index: 6 !important;
        overflow: visible !important;
        background: linear-gradient(180deg, #0D1525 0%, #09111F 100%) !important;
        border: 1px solid rgba(94,164,255,.25) !important;
        border-radius: 20px !important;
        box-shadow: 0 18px 40px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.05) !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-capsule,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-capsule,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-capsule,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-step-capsule {
        position: absolute !important;
        top: 0 !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 9 !important;
        white-space: nowrap !important;
        background: #0A1020 !important;
        border: 1px solid rgba(94,164,255,.30) !important;
        border-radius: 999px !important;
        box-shadow: 0 8px 20px rgba(0,0,0,.35) !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 76px !important;
        min-width: 76px !important;
        max-width: 76px !important;
        height: 25px !important;
        min-height: 25px !important;
        max-height: 25px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-capsule span,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-capsule span,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-capsule span,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-step-capsule span {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        font-family: 'JetBrains Mono', monospace !important;
        color: #CBD5E1 !important;
        font-size: 9.5px !important;
        font-weight: 700 !important;
        letter-spacing: .08em !important;
        text-indent: .08em !important;
        line-height: 1 !important;
        transform: translateY(0.5px) !important;
      }

      /* Keep the existing title, description, media and expand control; give them enough room. */
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-container > * {
        box-sizing: border-box !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-container img,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-container video {
        max-width: 100% !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-container [data-step-toggle],
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-container .step-toggle,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-container button {
        z-index: 10 !important;
      }

      /* Remove old connector visuals so there is never a duplicate line/arrow. */
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-stream-connector,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .workflow-process-terminal {
        display: none !important;
      }

      .sf-blueprint-graph-svg {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: visible !important;
        pointer-events: none !important;
        z-index: 15 !important;
      }

      .sf-blueprint-graph-svg path {
        fill: none !important;
        stroke: #27B7FF !important;
        stroke-width: 2.2 !important;
        stroke-linecap: round !important;
        stroke-linejoin: round !important;
        opacity: .95 !important;
        vector-effect: non-scaling-stroke !important;
      }

      .sf-blueprint-graph-svg circle {
        fill: #FFFFFF !important;
        stroke: #27B7FF !important;
        stroke-width: 1.5 !important;
        filter: drop-shadow(0 0 3px rgba(39, 183, 255, 0.65)) !important;
        vector-effect: non-scaling-stroke !important;
      }

      /* Result is kept as the real existing embed, with boundary tightened to cover elements snugly */
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result {
        grid-column: 1 / span 2 !important;
        width: fit-content !important;
        max-width: 320px !important;
        justify-self: center !important;
        position: relative !important;
        z-index: 6 !important;
        margin: 48px auto 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        background: linear-gradient(180deg, #0D1628 0%, #08101E 100%) !important;
        border: 1px solid rgba(94, 164, 255, 0.28) !important;
        border-radius: 18px !important;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
        overflow: visible !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-inner {
        width: 100% !important;
        max-width: 100% !important;
        padding: 16px 12px 14px !important;
        gap: 10px !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        background: transparent !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-card-scale-wrapper {
        position: relative !important;
        --card-base-w: 328px !important;
        --card-base-h: 590px !important;
        --card-scale: 0.82 !important;
        width: calc(var(--card-base-w) * var(--card-scale)) !important;
        height: calc(var(--card-base-h) * var(--card-scale)) !important;
        margin: 0 auto !important;
        left: 0 !important;
        right: 0 !important;
        overflow: hidden !important;
        border-radius: 12px !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .video-frame {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: var(--card-base-w) !important;
        height: var(--card-base-h) !important;
        min-height: var(--card-base-h) !important;
        max-width: var(--card-base-w) !important;
        transform: scale(var(--card-scale)) !important;
        transform-origin: 0 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-capsule,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-capsule {
        position: absolute !important;
        top: 0 !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        width: 68px !important;
        min-width: 68px !important;
        max-width: 68px !important;
        height: 18px !important;
        min-height: 18px !important;
        max-height: 18px !important;
        border-radius: 9999px !important;
        background: #0A1220 !important;
        border: 1px solid rgba(94, 164, 255, 0.38) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45) !important;
        box-sizing: border-box !important;
        z-index: 12 !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-capsule span,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-capsule span {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        font-family: 'JetBrains Mono', monospace !important;
        font-size: 8.5px !important;
        font-weight: 700 !important;
        letter-spacing: 0.06em !important;
        text-indent: 0.06em !important;
        line-height: 1 !important;
        transform: translateY(0.75px) !important;
        color: #E2E8F0 !important;
        text-transform: uppercase !important;
      }

      .testing-1-theme .blueprint-final-title {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 15px !important;
        font-weight: 700 !important;
        margin: 0 !important;
        line-height: 1.25 !important;
        letter-spacing: -0.015em !important;
        color: #F8FAFC !important;
        text-align: center !important;
      }

      .testing-1-theme .blueprint-final-desc {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 12px !important;
        font-weight: 400 !important;
        margin: 0 !important;
        line-height: 1.35 !important;
        color: #94A3B8 !important;
        text-align: center !important;
      }

      @media (max-width: 700px) {
        /* No horizontal scrolling on mobile: every card stays inside the same black blueprint box. */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint {
          overflow: hidden !important;
          border-radius: 20px !important;
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        /* 2-column grid for Step cards inside blueprint */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-workflow-stream {
          position: relative !important;
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          column-gap: 12px !important;
          row-gap: 38px !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          padding: 12px 12px 30px !important;
          box-sizing: border-box !important;
          overflow-x: hidden !important;
        }

        /* Two-column layout: Step 01 and Step 03 sit side-by-side in Row 1 */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper {
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="1"] {
          grid-column: 1 !important;
          grid-row: 1 !important;
          width: 100% !important;
          justify-self: stretch !important;
        }
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="3"] {
          grid-column: 2 !important;
          grid-row: 1 !important;
          width: 100% !important;
          justify-self: stretch !important;
        }
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="2"] {
          grid-column: 1 !important;
          grid-row: 2 !important;
          width: 100% !important;
          justify-self: stretch !important;
        }
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="4"] {
          grid-column: 1 / span 2 !important;
          grid-row: 3 !important;
          width: calc((100% - 12px) / 2) !important;
          max-width: calc((100% - 12px) / 2) !important;
          justify-self: center !important;
          margin: 0 auto !important;
        }
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="5"] {
          grid-column: 1 / span 2 !important;
          grid-row: 4 !important;
          width: calc((100% - 12px) / 2) !important;
          max-width: calc((100% - 12px) / 2) !important;
          justify-self: center !important;
          margin: 0 auto !important;
        }
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="6"] {
          grid-column: 1 / span 2 !important;
          grid-row: 5 !important;
          width: calc((100% - 12px) / 2) !important;
          max-width: calc((100% - 12px) / 2) !important;
          justify-self: center !important;
          margin: 0 auto !important;
        }

        /* Specific mobile dependency-driven positioning for Cinematic Medieval Knight Video — Google Flow */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint[data-resource-slug="cinematic-medieval-knight-video-google-flow"],
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint.workflow-resource-knight,
        [data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-inner-workflow-container.sf-graph-blueprint {
          position: relative !important;
          overflow-x: hidden !important;
          overflow-y: visible !important;
        }

        /* Controls Bar (Reset on left, Expand on right) */
        .testing-1-theme .blueprint-canvas-controls,
        .blueprint-canvas-controls {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 6px !important;
          width: 100% !important;
          margin: 0 0 8px 0 !important;
          padding: 0 !important;
          position: relative !important;
          z-index: 20 !important;
        }

        .testing-1-theme .blueprint-canvas-btn,
        .testing-1-theme .blueprint-inner-expand-control,
        .testing-1-theme .blueprint-reset-control,
        .blueprint-canvas-btn,
        .blueprint-inner-expand-control,
        .blueprint-reset-control {
          position: relative !important;
          top: auto !important;
          right: auto !important;
          left: auto !important;
          bottom: auto !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 28px !important;
          height: 28px !important;
          min-width: 28px !important;
          min-height: 28px !important;
          max-width: 28px !important;
          max-height: 28px !important;
          border-radius: 7px !important;
          box-sizing: border-box !important;
          cursor: pointer !important;
          padding: 0 !important;
          margin: 0 !important;
          z-index: 20 !important;
        }

        /* Scrollable blueprint workflow pane */
        .testing-1-theme .blueprint-workflow-scroll-pane,
        .blueprint-workflow-scroll-pane {
          position: relative !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          overflow-y: visible !important;
          -webkit-overflow-scrolling: touch !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
          touch-action: auto !important;
        }
        .testing-1-theme .blueprint-workflow-scroll-pane,
        .testing-1-theme .blueprint-workflow-container,
        .testing-1-theme .blueprint-inner-workflow-container,
        .blueprint-workflow-container,
        .blueprint-workflow-stream,
        .blueprint-canvas-workspace {
          touch-action: auto !important;
        }
        .testing-1-theme .blueprint-workflow-scroll-pane::-webkit-scrollbar,
        .blueprint-workflow-scroll-pane::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen)[data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-workflow-stream,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint.workflow-resource-knight:not(.is-blueprint-fullscreen) .blueprint-workflow-stream,
        [data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen) .blueprint-workflow-stream {
          position: relative !important;
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          column-gap: 52px !important;
          row-gap: 0 !important;
          min-width: 440px !important;
          width: 100% !important;
          padding: 12px 18px 36px !important;
          box-sizing: border-box !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen)[data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-step-wrapper[data-blueprint-step="1"],
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint.workflow-resource-knight:not(.is-blueprint-fullscreen) .blueprint-step-wrapper[data-blueprint-step="1"],
        [data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen) .blueprint-step-wrapper[data-blueprint-step="1"] {
          grid-column: 1 / span 2 !important;
          grid-row: 1 !important;
          width: calc((100% - 52px) / 2) !important;
          max-width: calc((100% - 52px) / 2) !important;
          justify-self: center !important;
          margin: 0 auto !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen)[data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-step-wrapper[data-blueprint-step="2"],
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint.workflow-resource-knight:not(.is-blueprint-fullscreen) .blueprint-step-wrapper[data-blueprint-step="2"],
        [data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen) .blueprint-step-wrapper[data-blueprint-step="2"] {
          grid-column: 1 !important;
          grid-row: 2 !important;
          width: 100% !important;
          max-width: 100% !important;
          justify-self: stretch !important;
          margin-top: 54px !important;
          margin-bottom: 0 !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen)[data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-step-wrapper[data-blueprint-step="3"],
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint.workflow-resource-knight:not(.is-blueprint-fullscreen) .blueprint-step-wrapper[data-blueprint-step="3"],
        [data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen) .blueprint-step-wrapper[data-blueprint-step="3"] {
          grid-column: 2 !important;
          grid-row: 2 !important;
          width: 100% !important;
          max-width: 100% !important;
          justify-self: stretch !important;
          margin-top: 54px !important;
          margin-bottom: 0 !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen)[data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-step-wrapper[data-blueprint-step="4"],
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint.workflow-resource-knight:not(.is-blueprint-fullscreen) .blueprint-step-wrapper[data-blueprint-step="4"],
        [data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen) .blueprint-step-wrapper[data-blueprint-step="4"] {
          grid-column: 1 / span 2 !important;
          grid-row: 3 !important;
          width: calc((100% - 52px) / 2) !important;
          max-width: calc((100% - 52px) / 2) !important;
          justify-self: center !important;
          margin: 88px auto 0 !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen)[data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-step-wrapper[data-blueprint-step="5"],
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint.workflow-resource-knight:not(.is-blueprint-fullscreen) .blueprint-step-wrapper[data-blueprint-step="5"],
        [data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen) .blueprint-step-wrapper[data-blueprint-step="5"] {
          grid-column: 1 / span 2 !important;
          grid-row: 4 !important;
          width: calc((100% - 52px) / 2) !important;
          max-width: calc((100% - 52px) / 2) !important;
          justify-self: center !important;
          margin: 48px auto 0 !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen)[data-resource-slug="cinematic-medieval-knight-video-google-flow"] #workflow-final-result,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint.workflow-resource-knight:not(.is-blueprint-fullscreen) #workflow-final-result,
        [data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-inner-workflow-container.sf-graph-blueprint:not(.is-blueprint-fullscreen) #workflow-final-result {
          grid-column: 1 / span 2 !important;
          grid-row: 5 !important;
          width: fit-content !important;
          min-width: 0 !important;
          max-width: 320px !important;
          justify-self: center !important;
          margin: 48px auto 0 !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }

        /* Step cards: true square 1:1 aspect-ratio matching Skill Foundry design */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-container {
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          aspect-ratio: 1 / 1 !important;
          height: auto !important;
          max-height: none !important;
          min-height: 0 !important;
          position: relative !important;
          border-radius: 18px !important;
          box-sizing: border-box !important;
          overflow: visible !important;
          margin: 0 !important;
          padding: 0 !important;
          background: linear-gradient(180deg, #0D1628 0%, #08101E 100%) !important;
          border: 1px solid rgba(94, 164, 255, 0.28) !important;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
        }

        /* Step number capsule & Result section heading capsule: matched size, perfectly centered horizontally and vertically */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-capsule,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-capsule,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-capsule,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-step-capsule {
          position: absolute !important;
          top: 0 !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          z-index: 12 !important;
          white-space: nowrap !important;
          width: 68px !important;
          min-width: 68px !important;
          max-width: 68px !important;
          padding: 0 !important;
          margin: 0 !important;
          height: 18px !important;
          min-height: 18px !important;
          max-height: 18px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          border-radius: 9999px !important;
          background: #0A1220 !important;
          border: 1px solid rgba(94, 164, 255, 0.38) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45) !important;
          box-sizing: border-box !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-capsule span,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-capsule span,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-capsule span,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-step-capsule span {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 8.5px !important;
          font-weight: 700 !important;
          letter-spacing: 0.06em !important;
          text-indent: 0.06em !important;
          line-height: 1 !important;
          transform: translateY(0.75px) !important;
          color: #E2E8F0 !important;
          text-transform: uppercase !important;
        }

        :root[data-theme="light"] .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-capsule,
        html.light-theme .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-capsule,
        :root[data-theme="light"] .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-capsule,
        html.light-theme .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-capsule,
        :root[data-theme="light"] .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-capsule,
        html.light-theme .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-capsule {
          background: #FFFFFF !important;
          border: 1px solid #CBD5E1 !important;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05) !important;
        }

        :root[data-theme="light"] .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-capsule span,
        html.light-theme .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-capsule span,
        :root[data-theme="light"] .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-capsule span,
        html.light-theme .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-capsule span,
        :root[data-theme="light"] .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-capsule span,
        html.light-theme .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-capsule span {
          color: #475569 !important;
        }

        /* Header trigger button filling square card with controlled internal margins: generous top clearance prevents capsule touching image */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-header {
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          justify-content: flex-start !important;
          gap: 0 !important;
          width: 100% !important;
          height: 100% !important;
          max-height: 100% !important;
          min-height: 0 !important;
          padding: 20px 7px 5px 7px !important;
          box-sizing: border-box !important;
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          text-align: left !important;
          overflow: hidden !important;
          border-radius: 18px !important;
        }

        /* One horizontal 16:9 thumbnail image: horizontally centered with controlled equal left/right margins */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .step-header-thumb-box {
          position: relative !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          aspect-ratio: 16 / 9 !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
          flex: 0 0 auto !important;
          border-radius: 7px !important;
          overflow: hidden !important;
          background: #060B14 !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35) !important;
          margin: 0 auto !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          align-self: center !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .step-header-thumb-main {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          aspect-ratio: 16 / 9 !important;
          object-fit: cover !important;
          display: block !important;
          border-radius: 7px !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .step-header-thumb-backdrop,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .step-header-thumb-overlay,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .step-header-thumb-play {
          display: none !important;
        }

        /* Text container directly below thumbnail sharing exact same left edge alignment */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .step-header-info {
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          gap: 1.5px !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          margin: 4px 0 0 0 !important;
          padding: 0 !important;
          flex: 1 1 auto !important;
          min-height: 0 !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
          text-align: left !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .step-header-title-row {
          width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          overflow: hidden !important;
          text-align: left !important;
        }

        /* One-line title with ellipsis, aligned with thumbnail left edge */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .step-header-title {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          font-size: clamp(10px, 2.7vw, 11.5px) !important;
          font-weight: 700 !important;
          line-height: 1.25 !important;
          color: #F8FAFC !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          text-align: left !important;
        }

        /* Maximum two-line description with ellipsis, comfortable spacing without clipping */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .step-header-purpose {
          display: -webkit-box !important;
          -webkit-line-clamp: 2 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          font-size: clamp(8px, 2.1vw, 9.5px) !important;
          line-height: 1.25 !important;
          color: #94A3B8 !important;
          word-break: break-word !important;
          text-align: left !important;
        }

        /* Hide chevron inside compact square header on mobile */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .step-header-action {
          display: none !important;
        }

        /* Preserving expand/click behavior */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper:has(.blueprint-step-container.is-expanded) {
          grid-column: 1 / span 2 !important;
        }
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-container.is-expanded {
          aspect-ratio: auto !important;
          height: auto !important;
        }
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-container.is-expanded .blueprint-step-header {
          height: auto !important;
          max-height: none !important;
        }

        /* Result card: outer boundary tightened and scaled down proportionally on mobile */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block {
          grid-column: 1 / span 2 !important;
          grid-row: auto !important;
          width: fit-content !important;
          min-width: 0 !important;
          max-width: calc(100% - 24px) !important;
          justify-self: center !important;
          margin: 44px auto 0 !important;
          border-radius: 16px !important;
          box-sizing: border-box !important;
          padding: 0 !important;
          overflow: visible !important;
          position: relative !important;
          background: linear-gradient(180deg, #0D1628 0%, #08101E 100%) !important;
          border: 1px solid rgba(94, 164, 255, 0.28) !important;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-inner,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-inner {
          width: 100% !important;
          max-width: 100% !important;
          padding: 14px 8px 10px !important;
          gap: 8px !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-card-scale-wrapper,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-card-scale-wrapper {
          position: relative !important;
          --card-base-w: 328px !important;
          --card-base-h: 590px !important;
          --card-scale: 0.70 !important;
          width: calc(var(--card-base-w) * var(--card-scale)) !important;
          height: calc(var(--card-base-h) * var(--card-scale)) !important;
          margin: 0 auto !important;
          left: 0 !important;
          right: 0 !important;
          overflow: hidden !important;
          border-radius: 10px !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-card-scale-wrapper .video-frame,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-card-scale-wrapper .video-frame {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: var(--card-base-w) !important;
          height: var(--card-base-h) !important;
          min-height: var(--card-base-h) !important;
          max-width: var(--card-base-w) !important;
          transform: scale(var(--card-scale)) !important;
          transform-origin: 0 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          background: transparent !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-capsule,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-capsule {
          position: absolute !important;
          top: 0 !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          width: 68px !important;
          min-width: 68px !important;
          max-width: 68px !important;
          height: 18px !important;
          min-height: 18px !important;
          max-height: 18px !important;
          border-radius: 9999px !important;
          background: #0A1220 !important;
          border: 1px solid rgba(94, 164, 255, 0.38) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45) !important;
          box-sizing: border-box !important;
          z-index: 12 !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-result-block .blueprint-result-capsule span,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-capsule span {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 8.5px !important;
          font-weight: 700 !important;
          letter-spacing: 0.06em !important;
          text-indent: 0.06em !important;
          line-height: 1 !important;
          transform: translateY(0.75px) !important;
          color: #E2E8F0 !important;
          text-transform: uppercase !important;
        }

        .testing-1-theme .blueprint-final-title {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          font-size: clamp(11px, 2.7vw, 12.5px) !important;
          font-weight: 700 !important;
          margin: 0 !important;
          line-height: 1.25 !important;
          letter-spacing: -0.015em !important;
          color: #F8FAFC !important;
          text-align: center !important;
        }

        .testing-1-theme .blueprint-final-desc {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          font-size: clamp(8.5px, 2.1vw, 10px) !important;
          font-weight: 400 !important;
          margin: 0 !important;
          line-height: 1.35 !important;
          color: #94A3B8 !important;
          text-align: center !important;
        }
      }

      /* Fixed Diagram Viewer rules inside fullscreen mode: locked 440px canvas, uniform scale */
      #blueprint-inner-workflow-tray.is-blueprint-fullscreen,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen,
      .blueprint-workflow-container.is-blueprint-fullscreen {
        position: fixed !important;
        inset: 0 !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        width: 100dvw !important;
        height: 100vh !important;
        height: 100dvh !important;
        max-width: 100vw !important;
        max-height: 100dvh !important;
        z-index: 999999 !important;
        background: #000000 !important;
        background-color: #000000 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        touch-action: pan-x pan-y !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-integrated-header,
      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-integrated-divider,
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-integrated-header,
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-integrated-divider,
      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .workflow-process-terminal,
      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-stream-connector {
        display: none !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-canvas-workspace,
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-canvas-workspace {
        position: relative !important;
        flex: 1 1 100% !important;
        width: 100% !important;
        height: 100% !important;
        max-height: 100% !important;
        background: #000000 !important;
        background-color: #000000 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-canvas-controls,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-canvas-controls,
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-canvas-controls {
        position: absolute !important;
        top: max(16px, env(safe-area-inset-top, 16px)) !important;
        right: max(16px, env(safe-area-inset-right, 16px)) !important;
        left: auto !important;
        z-index: 1000 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 8px !important;
        width: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        pointer-events: none !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-canvas-controls .blueprint-canvas-btn,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-canvas-controls .blueprint-canvas-btn,
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-canvas-controls .blueprint-canvas-btn {
        pointer-events: auto !important;
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
        min-height: 32px !important;
        max-width: 32px !important;
        max-height: 32px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 8px !important;
        background: rgba(15, 23, 42, 0.85) !important;
        border: 1px solid rgba(255, 255, 255, 0.22) !important;
        color: #E2E8F0 !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
        cursor: pointer !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-workflow-scroll-pane,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-workflow-scroll-pane,
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-workflow-scroll-pane {
        position: relative !important;
        flex: 1 1 100% !important;
        width: 100% !important;
        height: 100% !important;
        max-height: 100% !important;
        overflow-x: auto !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        touch-action: pan-x pan-y !important;
        background: #000000 !important;
        background-color: #000000 !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-workflow-scroll-pane::-webkit-scrollbar,
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-workflow-scroll-pane::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-zoom-stage,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-zoom-stage,
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-zoom-stage {
        display: block !important;
        width: 100% !important;
        min-width: 100% !important;
        min-height: 100% !important;
        box-sizing: border-box !important;
        position: relative !important;
        padding-top: max(56px, calc(env(safe-area-inset-top, 16px) + 40px)) !important;
        padding-bottom: max(60px, env(safe-area-inset-bottom, 36px)) !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        background: #000000 !important;
        background-color: #000000 !important;
        touch-action: pan-x pan-y !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-zoom-layer,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-zoom-layer,
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-zoom-layer {
        position: relative !important;
        margin-left: auto !important;
        margin-right: auto !important;
        flex-shrink: 0 !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        touch-action: pan-x pan-y !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-workflow-stream,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-workflow-stream,
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-workflow-stream,
      [data-resource-slug="cinematic-medieval-knight-video-google-flow"]#blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-workflow-stream,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint.is-blueprint-fullscreen[data-resource-slug="cinematic-medieval-knight-video-google-flow"] .blueprint-workflow-stream,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint.is-blueprint-fullscreen.workflow-resource-knight .blueprint-workflow-stream {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 440px !important;
        min-width: 440px !important;
        max-width: 440px !important;
        margin: 0 !important;
        padding: 12px 18px 48px !important;
        box-sizing: border-box !important;
        touch-action: pan-x pan-y !important;
        overflow: visible !important;
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        column-gap: 52px !important;
        row-gap: 0 !important;
        background: transparent !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="1"],
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="1"],
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="1"] {
        grid-column: 1 / span 2 !important;
        grid-row: 1 !important;
        width: 176px !important;
        max-width: 176px !important;
        justify-self: center !important;
        margin: 0 auto !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="2"],
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="2"],
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="2"] {
        grid-column: 1 !important;
        grid-row: 2 !important;
        width: 176px !important;
        max-width: 176px !important;
        justify-self: stretch !important;
        margin-top: 54px !important;
        margin-bottom: 0 !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="3"],
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="3"],
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="3"] {
        grid-column: 2 !important;
        grid-row: 2 !important;
        width: 176px !important;
        max-width: 176px !important;
        justify-self: stretch !important;
        margin-top: 54px !important;
        margin-bottom: 0 !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="4"],
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="4"],
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="4"] {
        grid-column: 1 / span 2 !important;
        grid-row: 3 !important;
        width: 176px !important;
        max-width: 176px !important;
        justify-self: center !important;
        margin: 88px auto 0 !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="5"],
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="5"],
      .blueprint-workflow-container.is-blueprint-fullscreen .blueprint-step-wrapper[data-blueprint-step="5"] {
        grid-column: 1 / span 2 !important;
        grid-row: 4 !important;
        width: 176px !important;
        max-width: 176px !important;
        justify-self: center !important;
        margin: 48px auto 0 !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen #workflow-final-result,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen #workflow-final-result,
      .blueprint-workflow-container.is-blueprint-fullscreen #workflow-final-result {
        grid-column: 1 / span 2 !important;
        grid-row: 5 !important;
        width: fit-content !important;
        min-width: 0 !important;
        max-width: 250px !important;
        justify-self: center !important;
        margin: 48px auto 0 !important;
        box-sizing: border-box !important;
        overflow: visible !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-step-container,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-step-container {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
        aspect-ratio: 1 / 1 !important;
        height: auto !important;
        border-radius: 18px !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .step-header-title,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .step-header-title {
        font-size: 11px !important;
        font-weight: 700 !important;
        line-height: 1.25 !important;
        color: #F8FAFC !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        text-align: left !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .step-header-purpose,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .step-header-purpose {
        font-size: 9.5px !important;
        line-height: 1.25 !important;
        color: #94A3B8 !important;
        display: -webkit-box !important;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        word-break: break-word !important;
        text-align: left !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-final-title,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-final-title {
        font-size: 12px !important;
        font-weight: 700 !important;
        line-height: 1.25 !important;
        text-align: center !important;
        margin: 0 !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-final-desc,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .blueprint-final-desc {
        font-size: 9.5px !important;
        line-height: 1.35 !important;
        text-align: center !important;
        margin: 0 !important;
      }

      #blueprint-inner-workflow-tray.is-blueprint-fullscreen .sf-blueprint-graph-svg,
      .testing-1-theme #blueprint-inner-workflow-tray.is-blueprint-fullscreen .sf-blueprint-graph-svg {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        pointer-events: none !important;
        z-index: 2 !important;
        overflow: visible !important;
      }
    `;
    document.head.appendChild(style);
  };

  const pointFor = (element, streamRect, side) => {
    const r = element?.getBoundingClientRect();
    if (!r) return null;
    const x = r.left - streamRect.left;
    const y = r.top - streamRect.top;
    if (side === 'top') return { x: x + r.width / 2, y };
    if (side === 'bottom') return { x: x + r.width / 2, y: y + r.height };
    if (side === 'right') return { x: x + r.width, y: y + r.height / 2 };
    if (side === 'left') return { x, y: y + r.height / 2 };
    return { x: x + r.width / 2, y: y + r.height / 2 };
  };

  const makePath = (d) => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    return p;
  };

  const makeDot = (point, radius = 3.5) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', String(point.x));
    c.setAttribute('cy', String(point.y));
    c.setAttribute('r', String(radius));
    return c;
  };

  const getStepBox = (wrapper) => wrapper?.querySelector('.blueprint-step-container');

  const drawKnightConnections = (svg, steps, streamRect, result) => {
    const getStepByNum = (n) => {
      const wrapper = steps.find((s) => s.getAttribute('data-blueprint-step') === String(n));
      return getStepBox(wrapper);
    };

    const step1 = getStepByNum(1);
    const step2 = getStepByNum(2);
    const step3 = getStepByNum(3);
    const step4 = getStepByNum(4);
    const step5 = getStepByNum(5);

    const DOT_RADIUS = 3.5;
    const GAP = 2.5; // tiny intentional visual gap outside the card/capsule boundary
    const dotOffset = DOT_RADIUS + GAP; // 6px

    /* 
     * Cinematic Medieval Knight Video — Google Flow:
     * Exactly 6 connections:
     * 1. STEP 01 -> STEP 02 (leaves bottom left of Step 01, stepped curve into Step 02 capsule)
     * 2. STEP 01 -> STEP 04 (leaves bottom center of Step 01, pure vertical line through enlarged gap into Step 04 center dot)
     * 3. STEP 02 -> STEP 04 (leaves bottom center of Step 02, curved into Step 04 LEFT dot above capsule)
     * 4. STEP 03 -> STEP 04 (leaves bottom center of Step 03, curved into Step 04 RIGHT dot above capsule)
     * 5. STEP 04 -> STEP 05 (pure vertical line into Step 05 capsule)
     * 6. STEP 05 -> RESULT  (pure vertical line into RESULT capsule)
     */

    if (step1) {
      const r1 = step1.getBoundingClientRect();
      const s1Left = r1.left - streamRect.left;
      const s1Width = r1.width;
      const s1BottomY = r1.top - streamRect.top + r1.height;

      // Two distinct output ports on Step 01's bottom border (outside border with tiny gap):
      // Left dot (28% width): connects to Step 02
      // Center dot (50% width): connects straight down to Step 04
      const s1DotLeft = { x: s1Left + s1Width * 0.28, y: s1BottomY + dotOffset };
      const s1DotCenter = { x: s1Left + s1Width * 0.50, y: s1BottomY + dotOffset };

      // 1. STEP 01 -> STEP 02:
      if (step2) {
        const r2 = step2.getBoundingClientRect();
        const s2TopX = r2.left - streamRect.left + r2.width / 2;
        const s2TopY = r2.top - streamRect.top;
        const endPt = { x: s2TopX, y: s2TopY - 9 - dotOffset };

        const cornerR = 10;
        const midY = (s1DotLeft.y + endPt.y) / 2;
        const d = `M ${s1DotLeft.x} ${s1DotLeft.y} ` +
                  `L ${s1DotLeft.x} ${midY - cornerR} ` +
                  `Q ${s1DotLeft.x} ${midY} ${s1DotLeft.x - cornerR} ${midY} ` +
                  `L ${endPt.x + cornerR} ${midY} ` +
                  `Q ${endPt.x} ${midY} ${endPt.x} ${midY + cornerR} ` +
                  `L ${endPt.x} ${endPt.y}`;

        svg.appendChild(makePath(d));
        svg.appendChild(makeDot(s1DotLeft, DOT_RADIUS));
        svg.appendChild(makeDot(endPt, DOT_RADIUS));
      }

      // Step 04 incoming connections
      if (step4) {
        const r4 = step4.getBoundingClientRect();
        const s4TopY = r4.top - streamRect.top;
        const s4Left = r4.left - streamRect.left;
        const s4Width = r4.width;

        const s4DotsY = s4TopY - 17;
        const inPtLeft = { x: s4Left + s4Width * 0.50 - 24, y: s4DotsY };
        const inPtCenter = { x: s4Left + s4Width * 0.50, y: s4DotsY };
        const inPtRight = { x: s4Left + s4Width * 0.50 + 24, y: s4DotsY };

        // 2. STEP 01 -> STEP 04:
        // Perfectly straight vertical line through the enlarged central opening between Step 02 and Step 03
        const lineX = s1DotCenter.x;
        svg.appendChild(makePath(`M ${lineX} ${s1DotCenter.y} L ${lineX} ${inPtCenter.y}`));
        svg.appendChild(makeDot(s1DotCenter, DOT_RADIUS));
        svg.appendChild(makeDot(inPtCenter, DOT_RADIUS));

        // 3. STEP 02 -> STEP 04:
        // Leaves Step 02 bottom border center, curves naturally into Step 04 LEFT dot
        if (step2) {
          const r2 = step2.getBoundingClientRect();
          const s2BottomX = r2.left - streamRect.left + r2.width / 2;
          const s2BottomY = r2.top - streamRect.top + r2.height;
          const startPt = { x: s2BottomX, y: s2BottomY + dotOffset };

          const cornerR = 12;
          const midY = (startPt.y + inPtLeft.y) / 2;
          const d = `M ${startPt.x} ${startPt.y} ` +
                    `L ${startPt.x} ${midY - cornerR} ` +
                    `Q ${startPt.x} ${midY} ${startPt.x + cornerR} ${midY} ` +
                    `L ${inPtLeft.x - cornerR} ${midY} ` +
                    `Q ${inPtLeft.x} ${midY} ${inPtLeft.x} ${midY + cornerR} ` +
                    `L ${inPtLeft.x} ${inPtLeft.y}`;

          svg.appendChild(makePath(d));
          svg.appendChild(makeDot(startPt, DOT_RADIUS));
          svg.appendChild(makeDot(inPtLeft, DOT_RADIUS));
        }

        // 4. STEP 03 -> STEP 04:
        // Leaves Step 03 bottom border center, curves naturally into Step 04 RIGHT dot
        if (step3) {
          const r3 = step3.getBoundingClientRect();
          const s3BottomX = r3.left - streamRect.left + r3.width / 2;
          const s3BottomY = r3.top - streamRect.top + r3.height;
          const startPt = { x: s3BottomX, y: s3BottomY + dotOffset };

          const cornerR = 12;
          const midY = (startPt.y + inPtRight.y) / 2;
          const d = `M ${startPt.x} ${startPt.y} ` +
                    `L ${startPt.x} ${midY - cornerR} ` +
                    `Q ${startPt.x} ${midY} ${startPt.x - cornerR} ${midY} ` +
                    `L ${inPtRight.x + cornerR} ${midY} ` +
                    `Q ${inPtRight.x} ${midY} ${inPtRight.x} ${midY + cornerR} ` +
                    `L ${inPtRight.x} ${inPtRight.y}`;

          svg.appendChild(makePath(d));
          svg.appendChild(makeDot(startPt, DOT_RADIUS));
          svg.appendChild(makeDot(inPtRight, DOT_RADIUS));
        }
      }
    }

    // 5. STEP 04 -> STEP 05: vertically aligned straight line into Step 05 capsule
    if (step4 && step5) {
      const r4 = step4.getBoundingClientRect();
      const r5 = step5.getBoundingClientRect();
      const s4BottomX = r4.left - streamRect.left + r4.width / 2;
      const s4BottomY = r4.top - streamRect.top + r4.height;
      const s5TopY = r5.top - streamRect.top;

      const startPt = { x: s4BottomX, y: s4BottomY + dotOffset };
      const endPt = { x: s4BottomX, y: s5TopY - 9 - dotOffset };

      svg.appendChild(makePath(`M ${startPt.x} ${startPt.y} L ${endPt.x} ${endPt.y}`));
      svg.appendChild(makeDot(startPt, DOT_RADIUS));
      svg.appendChild(makeDot(endPt, DOT_RADIUS));
    }

    // 6. STEP 05 -> RESULT: vertically aligned straight line into RESULT capsule
    if (step5 && result) {
      const r5 = step5.getBoundingClientRect();
      const rRes = result.getBoundingClientRect();
      const s5BottomX = r5.left - streamRect.left + r5.width / 2;
      const s5BottomY = r5.top - streamRect.top + r5.height;
      const resTopY = rRes.top - streamRect.top;

      const startPt = { x: s5BottomX, y: s5BottomY + dotOffset };
      const endPt = { x: s5BottomX, y: resTopY - 9 - dotOffset };

      svg.appendChild(makePath(`M ${startPt.x} ${startPt.y} L ${endPt.x} ${endPt.y}`));
      svg.appendChild(makeDot(startPt, DOT_RADIUS));
      svg.appendChild(makeDot(endPt, DOT_RADIUS));
    }
  };

  const drawMobileConnections = (svg, steps, streamRect, result) => {
    const getStepByNum = (n) => {
      const wrapper = steps.find((s) => s.getAttribute('data-blueprint-step') === String(n));
      return getStepBox(wrapper);
    };

    const step1 = getStepByNum(1);
    const step2 = getStepByNum(2);
    const step3 = getStepByNum(3);
    const step4 = getStepByNum(4);
    const step5 = getStepByNum(5);

    const isKnightSlug =
      document.querySelector('#blueprint-inner-workflow-tray')?.getAttribute('data-resource-slug') ===
        'cinematic-medieval-knight-video-google-flow' ||
      document.querySelector('#blueprint-inner-workflow-tray')?.classList.contains('workflow-resource-knight') ||
      window.location.pathname.includes('cinematic-medieval-knight-video-google-flow');

    if (isKnightSlug) {
      drawKnightConnections(svg, steps, streamRect, result);
      return;
    }

    const DOT_RADIUS = 3.5;
    const GAP = 2.5;
    const dotOffset = DOT_RADIUS + GAP;
    if (step1 && step2) {
      const p1 = pointFor(step1, streamRect, 'bottom');
      const p2 = pointFor(step2, streamRect, 'top');
      if (p1 && p2) {
        svg.appendChild(makePath(`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`));
        svg.appendChild(makeDot(p1, DOT_RADIUS));
        svg.appendChild(makeDot(p2, DOT_RADIUS));
      }
    }

    if (step4) {
      const r4 = step4.getBoundingClientRect();
      const s4Top = r4.top - streamRect.top;
      const step4Left = r4.left - streamRect.left;
      const step4Width = r4.width;

      const d1 = { x: step4Left + step4Width * 0.22, y: s4Top - dotOffset };
      const d2 = { x: step4Left + step4Width * 0.50, y: s4Top - dotOffset };
      const d3 = { x: step4Left + step4Width * 0.78, y: s4Top - dotOffset };

      if (step1) {
        const p1 = pointFor(step1, streamRect, 'right');
        const p2Right = step2 ? pointFor(step2, streamRect, 'right') : null;
        const p3Left = step3 ? pointFor(step3, streamRect, 'left') : null;
        const midX = (p2Right && p3Left) ? (p2Right.x + p3Left.x) / 2 : (p1 ? p1.x + 14 : d1.x);
        if (p1) {
          const c1 = Math.max(16, (d1.y - p1.y) * 0.35);
          svg.appendChild(makePath(`M ${p1.x} ${p1.y} C ${midX} ${p1.y} ${midX} ${d1.y - c1} ${d1.x} ${d1.y}`));
          svg.appendChild(makeDot(p1, DOT_RADIUS));
          svg.appendChild(makeDot(d1, DOT_RADIUS));
        }
      }

      if (step2) {
        const p2 = pointFor(step2, streamRect, 'bottom');
        if (p2) {
          const c2 = Math.max(16, (d2.y - p2.y) * 0.45);
          svg.appendChild(makePath(`M ${p2.x} ${p2.y} C ${p2.x} ${p2.y + c2} ${d2.x} ${d2.y - c2} ${d2.x} ${d2.y}`));
          svg.appendChild(makeDot(p2, DOT_RADIUS));
          svg.appendChild(makeDot(d2, DOT_RADIUS));
        }
      }

      if (step3) {
        const p3 = pointFor(step3, streamRect, 'bottom');
        if (p3) {
          const c3 = Math.max(20, (d3.y - p3.y) * 0.45);
          svg.appendChild(makePath(`M ${p3.x} ${p3.y} C ${p3.x} ${p3.y + c3} ${d3.x} ${d3.y - c3} ${d3.x} ${d3.y}`));
          svg.appendChild(makeDot(p3, DOT_RADIUS));
          svg.appendChild(makeDot(d3, DOT_RADIUS));
        }
      }
    }

    if (step4 && step5) {
      const p4 = pointFor(step4, streamRect, 'bottom');
      const p5 = pointFor(step5, streamRect, 'top');
      if (p4 && p5) {
        svg.appendChild(makePath(`M ${p4.x} ${p4.y} L ${p5.x} ${p5.y}`));
        svg.appendChild(makeDot(p4, DOT_RADIUS));
        svg.appendChild(makeDot(p5, DOT_RADIUS));
      }
    }

    const lastStep = step5 || step4;
    if (lastStep && result) {
      const pLast = pointFor(lastStep, streamRect, 'bottom');
      const pRes = pointFor(result, streamRect, 'top');
      if (pLast && pRes) {
        svg.appendChild(makePath(`M ${pLast.x} ${pLast.y} L ${pRes.x} ${pRes.y}`));
        svg.appendChild(makeDot(pLast, DOT_RADIUS));
        svg.appendChild(makeDot(pRes, DOT_RADIUS));
      }
    }
  };

  const drawDesktopConnections = (svg, steps, streamRect, result) => {
    const boxes = steps.map(getStepBox);
    const step1 = boxes[0];
    const step2 = boxes[1];
    const step3 = boxes[2];
    const step4 = boxes[3];

    if (!step1 || !step2 || !step3 || !step4) return;

    /* Step 01 -> Step 02. */
    const p12a = pointFor(step1, streamRect, 'bottom');
    const p12b = pointFor(step2, streamRect, 'top');
    if (p12a && p12b) {
      const curve = Math.max(18, Math.min(50, (p12b.y - p12a.y) * .45));
      svg.appendChild(makePath(`M ${p12a.x} ${p12a.y} C ${p12a.x} ${p12a.y + curve} ${p12b.x} ${p12b.y - curve} ${p12b.x} ${p12b.y}`));
      svg.appendChild(makeDot(p12a));
      svg.appendChild(makeDot(p12b));
    }

    /* Three separate inputs into Step 04, matching the reference structure. */
    const s4 = pointFor(step4, streamRect, 'top');
    const r4 = step4.getBoundingClientRect();
    const step4Left = r4.left - streamRect.left;
    const step4Width = r4.width;
    const d1 = { x: step4Left + step4Width * .25, y: s4.y };
    const d2 = { x: step4Left + step4Width * .50, y: s4.y };
    const d3 = { x: step4Left + step4Width * .75, y: s4.y };

    const p1 = pointFor(step1, streamRect, 'right');
    const p2 = pointFor(step2, streamRect, 'bottom');
    const p3 = pointFor(step3, streamRect, 'bottom');

    if (p1) {
      const p2Right = pointFor(step2, streamRect, 'right');
      const p3Left = pointFor(step3, streamRect, 'left');
      const routeX = (p2Right.x + p3Left.x) / 2;
      svg.appendChild(makePath(`M ${p1.x} ${p1.y} L ${routeX} ${p1.y} L ${routeX} ${d1.y} L ${d1.x} ${d1.y}`));
      svg.appendChild(makeDot(p1));
      svg.appendChild(makeDot(d1));
    }

    if (p2) {
      const c = Math.max(26, (d2.y - p2.y) * .42);
      svg.appendChild(makePath(`M ${p2.x} ${p2.y} C ${p2.x} ${p2.y + c} ${d2.x} ${d2.y - c} ${d2.x} ${d2.y}`));
      svg.appendChild(makeDot(p2));
      svg.appendChild(makeDot(d2));
    }

    if (p3) {
      const c = Math.max(26, (d3.y - p3.y) * .42);
      svg.appendChild(makePath(`M ${p3.x} ${p3.y} C ${p3.x} ${p3.y + c} ${d3.x} ${d3.y - c} ${d3.x} ${d3.y}`));
      svg.appendChild(makeDot(p3));
      svg.appendChild(makeDot(d3));
    }

    /* Any real steps after Step 04 remain visible and continue as a clean chain. */
    for (let i = 3; i < boxes.length - 1; i += 1) {
      const from = pointFor(boxes[i], streamRect, 'bottom');
      const to = pointFor(boxes[i + 1], streamRect, 'top');
      if (!from || !to) continue;
      const curve = Math.max(18, Math.min(44, (to.y - from.y) * .42));
      svg.appendChild(makePath(`M ${from.x} ${from.y} C ${from.x} ${from.y + curve} ${to.x} ${to.y - curve} ${to.x} ${to.y}`));
      svg.appendChild(makeDot(from));
      svg.appendChild(makeDot(to));
    }

    const lastBox = boxes[boxes.length - 1];
    const last = pointFor(lastBox, streamRect, 'bottom');
    const resultTop = pointFor(result, streamRect, 'top');
    if (last && resultTop) {
      svg.appendChild(makePath(`M ${last.x} ${last.y} L ${resultTop.x} ${resultTop.y}`));
      svg.appendChild(makeDot(last));
      svg.appendChild(makeDot(resultTop));
    }
  };

  const positionResult = (steps, result) => {
    if (!result) return;
    result.style.gridRow = String(Math.max(4, steps.length + 1));
    result.style.gridColumn = '1 / span 2';
  };

  const drawBlueprintGraph = () => {
    const container = document.querySelector('#blueprint-inner-workflow-tray');
    const stream = container?.querySelector('.blueprint-workflow-stream');
    if (!container || !stream) return;

    const steps = Array.from(
      stream.querySelectorAll('.blueprint-step-wrapper[data-blueprint-step]')
    ).filter((el) => el.dataset.blueprintStep);

    const result = stream.querySelector('#workflow-final-result');
    if (!steps.length || !result) return;

    blueprintStyle();
    container.classList.add('sf-graph-blueprint');

    /* The reference image is a visual template only. Never remove real steps. */
    steps.forEach((step) => {
      step.style.display = '';
      step.removeAttribute('aria-hidden');
    });

    stream.querySelectorAll('.workflow-process-terminal, .blueprint-stream-connector').forEach((el) => {
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    });

    positionResult(steps, result);

    let svg = stream.querySelector('.sf-blueprint-graph-svg');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('sf-blueprint-graph-svg');
      stream.appendChild(svg);
    }

    const streamRect = stream.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${Math.max(1, streamRect.width)} ${Math.max(1, streamRect.height)}`);
    svg.setAttribute('width', String(streamRect.width));
    svg.setAttribute('height', String(streamRect.height));
    svg.replaceChildren();

    const isFullscreen = container.classList.contains('is-blueprint-fullscreen');
    // If scaled in fullscreen mode, do not recompute coordinates on scaled elements
    if (isFullscreen && stream.style.transform && stream.style.transform !== 'none' && !stream.style.transform.includes('scale(1)')) {
      return;
    }

    const isKnightSlug =
      document.querySelector('#blueprint-inner-workflow-tray')?.getAttribute('data-resource-slug') ===
        'cinematic-medieval-knight-video-google-flow' ||
      document.querySelector('#blueprint-inner-workflow-tray')?.classList.contains('workflow-resource-knight') ||
      window.location.pathname.includes('cinematic-medieval-knight-video-google-flow');

    if (isKnightSlug) {
      drawKnightConnections(svg, steps, streamRect, result);
    } else {
      const isMobile = !isFullscreen && window.matchMedia('(max-width: 700px)').matches;
      if (isMobile) {
        drawMobileConnections(svg, steps, streamRect, result);
      } else {
        drawDesktopConnections(svg, steps, streamRect, result);
      }
    }
  };

  const setupBlueprintGraph = () => {
    const container = document.querySelector('#blueprint-inner-workflow-tray');
    if (!container || container.dataset.sfGraphReady === 'true') return;
    if (!container.querySelector('.blueprint-step-wrapper[data-blueprint-step]')) return;

    container.dataset.sfGraphReady = 'true';
    blueprintStyle();

    const stream = container.querySelector('.blueprint-workflow-stream');
    let scrollPane = container.querySelector('.blueprint-workflow-scroll-pane');
    if (!scrollPane && stream && stream.parentNode === container) {
      scrollPane = document.createElement('div');
      scrollPane.className = 'blueprint-workflow-scroll-pane';
      scrollPane.id = 'blueprint-workflow-scroll-pane';
      container.insertBefore(scrollPane, stream);
      scrollPane.appendChild(stream);
    }

    // Keep controls wrapper in container before scrollPane
    const controls = container.querySelector('.blueprint-canvas-controls');
    if (controls && scrollPane && controls.nextElementSibling !== scrollPane) {
      container.insertBefore(controls, scrollPane);
    }

    // Center scroll position horizontally on initial load if stream is wider than viewport
    if (scrollPane) {
      requestAnimationFrame(() => {
        if (scrollPane.scrollWidth > scrollPane.clientWidth) {
          scrollPane.scrollLeft = (scrollPane.scrollWidth - scrollPane.clientWidth) / 2;
        }
      });
    }

    const redraw = () => requestAnimationFrame(() => drawBlueprintGraph());
    const runInitial = () => {
      drawBlueprintGraph();
      requestAnimationFrame(drawBlueprintGraph);
      setTimeout(drawBlueprintGraph, 180);
    };

    runInitial();
    window.addEventListener('resize', () => {
      if (!container.classList.contains('is-blueprint-fullscreen')) {
        redraw();
      }
    }, { passive: true });

    if (stream && 'ResizeObserver' in window) {
      const observer = new ResizeObserver(() => {
        if (!container.classList.contains('is-blueprint-fullscreen')) {
          redraw();
        }
      });
      observer.observe(stream);
      container._sfBlueprintObserver = observer;
    }

    container.querySelectorAll('[data-step-toggle]').forEach((button) => {
      button.addEventListener('click', redraw, { passive: true });
    });
    window.sfDrawBlueprintGraph = drawBlueprintGraph;
  };

  const init = () => {
    replaceFlowLogos();
    replaceExpandHandlers();
    setupBlueprintGraph();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
