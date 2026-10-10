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
      /* Blueprint shell: the entire graph belongs inside this one black box. */
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint {
        position: relative !important;
        background: #000000 !important;
        border: 1px solid rgba(255,255,255,.10) !important;
        border-radius: 24px !important;
        box-shadow: 0 20px 60px rgba(0,0,0,.55) !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        width: 100% !important;
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

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-capsule {
        position: absolute !important;
        top: -22px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 9 !important;
        white-space: nowrap !important;
        background: #0A1020 !important;
        border: 1px solid rgba(94,164,255,.30) !important;
        border-radius: 999px !important;
        box-shadow: 0 8px 20px rgba(0,0,0,.35) !important;
        padding: 8px 18px !important;
        min-width: 92px !important;
        text-align: center !important;
        box-sizing: border-box !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-capsule span {
        color: #CBD5E1 !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        letter-spacing: .16em !important;
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
        z-index: 4 !important;
      }

      .sf-blueprint-graph-svg path {
        fill: none !important;
        stroke: #27B7FF !important;
        stroke-width: 2.4 !important;
        stroke-linecap: round !important;
        stroke-linejoin: round !important;
        opacity: .95 !important;
        vector-effect: non-scaling-stroke !important;
      }

      .sf-blueprint-graph-svg circle {
        fill: #27B7FF !important;
        stroke: #000000 !important;
        stroke-width: 2 !important;
        vector-effect: non-scaling-stroke !important;
      }

      /* Result is kept as the real existing embed, not a replacement preview. */
      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result {
        grid-column: 1 / span 2 !important;
        width: min(760px, 100%) !important;
        justify-self: center !important;
        position: relative !important;
        z-index: 6 !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        background: #0A1220 !important;
        border: 1px solid rgba(94,164,255,.20) !important;
        border-radius: 20px !important;
        box-shadow: 0 20px 48px rgba(0,0,0,.5) !important;
      }

      .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-inner {
        background: transparent !important;
      }

      @media (max-width: 700px) {
        /* No horizontal scrolling on mobile: every card stays inside the same black blueprint box. */
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint {
          overflow: hidden !important;
          border-radius: 20px !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-workflow-stream {
          display: flex !important;
          flex-direction: column !important;
          align-items: stretch !important;
          gap: 30px !important;
          width: 100% !important;
          min-width: 0 !important;
          padding: 42px 14px 34px !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper,
        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-wrapper[data-blueprint-step] {
          display: flex !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: none !important;
          flex: 0 0 auto !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint .blueprint-step-container {
          width: 100% !important;
          min-width: 0 !important;
          max-width: none !important;
          border-radius: 18px !important;
        }

        .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result {
          width: 100% !important;
          min-width: 0 !important;
          max-width: none !important;
          margin: 0 !important;
          border-radius: 18px !important;
        }
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

  const makeDot = (point, radius = 5) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', String(point.x));
    c.setAttribute('cy', String(point.y));
    c.setAttribute('r', String(radius));
    return c;
  };

  const getStepBox = (wrapper) => wrapper?.querySelector('.blueprint-step-container');

  const drawMobileConnections = (svg, boxes, streamRect, result) => {
    const visibleBoxes = boxes.filter(Boolean);
    for (let i = 0; i < visibleBoxes.length - 1; i += 1) {
      const from = pointFor(getStepBox(visibleBoxes[i]), streamRect, 'bottom');
      const to = pointFor(getStepBox(visibleBoxes[i + 1]), streamRect, 'top');
      if (!from || !to) continue;
      const curve = Math.max(16, Math.min(40, (to.y - from.y) * 0.45));
      svg.appendChild(makePath(
        `M ${from.x} ${from.y} C ${from.x} ${from.y + curve} ${to.x} ${to.y - curve} ${to.x} ${to.y}`
      ));
      svg.appendChild(makeDot(from));
      svg.appendChild(makeDot(to));
    }

    const last = visibleBoxes[visibleBoxes.length - 1];
    const lastBox = getStepBox(last);
    const resultPoint = pointFor(result, streamRect, 'top');
    const lastPoint = pointFor(lastBox, streamRect, 'bottom');
    if (lastPoint && resultPoint) {
      svg.appendChild(makePath(`M ${lastPoint.x} ${lastPoint.y} L ${resultPoint.x} ${resultPoint.y}`));
      svg.appendChild(makeDot(lastPoint));
      svg.appendChild(makeDot(resultPoint));
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

    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    if (isMobile) {
      drawMobileConnections(svg, steps, streamRect, result);
    } else {
      drawDesktopConnections(svg, steps, streamRect, result);
    }
  };

  const setupBlueprintGraph = () => {
    const container = document.querySelector('#blueprint-inner-workflow-tray');
    if (!container || container.dataset.sfGraphReady === 'true') return;
    if (!container.querySelector('.blueprint-step-wrapper[data-blueprint-step]')) return;

    container.dataset.sfGraphReady = 'true';
    blueprintStyle();

    const redraw = () => requestAnimationFrame(() => drawBlueprintGraph());
    const runInitial = () => {
      drawBlueprintGraph();
      requestAnimationFrame(drawBlueprintGraph);
      setTimeout(drawBlueprintGraph, 180);
    };

    runInitial();
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
