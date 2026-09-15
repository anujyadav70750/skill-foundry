(() => {
  // Keep the guide CTA visible as plain instructional text; it must never scroll or act like a button.
  const style = document.createElement('style');
  style.id = 'sf-guide-instruction-style';
  style.textContent = '.resource-page .quick-actions .button-primary{pointer-events:none!important;cursor:default!important}';
  document.head.appendChild(style);

  const makeGuideInstruction = () => {
    const link = document.querySelector('.resource-page .quick-actions a[href="#prompt"]');
    if (!link) return;
    const instruction = document.createElement('span');
    instruction.className = link.className;
    instruction.textContent = link.textContent;
    instruction.setAttribute('aria-label', 'Instruction: follow the full guide below');
    link.replaceWith(instruction);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', makeGuideInstruction, { once: true });
  else makeGuideInstruction();

  import('/resource-workflow-v9.js?v=20260915-3').catch(() => {});
})();
