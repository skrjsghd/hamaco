import { generateHairstyle } from "@/lib/ai";

export async function POST(request: Request) {
  const requestData = await request.json();
  const image = requestData.image as string;
  const email = requestData.email as string;

  try {
    await generateHairstyle(image);
    return Response.json({ message: "Image generated successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to generate hairstyle" }, { status: 500 });
  }

}