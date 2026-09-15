(() => {
  document.querySelector('.resource-page .prompt-section')?.remove();
  document.querySelector('.resource-page .prompt-dialog')?.remove();

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
  import('/resource-workflow-v10.js?v=20260916-1').catch(() => {
    document.querySelector('.workflow-section.sf-v7')?.classList.add('sf-workflow-ready');
  });
})();
