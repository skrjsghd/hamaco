import { GoogleGenAI } from "@google/genai";

export async function generateHairstyle(base64Image: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const hairstyles = [
    "Bob Cut",
    "Pixie Cut",
    "Layered Haircut",
    "Lob (Long Bob)",
    "Blunt Cut",
    "Shag Cut",
    "Curtain Bangs",
    "Side-Swept Bangs",
    "Beach Waves",
    "Straight Long Hair",
  ]

  const randomHairstyle = hairstyles[Math.floor(Math.random() * hairstyles.length)];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    config: {
      responseModalities: ["IMAGE", "TEXT"],
    },
    contents: [
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
      {
        text: `Transform the hairstyle of the person in the image into a ${randomHairstyle} hairstyle, with textured layers, voluminous crown, and wispy ends, keeping a natural and realistic look.`,
      },
    ],
  });

  const imageRawData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!imageRawData) {
    throw new Error("Failed to generate image");
  }

  return {
    hairstyleName: randomHairstyle,
    image: Buffer.from(imageRawData, "base64"),
  }

}
