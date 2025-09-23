import { createClient } from "@supabase/supabase-js";
import { generateHairstyle } from "@/lib/ai";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  const requestData = await request.json();
  const image = requestData.image as string;
  const email = requestData.email as string;

  try {
    const supabase = createClient(
      supabaseUrl!,
      supabaseKey!,
    );
    const parts = await generateHairstyle(image);
    const hairstyle = parts[0].inlineData?.data;

    const buffer = Buffer.from(hairstyle || "", "base64");

    if (buffer) {
      const { data, error } = await supabase.storage
        .from("images").upload(`${Date.now()}.png`, buffer, {
          contentType: "image/png",
        })
    }

    return Response.json({ message: "Image generated successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to generate hairstyle" },
      { status: 500 },
    );
  }
}
