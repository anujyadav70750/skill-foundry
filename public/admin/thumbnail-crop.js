(() => {
  const form = document.querySelector('#resource-form');
  if (!form) return;

  const state = { file: null, objectUrl: null, controller: null };

  const style = document.createElement('style');
  style.textContent = `
    .builder-page .sf-thumb-crop{margin-top:12px;padding:14px;border:1px solid rgba(61,214,208,.25);border-radius:14px;background:rgba(7,17,31,.72)}
    .builder-page .sf-thumb-crop-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;color:var(--text);font-size:13px;font-weight:800}
    .builder-page .sf-thumb-crop-badge{color:var(--accent);font-size:11px}
    .builder-page .sf-thumb-frame{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border:1px solid rgba(61,214,208,.4);border-radius:12px;background:#050b13;touch-action:none;cursor:grab}
    .builder-page .sf-thumb-frame:active{cursor:grabbing}
    .builder-page .sf-thumb-frame img{position:absolute;max-width:none;width:auto;height:auto;user-select:none;pointer-events:none}
    .builder-page .sf-thumb-controls{display:grid;grid-template-columns:76px minmax(0,1fr) 48px;gap:8px;align-items:center;margin-top:10px;color:var(--muted);font-size:11px}
    .builder-page .sf-thumb-controls input{min-height:28px!important;padding:4px 6px!important}
    .builder-page .sf-thumb-value{text-align:right;color:var(--text);font-variant-numeric:tabular-nums}
    .builder-page .sf-thumb-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
    .builder-page .sf-thumb-actions button{min-height:38px;padding:0 13px;border:1px solid var(--line);border-radius:9px;background:rgba(255,255,255,.035);color:var(--text);font:inherit;font-size:12px;font-weight:800;cursor:pointer}
    .builder-page .sf-thumb-actions .primary{border-color:rgba(61,214,208,.4);background:rgba(61,214,208,.1);color:var(--accent)}
    .builder-page .sf-thumb-status{margin-top:8px;color:var(--muted);font-size:11px;line-height:1.5}
    .builder-page .sf-thumb-status.error{color:#ff9b9b}
    .builder-page .sf-thumb-status.success{color:var(--accent)}
    .builder-page .sf-thumb-result{position:relative;margin-top:10px}
    .builder-page .sf-thumb-result img{display:block;width:min(100%,420px);aspect-ratio:16/9;object-fit:cover;border:1px solid var(--line);border-radius:12px}
    .builder-page .sf-thumb-result button{position:absolute;top:8px;right:8px;width:30px;height:30px;min-width:30px;min-height:30px;padding:0;border:1px solid var(--line);border-radius:50%;background:rgba(7,17,31,.9);color:var(--muted);font:inherit;font-size:18px;line-height:1;cursor:pointer}
    .builder-page .sf-thumb-result button:hover{border-color:rgba(255,100,100,.5);color:#ff9b9b}
  `;
  document.head.appendChild(style);

  const host = () => form.querySelector('.image-field:has(input[data-image-file="thumbnail"])') || form.querySelector('input[data-image-file="thumbnail"]')?.closest('.image-field');
  const input = () => form.querySelector('input[data-image-file="thumbnail"]');
  const path = () => form.querySelector('input[name="thumbnail"]');
  const preview = () => form.querySelector('[data-preview="thumbnail"]');

  const revoke = () => {
    if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
    state.objectUrl = null;
  };

  const setStatus = (message, kind = '') => {
    const h = host();
    if (!h) return;
    let node = h.querySelector('.sf-thumb-status');
    if (!node) {
      node = document.createElement('div');
      node.className = 'sf-thumb-status';
      h.querySelector('.upload-row')?.after(node);
    }
    node.textContent = message;
    node.className = `sf-thumb-status${kind ? ` ${kind}` : ''}`;
  };

  const clearResult = () => {
    const p = preview();
    if (!p) return;
    p.classList.remove('has-image');
    p.innerHTML = '';
  };

  const showResult = (url, filename) => {
    const p = preview();
    if (!p) return;
    p.className = 'image-preview has-image';
    p.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'sf-thumb-result';
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Thumbnail preview';
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.textContent = '×';
    clear.title = 'Remove thumbnail';
    clear.setAttribute('aria-label', 'Remove thumbnail');
    clear.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      state.controller?.abort();
      state.file = null;
      revoke();
      const f = input();
      const v = path();
      if (f) f.value = '';
      if (v) v.value = '';
      clearResult();
      form.querySelector('.sf-thumb-crop')?.remove();
      setStatus('');
    });
    const label = document.createElement('span');
    label.textContent = filename || 'Thumbnail';
    label.style.cssText = 'display:block;margin-top:6px;color:var(--muted);font-size:11px';
    box.append(img, clear, label);
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
    if (!ctx) throw new Error('Could not prepare the thumbnail.');
    ctx.drawImage(bitmap, sx, sy, cropW, cropH, 0, 0, 1600, 900);
    bitmap.close?.();
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not prepare the thumbnail.')), 'image/jpeg', 0.92));
  };

  const upload = async blob => {
    const controller = new AbortController();
    state.controller = controller;
    const filename = `${(state.file.name || 'thumbnail').replace(/\.[^.]+$/, '')}-thumbnail-16x9.jpg`;
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'image/jpeg', 'X-File-Name': encodeURIComponent(filename) },
      body: blob,
      credentials: 'same-origin',
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.path) throw new Error(data.error || `Upload failed (${response.status || 'network error'}).`);
    return data.path;
  };

  const openCrop = file => {
    const h = host();
    if (!h) return;
    h.querySelector('.sf-thumb-crop')?.remove();
    revoke();
    state.objectUrl = URL.createObjectURL(file);
    const panel = document.createElement('div');
    panel.className = 'sf-thumb-crop';
    panel.innerHTML = `
      <div class="sf-thumb-crop-title"><span>Adjust thumbnail</span><span class="sf-thumb-crop-badge">16:9 fixed</span></div>
      <div class="sf-thumb-frame"><img alt="Thumbnail crop preview"></div>
      <div class="sf-thumb-controls"><span>Zoom</span><input class="sf-zoom" type="range" min="1" max="3" step="0.01" value="1"><span class="sf-thumb-value sf-zoom-value">1.00×</span></div>
      <div class="sf-thumb-controls"><span>Horizontal</span><input class="sf-x" type="range" min="0" max="100" step="0.1" value="50"><span class="sf-thumb-value">50%</span></div>
      <div class="sf-thumb-controls"><span>Vertical</span><input class="sf-y" type="range" min="0" max="100" step="0.1" value="50"><span class="sf-thumb-value">50%</span></div>
      <div class="sf-thumb-actions"><button type="button" class="primary sf-use">Use image</button><button type="button" class="sf-cancel">Cancel</button></div>
      <div class="sf-thumb-status">Drag the image inside the frame, or use the controls.</div>
    `;
    h.querySelector('.upload-row')?.after(panel);

    const frame = panel.querySelector('.sf-thumb-frame');
    const image = panel.querySelector('img');
    const zoom = panel.querySelector('.sf-zoom');
    const x = panel.querySelector('.sf-x');
    const y = panel.querySelector('.sf-y');
    image.src = state.objectUrl;

    const update = () => {
      const z = Number(zoom.value);
      const ox = Number(x.value);
      const oy = Number(y.value);
      const frameW = frame.clientWidth;
      const frameH = frame.clientHeight;
      const scale = Math.max(frameW / image.naturalWidth, frameH / image.naturalHeight) * z;
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      image.style.width = `${width}px`;
      image.style.height = `${height}px`;
      image.style.left = `${(frameW - width) * ox / 100}px`;
      image.style.top = `${(frameH - height) * oy / 100}px`;
      panel.querySelector('.sf-zoom-value').textContent = `${z.toFixed(2)}×`;
      panel.querySelectorAll('.sf-thumb-value')[1].textContent = `${ox.toFixed(0)}%`;
      panel.querySelectorAll('.sf-thumb-value')[2].textContent = `${oy.toFixed(0)}%`;
    };
    image.onload = update;
    [zoom, x, y].forEach(control => control.addEventListener('input', update));

    let dragging = false, startClientX = 0, startClientY = 0, startX = 50, startY = 50;
    frame.addEventListener('pointerdown', event => {
      dragging = true;
      startClientX = event.clientX;
      startClientY = event.clientY;
      startX = Number(x.value);
      startY = Number(y.value);
      frame.setPointerCapture?.(event.pointerId);
    });
    frame.addEventListener('pointermove', event => {
      if (!dragging) return;
      x.value = String(Math.max(0, Math.min(100, startX - ((event.clientX - startClientX) / frame.clientWidth) * 100)));
      y.value = String(Math.max(0, Math.min(100, startY - ((event.clientY - startClientY) / frame.clientHeight) * 100)));
      update();
    });
    frame.addEventListener('pointerup', () => { dragging = false; });
    frame.addEventListener('pointercancel', () => { dragging = false; });

    panel.querySelector('.sf-cancel').addEventListener('click', () => {
      panel.remove();
      revoke();
      state.file = null;
      const f = input();
      if (f) f.value = '';
      setStatus('');
    });

    panel.querySelector('.sf-use').addEventListener('click', async () => {
      try {
        panel.querySelector('.sf-use').disabled = true;
        panel.querySelector('.sf-cancel').disabled = true;
        setStatus('Preparing 16:9 thumbnail…');
        const blob = await makeCrop(file, Number(zoom.value), Number(x.value), Number(y.value));
        const localUrl = URL.createObjectURL(blob);
        showResult(localUrl, file.name);
        const uploadedPath = await upload(blob);
        path().value = uploadedPath;
        URL.revokeObjectURL(localUrl);
        showResult(uploadedPath, file.name);
        setStatus('Uploaded to website', 'success');
      } catch (error) {
        if (error?.name === 'AbortError') {
          setStatus('Upload cancelled.', 'error');
        } else {
          setStatus(error?.message || 'Upload failed. The cropped preview is kept.', 'error');
        }
        const f = input();
        if (f) f.value = '';
      } finally {
        panel.querySelector('.sf-use')?.removeAttribute('disabled');
        panel.querySelector('.sf-cancel')?.removeAttribute('disabled');
      }
    });
  };

  document.addEventListener('change', event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.dataset.imageFile !== 'thumbnail') return;
    const file = target.files?.[0];
    if (!file) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    state.file = file;
    openCrop(file);
  }, true);
})();
