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
  const state = new WeakMap();

  const css = document.createElement('style');
  css.textContent = `
    .builder-page .sf-ratio{display:grid;gap:7px;margin-top:8px!important}
    .builder-page .sf-ratio select{min-height:40px!important}
    .builder-page .sf-crop-panel{margin-top:10px;padding:12px;border:1px solid var(--line);border-radius:12px;background:rgba(7,17,31,.55)}
    .builder-page .sf-crop-title{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:8px;color:var(--text);font-size:12px;font-weight:800}
    .builder-page .sf-crop-frame{position:relative;width:100%;max-width:520px;overflow:hidden;border:1px solid rgba(61,214,208,.35);border-radius:10px;background:#050b13;touch-action:none;cursor:grab}
    .builder-page .sf-crop-frame:active{cursor:grabbing}
    .builder-page .sf-crop-frame img{position:absolute;max-width:none;user-select:none;pointer-events:none}
    .builder-page .sf-crop-controls{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;margin-top:9px;color:var(--muted);font-size:11px}
    .builder-page .sf-crop-controls input{min-height:28px!important;padding:4px 6px!important}
    .builder-page .sf-crop-actions{display:flex;gap:8px;margin-top:10px}
    .builder-page .sf-crop-actions button{min-height:38px;padding:0 12px;border:1px solid var(--line);border-radius:9px;background:rgba(255,255,255,.035);color:var(--text);font:inherit;font-size:12px;font-weight:800;cursor:pointer}
    .builder-page .sf-crop-actions .primary{background:rgba(61,214,208,.10);border-color:rgba(61,214,208,.35);color:var(--accent)}
    .builder-page .sf-upload-preview{position:relative;margin-top:9px}
    .builder-page .sf-upload-preview img{display:block;width:min(100%,420px);max-height:300px;object-fit:cover;border:1px solid var(--line);border-radius:12px}
    .builder-page .sf-upload-preview .sf-clear{position:absolute;top:8px;right:8px;z-index:4;width:30px!important;height:30px!important;min-width:30px!important;min-height:30px!important;padding:0!important;border:1px solid var(--line);border-radius:50%;background:rgba(7,17,31,.9);color:var(--muted);font:inherit;font-size:18px!important;line-height:1!important;cursor:pointer}
    .builder-page .sf-upload-preview .sf-clear:hover{border-color:rgba(255,100,100,.5);color:#ff9b9b}
    .builder-page .sf-upload-state{font-size:11px;color:var(--muted);margin-top:7px}
    .builder-page .sf-upload-state.error{color:#ff9b9b}
    .builder-page .sf-upload-state.success{color:var(--accent)}
  `;
  document.head.appendChild(css);

  const clearState = node => {
    const current = state.get(node);
    if (current?.controller) current.controller.abort();
    if (current?.objectUrl) URL.revokeObjectURL(current.objectUrl);
    state.delete(node);
  };

  const upload = async (file, name, controller) => {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'image/jpeg',
        'X-File-Name': encodeURIComponent(name)
      },
      body: file,
      credentials: 'same-origin',
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.path) {
      throw new Error(data.error || `Upload failed (${response.status || 'network error'}).`);
    }
    return data.path;
  };

  const makeCanvas = async (file, ratio, zoom = 1, offsetX = 50, offsetY = 50) => {
    const source = await createImageBitmap(file);
    const [rw, rh] = ratio.split(':').map(Number);
    const targetRatio = rw / rh;
    const sw = source.width;
    const sh = source.height;
    const sourceRatio = sw / sh;
    let cropW;
    let cropH;

    if (sourceRatio > targetRatio) {
      cropH = sh;
      cropW = sh * targetRatio;
    } else {
      cropW = sw;
      cropH = sw / targetRatio;
    }

    cropW /= zoom;
    cropH /= zoom;

    const sx = Math.max(0, Math.min(sw - cropW, (sw - cropW) * (offsetX / 100)));
    const sy = Math.max(0, Math.min(sh - cropH, (sh - cropH) * (offsetY / 100)));
    const outW = 1600;
    const outH = Math.round(outW / targetRatio);
    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not prepare the cropped image.');
    context.drawImage(source, sx, sy, cropW, cropH, 0, 0, outW, outH);
    source.close?.();

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not prepare the cropped image.')), 'image/jpeg', 0.92);
    });
  };

  const status = (host, message, kind = '') => {
    let node = host.querySelector('.sf-upload-state');
    if (!node) {
      node = document.createElement('div');
      node.className = 'sf-upload-state';
      const row = host.querySelector('.upload-row');
      row?.after(node);
    }
    node.textContent = message;
    node.className = `sf-upload-state${kind ? ` ${kind}` : ''}`;
  };

  const renderPreview = (box, url, name, revokeUrl = false) => {
    clearState(box);
    box.className = 'sf-upload-preview';
    box.innerHTML = '';

    if (revokeUrl) state.set(box, { objectUrl: url });

    const image = document.createElement('img');
    image.src = url;
    image.alt = 'Selected image preview';
    box.append(image);

    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'sf-clear';
    clear.textContent = '×';
    clear.title = 'Remove selected image';
    clear.setAttribute('aria-label', 'Remove selected image');
    box.append(clear);

    const label = document.createElement('span');
    label.textContent = name;
    label.style.cssText = 'display:block;margin-top:6px;color:var(--muted);font-size:11px';
    box.append(label);

    clear.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      clearState(box);
      const host = box.closest('.image-field,.media-item');
      const path = host?.querySelector('.path-input');
      const file = host?.querySelector('input[type=file]');
      const crop = host?.querySelector('.sf-crop-panel');
      if (path) path.value = '';
      if (file) file.value = '';
      crop?.remove();
      box.className = 'sf-upload-preview';
      box.innerHTML = '';
      status(host || box, '');
    });
  };

  const cropEditor = (host, file, ratio, onConfirm) => {
    host.querySelector('.sf-crop-panel')?.remove();
    const panel = document.createElement('div');
    panel.className = 'sf-crop-panel';
    const original = ratio === 'original';

    panel.innerHTML = `
      <div class="sf-crop-title"><span>${original ? 'Image preview' : 'Adjust crop'}</span><span>${original ? 'Original' : ratio}</span></div>
      ${original ? '' : `
        <div class="sf-crop-frame"><img alt="Crop preview"></div>
        <div class="sf-crop-controls"><span>Zoom</span><input class="sf-zoom" type="range" min="1" max="3" step="0.01" value="1"><span class="sf-zoom-value">1×</span></div>
        <div class="sf-crop-controls"><span>Horizontal</span><input class="sf-x" type="range" min="0" max="100" value="50"><span>↔</span></div>
        <div class="sf-crop-controls"><span>Vertical</span><input class="sf-y" type="range" min="0" max="100" value="50"><span>↕</span></div>
      `}
      <div class="sf-crop-actions"><button type="button" class="primary sf-confirm">Use image</button><button type="button" class="sf-cancel">Cancel</button></div>
    `;

    const frame = panel.querySelector('.sf-crop-frame');
    const image = panel.querySelector('img');
    const zoom = panel.querySelector('.sf-zoom');
    const x = panel.querySelector('.sf-x');
    const y = panel.querySelector('.sf-y');
    const objectUrl = URL.createObjectURL(file);
    image.src = objectUrl;

    if (frame) {
      frame.style.aspectRatio = ratio;
      const update = () => {
        const z = Number(zoom.value);
        const ox = Number(x.value);
        const oy = Number(y.value);
        const width = frame.clientWidth * z;
        const height = frame.clientHeight * z;
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        image.style.left = `${(frame.clientWidth - width) * ox / 100}px`;
        image.style.top = `${(frame.clientHeight - height) * oy / 100}px`;
        panel.querySelector('.sf-zoom-value').textContent = `${z.toFixed(2)}×`;
      };
      image.onload = update;
      [zoom, x, y].forEach(input => input.addEventListener('input', update));

      let dragging = false;
      let startX = 0;
      let startY = 0;
      let startOffsetX = 50;
      let startOffsetY = 50;
      frame.addEventListener('pointerdown', event => {
        dragging = true;
        startX = event.clientX;
        startY = event.clientY;
        startOffsetX = Number(x.value);
        startOffsetY = Number(y.value);
        frame.setPointerCapture(event.pointerId);
      });
      frame.addEventListener('pointermove', event => {
        if (!dragging) return;
        x.value = Math.max(0, Math.min(100, startOffsetX - ((event.clientX - startX) / frame.clientWidth) * 100));
        y.value = Math.max(0, Math.min(100, startOffsetY - ((event.clientY - startY) / frame.clientHeight) * 100));
        update();
      });
      frame.addEventListener('pointerup', () => { dragging = false; });
      frame.addEventListener('pointercancel', () => { dragging = false; });
    } else {
      image.style.cssText = 'display:block;width:min(100%,420px);max-height:300px;object-fit:contain;border:1px solid var(--line);border-radius:12px';
    }

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      panel.remove();
    };

    panel.querySelector('.sf-confirm').addEventListener('click', () => {
      onConfirm({
        ratio,
        zoom: Number(zoom?.value || 1),
        x: Number(x?.value || 50),
        y: Number(y?.value || 50)
      });
      cleanup();
    });
    panel.querySelector('.sf-cancel').addEventListener('click', cleanup);

    const preview = host.querySelector('.image-preview');
    (preview || host).after(panel);
    return panel;
  };

  const setup = host => {
    if (!host || host.dataset.sfImageReady === '1') return;
    const fileInput = host.querySelector('input[type=file][data-file-role],input[type=file][data-image-file]');
    if (!fileInput) return;

    const role = fileInput.dataset.fileRole || fileInput.dataset.imageFile;
    const isStatic = Boolean(fileInput.dataset.imageFile);
    const pathInput = host.querySelector('.path-input') || form.elements[role];
    const preview = host.querySelector(`[data-preview-role="${role}"],[data-preview="${role}"]`);
    if (!pathInput || !preview) return;

    host.dataset.sfImageReady = '1';
    const mediaControl = host.querySelector('.media-control') || host;
    let ratioSelect = null;

    if (!isStatic) {
      const label = document.createElement('label');
      label.className = 'sf-ratio';
      label.textContent = 'Display ratio';
      ratioSelect = document.createElement('select');
      ratios.forEach(([text, value]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        ratioSelect.append(option);
      });
      label.append(ratioSelect);
      mediaControl.append(label);
    }

    const uploadSelected = async (file, selectedRatio, spec = null) => {
      clearState(preview);
      const controller = new AbortController();
      state.set(preview, { controller, file });
      status(host, 'Preparing image…');

      try {
        let blob = file;
        let filename = file.name;
        if (selectedRatio !== 'original') {
          blob = await makeCanvas(file, selectedRatio, spec?.zoom || 1, spec?.x || 50, spec?.y || 50);
          filename = `${file.name.replace(/\.[^.]+$/, '')}-${selectedRatio.replace(':', 'x')}.jpg`;
        }
        const path = await upload(blob, filename, controller);
        pathInput.value = path;
        renderPreview(preview, path, file.name);
        status(host, 'Uploaded to website', 'success');
      } catch (error) {
        if (error?.name === 'AbortError') {
          status(host, 'Upload cancelled.', 'error');
          return;
        }
        const localUrl = URL.createObjectURL(file);
        renderPreview(preview, localUrl, file.name, true);
        status(host, error?.message || 'Upload failed.', 'error');
      }
    };

    fileInput.addEventListener('change', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const file = fileInput.files?.[0];
      if (!file) return;

      const selectedRatio = isStatic ? (role === 'thumbnail' ? '16:9' : 'original') : (ratioSelect?.value || 'original');
      host.querySelector('.sf-crop-panel')?.remove();

      if (selectedRatio === 'original') {
        uploadSelected(file, selectedRatio);
      } else {
        cropEditor(host, file, selectedRatio, spec => uploadSelected(file, selectedRatio, spec));
      }
    }, true);

    ratioSelect?.addEventListener('change', () => {
      const current = state.get(preview);
      if (!current?.file) return;
      const selectedRatio = ratioSelect.value;
      fileInput.value = '';
      host.querySelector('.sf-crop-panel')?.remove();
      if (selectedRatio === 'original') {
        uploadSelected(current.file, 'original');
      } else {
        cropEditor(host, current.file, selectedRatio, spec => uploadSelected(current.file, selectedRatio, spec));
      }
    });

    if (pathInput.value && !preview.querySelector('img')) {
      renderPreview(preview, pathInput.value, 'Existing image');
    }
  };

  document.querySelectorAll('.image-field').forEach(setup);
  document.querySelectorAll('#inputs-list .media-item,#results-list .media-item').forEach(setup);

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
      if (!(node instanceof Element)) return;
      if (node.matches('.media-item')) setup(node);
      node.querySelectorAll?.('.media-item').forEach(setup);
    }));
  });

  ['#inputs-list', '#results-list'].forEach(selector => {
    const list = document.querySelector(selector);
    if (list) observer.observe(list, { childList: true, subtree: true });
  });
})();
