(() => {
  // Hide legacy resource-page prompt UI before the browser can paint it.
  const style = document.createElement('style');
  style.id = 'sf-hide-legacy-resource-ui';
  style.textContent = '.resource-page .quick-actions,.resource-page .prompt-section,.resource-page .workflow-prompt-link,.resource-page .prompt-dialog{display:none!important}';
  document.head.appendChild(style);
  import('/resource-workflow-v9.js?v=20260915-2').catch(() => {});
})();
