(() => {
  const form = document.querySelector('#resource-form');
  if (!form) return;

  const status = document.querySelector('#status');
  const quote = value => JSON.stringify(String(value ?? ''));
  const slugify = value => String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  const value = name => form.elements[name]?.value || '';
  const list = values => `[${values.map(quote).join(', ')}]`;
  const setStatus = message => { if (status) status.textContent = message; };

  const collect = () => ({
    inputs: [...document.querySelectorAll('[data-role="input"]')].map(x => x.value.trim()).filter(Boolean),
    results: [...document.querySelectorAll('[data-role="result"]')].map(x => x.value.trim()).filter(Boolean),
    tools: [...document.querySelectorAll('#tools-list .repeat-item')].map(item => ({
      name: item.querySelector('[data-role="tool-name"]')?.value.trim() || '',
      purpose: item.querySelector('[data-role="tool-purpose"]')?.value.trim() || '',
      url: item.querySelector('[data-role="tool-url"]')?.value.trim() || '',
      affiliate: !!item.querySelector('[data-role="tool-affiliate"]')?.checked
    })).filter(x => x.name || x.purpose || x.url),
    steps: [...document.querySelectorAll('#steps-list .repeat-item')].map(item => ({
      title: item.querySelector('[data-role="step-title"]')?.value.trim() || '',
      description: item.querySelector('[data-role="step-description"]')?.value.trim() || ''
    })).filter(x => x.title || x.description),
    tips: [...document.querySelectorAll('[data-role="tip"]')].map(x => x.value.trim()).filter(Boolean),
    tags: [...document.querySelectorAll('[data-role="tag"]')].map(x => x.value.trim()).filter(Boolean),
    related: [...document.querySelectorAll('[data-role="related"]')].map(x => x.value.trim()).filter(Boolean)
  });

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

  const addButton = () => {
    const actions = form.querySelector('.actions');
    if (!actions || document.querySelector('#publish-resource')) return;
    const button = document.createElement('button');
    button.id = 'publish-resource';
    button.type = 'button';
    button.className = 'button button-primary';
    button.textContent = 'Publish resource';
    button.addEventListener('click', async () => {
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
  const observer = new MutationObserver(addButton);
  observer.observe(form, { childList: true, subtree: true });
})();
