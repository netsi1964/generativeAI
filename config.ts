// a type containing all the services
export enum KnownServices {
  "LEXICA_ART" = "lexica.art",
  "CLIPDROP_CO" = "clipdrop.co",
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
];

export const prompts = [
  {
    title: "A thai woman",
    prompt:
      "A photorealistic portrait of a smiling 25-year-old thai girl with long, flowing black hair and striking brown eyes with sunglass wearing white t-shirt. She should have a natural, approachable expression and be illuminated by soft, golden-hour sunlight. The background should be a scenic outdoor setting, perhaps a sunlit beach. Capture this image with a high-resolution photograph using an 85mm lens for a flattering perspective.",
    files: [
      {
        service: KnownServices.LEXICA_ART,
        url: "./images/lexica.art/a-thai-woman.jpg",
      },
      {
        service: KnownServices.CLIPDROP_CO,
        url: "./images/clipdrop.co/a-thai-woman.png",
      },
    ],
  },
];
