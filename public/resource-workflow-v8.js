import('/resource-workflow-v7.js?v=20260915-2').then(() => {
  const demoImages = {
    character: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85',
    dress: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85',
    clip1: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85',
    clip2: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85',
    clip3: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85',
    final: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1000&q=85'
  };

  const fix = () => {
    const section = document.querySelector('.workflow-section.sf-v7');
    if (!section) return;

    if (!document.getElementById('sf-workflow-v8-style')) {
      const style = document.createElement('style');
      style.id = 'sf-workflow-v8-style';
      style.textContent = `
        .workflow-section.sf-v7 .workflow-list{grid-template-columns:minmax(0,1fr)!important;display:grid!important}
        .workflow-section.sf-v7 .workflow-card{display:block!important;overflow:visible!important}
        .workflow-section.sf-v7 .workflow-body{display:grid!important;grid-template-columns:minmax(0,1fr)!important;align-items:stretch!important}
        .workflow-section.sf-v7 .sf-v7-tool,.workflow-section.sf-v7 .sf-v7-settings,.workflow-section.sf-v7 .sf-v7-start,.workflow-section.sf-v7 .sf-v7-action,.workflow-section.sf-v7 .sf-v7-output,.workflow-section.sf-v7 .sf-v7-arrow{width:100%!important;max-width:100%!important;min-width:0!important}
        .workflow-section.sf-v7 .sf-v7-tool{display:flex!important;flex-wrap:nowrap!important;align-items:center!important}
        .workflow-section.sf-v7 .sf-v7-tool a{flex:0 0 48px!important;width:48px!important;height:48px!important}
        .workflow-section.sf-v7 .sf-v7-tool img{width:40px!important;height:40px!important}
        .workflow-section.sf-v7 .sf-v7-purpose{flex:1 1 auto!important;min-width:0!important}
        .workflow-section.sf-v7 .sf-v7-purpose b{display:none!important}
        .workflow-section.sf-v7 .sf-v7-purpose span{margin:0!important;font-size:12px!important;font-weight:850!important;letter-spacing:.06em!important}
        .workflow-section.sf-v7 .sf-v7-settings{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;padding:0 0 2px!important}
        .workflow-section.sf-v7 .sf-v7-setting{flex:0 0 auto!important}
        .workflow-section.sf-v7 .sf-v7-input{position:relative!important}
        .workflow-section.sf-v7 .sf-v7-input img.sf-v8-media{display:block!important;width:100%!important;height:auto!important;aspect-ratio:16/10!important;object-fit:cover!important;margin:-1px 0 10px!important;border-radius:9px!important}
        .workflow-section.sf-v7 .sf-v7-output{display:block!important;overflow:hidden!important}
        .workflow-section.sf-v7 .sf-v8-output-media{display:block!important;width:100%!important;aspect-ratio:16/9!important;object-fit:cover!important;margin:-1px 0 12px!important;border-radius:10px!important}
        .workflow-section.sf-v7 .sf-v8-final-media{display:block!important;width:100%!important;aspect-ratio:16/9!important;object-fit:cover!important;margin:0 0 14px!important;border-radius:12px!important}
        .workflow-section.sf-v7 .sf-v7-action{box-sizing:border-box!important;overflow:hidden!important;contain:layout paint!important}
        .workflow-section.sf-v7 .sf-v7-head{width:100%!important;max-width:100%!important;min-width:0!important;grid-template-columns:54px minmax(0,1fr) 64px!important}
        .workflow-section.sf-v7 .sf-v7-head button,.workflow-section.sf-v7 .sf-v7-head .title{min-width:0!important;max-width:100%!important;overflow:hidden!important}
        .workflow-section.sf-v7 .sf-v7-prompt{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;height:132px!important;min-height:132px!important;max-height:132px!important;overflow-y:auto!important;overflow-x:hidden!important;box-sizing:border-box!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important;word-break:break-word!important}
        .workflow-section.sf-v7 .sf-v7-download{width:100%!important;max-width:100%!important;box-sizing:border-box!important}
        @media(max-width:420px){
          .workflow-section.sf-v7 .workflow-card{width:100%!important;max-width:100%!important;padding-left:14px!important;padding-right:14px!important}
          .workflow-section.sf-v7 .workflow-body{width:100%!important;max-width:100%!important}
          .workflow-section.sf-v7 .sf-v7-tool a{flex-basis:46px!important;width:46px!important;height:46px!important}
          .workflow-section.sf-v7 .sf-v7-tool img{width:38px!important;height:38px!important}
          .workflow-section.sf-v7 .sf-v7-head{grid-template-columns:50px minmax(0,1fr) 60px!important}
          .workflow-section.sf-v7 .sf-v7-head button{padding-left:4px!important;padding-right:4px!important;font-size:9px!important}
          .workflow-section.sf-v7 .sf-v7-prompt{height:132px!important;min-height:132px!important;max-height:132px!important;padding:12px!important;font-size:12px!important;line-height:1.5!important}
        }
      `;
      document.head.appendChild(style);
    }

    section.querySelectorAll('.workflow-card').forEach((card, index) => {
      const body = card.querySelector('.workflow-body');
      const tool = body?.querySelector('.sf-v7-tool');
      const settings = body?.querySelector('.sf-v7-settings');
      if (!body || !tool) return;

      if (settings) tool.insertAdjacentElement('afterend', settings);

      const link = tool.querySelector('a');
      const img = tool.querySelector('img');
      if (link && img) {
        link.href = index < 4 ? 'https://flow.google/' : 'https://www.capcut.com/';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', index < 4 ? 'Google Flow' : 'CapCut');
        img.alt = '';
        img.src = '/api/tool-logo?url=' + encodeURIComponent(index < 4 ? 'https://flow.google/' : 'https://www.capcut.com/');
        img.onerror = () => {
          img.onerror = null;
          img.src = index < 4 ? 'https://www.google.com/s2/favicons?domain=flow.google&sz=128' : 'https://www.google.com/s2/favicons?domain=capcut.com&sz=128';
        };
      }

      const purpose = tool.querySelector('.sf-v7-purpose span');
      if (purpose) {
        purpose.style.fontSize = '12px';
        purpose.style.fontWeight = '850';
      }

      const inputs = [...body.querySelectorAll('.sf-v7-input')];
      const demoForStep = [demoImages.character, demoImages.dress, demoImages.character, demoImages.clip1, demoImages.clip2];
      inputs.forEach((input, inputIndex) => {
        if (input.querySelector('img.sf-v8-media')) return;
        const type = input.querySelector('.sf-v7-type')?.textContent?.trim().toLowerCase();
        const src = index === 0
          ? (inputIndex === 0 ? demoImages.character : demoImages.dress)
          : index === 1
            ? demoImages.character
            : index === 2
              ? (inputIndex === 0 ? demoImages.clip1 : demoImages.character)
              : index === 3
                ? (inputIndex === 0 ? demoImages.clip2 : demoImages.character)
                : (inputIndex === 0 ? demoImages.clip1 : inputIndex === 1 ? demoImages.clip2 : demoImages.clip3);
        const media = document.createElement('img');
        media.className = 'sf-v8-media';
        media.src = src;
        media.alt = `${type || 'reference'} preview`;
        const missing = input.querySelector('.sf-v7-missing');
        if (missing) missing.remove();
        const typeLabel = input.querySelector('.sf-v7-type');
        if (typeLabel) typeLabel.insertAdjacentElement('afterend', media);
      });

      const output = body.querySelectorAll('.sf-v7-output')[0];
      if (output && !output.querySelector('.sf-v8-output-media')) {
        const media = document.createElement('img');
        media.className = 'sf-v8-output-media';
        media.src = index === 0 ? demoImages.character : index === 1 ? demoImages.clip1 : index === 2 ? demoImages.clip2 : index === 3 ? demoImages.clip3 : demoImages.final;
        media.alt = 'Output preview';
        output.prepend(media);
      }
    });

    const final = section.querySelector('.sf-v7-final-card');
    if (final && !final.querySelector('.sf-v8-final-media')) {
      const media = document.createElement('img');
      media.className = 'sf-v8-final-media';
      media.src = demoImages.final;
      media.alt = 'Final video preview';
      final.prepend(media);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fix, { once: true });
  } else {
    fix();
  }
});