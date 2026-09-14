(() => {
  const localFallback = '/skill-foundry-resource-icon.svg';

  const websiteFallback = (url) => {
    try {
      const target = new URL(url, window.location.href);
      if (target.hostname.endsWith('skillfoundryai.workers.dev')) return `${target.origin}/favicon.svg`;
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(target.hostname)}&sz=128`;
    } catch {
      return localFallback;
    }
  };

  const imageQuality = (src) => new Promise((resolve) => {
    if (!src) return resolve({ src: '', width: 0, height: 0 });
    const probe = new Image();
    probe.decoding = 'async';
    probe.referrerPolicy = 'no-referrer';
    probe.onload = () => resolve({ src, width: probe.naturalWidth || 0, height: probe.naturalHeight || 0 });
    probe.onerror = () => resolve({ src, width: 0, height: 0 });
    probe.src = src;
  });

  const fetchToolLogo = async (url) => {
    let primary = '';
    try {
      const response = await fetch(`/api/tool-logo?url=${encodeURIComponent(url)}`, { credentials: 'same-origin', cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        if (data.logoUrl && !data.logoUrl.endsWith('/skill-foundry-resource-icon.svg')) primary = data.logoUrl;
      }
    } catch {}

    try {
      const target = new URL(url, window.location.href);
      const candidates = [
        primary,
        `${target.origin}/favicon.svg`,
        `${target.origin}/favicon.png`,
        `${target.origin}/apple-touch-icon.png`,
        websiteFallback(url)
      ].filter((src, index, list) => src && list.indexOf(src) === index);

      const results = await Promise.all(candidates.map(imageQuality));
      const valid = results.filter((result) => result.width > 0 && result.height > 0);
      if (valid.length) {
        valid.sort((a, b) => (b.width * b.height) - (a.width * a.height));
        return valid[0].src;
      }
    } catch {}

    return primary || websiteFallback(url);
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
      image.width = 56;
      image.height = 56;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.referrerPolicy = 'no-referrer';
      image.addEventListener('error', () => {
        const fallback = websiteFallback(href);
        if (image.src !== fallback) image.src = fallback;
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
          border: 1px solid rgba(148, 163, 184, .34);
          border-radius: 14px;
          background: transparent;
          text-decoration: none;
          overflow: hidden;
          transition: transform .18s ease, filter .18s ease, border-color .18s ease;
        }
        .tool-logo-image {
          display: block;
          width: 56px;
          height: 56px;
          max-width: 56px;
          max-height: 56px;
          object-fit: cover;
          border-radius: 13px;
        }
        .tool-logo-link:hover,
        .tool-logo-link:focus-visible {
          transform: translateY(-2px) scale(1.03);
          filter: brightness(1.06);
          border-color: rgba(148, 163, 184, .5);
          outline: none;
        }
        @media (max-width: 360px) {
          .tool-logo-grid { grid-template-columns: repeat(4, 52px); gap: 16px 12px; }
          .tool-logo-link {
            width: 52px;
            height: 52px;
            border-radius: 13px;
          }
          .tool-logo-image {
            width: 52px;
            height: 52px;
            border-radius: 12px;
          }
        }
      `;
      document.head.appendChild(style);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountToolLogos, { once: true });
  else mountToolLogos();
})();
