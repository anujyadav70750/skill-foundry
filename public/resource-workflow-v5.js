import('/resource-workflow-v3.js').then(() => {
  const init = () => {
    const section = document.querySelector('.workflow-section.sf-v3');
    if (!section) return;

    if (!document.querySelector('#sf-workflow-v5-style')) {
      const style = document.createElement('style');
      style.id = 'sf-workflow-v5-style';
      style.textContent = `
        .workflow-section.sf-v3,.workflow-section.sf-v3 *{box-sizing:border-box}
        .workflow-section.sf-v3 .workflow-list{display:grid!important;gap:28px!important;width:100%!important;min-width:0!important}
        .workflow-section.sf-v3 .workflow-card{width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:20px 16px!important;border:1px solid rgba(148,163,184,.18)!important;border-radius:22px!important;background:linear-gradient(180deg,rgba(12,27,43,.96),rgba(7,20,34,.94))!important;overflow:visible!important}
        .workflow-section.sf-v3 .workflow-body{display:grid!important;gap:16px!important;width:100%!important;min-width:0!important;margin-top:18px!important;opacity:1!important;overflow:visible!important}
        .workflow-section.sf-v3 .workflow-chevron{display:none!important}
        .workflow-section.sf-v3 .workflow-connector{display:block!important;position:absolute!important;left:39px!important;bottom:-28px!important;width:1px!important;height:27px!important;background:rgba(61,214,208,.28)!important}
        .workflow-section.sf-v3 .workflow-connector:after{bottom:-8px!important}
        .workflow-section.sf-v3 .sf-tool-row{display:flex!important;align-items:center!important;gap:12px!important;width:100%!important;min-width:0!important}
        .workflow-section.sf-v3 .sf-tool-logo-link{display:grid!important;place-items:center!important;flex:0 0 46px!important;width:46px!important;height:46px!important;padding:4px!important;border:1px solid rgba(148,163,184,.28)!important;border-radius:14px!important;background:rgba(255,255,255,.04)!important;overflow:hidden!important;text-decoration:none!important}
        .workflow-section.sf-v3 .sf-tool-logo-link img{display:block!important;width:38px!important;height:38px!important;max-width:38px!important;max-height:38px!important;object-fit:contain!important;border-radius:9px!important}
        .workflow-section.sf-v3 .sf-tool-purpose{display:grid!important;gap:3px!important;min-width:0!important}
        .workflow-section.sf-v3 .sf-tool-purpose-label{color:var(--accent)!important;font-size:8px!important;line-height:1.1!important;font-weight:900!important;letter-spacing:.14em!important;text-transform:uppercase!important}
        .workflow-section.sf-v3 .sf-tool-purpose-text{color:var(--text)!important;font-size:11px!important;line-height:1.4!important;font-weight:700!important;overflow-wrap:anywhere!important}
        .workflow-section.sf-v3 .sf-rail{display:flex!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 8px!important;scrollbar-width:thin!important}
        .workflow-section.sf-v3 .sf-input-chip{position:relative!important;display:grid!important;grid-template-rows:auto 1fr!important;align-content:start!important;gap:8px!important;flex:0 0 210px!important;max-width:82vw!important;padding:0 12px 12px!important;border:1px solid var(--line)!important;border-radius:16px!important;background:rgba(16,34,56,.42)!important;color:var(--text)!important;font-size:12px!important;line-height:1.4!important;scroll-snap-align:start!important;overflow:hidden!important}
        .workflow-section.sf-v3 .sf-input-chip .sf-input-type{display:inline-flex!important;align-items:center!important;width:max-content!important;margin:0 -12px!important;padding:5px 10px!important;border-bottom-right-radius:10px!important;font-size:8px!important;font-weight:950!important;letter-spacing:.12em!important;text-transform:uppercase!important;color:#07111f!important}
        .workflow-section.sf-v3 .sf-input-chip .sf-input-type.image{background:#67e8f9!important}.workflow-section.sf-v3 .sf-input-chip .sf-input-type.video{background:#c4b5fd!important}.workflow-section.sf-v3 .sf-input-chip .sf-input-type.audio{background:#86efac!important}.workflow-section.sf-v3 .sf-input-chip .sf-input-type.text{background:#fde68a!important}.workflow-section.sf-v3 .sf-input-chip .sf-input-type.document{background:#fdba74!important}
        .workflow-section.sf-v3 .sf-input-chip .sf-input-role{display:block!important;color:var(--text)!important;font-size:12px!important;font-weight:800!important;overflow-wrap:anywhere!important}
        .workflow-section.sf-v3 .sf-input-chip .sf-input-value{display:block!important;color:var(--muted)!important;font-size:11px!important;line-height:1.45!important;overflow-wrap:anywhere!important}
        .workflow-section.sf-v3 .sf-image-chip{padding:0!important;grid-template-rows:auto auto 1fr!important}
        .workflow-section.sf-v3 .sf-image-chip img{display:block!important;width:100%!important;aspect-ratio:16/10!important;object-fit:cover!important}
        .workflow-section.sf-v3 .sf-image-chip .sf-input-type{margin:0!important}
        .workflow-section.sf-v3 .sf-image-chip .sf-input-role,.workflow-section.sf-v3 .sf-image-chip .sf-input-value{padding:0 12px!important}
        .workflow-section.sf-v3 .sf-image-chip .sf-input-value{padding-bottom:12px!important}
        .workflow-section.sf-v3 .sf-arrow{display:flex!important;align-items:center!important;gap:8px!important;color:var(--muted)!important;font-size:9px!important;font-weight:850!important;letter-spacing:.12em!important;text-transform:uppercase!important}
        .workflow-section.sf-v3 .sf-settings{display:flex!important;gap:7px!important;width:100%!important;min-width:0!important;overflow-x:auto!important;padding-bottom:2px!important}
        .workflow-section.sf-v3 .sf-setting{flex:0 0 auto!important;padding:8px 10px!important;border:1px solid var(--line)!important;border-radius:11px!important;background:rgba(16,34,56,.32)!important}
        .workflow-section.sf-v3 .sf-setting-label{display:block!important;color:var(--muted)!important;font-size:8px!important;font-weight:850!important;letter-spacing:.1em!important;text-transform:uppercase!important}
        .workflow-section.sf-v3 .sf-setting-value{display:block!important;margin-top:2px!important;color:var(--text)!important;font-size:11px!important;font-weight:800!important}
        .workflow-section.sf-v3 .sf-action{width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important;border:1px solid var(--line)!important;border-radius:15px!important;background:var(--surface)!important}
        .workflow-section.sf-v3 .sf-action-head{display:grid!important;grid-template-columns:56px minmax(0,1fr) 66px!important;width:100%!important;min-width:0!important}
        .workflow-section.sf-v3 .sf-action button{min-width:0!important;white-space:nowrap!important;padding:0 7px!important;overflow:hidden!important}
        .workflow-section.sf-v3 .sf-action-title{min-width:0!important;overflow:hidden!important;white-space:nowrap!important;text-overflow:ellipsis!important}
        .workflow-section.sf-v3 .sf-action pre{display:block!important;width:100%!important;max-width:100%!important;height:132px!important;min-height:132px!important;max-height:132px!important;margin:0!important;padding:13px 14px!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important;word-break:break-word!important}
        .workflow-section.sf-v3 .sf-download{display:block!important;width:100%!important;min-height:40px!important}
        .workflow-section.sf-v3 .sf-output{width:100%!important;max-width:100%!important;overflow-wrap:anywhere!important;word-break:break-word!important}
        .workflow-section.sf-v3 .workflow-card:last-child .sf-arrow:last-child{display:none!important}
        .workflow-section.sf-v3 .sf-tool-logo-link.is-fallback{font-size:9px!important;font-weight:900!important;color:var(--muted)!important;text-transform:uppercase!important}
        @media(max-width:420px){
          .workflow-section.sf-v3 .workflow-card{padding:18px 14px!important;border-radius:20px!important}
          .workflow-section.sf-v3 .workflow-list{gap:26px!important}
          .workflow-section.sf-v3 .workflow-body{gap:15px!important}
          .workflow-section.sf-v3 .sf-action-head{grid-template-columns:54px minmax(0,1fr) 64px!important}
          .workflow-section.sf-v3 .sf-action button{font-size:10px!important;padding-left:5px!important;padding-right:5px!important}
          .workflow-section.sf-v3 .sf-input-chip{flex-basis:190px!important}
        }
      `;
      document.head.appendChild(style);
    }

    const toolInfo = name => {
      const wanted = String(name || '').trim().toLowerCase();
      const nodes = [...document.querySelectorAll('.tools-list .tool-card,.tools-list .tool-logo-link')];
      const node = nodes.find(n => {
        const n1 = n.dataset.toolName || n.querySelector('h3')?.textContent?.trim() || n.getAttribute('aria-label')?.replace(/^Open\s+/i, '');
        return n1 && n1.toLowerCase() === wanted;
      });
      return node ? { href: node.href || node.querySelector('.tool-link')?.href || '', purpose: node.dataset.toolPurpose || node.querySelector('p')?.textContent?.trim() || '', logo: node.querySelector('img')?.currentSrc || node.querySelector('img')?.src || '' } : { href: '', purpose: '', logo: '' };
    };

    const validImage = src => new Promise(resolve => {
      if (!src) return resolve(false);
      const im = new Image();
      im.onload = () => resolve(im.naturalWidth > 0 && im.naturalHeight > 0);
      im.onerror = () => resolve(false);
      im.src = src;
    });

    const logoFor = async href => {
      if (!href) return '';
      try {
        const r = await fetch('/api/tool-logo?url=' + encodeURIComponent(href), { credentials: 'same-origin', cache: 'no-store' });
        if (r.ok) {
          const d = await r.json();
          if (d?.logoUrl && await validImage(d.logoUrl)) return d.logoUrl;
        }
      } catch {}
      try {
        const u = new URL(href, location.href);
        const candidates = [u.origin + '/favicon.svg', u.origin + '/favicon.png', u.origin + '/apple-touch-icon.png', 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(u.hostname) + '&sz=128'];
        for (const src of candidates) if (await validImage(src)) return src;
      } catch {}
      return '';
    };

    const inputType = value => {
      const x = String(value || '').toLowerCase();
      if (/\b(document|pdf|docx|file)\b/.test(x)) return 'document';
      if (/\b(video|clip|footage|mp4|mov)\b/.test(x)) return 'video';
      if (/\b(audio|voice|sound|music|wav|mp3)\b/.test(x)) return 'audio';
      if (/\b(image|photo|picture|visual|png|jpg|jpeg|reference image)\b/.test(x)) return 'image';
      return 'text';
    };

    const parseStructured = card => {
      const marker = card.dataset.workflowData;
      if (!marker) return null;
      try { return JSON.parse(marker); } catch { return null; }
    };

    const buildInput = (input, fallbackValue = '') => {
      const type = input?.type || inputType(input?.value || fallbackValue);
      const label = input?.label || input?.role || (type === 'image' ? 'Image reference' : type === 'video' ? 'Video input' : type === 'audio' ? 'Audio input' : type === 'document' ? 'Document input' : 'Text input');
      const value = input?.value || fallbackValue;
      const src = input?.src || ((type === 'image' || type === 'video') && /^\//.test(value) ? value : '');
      return { type, label, value, src };
    };

    const makeChip = data => {
      const figure = document.createElement(data.src ? 'figure' : 'div');
      figure.className = 'sf-input-chip' + (data.src ? ' sf-image-chip' : '');
      const type = document.createElement('span');
      type.className = 'sf-input-type ' + data.type;
      type.textContent = data.type.toUpperCase();
      figure.append(type);
      if (data.src) {
        const img = document.createElement('img');
        img.src = data.src;
        img.alt = data.label;
        img.loading = 'lazy';
        img.onerror = () => figure.classList.remove('sf-image-chip');
        figure.append(img);
      }
      const role = document.createElement(data.src ? 'figcaption' : 'strong');
      role.className = 'sf-input-role';
      role.textContent = data.label;
      figure.append(role);
      if (data.value && (!data.src || data.value !== data.src)) {
        const value = document.createElement('span');
        value.className = 'sf-input-value';
        value.textContent = data.value;
        figure.append(value);
      }
      return figure;
    };

    const fixTools = async () => {
      [...section.querySelectorAll('.sf-tool-badge')].forEach(async badge => {
        if (badge.dataset.sfV5 === '1') return;
        const name = badge.textContent?.trim();
        if (!name) return;
        badge.dataset.sfV5 = '1';
        const info = toolInfo(name);
        const row = document.createElement('div');
        row.className = 'sf-tool-row';
        const a = document.createElement('a');
        a.className = 'sf-tool-logo-link';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.title = 'Open ' + name;
        a.setAttribute('aria-label', 'Open ' + name);
        if (info.href) a.href = info.href;
        const img = document.createElement('img');
        img.alt = '';
        img.width = 38;
        img.height = 38;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.referrerPolicy = 'no-referrer';
        const fallback = () => {
          if (img.isConnected) img.remove();
          a.classList.add('is-fallback');
          a.textContent = name.slice(0, 1).toUpperCase();
        };
        img.onerror = fallback;
        const src = await logoFor(info.href) || info.logo;
        if (src) { img.src = src; a.appendChild(img); } else fallback();
        const purpose = document.createElement('div');
        purpose.className = 'sf-tool-purpose';
        const label = document.createElement('span');
        label.className = 'sf-tool-purpose-label';
        label.textContent = 'TOOL USED FOR';
        const text = document.createElement('strong');
        text.className = 'sf-tool-purpose-text';
        text.textContent = info.purpose || 'Used at this step to create the output.';
        purpose.append(label, text);
        row.append(a, purpose);
        badge.replaceWith(row);
      });
    };

    const cards = [...section.querySelectorAll('.workflow-card')];
    cards.forEach((card, i) => {
      const body = card.querySelector('.workflow-body');
      if (!body) return;
      const tool = [...body.querySelectorAll('.workflow-node')].find(x => x.querySelector('span')?.textContent?.trim().toUpperCase() === 'TOOL')?.querySelector('strong')?.textContent?.trim() || '';
      const input = [...body.querySelectorAll('.workflow-node')].find(x => x.querySelector('span')?.textContent?.trim().toUpperCase() === 'INPUT')?.querySelector('p')?.textContent?.trim() || '';
      const process = [...body.querySelectorAll('.workflow-node')].find(x => x.querySelector('span')?.textContent?.trim().toUpperCase() === 'PROCESS / PROMPT')?.querySelector('p')?.textContent?.trim() || '';
      const output = [...body.querySelectorAll('.workflow-node')].find(x => x.querySelector('span')?.textContent?.trim().toUpperCase() === 'OUTPUT')?.querySelector('p')?.textContent?.trim() || '';
      const structured = parseStructured(card);
      const titleText = card.querySelector('.workflow-step h3')?.textContent?.trim() || `Step ${i + 1}`;
      body.innerHTML = '';

      if (tool) {
        const badge = document.createElement('div');
        badge.className = 'sf-tool-badge';
        badge.textContent = tool;
        body.append(badge);
      }

      const inputs = structured?.inputs?.length ? structured.inputs : String(input || '').split(/\r?\n/).map(x => x.trim()).filter(Boolean).slice(0, 10).map(value => buildInput(null, value));
      const stage = document.createElement('div');
      stage.className = 'sf-stage';
      const lab = document.createElement('span');
      lab.className = 'sf-label';
      lab.textContent = 'START WITH';
      stage.append(lab);
      const rail = document.createElement('div');
      rail.className = 'sf-rail';

      if (i === 0 && !structured?.inputs?.length) {
        const inputImgs = [...document.querySelectorAll('.results-gallery .input-result img')];
        inputImgs.forEach((im, n) => rail.append(makeChip(buildInput({ type: 'image', label: inputImgs.length > 1 ? `Starting image ${n + 1}` : 'Starting image', value: im.currentSrc || im.src, src: im.currentSrc || im.src }))));
      }
      inputs.forEach(raw => rail.append(makeChip(buildInput(raw))));
      stage.append(rail);
      body.append(stage);

      const settings = structured?.settings || [];
      if (settings.length) {
        const row = document.createElement('div');
        row.className = 'sf-settings';
        settings.forEach(setting => {
          const item = document.createElement('div');
          item.className = 'sf-setting';
          const l = document.createElement('span');
          l.className = 'sf-setting-label';
          l.textContent = setting.label;
          const v = document.createElement('strong');
          v.className = 'sf-setting-value';
          v.textContent = setting.value;
          item.append(l, v);
          row.append(item);
        });
        body.append(row);
      }

      if (process) {
        const arrow = document.createElement('div');
        arrow.className = 'sf-arrow';
        arrow.textContent = 'DO THIS';
        body.append(arrow);
        const box = document.createElement('div');
        box.className = 'sf-action';
        const head = document.createElement('div');
        head.className = 'sf-action-head';
        const cp = document.createElement('button');
        cp.type = 'button';
        cp.textContent = 'Copy';
        const headLabel = document.createElement('div');
        headLabel.className = 'sf-action-title';
        headLabel.textContent = 'STEP ACTION';
        const ex = document.createElement('button');
        ex.type = 'button';
        ex.textContent = 'Expand';
        head.append(cp, headLabel, ex);
        const pre = document.createElement('pre');
        pre.textContent = process;
        const dl = document.createElement('button');
        dl.type = 'button';
        dl.className = 'sf-download';
        dl.textContent = 'Download PDF';
        box.append(head, pre, dl);
        body.append(box);
        cp.onclick = () => navigator.clipboard?.writeText(process);
        ex.onclick = () => {
          const dialog = document.querySelector('[data-dialog]');
          const dialogTitle = dialog?.querySelector('#prompt-dialog-title');
          const dialogText = dialog?.querySelector('pre');
          if (dialog && dialogTitle && dialogText) { dialogTitle.textContent = titleText + ' — Step Action'; dialogText.textContent = process; dialog.showModal(); }
        };
        dl.onclick = () => {
          const blob = new Blob([process], { type: 'text/plain;charset=utf-8' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = (titleText.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'step') + '.txt';
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 500);
        };
      }

      if (output) {
        const arrow = document.createElement('div');
        arrow.className = 'sf-arrow';
        arrow.textContent = 'YOU GET';
        body.append(arrow);
        const out = document.createElement('div');
        out.className = 'sf-output';
        out.textContent = output;
        body.append(out);
      }
    });

    section.classList.add('sf-v3');
    fixTools();
    setTimeout(fixTools, 300);
    setTimeout(fixTools, 900);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}).catch(() => {});
