(() => {
  const ORIGINAL = 'https://cdn.jsdelivr.net/gh/anujyadav70750/skill-foundry@ba193bbe9557ce08f26c089e1eb96c93840eddf7/public/workflow-fixes.js';
  const STYLE_ID = 'sf-workflow-blueprint-reference-match-v4';

  const injectFinalReferenceMatch = () => {
    document.getElementById(STYLE_ID)?.remove();
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
/* Workflow Blueprint — final reference match. Do not alter the existing helper arrow. */
.resource-page .blueprint-workflow-section .blueprint-eyebrow {
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  width:max-content !important;
  min-width:0 !important;
  min-height:0 !important;
  height:auto !important;
  padding:4px 14px !important;
  margin:0 0 16px !important;
  border:1px solid #78C2EC !important;
  border-radius:999px !important;
  background:#EFF7FD !important;
  color:#146E9F !important;
  box-shadow:none !important;
  font-family:var(--font-sans) !important;
  font-size:11px !important;
  font-weight:800 !important;
  line-height:1 !important;
  letter-spacing:.14em !important;
  box-sizing:border-box !important;
}
.resource-page .blueprint-workflow-section .blueprint-section-title {
  margin:0 0 12px !important;
  font-family:'Newsreader','Playfair Display',Georgia,serif !important;
  font-size:clamp(26px,3.5vw,36px) !important;
  font-weight:500 !important;
  line-height:1.12 !important;
  letter-spacing:-.025em !important;
  color:var(--text) !important;
}
.resource-page .blueprint-workflow-section .blueprint-helper-text {
  margin:0 !important;
  font-family:var(--font-sans) !important;
  font-size:15px !important;
  font-weight:450 !important;
  line-height:1.6 !important;
  color:#475569 !important;
}

/* The existing helper-chevron-cue is intentionally untouched. */

.resource-page .blueprint-workflow-section .blueprint-inner-workflow-container {
  width:calc(100% - 32px) !important;
  max-width:none !important;
  margin:28px auto 0 !important;
  padding:58px 12px 30px !important;
  box-sizing:border-box !important;
  border-radius:26px !important;
  background:linear-gradient(180deg,#E9F3FC 0%,#E3EDF8 100%) !important;
  border:1px solid #D2E2F2 !important;
  box-shadow:inset 0 6px 18px rgba(45,91,139,.12),inset 0 1px 2px rgba(255,255,255,.96),0 10px 26px rgba(43,79,116,.09) !important;
}
.resource-page .blueprint-workflow-section .blueprint-inner-expand-control {
  top:14px !important;
  right:14px !important;
  width:36px !important;
  height:36px !important;
  min-width:36px !important;
  min-height:36px !important;
  padding:0 !important;
  border:0 !important;
  border-radius:9px !important;
  background:#D8EAFB !important;
  color:#0874D9 !important;
  box-shadow:0 4px 10px rgba(43,96,151,.10),inset 0 1px 0 rgba(255,255,255,.92) !important;
}
.resource-page .blueprint-workflow-section .blueprint-inner-expand-control svg { width:18px !important;height:18px !important; }

.resource-page .blueprint-workflow-section .blueprint-step-container {
  position:relative !important;
  width:100% !important;
  min-height:96px !important;
  height:auto !important;
  padding:0 !important;
  margin:0 auto !important;
  box-sizing:border-box !important;
  border-radius:18px !important;
  overflow:visible !important;
  box-shadow:0 6px 14px rgba(47,82,119,.07),inset 0 1px 0 rgba(255,255,255,.55) !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-blue { background:#D8E9FB !important;border:1px solid #B9D9F6 !important; }
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-green { background:#D7F4E7 !important;border:1px solid #AFE4CF !important; }
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-orange { background:#FFF1C8 !important;border:1px solid #F1D994 !important; }
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-cyan { background:#D7F4F8 !important;border:1px solid #B1E3EC !important; }
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-purple { background:#EEE4FA !important;border:1px solid #D5C4ED !important; }

/* Compact horizontal STEP capsule, matching the reference proportions. */
.resource-page .blueprint-workflow-section .blueprint-step-capsule {
  position:absolute !important;
  top:0 !important;
  left:50% !important;
  transform:translate(-50%,-50%) !important;
  z-index:5 !important;
  width:82px !important;
  min-width:82px !important;
  height:28px !important;
  min-height:28px !important;
  padding:0 !important;
  box-sizing:border-box !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  border-radius:999px !important;
  background:#FFFFFF !important;
  border:1px solid !important;
  box-shadow:0 3px 8px rgba(37,76,116,.10),0 0 0 1px rgba(255,255,255,.55) inset !important;
}
.resource-page .blueprint-workflow-section .step-theme-blue .blueprint-step-capsule { border-color:#6DB6F2 !important;color:#176FC6 !important; }
.resource-page .blueprint-workflow-section .step-theme-green .blueprint-step-capsule { border-color:#56CE98 !important;color:#16865B !important; }
.resource-page .blueprint-workflow-section .step-theme-orange .blueprint-step-capsule { border-color:#E4B94F !important;color:#B77900 !important; }
.resource-page .blueprint-workflow-section .step-theme-cyan .blueprint-step-capsule { border-color:#5CC4D6 !important;color:#0B879B !important; }
.resource-page .blueprint-workflow-section .step-theme-purple .blueprint-step-capsule { border-color:#B38ADF !important;color:#7541A8 !important; }
.resource-page .blueprint-workflow-section .blueprint-step-capsule span {
  font-family:var(--font-sans) !important;
  font-size:9px !important;
  line-height:1 !important;
  font-weight:800 !important;
  letter-spacing:.10em !important;
}

.resource-page .blueprint-workflow-section .blueprint-step-header {
  display:flex !important;
  align-items:center !important;
  width:100% !important;
  min-height:96px !important;
  height:auto !important;
  padding:24px 12px 12px !important;
  box-sizing:border-box !important;
  gap:12px !important;
  border-radius:18px !important;
}
.resource-page .blueprint-workflow-section .step-header-thumb-box {
  flex:0 0 31% !important;
  width:31% !important;
  height:58px !important;
  min-width:0 !important;
  border-radius:9px !important;
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
  font-family:var(--font-sans) !important;
  font-size:14px !important;
  line-height:1.18 !important;
  font-weight:800 !important;
  color:#102342 !important;
}
.resource-page .blueprint-workflow-section .step-header-purpose {
  margin:3px 0 0 !important;
  font-family:var(--font-sans) !important;
  font-size:11px !important;
  line-height:1.28 !important;
  font-weight:450 !important;
  color:#66758D !important;
}
.resource-page .blueprint-workflow-section .step-header-action { flex:0 0 auto !important; }
.resource-page .blueprint-workflow-section .step-expand-chevron {
  width:30px !important;
  height:30px !important;
  min-width:30px !important;
  min-height:30px !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  border:0 !important;
  border-radius:8px !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.50),0 3px 7px rgba(39,76,111,.06) !important;
}
.resource-page .blueprint-workflow-section .step-theme-blue .step-expand-chevron { background:#BFDDFC !important;color:#0874D9 !important; }
.resource-page .blueprint-workflow-section .step-theme-green .step-expand-chevron { background:#B9EED6 !important;color:#10895B !important; }
.resource-page .blueprint-workflow-section .step-theme-orange .step-expand-chevron { background:#FFE1A0 !important;color:#B77700 !important; }
.resource-page .blueprint-workflow-section .step-theme-cyan .step-expand-chevron { background:#B9EAF0 !important;color:#07899D !important; }
.resource-page .blueprint-workflow-section .step-theme-purple .step-expand-chevron { background:#DCC7F0 !important;color:#7543A9 !important; }
.resource-page .blueprint-workflow-section .step-chevron-icon { width:15px !important;height:15px !important; }

/* Reference-like compact gap and connected arrow. The arrow artwork itself is not replaced. */
.resource-page .blueprint-workflow-section .workflow-next-connector {
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  min-height:48px !important;
  height:48px !important;
  padding:0 !important;
  margin:0 !important;
}
.resource-page .blueprint-workflow-section .workflow-next-connector .connector-cue {
  margin:0 !important;
  padding:0 !important;
  background:transparent !important;
  border:0 !important;
}
.resource-page .blueprint-workflow-section .stream-handoff-capsule { display:none !important; }
.resource-page .blueprint-workflow-section .blueprint-result-container { width:100% !important; }

/* Dark theme: preserve the same structure and proportions. */
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-eyebrow { background:#243B58 !important;color:#82C4FF !important;border-color:#4E789E !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-helper-text { color:#9CAEC4 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-inner-workflow-container { background:linear-gradient(180deg,#182638 0%,#121C2B 100%) !important;border-color:#293B52 !important;box-shadow:inset 0 6px 18px rgba(0,0,0,.30),0 10px 26px rgba(0,0,0,.20) !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-inner-expand-control { background:#203B58 !important;color:#82C4FF !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-blue { background:#203650 !important;border-color:#3F7FBA !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-green { background:#1D3B31 !important;border-color:#3E9D78 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-orange { background:#44391F !important;border-color:#B89543 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-cyan { background:#193941 !important;border-color:#4E9FAE !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-purple { background:#342844 !important;border-color:#8C67B2 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-capsule { background:#182638 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .step-header-title { color:#E7EEF8 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .step-header-purpose { color:#9CAEC4 !important; }

@media (min-width:761px) {
  .resource-page .blueprint-workflow-section .blueprint-inner-workflow-container {
    width:calc(100% - 64px) !important;
    margin:34px auto 0 !important;
    padding:72px 28px 42px !important;
    border-radius:30px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-inner-expand-control { width:44px !important;height:44px !important;min-width:44px !important;min-height:44px !important;top:16px !important;right:16px !important; }
  .resource-page .blueprint-workflow-section .blueprint-step-container { min-height:210px !important;border-radius:24px !important; }
  .resource-page .blueprint-workflow-section .blueprint-step-header { min-height:210px !important;padding:50px 26px 24px !important;gap:24px !important;border-radius:24px !important; }
  .resource-page .blueprint-workflow-section .blueprint-step-capsule { width:138px !important;min-width:138px !important;height:42px !important;min-height:42px !important; }
  .resource-page .blueprint-workflow-section .blueprint-step-capsule span { font-size:13px !important; }
  .resource-page .blueprint-workflow-section .step-header-thumb-box { flex-basis:34% !important;width:34% !important;height:138px !important;border-radius:14px !important; }
  .resource-page .blueprint-workflow-section .step-header-title { font-size:20px !important; }
  .resource-page .blueprint-workflow-section .step-header-purpose { font-size:14px !important; }
  .resource-page .blueprint-workflow-section .step-expand-chevron { width:48px !important;height:48px !important;min-width:48px !important;min-height:48px !important; }
  .resource-page .blueprint-workflow-section .step-chevron-icon { width:19px !important;height:19px !important; }
  .resource-page .blueprint-workflow-section .workflow-next-connector { min-height:70px !important;height:70px !important; }
}
`;
    (document.head || document.documentElement).appendChild(style);
  };

  const cleanWorkflow = () => {
    document.querySelectorAll('.resource-page .blueprint-workflow-section .stream-handoff-capsule').forEach((el) => el.remove());
  };

  const apply = () => {
    injectFinalReferenceMatch();
    cleanWorkflow();
  };

  const loadOriginal = () => {
    const script = document.createElement('script');
    script.src = ORIGINAL;
    script.onload = () => {
      requestAnimationFrame(apply);
      setTimeout(apply, 120);
      setTimeout(apply, 500);
      setTimeout(apply, 1000);
    };
    script.onerror = () => console.warn('Skill Foundry workflow runtime could not load.');
    document.head.appendChild(script);
  };

  loadOriginal();
})();
