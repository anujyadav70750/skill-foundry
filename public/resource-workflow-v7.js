(() => {
  const steps = [
    {
      title: 'Create the dressed character image', tool: 'Google Flow', toolUrl: 'https://labs.google/fx/tools/flow', purpose: 'IMAGE GENERATION',
      inputs: [
        { type: 'image', label: 'Character reference', role: 'Primary identity reference' },
        { type: 'image', label: 'Dress reference', role: 'Clothing / outfit reference' }
      ],
      settings: [['MODEL', 'Nano Banana Pro'], ['ASPECT RATIO', '9:16']],
      prompt: 'Use the uploaded character image as the primary identity reference. Preserve the character’s facial identity, facial structure, hairstyle, skin tone, and overall appearance. Use the uploaded dress image as the clothing reference and replace the character’s current outfit with the referenced dress. Keep the character’s identity and proportions consistent. Create a polished vertical 9:16 image with natural lighting, realistic fabric details, and a clean cinematic presentation.',
      output: 'Dressed character image', next: 'Use this generated character image as the reference for the first video clip.'
    },
    {
      title: 'Generate video clip 01', tool: 'Google Flow', toolUrl: 'https://labs.google/fx/tools/flow', purpose: 'VIDEO GENERATION',
      inputs: [{ type: 'image', label: 'Dressed character image', role: 'Starting frame / character reference' }],
      settings: [['MODEL', 'Gemini Omni'], ['ASPECT RATIO', '9:16'], ['DURATION', '10 sec']],
      prompt: 'Use the uploaded dressed character image as the primary visual reference. Keep the same character identity, outfit, appearance, and visual style. Animate the character naturally according to the supplied scene direction, with realistic movement and a consistent vertical 9:16 composition. Create one clean 10-second video clip.',
      output: 'Video Clip 01', next: 'Repeat the same production setup for Clip 02 while keeping the character and outfit consistent.'
    },
    {
      title: 'Generate video clip 02', tool: 'Google Flow', toolUrl: 'https://labs.google/fx/tools/flow', purpose: 'VIDEO GENERATION',
      inputs: [{ type: 'video', label: 'Clip 01 / continuity reference', role: 'Previous clip reference' }, { type: 'image', label: 'Dressed character image', role: 'Character consistency reference' }],
      settings: [['MODEL', 'Gemini Omni'], ['ASPECT RATIO', '9:16'], ['DURATION', '10 sec']],
      prompt: 'Continue the same visual character and outfit established in Clip 01. Use the supplied reference assets to maintain identity, clothing, lighting, framing, and overall visual continuity. Generate the next natural 10-second vertical clip with the new scene direction.',
      output: 'Video Clip 02', next: 'Use Clip 02 as the continuity reference for the third clip.'
    },
    {
      title: 'Generate video clip 03', tool: 'Google Flow', toolUrl: 'https://labs.google/fx/tools/flow', purpose: 'VIDEO GENERATION',
      inputs: [{ type: 'video', label: 'Clip 02 / continuity reference', role: 'Previous clip reference' }, { type: 'image', label: 'Dressed character image', role: 'Character consistency reference' }],
      settings: [['MODEL', 'Gemini Omni'], ['ASPECT RATIO', '9:16'], ['DURATION', '10 sec']],
      prompt: 'Continue the same character, outfit, visual language, lighting, and vertical framing established by the previous clips. Use the supplied continuity reference and character image to keep the result visually consistent. Generate the final 10-second clip with the required closing scene direction.',
      output: 'Video Clip 03', next: 'Bring Clips 01, 02, and 03 into CapCut for the final edit.'
    },
    {
      title: 'Assemble the final video', tool: 'CapCut', toolUrl: 'https://www.capcut.com/', purpose: 'VIDEO EDITING',
      inputs: [{ type: 'video', label: 'Video Clip 01', role: 'First sequence' }, { type: 'video', label: 'Video Clip 02', role: 'Second sequence' }, { type: 'video', label: 'Video Clip 03', role: 'Third sequence' }],
      settings: [['FORMAT', '9:16'], ['EDIT', 'Trim + arrange + transitions'], ['OUTPUT', 'Final vertical video']],
      prompt: 'Import Video Clip 01, Video Clip 02, and Video Clip 03. Arrange them in the intended order, trim timing where needed, add clean transitions only where they improve continuity, check the pacing, and export the completed vertical video.',
      output: 'Final edited vertical video', next: 'Final result is ready to publish or share.'
    }
  ];

  const css = `
    .workflow-section.sf-v7,.workflow-section.sf-v7 *{box-sizing:border-box}
    .workflow-section.sf-v7 .workflow-list{display:grid!important;gap:28px!important;width:100%!important;min-width:0!important}
    .workflow-section.sf-v7 .workflow-card{position:relative;width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:20px 16px!important;border:1px solid rgba(148,163,184,.18)!important;border-radius:22px!important;background:linear-gradient(180deg,rgba(12,27,43,.96),rgba(7,20,34,.94))!important;overflow:visible!important}
    .workflow-section.sf-v7 .workflow-body{display:grid!important;gap:16px!important;width:100%!important;min-width:0!important;margin-top:18px!important;opacity:1!important;overflow:visible!important}
    .workflow-section.sf-v7 .workflow-chevron,.workflow-section.sf-v7 .workflow-node{display:none!important}
    .workflow-section.sf-v7 .workflow-connector{display:block!important;position:absolute!important;left:39px!important;bottom:-28px!important;width:1px!important;height:27px!important;background:rgba(61,214,208,.28)!important}
    .workflow-section.sf-v7 .workflow-connector:after{content:'↓';position:absolute;left:-7px;bottom:-9px;color:var(--accent);font-size:13px;line-height:1}
    .sf-v7-tool{display:flex;align-items:center;gap:12px;min-width:0}.sf-v7-tool a{display:grid;place-items:center;flex:0 0 46px;width:46px;height:46px;padding:4px;border:1px solid rgba(148,163,184,.28);border-radius:14px;background:rgba(255,255,255,.04);overflow:hidden;text-decoration:none}.sf-v7-tool img{width:38px;height:38px;object-fit:contain;border-radius:9px}.sf-v7-purpose{min-width:0}.sf-v7-purpose b{display:block;color:var(--accent);font-size:8px;letter-spacing:.14em}.sf-v7-purpose span{display:block;margin-top:3px;color:var(--text);font-size:11px;line-height:1.4;font-weight:750;overflow-wrap:anywhere}
    .sf-v7-rail{display:flex;gap:8px;width:100%;min-width:0;max-width:100%;overflow-x:auto;overflow-y:hidden;padding:2px 2px 8px;scroll-snap-type:x proximity}.sf-v7-input{flex:0 0 210px;max-width:82vw;min-width:0;min-height:120px;padding:0 12px 12px;border:1px solid var(--line);border-radius:16px;background:rgba(16,34,56,.42);scroll-snap-align:start;overflow:hidden}.sf-v7-type{display:block;width:max-content;margin:0 -12px 12px;padding:5px 10px;border-bottom-right-radius:10px;color:#07111f;font-size:8px;font-weight:950;letter-spacing:.12em}.sf-v7-type.image{background:#67e8f9}.sf-v7-type.video{background:#c4b5fd}.sf-v7-type.audio{background:#86efac}.sf-v7-type.text{background:#fde68a}.sf-v7-type.document{background:#fdba74}.sf-v7-input strong{display:block;color:var(--text);font-size:12px;line-height:1.4}.sf-v7-input small{display:block;margin-top:6px;color:var(--muted);font-size:10px;line-height:1.45}.sf-v7-missing{display:grid;place-items:center;min-height:58px;margin-bottom:9px;border:1px dashed rgba(61,214,208,.24);border-radius:10px;color:var(--muted);font-size:9px;letter-spacing:.08em;text-transform:uppercase}
    .sf-v7-arrow{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:9px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.sf-v7-arrow:before{content:'↓';display:grid;place-items:center;width:24px;height:24px;border:1px solid rgba(61,214,208,.28);border-radius:50%;color:var(--accent);font-size:13px;flex:0 0 24px}
    .sf-v7-settings{display:flex;gap:7px;width:100%;min-width:0;overflow-x:auto;padding-bottom:2px}.sf-v7-setting{flex:0 0 auto;padding:8px 10px;border:1px solid var(--line);border-radius:11px;background:rgba(16,34,56,.32)}.sf-v7-setting b{display:block;color:var(--muted);font-size:8px;letter-spacing:.1em}.sf-v7-setting span{display:block;margin-top:2px;color:var(--text);font-size:11px;font-weight:800}
    .sf-v7-action{width:100%;max-width:100%;min-width:0;overflow:hidden;border:1px solid var(--line);border-radius:15px;background:var(--surface)}.sf-v7-head{display:grid;grid-template-columns:56px minmax(0,1fr) 66px;width:100%;min-width:0}.sf-v7-head button{min-width:0;min-height:42px;white-space:nowrap;padding:0 7px;border:0;background:rgba(16,34,56,.45);color:var(--text);font:inherit;font-size:11px;font-weight:850;overflow:hidden}.sf-v7-head .title{display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:9px;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sf-v7-prompt{height:132px;min-height:132px;max-height:132px;margin:0;padding:13px 14px;overflow-y:auto;overflow-x:hidden;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--text)}.sf-v7-download{display:block;width:100%;min-height:40px;border:0;border-top:1px solid var(--line);background:rgba(16,34,56,.45);color:var(--text);font:inherit;font-size:11px;font-weight:850}.sf-v7-output{width:100%;padding:13px 14px;border:1px solid rgba(61,214,208,.22);border-radius:14px;background:rgba(7,24,35,.36);color:var(--text);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.sf-v7-final{margin-top:22px;padding-top:24px;border-top:1px solid var(--line)}.sf-v7-final-card{padding:18px;border:1px solid rgba(61,214,208,.24);border-radius:18px;background:linear-gradient(180deg,rgba(12,31,45,.9),rgba(7,20,34,.9))}.sf-v7-final-badge{display:inline-block;color:var(--accent);font-size:8px;font-weight:900;letter-spacing:.14em}.sf-v7-final-card h3{margin:7px 0 5px;color:var(--text);font-size:18px}.sf-v7-final-card p{margin:0;color:var(--muted);font-size:11px;line-height:1.5}
    @media(max-width:420px){.workflow-section.sf-v7 .workflow-card{padding:18px 14px!important;border-radius:20px!important}.workflow-section.sf-v7 .workflow-list{gap:26px!important}.sf-v7-input{flex-basis:190px}.sf-v7-head{grid-template-columns:54px minmax(0,1fr) 64px}.sf-v7-head button{font-size:10px;padding-left:5px;padding-right:5px}}
  `;

  const escapeText = value => String(value ?? '');
  const copy = async text => { try { await navigator.clipboard.writeText(text); } catch {} };
  const downloadPdf = (text, name) => {
    const esc = s => String(s).replace(/[^\x20-\x7E]/g,'?').replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
    const lines=[]; String(text).split(/\r?\n/).forEach(line=>{let x=line;while(x.length>82){let n=x.lastIndexOf(' ',82);if(n<1)n=82;lines.push(x.slice(0,n));x=x.slice(n).trimStart()}lines.push(x)});
    const enc=new TextEncoder(), chunks=[], add=s=>chunks.push(enc.encode(s)); add('%PDF-1.4\n'); const body=['BT','/F1 10 Tf','48 760 Td','13 TL']; lines.forEach(x=>body.push(`(${esc(x)}) Tj`,'T*')); body.push('ET'); const stream=body.join('\n'); const objects=['1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n','2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n','3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj\n','4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Courier >> endobj\n',`5 0 obj << /Length ${enc.encode(stream).length} >> stream\n${stream}\nendstream endobj\n`]; const offsets=[]; objects.forEach(o=>{offsets.push(chunks.reduce((a,b)=>a+b.length,0));add(o)}); const start=chunks.reduce((a,b)=>a+b.length,0); add(`xref\n0 6\n0000000000 65535 f \n${offsets.map(n=>String(n).padStart(10,'0')+' 00000 n ').join('\n')}\ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`); const url=URL.createObjectURL(new Blob(chunks,{type:'application/pdf'})); const a=document.createElement('a');a.href=url;a.download=(name.toLowerCase().replace(/[^a-z0-9]+/g,'-')||'skill-foundry-workflow')+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };

  function init(){
    const section=document.querySelector('.workflow-section'); if(!section)return;
    const cards=[...section.querySelectorAll('.workflow-card')]; if(!cards.length)return;
    if(!document.getElementById('sf-workflow-v7-style')){const s=document.createElement('style');s.id='sf-workflow-v7-style';s.textContent=css;document.head.appendChild(s)}
    section.classList.add('sf-v7');
    const list=section.querySelector('.workflow-list');
    cards.forEach((card,i)=>{
      const step=steps[i]; if(!step)return;
      card.querySelector('h3').textContent=step.title;
      const body=card.querySelector('.workflow-body'); body.innerHTML='';
      const tool=document.createElement('div');tool.className='sf-v7-tool';
      const link=document.createElement('a');link.href=step.toolUrl;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',step.tool);
      const img=document.createElement('img');img.alt='';img.src='/api/tool-logo?url='+encodeURIComponent(step.toolUrl);link.append(img);tool.append(link);
      const purpose=document.createElement('div');purpose.className='sf-v7-purpose';purpose.innerHTML='<b>TOOL USED FOR</b><span>'+escapeText(step.purpose)+'</span>';tool.append(purpose);body.append(tool);
      const start=document.createElement('div');start.className='sf-v7-start';start.innerHTML='<div style="color:var(--text);font-size:18px;line-height:1.2;margin-bottom:10px">START WITH</div>';body.append(start);
      const rail=document.createElement('div');rail.className='sf-v7-rail'; step.inputs.forEach(input=>{const chip=document.createElement('div');chip.className='sf-v7-input';chip.innerHTML='<span class="sf-v7-type '+input.type+'">'+input.type.toUpperCase()+'</span>'; if(input.src){const im=document.createElement('img');im.src=input.src;im.alt=input.label;im.style='display:block;width:100%;aspect-ratio:16/10;object-fit:cover;margin:-1px 0 10px;border-radius:9px';chip.append(im)} else {const miss=document.createElement('div');miss.className='sf-v7-missing';miss.textContent='Reference asset';chip.append(miss)} const strong=document.createElement('strong');strong.textContent=input.label;chip.append(strong);const small=document.createElement('small');small.textContent=input.role;chip.append(small);rail.append(chip)});start.append(rail);
      if(step.settings.length){const set=document.createElement('div');set.className='sf-v7-settings';step.settings.forEach(pair=>{const x=document.createElement('div');x.className='sf-v7-setting';x.innerHTML='<b>'+escapeText(pair[0])+'</b><span>'+escapeText(pair[1])+'</span>';set.append(x)});body.append(set)}
      const arrow=document.createElement('div');arrow.className='sf-v7-arrow';arrow.textContent='DO THIS';body.append(arrow);
      const action=document.createElement('div');action.className='sf-v7-action';const head=document.createElement('div');head.className='sf-v7-head';const c=document.createElement('button');c.type='button';c.textContent='Copy';const title=document.createElement('div');title.className='title';title.textContent='STEP ACTION';const e=document.createElement('button');e.type='button';e.textContent='Expand';head.append(c,title,e);const pre=document.createElement('pre');pre.className='sf-v7-prompt';pre.textContent=step.prompt;const dl=document.createElement('button');dl.type='button';dl.className='sf-v7-download';dl.textContent='Download PDF';action.append(head,pre,dl);body.append(action);c.onclick=()=>copy(step.prompt);e.onclick=()=>{pre.style.height=pre.style.height==='420px'?'132px':'420px';pre.style.maxHeight=pre.style.height};dl.onclick=()=>downloadPdf(step.prompt,step.title);const outArrow=document.createElement('div');outArrow.className='sf-v7-arrow';outArrow.textContent='YOU GET';body.append(outArrow);const output=document.createElement('div');output.className='sf-v7-output';output.textContent=step.output;body.append(output);const nextArrow=document.createElement('div');nextArrow.className='sf-v7-arrow';nextArrow.textContent='NEXT STEP';body.append(nextArrow);const next=document.createElement('div');next.className='sf-v7-output';next.textContent=step.next;body.append(next);
    });
    const oldResults=document.querySelector('.results-section'); if(oldResults)oldResults.style.display='none';
    const oldPromptLink=section.querySelector('.workflow-prompt-link'); if(oldPromptLink)oldPromptLink.style.display='none';
    let final=document.querySelector('.sf-v7-final'); if(!final){final=document.createElement('div');final.className='sf-v7-final';final.innerHTML='<p class="eyebrow">FINAL RESULT</p><div class="sf-v7-final-card"><span class="sf-v7-final-badge">OUTPUT</span><h3>Final edited vertical video</h3><p>Three 10-second clips assembled into the completed 9:16 video. The actual final media thumbnail can be attached to this workflow once the generated video asset is uploaded to the resource.</p></div>';section.append(final)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
