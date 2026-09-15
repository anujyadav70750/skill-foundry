import('/resource-workflow-v3.js').then(() => {
  const init = () => {
    const section = document.querySelector('.workflow-section.sf-v3');
    if (!section) return;

    if (!document.querySelector('#sf-workflow-v4-style')) {
      const style = document.createElement('style');
      style.id = 'sf-workflow-v4-style';
      style.textContent = `
        .workflow-section.sf-v3,
        .workflow-section.sf-v3 * { box-sizing: border-box; }
        .workflow-section.sf-v3 .workflow-list {
          display: grid !important;
          gap: 30px !important;
          width: 100% !important;
          min-width: 0 !important;
        }
        .workflow-section.sf-v3 .workflow-card {
          position: relative !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 22px 16px !important;
          border: 1px solid rgba(61,214,208,.16) !important;
          border-radius: 22px !important;
          background: linear-gradient(180deg, rgba(12,27,43,.92), rgba(7,20,34,.88)) !important;
          overflow: visible !important;
        }
        .workflow-section.sf-v3 .workflow-connector {
          display: block !important;
          position: absolute !important;
          left: 39px !important;
          bottom: -30px !important;
          width: 1px !important;
          height: 29px !important;
          background: rgba(61,214,208,.28) !important;
        }
        .workflow-section.sf-v3 .workflow-connector:after {
          bottom: -8px !important;
        }
        .workflow-section.sf-v3 .workflow-body {
          display: grid !important;
          grid-template-rows: auto !important;
          gap: 18px !important;
          margin-top: 18px !important;
          min-width: 0 !important;
          width: 100% !important;
          opacity: 1 !important;
          overflow: visible !important;
        }
        .workflow-section.sf-v3 .workflow-step { cursor: default !important; }
        .workflow-section.sf-v3 .workflow-chevron { display: none !important; }

        .workflow-section.sf-v3 .sf-tool-row {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          width: 100% !important;
          min-width: 0 !important;
          margin-bottom: 2px !important;
        }
        .workflow-section.sf-v3 .sf-tool-logo-link {
          display: grid !important;
          place-items: center !important;
          flex: 0 0 48px !important;
          width: 48px !important;
          height: 48px !important;
          padding: 4px !important;
          border: 1px solid rgba(148,163,184,.28) !important;
          border-radius: 14px !important;
          background: rgba(255,255,255,.04) !important;
          text-decoration: none !important;
          overflow: hidden !important;
          transition: transform .18s ease, border-color .18s ease, background .18s ease !important;
        }
        .workflow-section.sf-v3 .sf-tool-logo-link:hover,
        .workflow-section.sf-v3 .sf-tool-logo-link:focus-visible {
          transform: translateY(-1px) scale(1.03) !important;
          border-color: rgba(61,214,208,.55) !important;
          background: rgba(61,214,208,.08) !important;
          outline: none !important;
        }
        .workflow-section.sf-v3 .sf-tool-logo-link img {
          display: block !important;
          width: 40px !important;
          height: 40px !important;
          max-width: 40px !important;
          max-height: 40px !important;
          object-fit: contain !important;
          border-radius: 9px !important;
        }
        .workflow-section.sf-v3 .sf-tool-purpose {
          display: grid !important;
          gap: 3px !important;
          min-width: 0 !important;
        }
        .workflow-section.sf-v3 .sf-tool-purpose-label {
          color: var(--accent) !important;
          font-size: 8px !important;
          font-weight: 900 !important;
          letter-spacing: .14em !important;
          text-transform: uppercase !important;
        }
        .workflow-section.sf-v3 .sf-tool-purpose-text {
          color: var(--text) !important;
          font-size: 11px !important;
          line-height: 1.4 !important;
          font-weight: 700 !important;
          overflow-wrap: anywhere !important;
        }

        .workflow-section.sf-v3 .sf-rail {
          min-width: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .workflow-section.sf-v3 .sf-action {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
        }
        .workflow-section.sf-v3 .sf-action-head {
          width: 100% !important;
          min-width: 0 !important;
          grid-template-columns: auto minmax(0,1fr) auto !important;
        }
        .workflow-section.sf-v3 .sf-action button {
          min-width: 0 !important;
          white-space: nowrap !important;
        }
        .workflow-section.sf-v3 .sf-action-title {
          min-width: 0 !important;
          overflow: hidden !important;
          white-space: nowrap !important;
        }
        .workflow-section.sf-v3 .sf-action pre {
          width: 100% !important;
          height: 132px !important;
          min-height: 132px !important;
          max-height: 132px !important;
          margin: 0 !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          -webkit-overflow-scrolling: touch !important;
        }
        .workflow-section.sf-v3 .sf-output {
          width: 100% !important;
          max-width: 100% !important;
          overflow-wrap: anywhere !important;
        }
        @media (max-width: 420px) {
          .workflow-section.sf-v3 .workflow-card { padding: 20px 14px !important; border-radius: 20px !important; }
          .workflow-section.sf-v3 .workflow-body { gap: 16px !important; }
          .workflow-section.sf-v3 .sf-tool-logo-link { flex-basis: 46px !important; width: 46px !important; height: 46px !important; }
          .workflow-section.sf-v3 .sf-tool-logo-link img { width: 38px !important; height: 38px !important; }
        }
      `;
      document.head.appendChild(style);
    }

    const getToolInfo = (name) => {
      const wanted = String(name || '').trim().toLowerCase();
      const nodes = [...document.querySelectorAll('.tools-list .tool-card, .tools-list .tool-logo-link')];
      const node = nodes.find((item) => {
        const nodeName = item.querySelector('h3')?.textContent?.trim() || item.dataset.toolName || item.getAttribute('aria-label')?.replace(/^Open\s+/i, '');
        return nodeName && nodeName.toLowerCase() === wanted;
      });
      if (!node) return { href: '', purpose: '', logo: '' };
      return {
        href: node.querySelector('.tool-link')?.href || node.href || '',
        purpose: node.querySelector('p')?.textContent?.trim() || node.dataset.toolPurpose || '',
        logo: node.querySelector('img')?.currentSrc || node.querySelector('img')?.src || ''
      };
    };

    const fetchLogo = async (href, existing) => {
      if (existing) return existing;
      if (!href) return '';
      try {
        const response = await fetch(`/api/tool-logo?url=${encodeURIComponent(href)}`, { credentials: 'same-origin', cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (data?.logoUrl) return data.logoUrl;
        }
      } catch {}
      try {
        const target = new URL(href, window.location.href);
        const candidates = [
          `${target.origin}/favicon.svg`,
          `${target.origin}/favicon.png`,
          `${target.origin}/apple-touch-icon.png`,
          `https://www.google.com/s2/favicons?domain=${encodeURIComponent(target.hostname)}&sz=128`
        ];
        for (const src of candidates) {
          const ok = await new Promise((resolve) => {
            const image = new Image();
            image.onload = () => resolve(true);
            image.onerror = () => resolve(false);
            image.src = src;
          });
          if (ok) return src;
        }
      } catch {}
      return '';
    };

    const normalizeToolBadges = async () => {
      [...section.querySelectorAll('.sf-tool-badge')].forEach(async (badge) => {
        if (badge.dataset.sfNormalized === '1') return;
        const name = badge.textContent?.trim() || '';
        if (!name) return;
        const info = getToolInfo(name);
        badge.dataset.sfNormalized = '1';
        badge.innerHTML = '';

        const row = document.createElement('div');
        row.className = 'sf-tool-row';

        const logoLink = document.createElement('a');
        logoLink.className = 'sf-tool-logo-link';
        logoLink.target = '_blank';
        logoLink.rel = 'noopener noreferrer';
        logoLink.title = `Open ${name}`;
        logoLink.setAttribute('aria-label', `Open ${name}`);
        if (info.href) logoLink.href = info.href;

        const image = document.createElement('img');
        image.alt = '';
        image.width = 40;
        image.height = 40;
        image.loading = 'lazy';
        image.decoding = 'async';
        image.referrerPolicy = 'no-referrer';
        image.src = await fetchLogo(info.href, info.logo);
        logoLink.appendChild(image);

        const purpose = document.createElement('div');
        purpose.className = 'sf-tool-purpose';
        const label = document.createElement('span');
        label.className = 'sf-tool-purpose-label';
        label.textContent = 'TOOL USED FOR';
        const text = document.createElement('strong');
        text.className = 'sf-tool-purpose-text';
        text.textContent = info.purpose || `Used to complete Step ${[...section.querySelectorAll('.workflow-card')].indexOf(badge.closest('.workflow-card')) + 1}.`;
        purpose.append(label, text);

        row.append(logoLink, purpose);
        badge.replaceWith(row);
      });
    };

    normalizeToolBadges();
    setTimeout(normalizeToolBadges, 250);
    setTimeout(normalizeToolBadges, 800);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}).catch(() => {});
