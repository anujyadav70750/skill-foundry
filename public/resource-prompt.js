(() => {
  const localFallback = '/favicon.svg';

  const fetchToolLogo = async (url) => {
    try {
      const response = await fetch(`/api/tool-logo?url=${encodeURIComponent(url)}`, { credentials: 'same-origin' });
      if (!response.ok) throw new Error('Logo lookup failed');
      const data = await response.json();
      return data.logoUrl || localFallback;
    } catch {
      return localFallback;
    }
  };

  const mountToolLogos = async () => {
    const section = document.querySelector('.tools-section');
    if (!section) return;

    const subcopy = section.querySelector('.section-subcopy');
    if (subcopy) subcopy.textContent = 'The apps and AI tools used throughout this resource.';

    const list = section.querySelector('.tools-list');
    if (!list) return;

    list.classList.add('tool-logo-grid');
    const cards = [...list.querySelectorAll('.tool-card')];

    await Promise.all(cards.map(async (card) => {
      const name = card.querySelector('h3')?.textContent?.trim() || 'Tool';
      const link = card.querySelector('.tool-link');
      const href = link?.getAttribute('href');
      if (!href) return;

      const anchor = document.createElement('a');
      anchor.className = 'tool-logo-link';
      anchor.href = href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.setAttribute('aria-label', `Open ${name}`);
      anchor.title = name;

      const image = document.createElement('img');
      image.className = 'tool-logo-image';
      image.src = await fetchToolLogo(href);
      image.alt = `${name} logo`;
      image.width = 72;
      image.height = 72;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.referrerPolicy = 'no-referrer';
      image.addEventListener('error', () => {
        if (image.src.endsWith(localFallback)) return;
        image.src = localFallback;
      }, { once: true });

      anchor.appendChild(image);
      card.replaceWith(anchor);
    }));

    section.querySelector('.affiliate-disclosure')?.remove();

    if (!document.querySelector('#sf-tool-logo-grid-style')) {
      const style = document.createElement('style');
      style.id = 'sf-tool-logo-grid-style';
      style.textContent = `
        .tool-logo-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
        }
        .tool-logo-link {
          display: block;
          width: 72px;
          height: 72px;
          flex: 0 0 72px;
          box-sizing: border-box;
          border: 0;
          border-radius: 18px;
          background: transparent;
          text-decoration: none;
          overflow: hidden;
          transition: transform .18s ease, filter .18s ease;
        }
        .tool-logo-image {
          display: block;
          width: 72px;
          height: 72px;
          max-width: 72px;
          max-height: 72px;
          object-fit: contain;
          border-radius: 18px;
        }
        .tool-logo-link:hover,
        .tool-logo-link:focus-visible {
          transform: translateY(-2px) scale(1.02);
          filter: brightness(1.06);
          outline: none;
        }
        @media (max-width: 600px) {
          .tool-logo-grid { gap: 16px; }
          .tool-logo-link,
          .tool-logo-image { width: 72px; height: 72px; }
        }
      `;
      document.head.appendChild(style);
    }
  };

  const init = () => {
    const link = document.querySelector('.quick-actions a[href="#prompt"]');
    if (link) {
      const guide = document.createElement('div');
      guide.className = 'guide-instruction';
      guide.textContent = 'Follow the detailed guide below ↓';
      guide.setAttribute('aria-label', 'Follow the detailed guide below');
      link.replaceWith(guide);
    }

    if (!document.querySelector('#sf-guide-instruction-style')) {
      const style = document.createElement('style');
      style.id = 'sf-guide-instruction-style';
      style.textContent = `
        .guide-instruction {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 46px;
          box-sizing: border-box;
          padding: 12px 16px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: transparent;
          color: var(--text);
          font-size: 13px;
          font-weight: 750;
          line-height: 1.35;
          text-align: center;
        }
        @media (min-width: 769px) {
          .guide-instruction { width: fit-content; min-height: 48px; padding-inline: 20px; }
        }
      `;
      document.head.appendChild(style);
    }

    mountToolLogos();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();