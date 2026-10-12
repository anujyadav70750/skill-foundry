import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const cssPath = 'public/workflow-fixes.css';
const marker = '/* SF_RESULT_COMPACT_V1 */';

if (!existsSync(cssPath)) process.exit(0);

const css = readFileSync(cssPath, 'utf8');
if (css.includes(marker)) process.exit(0);

const patch = `

${marker}
/* Keep the final Result node visually equal to the single-column workflow step width. */
.testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result,
.blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result {
  width: min(320px, calc(100% - 32px)) !important;
  min-width: 0 !important;
  max-width: 320px !important;
  justify-self: center !important;
  box-sizing: border-box !important;
}
.testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-inner,
.blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-inner {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
}
.testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-media-center,
.blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-media-center {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
}
.testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-media-center .media-frame,
.blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result .blueprint-result-media-center .media-frame {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
}
@media (max-width: 640px) {
  .testing-1-theme .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result,
  .blueprint-inner-workflow-container.sf-graph-blueprint #workflow-final-result {
    width: min(320px, calc(100vw - 32px)) !important;
    max-width: min(320px, calc(100vw - 32px)) !important;
  }
}
`;

writeFileSync(cssPath, css.trimEnd() + patch);
