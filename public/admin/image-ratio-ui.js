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
  const pending = new WeakMap();
  let activeDialog = null;

  const style = document.createElement('style');
  style.textContent = `
    .sf-ratio-dialog{box-sizing:border-box;position:fixed;inset:50% auto auto 50%;transform:translate(-50%,-50%);width:min(680px,calc(100vw - 28px));max-width:calc(100vw - 28px);max-height:calc(100vh - 28px);margin:0;padding:0;border:1px solid rgba(61,214,208,.28);border-radius:18px;background:#07111f;color:var(--text);box-shadow:0 28px 90px rgba(0,0,0,.55);overflow:hidden}
    .sf-ratio-dialog::backdrop{background:rgba(2,7,13,.68);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
    .sf-ratio-modal{box-sizing:border-box;max-height:calc(100vh - 28px);overflow:auto;padding:18px}
    .sf-ratio-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px;font-size:15px;font-weight:800}
    .sf-ratio-badge{color:var(--accent);font-size:11px;white-space:nowrap}
    .sf-ratio-picker{display:grid;gap:7px;margin-bottom:13px}
    .sf-ratio-picker span{color:var(--muted);font-size:11px;font-weight:700}
    .sf-ratio-picker select{width:100%;min-height:42px;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:rgba(7,17,31,.75);color:var(--text);font:inherit;font-size:13px;outline:none}
    .sf-ratio-frame{position:relative;width:100%;overflow:hidden;border:1px solid rgba(61,214,208,.4);border-radius:14px;background:#050b13;touch-action:none}
    .sf-ratio-frame img{position:absolute;max-width:none;user-select:none;pointer-events:none;-webkit-user-drag:none}
    .sf-ratio-help{margin-top:10px;color:var(--muted);font-size:12px;line-height:1.55}
    .sf-ratio-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
    .sf-ratio-actions button{min-height:42px;padding:0 15px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.035);color:var(--text);font:inherit;font-size:13px;font-weight:800;cursor:pointer}
    .sf-ratio-actions .primary{border-color:rgba(61,214,208,.4);background:rgba(61,214,208,.1);color:var(--accent)}
    .sf-ratio-actions button:disabled{opacity:.55;cursor:wait}
    .builder-page .sf-ratio-result{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;margin-top:9px;padding:10px;border:1px solid var(--line);border-radius:12px;background:rgba(7,17,31,.45)}
    .builder-page .sf-ratio-result-media{min-width:0}
    .builder-page .sf-ratio-result img{display:block;width:min(100%,420px);max-height:300px;object-fit:contain;border:1px solid var(--line);border-radius:10px;background:#050b13}
    .builder-page .sf-ratio-result-file{display:block;margin-top:6px;color:var(--muted);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .builder-page .sf-ratio-result-actions{display:flex;min-width:92px;flex-direction:column;align-items:stretch;gap:7px}
    .builder-page .sf-ratio-upload{min-height:42px;padding:0 14px;border:1px solid rgba(61,214,208,.35);border-radius:10px;background:rgba(61,214,208,.08);color:var(--accent);font:inherit;font-size:12px;font-weight:800;cursor:pointer}
    .builder-page .sf-ratio-upload:disabled{opacity:.55;cursor:wait}
    .builder-page .sf-ratio-status{color:var(--muted);font-size:11px;line-height:1.4}
    .builder-page .sf-ratio-status.error{color:#ff9b9b}.builder-page .sf-ratio-status.success{color:var(--accent)}
    .builder-page .sf-ratio-clear{position:absolute;top:8px;right:8px;width:30px;height:30px;min-width:30px;min-height:30px;padding:0;border:1px solid var(--line);border-radius:50%;background:rgba(7,17,31,.9);color:var(--muted);font:inherit;font-size:18px;line-height:1;cursor:pointer}
    @media(max-width:600px){
      .sf-ratio-dialog{width:calc(100vw - 18px);max-width:calc(100vw - 18px);max-height:calc(100vh - 18px);border-radius:16px}
      .sf-ratio-modal{max-height:calc(100vh - 18px);padding:14px}
      .builder-page .sf-ratio-result{grid-template-columns:1fr}
      .builder-page .sf-ratio-result-actions{min-width:0;flex-direction:row;align-items:center;flex-wrap:wrap}
      .builder-page .sf-ratio-upload{flex:0 0 auto}
      .builder-page .sf-ratio-status{flex:1 1 150px}
    }
  `;
  document.head.appendChild(style);

  const isTarget = input => input instanceof HTMLInputElement && (input.dataset.fileRole === 'input' || input.dataset.fileRole === 'result');
  const roleOf = input => input.dataset.fileRole;
  const hostOf = input => input.closest('.media-item');
  const previewOf = input => hostOf(input)?.querySelector(`[data-preview-role="${roleOf(input)}"]`);
  const pathOf = input => hostOf(input)?.querySelector(`[data-role="${roleOf(input)}"]`);
  const oldStatusOf = input => hostOf(input)?.querySelector('[data-upload-state]');
  const clearOldStatus = input => {
    const node = oldStatusOf(input);
    if (node) { node.textContent = ''; node.className = 'upload-state'; }
  };
  const revoke = item => { if (item?.url) URL.revokeObjectURL(item.url); };

  const makeCrop = async (file, ratio) => {
    const source = await createImageBitmap(file);
    const [rw, rh] = ratio.split(':').map(Number);
    const targetRatio = rw / rh;
    const sourceRatio = source.width / source.height;
    let cropW = source.width;
    let cropH = source.height;
    if (sourceRatio > targetRatio) cropW = source.height * targetRatio;
    else cropH = source.width / targetRatio;
    const sx = Math.max(0, (source.width - cropW) / 2);
    const sy = Math.max(0, (source.height - cropH) / 2);
    const outW = 1600;
    const outH = Math.max(1, Math.round(outW / targetRatio));
    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not prepare the cropped image.');
    ctx.drawImage(source, sx, sy, cropW, cropH, 0, 0, outW, outH);
    source.close?.();
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not prepare the cropped image.')), 'image/jpeg', .92));
  };

  const clearInput = input => {
    const item = pending.get(input);
    item?.controller?.abort();
    revoke(item);
    pending.delete(input);
    const preview = previewOf(input);
    const path = pathOf(input);
    if (preview) { preview.className = 'image-preview'; preview.innerHTML = ''; }
    if (path) path.value = '';
    input.value = '';
    clearOldStatus(input);
  };

  const uploadItem = async (input, button, status) => {
    const item = pending.get(input);
    if (!item || item.uploaded) return;
    button.disabled = true;
    button.textContent = 'Uploading…';
    status.textContent = 'Uploading to website…';
    status.className = 'sf-ratio-status';
    const controller = new AbortController();
    item.controller = controller;
    try {
      const base = item.originalName.replace(/\.[^.]+$/, '');
      const ratioName = item.ratio === 'original' ? 'original' : item.ratio.replace(':', 'x');
      const filename = `${base}-${item.role}-${ratioName}.jpg`;
      const response = await fetch('/api/upload-image', { method:'POST', headers:{'Content-Type':'image/jpeg','X-File-Name':encodeURIComponent(filename)}, body:item.blob, credentials:'same-origin', signal:controller.signal });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.path) throw new Error(data.error || `Image upload failed (${response.status || 'network error'}).`);
      const path = pathOf(input);
      if (path) path.value = data.path;
      item.uploaded = true;
      item.uploadedPath = data.path;
      button.textContent = 'Done';
      status.textContent = 'Uploaded to website';
      status.className = 'sf-ratio-status success';
    } catch (error) {
      button.disabled = false;
      button.textContent = 'Upload';
      status.textContent = error?.name === 'AbortError' ? 'Upload cancelled.' : (error?.message || 'Upload failed.');
      status.className = 'sf-ratio-status error';
    } finally { item.controller = null; }
  };

  const renderResult = (input, item) => {
    const preview = previewOf(input);
    if (!preview) return;
    preview.className = 'image-preview has-image';
    preview.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'sf-ratio-result';
    const media = document.createElement('div');
    media.className = 'sf-ratio-result-media';
    const image = document.createElement('img');
    image.src = item.url;
    image.alt = `${item.role === 'input' ? 'Input' : 'Output'} image preview`;
    if (item.ratio !== 'original') image.style.aspectRatio = item.ratio;
    const label = document.createElement('span');
    label.className = 'sf-ratio-result-file';
    label.textContent = `${item.originalName} · ${item.ratio === 'original' ? 'Original' : item.ratio}`;
    media.append(image, label);
    const actions = document.createElement('div');
    actions.className = 'sf-ratio-result-actions';
    const upload = document.createElement('button');
    upload.type = 'button'; upload.className = 'sf-ratio-upload'; upload.textContent = 'Upload';
    const status = document.createElement('div'); status.className = 'sf-ratio-status'; status.textContent = 'Ready to upload';
    upload.addEventListener('click', () => uploadItem(input, upload, status));
    actions.append(upload, status);
    const clear = document.createElement('button');
    clear.type = 'button'; clear.className = 'sf-ratio-clear'; clear.textContent = '×'; clear.title = 'Remove selected image'; clear.setAttribute('aria-label','Remove selected image');
    clear.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); clearInput(input); });
    box.append(media, actions, clear);
    preview.append(box);
  };

  const closeDialog = dialog => {
    if (!dialog) return;
    if (dialog.open) dialog.close();
    dialog.remove();
    if (activeDialog === dialog) activeDialog = null;
  };

  const openDialog = (input, file) => {
    if (!isTarget(input) || !file) return;
    if (activeDialog) closeDialog(activeDialog);
    const role = roleOf(input);
    const dialog = document.createElement('dialog');
    dialog.className = 'sf-ratio-dialog';
    dialog.innerHTML = `<div class="sf-ratio-modal"><div class="sf-ratio-title"><span>Adjust ${role === 'input' ? 'input' : 'output'} image</span><span class="sf-ratio-badge">Choose ratio</span></div><label class="sf-ratio-picker"><span>Display ratio</span><select class="sf-ratio-select" aria-label="Display ratio">${ratios.map(([label,value]) => `<option value="${value}">${label}</option>`).join('')}</select></label><div class="sf-ratio-frame"><img alt="Crop preview"></div><div class="sf-ratio-help">Choose a ratio and the image will be automatically cropped to that shape. Check the preview, then tap Done. Nothing is uploaded yet.</div><div class="sf-ratio-actions"><button type="button" class="primary sf-ratio-done">Done</button><button type="button" class="sf-ratio-cancel">Cancel</button></div></div>`;
    document.body.append(dialog);
    activeDialog = dialog;

    const frame = dialog.querySelector('.sf-ratio-frame');
    const image = dialog.querySelector('img');
    const select = dialog.querySelector('.sf-ratio-select');
    const done = dialog.querySelector('.sf-ratio-done');
    const cancel = dialog.querySelector('.sf-ratio-cancel');
    const sourceUrl = URL.createObjectURL(file);
    image.src = sourceUrl;

    const update = () => {
      const [rw,rh] = select.value === 'original' ? [image.naturalWidth || 1,image.naturalHeight || 1] : select.value.split(':').map(Number);
      frame.style.aspectRatio = `${rw}/${rh}`;
      const fw=frame.clientWidth,fh=frame.clientHeight,nw=image.naturalWidth||1,nh=image.naturalHeight||1,scale=Math.max(fw/nw,fh/nh),w=nw*scale,h=nh*scale;
      image.style.width=`${w}px`; image.style.height=`${h}px`; image.style.left=`${(fw-w)/2}px`; image.style.top=`${(fh-h)/2}px`;
    };
    image.onload = update;
    select.addEventListener('change', update);

    const cleanup = () => {
      URL.revokeObjectURL(sourceUrl);
      closeDialog(dialog);
      input.value = '';
    };
    cancel.addEventListener('click', cleanup);
    dialog.addEventListener('cancel', event => { event.preventDefault(); cleanup(); });

    done.addEventListener('click', async () => {
      done.disabled = true;
      cancel.disabled = true;
      try {
        const ratio = select.value;
        const blob = ratio === 'original' ? file : await makeCrop(file, ratio);
        const previous = pending.get(input);
        revoke(previous);
        const item = { blob, url:URL.createObjectURL(blob), originalName:file.name, ratio, role, uploaded:false, uploadedPath:'', controller:null };
        pending.set(input, item);
        const path = pathOf(input);
        if (path) path.value = '';
        clearOldStatus(input);
        renderResult(input, item);
        cleanup();
      } catch (error) {
        done.disabled = false;
        cancel.disabled = false;
        const help = dialog.querySelector('.sf-ratio-help');
        if (help) help.textContent = error?.message || 'Could not prepare the image.';
      }
    });

    try {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    } catch (error) {
      closeDialog(dialog);
      URL.revokeObjectURL(sourceUrl);
      const preview = previewOf(input);
      if (preview) {
        preview.className = 'image-preview has-image';
        preview.innerHTML = `<span>Selected: ${file.name}</span>`;
      }
      console.error('Skill Foundry image ratio popup could not open:', error);
    }
  };

  // Public bridge makes the popup callable even when repeatable fields are created after this script loads.
  window.SkillFoundryImageRatio = { open: openDialog };

  const handleFileChange = event => {
    const input = event.target;
    if (!isTarget(input)) return;
    const file = input.files?.[0];
    if (!file) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    clearOldStatus(input);
    openDialog(input, file);
  };

  // Window capture runs before document/target legacy listeners.
  window.addEventListener('change', handleFileChange, true);

  document.addEventListener('click', event => {
    const clear = event.target.closest?.('.image-clear');
    if (!clear) return;
    const item = clear.closest('.media-item');
    const input = item?.querySelector('input[data-file-role="input"],input[data-file-role="result"]');
    if (!input) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    clearInput(input);
  }, true);
})();