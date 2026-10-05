(() => {
  const ORIGINAL = 'https://cdn.jsdelivr.net/gh/anujyadav70750/skill-foundry@ba193bbe9557ce08f26c089e1eb96c93840eddf7/public/workflow-fixes.js';
  const STYLE_ID = 'sf-workflow-blueprint-reference-match-v2';

  const injectReferenceMatch = () => {
    document.getElementById(STYLE_ID)?.remove();
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
/* Workflow Blueprint — rebuilt around the approved pastel reference. Scoped only to Workflow Blueprint. */
.resource-page .blueprint-workflow-section .blueprint-section-title {
  font-family:'Plus Jakarta Sans',var(--font-sans),sans-serif !important;
  font-size:clamp(32px,4.15vw,52px) !important;
  font-weight:800 !important;
  line-height:1.08 !important;
  letter-spacing:-.035em !important;
  color:#172B55 !important;
  margin:0 0 14px !important;
}
.resource-page .blueprint-workflow-section .blueprint-eyebrow {
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  min-height:64px !important;
  padding:0 36px !important;
  border:0 !important;
  border-radius:999px !important;
  background:#D6E9FD !important;
  color:#0874D9 !important;
  box-shadow:none !important;
  font-family:'Plus Jakarta Sans',var(--font-sans),sans-serif !important;
  font-size:17px !important;
  font-weight:800 !important;
  letter-spacing:.08em !important;
}
.resource-page .blueprint-workflow-section .blueprint-helper-text {
  display:flex !important;
  align-items:center !important;
  gap:9px !important;
  margin:0 !important;
  font-family:'Plus Jakarta Sans',var(--font-sans),sans-serif !important;
  font-size:clamp(17px,2vw,23px) !important;
  line-height:1.45 !important;
  color:#71809B !important;
}
.resource-page .blueprint-workflow-section .helper-chevron-cue {
  width:30px !important;
  height:30px !important;
  flex:0 0 30px !important;
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  border-radius:9px !important;
  background:#DCEBFA !important;
  color:#1976D2 !important;
  box-shadow:0 3px 8px rgba(45,103,160,.12) !important;
}
.resource-page .blueprint-workflow-section .helper-chevron-cue svg { width:16px !important;height:16px !important; }

.resource-page .blueprint-workflow-section .blueprint-inner-workflow-container {
  width:calc(100% - 36px) !important;
  max-width:none !important;
  margin:42px auto 0 !important;
  padding:86px 34px 54px !important;
  box-sizing:border-box !important;
  border-radius:30px !important;
  background:linear-gradient(180deg,#EAF3FC 0%,#E4EDF7 100%) !important;
  border:1px solid #D2E2F2 !important;
  box-shadow:inset 0 7px 22px rgba(45,91,139,.13),inset 0 1px 2px rgba(255,255,255,.95),0 12px 30px rgba(43,79,116,.10) !important;
}
.resource-page .blueprint-workflow-section .blueprint-inner-expand-control {
  top:24px !important;
  right:24px !important;
  width:58px !important;
  height:58px !important;
  min-width:58px !important;
  min-height:58px !important;
  padding:0 !important;
  border:0 !important;
  border-radius:13px !important;
  background:#DCEBFA !important;
  color:#0874D9 !important;
  box-shadow:0 7px 17px rgba(43,96,151,.11),inset 0 1px 0 rgba(255,255,255,.92) !important;
}
.resource-page .blueprint-workflow-section .blueprint-inner-expand-control svg { width:27px !important;height:27px !important; }

.resource-page .blueprint-workflow-section .blueprint-step-container {
  position:relative !important;
  width:100% !important;
  min-height:260px !important;
  padding:0 !important;
  box-sizing:border-box !important;
  border-radius:28px !important;
  overflow:visible !important;
  box-shadow:0 12px 26px rgba(47,82,119,.10),inset 0 1px 0 rgba(255,255,255,.58) !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-blue { background:#D6E9FD !important;border:1px solid #B7D7F8 !important; }
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-green { background:#D6F8EB !important;border:1px solid #AEE7D0 !important; }
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-orange { background:#FFF1C5 !important;border:1px solid #F0D890 !important; }
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-cyan { background:#D8F5F9 !important;border:1px solid #B1E4ED !important; }
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-purple { background:#EEE3FA !important;border:1px solid #D4C2EC !important; }

.resource-page .blueprint-workflow-section .blueprint-step-capsule {
  position:absolute !important;
  top:0 !important;
  left:50% !important;
  transform:translate(-50%,-50%) !important;
  z-index:5 !important;
  width:214px !important;
  min-width:214px !important;
  height:64px !important;
  padding:0 !important;
  box-sizing:border-box !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  border-radius:999px !important;
  background:rgba(250,253,255,.98) !important;
  border:3px solid !important;
  box-shadow:0 5px 12px rgba(37,76,116,.11) !important;
}
.resource-page .blueprint-workflow-section .step-theme-blue .blueprint-step-capsule { border-color:#69B4F5 !important;color:#0874D9 !important; }
.resource-page .blueprint-workflow-section .step-theme-green .blueprint-step-capsule { border-color:#54D39A !important;color:#10895B !important; }
.resource-page .blueprint-workflow-section .step-theme-orange .blueprint-step-capsule { border-color:#E9BE51 !important;color:#B77700 !important; }
.resource-page .blueprint-workflow-section .step-theme-cyan .blueprint-step-capsule { border-color:#5AC7D8 !important;color:#07899D !important; }
.resource-page .blueprint-workflow-section .step-theme-purple .blueprint-step-capsule { border-color:#B68BE3 !important;color:#7543A9 !important; }
.resource-page .blueprint-workflow-section .blueprint-step-capsule span {
  font-family:'Plus Jakarta Sans',var(--font-sans),sans-serif !important;
  font-size:18px !important;
  font-weight:800 !important;
  letter-spacing:.13em !important;
}

.resource-page .blueprint-workflow-section .blueprint-step-header {
  display:flex !important;
  align-items:center !important;
  width:100% !important;
  min-height:260px !important;
  padding:62px 30px 28px !important;
  box-sizing:border-box !important;
  gap:28px !important;
  border-radius:28px !important;
}
.resource-page .blueprint-workflow-section .step-header-thumb-box {
  flex:0 0 34% !important;
  width:34% !important;
  height:176px !important;
  min-width:0 !important;
  border-radius:18px !important;
  overflow:hidden !important;
  position:relative !important;
}
.resource-page .blueprint-workflow-section .step-header-thumb-main {
  width:auto !important;
  height:auto !important;
  max-width:100% !important;
  max-height:100% !important;
  object-fit:contain !important;
  position:absolute !important;
  inset:0 !important;
  margin:auto !important;
  z-index:2 !important;
}
.resource-page .blueprint-workflow-section .step-header-thumb-backdrop { width:100% !important;height:100% !important;object-fit:cover !important; }
.resource-page .blueprint-workflow-section .step-header-thumb-overlay { position:absolute !important;inset:0 !important;z-index:1 !important;background:rgba(7,20,35,.30) !important; }
.resource-page .blueprint-workflow-section .step-header-info { flex:1 1 auto !important;min-width:0 !important;text-align:left !important; }
.resource-page .blueprint-workflow-section .step-header-title {
  margin:0 !important;
  font-family:'Plus Jakarta Sans',var(--font-sans),sans-serif !important;
  font-size:clamp(20px,2vw,27px) !important;
  line-height:1.18 !important;
  font-weight:800 !important;
  color:#102342 !important;
}
.resource-page .blueprint-workflow-section .step-header-purpose {
  margin:7px 0 0 !important;
  font-family:'Plus Jakarta Sans',var(--font-sans),sans-serif !important;
  font-size:clamp(15px,1.5vw,19px) !important;
  line-height:1.38 !important;
  color:#66758D !important;
}
.resource-page .blueprint-workflow-section .step-header-action { flex:0 0 auto !important; }
.resource-page .blueprint-workflow-section .step-expand-chevron {
  width:64px !important;
  height:64px !important;
  min-width:64px !important;
  min-height:64px !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  border:0 !important;
  border-radius:15px !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.45),0 5px 12px rgba(39,76,111,.07) !important;
}
.resource-page .blueprint-workflow-section .step-theme-blue .step-expand-chevron { background:#BFDFFF !important;color:#0874D9 !important; }
.resource-page .blueprint-workflow-section .step-theme-green .step-expand-chevron { background:#B9F0D6 !important;color:#10895B !important; }
.resource-page .blueprint-workflow-section .step-theme-orange .step-expand-chevron { background:#FFE3A0 !important;color:#B77700 !important; }
.resource-page .blueprint-workflow-section .step-theme-cyan .step-expand-chevron { background:#BDEBF1 !important;color:#07899D !important; }
.resource-page .blueprint-workflow-section .step-theme-purple .step-expand-chevron { background:#DEC9F2 !important;color:#7543A9 !important; }
.resource-page .blueprint-workflow-section .step-chevron-icon { width:27px !important;height:27px !important; }

/* The reference uses one clean stem-and-arrow connector, not a line plus a separate arrow. */
.resource-page .blueprint-workflow-section .workflow-next-connector {
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  min-height:92px !important;
  padding:0 !important;
  margin:0 !important;
}
.resource-page .blueprint-workflow-section .workflow-next-connector .connector-cue {
  width:48px !important;
  height:48px !important;
  padding:0 !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  background:transparent !important;
  border:0 !important;
  box-shadow:none !important;
  color:#1584DD !important;
}
.resource-page .blueprint-workflow-section .workflow-next-connector .connector-cue svg { width:38px !important;height:38px !important; }
.resource-page .blueprint-workflow-section .stream-handoff-capsule { display:none !important; }

@media (max-width:760px) {
  .resource-page .blueprint-workflow-section .blueprint-section-title {
    font-size:31px !important;
    line-height:1.12 !important;
    letter-spacing:-.03em !important;
    margin-bottom:12px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-eyebrow {
    min-height:54px !important;
    padding:0 27px !important;
    font-size:15px !important;
    letter-spacing:.075em !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-helper-text { font-size:17px !important;gap:8px !important; }
  .resource-page .blueprint-workflow-section .helper-chevron-cue { width:29px !important;height:29px !important;flex-basis:29px !important; }
  .resource-page .blueprint-workflow-section .blueprint-inner-workflow-container {
    width:calc(100% - 24px) !important;
    margin-top:28px !important;
    padding:72px 14px 38px !important;
    border-radius:27px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-inner-expand-control {
    top:20px !important;right:20px !important;width:46px !important;height:46px !important;min-width:46px !important;min-height:46px !important;border-radius:11px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-inner-expand-control svg { width:21px !important;height:21px !important; }
  .resource-page .blueprint-workflow-section .blueprint-step-container {
    min-height:178px !important;
    border-radius:20px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-step-header {
    min-height:178px !important;
    padding:50px 14px 18px !important;
    gap:15px !important;
    border-radius:20px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-step-capsule {
    width:176px !important;min-width:176px !important;height:50px !important;border-width:2px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-step-capsule span { font-size:13px !important;letter-spacing:.12em !important; }
  .resource-page .blueprint-workflow-section .step-header-thumb-box {
    flex:0 0 35% !important;width:35% !important;height:104px !important;border-radius:12px !important;
  }
  .resource-page .blueprint-workflow-section .step-header-title { font-size:16px !important;line-height:1.18 !important; }
  .resource-page .blueprint-workflow-section .step-header-purpose { font-size:13px !important;line-height:1.32 !important;margin-top:5px !important; }
  .resource-page .blueprint-workflow-section .step-expand-chevron {
    width:48px !important;height:48px !important;min-width:48px !important;min-height:48px !important;border-radius:12px !important;
  }
  .resource-page .blueprint-workflow-section .step-chevron-icon { width:22px !important;height:22px !important; }
  .resource-page .blueprint-workflow-section .workflow-next-connector { min-height:62px !important; }
  .resource-page .blueprint-workflow-section .workflow-next-connector .connector-cue { width:40px !important;height:40px !important; }
  .resource-page .blueprint-workflow-section .workflow-next-connector .connector-cue svg { width:32px !important;height:32px !important; }
}

html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-section-title { color:#E7EEF8 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-eyebrow { background:#243B58 !important;color:#82C4FF !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-helper-text { color:#9CAEC4 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .helper-chevron-cue { background:#243B58 !important;color:#82C4FF !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-inner-workflow-container { background:linear-gradient(180deg,#182638 0%,#121C2B 100%) !important;border-color:#293B52 !important;box-shadow:inset 0 7px 22px rgba(0,0,0,.30),0 12px 30px rgba(0,0,0,.20) !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-blue { background:#203650 !important;border-color:#3F7FBA !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-green { background:#1D3B31 !important;border-color:#3E9D78 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-orange { background:#44391F !important;border-color:#B89543 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-cyan { background:#193941 !important;border-color:#4E9FAE !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-purple { background:#342844 !important;border-color:#8C67B2 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-capsule { background:#182638 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .step-header-title { color:#E7EEF8 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .step-header-purpose { color:#9CAEC4 !important; }
`;
    document.head.appendChild(style);
  };

  const cleanWorkflow = () => {
    document.querySelectorAll('.resource-page .blueprint-workflow-section .stream-handoff-capsule').forEach((el) => el.remove());
    document.querySelectorAll('.resource-page .blueprint-workflow-section .workflow-next-connector .connector-cue svg').forEach((svg) => {
      svg.innerHTML = '<path d="M12 3v15M7 13l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
      svg.setAttribute('viewBox','0 0 24 24');
    });
  };

  const loadOriginal = () => {
    const script = document.createElement('script');
    script.src = ORIGINAL;
    script.onload = () => {
      requestAnimationFrame(() => {
        injectReferenceMatch();
        cleanWorkflow();
      });
      setTimeout(() => {
        injectReferenceMatch();
        cleanWorkflow();
      }, 180);
    };
    script.onerror = () => console.warn('Skill Foundry workflow runtime could not load.');
    document.head.appendChild(script);
  };

  loadOriginal();
})();
