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
          text: `인물의 헤어스타일을 "${name}" (${description})로 변환하고, 얼굴형에 맞춰 자연스럽고 실제감 있는 느낌을 유지하세요. 머리색은 변경하지 마세요.`,
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
