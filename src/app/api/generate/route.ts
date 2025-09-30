import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  const requestData = await request.json();
  const image = requestData.image as string;
  const email = requestData.email as string;

  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (existingUser) {
      return Response.json(
        { error: "Profile already exists for this email" },
        { status: 409 },
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    // TODO: Split this into cron job
    // const responses = await generateHairstyle(image);

    const filename = `/${email}/${crypto.randomUUID()}.png`;
    const portraitImageBuffer = Buffer.from(image, "base64");
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filename, portraitImageBuffer, { contentType: "image/png" });

    if (!data || error) {
      throw new Error("Failed to upload image to Supabase");
    }
    // Create new user
    await db.insert(user).values({
      portraitImageUrl: data.fullPath,
      email,
    });

    return Response.json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to generate hairstyle" },
      { status: 500 },
    );
  }
}
