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
      <span class="sf-publisher-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false"><path d="M6.5 12.5 10 16l7.5-8" /></svg>
      </span>
      <span class="sf-publisher-copy">
        <strong>Skill Foundry</strong>
        <span>Verified publisher</span>
      </span>
    `;

    intro.insertBefore(publisher, meta);

    if (!document.querySelector('#sf-publisher-identity-style')) {
      const style = document.createElement('style');
      style.id = 'sf-publisher-identity-style';
      style.textContent = `
        .sf-publisher-identity{display:inline-flex;align-items:center;gap:9px;width:fit-content;margin:18px 0 2px;padding:7px 10px 7px 7px;border:1px solid rgba(61,214,208,.22);border-radius:999px;background:rgba(61,214,208,.055);color:var(--text)}
        .sf-publisher-mark{display:grid;place-items:center;width:25px;height:25px;border-radius:50%;background:rgba(61,214,208,.14);color:var(--accent)}
        .sf-publisher-mark svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
        .sf-publisher-copy{display:inline-flex;align-items:baseline;gap:7px;line-height:1.2}
        .sf-publisher-copy strong{font-size:12px;font-weight:850;letter-spacing:.01em}
        .sf-publisher-copy span{color:var(--muted);font-size:10px;font-weight:750;letter-spacing:.04em;text-transform:uppercase}
        @media(max-width:600px){.sf-publisher-identity{margin-top:16px}.sf-publisher-copy{gap:6px}.sf-publisher-copy strong{font-size:11px}.sf-publisher-copy span{font-size:9px}}
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
