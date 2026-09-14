(() => {
  const init = () => {
    const link = document.querySelector('.quick-actions a[href="#prompt"]');
    if (!link) return;

    const guide = document.createElement('div');
    guide.className = 'guide-instruction';
    guide.textContent = 'Follow the detailed guide below ↓';
    guide.setAttribute('aria-label', 'Follow the detailed guide below');
    link.replaceWith(guide);

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
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
