(() => {
  const form = document.querySelector('#resource-form');
  if (!form) return;

  const preview = document.querySelector('#preview-content');
  const status = document.querySelector('#status');
  const storageKey = 'skill-foundry-resource-draft-v6';
  const esc = v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  const quote = v => JSON.stringify(String(v ?? ''));
  const slugify = v => String(v || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  const val = n => form.elements[n]?.value || '';
  const setStatus = m => { if (status) status.textContent = m; };
  let slugManual = false;
  let uploadBusy = 0;

  // These legacy core fields are represented by the repeatable Tools section.
  ['tool', 'toolUrl', 'toolAffiliate'].forEach(n => {
    const field = form.elements[n];
    if (field) {
      field.required = false;
      field.closest('label')?.setAttribute('hidden', '');
    }
  });

  const style = document.createElement('style');
  style.textContent = `
    .builder-page textarea{resize:none!important}
    .builder-page .repeat-add-button{display:grid!important;place-items:center;width:36px!important;height:36px!important;min-width:36px!important;min-height:36px!important;padding:0!important;margin-top:10px;border-radius:50%!important;font-size:20px!important;line-height:1}
    .builder-page .media-item{padding-bottom:14px}
    .builder-page .media-control{display:grid;gap:8px}
    .builder-page .media-control .upload-row,.builder-page .image-field .upload-row{display:grid;grid-template-columns:minmax(0,1fr) 88px;gap:8px;align-items:stretch;width:100%}
    .builder-page .media-control .file-button,.builder-page .image-field .file-button{width:88px;min-width:88px;font-size:0}
    .builder-page .media-control .file-button::after,.builder-page .image-field .file-button::after{content:'Select';font-size:12px}
    .builder-page .repeat-item input,.builder-page .repeat-item textarea{background:rgba(7,17,31,.75)!important;color:var(--text)!important;border:1px solid var(--line)!important}
    .builder-page .upload-state{font-size:11px;color:var(--muted)}
    .builder-page .upload-state.success{color:var(--accent)}
    .builder-page .upload-state.error{color:#ff9b9b}
    .builder-page .tool-logo-preview{display:flex;align-items:center;gap:8px;margin-top:6px}
    .builder-page .tool-logo-preview img{width:32px;height:32px;object-fit:contain;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.035)}
    .builder-page .image-preview{position:relative}
    .builder-page .image-clear{position:absolute;top:18px;right:18px;display:grid;place-items:center;width:30px;height:30px;min-width:30px;min-height:30px;padding:0;border:1px solid var(--line);border-radius:50%;background:rgba(7,17,31,.9);color:var(--muted);font:inherit;font-size:18px;font-weight:500;line-height:1;cursor:pointer;z-index:2}
    .builder-page .image-clear:hover,.builder-page .image-clear:focus-visible{border-color:rgba(255,100,100,.5);color:#ff9b9b;background:rgba(255,100,100,.95);outline:none}
    @media(max-width:420px){.builder-page .media-control .upload-row,.builder-page .image-field .upload-row{grid-template-columns:minmax(0,1fr) 78px}.builder-page .media-control .file-button,.builder-page .image-field .file-button{width:78px;min-width:78px}}
  `;
  document.head.appendChild(style);

  const remove = () => '<button class="remove-button" type="button" aria-label="Remove item" title="Remove item">×</button>';
  const state = () => '<div class="upload-state" data-upload-state aria-live="polite"></div>';
  const clearButton = () => '<button class="image-clear" type="button" aria-label="Remove selected image" title="Remove selected image">×</button>';
  const media = (role, placeholder) => `<div class="media-control"><div class="upload-row"><input data-role="${role}" class="path-input" placeholder="${placeholder}" /><label class="file-button"><input type="file" accept="image/*" data-file-role="${role}" />Select</label></div>${state()}<div class="image-preview" data-preview-role="${role}">${clearButton()}</div></div>`;

  const localPreview = (target, file) => {
    if (!target || !file) return;
    const old = target.dataset.objectUrl;
    if (old) URL.revokeObjectURL(old);
    const url = URL.createObjectURL(file);
    target.dataset.objectUrl = url;
    target.classList.add('has-image');
    target.innerHTML = `${clearButton()}<img src="${url}" alt="Selected image preview"><span>${esc(file.name)}</span>`;
  };

  const pathPreview = (target, path) => {
    if (!target || !path) return;
    target.classList.add('has-image');
    target.innerHTML = `${clearButton()}<img src="${esc(path)}" alt="Image preview" onerror="this.closest('.image-preview')?.classList.remove('has-image')"><span>Preview</span>`;
  };

  const uploadState = (target, message, kind = '') => {
    if (target) {
      target.textContent = message;
      target.className = `upload-state${kind ? ` ${kind}` : ''}`;
    }
  };

  const clearPreview = (target, input, fileInput, stateEl) => {
    if (!target) return;
    const old = target.dataset.objectUrl;
    if (old) {
      URL.revokeObjectURL(old);
      delete target.dataset.objectUrl;
    }
    target.classList.remove('has-image');
    target.innerHTML = clearButton();
    if (input) input.value = '';
    if (fileInput) fileInput.value = '';
    uploadState(stateEl, '');
  };

  // Static thumbnail/hero images keep their existing direct-upload behavior.
  const uploadStatic = async (file, input, prev, st) => {
    uploadBusy++;
    uploadState(st, 'Uploading…');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90000);
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': file.type || 'application/octet-stream', 'X-File-Name': encodeURIComponent(file.name) },
        body: file,
        credentials: 'same-origin',
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.path) throw new Error(data.error || `Image upload failed (${response.status || 'network error'}).`);
      if (input) input.value = data.path;
      pathPreview(prev, data.path);
      uploadState(st, 'Uploaded to website', 'success');
      render();
      return data.path;
    } catch (error) {
      localPreview(prev, file);
      uploadState(st, error?.name === 'AbortError' ? 'Upload timed out. Please try a smaller image.' : error?.message || 'Upload failed.', 'error');
      return '';
    } finally {
      clearTimeout(timer);
      uploadBusy--;
    }
  };

  const logo = async (url, item) => {
    const target = item?.querySelector('[data-tool-logo-preview]');
    if (!target || !url) return;
    try {
      const response = await fetch(`/api/tool-logo?url=${encodeURIComponent(url)}`, { credentials: 'same-origin' });
      const data = await response.json();
      target.innerHTML = response.ok && data.logoUrl ? `<img src="${esc(data.logoUrl)}" alt=""><span>Logo detected automatically</span>` : '';
    } catch {
      target.innerHTML = '';
    }
  };

  const bindClear = root => root?.querySelectorAll('.image-clear').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    const target = button.closest('.image-preview');
    const item = button.closest('.media-item,.image-field');
    const role = target?.dataset.previewRole || target?.dataset.preview;
    const input = role ? (item?.querySelector(`[data-role="${role}"]`) || form.elements[role]) : null;
    const fileInput = role ? item?.querySelector(`[data-file-role="${role}"],[data-image-file="${role}"]`) : null;
    const stateEl = item?.querySelector('[data-upload-state],.upload-state');
    clearPreview(target, input, fileInput, stateEl);
    render();
  }));

  const bind = item => {
    item.querySelector('.remove-button')?.addEventListener('click', () => {
      const list = item.parentElement;
      const minimum = list?.dataset.minimum === '1';
      if (minimum && list.children.length === 1) {
        item.querySelectorAll('input,textarea').forEach(field => {
          if (field.type === 'checkbox') field.checked = false;
          else if (field.type !== 'file') field.value = '';
        });
        item.querySelectorAll('.image-preview').forEach(target => {
          const old = target.dataset.objectUrl;
          if (old) URL.revokeObjectURL(old);
          target.classList.remove('has-image');
          target.innerHTML = clearButton();
        });
      } else {
        item.remove();
      }
      place();
      render();
    });

    item.querySelectorAll('input:not([type="file"]),textarea,select').forEach(field => {
      field.addEventListener('input', render);
      field.addEventListener('change', render);
    });

    // IMPORTANT: Input/Output file inputs are intentionally NOT given an upload
    // listener here. image-ratio-ui.js owns their change event so selecting a
    // file always opens the ratio popup first and never uploads immediately.
    item.querySelectorAll('[data-file-role="input"],[data-file-role="result"]').forEach(fileInput => {
      fileInput.addEventListener('click', () => {
        const old = fileInput.dataset.sfLastSelection;
        if (old) fileInput.value = '';
      });
    });

    bindClear(item);

    const toolUrl = item.querySelector('[data-role="tool-url"]');
    if (toolUrl) {
      toolUrl.addEventListener('change', () => logo(toolUrl.value.trim(), item));
      toolUrl.addEventListener('blur', () => logo(toolUrl.value.trim(), item));
    }
  };

  const addInput = (value = '') => {
    const item = document.createElement('div');
    item.className = 'repeat-item media-item';
    item.innerHTML = `<div><label>Input image</label>${media('input', 'https://.../input.jpg or /images/input.jpg')}</div>${remove()}`;
    item.querySelector('[data-role="input"]').value = value;
    document.querySelector('#inputs-list').appendChild(item);
    bind(item);
    if (value) pathPreview(item.querySelector('[data-preview-role="input"]'), value);
  };

  const addResult = (value = '') => {
    const item = document.createElement('div');
    item.className = 'repeat-item media-item';
    item.innerHTML = `<div><label>Output image</label>${media('result', 'https://.../result.jpg or /images/result.jpg')}</div>${remove()}`;
    item.querySelector('[data-role="result"]').value = value;
    document.querySelector('#results-list').appendChild(item);
    bind(item);
    if (value) pathPreview(item.querySelector('[data-preview-role="result"]'), value);
  };

  const addTool = (data = {}) => {
    const item = document.createElement('div');
    item.className = 'repeat-item tool';
    item.innerHTML = `<label>Tool name<input data-role="tool-name" placeholder="e.g. ChatGPT" /></label><label>Purpose<input data-role="tool-purpose" placeholder="What this tool was used for" /></label><label>Website URL<input data-role="tool-url" type="url" placeholder="https://..." /><div class="tool-logo-preview" data-tool-logo-preview></div></label><label class="check-inline compact"><input data-role="tool-affiliate" type="checkbox" /> Affiliate link</label>${remove()}`;
    item.querySelector('[data-role="tool-name"]').value = data.name || '';
    item.querySelector('[data-role="tool-purpose"]').value = data.purpose || '';
    item.querySelector('[data-role="tool-url"]').value = data.url || '';
    item.querySelector('[data-role="tool-affiliate"]').checked = !!data.affiliate;
    document.querySelector('#tools-list').appendChild(item);
    bind(item);
    if (data.url) logo(data.url, item);
  };

  const addStep = (data = {}) => {
    const item = document.createElement('div');
    item.className = 'repeat-item step';
    item.innerHTML = `<label>Step title<input data-role="step-title" placeholder="Prepare the input" /></label><label>Description<textarea data-role="step-description" rows="3" placeholder="Describe what to do and what to look for."></textarea></label>${remove()}`;
    item.querySelector('[data-role="step-title"]').value = data.title || '';
    item.querySelector('[data-role="step-description"]').value = data.description || '';
    document.querySelector('#steps-list').appendChild(item);
    bind(item);
  };

  const addTip = (value = '') => {
    const item = document.createElement('div');
    item.className = 'repeat-item';
    item.innerHTML = `<textarea data-role="tip" rows="3" aria-label="Tip" placeholder="Keep the main subject clearly described."></textarea>${remove()}`;
    item.querySelector('textarea').value = value;
    document.querySelector('#tips-list').appendChild(item);
    bind(item);
  };

  const addTag = (value = '') => {
    const item = document.createElement('div');
    item.className = 'repeat-item';
    item.innerHTML = `<input data-role="tag" aria-label="Tag" placeholder="image-generation" />${remove()}`;
    item.querySelector('input').value = value;
    document.querySelector('#tags-list').appendChild(item);
    bind(item);
  };

  const addRelated = (value = '') => {
    const item = document.createElement('div');
    item.className = 'repeat-item';
    item.innerHTML = `<input data-role="related" aria-label="Related resource slug" placeholder="ai-video-cinematic-prompt" />${remove()}`;
    item.querySelector('input').value = value;
    document.querySelector('#related-list').appendChild(item);
    bind(item);
  };

  const cfg = [
    ['inputs-list', addInput], ['results-list', addResult], ['tools-list', addTool],
    ['steps-list', addStep], ['tips-list', addTip], ['tags-list', addTag], ['related-list', addRelated]
  ];
  cfg.forEach(([id]) => {
    const list = document.querySelector('#' + id);
    if (list) list.dataset.minimum = '1';
  });

  const place = () => document.querySelectorAll('[data-add]').forEach(button => {
    const type = button.dataset.add;
    const id = type === 'input' ? 'inputs-list' : type === 'result' ? 'results-list' : `${type}s-list`;
    const list = document.querySelector('#' + id);
    if (list) {
      list.insertAdjacentElement('afterend', button);
      button.classList.add('repeat-add-button');
    }
  });

  const collect = () => ({
    inputs: [...document.querySelectorAll('[data-role="input"]')].map(x => x.value.trim()).filter(Boolean),
    results: [...document.querySelectorAll('[data-role="result"]')].map(x => x.value.trim()).filter(Boolean),
    tools: [...document.querySelectorAll('#tools-list .repeat-item')].map(item => ({
      name: item.querySelector('[data-role="tool-name"]').value.trim(),
      purpose: item.querySelector('[data-role="tool-purpose"]').value.trim(),
      url: item.querySelector('[data-role="tool-url"]').value.trim(),
      affiliate: item.querySelector('[data-role="tool-affiliate"]').checked
    })).filter(x => x.name || x.purpose || x.url),
    steps: [...document.querySelectorAll('#steps-list .repeat-item')].map(item => ({
      title: item.querySelector('[data-role="step-title"]').value.trim(),
      description: item.querySelector('[data-role="step-description"]').value.trim()
    })).filter(x => x.title || x.description),
    tips: [...document.querySelectorAll('[data-role="tip"]')].map(x => x.value.trim()).filter(Boolean),
    tags: [...document.querySelectorAll('[data-role="tag"]')].map(x => x.value.trim()).filter(Boolean),
    related: [...document.querySelectorAll('[data-role="related"]')].map(x => x.value.trim()).filter(Boolean)
  });

  const read = () => {
    const data = {};
    form.querySelectorAll('input[name],textarea[name],select[name]').forEach(field => {
      data[field.name] = field.type === 'checkbox' ? field.checked : field.value;
    });
    data.repeat = collect();
    return data;
  };

  const render = () => {
    const data = read();
    const repeat = data.repeat;
    const firstTool = repeat.tools[0];
    let html = `<h3>${esc(data.title || 'Untitled resource')}</h3><p class="preview-meta">${esc(data.category || 'Category')} · ${esc(firstTool?.name || 'Tool used')}${data.date ? ` · Published ${esc(data.date)}` : ''}</p>`;
    if (data.heroImage) html += `<img class="preview-image" src="${esc(data.heroImage)}" alt="${esc(data.imageAlt || data.title || 'Resource image')}" />`;
    html += `<p class="preview-copy">${esc(data.description || 'Add a description to see it here.')}</p>`;
    if (data.intro) html += `<h4>Introduction</h4><p class="preview-copy">${esc(data.intro)}</p>`;
    if (data.whatItDoes) html += `<h4>What this resource does</h4><p class="preview-copy">${esc(data.whatItDoes)}</p>`;
    if (repeat.tools.length) html += `<h4>Tools used</h4><div class="preview-tools">${repeat.tools.map(x => `<div class="preview-tool"><strong>${esc(x.name || 'Unnamed tool')}</strong><span>${esc(x.purpose || 'Purpose not added')}</span></div>`).join('')}</div>`;
    if (data.prompt) html += `<h4>Prompt</h4><div class="preview-prompt">${esc(data.prompt)}</div>`;
    preview.innerHTML = html;
  };

  const list = values => `[${values.map(quote).join(', ')}]`;
  const markdown = data => {
    const repeat = data.repeat;
    const firstTool = repeat.tools[0] || { name: '', url: '', affiliate: false };
    const lines = [
      '---',
      `title: ${quote(data.title)}`,
      `slug: ${quote(data.slug || slugify(data.title))}`,
      `description: ${quote(data.description)}`,
      `category: ${quote(data.category)}`,
      `tool: ${quote(firstTool.name)}`,
      `toolUrl: ${firstTool.url ? quote(firstTool.url) : 'null'}`,
      `toolAffiliate: ${firstTool.affiliate ? 'true' : 'false'}`,
      `date: ${quote(data.date)}`,
      `thumbnail: ${data.thumbnail ? quote(data.thumbnail) : 'null'}`,
      `thumbnailRatio: ${quote('16:9')}`,
      `heroImage: ${data.heroImage ? quote(data.heroImage) : 'null'}`,
      `inputImage: ${repeat.inputs[0] ? quote(repeat.inputs[0]) : 'null'}`,
      `inputImages: ${list(repeat.inputs)}`,
      `inputImageRatios: ${list(repeat.inputs.map(() => 'original'))}`,
      `resultImages: ${list(repeat.results)}`,
      `resultImageRatios: ${list(repeat.results.map(() => 'original'))}`,
      `imageAlt: ${data.imageAlt ? quote(data.imageAlt) : 'null'}`,
      `intro: ${data.intro ? quote(data.intro) : '""'}`,
      `whatItDoes: ${data.whatItDoes ? quote(data.whatItDoes) : '""'}`,
      'toolsUsed:'
    ];
    if (repeat.tools.length) repeat.tools.forEach(x => lines.push(`  - name: ${quote(x.name)}`, `    purpose: ${quote(x.purpose)}`, `    url: ${x.url ? quote(x.url) : 'null'}`, `    affiliate: ${x.affiliate ? 'true' : 'false'}`));
    else lines.push('  []');
    lines.push(`prompt: ${quote(data.prompt)}`, `videoEmbedUrl: ${data.videoEmbedUrl ? quote(data.videoEmbedUrl) : 'null'}`, `originalVideoUrl: ${data.originalVideoUrl ? quote(data.originalVideoUrl) : 'null'}`, 'steps:');
    if (repeat.steps.length) repeat.steps.forEach(x => lines.push(`  - title: ${quote(x.title)}`, `    description: ${quote(x.description)}`));
    else lines.push('  []');
    lines.push('tips:');
    if (repeat.tips.length) repeat.tips.forEach(x => lines.push(`  - ${quote(x)}`));
    else lines.push('  []');
    lines.push(`relatedResources: ${list(repeat.related)}`, `tags: ${list(repeat.tags)}`, `seoTitle: ${data.seoTitle ? quote(data.seoTitle) : 'null'}`, `seoDescription: ${data.seoDescription ? quote(data.seoDescription) : 'null'}`, `featured: ${data.featured ? 'true' : 'false'}`, '---', '', data.intro || '', '', data.whatItDoes || '', '', data.prompt ? `## Prompt\n\n${data.prompt}` : '', '');
    return lines.join('\n');
  };

  const restore = (repeat = {}, legacy = {}) => {
    cfg.forEach(([id]) => { const list = document.querySelector('#' + id); if (list) list.innerHTML = ''; });
    const oldTool = legacy.tool ? { name: legacy.tool, purpose: 'Primary tool/model used for this resource.', url: legacy.toolUrl || '', affiliate: !!legacy.toolAffiliate } : null;
    (repeat.inputs?.length ? repeat.inputs : ['']).forEach(addInput);
    (repeat.results?.length ? repeat.results : ['']).forEach(addResult);
    (repeat.tools?.length ? repeat.tools : oldTool ? [oldTool] : [{}]).forEach(addTool);
    (repeat.steps?.length ? repeat.steps : [{}]).forEach(addStep);
    (repeat.tips?.length ? repeat.tips : ['']).forEach(addTip);
    (repeat.tags?.length ? repeat.tags : ['']).forEach(addTag);
    (repeat.related?.length ? repeat.related : ['']).forEach(addRelated);
    place();
  };

  const write = data => {
    form.querySelectorAll('input[name],textarea[name],select[name]').forEach(field => {
      if (!(field.name in data)) return;
      if (field.type === 'checkbox') field.checked = !!data[field.name];
      else field.value = data[field.name] ?? '';
    });
    slugManual = !!data.slug;
    restore(data.repeat || {}, data);
  };

  const bindStatic = fileInput => fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const role = fileInput.dataset.imageFile;
    const input = form.elements[role];
    const box = fileInput.closest('.image-field');
    const previewBox = box?.querySelector(`[data-preview="${role}"]`);
    let stateBox = box?.querySelector('[data-upload-state]');
    if (!stateBox) {
      stateBox = document.createElement('div');
      stateBox.className = 'upload-state';
      stateBox.dataset.uploadState = '';
      fileInput.closest('.upload-row')?.insertAdjacentElement('afterend', stateBox);
    }
    localPreview(previewBox, file);
    bindClear(box);
    await uploadStatic(file, input, previewBox, stateBox);
  });

  const bindStaticClear = () => document.querySelectorAll('.image-field').forEach(box => {
    const role = box.querySelector('[data-image-file]')?.dataset.imageFile;
    if (!role) return;
    const previewBox = box.querySelector(`[data-preview="${role}"]`);
    const input = form.elements[role];
    const fileInput = box.querySelector('[data-image-file]');
    if (previewBox && !previewBox.querySelector('.image-clear')) previewBox.innerHTML = clearButton();
    bindClear(box);
    if (input?.value) pathPreview(previewBox, input.value);
  });

  document.querySelector('#make-slug')?.addEventListener('click', () => {
    const generated = slugify(val('title'));
    form.elements.slug.value = generated;
    slugManual = false;
    setStatus(generated ? 'Slug generated from the title.' : 'Add a title first.');
    render();
  });
  form.elements.slug?.addEventListener('input', () => { slugManual = true; render(); });
  form.elements.title?.addEventListener('input', () => { if (!slugManual) form.elements.slug.value = slugify(val('title')); render(); });
  form.querySelectorAll('input[name],textarea[name],select[name]').forEach(field => {
    field.addEventListener('input', render);
    field.addEventListener('change', render);
  });

  document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => {
    const type = button.dataset.add;
    if (type === 'input') addInput();
    else if (type === 'result') addResult();
    else if (type === 'tool') addTool();
    else if (type === 'step') addStep();
    else if (type === 'tip') addTip();
    else if (type === 'tag') addTag();
    else addRelated();
    place();
    render();
  }));

  document.querySelectorAll('[data-image-file]').forEach(bindStatic);

  document.querySelector('#save-draft')?.addEventListener('click', () => {
    localStorage.setItem(storageKey, JSON.stringify(read()));
    setStatus('Draft saved in this browser.');
  });

  document.querySelector('#clear-draft')?.addEventListener('click', () => {
    localStorage.removeItem(storageKey);
    form.reset();
    slugManual = false;
    restore();
    bindStaticClear();
    setStatus('Draft cleared.');
    render();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (uploadBusy) {
      setStatus('Please wait for image uploads to finish.');
      return;
    }
    if (!form.reportValidity()) return;
    const data = read();
    const blob = new Blob([markdown(data)], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.slug || slugify(data.title) || 'resource'}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    localStorage.setItem(storageKey, JSON.stringify(data));
    setStatus('Resource file downloaded. Uploaded images are stored in GitHub.');
  });

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved) {
      write(saved);
      setStatus('Saved draft restored.');
    } else {
      restore();
    }
  } catch {
    restore();
  }

  if (form.elements.date && !form.elements.date.value) form.elements.date.value = new Date().toISOString().slice(0, 10);
  bindStaticClear();
  place();
  render();
})();