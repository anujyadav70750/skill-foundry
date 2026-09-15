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

  const resolveLogo = async (url) => {
    // The worker is the canonical resolver because it can inspect the site's own
    // HTML and declared icon. Do not replace that result with a different favicon
    // merely because another candidate has larger pixel dimensions.
    try {
      const response = await fetch(`/api/tool-logo?url=${encodeURIComponent(url)}`, { credentials: 'same-origin', cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        if (data.logoUrl && !data.logoUrl.endsWith('/skill-foundry-resource-icon.svg')) return data.logoUrl;
      }
    } catch {}

    // Only use direct site candidates when the canonical resolver is unavailable.
    try {
      const target = new URL(url, window.location.href);
      const candidates = [
        `${target.origin}/favicon.svg`,
        `${target.origin}/favicon.png`,
        `${target.origin}/favicon.ico`,
        `${target.origin}/apple-touch-icon.png`
      ];
      for (const candidate of candidates) {
        const result = await imageQuality(candidate);
        if (result.width > 0 && result.height > 0) return result.src;
      }
    } catch {}

    return websiteFallback(url);
  };

  const mountToolLogos = () => {
    const section = document.querySelector('.tools-section');
    if (!section) return;

    const subcopy = section.querySelector('.section-subcopy');
    if (subcopy) subcopy.textContent = 'The apps and AI tools used throughout this resource.';

    const list = section.querySelector('.tools-list');
    if (!list) return;

    list.classList.add('tool-logo-grid');
    const cards = [...list.querySelectorAll('.tool-card')];

    cards.forEach((card) => {
      const name = card.querySelector('h3')?.textContent?.trim() || 'Tool';
      const purpose = card.querySelector('p')?.textContent?.trim() || '';
      const link = card.querySelector('.tool-link');
      const href = link?.href;
      if (!href) return;

      // Replace the card immediately so the Tools section never disappears while
      // logo resolution is happening. The temporary source is the site's origin,
      // not Google's favicon service; it is only used if the canonical resolver fails.
      const anchor = document.createElement('a');
      anchor.className = 'tool-logo-link';
      anchor.href = href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.setAttribute('aria-label', `Open ${name}`);
      anchor.title = name;
      anchor.dataset.toolName = name;
      anchor.dataset.toolPurpose = purpose;

      const image = document.createElement('img');
      image.className = 'tool-logo-image';
      image.src = (() => {
        try { return `${new URL(href, window.location.href).origin}/favicon.svg`; } catch { return localFallback; }
      })();
      image.alt = `${name} logo`;
      image.width = 56;
      image.height = 56;
      image.loading = 'eager';
      image.decoding = 'async';
      image.referrerPolicy = 'no-referrer';
      image.addEventListener('error', () => {
        if (image.src !== localFallback) image.src = localFallback;
      }, { once: true });

      anchor.appendChild(image);
      card.replaceWith(anchor);

      resolveLogo(href).then((src) => {
        if (src) image.src = src;
      }).catch(() => {});
    });

    section.querySelector('.affiliate-disclosure')?.remove();

    if (!document.querySelector('#sf-tool-logo-grid-style')) {
      const style = document.createElement('style');
      style.id = 'sf-tool-logo-grid-style';
      style.textContent = `
        .tool-logo-grid { display:grid; grid-template-columns:repeat(4,56px); gap:18px 16px; align-items:center; justify-content:start; }
        .tool-logo-link { display:block; width:56px; height:56px; box-sizing:border-box; border:1px solid rgba(148,163,184,.34); border-radius:14px; background:transparent; text-decoration:none; overflow:hidden; transition:transform .18s ease,filter .18s ease,border-color .18s ease; }
        .tool-logo-image { display:block; width:56px; height:56px; max-width:56px; max-height:56px; object-fit:cover; border-radius:13px; }
        .tool-logo-link:hover,.tool-logo-link:focus-visible { transform:translateY(-2px) scale(1.03); filter:brightness(1.06); border-color:rgba(148,163,184,.5); outline:none; }
        @media(max-width:360px){ .tool-logo-grid{grid-template-columns:repeat(4,52px);gap:16px 12px}.tool-logo-link{width:52px;height:52px;border-radius:13px}.tool-logo-image{width:52px;height:52px;border-radius:12px} }
      `;
      document.head.appendChild(style);
    }

    section.classList.add('sf-tools-ready');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountToolLogos, { once: true });
  else mountToolLogos();
})();
