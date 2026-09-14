(() => {
  const mountPublisherIdentity = () => {
    const intro = document.querySelector('.resource-intro');
    if (!intro || intro.querySelector('[data-sf-publisher]')) return;

    const lead = intro.querySelector('.lead');
    const meta = intro.querySelector('.resource-top-meta');
    if (!lead || !meta) return;

    const publisher = document.createElement('div');
    publisher.dataset.sfPublisher = 'true';
    publisher.className = 'sf-publisher-identity';
    publisher.setAttribute('aria-label', 'Skill Foundry verified publisher');
    publisher.innerHTML = `
      <div class="sf-publisher-name-row">
        <strong>Skill Foundry</strong>
        <span class="sf-publisher-mark" aria-hidden="true">
          <svg viewBox="0 0 40 40" focusable="false" role="img">
            <path class="sf-publisher-seal" d="M18.03 3.66 Q20 2 21.97 3.66 Q23.93 5.32 26.47 4.86 Q29 4.41 29.87 6.83 Q30.75 9.25 33.17 10.13 Q35.59 11 35.14 13.53 Q34.68 16.07 36.34 18.03 Q38 20 36.34 21.97 Q34.68 23.93 35.14 26.47 Q35.59 29 33.17 29.87 Q30.75 30.75 29.87 33.17 Q29 35.59 26.47 35.14 Q23.93 34.68 21.97 36.34 Q20 38 18.03 36.34 Q16.07 34.68 13.53 35.14 Q11 35.59 10.13 33.17 Q9.25 30.75 6.83 29.87 Q4.41 29 4.86 26.47 Q5.32 23.93 3.66 21.97 Q2 20 3.66 18.03 Q5.32 16.07 4.86 13.53 Q4.41 11 6.83 10.13 Q9.25 9.25 10.13 6.83 Q11 4.41 13.53 4.86 Q16.07 5.32 18.03 3.66 Z" />
            <path class="sf-publisher-check" d="M11.8 20.4 L17.1 25.7 L28.6 14.2" />
          </svg>
        </span>
      </div>
      <span class="sf-publisher-status">Verified publisher</span>
    `;

    intro.insertBefore(publisher, meta);

    if (!document.querySelector('#sf-publisher-identity-style')) {
      const style = document.createElement('style');
      style.id = 'sf-publisher-identity-style';
      style.textContent = `
        .sf-publisher-identity{display:grid;width:fit-content;margin:18px 0 2px;gap:4px;color:var(--text)}
        .sf-publisher-name-row{display:inline-flex;align-items:center;gap:7px;line-height:1.1}
        .sf-publisher-name-row strong{font-size:14px;font-weight:850;letter-spacing:.005em}
        .sf-publisher-mark{display:grid;place-items:center;width:21px;height:21px;flex:0 0 21px}
        .sf-publisher-mark svg{display:block;width:100%;height:100%;overflow:visible}
        .sf-publisher-seal{fill:#f6a23a}
        .sf-publisher-check{fill:none;stroke:#111820;stroke-width:3.8;stroke-linecap:round;stroke-linejoin:round}
        .sf-publisher-status{color:var(--muted);font-size:10px;font-weight:750;letter-spacing:.06em;text-transform:uppercase}
        @media(max-width:600px){.sf-publisher-identity{margin-top:16px}.sf-publisher-name-row strong{font-size:13px}.sf-publisher-mark{width:21px;height:21px;flex-basis:21px}.sf-publisher-status{font-size:9px}}
      `;
      document.head.appendChild(style);
    }
  };

  const downloadPromptAsPdf = (prompt) => {
    const source = String(prompt || '').replace(/\r\n?/g, '\n').trimEnd();
    if (!source) return;

    const PAGE_W = 595;
    const PAGE_H = 842;
    const MARGIN_X = 46;
    const TOP_Y = 796;
    const BOTTOM_Y = 46;
    const FONT_SIZE = 10;
    const LINE_HEIGHT = 14;
    const MAX_CHARS = 92;
    const pages = [];

    const wrapLine = (line) => {
      if (!line) return [''];
      const words = line.split(/\s+/);
      const result = [];
      let current = '';
      for (const word of words) {
        if (!current) {
          if (word.length <= MAX_CHARS) current = word;
          else {
            for (let i = 0; i < word.length; i += MAX_CHARS) result.push(word.slice(i, i + MAX_CHARS));
          }
          continue;
        }
        const next = `${current} ${word}`;
        if (next.length <= MAX_CHARS) current = next;
        else {
          result.push(current);
          current = word;
        }
      }
      if (current) result.push(current);
      return result.length ? result : [''];
    };

    const wrapped = source.split('\n').flatMap(wrapLine);
    const linesPerPage = Math.floor((TOP_Y - BOTTOM_Y) / LINE_HEIGHT);
    for (let i = 0; i < wrapped.length; i += linesPerPage) pages.push(wrapped.slice(i, i + linesPerPage));
    if (!pages.length) pages.push(['']);

    const escapePdf = (value) => String(value)
      .replace(/[^\x20-\x7E]/g, '?')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');

    const objects = [];
    const addObject = (body) => {
      objects.push(body);
      return objects.length;
    };

    const catalogId = addObject('');
    const pagesId = addObject('');
    const fontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    const pageIds = [];

    for (const pageLines of pages) {
      const commands = ['BT', `/F1 ${FONT_SIZE} Tf`, `${MARGIN_X} ${TOP_Y} Td`, `${LINE_HEIGHT} TL`];
      for (const line of pageLines) commands.push(`(${escapePdf(line)}) Tj`, 'T*');
      commands.push('ET');
      const stream = commands.join('\n');
      const contentId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
      const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
      pageIds.push(pageId);
    }

    objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
    objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;

    let pdf = '%PDF-1.4\n% Skill Foundry\n';
    const offsets = [0];
    objects.forEach((body, index) => {
      offsets[index + 1] = pdf.length;
      pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i += 1) pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${document.title.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'skill-foundry-prompt'}.pdf`;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const showStatus = (message) => {
    const status = document.querySelector('[data-status]');
    if (status) {
      status.textContent = message;
      setTimeout(() => { if (status.textContent === message) status.textContent = ''; }, 1800);
    }
  };

  const init = () => {
    mountPublisherIdentity();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-download]');
    if (!button) return;
    const prompt = document.querySelector('#prompt-text')?.textContent || '';
    event.preventDefault();
    event.stopImmediatePropagation();
    try {
      downloadPromptAsPdf(prompt);
      showStatus('PDF downloaded.');
    } catch {
      showStatus('PDF download failed. Please try again.');
    }
  }, true);
})();
