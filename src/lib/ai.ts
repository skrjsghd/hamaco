import { GoogleGenAI } from "@google/genai";
import { womenHairstyles } from "./women-hairstyles";

export async function generateHairstyle(base64Image: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const batch = womenHairstyles.map(async ({ name, description }) => {
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
          text: `Transform the hairstyle of the person in the image into a ${name} (${description}), keeping a natural and realistic look. Do not adjust the color of hair`,
        },
      ],
    });

    const imageRawData =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!imageRawData) {
      return null;
    }

    return {
      hairstyleName: name,
      image: Buffer.from(imageRawData, "base64"),
    };
  });

  const responses = await Promise.all(batch);

  return responses.filter((v) => v !== null);
}
