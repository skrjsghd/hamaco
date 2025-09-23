import { GoogleGenAI } from "@google/genai";
import { writeFile } from "fs";
import mime from "mime";

function saveBinaryFile(fileName: string, content: Buffer) {
  writeFile(fileName, content, "utf8", (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved to file system.`);
  });
}

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
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data || "";
      const buffer = Buffer.from(imageData, "base64");
      const fileName = `hairstyle_${Math.round(Math.random() * 10000)}_${randomHairstyle}`;
      const fileExtension = mime.getExtension(part.inlineData.mimeType || "");
      saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
    }
  }
}
