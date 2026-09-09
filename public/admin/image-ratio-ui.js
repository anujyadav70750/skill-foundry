// Input/output image selection is owned by input-output-ratio-fallback.js.
// This compatibility shim intentionally does not register any file-input
// change handlers, preventing competing capture listeners from blocking the
// dedicated picker and ratio popup.
(() => {
  window.SkillFoundryLegacyImageRatio = { disabled: true };
})();
