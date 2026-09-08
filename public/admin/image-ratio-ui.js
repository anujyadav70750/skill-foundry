(() => {
  const form = document.querySelector('#resource-form');
  if (!form) return;

  const ratios = [
    ['Original', 'original'],
    ['1:1', '1:1'],
    ['4:3', '4:3'],
    ['3:4', '3:4'],
    ['16:9', '16:9'],
    ['9:16', '9:16']
  ];

  const style = document.createElement('style');
  style.textContent = `
    .builder-page .sf-ratio-ui{display:grid;gap:7px;margin-top:9px}
    .builder-page .sf-ratio-ui > span{color:var(--muted);font-size:11px;font-weight:700}
    .builder-page .sf-ratio-ui select{width:100%;min-height:42px;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:rgba(7,17,31,.75);color:var(--text);font:inherit;font-size:13px;outline:none}
    .builder-page .sf-ratio-ui select:focus{border-color:rgba(61,214,208,.55);box-shadow:0 0 0 3px rgba(61,214,208,.07)}
  `;
  document.head.appendChild(style);

  const addRatio = item => {
    if (!item || item.dataset.sfRatioUi === '1') return;
    const file = item.querySelector('input[data-file-role="input"],input[data-file-role="result"]');
    if (!file) return;

    item.dataset.sfRatioUi = '1';

    const existing = item.querySelector('.sf-ratio');
    if (existing) {
      existing.classList.add('sf-ratio-ui');
      return;
    }

    const media = item.querySelector('.media-control');
    const row = media?.querySelector('.upload-row');
    if (!media || !row) return;

    const wrapper = document.createElement('label');
    wrapper.className = 'sf-ratio-ui';
    const text = document.createElement('span');
    text.textContent = 'Display ratio';
    const select = document.createElement('select');
    select.dataset.imageRatio = file.dataset.fileRole;
    select.setAttribute('aria-label', `${file.dataset.fileRole === 'input' ? 'Input' : 'Output'} image display ratio`);

    ratios.forEach(([label, value]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      select.append(option);
    });

    wrapper.append(text, select);
    row.insertAdjacentElement('afterend', wrapper);
  };

  const scan = root => {
    root.querySelectorAll('.media-item').forEach(addRatio);
  };

  scan(form);

  const inputs = document.querySelector('#inputs-list');
  const results = document.querySelector('#results-list');
  const observer = new MutationObserver(records => {
    for (const record of records) {
      record.addedNodes.forEach(node => {
        if (!(node instanceof Element)) return;
        if (node.matches('.media-item')) addRatio(node);
        scan(node);
      });
    }
  });

  [inputs, results].filter(Boolean).forEach(list => observer.observe(list, { childList: true, subtree: true }));
})();
