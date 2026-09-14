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
          <svg viewBox="0 0 36 36" focusable="false" role="img">
            <path class="sf-publisher-seal" d="M17.9 1.9 L20.2 3.6 L23.1 2.9 L24.8 5.4 L27.8 5.2 L28.6 8.1 L31.4 9.2 L31.1 12.2 L33.5 14.1 L32.1 16.8 L33.5 19.5 L31.1 21.4 L31.4 24.4 L28.6 25.5 L27.8 28.4 L24.8 28.2 L23.1 30.7 L20.2 30 L17.9 31.7 L15.6 30 L12.7 30.7 L11 28.2 L8 28.4 L7.2 25.5 L4.4 24.4 L4.7 21.4 L2.3 19.5 L3.7 16.8 L2.3 14.1 L4.7 12.2 L4.4 9.2 L7.2 8.1 L8 5.2 L11 5.4 L12.7 2.9 L15.6 3.6 Z" />
            <path class="sf-publisher-check" d="M10.1 17.3 L15.1 22.1 L25.8 11.8" />
          </svg>
        </span>
      </div>
    `;

    intro.insertBefore(publisher, meta);

    if (!document.querySelector('#sf-publisher-identity-style')) {
      const style = document.createElement('style');
      style.id = 'sf-publisher-identity-style';
      style.textContent = `
        .sf-publisher-identity{display:grid;width:fit-content;margin:18px 0 2px;gap:4px;color:var(--text)}
        .sf-publisher-name-row{display:inline-flex;align-items:center;gap:6px;line-height:1.1}
        .sf-publisher-name-row strong{font-size:14px;font-weight:850;letter-spacing:.005em}
        .sf-publisher-mark{display:grid;place-items:center;width:18px;height:18px;flex:0 0 18px}
        .sf-publisher-mark svg{display:block;width:100%;height:100%;overflow:visible}
        .sf-publisher-seal{fill:#C86A08}
        .sf-publisher-check{fill:none;stroke:#FFF8EA;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round}
        @media(max-width:600px){.sf-publisher-identity{margin-top:16px}.sf-publisher-name-row strong{font-size:13px}.sf-publisher-mark{width:18px;height:18px;flex-basis:18px}}
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
