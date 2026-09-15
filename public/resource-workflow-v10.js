(() => {
  const getData = () => {
    const node = document.getElementById('sf-workflow-data');
    if (!node) return [];
    try { return JSON.parse(node.textContent || '[]'); } catch { return []; }
  };

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));

  const css = `
    .workflow-section.sf-v7,.workflow-section.sf-v7 *{box-sizing:border-box}
    .workflow-section.sf-v7 .workflow-list{display:grid!important;gap:28px!important;width:100%!important;min-width:0!important}
    .workflow-section.sf-v7 .workflow-card{position:relative;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:20px 16px!important;border:1px solid rgba(148,163,184,.18)!important;border-radius:22px!important;background:linear-gradient(180deg,rgba(12,27,43,.96),rgba(7,20,34,.94))!important;overflow:visible!important}
    .workflow-section.sf-v7 .workflow-body{display:grid!important;gap:16px!important;width:100%!important;min-width:0!important;margin-top:18px!important;opacity:1!important;overflow:visible!important}
    .workflow-section.sf-v7 .workflow-chevron,.workflow-section.sf-v7 .workflow-node{display:none!important}
    .workflow-section.sf-v7 .workflow-connector{display:block!important;position:absolute!important;left:39px!important;bottom:-28px!important;width:1px!important;height:27px!important;background:rgba(61,214,208,.28)!important}
    .workflow-section.sf-v7 .workflow-connector:after{content:'↓';position:absolute;left:-7px;bottom:-9px;color:var(--accent);font-size:13px;line-height:1}
    .sf-v7-label{margin:0 0 8px;color:var(--muted);font-size:9px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
    .sf-v7-tool{display:flex;align-items:center;gap:12px;min-width:0}.sf-v7-tool a{display:grid;place-items:center;flex:0 0 48px;width:48px;height:48px;padding:4px;border:1px solid rgba(148,163,184,.28);border-radius:14px;background:rgba(255,255,255,.04);overflow:hidden;text-decoration:none}.sf-v7-tool img{width:40px;height:40px;object-fit:contain;border-radius:9px}.sf-v7-purpose{min-width:0}.sf-v7-purpose span{display:block;color:var(--text);font-size:12px;line-height:1.4;font-weight:850;overflow-wrap:anywhere}
    .sf-v7-settings{display:flex;gap:7px;width:100%;min-width:0;overflow-x:auto;padding:0 0 2px}.sf-v7-setting{flex:0 0 auto;padding:8px 10px;border:1px solid var(--line);border-radius:11px;background:rgba(16,34,56,.32)}.sf-v7-setting b{display:block;color:var(--muted);font-size:8px;letter-spacing:.1em}.sf-v7-setting span{display:block;margin-top:2px;color:var(--text);font-size:11px;font-weight:800}
    .sf-v7-inputs-note{margin:0 0 12px;color:var(--muted);font-size:10px;line-height:1.45}
    .sf-v7-rail{display:flex;gap:8px;width:100%;min-width:0;max-width:100%;overflow-x:auto;overflow-y:hidden;padding:2px 2px 8px;scroll-snap-type:x proximity}.sf-v7-input{flex:0 0 210px;max-width:82vw;min-width:0;min-height:120px;padding:0 12px 12px;border:1px solid var(--line);border-radius:16px;background:rgba(16,34,56,.42);scroll-snap-align:start;overflow:hidden}.sf-v7-type{display:block;width:max-content;margin:0 -12px 12px;padding:5px 10px;border-bottom-right-radius:10px;color:#07111f;font-size:8px;font-weight:950;letter-spacing:.12em}.sf-v7-type.image{background:#67e8f9}.sf-v7-type.video{background:#c4b5fd}.sf-v7-type.audio{background:#86efac}.sf-v7-type.text{background:#fde68a}.sf-v7-type.document{background:#fdba74}.sf-v7-input-media{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;margin:-1px 0 10px;border-radius:9px}.sf-v7-input strong{display:block;color:var(--text);font-size:12px;line-height:1.4}.sf-v7-input small{display:block;margin-top:6px;color:var(--muted);font-size:10px;line-height:1.45}
    .sf-v7-arrow{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:9px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.sf-v7-arrow:before{content:'↓';display:grid;place-items:center;width:24px;height:24px;border:1px solid rgba(61,214,208,.28);border-radius:50%;color:var(--accent);font-size:13px;flex:0 0 24px}
    .sf-v7-action{width:100%;max-width:100%;min-width:0;overflow:hidden;border:1px solid var(--line);border-radius:15px;background:var(--surface)}.sf-v7-head{display:grid;grid-template-columns:56px minmax(0,1fr) 66px;width:100%;min-width:0}.sf-v7-head button{min-width:0;min-height:42px;white-space:nowrap;padding:0 7px;border:0;background:rgba(16,34,56,.45);color:var(--text);font:inherit;font-size:11px;font-weight:850;overflow:hidden}.sf-v7-head .title{display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:9px;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sf-v7-prompt{height:132px;min-height:132px;max-height:132px;margin:0;padding:13px 14px;overflow-y:auto;overflow-x:hidden;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--text)}.sf-v7-download{display:block;width:100%;min-height:40px;border:0;border-top:1px solid var(--line);background:rgba(16,34,56,.45);color:var(--text);font:inherit;font-size:11px;font-weight:850}.sf-v7-output{width:100%;padding:13px 14px;border:1px solid rgba(61,214,208,.22);border-radius:14px;background:rgba(7,24,35,.36);color:var(--text);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.sf-v7-final{margin-top:22px;padding-top:24px;border-top:1px solid var(--line)}.sf-v7-final-card{padding:18px;border:1px solid rgba(61,214,208,.24);border-radius:18px;background:linear-gradient(180deg,rgba(12,31,45,.9),rgba(7,20,34,.9))}.sf-v7-final-badge{display:inline-block;color:var(--accent);font-size:8px;font-weight:900;letter-spacing:.14em}.sf-v7-final-card h3{margin:7px 0 5px;color:var(--text);font-size:18px}.sf-v7-final-card p{margin:0;color:var(--muted);font-size:11px;line-height:1.5}
    @media(max-width:420px){.workflow-section.sf-v7 .workflow-card{padding:18px 14px!important;border-radius:20px!important}.workflow-section.sf-v7 .workflow-list{gap:26px!important}.sf-v7-input{flex-basis:190px}.sf-v7-head{grid-template-columns:54px minmax(0,1fr) 64px}.sf-v7-head button{font-size:10px;padding-left:5px;padding-right:5px}.sf-v7-tool a{flex-basis:46px;width:46px;height:46px}.sf-v7-tool img{width:38px;height:38px}}
  `;

  const downloadPdf = (text, name) => {
    const esc = (value) => String(value).replace(/[^\x20-\x7E]/g,'?').replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
    const lines=[]; String(text).split(/\r?\n/).forEach(line=>{let x=line;while(x.length>78){let n=x.lastIndexOf(' ',78);if(n<1)n=78;lines.push(x.slice(0,n));x=x.slice(n).trimStart()}lines.push(x)});
    const enc=new TextEncoder(), chunks=[], add=s=>chunks.push(enc.encode(s)); add('%PDF-1.4\n'); const body=['BT','/F1 10 Tf','48 760 Td','13 TL']; lines.forEach(x=>body.push(`(${esc(x)}) Tj`,'T*')); body.push('ET'); const stream=body.join('\n'); const objects=['1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n','2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n','3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n','4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Courier >> endobj\n',`5 0 obj << /Length ${enc.encode(stream).length} >> stream\n${stream}\nendstream endobj\n`]; const offsets=[]; objects.forEach(o=>{offsets.push(chunks.reduce((a,b)=>a+b.length,0));add(o)}); const start=chunks.reduce((a,b)=>a+b.length,0); add(`xref\n0 6\n0000000000 65535 f \n${offsets.map(n=>String(n).padStart(10,'0')+' 00000 n ').join('\n')}\ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`); const url=URL.createObjectURL(new Blob(chunks,{type:'application/pdf'})); const a=document.createElement('a');a.href=url;a.download=(String(name).toLowerCase().replace(/[^a-z0-9]+/g,'-')||'skill-foundry-prompt')+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };

  const openPrompt = (text, title) => {
    const dialog=document.createElement('dialog'); dialog.className='prompt-dialog';
    dialog.innerHTML='<div class="dialog-card"><div class="section-heading"><div><p class="eyebrow">FULL PROMPT</p><h2></h2></div><button type="button" class="dialog-close" aria-label="Close prompt">×</button></div><pre></pre><button class="button button-primary" type="button">Copy full prompt</button></div>';
    dialog.querySelector('h2').textContent=title||'Full Prompt'; dialog.querySelector('pre').textContent=text;
    const close=()=>dialog.close(); dialog.querySelector('.dialog-close').addEventListener('click',close); dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
    dialog.querySelector('.button').addEventListener('click',async(e)=>{try{await navigator.clipboard.writeText(text);e.currentTarget.textContent='Copied';setTimeout(()=>{if(e.currentTarget.isConnected)e.currentTarget.textContent='Copy full prompt'},1200)}catch{}});
    document.body.appendChild(dialog); dialog.addEventListener('close',()=>dialog.remove(),{once:true}); dialog.showModal();
  };

  function init(){
    const section=document.querySelector('.workflow-section'); if(!section)return;
    const steps=getData(); const cards=[...section.querySelectorAll('.workflow-card')]; if(!cards.length)return;
    if(!document.getElementById('sf-workflow-v10-style')){const s=document.createElement('style');s.id='sf-workflow-v10-style';s.textContent=css;document.head.appendChild(s)}
    section.classList.add('sf-v7');
    cards.forEach((card,index)=>{
      const step=steps[index]||{}; const body=card.querySelector('.workflow-body'); if(!body)return;
      const title=card.querySelector('h3'); if(title&&step.title)title.textContent=step.title;
      body.innerHTML='';

      if(step.tool){
        const label=document.createElement('div');label.className='sf-v7-label';label.textContent='TOOL USED';body.append(label);
        const tool=document.createElement('div');tool.className='sf-v7-tool';
        if(step.toolUrl){const link=document.createElement('a');link.href=step.toolUrl;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',step.tool);const img=document.createElement('img');img.alt='';img.src='/api/tool-logo?url='+encodeURIComponent(step.toolUrl);link.append(img);tool.append(link)}
        const purpose=document.createElement('div');purpose.className='sf-v7-purpose';const span=document.createElement('span');span.textContent=step.toolPurpose||step.tool;purpose.append(span);tool.append(purpose);body.append(tool);
      }

      const settings=Array.isArray(step.settings)?step.settings.filter(s=>s&&s.label):[];
      if(settings.length){
        const label=document.createElement('div');label.className='sf-v7-label';label.textContent='SETTINGS';body.append(label);
        const row=document.createElement('div');row.className='sf-v7-settings';settings.forEach(setting=>{const item=document.createElement('div');item.className='sf-v7-setting';item.innerHTML='<b>'+escapeHtml(setting.label)+'</b><span>'+escapeHtml(setting.value)+'</span>';row.append(item)});body.append(row);
      }

      const inputs=Array.isArray(step.inputs)?step.inputs.filter(Boolean):[];
      if(inputs.length || step.input){
        const label=document.createElement('div');label.className='sf-v7-label';label.textContent='INPUTS';body.append(label);
        const note=document.createElement('p');note.className='sf-v7-inputs-note';note.textContent='Add the required input(s) for this step.';body.append(note);
        const rail=document.createElement('div');rail.className='sf-v7-rail';
        const sourceInputs=inputs.length?inputs:[{type:'text',label:step.input,role:''}];
        sourceInputs.forEach(input=>{const chip=document.createElement('div');chip.className='sf-v7-input';const type=input.type||'text';chip.innerHTML='<span class="sf-v7-type '+escapeHtml(type)+'">'+escapeHtml(type.toUpperCase())+'</span>'+(input.src?'<img class="sf-v7-input-media" src="'+escapeHtml(input.src)+'" alt="">':'')+'<strong>'+escapeHtml(input.label||'Input')+'</strong>'+(input.role?'<small>'+escapeHtml(input.role)+'</small>':'');rail.append(chip)});body.append(rail);
      }

      if(step.process){
        const label=document.createElement('div');label.className='sf-v7-label';label.textContent='PROCESS / PROMPT';body.append(label);
        const action=document.createElement('div');action.className='sf-v7-action';
        const head=document.createElement('div');head.className='sf-v7-head';
        const copy=document.createElement('button');copy.type='button';copy.textContent='Copy';
        const heading=document.createElement('div');heading.className='title';heading.textContent='Full Prompt';
        const expand=document.createElement('button');expand.type='button';expand.textContent='Expand';head.append(copy,heading,expand);
        const pre=document.createElement('pre');pre.className='sf-v7-prompt';pre.textContent=step.process;
        const download=document.createElement('button');download.type='button';download.className='sf-v7-download';download.textContent='Download PDF';action.append(head,pre,download);body.append(action);
        copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(step.process);copy.textContent='Copied';setTimeout(()=>{if(copy.isConnected)copy.textContent='Copy'},1200)}catch{}});
        expand.addEventListener('click',()=>openPrompt(step.process,step.title)); download.addEventListener('click',()=>downloadPdf(step.process,step.title));
      }

      if(step.output){const label=document.createElement('div');label.className='sf-v7-label';label.textContent='OUTPUT';body.append(label);const output=document.createElement('div');output.className='sf-v7-output';output.textContent=step.output;body.append(output)}
      if(step.next){const label=document.createElement('div');label.className='sf-v7-label';label.textContent='NEXT STEP';body.append(label);const next=document.createElement('div');next.className='sf-v7-arrow';next.textContent=step.next;body.append(next)}
    });
    section.querySelectorAll('.workflow-connector').forEach((node)=>node.remove());
    cards.forEach((card,index)=>{if(index<cards.length-1){const connector=document.createElement('div');connector.className='workflow-connector';connector.setAttribute('aria-hidden','true');card.append(connector)}});
    section.classList.add('sf-workflow-ready');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();