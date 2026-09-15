---
title: "Turn Rough Ideas Into Polished AI Content"
slug: "testing-1"
description: "A practical workflow for turning a rough idea into clear, polished content with a strong hook, useful structure, and a consistent professional tone."
category: "Prompts"
tool: "Skill Foundary AI"
toolUrl: "https://hub.skillfoundryai.workers.dev/admin/"
toolAffiliate: false
date: "2026-09-10"
thumbnail: "/images/1000069055-thumbnail-16x9-1788985430602.jpg"
thumbnailRatio: "16:9"
heroImage: "/images/1000068513-hero-16x9-1788985443598.jpg"
inputImage: "/images/1000069054-input-16x9-1788985501045.jpg"
inputImages: ["/images/1000069054-input-16x9-1788985501045.jpg"]
inputImageRatios: ["original"]
resultImages: ["/images/1000069056-result-16x9-1788985389269.jpg"]
resultImageRatios: ["original"]
imageAlt: null
intro: "Start with the idea you actually have, even if it is incomplete. The workflow turns the rough input into a clear direction, develops that direction into a polished draft, and then prepares it for presentation."
whatItDoes: "The prompt gives an AI model enough context to understand the audience, purpose, tone, format, and important details before writing. It also asks the model to preserve supplied facts, avoid generic filler, and make assumptions explicit when information is missing."
toolsUsed:
  - name: "Skill Foundary AI"
    purpose: "Primary AI tool used for this resource."
    url: "https://hub.skillfoundryai.workers.dev/admin/"
    affiliate: false
  - name: "Canva"
    purpose: "Design and visual editing tool used for the final presentation test."
    url: "https://www.canva.com/"
    affiliate: false
  - name: "Notion"
    purpose: "Workspace used for organizing the draft and testing the workflow."
    url: "https://www.notion.so/"
    affiliate: false
  - name: "GitHub"
    purpose: "Repository and collaboration platform used for the resource test."
    url: "https://github.com/"
    affiliate: false
  - name: "Google Flow"
    purpose: "Image generation tool used to create the dressed character image."
    url: "https://flow.google/"
    affiliate: false
  - name: "CapCut"
    purpose: "Video editing tool used for final assembly."
    url: "https://www.capcut.com/"
    affiliate: false
prompt: |-
  You are an expert content strategist and editor. Turn my rough idea into polished, useful content without making it sound generic, robotic, or over-written.

  INPUTS
  - Rough idea or topic: [PASTE YOUR IDEA]
  - Target audience: [WHO IS THIS FOR?]
  - Goal: [WHAT SHOULD THE CONTENT ACHIEVE?]
  - Desired tone: [e.g. practical, friendly, authoritative, conversational]
  - Format/platform: [e.g. Instagram Reel, carousel, YouTube script, LinkedIn post, blog]
  - Key details or facts that must be preserved: [PASTE DETAILS]
  - Call to action, if needed: [PASTE CTA OR WRITE "NONE"]

  TASK
  1. Understand the real purpose of the idea and the audience before writing.
  2. Turn the rough idea into one clear content angle. Remove unnecessary repetition and keep the central message easy to understand.
  3. Create 3 strong opening hooks suited to the chosen format. Make them specific to the topic rather than generic clickbait.
  4. Build a logical structure so every section naturally leads to the next.
  5. Write the polished draft in the requested tone and format. Keep the language natural and useful. Avoid filler, exaggerated claims, empty motivational phrases, and unnecessary jargon.
  6. Preserve all facts and important details supplied by me. Never invent statistics, quotations, product features, results, or personal experiences. If important information is missing, make the smallest reasonable assumption and clearly label it.
  7. Make the final content easy to scan and easy to edit. Use short paragraphs, clear headings, bullets, or scene/section breaks when the format benefits from them.
  8. If the requested platform has an obvious length or structure expectation, adapt the draft to it while keeping the main message intact.
  9. End with a natural call to action only when a CTA is requested or clearly appropriate for the format.

  OUTPUT FORMAT
  A. CONTENT ANGLE
  One sentence explaining the strongest angle for this idea.

  B. 3 HOOKS
  Give three different opening options.

  C. POLISHED CONTENT
  Give the final ready-to-use draft. Do not add commentary inside the draft unless it is part of the requested format.

  D. CTA
  Give the final CTA if one is needed; otherwise write "No CTA needed."

  E. EDITOR NOTES
  List only the most important assumptions, missing information, or factual points that I should verify before publishing.

  QUALITY CHECK
  Before returning the answer, check that the content matches the audience, goal, tone, and format; the structure is logical; supplied facts were preserved; and no unsupported claims were introduced.
videoEmbedUrl: "https://www.youtube.com/embed/eRTtU1znZI4"
originalVideoUrl: "https://www.youtube.com/watch?v=eRTtU1znZI4"
steps:
  - title: "Create the dressed character image"
    tool: "Google Flow"
    toolPurpose: "IMAGE GENERATION"
    inputs:
      - type: "image"
        label: "Character reference"
        role: "Primary identity reference"
        value: ""
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85"
      - type: "image"
        label: "Dress reference"
        role: "Clothing / outfit reference"
        value: ""
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85"
    settings:
      - label: "MODEL"
        value: "Nano Banana Pro"
      - label: "ASPECT RATIO"
        value: "9:16"
    process: "Use the uploaded character image as the primary identity reference. Preserve the character’s facial identity, facial structure, hairstyle, skin tone, and overall appearance. Use the uploaded dress image as the clothing reference and replace the character’s current outfit with the referenced dress. Keep the character’s identity and proportions consistent. Create a polished vertical 9:16 image with natural lighting, realistic fabric details, and a clean cinematic presentation."
    output: "Dressed character image"
    next: "Use this generated character image as the reference for the first video clip."
    description: ""
  - title: "Generate the polished draft"
    tool: "Skill Foundary AI"
    input: "Structured content direction from Step 1\nKey details to preserve"
    process: "Turn the direction into a polished draft with a strong opening, logical structure, useful details, and a consistent professional tone."
    output: "A polished first draft ready for visual formatting."
    next: "Take the polished draft into Step 3 for final presentation."
  - title: "Format the final presentation"
    tool: "Canva"
    input: "Polished draft from Step 2\nBrand/style reference\nFinal dimensions"
    process: "Place the polished content into the chosen visual layout, refine spacing and hierarchy, and prepare the final presentation."
    output: "A finished, presentation-ready AI content piece."
    next: "Final result is ready to publish or share."
tips:
  - "Give the model the real audience and goal instead of only describing the topic."
  - "Add facts, examples, references, or brand constraints that must not be lost."
  - "For platform-specific content, name the platform and desired format before generating."
  - "Review the Editor Notes and verify important facts before publishing."
relatedResources: []
tags:
  - "prompt-engineering"
  - "content-creation"
  - "ai-writing"
  - "content-workflow"
featured: false
---

## Prompt

You are an expert content strategist and editor. Turn my rough idea into polished, useful content without making it sound generic, robotic, or over-written.

INPUTS
- Rough idea or topic: [PASTE YOUR IDEA]
- Target audience: [WHO IS THIS FOR?]
- Goal: [WHAT SHOULD THE CONTENT ACHIEVE?]
- Desired tone: [e.g. practical, friendly, authoritative, conversational]
- Format/platform: [e.g. Instagram Reel, carousel, YouTube script, LinkedIn post, blog]
- Key details or facts that must be preserved: [PASTE DETAILS]
- Call to action, if needed: [PASTE CTA OR WRITE "NONE"]

TASK
1. Understand the real purpose of the idea and the audience before writing.
2. Turn the rough idea into one clear content angle. Remove unnecessary repetition and keep the central message easy to understand.
3. Create 3 strong opening hooks suited to the chosen format. Make them specific to the topic rather than generic clickbait.
4. Build a logical structure so every section naturally leads to the next.
5. Write the polished draft in the requested tone and format. Keep the language natural and useful. Avoid filler, exaggerated claims, empty motivational phrases, and unnecessary jargon.
6. Preserve all facts and important details supplied by me. Never invent statistics, quotations, product features, results, or personal experiences. If important information is missing, make the smallest reasonable assumption and clearly label it.
7. Make the final content easy to scan and easy to edit. Use short paragraphs, clear headings, bullets, or scene/section breaks when the format benefits from them.
8. If the requested platform has an obvious length or structure expectation, adapt the draft to it while keeping the main message intact.
9. End with a natural call to action only when a CTA is requested or clearly appropriate for the format.

OUTPUT FORMAT
A. CONTENT ANGLE
One sentence explaining the strongest angle for this idea.

B. 3 HOOKS
Give three different opening options.

C. POLISHED CONTENT
Give the final ready-to-use draft. Do not add commentary inside the draft unless it is part of the requested format.

D. CTA
Give the final CTA if one is needed; otherwise write "No CTA needed."

E. EDITOR NOTES
List only the most important assumptions, missing information, or factual points that I should verify before publishing.

QUALITY CHECK
Before returning the answer, check that the content matches the audience, goal, tone, and format; the structure is logical; supplied facts were preserved; and no unsupported claims were introduced.
