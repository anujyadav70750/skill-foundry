(() => {
  // Keep the guide instruction visible as a plain, non-interactive instruction.
  // Replace it immediately when this deferred script runs so the old arrow cannot flash during refresh.
  const style = document.createElement('style');
  style.id = 'sf-guide-instruction-style';
  style.textContent = '.resource-page .quick-actions .button-primary{pointer-events:none!important;cursor:default!important}';
  document.head.appendChild(style);

  const makeGuideInstruction = () => {
    const link = document.querySelector('.resource-page .quick-actions a[href="#prompt"]');
    if (!link) return;
    const instruction = document.createElement('span');
    instruction.className = link.className;
    instruction.textContent = 'Follow the full guide';
    instruction.setAttribute('aria-label', 'Instruction: follow the full guide below');
    link.replaceWith(instruction);
  };

  makeGuideInstruction();

  import('/resource-workflow-v9.js?v=20260915-3').catch(() => {});
})();
