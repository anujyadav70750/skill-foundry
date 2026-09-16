# Skill Foundry — Permanent Workflow & Safety Rules

## Operational Workflow Pipeline
Every user-requested change or feature must follow this strict sequential lifecycle:
1. Make the requested changes in the AI Studio workspace.
2. Test and build the application thoroughly (`compile_applet`).
3. Show the result in the AI Studio preview.
4. Wait for user approval when the change requires approval.
5. After the approved change is complete, commit and synchronize the approved changes to the connected GitHub repository on branch `main`.
6. Verify that the Cloudflare production deployment is triggered and completed.
7. Verify the live website (`https://hub.skillfoundryai.workers.dev`) to confirm changes are live.
8. Never push or publish changes that have not been approved.
9. Never make unrelated changes, redesign other sections, or modify already-correct areas without approval.

## Intended Production Flow
`AI Studio Workspace` → `Approved Changes` → `GitHub main branch` → `Cloudflare Build & Deploy` → `Live Skill Foundry Production Site`.
