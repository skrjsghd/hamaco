import { createClient } from "@supabase/supabase-js";
import { generateHairstyle } from "@/lib/ai";
import { db } from "@/lib/db";
import { hairstyle, profile } from "@/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  const requestData = await request.json();
  const image = requestData.image as string;
  const email = requestData.email as string;

  try {
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const responses = await generateHairstyle(image);

    await db.transaction(async (tx) => {
      await tx.insert(profile).values({
        email,
      });
      for (const response of responses) {
        const filename = `${crypto.randomUUID()}.png`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(filename, response.image, { contentType: "image/png" });
        if (!data || error) {
          throw new Error("Failed to upload image to Supabase");
        }

        await tx.insert(hairstyle).values({
          imageUrl: data.fullPath,
          name: response.hairstyleName,
          profileEmail: email,
        });
      }
    });

    return Response.json({ message: "Image generated successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to generate hairstyle" },
      { status: 500 },
    );
  }
}
