---
title: "Create a Cinematic Medieval Knight Video with Google Flow"
slug: "cinematic-medieval-knight-video-google-flow"
description: "A five-step workflow for creating a consistent medieval knight character, matching helmet and sword props, building a misty poppy-field location, generating a cinematic 10-second video, and finishing it in Instagram."
category: "AI Video"
tool: "Google Flow"
toolUrl: "https://labs.google/fx/tools/flow"
toolAffiliate: false
date: "2026-10-04"
thumbnail: "/images/knight-poppies-thumbnail.png"
thumbnailRatio: "16:9"
heroImage: "/images/knight-poppies-thumbnail.png"
instagramReelUrl: "https://www.instagram.com/reel/DeD0aGQPgz9/?stkn=c21qODlteWxhNTFk"
videoEmbedUrl: "https://www.instagram.com/reel/DeD0aGQPgz9/embed"
inputImage: "/images/knight-face-reference.png"
inputImages:
  - "/images/knight-face-reference.png"
  - "/images/knight-character-sheet.png"
  - "/images/knight-props.png"
  - "/images/misty-poppy-location.png"
inputImageRatios:
  - "3:4"
  - "9:16"
  - "16:9"
  - "16:9"
resultImages: []
resultImageRatios: []
imageAlt: "Cinematic medieval knight resting among red poppies"
intro: "Build the video in order: lock the character first, create matching props, establish the location, generate the cinematic shot, then finish the result in Instagram."
whatItDoes: "Maintains character identity, armor, props, environment, camera movement, and visual continuity through a chained reference workflow."
toolsUsed:
  - name: "ChatGPT"
    purpose: "Create the character, prop, and location reference images."
    url: "https://chatgpt.com/"
    affiliate: false
  - name: "Google Flow"
    purpose: "Generate the cinematic 10-second video from the three reference images."
    url: "https://labs.google/fx/tools/flow"
    affiliate: false
  - name: "Instagram"
    purpose: "Slow the video, optionally add available music or remix elements, download, and share the final result."
    url: "https://www.instagram.com/"
    affiliate: false
prompt: |
  Follow the five-step workflow below to create the final cinematic medieval knight video.
steps:
  - title: "Create Character Sheet"
    purpose: "Create your knight character using the prompt."
    description: "Create your knight character using the prompt."
    actionType: "prompt"
    outputType: "image"
    outputLabel: "4-frame character reference"
    outputDescription: "A single vertical 9:16 character sheet containing the front, side, back, and close-up views."
    tool: "ChatGPT"
    toolPurpose: "IMAGE GENERATION"
    inputs:
      - type: "image"
        label: "Original person/reference photo"
        role: "Strict identity reference"
        src: "/images/knight-face-reference.png"
    settings: []
    process: |
      Use the uploaded person/reference photo as the STRICT IDENTITY REFERENCE.

      Create a highly realistic medieval knight character sheet of the EXACT SAME PERSON from the uploaded reference image.

      IDENTITY LOCK — ABSOLUTE PRIORITY:
      Preserve the person's exact recognizable identity from the uploaded reference.
      Keep the same facial structure, face shape, jawline, eyes, eyebrows, nose, lips, ears, hairline, hairstyle, skin tone, natural facial proportions, and overall appearance.
      Do not beautify, stylize, age, de-age, masculinize, feminize, or redesign the face.
      Do not invent facial scars, wounds, tattoos, makeup, facial hair, or other facial features that are not present in the reference.
      The person must clearly remain the same individual in every frame.

      CHARACTER OUTFIT — SAME IN ALL 4 FRAMES:
      Dress the person in the exact same medieval knight outfit throughout the entire character sheet:
      Weathered silver medieval steel plate armor
      Dark black/charcoal chainmail visible underneath
      Deep dark-red / burgundy medieval tabard or surcoat
      Large aged cream/off-white medieval cross emblem centered on the chest
      Matching deep burgundy/red hooded cloak attached at the shoulders
      Brown aged leather waist belt with medieval metal buckle
      Additional brown leather straps and hanging belt pieces around the waist
      Layered steel shoulder pauldrons
      Steel vambraces and articulated forearm armor
      Steel medieval gauntlets
      Steel cuisses, knee guards and articulated leg armor
      Steel greaves and medieval steel sabatons
      Dark medieval fabric visible beneath the armor
      Battle-worn but realistic condition: scratches, dents, tarnished steel, dust, dirt, faded burgundy fabric, worn edges and subtle fraying
      Functional historically believable armor construction

      The outfit must remain IDENTICAL across all four frames.
      Do not change the armor design, cloak design, cross emblem, colors, materials, straps, belt, or proportions between views.

      IMPORTANT:
      Do NOT include a helmet.
      Do NOT include a sword.
      Do NOT include a shield.
      The character's natural hair and face must remain visible.

      CHARACTER SHEET LAYOUT — EXACTLY 4 FRAMES:
      Create ONE SINGLE VERTICAL 9:16 PORTRAIT CANVAS.
      Divide the canvas into EXACTLY FOUR equal rectangular frames in a clean 2 × 2 grid.

      TOP-LEFT — FRAME 1:
      FULL-BODY FRONT VIEW.
      The character stands naturally facing directly toward the camera.
      Show the complete character from head to steel sabatons.
      Arms resting naturally at the sides.
      Show the entire front armor construction, burgundy tabard, large cream cross, belt, gauntlets, leg armor and cloak.
      Neutral standing pose.

      TOP-RIGHT — FRAME 2:
      FULL-BODY SIDE PROFILE.
      Show the EXACT SAME character from a clean true side profile.
      Full body from head to steel sabatons.
      Keep the same facial identity, hairstyle, armor, tabard, belt and cloak.
      Show the thickness and layering of the armor and the full length of the cloak.
      Arms naturally resting at the sides.

      BOTTOM-LEFT — FRAME 3:
      FULL-BODY BACK VIEW.
      Show the EXACT SAME character directly from behind.
      Full body from head to steel sabatons.
      Clearly show the back of the steel armor, chainmail, burgundy hooded cloak, cloak construction and worn edges.
      Show the cloak naturally hanging down the back.
      No changes to the character or outfit.

      BOTTOM-RIGHT — FRAME 4:
      FRONT CLOSE-UP PORTRAIT.
      Show the EXACT SAME person's face and upper torso from the front.
      Head, face, neck armor, chainmail collar, shoulder pauldrons, burgundy hooded cloak and upper tabard must be clearly visible.
      Preserve the exact facial identity from the uploaded reference.
      Natural realistic skin texture.
      This frame is specifically for facial identity reference.

      COMPOSITION AND FRAME RULES:
      Exactly 4 frames.
      Exactly 2 rows × 2 columns.
      No additional frames.
      No extra close-ups.
      No armor detail panels.
      No separate hands/feet panels.
      No fifth frame.
      No sixth frame.
      No decorative inset images.
      No overlapping panels.
      No irregular collage layout.
      Each of the four frames must be clearly separated by thin clean white divider lines.
      All four views must show the same person, same face, same hairstyle, same body proportions, same armor, same clothing, same colors and same materials.

      STUDIO PRESENTATION:
      Neutral dark grey studio background.
      Simple professional character-reference-sheet presentation.
      Soft, even studio lighting.
      Consistent lighting direction across all four frames.
      Realistic photographic quality.
      Natural skin texture.
      Realistic metal reflections.
      Realistic fabric texture.
      No cinematic environment.
      The image should look like a professional production character reference sheet designed for maintaining character consistency in AI image and video generation.

      FINAL OUTPUT:
      ONE SINGLE PORTRAIT IMAGE.
      ASPECT RATIO: 9:16.
      EXACTLY FOUR FRAMES.
      2 × 2 GRID.
      TOP LEFT = FRONT FULL BODY.
      TOP RIGHT = SIDE PROFILE FULL BODY.
      BOTTOM LEFT = BACK FULL BODY.
      BOTTOM RIGHT = FRONT CLOSE-UP PORTRAIT.
      No text, labels, names, logos, weapons, helmet, shield, or additional characters.
    outputPreviewSrc: "/images/knight-character-sheet.png"
    next: "Use this Character Sheet as the reference input for Step 02."
    handoff: "Use this Character Sheet as the reference input for Step 02."

  - title: "Create Helmet & Sword"
    purpose: "Create the matching helmet and sword reference."
    description: "Create the matching helmet and sword reference."
    actionType: "prompt"
    outputType: "image"
    outputLabel: "16:9 Helmet + Sword Reference"
    outputDescription: "A single horizontal 16:9 prop-reference image containing the sallet helmet and medieval arming sword."
    tool: "ChatGPT"
    toolPurpose: "IMAGE GENERATION"
    inputs:
      - type: "image"
        label: "Step 01 — Character Sheet output"
        role: "Material and design reference only"
        src: "/images/knight-character-sheet.png"
    settings: []
    process: |
      MEDIEVAL KNIGHT — HELMET + SWORD PROP REFERENCE
      16:9 HORIZONTAL

      Create a photorealistic professional medieval armor-prop reference image containing exactly TWO objects: one knight's helmet and one medieval arming sword.

      REFERENCE USE:
      The uploaded character sheet is a MATERIAL AND DESIGN REFERENCE ONLY.
      Use it to match the knight's existing armor language:
      cool white-silver steel
      metal surface character
      fleur-de-lis engraving style
      brown leather tone
      dark blackened chainmail
      overall medieval construction and visual quality

      Do NOT reproduce the character.
      Do NOT include the character.
      Do NOT copy the character-sheet layout.
      Do NOT use the character sheet as a composition reference.
      The final image must contain ONLY the helmet and sword.

      CANVAS:
      Single horizontal 16:9 image.
      Clean professional studio product-reference composition.
      Pure white seamless background.

      HELMET:
      Create a close-fitting medieval sallet-style knight helmet.
      Shape:
      rounded enclosed skull shell
      smooth rounded crown
      subtle raised central ridge running from front toward the rear
      compact, functional medieval proportions
      slightly extended lower rear protection
      realistic historical construction

      Metal:
      high-polish mirror-chrome white-silver steel
      cold neutral silver appearance
      bright clean reflections
      no yellow, gold, bronze or copper tint
      realistic subtle scratches and tiny signs of use
      mostly polished rather than heavily battered
      no dark gunmetal appearance
      no matte black steel

      BROW:
      The brow edge is open and slightly upward-swept.
      No closed face visor covering the opening.
      Add restrained fine fleur-de-lis and floral engraving along the brow band.
      The engraving should be subtle, elegant and physically etched into the metal rather than painted on.

      NECK PROTECTION:
      Add a short flared steel neck/rear guard in matching polished silver steel.
      At the base, include a short section of dark blackened chainmail aventail made from realistic interlocking metal rings.
      The chainmail should match the blackened chainmail appearance visible in the uploaded character reference.
      Include small realistic rivets and functional attachment points.

      SWORD:
      Create one refined medieval arming sword.
      The sword should be realistic, balanced and practical rather than oversized fantasy weaponry.

      Blade:
      straight double-edged blade
      approximately 75–80 cm visible blade length
      narrow, controlled taper toward the point
      single central fuller
      clean symmetrical edges
      sharp but believable point
      polished white-silver steel
      bright cold mirror-chrome appearance
      subtle realistic surface imperfections
      no gold tint
      no dark steel
      no exaggerated fantasy blade

      CROSSGUARD:
      Straight medieval quillons with slightly tapered ends.
      Cool white-silver polished steel matching the helmet.
      Place a small restrained fleur-de-lis engraving at the center of the guard.

      GRIP:
      Dark-to-medium brown leather wrapping.
      Tight spiral wrap.
      Natural leather grain and slight variation between individual wraps.
      The leather tone should visually match the brown leather belt/straps visible in the uploaded character reference.

      POMMEL:
      Rounded wheel-style pommel.
      Polished cool white-silver steel.
      Small fleur-de-lis engraving centered on the visible face.
      Realistic medieval proportions.

      SCABBARD:
      Include a slim brown leather scabbard associated with the sword.
      The scabbard should have:
      simple brown leather body
      polished white-silver throat fitting
      polished white-silver chape
      restrained medieval construction
      no excessive decoration

      COMPOSITION:
      Place the helmet on the RIGHT side of the frame.
      Place the sword diagonally across the LEFT/central area, positioned separately from the helmet.
      The sword may rest naturally on the studio surface or be displayed diagonally with its full length clearly visible.
      The helmet should remain upright and clearly readable in three-quarter view.
      Both objects must be completely visible from end to end.
      Do not crop either object.
      Do not overlap the sword and helmet in a confusing way.
      Leave comfortable white space around both objects.
      The composition should resemble a clean professional medieval equipment reference photograph, not a poster or character sheet.

      LIGHTING:
      Soft neutral studio lighting around daylight 5600K.
      Even illumination.
      Low contrast.
      Natural soft contact shadows directly beneath the objects.
      Accurate reflections across polished steel.
      No dramatic colored lighting.
      No warm golden lighting.
      No blue cinematic color cast.

      MATERIAL CONSISTENCY:
      Helmet steel and sword steel must share the same cool white-silver mirror-chrome finish.
      The fleur-de-lis engraving language must be consistent between helmet and sword.
      The brown leather on the sword grip and scabbard must visually match the brown leather elements of the uploaded character reference.
      The blackened chainmail on the helmet must visually match the chainmail visible in the uploaded character reference.
      The result should look like these objects were manufactured as part of the SAME knight's equipment set.

      PHOTOREALISM:
      Real photographic material response.
      Realistic steel reflections.
      Realistic leather grain.
      Individual chainmail rings clearly readable.
      Natural micro-scratches and minor imperfections.
      No plastic surfaces.
      No toy appearance.
      No fantasy-game-render appearance.
      No excessive CGI gloss.

      STRICT EXCLUSIONS:
      No person.
      No character.
      No hands.
      No body parts.
      No shield.
      No additional weapons.
      No second sword.
      No second helmet.
      No armor pieces other than the helmet.
      No scenery.
      No grass.
      No flowers.
      No rocks.
      No battlefield.
      No medieval room.
      No dark background.
      No colored background.
      No text.
      No labels.
      No logo.
      No watermark.

      FINAL OUTPUT:
      ONE horizontal 16:9 photorealistic prop-reference image.
      EXACTLY ONE helmet.
      EXACTLY ONE sword.
      Pure white seamless studio background.
      Both objects fully visible.
    outputPreviewSrc: "/images/knight-props.png"
    next: "Use this Helmet + Sword Reference as the prop reference for Step 04."
    handoff: "Use this Helmet + Sword Reference as the prop reference for Step 04."

  - title: "Create Location"
    purpose: "Create the misty poppy-field location using the prompt."
    description: "Create the misty poppy-field location using the prompt."
    actionType: "prompt"
    outputType: "image"
    outputLabel: "16:9 Location Reference"
    outputDescription: "A horizontal 16:9 photorealistic environmental establishing photograph of the untouched wildflower field."
    tool: "ChatGPT"
    toolPurpose: "IMAGE GENERATION"
    inputs: []
    settings: []
    process: |
      MEDIEVAL CINEMATIC LOCATION REFERENCE — MISTY POPPY FIELD — 16:9

      Create a highly realistic cinematic environmental reference photograph of a vast untouched wildflower field at misty pre-sunrise dawn.

      The entire scene is a natural open meadow densely covered with tall red poppies mixed with smaller blue-violet wildflowers and tall green grass stems.
      The vegetation must appear completely natural and untouched.
      There is NO existing walking path, NO trail, NO cleared corridor, NO flattened strip and NO visible human disturbance anywhere in the field.
      The field should feel vast, continuous and naturally dense, extending from the foreground into the distant background.

      ATMOSPHERE:
      Early pre-sunrise dawn.
      Heavy layered ground fog drifting naturally between the flowers.
      Cool grey-blue atmospheric haze.
      A faint pale glow along the distant horizon, but no visible sun.
      Heavy overcast sky with thick grey-blue cloud cover.
      Quiet, cold, mysterious medieval atmosphere.

      BACKGROUND:
      A distant dark cluster of trees sits along the horizon.
      Soft atmospheric mist partially obscures the distant vegetation.
      The horizon remains subtle and low contrast.
      No buildings.
      No roads.
      No fences.
      No modern objects.
      No visible people.

      FOREGROUND:
      Tall red poppies and small blue-violet flowers should be clearly visible.
      Individual stems, leaves, petals and dew should have realistic detail.
      Some foreground flowers may be softly out of focus to create natural cinematic depth.
      The vegetation must remain upright and naturally distributed.

      LIGHTING:
      Soft diffuse cool-neutral pre-sunrise illumination.
      Approximately 6500–7000K visual character.
      No orange or golden-hour color cast.
      No dramatic directional sunlight.
      No visible sun disc.
      Soft open-sky illumination across the entire meadow.
      Natural atmospheric scattering through the fog.

      CAMERA:
      Horizontal 16:9 environmental establishing composition.
      Wide-angle rectilinear perspective.
      Natural cinematic depth and realistic spatial scale.
      Camera positioned approximately at human chest height.
      The field should dominate the frame and communicate its large scale.

      VISUAL STYLE:
      Photorealistic cinematic location photography.
      Real natural vegetation.
      Realistic fog behavior.
      Natural color reproduction.
      Subtle film grain.
      High-detail flowers and grass.
      Physically believable atmospheric depth.
      No fantasy painting appearance.

      CRITICAL LOCATION CONSISTENCY:
      This image is a LOCATION REFERENCE for later image and video generation.
      The same meadow structure, flower types, vegetation density, horizon tree cluster, fog character, sky conditions and cool color palette should remain consistent when this reference is used later.

      NEGATIVE:
      No knight, no person, no horse, no weapons, no armor, no buildings, no road, no path, no footprints, no fence, no vehicles, no structures, no city, no mountains dominating the horizon, no sunset, no orange sunlight, no golden-hour lighting, no tropical vegetation, no desert, no dry grass, no artificial flowers, no fantasy landscape, no painting, no illustration, no text, no watermark.
    outputPreviewSrc: "/images/misty-poppy-location.png"
    next: "Use this Location Reference as the environment reference for Step 04."
    handoff: "Use this Location Reference as the environment reference for Step 04."

  - title: "Generate Video"
    purpose: "Generate the video using these reference images."
    description: "Generate the video using these reference images."
    actionType: "prompt"
    outputType: "video"
    outputLabel: "Generated Video (1080p)"
    outputDescription: "Single continuous 10-second 9:16 shot with locked 84° lens and orbital camera movement."
    tool: "Google Flow"
    toolPurpose: "VIDEO GENERATION"
    inputs:
      - type: "image"
        label: "Step 01 Character Sheet (@KNIGHT_REF)"
        role: "Exact character identity & appearance"
        src: "/images/knight-character-sheet.png"
      - type: "image"
        label: "Step 02 Helmet & Sword Reference (@PROPS_REF)"
        role: "Exact helmet & sword design"
        src: "/images/knight-props.png"
      - type: "image"
        label: "Step 03 Location Reference (@LOCATION_REF)"
        role: "Exact environment"
        src: "/images/misty-poppy-location.png"
    settings:
      - label: "VIDEO MODEL"
        value: "Gemini Omni 1.1 Flash"
      - label: "ASPECT RATIO"
        value: "9:16"
      - label: "DURATION"
        value: "10 seconds"
      - label: "RESOLUTION"
        value: "1080p"
    process: |
      VIDEO GENERATION PROMPT

      @KNIGHT_REF (uploaded character reference image) — controls the exact identity and appearance of the male knight. Use the uploaded character reference as the primary character identity reference in every frame. Preserve his exact face, facial structure, eyes, nose, lips, jawline, hairstyle, skin appearance, body proportions, armor design, clothing, cloak design, colors, textures, and overall character appearance. Strict identity lock: the same man must remain recognizable and visually consistent throughout the entire video. Do not redesign, beautify, age, de-age, or reinterpret his face or character.

      @PROPS_REF (uploaded helmet and sword reference) — controls the exact helmet and sword. Use the uploaded helmet exactly as the helmet design and use the uploaded sword exactly as the sword design. The helmet has realistic steel construction with the black chainmail aventail shown in the reference. The sword is a standard-length medieval arming sword, proportioned naturally to his body. He carries the sword unsheathed in one hand. The scabbard does not appear in this shot. The shield from the character reference is NOT carried and does not appear.

      @LOCATION_REF (poppy-field reference) — controls the location exactly: a vast poppy field at misty pre-sunrise dawn, red poppies mixed with small blue-violet wildflowers among tall green stems, layered ground fog in the middle distance, a dark tree cluster on the horizon, heavy grey-blue overcast sky with only a faint pale glow at the horizon line. No orange or amber color cast on the knight, armor, cloak, flowers, fog, or sky.

      CHARACTER ANCHOR
      Young male knight in his early 20s, using the uploaded character reference for his exact identity.
      He wears the exact medieval knight outfit established by @KNIGHT_REF: weathered silver plate armor over dark chainmail, the deep red medieval tabard, matching weathered red hooded cloak, brown leather belts and straps, articulated plate arm and leg armor, armored gauntlets, and steel sabatons. Preserve the exact armor construction, cloak shape, colors, markings, wear, scratches, dirt, and proportions from the character reference.
      The character is exhausted after a difficult battle but has no fresh visible wounds. His face remains clearly recognizable and consistent with the uploaded reference throughout the entire video.
      His helmet from @PROPS_REF hangs loosely from his lowered LEFT hand. The unsheathed arming sword from @PROPS_REF hangs loosely from his other lowered hand, its point trailing low and occasionally brushing the tops of the flowers.

      VEGETATION AND WALKING PATH — CRITICAL
      The entire poppy field is completely untouched before the knight passes through it.
      There is NO pre-existing path, trail, cleared corridor, flattened strip, gap, walkway, or human-made passage anywhere in front of him.
      He is the FIRST PERSON to walk through this particular section of the field.
      The vegetation directly ahead of him must be dense, tall, upright, naturally growing, and completely undisturbed until his body physically reaches it.
      His boots create the trail in real time.
      Every step physically pushes, bends, separates, and partially crushes the poppy stems and wildflowers directly underneath and around his boots. Vegetation reacts only when contacted by his boots, greaves, or cloak.
      His lower legs and the bottom edge of his cloak brush through the surrounding flowers, bending and displacing stems naturally as he passes.
      The trail behind him exists ONLY because he has just walked through the vegetation. It must be narrow, irregular, naturally disturbed, and composed of freshly bent and partially flattened stems following his actual footsteps.
      NEVER show a straight, clean, pre-existing path.
      NEVER show a cleared strip of flowers ahead of him.
      NEVER show flowers already flattened before his feet reach them.
      NEVER animate the vegetation opening or bending in anticipation of his movement before physical contact.
      At the beginning of the shot, the field ahead of him must visibly look completely untouched.
      As he advances, flowers immediately around his boots bend and part because of his physical contact.
      The camera must clearly communicate that he is walking THROUGH the natural field, not along a pre-existing path.

      FORMAT MODE
      Vertical 9:16.
      EXACTLY 10 seconds generated duration.
      ONE SINGLE CONTINUOUS SHOT.
      No cuts.
      No fades.
      No dissolves.
      No hidden cuts.
      No teleportation.
      No sudden camera jumps.
      The major reframe from the standing face-level shot to the final lying view is hidden inside a camera move through the poppies, with foreground flowers and stems completely wiping across the lens.

      IMPORTANT TEMPORAL INSTRUCTION
      This is a temporally compressed version of a 14-second performance designed specifically for a 10-second generation.
      Perform all actions and camera movements naturally and continuously within the 10-second duration.
      Do NOT make the acting frantic or artificially rushed.
      Maintain realistic weight, inertia, gravity, breathing, armor movement, cloak movement, hair movement, vegetation physics, object physics, and camera motion.
      The generated 10-second video will later be slowed to approximately 71.4% playback speed in editing to restore the intended approximately 14-second pacing.
      Do not add extra actions or alter the choreography simply because the generation is compressed.

      OPTICS
      LENS IS 84° ACROSS THE ENTIRE VIDEO. NOT NEGOTIABLE.
      84° diagonal field of view.
      Classic wide-angle lens character.
      Camera remains physically close to the knight throughout:
      approximately 0.8–1.5m from his boots during the opening,
      approximately 1.5–2m from his torso during the camera rise,
      approximately 1.3–1.6m from him in the final framing.
      Strong but natural perspective expansion.
      Environment visible toward the frame edges.
      Straight lines remain rectilinear.
      No fisheye distortion.
      No curved horizon.
      No ultra-wide warped face.
      LENS LOCK.

      CAMERA PATH
      One continuous orbital camera movement around him in this exact order:
      1. OPENING — STRICTLY SYMMETRICAL ONE-POINT PERSPECTIVE
      The camera begins directly behind him at low boot height.
      His spine, the center seam of the hanging red cloak, and the line of his recent footsteps are aligned exactly with the VERTICAL CENTERLINE of the frame.
      He is perfectly centered.
      Equal amounts of untouched poppy field occupy the left and right sides of the frame.
      The horizon is perfectly level.
      No dutch tilt.
      No lateral offset.
      No diagonal framing.
      The camera is locked to his spine axis like a dolly rail directly behind him.
      It glides forward at his walking pace.
      During the opening, maintain dead-center symmetry.
      2. CAMERA RISE
      After the helmet falls and the camera passes it, the camera begins rising smoothly while drifting toward his LEFT side.
      It transitions into a rear-left three-quarter view at approximately hip-to-chest height.
      3. ORBIT FORWARD
      The camera continues its smooth arc around his left shoulder, moving from behind-left toward the front of him.
      4. FRONT FACE-LEVEL POSITION
      The camera settles directly in front of him at FACE LEVEL.
      It stops in a locked waist-up front three-quarter composition.
      The camera remains at face level until his collapse.
      After he collapses, the camera tilts down, moves forward through the flowers, becomes completely occluded by foreground vegetation, and re-emerges beside his face.
      FINAL CAMERA POSITION
      The camera settles BESIDE his lying body.
      It is positioned laterally beside his LEFT cheek and jawline.
      His left side of the face is toward the camera.
      Distance approximately 1.3–1.6m.
      Camera angle approximately 45–55° downward.
      CRITICAL FINAL CAMERA GEOMETRY:
      The camera is lateral to his face.
      It must NEVER be positioned directly above the crown of his head.
      It must NEVER look down from behind the top of his head.
      It must NEVER look along the length of his body from the head end.
      His face must remain right-side-up.
      His face must read clearly as a natural three-quarter view.
      FINAL FRAMING
      Frame him from the top of his head down to his waist and belt.
      His face, both pauldrons, full chest armor, red tabard, and waist/belt must remain inside the frame.
      The frame cuts just below the belt.
      His legs, knees, greaves, and feet are OUT of frame.
      His head occupies the lower-left area of the frame.
      His torso recedes diagonally toward the upper-right.
      Poppies and green stems surround the edges.
      The camera holds this final framing until the end.
      CAMERA MOVEMENT
      Smooth.
      Heavy.
      Controlled.
      Unhurried.
      No whip pans.
      No speed ramps.
      No sudden acceleration.
      No handheld shake.

      FIRST FRAME AND SPATIAL BLOCKING
      The first visible frame already contains the knight's lower body from BEHIND.
      No empty landscape opening.
      No delayed character reveal.
      He is already walking through the dense poppy field.
      The first frame is a STRICTLY SYMMETRICAL ONE-POINT PERSPECTIVE composition.
      His spine and center seam of the red cloak sit exactly on the vertical centerline.
      His boots step along the same central axis.
      Equal dense, untouched poppy vegetation fills the left and right halves.
      The horizon is level.
      He walks directly AWAY from the camera.
      The camera follows directly behind him at boot height.
      The camera is locked to his spine axis.
      The knight remains centered throughout the opening.
      MOST IMPORTANTLY: the vegetation ahead of him is untouched.
      There is no visible path extending into the distance.
      The only disturbed vegetation is the small, irregular trail created moments earlier by his actual footsteps.

      STORY
      A young knight returns after a hard battle — exhausted, alone, finally safe.
      He has reached a quiet field and simply wants to exhale and rest without anxiety.

      ACTION TIMING — EXACT 10-SECOND GENERATION
      0:00.0–0:01.55
      STRICTLY SYMMETRICAL LOW REAR VIEW.
      The knight walks heavily away from the camera through a completely untouched dense poppy field.
      His boots, greaves, and the back of his red cloak occupy the exact vertical center of the frame.
      The field on both sides remains dense and untouched.
      There is NO pre-existing path.
      Every step physically bends and crushes the vegetation beneath and around his boots.
      Flowers ahead remain standing until his feet reach them.
      The bottom edge of his cloak brushes through flowers and bends stems naturally.
      An irregular trail of freshly disturbed stems forms only behind his recent footsteps.
      His stride is tired and uneven but realistic.
      The helmet swings gently from his lowered LEFT hand.
      The sword hangs loosely from his other hand, its point trailing low through the flowers.
      The camera follows directly behind him at boot height on his spine axis.
      No lateral drift.
      No reframing.

      0:01.55–0:01.95
      His fingers loosen.
      The helmet slips from his lowered left hand while he continues moving.
      It falls in a short natural arc beside his boot into the dense flowers.
      One dull heavy steel impact.
      The stems flatten beneath it.
      Small realistic settling motion.
      No exaggerated bounce.
      The black chainmail aventail follows the helmet's movement with delayed weight and settles naturally.
      He does not stop.
      He does not look down.
      He remains centered.

      0:01.95–0:03.20
      He continues walking forward through the previously untouched flowers.
      The camera moves past the fallen helmet.
      The helmet briefly becomes large in the near foreground and then exits through the bottom-center of the frame.
      Only now does the camera begin rising and drifting toward his LEFT.
      The untouched flowers ahead continue to fill his path.
      Each new step creates fresh disturbance.
      No pre-existing trail becomes visible.
      The knight is leaving the trail behind him as he walks.

      0:03.20–0:04.30
      The camera rises into a rear-left three-quarter view.
      It glides upward along his left side from knees to hips and toward his cuirass.
      The sword remains visible hanging from his lowered hand.
      The sword slips from his hand below the bottom edge of the frame.
      The drop itself is NOT visible.
      Only its heavier off-screen metallic impact is heard, followed by several realistic stems snapping.
      He continues moving for the brief moment after releasing it.

      0:04.30–0:05.70
      The camera completes its smooth arc around his left shoulder.
      It swings from rear-left to the front of him.
      It settles at FACE LEVEL.
      It stops in a locked waist-up front three-quarter shot.
      He slows and comes to a stop among the dense flowers.
      The field behind him is misty, red, green, and blue-violet.
      His face is clearly visible.
      His face is illuminated by bright, soft, open overcast skylight.
      His face must remain brighter and clearer than the surrounding darker vegetation.
      No flowers cast hard shadows across his face.
      He breathes heavily.
      His expression is exhausted and unfocused.
      He gives a visible tired exhale.
      His gaze slowly moves off to the side without focusing on anything.
      His hair and cloak move naturally in the soft breeze.

      0:05.70–0:06.20
      His legs suddenly lose strength from exhaustion.
      He sinks STRAIGHT DOWN.
      He sits onto his SEAT among the flowers.
      NOT onto his knees.
      His body drops out of the lower part of the frame.
      The camera holds its face-level position momentarily and tilts down after him.
      The armor moves with realistic weight.
      Flowers compress beneath his body.

      0:06.20–0:06.80
      The camera glides forward and down through the poppies.
      Foreground flowers and tall stems sweep completely across the lens.
      The knight becomes fully occluded.
      The vegetation fills the entire frame momentarily.
      This is the natural hidden reframe.
      No cut.
      No transition effect.
      No dissolve.

      0:06.80–0:07.50
      The camera emerges from the flowers already in its FINAL POSITION.
      The camera is beside his LEFT cheek and jawline.
      It is lateral to his face, NOT above his head.
      He rolls naturally backward from the seated position onto his back.
      His upturned face settles right-side-up in the lower-left portion of the frame.
      His face reads clearly as a natural three-quarter view.
      His shoulders, both pauldrons, full chest armor, red tabard, and belt recede diagonally toward the upper-right.
      The frame cuts just below his belt.
      NO legs visible.
      His red cloak spreads naturally underneath him.
      Poppy stems compress beneath his weight.
      The armor makes a soft realistic settling sound.

      0:07.50–0:10.00
      The camera is now LOCKED in the final cheek-side composition.
      Frame him from the top of his head to his waist.
      His face remains clearly readable in the lower-left.
      His eyes gradually close.
      His lips remain slightly parted.
      His face remains consistent with the uploaded character reference.
      His hair spreads naturally around his head without becoming wet, greasy, or stuck unnaturally to his face.
      His chest and waist remain fully visible.
      His breathing creates subtle realistic movement through the chest armor.
      His right gauntlet slowly lifts with fatigue and comes to rest on his breastplate.
      He takes one long, relieved exhale.
      The surrounding vegetation remains slightly darker and greener than his illuminated face and red cloak.
      The camera does not move.

      END FRAME:
      The exhausted knight lies peacefully among the previously untouched poppies he has just disturbed, his calm face in the lower-left and his armored torso extending diagonally toward the upper-right, ending at the belt.

      PHYSICS
      The helmet has realistic steel mass.
      It slips from relaxed fingers.
      It falls in a short natural arc.
      It strikes the ground with one dull heavy impact.
      It does not bounce unnaturally.
      It makes a small realistic settling movement.
      The black chainmail aventail lags behind the helmet shell and settles a moment after impact.
      The sword is heavier and longer than the helmet.
      It is a standard-length arming sword matching @PROPS_REF.
      Its drop occurs below frame.
      Its impact is heavier and longer than the helmet impact.
      Several nearby stems snap naturally from the impact.
      The knight's collapse follows realistic weight transfer.
      His legs fold first.
      His hips drop.
      He lands seated on his seat.
      His torso then tips backward under its own weight.
      He rolls onto his back.
      The cloak spreads and settles according to gravity.
      Flowers and stems compress underneath his body and partially spring back where not crushed.
      His raised gauntlet moves slowly and heavily before settling onto his breastplate.
      All armor, cloak, hair, flowers, and objects obey realistic gravity and inertia.

      VEGETATION PHYSICS
      Poppies are tall, dense, flexible plants.
      Every plant reacts only when physically contacted.
      Boots push stems downward and sideways.
      Greaves brush nearby flowers.
      The cloak hem drags through and bends vegetation.
      Plants behind him remain partially flattened and bent after he passes.
      Plants ahead of him remain upright until contact.
      No vegetation moves as though an invisible path is opening.
      No flowers disappear.
      No plants instantly regenerate.
      No artificial corridor forms.
      The field must feel genuinely wild and untouched before his passage.

      LIGHTING
      Flat, soft, diffused pre-sunrise overcast light matching @LOCATION_REF.
      No visible sun disc.
      Only a faint pale glow at the horizon.
      No orange or golden cast anywhere.
      Cool-neutral color temperature approximately 6500–7000K.

      FACE LIGHT PRIORITY:
      His face must always receive soft open skylight and remain clearly readable.
      His face should be approximately one stop brighter than the surrounding field.
      The bright overcast sky acts as a huge softbox.
      Gentle top-front skylight illuminates his face.
      The dark vegetation must NOT cast strong shadows across his face.
      His face must never disappear into murky shadow.
      This is especially important in the final lying shot.
      His upturned face must remain the brightest readable area of the final composition.
      Silver armor shows realistic soft reflections under fog-diffused light.
      Battle wear, dust, and scratches reduce the armor's reflectivity in places.
      The vegetation around him is slightly darker and greener in the final framing, helping the illuminated face and red cloak remain clearly readable.
      Shadows remain extremely soft and nearly absent.

      AUDIO
      Soft wind moving through dense poppy stems.
      Faint distant birdsong during early dawn.
      Soft boots pressing through damp grass and soil.
      Realistic bending and snapping of stems as he walks.
      Helmet impact: one dull heavy steel thud followed by the soft metallic settling of chainmail.
      Sword impact: heavier, longer metallic strike with several stems snapping, occurring off-screen.
      Heavy tired breathing throughout.
      Soft armored thump as he sits down.
      Rustling vegetation as he rolls backward.
      Quiet armor movement as he settles.
      One long relieved exhale at the end.
      No music.
      No dialogue.
      No voiceover.

      After generation, download the generated video in 1080p.
    outputPreviewSrc: ""
    next: "Download the generated video in 1080p, then use it in Step 05."
    handoff: "Download the generated video in 1080p, then use it in Step 05."

  - title: "Finish in Instagram"
    purpose: "Remix the video with matching sound and beat."
    description: "Remix the video with matching sound and beat."
    actionType: "instructions"
    outputType: "video"
    outputLabel: "Final edited video"
    outputDescription: "Final 9:16 video ready to download, share, or post."
    tool: "Instagram"
    toolPurpose: "VIDEO EDITING"
    inputs:
      - type: "video"
        label: "Step 04 — Downloaded 1080p video"
        role: "Video to edit"
        src: "/images/knight-poppies-thumbnail.png"
    settings:
      - label: "SPEED"
        value: "0.6×"
    process: |
      1. Open Instagram.
      2. Tap the + button.
      3. Select Reel.
      4. Add the generated video.
      5. Open video editing controls.
      6. Reduce playback speed to 0.6×.
      7. Use the music available in Instagram for the edit.
      8. Complete the required recording/shooting portion on Instagram.
      9. Review the finished Reel.
      10. Download the finished video, or share/post it directly.
    outputSrc: "https://www.instagram.com/reel/DeD0aGQPgz9/embed"
    outputPreviewSrc: "/images/knight-poppies-thumbnail.png"
    next: ""
    handoff: ""
finalTitle: "Final Edited Video"
finalDescription: "Your finished video, ready to share."
tips:
  - "Use the Step 1 character reference as the identity anchor for the entire workflow."
  - "Use Step 1 only as material and design reference when creating the helmet and sword in Step 2."
  - "Do not use the Step 3 location reference as a character or prop reference."
  - "In Google Flow, use the three reference assets as @KNIGHT_REF, @PROPS_REF, and @LOCATION_REF."
  - "Keep the generated video at exactly 10 seconds, then use 0.6× playback in Instagram as the final edit."
relatedResources: []
tags:
  - "ai-video"
  - "google-flow"
  - "character-reference"
  - "prompt-engineering"
  - "cinematic-video"
  - "workflow"
featured: true
seoTitle: "Create a Cinematic Medieval Knight Video with Google Flow | Skill Foundry"
seoDescription: "Follow a five-step Skill Foundry workflow to create a consistent medieval knight reference, matching props, misty poppy-field location, cinematic 10-second Google Flow video, and final Instagram edit."
---

## Workflow

Create the character, props, location, video, and final edit in sequence. Each step uses the output of the previous step where required.
