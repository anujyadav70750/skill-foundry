import('/resource-workflow-v8.js?v=20260915-2').then(() => {
  const apply = () => {
    const section = document.querySelector('.workflow-section.sf-v7');
    const card = section?.querySelector('.workflow-card');
    const start = card?.querySelector('.sf-v7-start');
    const rail = start?.querySelector('.sf-v7-rail');
    if (!start || !rail || start.querySelector('.sf-v9-instruction')) return;

    const instruction = document.createElement('p');
    instruction.className = 'sf-v9-instruction';
    instruction.textContent = 'Use both images with the prompt below.';
    instruction.style.cssText = 'margin:0 0 10px;color:var(--muted);font-size:11px;line-height:1.45;font-weight:650;';
    start.insertBefore(instruction, rail);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
});
