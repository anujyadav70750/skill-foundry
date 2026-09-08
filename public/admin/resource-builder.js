(() => {
  const form = document.querySelector('#resource-form');
  if (!form) return;

  const preview = document.querySelector('#preview-content');
  const status = document.querySelector('#status');
  const storageKey = 'skill-foundry-resource-draft-v5';
  const escapeHtml = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  const yamlQuote = (value) => JSON.stringify(String(value ?? ''));
  const slugify = (value) => String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  const value = (name) => form.elements[name]?.value || '';
  const setStatus = (message) => { if (status) status.textContent = message; };
  let slugManuallyEdited = false;

  // Section 05 is the single source of truth for tools. Hide the legacy duplicate fields in Core details.
  ['tool', 'toolUrl', 'toolAffiliate'].forEach((name) => {
    const field = form.elements[name];
    if (!field) return;
    field.required = false;
    const label = field.closest('label');
    if (label) label.hidden = true;
  });

  const style = document.createElement('style');
  style.textContent = `.builder-page .repeat-add-button{display:flex;width:100%;align-items:center;justify-content:center;margin-top:10px;min-height:42px}.builder-page .repeat-item .remove-button{z-index:2}.builder-page .media-item{padding-bottom:14px}.builder-page .media-control{display:grid;gap:8px}.builder-page .media-control .upload-row{width:100%}.builder-page .repeat-item input,.builder-page .repeat-item textarea{background:rgba(7,17,31,.75)!important;color:var(--text)!important;border:1px solid var(--line)!important}.builder-page .repeat-item input::placeholder,.builder-page .repeat-item textarea::placeholder{color:#71849a!important;opacity:1}`;
  document.head.appendChild(style);

  const removeButton = () => '<button class="remove-button" type="button" aria-label="Remove item" title="Remove item">×</button>';
  const fileField = (role, placeholder) => `<div class="media-control"><div class="upload-row"><input data-role="${role}" class="path-input" placeholder="${placeholder}" /><label class="file-button"><input type="file" accept="image/*" data-file-role="${role}" />Choose image</label></div><div class="image-preview" data-preview-role="${role}"></div></div>`;

  const showLocalPreview = (target, file) => {
    if (!target || !file) return;
    const old = target.dataset.objectUrl;
    if (old) URL.revokeObjectURL(old);
    const url = URL.createObjectURL(file);
    target.dataset.objectUrl = url;
    target.classList.add('has-image');
    target.innerHTML = `<img src="${url}" alt="Selected image preview"><span>${escapeHtml(file.name)}</span>`;
  };
  const showPathPreview = (target, path) => {
    if (!target || !path) return;
    target.classList.add('has-image');
    target.innerHTML = `<img src="${escapeHtml(path)}" alt="Image preview" onerror="this.closest('.image-preview')?.classList.remove('has-image')"><span>Preview</span>`;
  };

  const bindItem = (item) => {
    item.querySelector('.remove-button')?.addEventListener('click', () => {
      const list = item.parentElement;
      const minimum = list?.dataset.minimum === '1';
      if (minimum && list?.children.length === 1) {
        item.querySelectorAll('input, textarea').forEach((field) => {
          if (field.type === 'checkbox') field.checked = false;
          else if (field.type !== 'file') field.value = '';
        });
        item.querySelectorAll('.image-preview').forEach((target) => { target.classList.remove('has-image'); target.innerHTML = ''; });
      } else {
        item.remove();
      }
      placeAddButtons();
      renderPreview();
    });
    item.querySelectorAll('input:not([type="file"]), textarea, select').forEach((field) => {
      field.addEventListener('input', renderPreview);
      field.addEventListener('change', renderPreview);
    });
    item.querySelectorAll('[data-file-role]').forEach((file) => file.addEventListener('change', () => {
      const selected = file.files?.[0];
      if (!selected) return;
      const role = file.dataset.fileRole;
      const pathInput = item.querySelector(`[data-role="${role}"]`);
      if (pathInput) pathInput.value = `/images/${selected.name.replace(/[^a-zA-Z0-9._-]+/g, '-').toLowerCase()}`;
      showLocalPreview(item.querySelector(`[data-preview-role="${role}"]`), selected);
      renderPreview();
    }));
  };

  const addInput = (data = '') => {
    const item = document.createElement('div'); item.className = 'repeat-item media-item';
    item.innerHTML = `<div><label>Input image</label>${fileField('input', 'https://.../input.jpg or /images/input.jpg')}</div>${removeButton()}`;
    item.querySelector('[data-role="input"]').value = data;
    document.querySelector('#inputs-list').appendChild(item); bindItem(item);
    if (data) showPathPreview(item.querySelector('[data-preview-role="input"]'), data);
  };
  const addResult = (data = '') => {
    const item = document.createElement('div'); item.className = 'repeat-item media-item';
    item.innerHTML = `<div><label>Output image</label>${fileField('result', 'https://.../result.jpg or /images/result.jpg')}</div>${removeButton()}`;
    item.querySelector('[data-role="result"]').value = data;
    document.querySelector('#results-list').appendChild(item); bindItem(item);
    if (data) showPathPreview(item.querySelector('[data-preview-role="result"]'), data);
  };
  const addTool = (data = {}) => {
    const item = document.createElement('div'); item.className = 'repeat-item tool';
    item.innerHTML = `<label>Tool name<input data-role="tool-name" placeholder="e.g. Photoshop" /></label><label>Purpose<input data-role="tool-purpose" placeholder="What this tool was used for" /></label><label>Website URL<input data-role="tool-url" type="url" placeholder="https://..." /></label><label class="check-inline compact"><input data-role="tool-affiliate" type="checkbox" /> Affiliate link</label>${removeButton()}`;
    item.querySelector('[data-role="tool-name"]').value = data.name || '';
    item.querySelector('[data-role="tool-purpose"]').value = data.purpose || '';
    item.querySelector('[data-role="tool-url"]').value = data.url || '';
    item.querySelector('[data-role="tool-affiliate"]').checked = Boolean(data.affiliate);
    document.querySelector('#tools-list').appendChild(item); bindItem(item);
  };
  const addStep = (data = {}) => {
    const item = document.createElement('div'); item.className = 'repeat-item step';
    item.innerHTML = `<label>Step title<input data-role="step-title" placeholder="Prepare the input" /></label><label>Description<textarea data-role="step-description" rows="3" placeholder="Describe what to do and what to look for."></textarea></label>${removeButton()}`;
    item.querySelector('[data-role="step-title"]').value = data.title || '';
    item.querySelector('[data-role="step-description"]').value = data.description || '';
    document.querySelector('#steps-list').appendChild(item); bindItem(item);
  };
  const addTip = (data = '') => {
    const item = document.createElement('div'); item.className = 'repeat-item';
    item.innerHTML = `<textarea data-role="tip" rows="3" aria-label="Tip" placeholder="Keep the main subject clearly described."></textarea>${removeButton()}`;
    item.querySelector('textarea').value = data; document.querySelector('#tips-list').appendChild(item); bindItem(item);
  };
  const addTag = (data = '') => {
    const item = document.createElement('div'); item.className = 'repeat-item';
    item.innerHTML = `<input data-role="tag" aria-label="Tag" placeholder="image-generation" />${removeButton()}`;
    item.querySelector('input').value = data; document.querySelector('#tags-list').appendChild(item); bindItem(item);
  };
  const addRelated = (data = '') => {
    const item = document.createElement('div'); item.className = 'repeat-item';
    item.innerHTML = `<input data-role="related" aria-label="Related resource slug" placeholder="ai-video-cinematic-prompt" />${removeButton()}`;
    item.querySelector('input').value = data; document.querySelector('#related-list').appendChild(item); bindItem(item);
  };

  const listConfig = [
    ['inputs-list', addInput, 1], ['results-list', addResult, 1], ['tools-list', addTool, 1], ['steps-list', addStep, 1], ['tips-list', addTip, 1], ['tags-list', addTag, 1], ['related-list', addRelated, 1]
  ];
  listConfig.forEach(([id, fn, minimum]) => { const list = document.querySelector('#' + id); if (list) list.dataset.minimum = String(minimum); });

  const placeAddButtons = () => {
    document.querySelectorAll('[data-add]').forEach((button) => {
      const type = button.dataset.add;
      const targetId = type === 'input' ? 'inputs-list' : type === 'result' ? 'results-list' : `${type}s-list`;
      const list = document.querySelector('#' + targetId);
      if (!list) return;
      list.insertAdjacentElement('afterend', button);
      button.classList.add('repeat-add-button');
    });
  };
  const ensureMinimums = () => listConfig.forEach(([id, fn, minimum]) => { const list = document.querySelector('#' + id); if (!list) return; while (list.children.length < minimum) fn(); });

  const collect = () => ({
    inputs: [...document.querySelectorAll('[data-role="input"]')].map((x) => x.value.trim()).filter(Boolean),
    results: [...document.querySelectorAll('[data-role="result"]')].map((x) => x.value.trim()).filter(Boolean),
    tools: [...document.querySelectorAll('#tools-list .repeat-item')].map((item) => ({ name: item.querySelector('[data-role="tool-name"]').value.trim(), purpose: item.querySelector('[data-role="tool-purpose"]').value.trim(), url: item.querySelector('[data-role="tool-url"]').value.trim(), affiliate: item.querySelector('[data-role="tool-affiliate"]').checked })).filter((x) => x.name || x.purpose || x.url),
    steps: [...document.querySelectorAll('#steps-list .repeat-item')].map((item) => ({ title: item.querySelector('[data-role="step-title"]').value.trim(), description: item.querySelector('[data-role="step-description"]').value.trim() })).filter((x) => x.title || x.description),
    tips: [...document.querySelectorAll('[data-role="tip"]')].map((x) => x.value.trim()).filter(Boolean), tags: [...document.querySelectorAll('[data-role="tag"]')].map((x) => x.value.trim()).filter(Boolean), related: [...document.querySelectorAll('[data-role="related"]')].map((x) => x.value.trim()).filter(Boolean)
  });
  const readForm = () => { const data = {}; form.querySelectorAll('input[name], textarea[name], select[name]').forEach((field) => { data[field.name] = field.type === 'checkbox' ? field.checked : field.value; }); data.repeat = collect(); return data; };
  const renderPreview = () => {
    const d = readForm(); const r = d.repeat; const primary = r.tools[0]; let html = `<h3>${escapeHtml(d.title || 'Untitled resource')}</h3><p class="preview-meta">${escapeHtml(d.category || 'Category')} · ${escapeHtml(primary?.name || 'Tool used')}${d.date ? ` · Published ${escapeHtml(d.date)}` : ''}</p>`;
    if (d.heroImage) html += `<img class="preview-image" src="${escapeHtml(d.heroImage)}" alt="${escapeHtml(d.imageAlt || d.title || 'Resource image')}" />`; html += `<p class="preview-copy">${escapeHtml(d.description || 'Add a description to see it here.')}</p>`;
    if (d.intro) html += `<h4>Introduction</h4><p class="preview-copy">${escapeHtml(d.intro)}</p>`; if (d.whatItDoes) html += `<h4>What this resource does</h4><p class="preview-copy">${escapeHtml(d.whatItDoes)}</p>`;
    if (r.tools.length) html += `<h4>Tools used</h4><div class="preview-tools">${r.tools.map((x) => `<div class="preview-tool"><strong>${escapeHtml(x.name || 'Unnamed tool')}</strong><span>${escapeHtml(x.purpose || 'Purpose not added')}</span>${x.url ? `<a href="${escapeHtml(x.url)}" target="_blank" rel="noopener">Open tool →</a>` : ''}</div>`).join('')}</div>`;
    if (r.inputs.length || r.results.length) html += `<h4>Results</h4><div class="preview-list">${r.inputs.map((x,i) => `<div>INPUT ${i+1} · ${escapeHtml(x)}</div>`).join('')}${r.results.map((x,i) => `<div>OUTPUT ${i+1} · ${escapeHtml(x)}</div>`).join('')}</div>`;
    if (d.prompt) html += `<h4>Prompt</h4><div class="preview-prompt">${escapeHtml(d.prompt)}</div>`; if (d.videoEmbedUrl || d.originalVideoUrl) html += `<h4>Tutorial</h4><p class="preview-copy">${escapeHtml(d.originalVideoUrl || d.videoEmbedUrl)}</p>`;
    if (r.steps.length) html += `<h4>Step by step</h4><ol class="preview-list">${r.steps.map((x) => `<li><strong>${escapeHtml(x.title)}</strong>${x.description ? ` — ${escapeHtml(x.description)}` : ''}</li>`).join('')}</ol>`;
    if (r.tips.length) html += `<h4>Tips for better results</h4><ul class="preview-list">${r.tips.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`; if (r.tags.length) html += `<h4>Tags</h4><p class="preview-copy">${escapeHtml(r.tags.join(', '))}</p>`; if (r.related.length) html += `<h4>Related resources</h4><ul class="preview-list">${r.related.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
    preview.innerHTML = html;
  };
  const yamlList = (items) => `[${items.map(yamlQuote).join(', ')}]`;
  const makeMarkdown = (d) => {
    const r = d.repeat; const primary = r.tools[0] || { name: '', purpose: '', url: '', affiliate: false };
    const lines = ['---', `title: ${yamlQuote(d.title)}`, `slug: ${yamlQuote(d.slug || slugify(d.title))}`, `description: ${yamlQuote(d.description)}`, `category: ${yamlQuote(d.category)}`, `tool: ${yamlQuote(primary.name)}`, `toolUrl: ${primary.url ? yamlQuote(primary.url) : 'null'}`, `toolAffiliate: ${primary.affiliate ? 'true' : 'false'}`, `date: ${yamlQuote(d.date)}`, `thumbnail: ${d.thumbnail ? yamlQuote(d.thumbnail) : 'null'}`, `heroImage: ${d.heroImage ? yamlQuote(d.heroImage) : 'null'}`, `inputImage: ${r.inputs[0] ? yamlQuote(r.inputs[0]) : 'null'}`, `inputImages: ${yamlList(r.inputs)}`, `resultImages: ${yamlList(r.results)}`, `imageAlt: ${d.imageAlt ? yamlQuote(d.imageAlt) : 'null'}`, `intro: ${d.intro ? yamlQuote(d.intro) : '""'}`, `whatItDoes: ${d.whatItDoes ? yamlQuote(d.whatItDoes) : '""'}`, 'toolsUsed:'];
    if (r.tools.length) r.tools.forEach((x) => lines.push(`  - name: ${yamlQuote(x.name)}`, `    purpose: ${yamlQuote(x.purpose)}`, `    url: ${x.url ? yamlQuote(x.url) : 'null'}`, `    affiliate: ${x.affiliate ? 'true' : 'false'}`)); else lines.push('  []');
    lines.push(`prompt: ${yamlQuote(d.prompt)}`, `videoEmbedUrl: ${d.videoEmbedUrl ? yamlQuote(d.videoEmbedUrl) : 'null'}`, `originalVideoUrl: ${d.originalVideoUrl ? yamlQuote(d.originalVideoUrl) : 'null'}`, 'steps:');
    if (r.steps.length) r.steps.forEach((x) => lines.push(`  - title: ${yamlQuote(x.title)}`, `    description: ${yamlQuote(x.description)}`)); else lines.push('  []');
    lines.push('tips:'); if (r.tips.length) r.tips.forEach((x) => lines.push(`  - ${yamlQuote(x)}`)); else lines.push('  []');
    lines.push(`relatedResources: ${yamlList(r.related)}`, `tags: ${yamlList(r.tags)}`, `seoTitle: ${d.seoTitle ? yamlQuote(d.seoTitle) : 'null'}`, `seoDescription: ${d.seoDescription ? yamlQuote(d.seoDescription) : 'null'}`, `featured: ${d.featured ? 'true' : 'false'}`, '---', '', d.intro || '', '', d.whatItDoes || '', '', d.prompt ? `## Prompt\n\n${d.prompt}` : '', ''); return lines.join('\n');
  };

  const restoreRepeats = (repeat = {}, legacy = {}) => {
    ['inputs-list','results-list','tools-list','steps-list','tips-list','tags-list','related-list'].forEach((id) => { document.querySelector('#' + id).innerHTML = ''; });
    const legacyTool = legacy.tool ? { name: legacy.tool, purpose: 'Primary tool/model used for this resource.', url: legacy.toolUrl || '', affiliate: Boolean(legacy.toolAffiliate) } : null;
    const tools = repeat.tools?.length ? repeat.tools : (legacyTool ? [legacyTool] : [{}]);
    (repeat.inputs?.length ? repeat.inputs : ['']).forEach(addInput); (repeat.results?.length ? repeat.results : ['']).forEach(addResult); tools.forEach(addTool); (repeat.steps?.length ? repeat.steps : [{}]).forEach(addStep); (repeat.tips?.length ? repeat.tips : ['']).forEach(addTip); (repeat.tags?.length ? repeat.tags : ['']).forEach(addTag); (repeat.related?.length ? repeat.related : ['']).forEach(addRelated); placeAddButtons();
  };
  const writeForm = (data) => { form.querySelectorAll('input[name], textarea[name], select[name]').forEach((field) => { if (!(field.name in data)) return; if (field.type === 'checkbox') field.checked = Boolean(data[field.name]); else field.value = data[field.name] ?? ''; }); slugManuallyEdited = Boolean(data.slug); restoreRepeats(data.repeat || {}, data); };

  document.querySelector('#make-slug')?.addEventListener('click', () => { const generated = slugify(value('title')); form.elements.slug.value = generated; slugManuallyEdited = false; setStatus(generated ? 'Slug generated from the title.' : 'Add a title first.'); renderPreview(); });
  form.elements.slug?.addEventListener('input', () => { slugManuallyEdited = true; renderPreview(); }); form.elements.title?.addEventListener('input', () => { if (!slugManuallyEdited) form.elements.slug.value = slugify(value('title')); renderPreview(); });
  form.querySelectorAll('input[name], textarea[name], select[name]').forEach((field) => { field.addEventListener('input', renderPreview); field.addEventListener('change', renderPreview); });
  document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => { const type = button.dataset.add; if (type === 'input') addInput(); if (type === 'result') addResult(); if (type === 'tool') addTool(); if (type === 'step') addStep(); if (type === 'tip') addTip(); if (type === 'tag') addTag(); if (type === 'related') addRelated(); placeAddButtons(); renderPreview(); }));
  document.querySelectorAll('[data-file-role]').forEach((file) => file.addEventListener('change', () => { const selected = file.files?.[0]; if (!selected) return; const role = file.dataset.fileRole; const input = form.elements[role]; if (input) input.value = `/images/${selected.name.replace(/[^a-zA-Z0-9._-]+/g, '-').toLowerCase()}`; showLocalPreview(document.querySelector(`[data-preview-role="${role}"]`), selected); renderPreview(); }));
  document.querySelector('#save-draft')?.addEventListener('click', () => { localStorage.setItem(storageKey, JSON.stringify(readForm())); setStatus('Draft saved in this browser.'); });
  document.querySelector('#clear-draft')?.addEventListener('click', () => { localStorage.removeItem(storageKey); form.reset(); slugManuallyEdited = false; restoreRepeats(); setStatus('Draft cleared.'); renderPreview(); });
  form.addEventListener('submit', (event) => { event.preventDefault(); if (!form.reportValidity()) return; const d = readForm(); const blob = new Blob([makeMarkdown(d)], { type: 'text/markdown;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `${d.slug || slugify(d.title) || 'resource'}.md`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); localStorage.setItem(storageKey, JSON.stringify(d)); setStatus('Resource file downloaded.'); });

  try { const saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); if (saved) { writeForm(saved); setStatus('Saved draft restored.'); } else restoreRepeats(); } catch { restoreRepeats(); }
  if (form.elements.date && !form.elements.date.value) form.elements.date.value = new Date().toISOString().slice(0, 10);
  ensureMinimums(); placeAddButtons(); renderPreview();
})();
