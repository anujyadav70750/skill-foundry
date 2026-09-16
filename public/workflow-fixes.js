(() => {
  const init = () => {
    document.querySelectorAll('.workflow-card').forEach((card) => {
      const inputSources = new Set(
        [...card.querySelectorAll('.input-card img.media-main[src], .input-card video.media-main[src]')]
          .map((el) => el.getAttribute('src'))
          .filter(Boolean)
      );

      const outputFrame = card.querySelector('.output-card .media-frame');
      if (!outputFrame) return;

      const outputMedia = outputFrame.querySelector('.media-main');
      const outputSrc = outputMedia?.getAttribute('src');
      const hasExplicitOutput = outputSrc && !inputSources.has(outputSrc);

      // Never present a next-step input as if it were the current step's output.
      if (!hasExplicitOutput) outputFrame.remove();
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
