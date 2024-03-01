// a type containing all the services
export enum KnownServices {
  "LEXICA_ART" = "lexica.art",
  "CLIPDROP_CO" = "clipdrop.co",
  "DALL_E_3" = "chat.openai.com",
  "APP_LEONARDO_AI" = "app.leonardo.ai",
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
    url: "https://app.leonardo.a",
    comments: "Allows for many different LLM models",
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
        url: "../images/app.leonardo.ai/a-thai-woman.jpg",
        comments:
          "<a href='https://cdn.leonardo.ai/users/9a453b8e-cb5a-4956-9cd1-7a989021ce3f/generations/2f7df3a5-385c-42c3-838e-0379df1691a6/Default_A_photorealistic_portrait_of_a_smiling_25yearold_thai_3.jpg' target='_blank'>More info</a>",
      },
    ],
  },
];
