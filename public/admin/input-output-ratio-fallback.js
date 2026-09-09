(() => {
  const RATIOS = [['Original','original'],['1:1','1:1'],['4:3','4:3'],['3:4','3:4'],['16:9','16:9'],['9:16','9:16']];
  let dialog = null;

  const target = el => el instanceof HTMLInputElement && el.type === 'file' && (el.dataset.fileRole === 'input' || el.dataset.fileRole === 'result');
  const host = input => input.closest('.media-item');
  const path = input => host(input)?.querySelector(`[data-role="${input.dataset.fileRole}"]`);
  const preview = input => host(input)?.querySelector(`[data-preview-role="${input.dataset.fileRole}"]`);
  const state = input => host(input)?.querySelector('[data-upload-state]');

  window.__sfInputOutputRatioFallback = '2026-09-09-6';

  const style = document.createElement('style');
  style.textContent = `
    .sf-io-ratio{box-sizing:border-box;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(680px,calc(100vw - 28px));height:min(620px,calc(100vh - 28px));max-width:calc(100vw - 28px);max-height:calc(100vh - 28px);margin:0;padding:0;border:1px solid rgba(61,214,208,.3);border-radius:18px;background:#07111f;color:#eef6ff;box-shadow:0 28px 90px rgba(0,0,0,.6);overflow:hidden;z-index:2147483647}
    .sf-io-ratio::backdrop{background:rgba(2,7,13,.72);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px)}
    .sf-io-modal{box-sizing:border-box;width:100%;height:100%;padding:16px;display:flex;flex-direction:column;min-height:0}
    .sf-io-title{font-size:15px;font-weight:800;flex:0 0 auto}
    .sf-io-ratio select,.sf-io-ratio button{min-height:40px;border:1px solid rgba(255,255,255,.14);border-radius:10px;background:rgba(255,255,255,.04);color:inherit;font:inherit;padding:0 12px}
    .sf-io-ratio select{width:100%;margin:8px 0 10px;flex:0 0 auto}
    .sf-io-stage-wrap{flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:4px 0}
    .sf-io-stage{position:relative;overflow:hidden;aspect-ratio:1/1;border:1px solid rgba(61,214,208,.4);border-radius:14px;background:#050b13;touch-action:none;cursor:grab;box-shadow:inset 0 0 0 1px rgba(255,255,255,.025)}
    .sf-io-stage:active{cursor:grabbing}
    .sf-io-backdrop{position:absolute!important;inset:-18px!important;width:calc(100% + 36px)!important;height:calc(100% + 36px)!important;max-width:none!important;object-fit:cover!important;filter:blur(18px);opacity:.55;transform:scale(1.06);user-select:none;pointer-events:none;-webkit-user-drag:none}
    .sf-io-crop-window{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);overflow:hidden;border:1px solid rgba(255,255,255,.38);border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.28),inset 0 0 0 1px rgba(255,255,255,.06);touch-action:none}
    .sf-io-crop-window img{position:absolute;max-width:none;width:auto;height:auto;user-select:none;pointer-events:none;-webkit-user-drag:none;transform-origin:0 0}
    .sf-io-help{color:#9aaabd;font-size:11px;line-height:1.5;margin-top:7px;flex:0 0 auto;text-align:center}
    .sf-io-zoom{display:flex;justify-content:center;align-items:center;gap:7px;margin-top:8px;flex:0 0 auto}
    .sf-io-zoom button{width:40px;padding:0;font-size:18px;font-weight:700}
    .sf-io-zoom output{min-width:54px;text-align:center;color:#b9c7d8;font-size:11px}
    .sf-io-actions{display:flex;gap:8px;margin-top:10px;flex:0 0 auto}
    .sf-io-actions button{flex:1}
    .sf-io-actions .primary{border-color:rgba(61,214,208,.45);color:#3dd6d0;background:rgba(61,214,208,.1)}
    .sf-io-result{position:relative;margin-top:9px;padding:10px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(7,17,31,.45)}
    .sf-io-preview-box{position:relative;width:min(100%,420px);aspect-ratio:1/1;overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:#050b13;display:flex;align-items:center;justify-content:center}
    .sf-io-preview-box .sf-preview-backdrop{position:absolute;inset:-16px;width:calc(100% + 32px);height:calc(100% + 32px);object-fit:cover;filter:blur(16px);opacity:.55;transform:scale(1.06);pointer-events:none;user-select:none;-webkit-user-drag:none}
    .sf-io-preview-box .sf-preview-foreground{position:relative;z-index:1;display:block;width:auto;height:auto;max-width:100%;max-height:100%;object-fit:contain;border-radius:7px;box-shadow:0 6px 22px rgba(0,0,0,.24)}
    .sf-io-result .sf-upload{margin-top:9px;color:#3dd6d0;border-color:rgba(61,214,208,.4)}
    .sf-io-clear{position:absolute!important;top:8px;right:8px;width:30px!important;min-width:30px;padding:0!important;border-radius:50%!important;z-index:3}
    @media(max-width:600px){
      .sf-io-ratio{width:calc(100vw - 24px);height:min(560px,calc(100vh - 24px));max-width:calc(100vw - 24px);max-height:calc(100vh - 24px);border-radius:16px}
      .sf-io-modal{padding:12px}
      .sf-io-title{font-size:14px}
      .sf-io-help{font-size:10px}
    }
  `;
  document.head.appendChild(style);

  const clearPreview = input => {
    const p = preview(input); if (!p) return;
    if (p.dataset.objectUrl) URL.revokeObjectURL(p.dataset.objectUrl);
    delete p.dataset.objectUrl;
    p.classList.remove('has-image');
    p.innerHTML = '<button class="image-clear" type="button" aria-label="Remove selected image" title="Remove selected image">×</button>';
    const field = path(input); if (field) field.value = '';
    input.value = '';
    const st = state(input); if (st) st.textContent = '';
  };

  const close = () => {
    if (dialog) { if (dialog.open) dialog.close(); dialog.remove(); dialog = null; }
  };

  const showResult = (input, file, blob, ratio) => {
    const p = preview(input), field = path(input); if (!p) return;
    if (p.dataset.objectUrl) URL.revokeObjectURL(p.dataset.objectUrl);
    p.className = 'image-preview has-image';
    p.replaceChildren();
    const box = document.createElement('div'); box.className = 'sf-io-result';
    const objectUrl = URL.createObjectURL(blob);
    const previewBox = document.createElement('div'); previewBox.className = 'sf-io-preview-box';
    const backdrop = document.createElement('img'); backdrop.className = 'sf-preview-backdrop'; backdrop.src = objectUrl; backdrop.alt = '';
    const img = document.createElement('img'); img.className = 'sf-preview-foreground'; img.src = objectUrl; img.alt = 'Selected image preview';
    previewBox.append(backdrop, img);
    const label = document.createElement('span'); label.textContent = `${file.name} · ${ratio === 'original' ? 'Original' : ratio}`;
    const upload = document.createElement('button'); upload.type = 'button'; upload.className = 'sf-upload'; upload.textContent = 'Upload';
    const msg = document.createElement('span'); msg.className = 'upload-state'; msg.textContent = 'Ready to upload';
    upload.addEventListener('click', async () => {
      upload.disabled = true; upload.textContent = 'Uploading…'; msg.textContent = 'Uploading to website…';
      try {
        const base = file.name.replace(/\.[^.]+$/, '');
        const rn = ratio === 'original' ? 'original' : ratio.replace(':', 'x');
        const name = `${base}-${input.dataset.fileRole}-${rn}.jpg`;
        const r = await fetch('/api/upload-image', { method:'POST', headers:{'Content-Type':blob.type || 'image/jpeg','X-File-Name':encodeURIComponent(name)}, body:blob, credentials:'same-origin' });
        const data = await r.json().catch(() => ({}));
        if (!r.ok || !data.path) throw new Error(data.error || `Upload failed (${r.status}).`);
        if (field) field.value = data.path;
        upload.textContent = 'Done'; msg.textContent = 'Uploaded to website'; msg.className = 'upload-state success';
      } catch (e) {
        upload.disabled = false; upload.textContent = 'Upload'; msg.textContent = e?.message || 'Upload failed'; msg.className = 'upload-state error';
      }
    });
    const clear = document.createElement('button'); clear.type = 'button'; clear.className = 'sf-io-clear'; clear.textContent = '×'; clear.title = 'Remove selected image';
    clear.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); URL.revokeObjectURL(objectUrl); clearPreview(input); });
    box.append(previewBox, label, upload, msg, clear); p.append(box);
    p.dataset.objectUrl = objectUrl;
  };

  const makeCrop = async (file, ratio, zoom, x, y) => {
    if (ratio === 'original' && zoom === 1 && x === 50 && y === 50) return file;
    const bitmap = await createImageBitmap(file);
    const [rw, rh] = ratio === 'original' ? [bitmap.width, bitmap.height] : ratio.split(':').map(Number);
    const targetRatio = rw / rh;
    const sourceRatio = bitmap.width / bitmap.height;
    let cropW = sourceRatio > targetRatio ? bitmap.height * targetRatio : bitmap.width;
    let cropH = sourceRatio > targetRatio ? bitmap.height : bitmap.width / targetRatio;
    cropW /= zoom;
    cropH /= zoom;
    const maxX = Math.max(0, bitmap.width - cropW);
    const maxY = Math.max(0, bitmap.height - cropH);
    const sx = Math.max(0, Math.min(maxX, maxX * x / 100));
    const sy = Math.max(0, Math.min(maxY, maxY * y / 100));
    const outputW = ratio === 'original' ? Math.round(cropW) : 1600;
    const outputH = ratio === 'original' ? Math.round(cropH) : Math.max(1, Math.round(outputW / targetRatio));
    const canvas = document.createElement('canvas'); canvas.width = Math.max(1, outputW); canvas.height = Math.max(1, outputH);
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Could not prepare the image.');
    ctx.drawImage(bitmap, sx, sy, cropW, cropH, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    return new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Could not prepare the image.')), 'image/jpeg', .92));
  };

  const open = (input, file) => {
    close();
    const d = document.createElement('dialog'); d.className = 'sf-io-ratio';
    const role = input.dataset.fileRole === 'input' ? 'input' : 'output';
    d.innerHTML = `<div class="sf-io-modal"><strong class="sf-io-title">Adjust ${role} image</strong><select aria-label="Image ratio">${RATIOS.map(([a,v]) => `<option value="${v}">${a}</option>`).join('')}</select><div class="sf-io-stage-wrap"><div class="sf-io-stage"><img class="sf-io-backdrop" alt=""><div class="sf-io-crop-window"><img class="sf-io-crop-image" alt="Crop preview"></div></div></div><div class="sf-io-zoom"><button type="button" class="sf-zoom-out" aria-label="Zoom out">−</button><output>100%</output><button type="button" class="sf-zoom-in" aria-label="Zoom in">+</button></div><div class="sf-io-help">Drag to move the image. Pinch or use + / − to zoom. Only the part inside the selected ratio will be saved.</div><div class="sf-io-actions"><button type="button" class="primary sf-done">Use image</button><button type="button" class="sf-cancel">Cancel</button></div></div>`;
    document.body.append(d); dialog = d;

    const stage = d.querySelector('.sf-io-stage'), cropWindow = d.querySelector('.sf-io-crop-window'), backdrop = d.querySelector('.sf-io-backdrop'), img = d.querySelector('.sf-io-crop-image'), wrap = d.querySelector('.sf-io-stage-wrap'), select = d.querySelector('select');
    const zoomOut = d.querySelector('.sf-zoom-out'), zoomIn = d.querySelector('.sf-zoom-in'), zoomLabel = d.querySelector('output');
    const url = URL.createObjectURL(file); backdrop.src = url; img.src = url;
    const crop = { zoom: 1, x: 50, y: 50, pointers: new Map(), startDistance: 0, startZoom: 1 };

    const ratioValue = () => select.value === 'original' ? (img.naturalWidth || 1) / (img.naturalHeight || 1) : (() => { const [rw,rh] = select.value.split(':').map(Number); return rw / rh; })();
    const updateCropWindow = () => {
      const size = stage.clientWidth || 1, r = ratioValue();
      let w = size, h = w / r;
      if (h > size) { h = size; w = h * r; }
      cropWindow.style.width = `${Math.max(1, Math.round(w))}px`;
      cropWindow.style.height = `${Math.max(1, Math.round(h))}px`;
    };
    const fitStage = () => {
      const maxW = Math.max(120, wrap.clientWidth - 4), maxH = Math.max(120, wrap.clientHeight - 4);
      const size = Math.max(120, Math.min(maxW, maxH));
      stage.style.width = `${Math.round(size)}px`;
      stage.style.height = `${Math.round(size)}px`;
      updateCropWindow();
      updateImage();
    };
    const updateZoomLabel = () => { zoomLabel.textContent = `${Math.round(crop.zoom * 100)}%`; };
    const updateImage = () => {
      const fw = cropWindow.clientWidth, fh = cropWindow.clientHeight, nw = img.naturalWidth || 1, nh = img.naturalHeight || 1;
      const scale = Math.max(fw / nw, fh / nh) * crop.zoom;
      const w = nw * scale, h = nh * scale;
      img.style.width = `${w}px`; img.style.height = `${h}px`;
      img.style.left = `${(fw - w) * crop.x / 100}px`; img.style.top = `${(fh - h) * crop.y / 100}px`;
      updateZoomLabel();
    };
    img.onload = fitStage;
    select.addEventListener('change', () => { crop.zoom = 1; crop.x = 50; crop.y = 50; updateCropWindow(); updateImage(); });

    const points = () => [...crop.pointers.values()];
    const distance = () => { const p = points(); return p.length < 2 ? 0 : Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); };
    const dragTarget = stage;
    dragTarget.addEventListener('pointerdown', event => {
      event.preventDefault(); dragTarget.setPointerCapture?.(event.pointerId);
      crop.pointers.set(event.pointerId, { x:event.clientX, y:event.clientY });
      if (crop.pointers.size === 2) { crop.startDistance = distance(); crop.startZoom = crop.zoom; }
    });
    dragTarget.addEventListener('pointermove', event => {
      if (!crop.pointers.has(event.pointerId)) return;
      event.preventDefault();
      const previous = crop.pointers.get(event.pointerId); crop.pointers.set(event.pointerId, { x:event.clientX, y:event.clientY });
      if (crop.pointers.size === 1) {
        crop.x = Math.max(0, Math.min(100, crop.x - ((event.clientX - previous.x) / Math.max(1, cropWindow.clientWidth)) * 100));
        crop.y = Math.max(0, Math.min(100, crop.y - ((event.clientY - previous.y) / Math.max(1, cropWindow.clientHeight)) * 100));
      } else if (crop.pointers.size === 2 && crop.startDistance) {
        crop.zoom = Math.max(1, Math.min(4, crop.startZoom * (distance() / crop.startDistance)));
      }
      updateImage();
    });
    const endPointer = event => { crop.pointers.delete(event.pointerId); if (crop.pointers.size < 2) crop.startDistance = 0; };
    dragTarget.addEventListener('pointerup', endPointer); dragTarget.addEventListener('pointercancel', endPointer);
    dragTarget.addEventListener('wheel', event => { event.preventDefault(); crop.zoom = Math.max(1, Math.min(4, crop.zoom * (event.deltaY < 0 ? 1.08 : .92))); updateImage(); }, {passive:false});
    const setZoom = value => { crop.zoom = Math.max(1, Math.min(4, value)); updateImage(); };
    zoomIn.addEventListener('click', () => setZoom(crop.zoom + .25)); zoomOut.addEventListener('click', () => setZoom(crop.zoom - .25));

    d.querySelector('.sf-cancel').onclick = () => { URL.revokeObjectURL(url); close(); input.value = ''; const st = state(input); if (st) st.textContent = ''; };
    d.addEventListener('cancel', event => { event.preventDefault(); URL.revokeObjectURL(url); close(); input.value = ''; const st = state(input); if (st) st.textContent = ''; });
    d.querySelector('.sf-done').onclick = async () => {
      const done = d.querySelector('.sf-done'); done.disabled = true; done.textContent = 'Preparing…';
      try {
        const ratio = select.value, blob = await makeCrop(file, ratio, crop.zoom, crop.x, crop.y);
        URL.revokeObjectURL(url); close(); showResult(input, file, blob, ratio); input.value = '';
        const st = state(input); if (st) st.textContent = 'Image prepared — press Upload';
      } catch (e) {
        done.disabled = false; done.textContent = 'Use image'; const help = d.querySelector('.sf-io-help'); if (help) help.textContent = e?.message || 'Could not prepare the image.';
      }
    };
    try { d.showModal(); } catch { d.setAttribute('open',''); }
  };

  const handleFile = (input, file) => {
    if (!target(input) || !file) return;
    const st = state(input); if (st) st.textContent = 'Image selected — adjust crop';
    try { open(input, file); } catch (e) { if (st) st.textContent = e?.message || 'Image selected'; }
  };

  document.addEventListener('change', event => {
    const input = event.target;
    if (!target(input)) return;
    const file = input.files?.[0]; if (!file) return;
    delete input.dataset.sfIoPickerOpened;
    handleFile(input, file);
    input.value = '';
    event.preventDefault(); event.stopImmediatePropagation();
  }, true);

  const bindInput = input => {
    if (!target(input) || input.dataset.sfIoBound === '1') return;
    input.dataset.sfIoBound = '1';
    input.addEventListener('click', () => {
      input.dataset.sfIoPickerOpened = '1';
      const started = Date.now();
      const check = () => {
        if (!target(input) || !input.dataset.sfIoPickerOpened) return;
        const file = input.files?.[0];
        if (file) { delete input.dataset.sfIoPickerOpened; handleFile(input, file); input.value = ''; return; }
        if (Date.now() - started < 2500) setTimeout(check, 100); else delete input.dataset.sfIoPickerOpened;
      };
      setTimeout(check, 120);
    }, false);
  };

  const scan = root => {
    if (!root) return;
    if (root.nodeType === 1 && target(root)) bindInput(root);
    root.querySelectorAll?.('input[type="file"][data-file-role="input"],input[type="file"][data-file-role="result"]').forEach(bindInput);
  };

  const init = () => { scan(document); if (window.MutationObserver) new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); }))).observe(document.body || document.documentElement, {childList:true,subtree:true}); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
})();
