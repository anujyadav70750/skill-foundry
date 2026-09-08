(() => {
  const RATIOS = [['Original','original'],['1:1','1:1'],['4:3','4:3'],['3:4','3:4'],['16:9','16:9'],['9:16','9:16']];
  let dialog = null;
  let active = null;

  const target = el => el instanceof HTMLInputElement && (el.dataset.fileRole === 'input' || el.dataset.fileRole === 'result');
  const host = input => input.closest('.media-item');
  const path = input => host(input)?.querySelector(`[data-role="${input.dataset.fileRole}"]`);
  const preview = input => host(input)?.querySelector(`[data-preview-role="${input.dataset.fileRole}"]`);
  const status = input => host(input)?.querySelector('[data-upload-state]');

  const style = document.createElement('style');
  style.textContent = `.sf-io-ratio{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(680px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;padding:18px;border:1px solid rgba(61,214,208,.3);border-radius:18px;background:#07111f;color:#eef6ff;box-shadow:0 28px 90px rgba(0,0,0,.6);z-index:2147483647}.sf-io-ratio::backdrop{background:rgba(2,7,13,.7);backdrop-filter:blur(9px)}.sf-io-ratio .sf-frame{position:relative;width:100%;overflow:hidden;border:1px solid rgba(61,214,208,.4);border-radius:14px;background:#050b13;touch-action:none}.sf-io-ratio .sf-frame img{position:absolute;max-width:none;pointer-events:none;user-select:none}.sf-io-ratio select,.sf-io-ratio button{min-height:42px;border:1px solid rgba(255,255,255,.14);border-radius:10px;background:rgba(255,255,255,.04);color:inherit;font:inherit;padding:0 12px}.sf-io-ratio select{width:100%;margin:8px 0 12px}.sf-io-actions{display:flex;gap:8px;margin-top:14px}.sf-io-actions .primary{border-color:rgba(61,214,208,.45);color:#3dd6d0;background:rgba(61,214,208,.1)}.sf-io-result{position:relative;margin-top:9px;padding:10px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(7,17,31,.45)}.sf-io-result img{display:block;width:min(100%,420px);max-height:280px;object-fit:contain;border-radius:10px}.sf-io-result .sf-upload{margin-top:9px;color:#3dd6d0;border-color:rgba(61,214,208,.4)}.sf-io-clear{position:absolute!important;top:8px;right:8px;width:30px!important;min-width:30px;padding:0!important;border-radius:50%!important}.sf-io-note{color:#9aaabd;font-size:12px;line-height:1.5;margin-top:9px}`;
  document.head.appendChild(style);

  const crop = async (file, ratio) => {
    if (ratio === 'original') return file;
    const bitmap = await createImageBitmap(file);
    const [rw,rh] = ratio.split(':').map(Number);
    const tr = rw/rh, sr = bitmap.width/bitmap.height;
    let cw=bitmap.width,ch=bitmap.height;
    if(sr>tr) cw=bitmap.height*tr; else ch=bitmap.width/tr;
    const sx=(bitmap.width-cw)/2, sy=(bitmap.height-ch)/2;
    const w=1600,h=Math.max(1,Math.round(w/tr));
    const canvas=document.createElement('canvas'); canvas.width=w; canvas.height=h;
    const ctx=canvas.getContext('2d'); if(!ctx) throw new Error('Could not prepare image.');
    ctx.drawImage(bitmap,sx,sy,cw,ch,0,0,w,h); bitmap.close?.();
    return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not prepare image.')),'image/jpeg',.92));
  };

  const close = () => { if(dialog){dialog.close?.();dialog.remove();dialog=null;} active=null; };

  const showResult = (input, file, blob, ratio) => {
    const p=preview(input), field=path(input); if(!p) return;
    p.className='image-preview has-image'; p.innerHTML='';
    const box=document.createElement('div'); box.className='sf-io-result';
    const img=document.createElement('img'); img.src=URL.createObjectURL(blob); img.alt='Selected image preview';
    const label=document.createElement('span'); label.textContent=`${file.name} · ${ratio==='original'?'Original':ratio}`;
    const upload=document.createElement('button'); upload.type='button'; upload.className='sf-upload'; upload.textContent='Upload';
    const msg=document.createElement('span'); msg.className='upload-state'; msg.textContent='Ready to upload';
    upload.onclick=async()=>{ upload.disabled=true; upload.textContent='Uploading…'; msg.textContent='Uploading to website…'; try{
      const base=file.name.replace(/\.[^.]+$/,''); const rn=ratio==='original'?'original':ratio.replace(':','x'); const name=`${base}-${input.dataset.fileRole}-${rn}.jpg`;
      const r=await fetch('/api/upload-image',{method:'POST',headers:{'Content-Type':blob.type||'image/jpeg','X-File-Name':encodeURIComponent(name)},body:blob,credentials:'same-origin'});
      const data=await r.json().catch(()=>({})); if(!r.ok||!data.path) throw new Error(data.error||`Upload failed (${r.status}).`);
      if(field) field.value=data.path; upload.textContent='Done'; msg.textContent='Uploaded to website'; msg.className='upload-state success';
    }catch(e){upload.disabled=false;upload.textContent='Upload';msg.textContent=e.message||'Upload failed';msg.className='upload-state error';}};
    const clear=document.createElement('button'); clear.type='button'; clear.className='sf-io-clear'; clear.textContent='×'; clear.onclick=()=>{URL.revokeObjectURL(img.src);if(field)field.value='';input.value='';p.className='image-preview';p.innerHTML='';};
    box.append(img,label,upload,msg,clear); p.append(box);
  };

  const open = (input,file) => {
    close(); active={input,file};
    const d=document.createElement('dialog'); d.className='sf-io-ratio';
    const role=input.dataset.fileRole==='input'?'input':'output';
    d.innerHTML=`<strong>Adjust ${role} image</strong><select aria-label="Image ratio">${RATIOS.map(([a,v])=>`<option value="${v}">${a}</option>`).join('')}</select><div class="sf-frame"><img></div><div class="sf-io-note">Choose the display ratio. The image is automatically cropped to that shape. Nothing is uploaded until you press Upload.</div><div class="sf-io-actions"><button type="button" class="primary sf-done">Done</button><button type="button" class="sf-cancel">Cancel</button></div>`;
    document.body.append(d); dialog=d;
    const img=d.querySelector('img'), frame=d.querySelector('.sf-frame'), select=d.querySelector('select');
    const url=URL.createObjectURL(file); img.src=url;
    const fit=()=>{const val=select.value;let rw,rh;if(val==='original'){rw=img.naturalWidth||1;rh=img.naturalHeight||1}else [rw,rh]=val.split(':').map(Number);frame.style.aspectRatio=`${rw}/${rh}`;const fw=frame.clientWidth,fh=frame.clientHeight,nw=img.naturalWidth||1,nh=img.naturalHeight||1,s=Math.max(fw/nw,fh/nh),w=nw*s,h=nh*s;img.style.width=w+'px';img.style.height=h+'px';img.style.left=(fw-w)/2+'px';img.style.top=(fh-h)/2+'px';};
    img.onload=fit; select.onchange=fit;
    d.querySelector('.sf-cancel').onclick=()=>{URL.revokeObjectURL(url);close();input.value='';};
    d.oncancel=e=>{e.preventDefault();URL.revokeObjectURL(url);close();input.value='';};
    d.querySelector('.sf-done').onclick=async()=>{const done=d.querySelector('.sf-done');done.disabled=true;try{const ratio=select.value;const blob=await crop(file,ratio);URL.revokeObjectURL(url);showResult(input,file,blob,ratio);close();input.value='';}catch(e){done.disabled=false;d.querySelector('.sf-io-note').textContent=e.message||'Could not prepare image.';}};
    d.showModal();
  };

  window.addEventListener('change', event => {
    const input=event.target; if(!target(input)) return;
    const file=input.files?.[0]; if(!file) return;
    event.preventDefault(); event.stopImmediatePropagation();
    open(input,file);
  }, true);
})();
