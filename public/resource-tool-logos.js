(() => {
  const style = document.createElement('style');
  style.textContent = `.tool-card-main.has-tool-logo{display:grid;grid-template-columns:44px minmax(0,1fr) auto;align-items:center;gap:12px}.tool-logo-link{display:grid;place-items:center;width:44px;height:44px;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.035);overflow:hidden}.tool-logo{display:block;width:34px;height:34px;object-fit:contain}.tool-logo-link:hover{border-color:rgba(61,214,208,.45);background:rgba(61,214,208,.07)}@media(max-width:600px){.tool-card-main.has-tool-logo{grid-template-columns:44px minmax(0,1fr)}}`;
  document.head.appendChild(style);
  document.querySelectorAll('.tools-list .tool-card').forEach(async (card) => {
    const link = card.querySelector('.tool-link[href]');
    if (!link || card.querySelector('.tool-logo-link')) return;
    try {
      const response = await fetch(`/api/tool-logo?url=${encodeURIComponent(link.href)}`, { credentials: 'same-origin' });
      const data = await response.json();
      if (!data.logoUrl) return;
      const logoLink = document.createElement('a');
      logoLink.className = 'tool-logo-link';
      logoLink.href = link.href;
      logoLink.target = '_blank';
      logoLink.rel = link.rel || 'noopener noreferrer';
      logoLink.setAttribute('aria-label', `Open ${link.textContent.replace(/^Open\s+/i, '').replace(/\s*→\s*$/, '')}`);
      const logo = document.createElement('img');
      logo.className = 'tool-logo'; logo.src = data.logoUrl; logo.alt = ''; logo.width = 34; logo.height = 34; logo.loading = 'lazy'; logo.referrerPolicy = 'no-referrer';
      logoLink.appendChild(logo);
      const main = card.querySelector('.tool-card-main');
      if (!main) return;
      main.insertBefore(logoLink, main.firstChild); main.classList.add('has-tool-logo');
    } catch {}
  });
})();
