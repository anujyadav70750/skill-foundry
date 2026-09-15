(() => {
  const form = document.querySelector('#resource-form');
  if (!form) return;

  const status = document.querySelector('#status');
  const quote = value => JSON.stringify(String(value ?? ''));
  const slugify = value => String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  const list = values => `[${values.map(quote).join(', ')}]`;
  const setStatus = message => { if (status) status.textContent = message; };
  const parseJsonMarker = (value, marker) => {
    const text = String(value || '').trim();
    if (!text.startsWith(marker)) return null;
    try { return JSON.parse(text.slice(marker.length)); } catch { return null; }
  };

  const normalizeTutorialUrl = value => {
    let url = String(value || '').trim();
    if (!url) return '';
    const iframe = url.match(/<iframe[^>]+src=[\"']([^\"']+)[\"']/i);
    if (iframe) url = iframe[1];
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
      if (host === 'youtu.be') {
        const id = parsed.pathname.split('/').filter(Boolean)[0];
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }
      if (host === 'youtube.com' || host === 'm.youtube.com') {
        if (parsed.pathname === '/watch') {
          const id = parsed.searchParams.get('v');
          return id ? `https://www.youtube.com/embed/${id}` : url;
        }
        if (parsed.pathname.startsWith('/shorts/')) {
          const id = parsed.pathname.split('/')[2];
          return id ? `https://www.youtube.com/embed/${id}` : url;
        }
        if (parsed.pathname.startsWith('/embed/')) return url;
      }
    } catch {}
    return url;
  };

  const originalTutorialUrl = value => {
    const embed = normalizeTutorialUrl(value);
    try {
      const parsed = new URL(embed);
      const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
      if (host === 'youtube.com' && parsed.pathname.startsWith('/embed/')) {
        const id = parsed.pathname.split('/')[2];
        return id ? `https://www.youtube.com/watch?v=${id}` : '';
      }
    } catch {}
    return '';
  };

  const style = document.createElement('style');
  style.textContent = `
    .sf-structured-workflow{display:grid;gap:12px;padding:14px;border:1px solid var(--line);border-radius:14px;background:rgba(16,34,56,.28)}
    .sf-structured-heading{display:flex;align-items:center;justify-content:space-between;gap:10px}
    .sf-structured-heading strong{font-size:12px}
    .sf-structured-heading span{font-size:10px;color:var(--muted);line-height:1.35}
    .sf-input-row,.sf-setting-row{display:grid;grid-template-columns:100px minmax(0,1fr);gap:8px;align-items:start;padding:10px;border:1px solid var(--line);border-radius:12px;background:rgba(7,17,31,.55)}
    .sf-input-row{grid-template-columns:92px minmax(0,1fr) 34px}
    .sf-input-fields,.sf-setting-fields{display:grid;gap:7px;min-width:0}
    .sf-input-fields .sf-input-top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:7px}
    .sf-structured-workflow select,.sf-structured-workflow input{width:100%;min-width:0}
    .sf-remove-row{width:34px!important;height:34px!important;min-width:34px!important;padding:0!important;border-radius:50%!important}
    .sf-add-row{width:max-content!important;min-height:34px!important;padding:7px 12px!important;border-radius:10px!important}
    .sf-workflow-subheading{font-size:9px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}
    @media(max-width:520px){.sf-input-row{grid-template-columns:1fr 34px}.sf-input-fields .sf-input-top{grid-template-columns:1fr}.sf-input-row select{grid-column:1/-1}}
  `;
  document.head.appendChild(style);

  const prepareAdmin = () => {
    const tutorial = form.elements.videoEmbedUrl;
    const original = form.elements.originalVideoUrl;
    if (tutorial) {
      tutorial.type = 'text';
      tutorial.placeholder = 'Paste the YouTube / tutorial URL';
      const label = tutorial.closest('label');
      if (label?.firstChild?.nodeType === Node.TEXT_NODE) label.firstChild.nodeValue = 'Tutorial URL';
    }
    if (original) {
      const label = original.closest('label');
      if (label) label.hidden = true;
    }
    form.querySelectorAll('[data-role="tool-affiliate"]').forEach(input => {
      input.checked = false;
      const label = input.closest('label');
      if (label) label.remove();
    });
  };

  const inputTypes = ['image', 'video', 'audio', 'text', 'document'];
  const makeInputRow = data => {
    const row = document.createElement('div');
    row.className = 'sf-input-row';
    row.dataset.workflowInput = '1';
    row.innerHTML = `<select data-role="workflow-input-type" aria-label="Input type">${inputTypes.map(type => `<option value="${type}">${type.toUpperCase()}</option>`).join('')}</select><div class="sf-input-fields"><div class="sf-input-top"><input data-role="workflow-input-label" placeholder="Input label e.g. Character reference" /><input data-role="workflow-input-role" placeholder="Role e.g. Identity reference" /></div><input data-role="workflow-input-value" placeholder="Text, URL, path, or description" /><input data-role="workflow-input-src" placeholder="Media path / URL (for IMAGE or VIDEO)" /></div><button type="button" class="remove-button sf-remove-row" aria-label="Remove input">×</button>`;
    row.querySelector('[data-role="workflow-input-type"]').value = data.type || 'image';
    row.querySelector('[data-role="workflow-input-label"]').value = data.label || '';
    row.querySelector('[data-role="workflow-input-role"]').value = data.role || '';
    row.querySelector('[data-role="workflow-input-value"]').value = data.value || '';
    row.querySelector('[data-role="workflow-input-src"]').value = data.src || '';
    row.querySelector('.sf-remove-row').addEventListener('click', () => { row.remove(); });
    return row;
  };

  const makeSettingRow = data => {
    const row = document.createElement('div');
    row.className = 'sf-setting-row';
    row.dataset.workflowSetting = '1';
    row.innerHTML = `<div class="sf-setting-fields"><input data-role="workflow-setting-label" placeholder="Setting e.g. Model" /><input data-role="workflow-setting-value" placeholder="Value e.g. Nano Banana Pro" /></div><button type="button" class="remove-button sf-remove-row" aria-label="Remove setting">×</button>`;
    row.querySelector('[data-role="workflow-setting-label"]').value = data.label || '';
    row.querySelector('[data-role="workflow-setting-value"]').value = data.value || '';
    row.querySelector('.sf-remove-row').addEventListener('click', () => row.remove());
    return row;
  };

  const enhanceStep = item => {
    if (!item || item.dataset.sfStructured === '1') return;
    const editor = item.querySelector('.workflow-editor');
    if (!editor) return;
    item.dataset.sfStructured = '1';
    const tool = item.querySelector('[data-role="step-tool"]');
    const input = item.querySelector('[data-role="step-input"]');
    const process = item.querySelector('[data-role="step-process"]');
    const legacyInputs = parseJsonMarker(input?.value, '[[SF_INPUTS]]') || [];
    const legacySettings = parseJsonMarker(process?.value, '[[SF_SETTINGS]]') || [];
    if (input) input.closest('.workflow-field')?.setAttribute('hidden', '');
    const purpose = document.createElement('label');
    purpose.className = 'workflow-field';
    purpose.innerHTML = 'Tool purpose<input data-role="step-tool-purpose" placeholder="Why this tool is used in this step" />';
    editor.insertBefore(purpose, input?.closest('.workflow-field') || null);

    const box = document.createElement('div');
    box.className = 'sf-structured-workflow';
    box.innerHTML = `<div class="sf-structured-heading"><div><div class="sf-workflow-subheading">STEP INPUTS</div><span>Define every input by type and role. Inputs can be image, video, audio, text, or document.</span></div><button type="button" class="button sf-add-row">+ Add input</button></div><div class="sf-input-list"></div><div class="sf-structured-heading"><div><div class="sf-workflow-subheading">STEP SETTINGS</div><span>Optional settings used to create this step's output.</span></div><button type="button" class="button sf-add-row">+ Add setting</button></div><div class="sf-setting-list"></div>`;
    const inputList = box.querySelector('.sf-input-list');
    const settingList = box.querySelector('.sf-setting-list');
    const addInput = data => inputList.append(makeInputRow(data));
    const addSetting = data => settingList.append(makeSettingRow(data));
    (legacyInputs.length ? legacyInputs : [{ type: 'image', label: '', role: '', value: '', src: '' }]).forEach(addInput);
    legacySettings.forEach(addSetting);
    box.querySelectorAll('.sf-add-row')[0].addEventListener('click', () => addInput({ type: 'image' }));
    box.querySelectorAll('.sf-add-row')[1].addEventListener('click', () => addSetting({}));
    editor.insertBefore(box, process?.closest('.workflow-field') || null);
    if (tool && !purpose.querySelector('input').value) purpose.querySelector('input').value = item.dataset.toolPurpose || '';
  };

  const enhanceAll = () => document.querySelectorAll('#steps-list .repeat-item.step').forEach(enhanceStep);

  const collectStructuredInputs = item => {
    const rows = [...item.querySelectorAll('[data-workflow-input]')];
    if (rows.length) return rows.map(row => ({
      type: row.querySelector('[data-role="workflow-input-type"]')?.value || 'text',
      label: row.querySelector('[data-role="workflow-input-label"]')?.value.trim() || '',
      role: row.querySelector('[data-role="workflow-input-role"]')?.value.trim() || '',
      value: row.querySelector('[data-role="workflow-input-value"]')?.value.trim() || '',
      src: row.querySelector('[data-role="workflow-input-src"]')?.value.trim() || ''
    })).filter(x => x.label || x.role || x.value || x.src);
    const legacy = item.querySelector('[data-role="step-input"]')?.value.trim() || '';
    return parseJsonMarker(legacy, '[[SF_INPUTS]]') || [];
  };

  const collectStructuredSettings = item => {
    const rows = [...item.querySelectorAll('[data-workflow-setting]')];
    if (rows.length) return rows.map(row => ({
      label: row.querySelector('[data-role="workflow-setting-label"]')?.value.trim() || '',
      value: row.querySelector('[data-role="workflow-setting-value"]')?.value.trim() || ''
    })).filter(x => x.label || x.value);
    const legacy = item.querySelector('[data-role="step-process"]')?.value.trim() || '';
    return parseJsonMarker(legacy, '[[SF_SETTINGS]]') || [];
  };

  const collect = () => ({
    inputs: [...document.querySelectorAll('[data-role="input"]')].map(x => x.value.trim()).filter(Boolean),
    results: [...document.querySelectorAll('[data-role="result"]')].map(x => x.value.trim()).filter(Boolean),
    tools: [...document.querySelectorAll('#tools-list .repeat-item')].map(item => ({
      name: item.querySelector('[data-role="tool-name"]')?.value.trim() || '',
      purpose: item.querySelector('[data-role="tool-purpose"]')?.value.trim() || '',
      url: item.querySelector('[data-role="tool-url"]')?.value.trim() || ''
    })).filter(x => x.name || x.purpose || x.url),
    steps: [...document.querySelectorAll('#steps-list .repeat-item')].map(item => ({
      title: item.querySelector('[data-role="step-title"]')?.value.trim() || '',
      tool: item.querySelector('[data-role="step-tool"]')?.value.trim() || '',
      toolPurpose: item.querySelector('[data-role="step-tool-purpose"]')?.value.trim() || '',
      input: item.querySelector('[data-role="step-input"]')?.value.trim() || '',
      inputs: collectStructuredInputs(item),
      settings: collectStructuredSettings(item),
      process: item.querySelector('[data-role="step-process"]')?.value.trim() || '',
      output: item.querySelector('[data-role="step-output"]')?.value.trim() || '',
      next: item.querySelector('[data-role="step-next"]')?.value.trim() || '',
      description: item.querySelector('[data-role="step-description"]')?.value.trim() || ''
    })).filter(x => x.title || x.tool || x.input || x.inputs.length || x.settings.length || x.process || x.output || x.next || x.description),
    tips: [...document.querySelectorAll('[data-role="tip"]')].map(x => x.value.trim()).filter(Boolean),
    tags: [...document.querySelectorAll('[data-role="tag"]')].map(x => x.value.trim()).filter(Boolean),
    related: [...document.querySelectorAll('[data-role="related"]')].map(x => x.value.trim()).filter(Boolean)
  });

  const workflowDescription = step => {
    const parts = [step.tool && `Tool: ${step.tool}`, step.input && `Input: ${step.input}`, step.process && `Process: ${step.process}`, step.output && `Output: ${step.output}`, step.next && `Next: ${step.next}`].filter(Boolean);
    return parts.join('\n\n') || step.description || '';
  };

  const markdown = data => {
    const repeat = data.repeat;
    const firstTool = repeat.tools[0] || { name: '', url: '' };
    const tutorial = normalizeTutorialUrl(data.videoEmbedUrl);
    const originalTutorial = data.originalVideoUrl || originalTutorialUrl(data.videoEmbedUrl);
    const lines = ['---', `title: ${quote(data.title)}`, `slug: ${quote(data.slug || slugify(data.title))}`, `description: ${quote(data.description)}`, `category: ${quote(data.category)}`, `tool: ${quote(firstTool.name)}`, `toolUrl: ${firstTool.url ? quote(firstTool.url) : 'null'}`, 'toolAffiliate: false', `date: ${quote(data.date)}`, `thumbnail: ${data.thumbnail ? quote(data.thumbnail) : 'null'}`, `thumbnailRatio: ${quote('16:9')}`, `heroImage: ${data.heroImage ? quote(data.heroImage) : 'null'}`, `inputImage: ${repeat.inputs[0] ? quote(repeat.inputs[0]) : 'null'}`, `inputImages: ${list(repeat.inputs)}`, `inputImageRatios: ${list(repeat.inputs.map(() => 'original'))}`, `resultImages: ${list(repeat.results)}`, `resultImageRatios: ${list(repeat.results.map(() => 'original'))}`, `imageAlt: ${data.imageAlt ? quote(data.imageAlt) : 'null'}`, `intro: ${data.intro ? quote(data.intro) : '\"\"'}`, `whatItDoes: ${data.whatItDoes ? quote(data.whatItDoes) : '\"\"'}`, 'toolsUsed:'];
    if (repeat.tools.length) repeat.tools.forEach(x => lines.push(`  - name: ${quote(x.name)}`, `    purpose: ${quote(x.purpose)}`, `    url: ${x.url ? quote(x.url) : 'null'}`, '    affiliate: false')); else lines.push('  []');
    lines.push(`prompt: ${quote(data.prompt)}`, `videoEmbedUrl: ${tutorial ? quote(tutorial) : 'null'}`, `originalVideoUrl: ${originalTutorial ? quote(originalTutorial) : 'null'}`, 'steps:');
    if (repeat.steps.length) repeat.steps.forEach(x => {
      lines.push(`  - title: ${quote(x.title)}`, `    tool: ${quote(x.tool)}`, `    toolPurpose: ${quote(x.toolPurpose)}`, `    input: ${quote(x.input)}`, '    inputs:');
      if (x.inputs.length) x.inputs.forEach(input => lines.push(`      - type: ${quote(input.type)}`, `        label: ${quote(input.label)}`, `        role: ${quote(input.role)}`, `        value: ${quote(input.value)}`, `        src: ${input.src ? quote(input.src) : '""'}`)); else lines.push('      []');
      lines.push('    settings:');
      if (x.settings.length) x.settings.forEach(setting => lines.push(`      - label: ${quote(setting.label)}`, `        value: ${quote(setting.value)}`)); else lines.push('      []');
      lines.push(`    process: ${quote(x.process)}`, `    output: ${quote(x.output)}`, `    next: ${quote(x.next)}`, `    description: ${quote(workflowDescription(x))}`);
    }); else lines.push('  []');
    lines.push('tips:');
    if (repeat.tips.length) repeat.tips.forEach(x => lines.push(`  - ${quote(x)}`)); else lines.push('  []');
    lines.push(`relatedResources: ${list(repeat.related)}`, `tags: ${list(repeat.tags)}`);
    if (data.seoTitle) lines.push(`seoTitle: ${quote(data.seoTitle)}`);
    if (data.seoDescription) lines.push(`seoDescription: ${quote(data.seoDescription)}`);
    lines.push(`featured: ${data.featured ? 'true' : 'false'}`, '---', '', data.intro || '', '', data.whatItDoes || '', '', data.prompt ? `## Prompt\n\n${data.prompt}` : '', '');
    return lines.join('\n');
  };

  const addButton = () => {
    prepareAdmin();
    enhanceAll();
    const actions = form.querySelector('.actions');
    if (!actions || document.querySelector('#publish-resource')) return;
    const button = document.createElement('button');
    button.id = 'publish-resource';
    button.type = 'button';
    button.className = 'button button-primary';
    button.textContent = 'Publish resource';
    button.addEventListener('click', async () => {
      enhanceAll();
      if (!form.reportValidity()) return;
      const uploading = [...document.querySelectorAll('.upload-state,.sf-upload-state')].some(node => /uploading|preparing/i.test(node.textContent || ''));
      if (uploading) { setStatus('Please wait for image uploads to finish.'); return; }
      const data = {};
      form.querySelectorAll('input[name],textarea[name],select[name]').forEach(field => { data[field.name] = field.type === 'checkbox' ? field.checked : field.value; });
      data.repeat = collect();
      data.slug = data.slug || slugify(data.title);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) { setStatus('Please use a valid URL slug (lowercase letters, numbers and hyphens).'); return; }
      const content = markdown(data);
      button.disabled = true;
      button.textContent = 'Publishing…';
      setStatus('Publishing resource to GitHub…');
      try {
        const response = await fetch('/api/publish-resource', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ slug: data.slug, content }) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || `Publish failed (${response.status}).`);
        localStorage.setItem('skill-foundry-resource-draft-v6', JSON.stringify(data));
        button.textContent = 'Published';
        setStatus(`Published successfully: /resources/${data.slug}/`);
      } catch (error) {
        button.disabled = false;
        button.textContent = 'Publish resource';
        setStatus(error?.message || 'Publish failed.');
      }
    });
    actions.insertBefore(button, actions.lastElementChild);
  };

  addButton();
  const observer = new MutationObserver(() => { prepareAdmin(); enhanceAll(); addButton(); });
  observer.observe(form, { childList: true, subtree: true });
})();
