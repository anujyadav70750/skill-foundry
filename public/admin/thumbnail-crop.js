(() => {
  const form = document.querySelector('#resource-form');
  if (!form) return;

  const state = { file: null, objectUrl: null, controller: null, crop: null };

  const style = document.createElement('style');
  style.textContent = `
    .builder-page .sf-thumb-crop{margin-top:12px;padding:14px;border:1px solid rgba(61,214,208,.25);border-radius:14px;background:rgba(7,17,31,.72)}
    .builder-page .sf-thumb-crop-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;color:var(--text);font-size:13px;font-weight:800}
    .builder-page .sf-thumb-crop-badge{color:var(--accent);font-size:11px}
    .builder-page .sf-thumb-frame{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border:1px solid rgba(61,214,208,.4);border-radius:12px;background:#050b13;touch-action:none;cursor:grab;user-select:none}
    .builder-page .sf-thumb-frame:active{cursor:grabbing}
    .builder-page .sf-thumb-frame img{position:absolute;display:block;max-width:none;width:auto;height:auto;user-select:none;pointer-events:none;-webkit-user-drag:none;will-change:transform}
    .builder-page .sf-thumb-hint{margin-top:9px;color:var(--muted);font-size:11px;line-height:1.5;text-align:center}
    .builder-page .sf-thumb-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:12px}
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

  const clearCrop = () => form.querySelector('.sf-thumb-crop')?.remove();

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
    img.alt = 'Final 16:9 thumbnail preview';
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
      state.crop = null;
      revoke();
      const f = input();
      const v = path();
      if (f) f.value = '';
      if (v) v.value = '';
      clearCrop();
      clearResult();
      setStatus('');
    });
    const label = document.createElement('span');
    label.textContent = filename || 'Thumbnail';
    label.style.cssText = 'display:block;margin-top:6px;color:var(--muted);font-size:11px';
    box.append(img, clear, label);
    p.append(box);
  };

  const makeCrop = async file => {
    const bitmap = await createImageBitmap(file);
    const targetRatio = 16 / 9;
    const sourceRatio = bitmap.width / bitmap.height;
    let cropW = sourceRatio > targetRatio ? bitmap.height * targetRatio : bitmap.width;
    let cropH = sourceRatio > targetRatio ? bitmap.height : bitmap.width / targetRatio;
    const zoom = Math.max(1, state.crop?.zoom || 1);
    cropW /= zoom;
    cropH /= zoom;
    const maxX = Math.max(0, bitmap.width - cropW);
    const maxY = Math.max(0, bitmap.height - cropH);
    const x = Math.max(0, Math.min(maxX, state.crop?.x || 0));
    const y = Math.max(0, Math.min(maxY, state.crop?.y || 0));
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not prepare the thumbnail.');
    ctx.drawImage(bitmap, x, y, cropW, cropH, 0, 0, 1600, 900);
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
    clearCrop();
    clearResult();
    revoke();
    state.file = file;
    state.crop = { x: 0, y: 0, zoom: 1 };
    state.objectUrl = URL.createObjectURL(file);

    const panel = document.createElement('div');
    panel.className = 'sf-thumb-crop';
    panel.innerHTML = `
      <div class="sf-thumb-crop-title"><span>Adjust thumbnail</span><span class="sf-thumb-crop-badge">16:9 fixed</span></div>
      <div class="sf-thumb-frame"><img alt="Thumbnail crop preview"></div>
      <div class="sf-thumb-hint">Drag the image with one finger. Pinch to zoom. The frame stays 16:9.</div>
      <div class="sf-thumb-actions"><button type="button" class="sf-cancel">Cancel</button><button type="button" class="primary sf-use">Done</button></div>
      <div class="sf-thumb-status">Position the image, then tap Done.</div>
    `;
    h.querySelector('.upload-row')?.after(panel);

    const frame = panel.querySelector('.sf-thumb-frame');
    const image = panel.querySelector('img');
    image.src = state.objectUrl;

    let naturalW = 0, naturalH = 0, baseScale = 1;
    const update = () => {
      if (!naturalW || !naturalH) return;
      const frameW = frame.clientWidth;
      const frameH = frame.clientHeight;
      baseScale = Math.max(frameW / naturalW, frameH / naturalH);
      const scale = baseScale * state.crop.zoom;
      const width = naturalW * scale;
      const height = naturalH * scale;
      const minX = Math.min(0, frameW - width);
      const minY = Math.min(0, frameH - height);
      state.crop.x = Math.max(minX, Math.min(0, state.crop.x));
      state.crop.y = Math.max(minY, Math.min(0, state.crop.y));
      image.style.width = `${width}px`;
      image.style.height = `${height}px`;
      image.style.left = `${state.crop.x}px`;
      image.style.top = `${state.crop.y}px`;
    };

    image.onload = () => {
      naturalW = image.naturalWidth;
      naturalH = image.naturalHeight;
      state.crop.x = (frame.clientWidth - naturalW * Math.max(frame.clientWidth / naturalW, frame.clientHeight / naturalH)) / 2;
      state.crop.y = (frame.clientHeight - naturalH * Math.max(frame.clientWidth / naturalW, frame.clientHeight / naturalH)) / 2;
      update();
    };

    const distance = touches => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    let dragging = false, lastX = 0, lastY = 0, pinchStart = 0, pinchZoom = 1;

    frame.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      frame.setPointerCapture?.(event.pointerId);
    });
    frame.addEventListener('pointermove', event => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      state.crop.x += dx;
      state.crop.y += dy;
      update();
    });
    frame.addEventListener('pointerup', () => { dragging = false; });
    frame.addEventListener('pointercancel', () => { dragging = false; });

    frame.addEventListener('touchstart', event => {
      if (event.touches.length === 2) {
        dragging = false;
        pinchStart = distance(event.touches);
        pinchZoom = state.crop.zoom;
      }
    }, { passive: true });
    frame.addEventListener('touchmove', event => {
      if (event.touches.length !== 2 || !pinchStart) return;
      event.preventDefault();
      const ratio = distance(event.touches) / pinchStart;
      state.crop.zoom = Math.max(1, Math.min(3, pinchZoom * ratio));
      update();
    }, { passive: false });
    frame.addEventListener('touchend', event => {
      if (event.touches.length < 2) pinchStart = 0;
    }, { passive: true });

    panel.querySelector('.sf-cancel').addEventListener('click', event => {
      event.preventDefault();
      clearCrop();
      revoke();
      state.file = null;
      state.crop = null;
      const f = input();
      if (f) f.value = '';
      setStatus('');
    });

    panel.querySelector('.sf-use').addEventListener('click', async event => {
      event.preventDefault();
      const use = panel.querySelector('.sf-use');
      const cancel = panel.querySelector('.sf-cancel');
      try {
        use.disabled = true;
        cancel.disabled = true;
        setStatus('Preparing 16:9 thumbnail…');
        const blob = await makeCrop(file);
        const localUrl = URL.createObjectURL(blob);
        clearCrop();
        showResult(localUrl, file.name);
        setStatus('Uploading…');
        const uploadedPath = await upload(blob);
        path().value = uploadedPath;
        URL.revokeObjectURL(localUrl);
        showResult(uploadedPath, file.name);
        setStatus('Uploaded to website', 'success');
        state.crop = null;
      } catch (error) {
        if (error?.name === 'AbortError') setStatus('Upload cancelled.', 'error');
        else setStatus(error?.message || 'Upload failed. The cropped preview is kept.', 'error');
        use.disabled = false;
        cancel.disabled = false;
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
    openCrop(file);
  }, true);
})();