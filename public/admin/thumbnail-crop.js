(() => {
  const form = document.querySelector('#resource-form');
  if (!form) return;

  const state = {
    role: null,
    dialog: null,
    sourceUrl: null,
    pending: { thumbnail: null, heroImage: null }
  };

  const style = document.createElement('style');
  style.textContent = `
    .sf-thumb-dialog{box-sizing:border-box;position:fixed;inset:50% auto auto 50%;transform:translate(-50%,-50%);width:min(640px,calc(100vw - 32px));max-width:calc(100vw - 32px);max-height:calc(100vh - 32px);margin:0;padding:0;border:1px solid rgba(61,214,208,.28);border-radius:18px;background:#07111f;color:var(--text);box-shadow:0 28px 90px rgba(0,0,0,.55);overflow:hidden}
    .sf-thumb-dialog::backdrop{background:rgba(2,7,13,.68);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
    .sf-thumb-modal{box-sizing:border-box;width:100%;max-height:calc(100vh - 32px);overflow:auto;padding:18px}
    .sf-thumb-crop-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;color:var(--text);font-size:15px;font-weight:800}
    .sf-thumb-crop-badge{color:var(--accent);font-size:11px;white-space:nowrap}
    .sf-thumb-frame{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border:1px solid rgba(61,214,208,.4);border-radius:14px;background:#050b13;touch-action:none;cursor:grab}
    .sf-thumb-frame:active{cursor:grabbing}
    .sf-thumb-frame img{position:absolute;max-width:none;width:auto;height:auto;user-select:none;pointer-events:none;-webkit-user-drag:none}
    .sf-thumb-help{margin-top:10px;color:var(--muted);font-size:12px;line-height:1.55}
    .sf-thumb-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
    .sf-thumb-actions button{min-height:42px;padding:0 15px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.035);color:var(--text);font:inherit;font-size:13px;font-weight:800;cursor:pointer}
    .sf-thumb-actions .primary{border-color:rgba(61,214,208,.4);background:rgba(61,214,208,.1);color:var(--accent)}
    .sf-thumb-actions button:disabled{opacity:.55;cursor:wait}
    .builder-page .sf-thumb-result{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;margin-top:10px;padding:10px;border:1px solid var(--line);border-radius:12px;background:rgba(7,17,31,.45)}
    .builder-page .sf-thumb-result-media{min-width:0}
    .builder-page .sf-thumb-result img{display:block;width:min(100%,420px);aspect-ratio:16/9;object-fit:cover;border:1px solid var(--line);border-radius:10px}
    .builder-page .sf-thumb-result-file{display:block;margin-top:6px;color:var(--muted);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .builder-page .sf-thumb-result-actions{display:flex;min-width:92px;flex-direction:column;align-items:stretch;gap:7px}
    .builder-page .sf-thumb-upload{min-height:42px;padding:0 14px;border:1px solid rgba(61,214,208,.35);border-radius:10px;background:rgba(61,214,208,.08);color:var(--accent);font:inherit;font-size:12px;font-weight:800;cursor:pointer}
    .builder-page .sf-thumb-upload:hover{border-color:rgba(61,214,208,.6);background:rgba(61,214,208,.12)}
    .builder-page .sf-thumb-upload:disabled{opacity:.55;cursor:wait}
    .builder-page .sf-thumb-status{color:var(--muted);font-size:11px;line-height:1.4}
    .builder-page .sf-thumb-status.error{color:#ff9b9b}.builder-page .sf-thumb-status.success{color:var(--accent)}
    .builder-page .sf-thumb-clear{position:absolute;top:8px;right:8px;width:30px;height:30px;min-width:30px;min-height:30px;padding:0;border:1px solid var(--line);border-radius:50%;background:rgba(7,17,31,.9);color:var(--muted);font:inherit;font-size:18px;line-height:1;cursor:pointer}
    .builder-page .sf-thumb-clear:hover{border-color:rgba(255,100,100,.5);color:#ff9b9b;background:rgba(255,100,100,.07)}
    @media(max-width:600px){
      .sf-thumb-dialog{width:calc(100vw - 28px);max-width:calc(100vw - 28px);max-height:calc(100vh - 28px);border-radius:16px}
      .sf-thumb-modal{max-height:calc(100vh - 28px);padding:14px}
      .sf-thumb-crop-title{font-size:14px}
      .sf-thumb-help{font-size:11px}
      .sf-thumb-actions button{min-height:40px}
      .builder-page .sf-thumb-result{grid-template-columns:1fr}
      .builder-page .sf-thumb-result-actions{min-width:0;flex-direction:row;align-items:center;flex-wrap:wrap}
      .builder-page .sf-thumb-upload{flex:0 0 auto}
      .builder-page .sf-thumb-status{flex:1 1 150px}
    }
  `;
  document.head.appendChild(style);

  const host = role => form.querySelector(`.image-field:has(input[data-image-file="${role}"])`) || form.querySelector(`input[data-image-file="${role}"]`)?.closest('.image-field');
  const input = role => form.querySelector(`input[data-image-file="${role}"]`);
  const path = role => form.querySelector(`input[name="${role === 'thumbnail' ? 'thumbnail' : 'heroImage'}"]`);
  const preview = role => form.querySelector(`[data-preview="${role}"]`);
  const revokeSource = () => { if (state.sourceUrl) URL.revokeObjectURL(state.sourceUrl); state.sourceUrl = null; };

  const removeDialog = () => {
    const dialog = state.dialog;
    if (dialog) {
      if (dialog.open) dialog.close();
      dialog.remove();
    }
    state.dialog = null;
    revokeSource();
    state.role = null;
  };

  const uploadPending = async role => {
    const item = state.pending[role];
    if (!item || item.uploaded) return;
    const h = host(role);
    const p = preview(role);
    const button = p?.querySelector('.sf-thumb-upload');
    const status = p?.querySelector('.sf-thumb-status');
    if (!h || !button) return;

    button.disabled = true;
    button.textContent = 'Uploading…';
    if (status) {
      status.textContent = 'Uploading to website…';
      status.className = 'sf-thumb-status';
    }

    const controller = new AbortController();
    item.controller = controller;
    try {
      const base = (item.originalName || role).replace(/\.[^.]+$/, '');
      const filename = `${base}-${role === 'thumbnail' ? 'thumbnail' : 'hero'}-16x9.jpg`;
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg', 'X-File-Name': encodeURIComponent(filename) },
        body: item.blob,
        credentials: 'same-origin',
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.path) throw new Error(data.error || `Upload failed (${response.status || 'network error'}).`);

      const pathInput = path(role);
      if (pathInput) pathInput.value = data.path;
      item.uploaded = true;
      item.uploadedPath = data.path;
      button.disabled = true;
      button.textContent = 'Done';
      if (status) {
        status.textContent = 'Uploaded to website';
        status.className = 'sf-thumb-status success';
      }
    } catch (error) {
      button.disabled = false;
      button.textContent = 'Upload';
      if (status) {
        status.textContent = error?.name === 'AbortError' ? 'Upload cancelled.' : (error?.message || 'Upload failed.');
        status.className = 'sf-thumb-status error';
      }
    } finally {
      item.controller = null;
    }
  };

  const clearResult = role => {
    const item = state.pending[role];
    item?.controller?.abort();
    if (item?.url) URL.revokeObjectURL(item.url);
    state.pending[role] = null;
    const p = preview(role);
    if (p) { p.classList.remove('has-image'); p.innerHTML = ''; }
    const f = input(role), v = path(role);
    if (f) f.value = '';
    if (v) v.value = '';
  };

  const showResult = (role, item) => {
    const p = preview(role);
    if (!p) return;
    p.className = 'image-preview has-image';
    p.innerHTML = '';

    const box = document.createElement('div');
    box.className = 'sf-thumb-result';

    const media = document.createElement('div');
    media.className = 'sf-thumb-result-media';
    const img = document.createElement('img');
    img.src = item.url;
    img.alt = role === 'thumbnail' ? 'Thumbnail preview' : 'Hero image preview';
    const label = document.createElement('span');
    label.className = 'sf-thumb-result-file';
    label.textContent = item.originalName || (role === 'thumbnail' ? 'Thumbnail' : 'Hero image');
    media.append(img, label);

    const actions = document.createElement('div');
    actions.className = 'sf-thumb-result-actions';
    const uploadButton = document.createElement('button');
    uploadButton.type = 'button';
    uploadButton.className = 'sf-thumb-upload';
    uploadButton.textContent = item.uploaded ? 'Done' : 'Upload';
    uploadButton.disabled = !!item.uploaded;
    uploadButton.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); uploadPending(role); });
    const status = document.createElement('div');
    status.className = `sf-thumb-status${item.uploaded ? ' success' : ''}`;
    status.textContent = item.uploaded ? 'Uploaded to website' : 'Ready to upload';
    actions.append(uploadButton, status);

    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'sf-thumb-clear';
    clear.textContent = '×';
    clear.title = `Remove ${role === 'thumbnail' ? 'thumbnail' : 'hero image'}`;
    clear.setAttribute('aria-label', clear.title);
    clear.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); clearResult(role); });

    box.append(media, actions, clear);
    p.append(box);
  };

  const makeCrop = async (file, zoom, offsetX, offsetY) => {
    const bitmap = await createImageBitmap(file);
    const targetRatio = 16 / 9;
    const sourceRatio = bitmap.width / bitmap.height;
    let cropW = sourceRatio > targetRatio ? bitmap.height * targetRatio : bitmap.width;
    let cropH = sourceRatio > targetRatio ? bitmap.height : bitmap.width / targetRatio;
    cropW /= zoom;
    cropH /= zoom;
    const sx = Math.max(0, Math.min(bitmap.width - cropW, (bitmap.width - cropW) * offsetX / 100));
    const sy = Math.max(0, Math.min(bitmap.height - cropH, (bitmap.height - cropH) * offsetY / 100));
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not prepare the image.');
    ctx.drawImage(bitmap, sx, sy, cropW, cropH, 0, 0, 1600, 900);
    bitmap.close?.();
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not prepare the image.')), 'image/jpeg', .92));
  };

  const openCrop = (file, role) => {
    const h = host(role);
    if (!h) return;
    removeDialog();
    state.role = role;
    state.sourceUrl = URL.createObjectURL(file);

    const dialog = document.createElement('dialog');
    dialog.className = 'sf-thumb-dialog';
    dialog.setAttribute('aria-labelledby', 'sf-thumb-dialog-title');
    dialog.innerHTML = `<div class="sf-thumb-modal"><div class="sf-thumb-crop-title"><span id="sf-thumb-dialog-title">Adjust ${role === 'thumbnail' ? 'thumbnail' : 'hero image'}</span><span class="sf-thumb-crop-badge">16:9 fixed</span></div><div class="sf-thumb-frame"><img alt="Crop preview"></div><div class="sf-thumb-help">Drag the image with your finger. Pinch with two fingers to zoom and position it exactly where you want.</div><div class="sf-thumb-actions"><button type="button" class="primary sf-use">Done</button><button type="button" class="sf-cancel">Cancel</button></div></div>`;
    document.body.append(dialog);
    state.dialog = dialog;

    const frame = dialog.querySelector('.sf-thumb-frame');
    const image = dialog.querySelector('img');
    const done = dialog.querySelector('.sf-use');
    const cancel = dialog.querySelector('.sf-cancel');
    image.src = state.sourceUrl;

    const crop = { zoom: 1, x: 50, y: 50, pointers: new Map(), startDistance: 0, startZoom: 1 };
    const update = () => {
      const fw = frame.clientWidth, fh = frame.clientHeight;
      const nw = image.naturalWidth || 1, nh = image.naturalHeight || 1;
      const scale = Math.max(fw / nw, fh / nh) * crop.zoom;
      const w = nw * scale, h2 = nh * scale;
      image.style.width = `${w}px`;
      image.style.height = `${h2}px`;
      image.style.left = `${(fw - w) * crop.x / 100}px`;
      image.style.top = `${(fh - h2) * crop.y / 100}px`;
    };
    image.onload = update;

    const points = () => [...crop.pointers.values()];
    const distance = () => { const p = points(); return p.length < 2 ? 0 : Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); };
    frame.addEventListener('pointerdown', event => {
      event.preventDefault();
      frame.setPointerCapture?.(event.pointerId);
      crop.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (crop.pointers.size === 2) { crop.startDistance = distance(); crop.startZoom = crop.zoom; }
    });
    frame.addEventListener('pointermove', event => {
      if (!crop.pointers.has(event.pointerId)) return;
      event.preventDefault();
      const previous = crop.pointers.get(event.pointerId);
      crop.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (crop.pointers.size === 1) {
        crop.x = Math.max(0, Math.min(100, crop.x - ((event.clientX - previous.x) / frame.clientWidth) * 100));
        crop.y = Math.max(0, Math.min(100, crop.y - ((event.clientY - previous.y) / frame.clientHeight) * 100));
      } else if (crop.pointers.size === 2 && crop.startDistance) {
        crop.zoom = Math.max(1, Math.min(4, crop.startZoom * (distance() / crop.startDistance)));
      }
      update();
    });
    const end = event => { crop.pointers.delete(event.pointerId); if (crop.pointers.size < 2) crop.startDistance = 0; };
    frame.addEventListener('pointerup', end);
    frame.addEventListener('pointercancel', end);

    const closeCancel = () => {
      dialog.close();
      dialog.remove();
      state.dialog = null;
      revokeSource();
      state.role = null;
      const f = input(role);
      if (f) f.value = '';
    };
    cancel.addEventListener('click', closeCancel);
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeCancel(); });

    done.addEventListener('click', async () => {
      done.disabled = true;
      cancel.disabled = true;
      try {
        const blob = await makeCrop(file, crop.zoom, crop.x, crop.y);
        const previous = state.pending[role];
        if (previous?.url) URL.revokeObjectURL(previous.url);
        const item = { blob, url: URL.createObjectURL(blob), originalName: file.name, uploaded: false, controller: null, uploadedPath: '' };
        state.pending[role] = item;
        const pathInput = path(role);
        if (pathInput) pathInput.value = '';
        showResult(role, item);
        dialog.close();
        dialog.remove();
        state.dialog = null;
        revokeSource();
        state.role = null;
        const f = input(role);
        if (f) f.value = '';
      } catch (error) {
        done.disabled = false;
        cancel.disabled = false;
        const message = document.createElement('div');
        message.className = 'sf-thumb-help';
        message.textContent = error?.message || 'Could not prepare the cropped image.';
        dialog.querySelector('.sf-thumb-modal')?.append(message);
      }
    });

    dialog.showModal();
  };

  document.addEventListener('change', event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const fileRole = target.dataset.imageFile;
    if (fileRole !== 'thumbnail' && fileRole !== 'heroImage') return;
    const file = target.files?.[0];
    if (!file) return;
    target.value = '';
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openCrop(file, fileRole);
  }, true);
})();
