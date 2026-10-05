(() => {
  const ORIGINAL = 'https://cdn.jsdelivr.net/gh/anujyadav70750/skill-foundry@ba193bbe9557ce08f26c089e1eb96c93840eddf7/public/workflow-fixes.js';

  const style = document.createElement('style');
  style.id = 'sf-workflow-blueprint-reference-match';
  style.textContent = `
/* Workflow Blueprint — visual match to approved reference. Scoped only to this section. */
.resource-page .blueprint-workflow-section .blueprint-section-title {
  font-family: 'Plus Jakarta Sans', var(--font-sans), sans-serif !important;
  font-size: clamp(30px, 4.35vw, 52px) !important;
  font-weight: 800 !important;
  line-height: 1.08 !important;
  letter-spacing: -0.035em !important;
  margin: 0 0 12px !important;
}
.resource-page .blueprint-workflow-section .blueprint-eyebrow {
  font-family: 'Plus Jakarta Sans', var(--font-sans), sans-serif !important;
  min-height: 48px !important;
  padding: 0 30px !important;
  border-radius: 999px !important;
  background: #DCEBFA !important;
  color: #1672D6 !important;
  border: 0 !important;
  box-shadow: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 16px !important;
  font-weight: 800 !important;
  letter-spacing: .08em !important;
}
.resource-page .blueprint-workflow-section .blueprint-helper-text {
  font-family: 'Plus Jakarta Sans', var(--font-sans), sans-serif !important;
  margin: 0 !important;
  line-height: 1.45 !important;
  font-size: clamp(16px, 2vw, 22px) !important;
  color: #71809B !important;
}
.resource-page .blueprint-workflow-section .blueprint-inner-workflow-container {
  width: 94% !important;
  max-width: none !important;
  margin: 42px auto 0 !important;
  padding: 72px 30px 46px !important;
  border-radius: 30px !important;
  box-sizing: border-box !important;
  background: linear-gradient(180deg, #E8F2FC 0%, #E2ECF7 100%) !important;
  border: 1px solid #D1E1F2 !important;
  box-shadow: inset 0 5px 18px rgba(28,79,132,.12), inset 0 1px 2px rgba(255,255,255,.95), 0 10px 28px rgba(36,73,112,.10) !important;
}
.resource-page .blueprint-workflow-section .blueprint-inner-expand-control {
  top: 24px !important;
  right: 24px !important;
  width: 54px !important;
  height: 54px !important;
  min-width: 54px !important;
  min-height: 54px !important;
  border-radius: 12px !important;
  padding: 0 !important;
  background: #E8F2FC !important;
  border: 0 !important;
  color: #1475DD !important;
  box-shadow: 0 7px 16px rgba(43,96,151,.10), inset 0 1px 0 rgba(255,255,255,.92) !important;
}
.resource-page .blueprint-workflow-section .blueprint-inner-expand-control svg {
  width: 24px !important;
  height: 24px !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container {
  border-radius: 24px !important;
  border-width: 1px !important;
  box-shadow: 0 10px 24px rgba(42,75,111,.09), inset 0 1px 0 rgba(255,255,255,.45) !important;
  overflow: visible !important;
  min-height: 220px !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-blue {
  background: #D7E9FC !important;
  border-color: #B5D7F8 !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-green {
  background: #D4F2E5 !important;
  border-color: #AFE4CB !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-orange {
  background: #FFF0BF !important;
  border-color: #F0D58A !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-cyan {
  background: #D5F3F8 !important;
  border-color: #B1E2EB !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-purple {
  background: #EDE2FA !important;
  border-color: #D5C3EC !important;
}
.resource-page .blueprint-workflow-section .blueprint-step-capsule {
  min-width: 214px !important;
  height: 64px !important;
  padding: 0 34px !important;
  border-radius: 999px !important;
  background: rgba(248,252,255,.96) !important;
  border-width: 3px !important;
  border-style: solid !important;
  box-shadow: 0 4px 10px rgba(31,77,119,.10) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.resource-page .blueprint-workflow-section .step-theme-blue .blueprint-step-capsule { border-color:#65B1F4 !important; color:#1675D8 !important; }
.resource-page .blueprint-workflow-section .step-theme-green .blueprint-step-capsule { border-color:#55D196 !important; color:#138A5A !important; }
.resource-page .blueprint-workflow-section .step-theme-orange .blueprint-step-capsule { border-color:#E8BD52 !important; color:#B87900 !important; }
.resource-page .blueprint-workflow-section .step-theme-cyan .blueprint-step-capsule { border-color:#58C5D8 !important; color:#07859A !important; }
.resource-page .blueprint-workflow-section .step-theme-purple .blueprint-step-capsule { border-color:#B68AE4 !important; color:#7440A8 !important; }
.resource-page .blueprint-workflow-section .blueprint-step-capsule span {
  font-family: 'Plus Jakarta Sans', var(--font-sans), sans-serif !important;
  font-size: 17px !important;
  font-weight: 800 !important;
  letter-spacing: .12em !important;
}
.resource-page .blueprint-workflow-section .step-header-thumb-box {
  flex-basis: 34% !important;
  width: 34% !important;
  min-width: 0 !important;
  height: 156px !important;
  border-radius: 18px !important;
  overflow: hidden !important;
}
.resource-page .blueprint-workflow-section .step-header-title,
.resource-page .blueprint-workflow-section .step-header-purpose {
  font-family: 'Plus Jakarta Sans', var(--font-sans), sans-serif !important;
}
.resource-page .blueprint-workflow-section .step-header-title {
  font-size: clamp(18px, 2vw, 24px) !important;
  line-height: 1.2 !important;
  font-weight: 800 !important;
}
.resource-page .blueprint-workflow-section .step-header-purpose {
  font-size: clamp(14px, 1.5vw, 18px) !important;
  line-height: 1.35 !important;
}
.resource-page .blueprint-workflow-section .step-expand-chevron {
  width: 52px !important;
  height: 52px !important;
  min-width: 52px !important;
  min-height: 52px !important;
  border-radius: 12px !important;
  border: 0 !important;
}
.resource-page .blueprint-workflow-section .workflow-next-connector {
  padding: 14px 0 !important;
  margin: 0 !important;
  min-height: 58px !important;
}
.resource-page .blueprint-workflow-section .workflow-next-connector .connector-cue {
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  width: 42px !important;
  height: 42px !important;
}
.resource-page .blueprint-workflow-section .stream-handoff-capsule {
  display: none !important;
}

@media (max-width: 760px) {
  .resource-page .blueprint-workflow-section .blueprint-section-title {
    font-size: 32px !important;
    line-height: 1.12 !important;
    letter-spacing: -0.03em !important;
    margin-bottom: 10px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-eyebrow {
    min-height: 46px !important;
    padding: 0 24px !important;
    font-size: 15px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-helper-text {
    font-size: 17px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-inner-workflow-container {
    width: 94% !important;
    margin-top: 30px !important;
    padding: 62px 18px 32px !important;
    border-radius: 26px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-inner-expand-control {
    top: 18px !important;
    right: 18px !important;
    width: 42px !important;
    height: 42px !important;
    min-width: 42px !important;
    min-height: 42px !important;
    border-radius: 10px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-inner-expand-control svg {
    width: 19px !important;
    height: 19px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-step-container {
    min-height: 0 !important;
    border-radius: 18px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-step-capsule {
    min-width: 174px !important;
    height: 48px !important;
    padding: 0 24px !important;
    border-width: 2px !important;
  }
  .resource-page .blueprint-workflow-section .blueprint-step-capsule span {
    font-size: 13px !important;
  }
  .resource-page .blueprint-workflow-section .step-header-thumb-box {
    flex-basis: 35% !important;
    width: 35% !important;
    height: 112px !important;
    border-radius: 12px !important;
  }
  .resource-page .blueprint-workflow-section .step-header-title {
    font-size: 16px !important;
  }
  .resource-page .blueprint-workflow-section .step-header-purpose {
    font-size: 13px !important;
  }
  .resource-page .blueprint-workflow-section .step-expand-chevron {
    width: 38px !important;
    height: 38px !important;
    min-width: 38px !important;
    min-height: 38px !important;
    border-radius: 10px !important;
  }
  .resource-page .blueprint-workflow-section .workflow-next-connector {
    min-height: 42px !important;
    padding: 8px 0 !important;
  }
  .resource-page .blueprint-workflow-section .workflow-next-connector .connector-cue {
    width: 34px !important;
    height: 34px !important;
  }
}

html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-eyebrow {
  background: #24354B !important;
  color: #82BFFF !important;
}
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-inner-workflow-container {
  background: linear-gradient(180deg, #182638 0%, #121C2B 100%) !important;
  border-color: #293B52 !important;
  box-shadow: inset 0 5px 18px rgba(0,0,0,.30), 0 10px 28px rgba(0,0,0,.20) !important;
}
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-blue { background:#203650 !important; border-color:#3F7FBA !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-green { background:#1D3B31 !important; border-color:#3E9D78 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-orange { background:#44391F !important; border-color:#B89543 !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-cyan { background:#193941 !important; border-color:#4E9FAE !important; }
html:not(.light-theme) .resource-page .blueprint-workflow-section .blueprint-step-container.step-theme-purple { background:#342844 !important; border-color:#8C67B2 !important; }
`;
  document.head.appendChild(style);

  const simplifyConnectors = () => {
    document.querySelectorAll('.resource-page .blueprint-workflow-section .workflow-next-connector .connector-cue svg').forEach((svg) => {
      svg.innerHTML = '<path d="M12 4v13M7 13l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
      svg.setAttribute('viewBox', '0 0 24 24');
    });
  };

  const cleanup = () => {
    simplifyConnectors();
    document.querySelectorAll('.resource-page .blueprint-workflow-section .stream-handoff-capsule').forEach((el) => el.remove());
  };

  const loadOriginal = () => {
    const script = document.createElement('script');
    script.src = ORIGINAL;
    script.onload = () => {
      cleanup();
      requestAnimationFrame(cleanup);
      setTimeout(cleanup, 150);
    };
    script.onerror = () => console.warn('Skill Foundry workflow runtime could not load.');
    document.head.appendChild(script);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanup, { once: true });
  } else {
    cleanup();
  }
  loadOriginal();
})();
