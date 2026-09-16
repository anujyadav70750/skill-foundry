(() => {
  const init = () => {
    const allInputSources = new Set(
      [...document.querySelectorAll('.input-card img.media-main[src], .input-card video.media-main[src]')]
        .map((el) => el.getAttribute('src'))
        .filter(Boolean)
    );

    document.querySelectorAll('.workflow-card').forEach((card) => {
      const outputFrame = card.querySelector('.output-card .media-frame');
      if (!outputFrame) return;

      const outputMedia = outputFrame.querySelector('.media-main');
      const outputSrc = outputMedia?.getAttribute('src');

      // The current renderer can fall back to a later step's input when no real output
      // asset exists. Never display that fallback as though it were a generated output.
      if (!outputSrc || allInputSources.has(outputSrc)) outputFrame.remove();
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
