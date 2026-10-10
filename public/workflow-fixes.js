(() => {
  const FLOW_ICON = '/logos/google-flow.png';
  const CAPCUT_ICON = '/capcut-icon.svg';
  const CHATGPT_ICON = '/logos/chatgpt.png';

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
    document.querySelectorAll('a[href*="flow.google"] img, a[href*="labs.google"] img, img[alt*="Flow" i], img[alt*="Google Flow" i]').forEach((img) => {
      if (img.getAttribute('src') !== FLOW_ICON) img.setAttribute('src', FLOW_ICON);
    });
    document.querySelectorAll('a[href*="capcut.com"] img, img[alt*="CapCut" i]').forEach((img) => {
      if (img.getAttribute('src') !== CAPCUT_ICON) img.setAttribute('src', CAPCUT_ICON);
    });
    document.querySelectorAll('a[href*="chatgpt.com"] img, a[href*="openai.com"] img, img[alt*="ChatGPT" i], img[alt*="Chat GPT" i], img[alt*="OpenAI" i]').forEach((img) => {
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
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint {
        background: #05070B !important;
        border: 1px solid rgba(255,255,255,.08) !important;
        border-radius: 22px !important;
        box-shadow: 0 20px 60px rgba(0,0,0,.55) !important;
        overflow-x: auto !important;
        overflow-y: visible !important;
      }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-workflow-stream {
        position: relative !important;
        display: grid !important;
        grid-template-columns: minmax(280px,1fr) minmax(280px,1fr) !important;
        grid-auto-rows: auto !important;
        column-gap: clamp(28px,5vw,72px) !important;
        row-gap: 0 !important;
        min-width: 620px !important;
        width: 100% !important;
        padding: 28px 18px 18px !important;
        box-sizing: border-box !important;
      }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper {
        width: 100% !important;
        min-width: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        position: relative !important;
        z-index: 2 !important;
      }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="1"] { grid-column: 1 !important; grid-row: 1 !important; }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="2"] { grid-column: 1 !important; grid-row: 2 !important; }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="3"] { grid-column: 2 !important; grid-row: 2 !important; }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="4"] {
        grid-column: 1 / span 2 !important;
        grid-row: 3 !important;
        width: min(760px,100%) !important;
        justify-self: center !important;
      }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step="5"] {
        display: none !important;
      }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-stream-connector,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .workflow-process-terminal {
        display: none !important;
      }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result {
        grid-column: 1 / span 2 !important;
        grid-row: 4 !important;
        width: min(760px,100%) !important;
        justify-self: center !important;
        margin: 24px 0 0 !important;
        position: relative !important;
        z-index: 2 !important;
        background: linear-gradient(180deg, rgba(15,24,42,.85) 0%, rgba(10,16,28,.95) 100%) !important;
        border: 1px solid rgba(255,255,255,.09) !important;
        border-radius: 24px !important;
        box-shadow: 0 20px 48px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08) !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-inner {
        background: transparent !important;
      }
      .sf-blueprint-graph-svg {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: visible !important;
        pointer-events: none !important;
        z-index: 3 !important;
      }
      .sf-blueprint-graph-svg path {
        fill: none !important;
        stroke: #38BDF8 !important;
        stroke-width: 2.2 !important;
        stroke-linecap: round !important;
        stroke-linejoin: round !important;
        opacity: .9 !important;
        vector-effect: non-scaling-stroke !important;
      }
      .sf-blueprint-graph-svg circle {
        fill: #38BDF8 !important;
        stroke: #05070B !important;
        stroke-width: 2 !important;
        vector-effect: non-scaling-stroke !important;
      }
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-container,
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result {
        position: relative !important;
        z-index: 4 !important;
      }
      @media (max-width: 700px) {
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-workflow-stream {
          min-width: 620px !important;
          padding-left: 12px !important;
          padding-right: 12px !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const pointFor = (element, streamRect, side) => {
    const r = element.getBoundingClientRect();
    const x = r.left - streamRect.left;
    const y = r.top - streamRect.top;
    if (side === 'top') return { x: x + r.width / 2, y };
    if (side === 'bottom') return { x: x + r.width / 2, y: y + r.height };
    if (side === 'right') return { x: x + r.width, y: y + r.height / 2 };
    return { x, y: y + r.height / 2 };
  };

  const makePath = (d) => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    return p;
  };

  const makeDot = (point, radius = 5) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', String(point.x));
    c.setAttribute('cy', String(point.y));
    c.setAttribute('r', String(radius));
    return c;
  };

  const drawBlueprintGraph = () => {
    const container = document.querySelector('#blueprint-inner-workflow-tray');
    const stream = container?.querySelector('.blueprint-workflow-stream');
    if (!container || !stream) return;

    const steps = Array.from(stream.querySelectorAll('.blueprint-step-wrapper[data-blueprint-step]'));
    if (steps.length < 4) return;

    blueprintStyle();
    container.classList.add('sf-graph-blueprint');

    const step1 = steps.find((el) => el.dataset.blueprintStep === '1');
    const step2 = steps.find((el) => el.dataset.blueprintStep === '2');
    const step3 = steps.find((el) => el.dataset.blueprintStep === '3');
    const step4 = steps.find((el) => el.dataset.blueprintStep === '4');
    const result = stream.querySelector('#workflow-final-result');
    if (!step1 || !step2 || !step3 || !step4 || !result) return;

    stream.querySelectorAll('.workflow-process-terminal, .blueprint-stream-connector').forEach((el) => el.setAttribute('aria-hidden', 'true'));

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

    const a1 = pointFor(step1.querySelector('.blueprint-step-container'), streamRect, 'right');
    const b1 = pointFor(step2.querySelector('.blueprint-step-container'), streamRect, 'top');
    const a2 = pointFor(step1.querySelector('.blueprint-step-container'), streamRect, 'right');
    const a3 = pointFor(step2.querySelector('.blueprint-step-container'), streamRect, 'bottom');
    const a4 = pointFor(step3.querySelector('.blueprint-step-container'), streamRect, 'bottom');
    const step4Box = step4.querySelector('.blueprint-step-container');
    const step4Rect = step4Box.getBoundingClientRect();
    const step4Left = step4Rect.left - streamRect.left;
    const step4Top = step4Rect.top - streamRect.top;
    const step4Width = step4Rect.width;
    const incomingY = step4Top - 2;
    const d1 = { x: step4Left + step4Width * 0.25, y: incomingY };
    const d2 = { x: step4Left + step4Width * 0.50, y: incomingY };
    const d3 = { x: step4Left + step4Width * 0.75, y: incomingY };

    const gapLeft = pointFor(step2.querySelector('.blueprint-step-container'), streamRect, 'right').x;
    const gapRight = pointFor(step3.querySelector('.blueprint-step-container'), streamRect, 'left').x;
    const routingX = (gapLeft + gapRight) / 2;

    // Step 01 -> Step 02: one clean vertical dot-and-line connection.
    const p12Start = pointFor(step1.querySelector('.blueprint-step-container'), streamRect, 'bottom');
    const p12End = b1;
    const mid12 = (p12Start.y + p12End.y) / 2;
    svg.appendChild(makePath(`M ${p12Start.x} ${p12Start.y} C ${p12Start.x} ${mid12} ${p12End.x} ${mid12} ${p12End.x} ${p12End.y}`));
    svg.appendChild(makeDot(p12Start));
    svg.appendChild(makeDot(p12End));

    // Step 01 -> Step 04: exactly one route, entering the first Step 04 dot.
    svg.appendChild(makePath(`M ${a2.x} ${a2.y} L ${routingX} ${a2.y} L ${routingX} ${d1.y} L ${d1.x} ${d1.y}`));
    svg.appendChild(makeDot(a2));
    svg.appendChild(makeDot(d1));

    // Step 02 -> Step 04: exactly ONE connection.
    const c2 = Math.max(28, (d2.y - a3.y) * 0.45);
    svg.appendChild(makePath(`M ${a3.x} ${a3.y} C ${a3.x} ${a3.y + c2} ${d2.x} ${d2.y - c2} ${d2.x} ${d2.y}`));
    svg.appendChild(makeDot(a3));
    svg.appendChild(makeDot(d2));

    // Step 03 -> Step 04: exactly ONE connection.
    const c3 = Math.max(28, (d3.y - a4.y) * 0.45);
    svg.appendChild(makePath(`M ${a4.x} ${a4.y} C ${a4.x} ${a4.y + c3} ${d3.x} ${d3.y - c3} ${d3.x} ${d3.y}`));
    svg.appendChild(makeDot(a4));
    svg.appendChild(makeDot(d3));

    // Step 04 -> Result: one straight dot-and-line connection.
    const p4Start = pointFor(step4Box, streamRect, 'bottom');
    const resultBox = result;
    const pResult = pointFor(resultBox, streamRect, 'top');
    svg.appendChild(makePath(`M ${p4Start.x} ${p4Start.y} L ${pResult.x} ${pResult.y}`));
    svg.appendChild(makeDot(p4Start));
    svg.appendChild(makeDot(pResult));
  };

  const setupBlueprintGraph = () => {
    const container = document.querySelector('#blueprint-inner-workflow-tray');
    if (!container || container.dataset.sfGraphReady === 'true') return;
    if (!container.querySelectorAll('.blueprint-step-wrapper[data-blueprint-step]').length) return;

    container.dataset.sfGraphReady = 'true';
    blueprintStyle();
    drawBlueprintGraph();

    const redraw = () => requestAnimationFrame(drawBlueprintGraph);
    window.addEventListener('resize', redraw, { passive: true });

    const stream = container.querySelector('.blueprint-workflow-stream');
    if (stream && 'ResizeObserver' in window) {
      const observer = new ResizeObserver(redraw);
      observer.observe(stream);
      container._sfBlueprintObserver = observer;
    }

    container.querySelectorAll('[data-step-toggle]').forEach((button) => {
      button.addEventListener('click', redraw, { passive: true });
    });
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