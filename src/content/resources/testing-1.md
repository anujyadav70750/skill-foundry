---
title: "Create Consistent AI Character Videos"
slug: "testing-1"
description: "A practical workflow for creating a dressed character image, generating three consistent vertical clips, and assembling them into one final video."
category: "AI Video"
tool: "Google Flow"
toolUrl: "https://flow.google/"
toolAffiliate: false
date: "2026-09-10"
thumbnail: "/images/1000069054-input-16x9-1788985501045.jpg"
thumbnailRatio: "16:9"
heroImage: "/images/1000068513-hero-16x9-1788985443598.jpg"
inputImage: "/images/1000069054-input-16x9-1788985501045.jpg"
inputImages: ["/images/1000069054-input-16x9-1788985501045.jpg"]
inputImageRatios: ["original"]
resultImages: []
resultImageRatios: []
imageAlt: "AI character video workflow cover image"
intro: "Start with the character and clothing references, then follow the workflow in order to create three connected clips and assemble the final video."
whatItDoes: "Keep character identity, outfit, framing, and visual continuity consistent from the first image to the final video."
toolsUsed:
  - name: "Google Flow"
    purpose: "Image and video generation used to create the character image and three vertical clips."
    url: "https://flow.google/"
    affiliate: false
  - name: "CapCut"
    purpose: "Video editing tool used to assemble the generated clips into the final vertical video."
    url: "https://www.capcut.com/"
    affiliate: false
prompt: |
  Use the workflow steps below to create a consistent AI character video.
steps:
  - title: "Create the dressed character image"
    purpose: "Create the dressed character image that will become the visual foundation."
    actionType: "prompt"
    outputType: "image"
    outputLabel: "Dressed character image"
    outputDescription: "Generated character image used as the visual foundation for the video clips."
    tool: "Google Flow"
    toolPurpose: "IMAGE GENERATION"
    inputs:
      - type: "image"
        label: "Character reference"
        role: "Primary identity reference"
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85"
      - type: "image"
        label: "Dress reference"
        role: "Clothing / outfit reference"
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85"
    settings:
      - label: "MODEL"
        value: "Nano Banana Pro"
      - label: "ASPECT RATIO"
        value: "9:16"
    process: "Use the uploaded character image as the primary identity reference. Preserve the character’s facial identity, facial structure, hairstyle, skin tone, and overall appearance. Use the uploaded dress image as the clothing reference and replace the character’s current outfit with the referenced dress. Keep the character’s identity and proportions consistent. Create a polished vertical 9:16 image with natural lighting, realistic fabric details, and a clean cinematic presentation."
    next: "Use this dressed character image as the reference for Video Clip 01 in Step 02."
  - title: "Generate video clip 01"
    purpose: "Turn the dressed character image into the first vertical video clip."
    actionType: "prompt"
    outputType: "video"
    outputLabel: "Video Clip 01"
    outputDescription: "First generated 10-second vertical clip."
    tool: "Google Flow"
    toolPurpose: "VIDEO GENERATION"
    inputs:
      - type: "image"
        label: "Dressed character image"
        role: "Starting frame / character reference"
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85"
    settings:
      - label: "MODEL"
        value: "Gemini Omni"
      - label: "ASPECT RATIO"
        value: "9:16"
      - label: "DURATION"
        value: "10 sec"
    process: "Use the uploaded dressed character image as the primary visual reference. Keep the same character identity, outfit, appearance, and visual style. Animate the character naturally according to the supplied scene direction, with realistic movement and a consistent vertical 9:16 composition. Create one clean 10-second video clip."
    next: "Use Video Clip 01 as the continuity reference for Step 03."
  - title: "Generate video clip 02"
    purpose: "Continue the sequence using Video Clip 01 as the continuity reference."
    actionType: "prompt"
    outputType: "video"
    outputLabel: "Video Clip 02"
    outputDescription: "Second generated 10-second vertical clip."
    tool: "Google Flow"
    toolPurpose: "VIDEO GENERATION"
    inputs:
      - type: "video"
        label: "Clip 01 / continuity reference"
        role: "Previous clip reference"
        src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85"
      - type: "image"
        label: "Dressed character image"
        role: "Character consistency reference"
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85"
    settings:
      - label: "MODEL"
        value: "Gemini Omni"
      - label: "ASPECT RATIO"
        value: "9:16"
      - label: "DURATION"
        value: "10 sec"
    process: "Continue the same visual character and outfit established in Clip 01. Use the supplied reference assets to maintain identity, clothing, lighting, framing, and overall visual continuity. Generate the next natural 10-second vertical clip with the new scene direction."
    next: "Use Video Clip 02 as the continuity reference for Step 04."
  - title: "Generate video clip 03"
    purpose: "Continue the sequence using Video Clip 02 as the continuity reference."
    actionType: "prompt"
    outputType: "video"
    outputLabel: "Video Clip 03"
    outputDescription: "Third generated 10-second vertical clip."
    tool: "Google Flow"
    toolPurpose: "VIDEO GENERATION"
    inputs:
      - type: "video"
        label: "Clip 02 / continuity reference"
        role: "Previous clip reference"
        src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85"
      - type: "image"
        label: "Dressed character image"
        role: "Character consistency reference"
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85"
    settings:
      - label: "MODEL"
        value: "Gemini Omni"
      - label: "ASPECT RATIO"
        value: "9:16"
      - label: "DURATION"
        value: "10 sec"
    process: "Continue the same character, outfit, visual language, lighting, and vertical framing established by the previous clips. Use the supplied continuity reference and character image to keep the result visually consistent. Generate the final 10-second clip with the required closing scene direction."
    next: "Bring Video Clips 01, 02, and 03 into CapCut for the final video assembly in Step 05."
  - title: "Assemble the final video"
    purpose: "Arrange the three generated clips into the final vertical video."
    actionType: "instructions"
    outputType: "video"
    outputLabel: "Final edited video"
    outputDescription: "This is the completed video exported from the editing step."
    tool: "CapCut"
    toolPurpose: "VIDEO EDITING"
    inputs:
      - type: "video"
        label: "Video Clip 01"
        role: "First sequence"
        src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85"
      - type: "video"
        label: "Video Clip 02"
        role: "Second sequence"
        src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85"
      - type: "video"
        label: "Video Clip 03"
        role: "Third sequence"
        src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85"
    settings:
      - label: "FORMAT"
        value: "9:16"
      - label: "EDIT"
        value: "Trim + arrange + transitions"
      - label: "EXPORT"
        value: "1080p"
    process: |
      Import Video Clip 01, Video Clip 02 and Video Clip 03.
      Arrange them in the intended order.
      Trim unnecessary portions and adjust timing.
      Add simple transitions only if needed for continuity.
      Keep the project vertical at 9:16.
      Export the completed video at 1080p.
    next: ""
tips:
  - "Keep the character reference and clothing reference consistent across every generation step."
  - "Use the previous clip as the continuity reference when generating the next clip."
  - "Keep the same 9:16 framing, outfit, lighting language, and character identity across the sequence."
  - "Assemble the three clips in order and use transitions only when they improve continuity."
relatedResources: []
tags:
  - "ai-video"
  - "character-consistency"
  - "google-flow"
  - "video-workflow"
featured: false
---

## Workflow

This resource documents a practical Google Flow workflow for creating a consistent AI character video from a character reference and clothing reference.
