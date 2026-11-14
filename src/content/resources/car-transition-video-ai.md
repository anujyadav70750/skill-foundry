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
instagramReelUrl: "https://www.instagram.com/reel/De9IEfQh9RD/?mdxt=MWE2bnU0MGZmeGVnZg=="
videoEmbedUrl: "https://www.instagram.com/reel/De9IEfQh9RD/embed"
imageAlt: "A bright green sports car driving along a cinematic mountain road"
intro: "Make sure you have a clear image of the car you’d like to use. Make sure you have access to the required tools before starting."
whatItDoes: "Replaces the vehicle in supplied reference footage with the vehicle shown in the user's car image while aiming to preserve the original scene, camera movement, timing, and driving action."
toolsUsed:
  - name: "Google Flow"
    purpose: "Demonstrates the image-and-video reference workflow and the generation settings used in this guide. Other tools may be used if they support the same reference inputs and video-generation workflow."
    url: "https://labs.google/fx/tools/flow"
    affiliate: false
prompt: |
  Use the complete master prompt in Step 03 to replace the vehicle in the supplied reference video with the vehicle shown in the uploaded car image. Keep the prompt together as one complete instruction.
steps:
  - title: "Upload Car Image"
    tool: "Google Flow"
    toolPurpose: "REFERENCE IMAGE"
    actionType: "instructions"
    outputType: "image"
    outputLabel: "Car Reference Example"
    outputSrc: "/images/car-transition-hero.svg"
    purpose: "Create a visual reference of your car for the video."
    description: "Create a visual reference of your car for the video."
    process: |
      1. Open the official Google Flow website.
      2. Start your video project.
      3. Choose a clear image of your car and upload it as the image reference.
    details:
      - label: "TOOL USED"
        value: "Google Flow"
  - title: "Generate Car Video"
    tool: "Google Flow"
    toolPurpose: "VIDEO GENERATION"
    actionType: "prompt"
    outputType: "video"
    outputLabel: "Supplied Reference Video"
    outputSrc: "/lv_0_20261025125126.mp4"
    downloadUrl: "https://hub.skillfoundry-web.workers.dev/lv_0_20261025125126.mp4"
    downloadLabel: "Download Reference Video"
    purpose: "Generate the video using your car image and the supplied reference video."
    description: "Generate the video using your car image and the supplied reference video."
    guidePoints:
      - "Use the Download Reference Video link in the Guide tab to save the clip to your phone."
      - "Open the Google Flow project from Step 01 and upload the downloaded reference video alongside your car image."
      - "Copy the complete master prompt below and paste it into Google Flow."
      - "Apply the settings listed in the Details tab."
      - "Generate your video and download the result to your phone."
    details:
      - label: "TOOL USED"
        value: "Google Flow"
      - label: "PROMPT TYPE"
        value: "One complete master prompt"
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

  - title: "View Final Video"
    tool: "Instagram"
    toolPurpose: "FINAL RESULT"
    actionType: "instructions"
    outputType: "video"
    outputLabel: "Finished Car Video"
    outputSrc: "https://www.instagram.com/reel/Dfu1akyKc8E/embed"
    purpose: "Preview your finished car video."
    description: "Preview your finished car video."
    process: |
      1. Play the video below to see an example of the finished car-replacement result.
    details:
      - label: "RESULT PLATFORM"
        value: "Instagram"
tips:
  - "Choose a sharp car image where the vehicle's body, wheels, lights, and paint details are easy to see."
  - "Use the supplied reference video rather than a different clip if you want to follow the example workflow."
  - "Keep the complete master prompt together. Its instructions are written to preserve the original footage while changing the vehicle."
  - "Check that both reference inputs are attached before generating."
  - "The settings in this guide match the demonstrated Google Flow setup. Other tools may use different model names, controls, limits, or prompt formats."
  - "AI video results can vary. Review the vehicle's shape, wheels, reflections, shadows, and movement before choosing the final version."
relatedResources: []
tags:
  - "car-transition"
  - "car-replacement"
  - "google-flow"
  - "ai-video"
  - "video-generation"
  - "reference-video"
  - "prompt-engineering"
featured: false
seoTitle: "Create a Car Transition Video with Your Own Car Using AI | Skill Foundry"
seoDescription: "Learn how to replace the car in a reference video with your own vehicle using a guided AI video workflow, a complete master prompt, and the demonstrated generation settings."
---
