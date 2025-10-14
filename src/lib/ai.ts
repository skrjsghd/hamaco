import { generateText } from "ai";
import type { hairstyle } from "@/schema";

export async function generateHairstyle(
  image: File,
  hairstyleData: typeof hairstyle.$inferSelect,
) {
  const imageBuffer = await image.arrayBuffer();
  const result = await generateText({
    model: "google/gemini-2.5-flash-image-preview",
    providerOptions: {
      google: { responseModalities: ["TEXT", "IMAGE"] },
    },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Transform the hairstyle of a person in the image to "${hairstyleData.name}", following below:
            ${JSON.stringify(hairstyleData)}
            `,
          },
          {
            type: "file",
            mediaType: "image/png",
            data: imageBuffer,
          },
        ],
      },
    ],
  });

  if (result.text) {
    console.log(result.text);
  }

  const images: Uint8Array[] = [];

  const imageFiles = result.files.filter((f) =>
    f.mediaType?.startsWith("image/"),
  );

  if (imageFiles.length > 0) {
    for (const file of imageFiles) {
      images.push(file.uint8Array);
    }
  }

  return images[0];
}
