import('/resource-workflow-v3.js').then(() => {
  const init = () => {
    const section = document.querySelector('.workflow-section.sf-v3');
    if (!section) return;
    if (!document.querySelector('#sf-workflow-v5-style')) {
      const style = document.createElement('style');
      style.id = 'sf-workflow-v5-style';
      style.textContent = `
        .workflow-section.sf-v3,.workflow-section.sf-v3 *{box-sizing:border-box}
        .workflow-section.sf-v3 .workflow-list{display:grid!important;gap:28px!important;width:100%!important;min-width:0!important}
        .workflow-section.sf-v3 .workflow-card{width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:20px 16px!important;border:1px solid rgba(148,163,184,.18)!important;border-radius:22px!important;background:linear-gradient(180deg,rgba(12,27,43,.96),rgba(7,20,34,.94))!important;overflow:visible!important}
        .workflow-section.sf-v3 .workflow-body{display:grid!important;gap:16px!important;width:100%!important;min-width:0!important;margin-top:18px!important;opacity:1!important;overflow:visible!important}
        .workflow-section.sf-v3 .workflow-chevron{display:none!important}
        .workflow-section.sf-v3 .workflow-connector{display:block!important;position:absolute!important;left:39px!important;bottom:-28px!important;width:1px!important;height:27px!important;background:rgba(61,214,208,.28)!important}
        .workflow-section.sf-v3 .workflow-connector:after{bottom:-8px!important}
        .workflow-section.sf-v3 .sf-tool-row{display:flex!important;align-items:center!important;gap:12px!important;width:100%!important;min-width:0!important}
        .workflow-section.sf-v3 .sf-tool-logo-link{display:grid!important;place-items:center!important;flex:0 0 46px!important;width:46px!important;height:46px!important;padding:4px!important;border:1px solid rgba(148,163,184,.28)!important;border-radius:14px!important;background:rgba(255,255,255,.04)!important;overflow:hidden!important;text-decoration:none!important}
        .workflow-section.sf-v3 .sf-tool-logo-link img{display:block!important;width:38px!important;height:38px!important;max-width:38px!important;max-height:38px!important;object-fit:contain!important;border-radius:9px!important}
        .workflow-section.sf-v3 .sf-tool-purpose{display:grid!important;gap:3px!important;min-width:0!important}
        .workflow-section.sf-v3 .sf-tool-purpose-label{color:var(--accent)!important;font-size:8px!important;line-height:1.1!important;font-weight:900!important;letter-spacing:.14em!important;text-transform:uppercase!important}
        .workflow-section.sf-v3 .sf-tool-purpose-text{color:var(--text)!important;font-size:11px!important;line-height:1.4!important;font-weight:700!important;overflow-wrap:anywhere!important}
        .workflow-section.sf-v3 .sf-rail{display:flex!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important}
        .workflow-section.sf-v3 .sf-input-chip{max-width:82vw!important}
        .workflow-section.sf-v3 .sf-image-chip{flex:0 0 210px!important}
        .workflow-section.sf-v3 .sf-action{width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important}
        .workflow-section.sf-v3 .sf-action-head{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;width:100%!important;min-width:0!important}
        .workflow-section.sf-v3 .sf-action button{min-width:0!important;white-space:nowrap!important;padding-left:9px!important;padding-right:9px!important}
        .workflow-section.sf-v3 .sf-action-title{min-width:0!important;overflow:hidden!important;white-space:nowrap!important;text-overflow:ellipsis!important}
        .workflow-section.sf-v3 .sf-action pre{width:100%!important;height:132px!important;min-height:132px!important;max-height:132px!important;margin:0!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important}
        .workflow-section.sf-v3 .sf-download{width:100%!important;min-height:40px!important}
        .workflow-section.sf-v3 .sf-output{width:100%!important;max-width:100%!important;overflow-wrap:anywhere!important}
        .workflow-section.sf-v3 .sf-tool-logo-link.is-fallback{font-size:9px!important;font-weight:900!important;color:var(--muted)!important;text-transform:uppercase!important}
        @media(max-width:420px){.workflow-section.sf-v3 .workflow-card{padding:18px 14px!important;border-radius:20px!important}.workflow-section.sf-v3 .workflow-list{gap:26px!important}.workflow-section.sf-v3 .workflow-body{gap:15px!important}.workflow-section.sf-v3 .sf-action-head{grid-template-columns:52px minmax(0,1fr) 62px!important}.workflow-section.sf-v3 .sf-action button{font-size:10px!important;padding-left:6px!important;padding-right:6px!important}}
      `;
      document.head.appendChild(style);
    }
    const toolInfo=name=>{const wanted=String(name||'').trim().toLowerCase();const nodes=[...document.querySelectorAll('.tools-list .tool-card,.tools-list .tool-logo-link')];const node=nodes.find(n=>{const n1=n.dataset.toolName||n.querySelector('h3')?.textContent?.trim()||n.getAttribute('aria-label')?.replace(/^Open\\s+/i,'');return n1&&n1.toLowerCase()===wanted});return node?{href:node.href||node.querySelector('.tool-link')?.href||'',purpose:node.dataset.toolPurpose||node.querySelector('p')?.textContent?.trim()||'',logo:node.querySelector('img')?.currentSrc||node.querySelector('img')?.src||''}:{href:'',purpose:'',logo:''}};
    const validImage=src=>new Promise(resolve=>{if(!src)return resolve(false);const im=new Image();im.onload=()=>resolve(im.naturalWidth>0&&im.naturalHeight>0);im.onerror=()=>resolve(false);im.src=src});
    const logoFor=async href=>{if(!href)return '';try{const r=await fetch('/api/tool-logo?url='+encodeURIComponent(href),{credentials:'same-origin',cache:'no-store'});if(r.ok){const d=await r.json();if(d?.logoUrl&&await validImage(d.logoUrl))return d.logoUrl}}catch{}try{const u=new URL(href,location.href);const candidates=[u.origin+'/favicon.svg',u.origin+'/favicon.png',u.origin+'/apple-touch-icon.png','https://www.google.com/s2/favicons?domain='+encodeURIComponent(u.hostname)+'&sz=128'];for(const src of candidates)if(await validImage(src))return src}catch{}return ''};
    const fixTools=async()=>{[...section.querySelectorAll('.sf-tool-badge')].forEach(async badge=>{if(badge.dataset.sfV5==='1')return;const name=badge.textContent?.trim();if(!name)return;badge.dataset.sfV5='1';const info=toolInfo(name);const row=document.createElement('div');row.className='sf-tool-row';const a=document.createElement('a');a.className='sf-tool-logo-link';a.target='_blank';a.rel='noopener noreferrer';a.title='Open '+name;a.setAttribute('aria-label','Open '+name);if(info.href)a.href=info.href;const img=document.createElement('img');img.alt='';img.width=38;img.height=38;img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';const fallback=()=>{if(img.isConnected)img.remove();a.classList.add('is-fallback');a.textContent=name.slice(0,1).toUpperCase()};img.onerror=fallback;const src=await logoFor(info.href)||info.logo;if(src){img.src=src;a.appendChild(img)}else{fallback()}const purpose=document.createElement('div');purpose.className='sf-tool-purpose';const label=document.createElement('span');label.className='sf-tool-purpose-label';label.textContent='TOOL USED FOR';const text=document.createElement('strong');text.className='sf-tool-purpose-text';text.textContent=info.purpose||'Used at this step to create the output.';purpose.append(label,text);row.append(a,purpose);badge.replaceWith(row)})};
    fixTools();setTimeout(fixTools,300);setTimeout(fixTools,900);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
}).catch(()=>{});
