import('/resource-workflow-v3.js').then(() => {
  const init = () => {
    const section = document.querySelector('.workflow-section.sf-v3');
    if (!section) return;

    if (!document.querySelector('#sf-workflow-v4-style')) {
      const style = document.createElement('style');
      style.id = 'sf-workflow-v4-style';
      style.textContent = `
        .workflow-section.sf-v3 .workflow-card .workflow-body {
          display: grid !important;
          grid-template-rows: 1fr !important;
          gap: 16px !important;
          margin-top: 20px !important;
          opacity: 1 !important;
          overflow: visible !important;
        }
        .workflow-section.sf-v3 .workflow-step { cursor: default !important; }
        .workflow-section.sf-v3 .workflow-chevron { display: none !important; }
        .workflow-section.sf-v3 .sf-action pre {
          max-height: 150px;
          min-height: 72px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .workflow-section.sf-v3 .sf-tool-link {
          display: inline-flex;
          width: max-content;
          max-width: 100%;
          text-decoration: none;
          color: inherit;
        }
        .workflow-section.sf-v3 .sf-tool-link .sf-tool-badge {
          cursor: pointer;
          transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }
        .workflow-section.sf-v3 .sf-tool-link:hover .sf-tool-badge,
        .workflow-section.sf-v3 .sf-tool-link:focus-visible .sf-tool-badge {
          transform: translateY(-1px);
          border-color: rgba(61,214,208,.55);
          background: rgba(61,214,208,.13);
        }
        .workflow-section.sf-v3 .sf-tool-badge img {
          width: 20px;
          height: 20px;
          object-fit: contain;
          border-radius: 5px;
          background: rgba(255,255,255,.08);
        }
      `;
      document.head.appendChild(style);
    }

    [...section.querySelectorAll('.sf-tool-badge')].forEach((badge) => {
      if (badge.closest('.sf-tool-link')) return;
      const name = badge.textContent?.trim();
      if (!name) return;

      const toolCard = [...document.querySelectorAll('.tools-list .tool-card')].find((card) => {
        const cardName = card.querySelector('h3')?.textContent?.trim();
        return cardName && cardName.toLowerCase() === name.toLowerCase();
      });
      const href = toolCard?.querySelector('.tool-link')?.href;
      if (!href) return;

      const link = document.createElement('a');
      link.className = 'sf-tool-link';
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.title = `Open ${name}`;
      link.setAttribute('aria-label', `Open ${name}`);
      badge.parentNode.insertBefore(link, badge);
      link.appendChild(badge);

      if (!badge.querySelector('img')) {
        fetch(`/api/tool-logo?url=${encodeURIComponent(href)}`, { credentials: 'same-origin', cache: 'no-store' })
          .then((response) => response.ok ? response.json() : null)
          .then((data) => {
            if (!data?.logoUrl || badge.querySelector('img')) return;
            const image = document.createElement('img');
            image.src = data.logoUrl;
            image.alt = '';
            image.width = 20;
            image.height = 20;
            image.loading = 'lazy';
            image.decoding = 'async';
            image.referrerPolicy = 'no-referrer';
            badge.prepend(image);
          })
          .catch(() => {});
      }
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}).catch(() => {});
