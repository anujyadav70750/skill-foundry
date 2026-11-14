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
heroImage: "/Toy%20Car%20to%20Real%20Mustang%20Transformation.png"
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
  Use the complete master prompt in Step 02 to replace the vehicle in the supplied reference video with the vehicle shown in the uploaded car image. Keep the prompt together as one complete instruction.
steps:
  - title: "Download the Reference Video"
    tool: "Google Flow"
    toolPurpose: "REFERENCE VIDEO"
    actionType: "instructions"
    outputType: "video"
    outputLabel: "Reference Video"
    outputSrc: "/lv_0_20261025125126.mp4"
    downloadUrl: "https://hub.skillfoundry-web.workers.dev/lv_0_20261025125126.mp4"
    downloadLabel: "Download Reference Video"
    purpose: "Save the supplied driving clip to your phone before opening Google Flow. You will use it as the video reference in Step 02."
    description: "Save the supplied driving clip to your phone before opening Google Flow. You will use it as the video reference in Step 02."
    process: |
      1. Play the reference video shown here to check that it is the clip you want to use.
      2. Open the Guide tab and tap Download Reference Video to save the MP4 file to your phone.
      3. Keep the downloaded clip on your phone. You will upload it to Google Flow in Step 02.
    details:
      - label: "FILE TYPE"
        value: "MP4 video"
      - label: "USED IN"
        value: "Step 02 — Google Flow"

  - title: "Generate Your Car Video"
    tool: "Google Flow"
    toolPurpose: "VIDEO GENERATION"
    actionType: "prompt"
    outputType: "image"
    outputLabel: "Car Image Reference Example"
    outputSrc: "/images/car-transition-hero.svg"
    purpose: "Use your own car photo and the downloaded reference video to generate your car-replacement video in Google Flow."
    description: "Use your own car photo and the downloaded reference video to generate your car-replacement video in Google Flow."
    guidePoints:
      - "Open Chrome on your phone and visit the official Google Flow website."
      - "Start a new video project in Google Flow."
      - "Upload a clear photo of your own car as the image reference."
      - "Upload the reference video you downloaded in Step 01. Make sure both the car photo and reference video are attached."
      - "Copy the complete master prompt from the Prompt tab and paste it into Google Flow as one complete instruction."
      - "Open the Details tab and apply the settings shown there."
      - "Generate the video, review the result, and download your generated video to your phone."
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

  - title: "Finish and Share Your Video"
    tool: "Instagram"
    toolPurpose: "OPTIONAL EDITING & SHARING"
    actionType: "instructions"
    outputType: "video"
    outputLabel: "Finished Video Example"
    outputSrc: "https://www.instagram.com/reel/Dfu1akyKc8E/embed"
    purpose: "Optionally edit, save, and share the car video you generated in Step 02. The Instagram Reel shown here is an example of a finished result, not your generated file."
    description: "Optionally edit, save, and share the car video you generated in Step 02. The Instagram Reel shown here is an example of a finished result, not your generated file."
    process: |
      1. Play the Instagram Reel shown here to preview an example of the finished car-replacement result. This is an example only, not your generated video.
      2. Open the video you downloaded from Google Flow in Step 02 using Instagram or any video editor on your phone. Instagram is optional.
      3. If needed, trim the clip or add music, filters, or other finishing touches.
      4. Save or export the finished video to your phone.
      5. Share it as an Instagram Reel or video post, or send the video wherever you like.
    details:
      - label: "RESULT EXAMPLE"
        value: "Instagram Reel"
      - label: "YOUR VIDEO"
        value: "Use the video you generated and downloaded in Step 02"

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
