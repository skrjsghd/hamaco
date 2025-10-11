"use server";

import { createClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hairstyleSuggestion, user } from "@/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function applyHairstyleGeneration(data: {
  email: string;
  hairstyleIds: string[];
  base64Image: string;
}) {
  const { email, hairstyleIds, base64Image } = data;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration");
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (existingUser) {
    return { message: "이미 사용된 이메일입니다." };
  }

  // 신규 유저라면 이미지를 스토리지에 저장
  const filename = `/${email}/${crypto.randomUUID()}.png`;
  const portraitImageBuffer = Buffer.from(base64Image, "base64");
  const { data: portraitImageData } = await supabase.storage
    .from("images")
    .upload(filename, portraitImageBuffer, { contentType: "image/png" });

  // 신규 유저 정보를 데이터베이스에 저장
  const newUser = await db
    .insert(user)
    .values({
      email,
      portraitImageUrl: portraitImageData?.fullPath,
    })
    .returning();
  // 헤어스타일 생성 요청을 저장
  await db.insert(hairstyleSuggestion).values(
    hairstyleIds.map((hairstyleId) => ({
      userId: newUser[0].id,
      hairstyleId,
      imageUrl: "",
    })),
  );

  redirect("/");
}
