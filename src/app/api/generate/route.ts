import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { generateHairstyle } from "@/lib/ai";
import { db } from "@/lib/db";
import { hairstyle, hairstyleSuggestion, user } from "@/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  const requestData = await request.json();
  const image = requestData.image as string;
  const email = requestData.email as string;
  const hairstyleId = requestData.hairstyleId as string;

  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // 신규 유저라면 이미지를 스토리지에 저장
    const filename = `/${email}/${crypto.randomUUID()}.png`;
    const portraitImageBuffer = Buffer.from(image, "base64");
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filename, portraitImageBuffer, { contentType: "image/png" });

    if (!data || error) {
      throw new Error("Failed to upload image to Supabase");
    }

    // 신규 유저 정보를 데이터베이스에 저장
    const newUser = await db
      .insert(user)
      .values({
        email,
        portraitImageUrl: data.fullPath,
      })
      .returning();

    // 헤어스타일 데이터를 데이터베이스에서 조회
    const hairstyleData = await db.query.hairstyle.findFirst({
      where: eq(hairstyle.id, hairstyleId),
    });

    if (!hairstyleData) {
      throw new Error("Hairstyle not found");
    }

    // 헤어스타일 생성
    const images = await generateHairstyle(image, hairstyleData);

    // 생성된 이미지를 스토리지에 저장 후 데이터베이스에 저장
    for (const image of images) {
      const filename = `/${email}/${crypto.randomUUID()}.png`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filename, image, { contentType: "image/png" });
      if (!data || error) {
        throw new Error("Failed to upload image to Supabase");
      }
      await db.insert(hairstyleSuggestion).values({
        userId: newUser[0].id,
        imageUrl: data.fullPath,
        hairstyleId,
      });
    }

    return Response.json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to generate hairstyle" },
      { status: 500 },
    );
  }
}
