(() => {
  const localFallback = '/skill-foundry-resource-icon.svg';

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
      const href = link?.href;
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
      image.loading = 'lazy';
      image.decoding = 'async';
      image.referrerPolicy = 'no-referrer';
      image.addEventListener('error', () => {
        if (!image.src.endsWith(localFallback)) image.src = localFallback;
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
          display: grid;
          grid-template-columns: repeat(4, 56px);
          gap: 18px 16px;
          align-items: center;
          justify-content: start;
        }
        .tool-logo-link {
          display: block;
          width: 56px;
          height: 56px;
          box-sizing: border-box;
          border: 0;
          border-radius: 14px;
          background: transparent;
          text-decoration: none;
          overflow: hidden;
          transition: transform .18s ease, filter .18s ease;
        }
        .tool-logo-image {
          display: block;
          width: 56px;
          height: 56px;
          max-width: 56px;
          max-height: 56px;
          object-fit: cover;
          border-radius: 14px;
        }
        .tool-logo-link:hover,
        .tool-logo-link:focus-visible {
          transform: translateY(-2px) scale(1.03);
          filter: brightness(1.06);
          outline: none;
        }
        @media (max-width: 360px) {
          .tool-logo-grid { grid-template-columns: repeat(4, 52px); gap: 16px 12px; }
          .tool-logo-link,
          .tool-logo-image { width: 52px; height: 52px; border-radius: 13px; }
        }
      `;
      document.head.appendChild(style);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountToolLogos, { once: true });
  else mountToolLogos();
})();
