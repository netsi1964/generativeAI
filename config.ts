// a type containing all the services
export enum KnownServices {
  "LEXICA_ART" = "lexica.art",
  "CLIPDROP_CO" = "clipdrop.co",
  "DALL_E_3" = "chat.openai.com",
  "APP_LEONARDO_AI" = "app.leonardo.ai",
  "RUNWAYML_COM" = "runwayml.com",
  "PLAYGROUND_COM" = "playground.com",
  "MIDJOURNEY" = "midjourney",
}

export const services = [
  {
    service: KnownServices.CLIPDROP_CO,
    url: "https://clipdrop.co/stable-diffusion",
    comments: "",
  },
  {
    service: KnownServices.LEXICA_ART,
    url: "https://lexica.art/",
    comments: "",
  },
  {
    service: KnownServices.DALL_E_3,
    url: "https://chat.openai.com",
    comments: "",
  },
  {
    service: KnownServices.APP_LEONARDO_AI,
    url: "https://app.leonardo.ai",
    comments: "Allows for many different LLM models",
  },
  {
    service: KnownServices.RUNWAYML_COM,
    url: "https://runwayml.com",
  },
  {
    service: KnownServices.PLAYGROUND_COM,
    url: "https://playground.com",
  },
  {
    service: KnownServices.MIDJOURNEY,
    url: "https://www.midjourney.com",
    comments: "Feburary 2024 use Discord to generate images",
  },
];

export const prompts = [
  {
    title: "A thai woman",
    prompt:
      "A photorealistic portrait of a smiling 25-year-old thai girl with long, flowing black hair and striking brown eyes with sunglass wearing white t-shirt. She should have a natural, approachable expression and be illuminated by soft, golden-hour sunlight. The background should be a scenic outdoor setting, perhaps a sunlit beach. Capture this image with a high-resolution photograph using an 85mm lens for a flattering perspective.",
    files: [
      {
        service: KnownServices.LEXICA_ART,
        url: "../images/lexica.art/a-thai-woman.jpg",
      },
      {
        service: KnownServices.CLIPDROP_CO,
        url: "../images/clipdrop.co/a-thai-woman.png",
      },
      {
        service: KnownServices.DALL_E_3,
        url: "../images/dall_e_3/a-thai-woman.webp",
        comments: "Prefixed with 'a 4 by 3 image:'",
      },
      {
        service: KnownServices.APP_LEONARDO_AI,
        url: "../images/app.leonardo.ai/a-thai-woman_Leonardo_Vision_XL.jpg",
        comments:
          "<a href='https://cdn.leonardo.ai/users/9a453b8e-cb5a-4956-9cd1-7a989021ce3f/generations/2f7df3a5-385c-42c3-838e-0379df1691a6/Default_A_photorealistic_portrait_of_a_smiling_25yearold_thai_3.jpg' target='_blank'>More info</a>",
      },
      {
        service: KnownServices.APP_LEONARDO_AI,
        url: "../images/app.leonardo.ai/a-thai-woman-Character-portrait.jpg",
        comments:
          "<a href='https://cdn.leonardo.ai/users/9a453b8e-cb5a-4956-9cd1-7a989021ce3f/generations/2f7df3a5-385c-42c3-838e-0379df1691a6/Default_A_photorealistic_portrait_of_a_smiling_25yearold_thai_3.jpg' target='_blank'>More info</a>",
      },
      {
        service: KnownServices.RUNWAYML_COM,
        url: "../images/runwayml.com/a-thai-woman.jpg",
      },
      {
        service: KnownServices.PLAYGROUND_COM,
        url: "../images/playground.com/a-thai-woman.png",
      },
      {
        service: KnownServices.MIDJOURNEY,
        url: "../images/midjourney/a-thai-woman.jpg",
      },
    ],
  },
  {
    title: "Surreal Cityscape at Night",
    prompt:
      "Create an image depicting a surreal cityscape at night, where the buildings twist and turn like ribbons against a starry sky. The architecture should blend futuristic elements with Art Nouveau styles, creating a scene that is both alien and familiar. The city is alive with glowing neon lights in a spectrum of colors, reflecting off twisting streets that seem to defy gravity. In the foreground, a river meanders through the city, its surface a mirror to the dazzling lights above. This scene should challenge the boundaries between reality and imagination, showcasing the AI's ability to merge architectural precision with the fluidity of dreamscapes.",
    files: [
      {
        service: KnownServices.LEXICA_ART,
        url: "../images/lexica.art/Surreal Cityscape at Night.webp",
      },
      {
        service: KnownServices.CLIPDROP_CO,
        url: "../images/clipdrop.co/Surreal Cityscape at Night.png",
      },
      {
        service: KnownServices.DALL_E_3,
        url: "../images/dall_e_3/Surreal Cityscape at Night.webp",
      },
      {
        service: KnownServices.APP_LEONARDO_AI,
        url: "../images/app.leonardo.ai/Surreal Cityscape at Night.jpg",
      },
      {
        service: KnownServices.RUNWAYML_COM,
        url: "../images/runwayml.com/Surreal Cityscape at Night.jpg",
      },
      {
        service: KnownServices.PLAYGROUND_COM,
        url: "../images/playground.com/Surreal Cityscape at Night.png",
      },
      {
        service: KnownServices.MIDJOURNEY,
        url: "../images/midjourney/Surreal Cityscape at Night.png",
      },
    ],
  },
  {
    title: "The Awakening of an Ancient Forest",
    prompt:
      "Imagine an ancient forest at the moment of awakening, where every tree and plant is imbued with ethereal light. This image should capture the instant when the forest's ancient magic is rekindled, with spirits of nature visibly emerging from the flora. The trees are colossal, their roots deep and intertwined, while their leaves shimmer with a luminescent glow. A pathway leads into the heart of the forest, illuminated by floating orbs of light, inviting the viewer on a journey into the unknown. This scene should test the AI's ability to blend fantasy elements with a photorealistic natural environment, creating a sense of wonder and enchantment.",
    files: [
      {
        service: KnownServices.LEXICA_ART,
        url: "../images/lexica.art/The Awakening of an Ancient Forest.jpg",
      },
      {
        service: KnownServices.CLIPDROP_CO,
        url: "../images/clipdrop.co/The Awakening of an Ancient Forest.png",
      },
      {
        service: KnownServices.DALL_E_3,
        url: "../images/dall_e_3/The Awakening of an Ancient Forest.webp",
      },
      {
        service: KnownServices.APP_LEONARDO_AI,
        url: "../images/app.leonardo.ai/The Awakening of an Ancient Forest.jpg",
      },
      {
        service: KnownServices.RUNWAYML_COM,
        url: "../images/runwayml.com/The Awakening of an Ancient Forest.jpg",
      },
      {
        service: KnownServices.PLAYGROUND_COM,
        url: "../images/playground.com/The Awakening of an Ancient Forest.png",
      },
      {
        service: KnownServices.MIDJOURNEY,
        url: "../images/midjourney/The Awakening of an Ancient Forest.png",
      },
    ],
  },
  {
    title: "The Melancholy of a Rainy Parisian Street",
    prompt:
      "Generate an image that captures the melancholy and beauty of a rainy street in Paris in the early 20th century. The scene is set during the blue hour, with the cobblestone streets glistening under the soft glow of gas street lamps. Pedestrians with umbrellas stroll past quaint cafes and bookshops, their reflections blurred in the wet pavement. In the distance, the silhouette of the Eiffel Tower looms, partially obscured by the mist. This image should convey a sense of nostalgia and romance, challenging the AI to accurately depict historical details, weather effects, and the nuanced emotions of a bygone era.",
    files: [
      {
        service: KnownServices.LEXICA_ART,
        url: "../images/lexica.art/The Melancholy of a Rainy Parisian Street.jpg",
      },
      {
        service: KnownServices.CLIPDROP_CO,
        url: "../images/clipdrop.co/The Melancholy of a Rainy Parisian Street.png",
      },
      {
        service: KnownServices.DALL_E_3,
        url: "../images/dall_e_3/The Melancholy of a Rainy Parisian Street.webp",
      },
      {
        service: KnownServices.APP_LEONARDO_AI,
        url: "../images/app.leonardo.ai/The Melancholy of a Rainy Parisian Street_alcamy_upscaler.jpg",
      },
      {
        service: KnownServices.APP_LEONARDO_AI,
        url: "../images/app.leonardo.ai/The Melancholy of a Rainy Parisian Street_stable_diffusion_2.1.jpg",
      },
      {
        service: KnownServices.RUNWAYML_COM,
        url: "../images/runwayml.com/The Melancholy of a Rainy Parisian Street.jpg",
      },
      {
        service: KnownServices.PLAYGROUND_COM,
        url: "../images/playground.com/The Melancholy of a Rainy Parisian Street.png",
      },
      {
        service: KnownServices.MIDJOURNEY,
        url: "../images/midjourney/The Melancholy of a Rainy Parisian Street.png",
      },
    ],
  },
  {
    title: "Family Vacation Bliss in Thailand",
    prompt:
      "Generate a photo-realistic, 16:9 cinematic photograph of a family enjoying their vacation in Thailand. The image should capture a heartwarming moment where the mother, positioned in the foreground, is taking a selfie with her family, including the father, a boy, and a girl. They should all be smiling, appearing happy and relaxed, within arm's length of the camera to create a sense of intimacy and joy. In the magnificent background, the quintessential Thai beach should unfold, showcasing powdery white sands, crystal-clear turquoise waters, and lush palm trees swaying gently in the breeze. The composition should be reminiscent of a high-quality, inspiring DSLR photo, filled with vibrant colors and the natural beauty of Thailand, encapsulating the essence of a perfect family vacation.",
    files: [
      {
        service: KnownServices.LEXICA_ART,
        url: "../images/lexica.art/Family Vacation Bliss in Thailand.jpg",
      },
      {
        service: KnownServices.CLIPDROP_CO,
        url: "../images/clipdrop.co/Family Vacation Bliss in Thailand.png",
      },
      {
        service: KnownServices.DALL_E_3,
        url: "../images/dall_e_3/Family Vacation Bliss in Thailand.webp",
      },
      {
        service: KnownServices.APP_LEONARDO_AI,
        url: "../images/app.leonardo.ai/Family Vacation Bliss in Thailand.jpg",
      },
      {
        service: KnownServices.RUNWAYML_COM,
        url: "../images/runwayml.com/Family Vacation Bliss in Thailand.jpg",
      },
      {
        service: KnownServices.PLAYGROUND_COM,
        url: "../images/playground.com/Family Vacation Bliss in Thailand.png",
      },
      {
        service: KnownServices.MIDJOURNEY,
        url: "../images/midjourney/Family Vacation Bliss in Thailand.png",
      },
    ],
  },
  {
    title: "80s-Inspired 'Be Happy' Sticker with Thumbs-Up",
    prompt:
      'Create a vibrant and colorful sticker design that embodies the aesthetic of the 1980s. The sticker should feature bold and bright colors, typical of the era. At the center of the design, include a large, cartoonish thumbs-up symbol, exuding positivity and enthusiasm. Overlay the image with the text: "Don\'t worry, be happy" in a font style that echoes the cheerful and carefree vibe of the 1980s. The text should be playful and lively, possibly with a neon or glowing effect to emphasize its upbeat message. The overall composition should evoke a sense of joy and nostalgia for the 1980s, making it look like an authentic piece of memorabilia from the decade.',
    files: [
      {
        service: KnownServices.LEXICA_ART,
        url: "../images/lexica.art/80s-Inspired Be Happy Sticker with Thumbs-Up.jpg",
      },
      {
        service: KnownServices.CLIPDROP_CO,
        url: "../images/clipdrop.co/80s-Inspired Be Happy Sticker with Thumbs-Up.png",
      },
      {
        service: KnownServices.DALL_E_3,
        url: "../images/dall_e_3/80s-Inspired Be Happy Sticker with Thumbs-Up.webp",
      },
      {
        service: KnownServices.APP_LEONARDO_AI,
        url: "../images/app.leonardo.ai/80s-Inspired Be Happy Sticker with Thumbs-Up.jpg",
      },
      {
        service: KnownServices.RUNWAYML_COM,
        url: "../images/runwayml.com/80s-Inspired Be Happy Sticker with Thumbs-Up.jpg",
      },
      {
        service: KnownServices.PLAYGROUND_COM,
        url: "../images/playground.com/80s-Inspired Be Happy Sticker with Thumbs-Up.png",
      },
      {
        service: KnownServices.MIDJOURNEY,
        url: "../images/midjourney/80s-Inspired Be Happy Sticker with Thumbs-Up.png",
      },
    ],
  },
  {
    title: "A photograph of a vulture",
    prompt: "A photograph of a vulture",
    files: [
      {
        service: KnownServices.LEXICA_ART,
        url: "../images/lexica.art/A photograph of a vulture.jpg",
      },
      {
        service: KnownServices.CLIPDROP_CO,
        url: "../images/clipdrop.co/A photograph of a vulture.png",
      },
      {
        service: KnownServices.DALL_E_3,
        url: "../images/dall_e_3/A photograph of a vulture.webp",
      },
      {
        service: KnownServices.APP_LEONARDO_AI,
        url: "../images/app.leonardo.ai/A photograph of a vulture.jpg",
      },
      {
        service: KnownServices.RUNWAYML_COM,
        url: "../images/runwayml.com/A photograph of a vulture.jpg",
      },
      {
        service: KnownServices.PLAYGROUND_COM,
        url: "../images/playground.com/A photograph of a vulture.png",
      },
      {
        service: KnownServices.MIDJOURNEY,
        url: "../images/midjourney/A photograph of a vulture.png",
      },
    ],
  },
  {
    title:
      "A sketch of a woman standing on a cliff looking at the sea in a fancy art style",
    prompt:
      "A sketch of a woman standing on a cliff looking at the sea in a fancy art style",
    files: [
      {
        service: KnownServices.LEXICA_ART,
        url: "../images/lexica.art/A sketch of a woman standing on a cliff looking at the sea in a fancy art style..jpg",
      },
      {
        service: KnownServices.CLIPDROP_CO,
        url: "../images/clipdrop.co/A sketch of a woman standing on a cliff looking at the sea in a fancy art style..png",
      },
      {
        service: KnownServices.DALL_E_3,
        url: "../images/dall_e_3/A sketch of a woman standing on a cliff looking at the sea in a fancy art style..webp",
      },
      {
        service: KnownServices.APP_LEONARDO_AI,
        url: "../images/app.leonardo.ai/A sketch of a woman standing on a cliff looking at the sea in a fancy art style..jpg",
      },
      {
        service: KnownServices.RUNWAYML_COM,
        url: "../images/runwayml.com/A sketch of a woman standing on a cliff looking at the sea in a fancy art style..jpg",
      },
      {
        service: KnownServices.PLAYGROUND_COM,
        url: "../images/playground.com/A sketch of a woman standing on a cliff looking at the sea in a fancy art style..png",
      },
      {
        service: KnownServices.MIDJOURNEY,
        url: "../images/midjourney/A sketch of a woman standing on a cliff looking at the sea in a fancy art style..png",
      },
    ],
  },
];
