---
title: "Create a Viral Car Transition Video with Your Own Car Using AI"
slug: "car-transition-video-ai"
authorId: "skill-foundry"
description: "Create your own version of this trending car video. Use a photo of your vehicle as the reference, bring it into the original driving scene, and create a video that puts your car in the spotlight."
category: "AI Video"
tool: "Google Flow"
toolUrl: "https://labs.google/fx/tools/flow"
toolAffiliate: false
date: "2026-11-14"
thumbnail: "/images/car-transition-hero.svg"
thumbnailRatio: "16:9"
heroImage: "/images/car-transition-hero.svg"
imageAlt: "A bright green sports car driving along a cinematic mountain road"
intro: "Make sure you have a clear image of the car you want to feature. Download the reference video provided with this resource, and make sure you have access to the required tools before starting."
whatItDoes: "Replaces the vehicle in supplied reference footage with the vehicle shown in the user's car image while aiming to preserve the original scene, camera movement, timing, and driving action."
toolsUsed:
  - name: "Google Flow"
    purpose: "Demonstrates the image-and-video reference workflow and the generation settings used in this guide. Other tools may be used if they support the same reference inputs and video-generation workflow."
    url: "https://labs.google/fx/tools/flow"
    affiliate: false
prompt: |
  Use the complete master prompt in Step 04 to replace the vehicle in the supplied reference video with the vehicle shown in the uploaded car image. Keep the prompt together as one complete instruction.
steps:
  - title: "Start Your Video Project"
    tool: "Google Flow"
    toolPurpose: "VIDEO GENERATION"
    actionType: "instructions"
    outputType: "text"
    purpose: "Set up a new project for the car-replacement workflow."
    description: "Start a new video project before adding the visual references."
    process: |
      1. Open Google Flow.
      2. Start a new video-generation project.
      3. Choose the workflow or generation mode that accepts both an image reference and a reference video.
    details:
      - label: "TOOL USED"
        value: "Google Flow"
  - title: "Upload Your Car Image"
    tool: "Google Flow"
    toolPurpose: "REFERENCE IMAGE"
    actionType: "instructions"
    outputType: "image"
    outputLabel: "Your Car Reference"
    purpose: "Provide the visual identity reference for the replacement vehicle."
    description: "Use a clear image that shows the car's distinctive design and details."
    process: |
      1. Choose a clear image of the car you want to feature.
      2. Use an image that shows the vehicle's body shape, paint colour, wheels, lights, windows, and other identifying details.
      3. Upload the image as the car reference in your video-generation project.
    details:
      - label: "TOOL USED"
        value: "Google Flow"
      - label: "INPUT"
        value: "One clear car image"
  - title: "Add the Reference Video"
    tool: "Google Flow"
    toolPurpose: "VIDEO REFERENCE"
    actionType: "instructions"
    outputType: "video"
    outputLabel: "Reference Video"
    purpose: "Supply the original footage whose scene and vehicle movement will guide the result."
    description: "Use the reference clip provided with this resource alongside your own car image."
    process: |
      1. Download the reference video using the link below.
      2. Return to your video-generation project.
      3. Upload the downloaded clip as the reference video.
      4. Check that both the car image and reference video are attached before continuing.
    downloadUrl: "https://drive.google.com/file/d/1b-Ng1sz8tKam9Z2CsAnytFDJq7VuuTgS/view?usp=drivesdk"
    downloadLabel: "Download Reference Video"
    details:
      - label: "TOOL USED"
        value: "Google Flow"
      - label: "INPUT"
        value: "Reference video + car image"
  - title: "Add the Master Prompt"
    tool: "Google Flow"
    toolPurpose: "VIDEO PROMPT"
    actionType: "prompt"
    outputType: "video"
    outputLabel: "Car Replacement Video"
    purpose: "Tell the model which vehicle to replace and which parts of the original footage must remain unchanged."
    description: "Use one complete prompt to define the replacement and preserve the original video's visual direction."
    process: |
      Use the uploaded reference video as the base footage.

      Replace ONLY the original car in the video with the car shown in my uploaded car reference image.

      Use my uploaded car image as the STRICT visual identity reference for the replacement vehicle. Preserve its actual body shape, proportions, silhouette, paint colour, graphics, livery, wheels, tyres, windows, lights, hood, spoiler, mirrors, bumpers, trim, and all other distinctive visible details. Do not redesign, restyle, simplify, recolour, or substitute the car.

      Keep the reference video's original footage unchanged in every other respect.

      Preserve the original:
      - camera movement and camera path
      - framing, composition, perspective, and lens characteristics
      - timing, duration, cuts, transitions, and pacing
      - vehicle position, scale, orientation, driving trajectory, speed, and acceleration
      - steering, wheel movement, rotation, and body motion
      - background, road, buildings, objects, people, and scenery
      - lighting, time of day, shadows, and reflections
      - depth of field, motion blur, focus, and exposure

      The replacement car must follow the original car's position, scale, orientation, perspective, movement, acceleration, and timing as closely as possible throughout the footage. It should appear naturally integrated into the original recording.

      Match the replacement vehicle to the original footage's lighting, reflections, shadows, atmospheric conditions, motion blur, and perspective.

      Do NOT change the camera angle, scene, environment, choreography, or any movement from the original footage.

      Do NOT add new objects, effects, camera movements, cinematic shots, transitions, or stylistic changes.

      Do NOT invent vehicle details that are not visible in the uploaded car reference. When a detail is unclear, keep it consistent with the visible reference rather than creating a different design.

      The final result should look as though the original video was filmed with my reference car instead of the original vehicle.
    details:
      - label: "TOOL USED"
        value: "Google Flow"
      - label: "PROMPT TYPE"
        value: "One complete master prompt"
  - title: "Apply the Generation Settings"
    tool: "Google Flow"
    toolPurpose: "GENERATION SETTINGS"
    actionType: "instructions"
    outputType: "text"
    purpose: "Match the generation options used for the example workflow."
    description: "Apply the settings shown in the source guide before generating."
    process: |
      1. Open the generation settings.
      2. Set the aspect ratio to 16:9.
      3. Set the quality to 720p.
      4. Set the duration to 10 seconds.
      5. Set the generation count to ×1.
      6. Select Omni 1.1 Flash as the model.
      7. Check the selected options before starting generation.
    details:
      - label: "TOOL USED"
        value: "Google Flow"
    settings:
      - label: "MODEL"
        value: "Omni 1.1 Flash"
      - label: "ASPECT RATIO"
        value: "16:9"
      - label: "QUALITY"
        value: "720p"
      - label: "DURATION"
        value: "10 seconds"
      - label: "GENERATION"
        value: "×1"
  - title: "Generate Your Video"
    tool: "Google Flow"
    toolPurpose: "VIDEO GENERATION"
    actionType: "instructions"
    outputType: "video"
    outputLabel: "Generated Car Transition Video"
    purpose: "Generate and review the replacement video using the supplied references, prompt, and settings."
    description: "Run the generation, then check how well the replacement car matches the original footage."
    process: |
      1. Start video generation.
      2. Wait for the generated video to finish.
      3. Review the car's appearance, position, movement, and integration with the original scene.
      4. If the result is not satisfactory, generate again using the same references, prompt, and settings.
      5. Download the version you want to keep.
    details:
      - label: "TOOL USED"
        value: "Google Flow"
      - label: "EXPECTED DURATION"
        value: "10 seconds"
tips:
  - "Choose a sharp car image where the vehicle's body, wheels, lights, and paint details are easy to see."
  - "Use the supplied reference video rather than a different clip if you want to follow the example workflow."
  - "Keep the complete master prompt together. Its instructions are written to preserve the original footage while changing the vehicle."
  - "Check that both reference inputs are attached before generating."
  - "The settings in this guide match the demonstrated Google Flow setup. Other tools may use different model names, controls, limits, or prompt formats."
  - "AI video results can vary. Review the vehicle's shape, wheels, reflections, shadows, and movement before choosing the final version."
relatedResources: []
tags:
  - "ai-video"
  - "car-transition"
  - "car-replacement"
  - "video-generation"
  - "prompt-engineering"
  - "google-flow"
  - "reference-video"
  - "workflow"
featured: false
seoTitle: "Create a Car Transition Video with Your Own Car Using AI | Skill Foundry"
seoDescription: "Learn how to replace the car in a reference video with your own vehicle using a guided AI video workflow, a complete master prompt, and the demonstrated generation settings."
---
