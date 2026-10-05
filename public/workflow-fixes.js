(() => {
  const ORIGINAL = 'https://cdn.jsdelivr.net/gh/anujyadav70750/skill-foundry@ba193bbe9557ce08f26c089e1eb96c93840eddf7/public/workflow-fixes.js';
  const STYLE_ID = 'sf-workflow-blueprint-reference-match-v6';

  const inject = () => {
    document.getElementById(STYLE_ID)?.remove();
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
/* Workflow Blueprint v6 — reference proportions/depth. Existing helper cue is untouched. */
.resource-page .blueprint-workflow-section .blueprint-eyebrow{
  display:inline-flex!important;align-items:center!important;justify-content:center!important;width:max-content!important;
  min-width:0!important;height:auto!important;padding:4px 14px!important;margin:0 0 16px!important;
  border:1px solid #78C2EC!important;border-radius:999px!important;background:#EFF7FD!important;
  color:#146E9F!important;box-shadow:none!important;font-family:var(--font-sans)!important;font-size:11px!important;
  font-weight:800!important;line-height:1!important;letter-spacing:.14em!important;
}
.resource-page .blueprint-workflow-section .blueprint-section-title{
  margin:0 0 12px!important;font-family:'Newsreader','Playfair Display',Georgia,serif!important;
  font-size:clamp(26px,3.5vw,36px)!important;font-weight:500!important;line-height:1.12!important;
  letter-spacing:-.025em!important;color:var(--text)!important;
}
.resource-page .blueprint-workflow-section .blueprint-helper-text{
  margin:0!important;font-family:var(--font-sans)!important;font-size:15px!important;font-weight:450!important;
  line-height:1.6!important;color:#475569!important;
}

/* Recessed tray: broad enough to align with the heading, with a modest inner gutter. */
.resource-page .blueprint-workflow-section .blueprint-inner-workflow-container{
  width:100%!important;max-width:none!important;margin:28px 0 0!important;padding:58px 12px 30px!important;
  box-sizing:border-box!important;border-radius:26px!important;
  background:linear-gradient(180deg,#EAF4FD 0%,#E3EEF9 58%,#DFEAF6 100%)!important;
  border:1px solid #CFE1F2!important;
  box-shadow:inset 0 7px 20px rgba(45,91,139,.14),inset 0 1px 2px rgba(255,255,255,.98),0 12px 30px rgba(43,79,116,.12)!important;
}
.resource-page .blueprint-workflow-section .blueprint-inner-expand-control{
  top:14px!important;right:14px!important;width:38px!important;height:38px!important;min-width:38px!important;min-height:38px!important;
  padding:0!important;border:1px solid rgba(94,156,216,.20)!important;border-radius:10px!important;
  background:linear-gradient(180deg,#DCEEFF 0%,#C8E2FA 100%)!important;color:#0874D9!important;
  box-shadow:0 6px 13px rgba(43,96,151,.15),inset 0 1px 0 rgba(255,255,255,.95)!important;
}
.resource-page .blueprint-workflow-section .blueprint-inner-expand-control svg{width:18px!important;height:18px!important;}

/* Compact horizontal raised cards — close to the reference aspect ratio. */
.resource-page .blueprint-workflow-section .blueprint-step-container{
  position:relative!important;width:100%!important;min-height:104px!important;height:auto!important;
  padding:0!important;margin:0 auto!important;box-sizing:border-box!important;border-radius:18px!important;overflow:visible!important;
  box-shadow:0 8px 18px rgba(47,82,119,.12),0 2px 5px rgba(47,82,119,.07),inset 0 1px 0 rgba(255,255,255,.88)!important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-blue{
  background:linear-gradient(180deg,#DCEBFB 0%,#D5E7F9 100%)!important;border:1px solid #B7D8F5!important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-green{
  background:linear-gradient(180deg,#DCF6E9 0%,#D5F1E3 100%)!important;border:1px solid #ACE3CC!important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-orange{
  background:linear-gradient(180deg,#FFF3CD 0%,#FFF0C7 100%)!important;border:1px solid #EED493!important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-cyan{
  background:linear-gradient(180deg,#DDF5F8 0%,#D6EFF3 100%)!important;border:1px solid #AFDEE7!important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-purple{
  background:linear-gradient(180deg,#F0E7FB 0%,#EADFF7 100%)!important;border:1px solid #D3C1EA!important;
}

/* Raised white STEP capsule, visibly sitting over the card boundary. */
.resource-page .blueprint-workflow-section .blueprint-step-capsule{
  position:absolute!important;top:0!important;left:50%!important;transform:translate(-50%,-50%)!important;z-index:5!important;
  width:86px!important;min-width:86px!important;height:30px!important;min-height:30px!important;padding:0!important;
  box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;
  border-radius:999px!important;background:linear-gradient(180deg,#FFFFFF 0%,#F7FBFF 100%)!important;
  border:2px solid!important;box-shadow:0 5px 12px rgba(37,76,116,.16),0 1px 2px rgba(37,76,116,.08),inset 0 1px 0 #FFFFFF!important;
}
.resource-page .blueprint-workflow-section .step-theme-blue .blueprint-step-capsule{border-color:#69B3F0!important;color:#176FC6!important;}
.resource-page .blueprint-workflow-section .step-theme-green .blueprint-step-capsule{border-color:#55CD96!important;color:#16865B!important;}
.resource-page .blueprint-workflow-section .step-theme-orange .blueprint-step-capsule{border-color:#E3B84D!important;color:#B77900!important;}
.resource-page .blueprint-workflow-section .step-theme-cyan .blueprint-step-capsule{border-color:#58C1D4!important;color:#0B879B!important;}
.resource-page .blueprint-workflow-section .step-theme-purple .blueprint-step-capsule{border-color:#B28ADF!important;color:#7541A8!important;}
.resource-page .blueprint-workflow-section .blueprint-step-capsule span{
  font-family:var(--font-sans)!important;font-size:9.5px!important;line-height:1!important;font-weight:800!important;letter-spacing:.10em!important;
}

/* Card contents: shorter image, compact text block, control firmly at right. */
.resource-page .blueprint-workflow-section .blueprint-step-header{
  display:flex!important;align-items:center!important;width:100%!important;min-height:104px!important;height:auto!important;
  padding:25px 12px 12px!important;box-sizing:border-box!important;gap:12px!important;border-radius:18px!important;
}
.resource-page .blueprint-workflow-section .step-header-thumb-box{
  flex:0 0 31%!important;width:31%!important;height:62px!important;min-width:0!important;border-radius:9px!important;overflow:hidden!important;
  position:relative!important;box-shadow:0 3px 8px rgba(24,52,79,.11),inset 0 1px 0 rgba(255,255,255,.45)!important;
}
.resource-page .blueprint-workflow-section .step-header-thumb-main{
  width:auto!important;height:auto!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;
  position:absolute!important;inset:0!important;margin:auto!important;z-index:2!important;
}
.resource-page .blueprint-workflow-section .step-header-thumb-backdrop{width:100%!important;height:100%!important;object-fit:cover!important;}
.resource-page .blueprint-workflow-section .step-header-thumb-overlay{position:absolute!important;inset:0!important;z-index:1!important;background:rgba(7,20,35,.30)!important;}
.resource-page .blueprint-workflow-section .step-header-info{flex:1 1 auto!important;min-width:0!important;text-align:left!important;}
.resource-page .blueprint-workflow-section .step-header-title{
  margin:0!important;font-family:var(--font-sans)!important;font-size:14px!important;line-height:1.18!important;font-weight:800!important;color:#102342!important;
}
.resource-page .blueprint-workflow-section .step-header-purpose{
  margin:3px 0 0!important;font-family:var(--font-sans)!important;font-size:10.5px!important;line-height:1.28!important;font-weight:450!important;color:#66758D!important;
}
.resource-page .blueprint-workflow-section .step-header-action{flex:0 0 auto!important;}

/* Clearly tinted raised expand buttons for every step. */
.resource-page .blueprint-workflow-section .step-expand-chevron{
  width:34px!important;height:34px!important;min-width:34px!important;min-height:34px!important;display:flex!important;
  align-items:center!important;justify-content:center!important;border:1px solid rgba(255,255,255,.72)!important;border-radius:9px!important;
  box-shadow:0 5px 11px rgba(39,76,111,.12),inset 0 1px 0 rgba(255,255,255,.82)!important;
}
.resource-page .blueprint-workflow-section .step-theme-blue .step-expand-chevron{background:#B7D9FB!important;color:#0874D9!important;}
.resource-page .blueprint-workflow-section .step-theme-green .step-expand-chevron{background:#AEE8CC!important;color:#10895B!important;}
.resource-page .blueprint-workflow-section .step-theme-orange .step-expand-chevron{background:#FFD98A!important;color:#A96D00!important;}
.resource-page .blueprint-workflow-section .step-theme-cyan .step-expand-chevron{background:#A9E2EA!important;color:#07899D!important;}
.resource-page .blueprint-workflow-section .step-theme-purple .step-expand-chevron{background:#D2B9EC!important;color:#7543A9!important;}
.resource-page .blueprint-workflow-section .step-chevron-icon{width:15px!important;height:15px!important;}

/* One compact continuous connector: a single stem flowing directly into the arrow. */
.resource-page .blueprint-workflow-section .workflow-next-connector{
  display:flex!important;align-items:center!important;justify-content:center!important;min-height:42px!important;height:42px!important;padding:0!important;margin:0!important;
}
.resource-page .blueprint-workflow-section .workflow-next-connector .connector-cue{
  display:flex!important;align-items:center!important;justify-content:center!important;width:20px!important;height:42px!important;
  margin:0!important;padding:0!important;background:transparent!important;border:0!important;color:#1688D2!important;
}
.resource-page .blueprint-workflow-section .workflow-next-connector .connector-cue::before{
  content:""!important;display:block!important;width:2px!important;height:18px!important;border-radius:999px!important;
  background:linear-gradient(180deg,#7FC6EA 0%,#1688D2 100%)!important;
}
.resource-page .blueprint-workflow-section .workflow-next-connector .connector-cue svg{
  width:18px!important;height:18px!important;margin-left:-2px!important;color:#1688D2!important;stroke:#1688D2!important;
}
.resource-page .blueprint-workflow-section .stream-handoff-capsule{display:none!important;}
.resource-page .blueprint-workflow-section .blueprint-result-container{width:100%!important;}

/* Preserve night-theme structure. */
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-eyebrow{background:#243B58!important;color:#82C4FF!important;border-color:#4E789E!important;}
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-helper-text{color:#9CAEC4!important;}
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-inner-workflow-container{background:linear-gradient(180deg,#182638 0%,#121C2B 100%)!important;border-color:#293B52!important;box-shadow:inset 0 7px 20px rgba(0,0,0,.34),0 12px 30px rgba(0,0,0,.22)!important;}
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-inner-expand-control{background:#203B58!important;color:#82C4FF!important;}
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-blue{background:#203A55!important;border-color:#3F7FBA!important;}
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-green{background:#1D3B31!important;border-color:#3E9D78!important;}
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-orange{background:#44391F!important;border-color:#B89543!important;}
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-cyan{background:#193941!important;border-color:#4E9FAE!important;}
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-purple{background:#342844!important;border-color:#8C67B2!important;}
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-capsule{background:#182638!important;}
html:not(.light-theme) .resource-page .blueprint-workflow-section .step-header-title{color:#E7EEF8!important;}
html:not(.light-theme) .resource-page .blueprint-workflow-section .step-header-purpose{color:#9CAEC4!important;}

@media (min-width:761px){
  .resource-page .blueprint-workflow-section .blueprint-inner-workflow-container{padding:68px 22px 34px!important;border-radius:30px!important;}
  .resource-page .blueprint-workflow-section .blueprint-inner-expand-control{width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;top:16px!important;right:16px!important;}
  .resource-page .blueprint-workflow-section .blueprint-step-container{min-height:170px!important;border-radius:22px!important;}
  .resource-page .blueprint-workflow-section .blueprint-step-header{min-height:170px!important;padding:39px 24px 20px!important;gap:22px!important;border-radius:22px!important;}
  .resource-page .blueprint-workflow-section .blueprint-step-capsule{width:138px!important;min-width:138px!important;height:42px!important;min-height:42px!important;}
  .resource-page .blueprint-workflow-section .blueprint-step-capsule span{font-size:13px!important;}
  .resource-page .blueprint-workflow-section .step-header-thumb-box{flex-basis:34%!important;width:34%!important;height:108px!important;border-radius:13px!important;}
  .resource-page .blueprint-workflow-section .step-header-title{font-size:20px!important;}
  .resource-page .blueprint-workflow-section .step-header-purpose{font-size:14px!important;}
  .resource-page .blueprint-workflow-section .step-expand-chevron{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;}
  .resource-page .blueprint-workflow-section .step-chevron-icon{width:19px!important;height:19px!important;}
  .resource-page .blueprint-workflow-section .workflow-next-connector{min-height:54px!important;height:54px!important;}
}
`;
    (document.head || document.documentElement).appendChild(style);
  };

  const clean = () => document.querySelectorAll('.resource-page .blueprint-workflow-section .stream-handoff-capsule').forEach((el) => el.remove());
  const apply = () => { inject(); clean(); };
  const loadOriginal = () => {
    const script = document.createElement('script');
    script.src = ORIGINAL;
    script.onload = () => { requestAnimationFrame(apply); setTimeout(apply,120); setTimeout(apply,500); setTimeout(apply,1000); };
    script.onerror = () => console.warn('Skill Foundry workflow runtime could not load.');
    document.head.appendChild(script);
  };
  loadOriginal();
})();
