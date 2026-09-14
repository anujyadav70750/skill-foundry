(() => {
  const toolLogoUrl = (name, url) => {
    const key = String(name || '').trim().toLowerCase();
    const knownLogos = {
      'canva': 'https://cdn.simpleicons.org/canva',
      'notion': 'https://cdn.simpleicons.org/notion',
      'github': 'https://cdn.simpleicons.org/github',
      'chatgpt': 'https://cdn.simpleicons.org/openai',
      'openai': 'https://cdn.simpleicons.org/openai',
      'youtube': 'https://cdn.simpleicons.org/youtube',
      'google drive': 'https://cdn.simpleicons.org/googledrive',
      'google docs': 'https://cdn.simpleicons.org/googledocs',
      'figma': 'https://cdn.simpleicons.org/figma',
      'midjourney': 'https://cdn.simpleicons.org/midjourney',
      'claude': 'https://cdn.simpleicons.org/anthropic',
      'perplexity': 'https://cdn.simpleicons.org/perplexity',
      'elevenlabs': 'https://cdn.simpleicons.org/elevenlabs',
      'capcut': 'https://cdn.simpleicons.org/capcut',
      'skill foundary ai': '/favicon.svg',
      'skill foundry ai': '/favicon.svg'
    };
    if (knownLogos[key]) return knownLogos[key];

    try {
      const origin = new URL(url, window.location.href).origin;
      return `${origin}/favicon.ico`;
    } catch {
      return '/favicon.svg';
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
      image.src = toolLogoUrl(name, href);
      image.alt = '';
      image.width = 34;
      image.height = 34;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => {
        if (image.src.endsWith('/favicon.svg')) return;
        image.src = '/favicon.svg';
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
          grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
          gap: 12px;
          align-items: center;
        }
        .tool-logo-link {
          display: grid;
          place-items: center;
          width: 68px;
          height: 68px;
          box-sizing: border-box;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: rgba(16,34,56,.35);
          text-decoration: none;
          transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }
        .tool-logo-image {
          display: block;
          width: 34px;
          height: 34px;
          object-fit: contain;
        }
        .tool-logo-link:hover,
        .tool-logo-link:focus-visible {
          transform: translateY(-2px);
          border-color: rgba(61,214,208,.45);
          background: rgba(61,214,208,.06);
          outline: none;
        }
        @media (max-width: 600px) {
          .tool-logo-grid {
            grid-template-columns: repeat(4, 68px);
            justify-content: start;
          }
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