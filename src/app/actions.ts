"use server";

import { createClient } from "@supabase/supabase-js";
import { inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { generateHairstyle } from "@/lib/ai";
import { db } from "@/lib/db";
import { guest, hairstyle, hairstyleSuggestion } from "@/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function applyHairstyleGeneration(data: {
  hairstyleIds: string[];
  image: File;
}) {
  const { hairstyleIds, image } = data;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration");
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 신규 유저 정보를 데이터베이스에 저장
  const newGuestUser = await db.insert(guest).values({}).returning();
  const hairstyleData = await db.query.hairstyle.findMany({
    where: inArray(hairstyle.id, hairstyleIds),
  });

  const generationPromises = hairstyleData.map(async (data) => {
    // 헤어스타일 생성
    const simulatedImage = await generateHairstyle(image, data);

    // 생성된 이미지를 스토리지에 저장
    const filename = `/${newGuestUser[0].id}/${crypto.randomUUID()}.png`;
    const { data: savedImage, error } = await supabase.storage
      .from("images")
      .upload(filename, simulatedImage, { contentType: "image/png" });

    if (!savedImage || error) {
      return;
    }

    // 이미지 url을 데이터베이스에 저장
    await db.insert(hairstyleSuggestion).values({
      userId: newGuestUser[0].id,
      hairstyleId: data.id,
      imageUrl: savedImage.fullPath,
    });

    return;
  });

  await Promise.all(generationPromises);

  redirect(`/hairstyles/${newGuestUser[0].id}`);
}
