"use server";

import { createClient } from "@supabase/supabase-js";
import { eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { generateHairstyle } from "@/lib/ai";
import { db } from "@/lib/db";
import { hairstyle, hairstyleSuggestion, user } from "@/schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function applyHairstyleGeneration(data: {
  email: string;
  hairstyleIds: string[];
  image: File;
}) {
  const { email, hairstyleIds, image } = data;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration");
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (existingUser) {
    return { success: false, message: "이미 사용된 이메일입니다." };
  }

  // 신규 유저 정보를 데이터베이스에 저장
  const { data: uploadedPortraitImage } = await supabase.storage
    .from("images")
    .upload(`${email}/${crypto.randomUUID()}.png`, image, {
      contentType: "image/png",
    });

  if (!uploadedPortraitImage) {
    return { success: false, message: "이미지 업로드에 실패했습니다." };
  }

  const hairstyleData = await db.query.hairstyle.findMany({
    where: inArray(hairstyle.id, hairstyleIds),
  });

  // 트랜잭션 내에서 유저 생성과 헤어스타일 생성을 동시에 수행
  const transactionResult = await db.transaction(async (tx) => {
    const newUser = await tx
      .insert(user)
      .values({
        email,
        portraitImageUrl: uploadedPortraitImage.fullPath,
      })
      .returning();

    const generationPromises = hairstyleData.map(async (data) => {
      // 헤어스타일 생성
      const simulatedImage = await generateHairstyle(image, data);

      // 생성된 이미지를 스토리지에 저장
      const filename = `/${newUser[0].id}/${crypto.randomUUID()}.png`;
      const { data: savedImage, error } = await supabase.storage
        .from("images")
        .upload(filename, simulatedImage, { contentType: "image/png" });

      if (!savedImage || error) {
        return { success: false, message: "이미지 업로드에 실패했습니다." };
      }

      // 이미지 url을 데이터베이스에 저장
      await tx.insert(hairstyleSuggestion).values({
        userId: newUser[0].id,
        hairstyleId: data.id,
        imageUrl: savedImage.fullPath,
      });
    });

    await Promise.all(generationPromises);
    const userId = newUser[0].id;
    return userId;
  });

  redirect(`/hairstyles/${transactionResult}`);
}
