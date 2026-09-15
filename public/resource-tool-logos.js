(()=>{
  const localFallback='/skill-foundry-resource-icon.svg';
  const CACHE_KEY='sf-tool-logo-cache-v5';
  const CACHE_TTL=7*24*60*60*1000;
  const inFlight=new Map();
  const readCache=()=>{try{const raw=localStorage.getItem(CACHE_KEY);const data=raw?JSON.parse(raw):{};const now=Date.now();Object.keys(data).forEach(k=>{if(!data[k]||now-Number(data[k].savedAt||0)>CACHE_TTL)delete data[k]});return data}catch{return{}}};
  const writeCache=data=>{try{localStorage.setItem(CACHE_KEY,JSON.stringify(data))}catch{}};
  const cacheKey=url=>{try{return new URL(url,location.href).href.replace(/\/$/,'')}catch{return String(url||'')}};
  const websiteFallback=url=>{try{const t=new URL(url,location.href);if(t.hostname.endsWith('skillfoundryai.workers.dev'))return `${t.origin}/favicon.svg`;return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(t.hostname)}&sz=128`}catch{return localFallback}};
  const resolveLogo=async url=>{
    const key=cacheKey(url); if(!key)return localFallback;
    if(inFlight.has(key))return inFlight.get(key);
    const cached=readCache()[key]; if(cached?.logoUrl)return cached.logoUrl;
    const promise=(async()=>{
      let logoUrl='';
      try{
        const response=await window.fetch(`/api/tool-logo?url=${encodeURIComponent(url)}`,{credentials:'same-origin',cache:'no-store'});
        if(response.ok){const data=await response.json();if(data.logoUrl)logoUrl=data.logoUrl}
      }catch{}
      if(!logoUrl)logoUrl=websiteFallback(url);
      const cache=readCache();cache[key]={logoUrl,savedAt:Date.now()};writeCache(cache);
      return logoUrl;
    })().finally(()=>inFlight.delete(key));
    inFlight.set(key,promise);return promise;
  };
  window.SkillFoundryToolLogo={resolve:resolveLogo};
  const mount=()=>{
    const section=document.querySelector('.tools-section'); if(!section)return;
    const sub=section.querySelector('.section-subcopy'); if(sub)sub.textContent='The apps and AI tools used throughout this resource.';
    const list=section.querySelector('.tools-list'); if(!list)return;
    list.classList.add('tool-logo-grid');
    [...list.querySelectorAll('.tool-card')].forEach(card=>{
      const name=card.querySelector('h3')?.textContent?.trim()||'Tool';
      const purpose=card.querySelector('.tool-card-main p')?.textContent?.trim()||'';
      const link=card.querySelector('.tool-link'); const href=link?.href; if(!href)return;
      card.dataset.toolName=name;card.dataset.toolPurpose=purpose;card.dataset.toolUrl=href;card.classList.add('tool-logo-card');
      let anchor=card.querySelector(':scope > .tool-logo-link');
      if(!anchor){
        anchor=document.createElement('a');anchor.className='tool-logo-link';anchor.target='_blank';anchor.rel='noopener noreferrer';anchor.setAttribute('aria-label',`Open ${name}`);anchor.title=name;
        const image=document.createElement('img');image.className='tool-logo-image';image.width=56;image.height=56;image.loading='eager';image.decoding='async';image.referrerPolicy='no-referrer';image.alt=`${name} logo`;image.src=localFallback;anchor.append(image);card.insertBefore(anchor,card.firstChild);
      }
      anchor.href=href;anchor.dataset.toolName=name;anchor.dataset.toolPurpose=purpose;anchor.dataset.toolUrl=href;
      const main=card.querySelector('.tool-card-main'); if(main)main.hidden=true;
      if(link)link.hidden=true;
      card.querySelector('.affiliate-badge')?.remove();
      const image=anchor.querySelector('img');
      resolveLogo(href).then(src=>{if(src&&image)image.src=src}).catch(()=>{});
    });
    section.querySelector('.affiliate-disclosure')?.remove();
    if(!document.querySelector('#sf-tool-logo-grid-style')){
      const style=document.createElement('style');style.id='sf-tool-logo-grid-style';style.textContent=`
        .tool-logo-grid{display:grid!important;grid-template-columns:repeat(4,56px);gap:18px 16px;align-items:start;justify-content:start;width:100%;}
        .tool-logo-card{display:block!important;width:56px!important;height:56px!important;min-height:56px!important;margin:0!important;padding:0!important;border:0!important;border-radius:14px!important;background:transparent!important;box-shadow:none!important;overflow:visible!important;}
        .tool-logo-card .tool-card-main[hidden],.tool-logo-card .tool-link[hidden]{display:none!important;}
        .tool-logo-card .tool-logo-link{display:block!important;width:56px;height:56px;box-sizing:border-box;border:0;border-radius:14px;background:transparent;text-decoration:none;overflow:hidden;}
        .tool-logo-card .tool-logo-image{display:block;width:56px;height:56px;max-width:56px;max-height:56px;object-fit:contain;border-radius:14px;}
        .tool-logo-card .tool-logo-link:hover,.tool-logo-card .tool-logo-link:focus-visible{transform:translateY(-2px) scale(1.03);filter:brightness(1.06);outline:none;}
        @media(max-width:360px){.tool-logo-grid{grid-template-columns:repeat(4,52px);gap:16px 12px}.tool-logo-card,.tool-logo-card .tool-logo-link{width:52px!important;height:52px!important}.tool-logo-card .tool-logo-image{width:52px;height:52px;border-radius:13px}}
      `;document.head.append(style);
    }
    section.classList.add('sf-tools-ready');
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
