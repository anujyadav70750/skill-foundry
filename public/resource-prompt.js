(() => {
  const localFallback = '/favicon.svg';

  const logoUrlFromWebsite = (url) => {
    try {
      const target = new URL(url, window.location.href);
      if (target.origin === window.location.origin) return localFallback;
      if (target.hostname.endsWith('skillfoundryai.workers.dev')) return `${target.origin}/favicon.svg`;
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(target.hostname)}&sz=128`;
    } catch {
      return localFallback;
    }
  };

  const mountToolLogos = () => {
    const section = document.querySelector('.tools-section');
    if (!section) return;

    const subcopy = section.querySelector('.section-subcopy');
    if (subcopy) subcopy.textContent = 'The apps and AI tools used throughout this resource.';

    const list = section.querySelector('.tools-list');
    if (!list) return;

    list.classList.add('tool-logo-grid');
    list.querySelectorAll('.tool-card').forEach((card) => {
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
      image.src = logoUrlFromWebsite(href);
      image.alt = `${name} logo`;
      image.width = 76;
      image.height = 76;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.referrerPolicy = 'no-referrer';
      image.addEventListener('error', () => {
        if (image.src === `${window.location.origin}${localFallback}`) return;
        image.src = localFallback;
      }, { once: true });

      anchor.appendChild(image);
      card.replaceWith(anchor);
    });

    section.querySelector('.affiliate-disclosure')?.remove();

    if (!document.querySelector('#sf-tool-logo-grid-style')) {
      const style = document.createElement('style');
      style.id = 'sf-tool-logo-grid-style';
      style.textContent = `
        .tool-logo-grid {
          display: grid;
          grid-template-columns: repeat(4, 76px);
          gap: 16px;
          align-items: center;
          justify-content: start;
        }
        .tool-logo-link {
          display: block;
          width: 76px;
          height: 76px;
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
          width: 76px;
          height: 76px;
          max-width: 76px;
          max-height: 76px;
          object-fit: cover;
          border-radius: 18px;
        }
        .tool-logo-link:hover,
        .tool-logo-link:focus-visible {
          transform: translateY(-2px) scale(1.02);
          filter: brightness(1.06);
          outline: none;
        }
        @media (max-width: 360px) {
          .tool-logo-grid { grid-template-columns: repeat(4, 64px); gap: 12px; }
          .tool-logo-link,
          .tool-logo-image { width: 64px; height: 64px; }
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