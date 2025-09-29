import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
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
    // Check if profile already exists
    const existingProfile = await db.query.profile.findFirst({
      where: eq(profile.email, email),
    });

    if (existingProfile) {
      return Response.json(
        { error: "Profile already exists for this email" },
        { status: 409 },
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate hairstyles only for new profiles
    const responses = await generateHairstyle(image);

    // Create new profile
    await db.insert(profile).values({
      email,
    });

    // Upload images and create hairstyle records
    for (const response of responses) {
      const filename = `${crypto.randomUUID()}.png`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filename, response.image, { contentType: "image/png" });
      if (!data || error) {
        throw new Error("Failed to upload image to Supabase");
      }

      await db.insert(hairstyle).values({
        imageUrl: data.fullPath,
        name: response.hairstyleName,
        profileEmail: email,
      });
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
