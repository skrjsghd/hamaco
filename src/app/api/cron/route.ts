import { createClient } from "@supabase/supabase-js";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { generateHairstyle } from "@/lib/ai";
import { db } from "@/lib/db";
import { getImageUrl } from "@/lib/get-image-url";
import { hairstyleSuggestion } from "@/schema";

export async function GET(req: Request) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  // supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // PENDING 상태의 헤어스타일 생성 요청 5개 과거순 조회
  // NOTE: 가장 오래된 요청부터 처리해야 함
  // TODO: Vercel time limit 때문에 임의로 5개 조회, 추후 이미지 처리 속도를 고려해서 개수 조정 필요
  const pendingHairstyleSuggestions =
    await db.query.hairstyleSuggestion.findMany({
      where: eq(hairstyleSuggestion.status, "PENDING"),
      orderBy: asc(hairstyleSuggestion.createdAt),
      with: {
        user: true,
        hairstyle: true,
      },
      limit: 5,
    });

  for (const suggestion of pendingHairstyleSuggestions) {
    const { id, user, hairstyle } = suggestion;

    // 유저의 이미지가 없으면 스킵
    if (!user.portraitImageUrl) {
      continue;
    }
    // 유저의 이미지를 url로부터 가져오기
    const fullPath = getImageUrl(user.portraitImageUrl);
    const portraitImage = await fetch(fullPath).then((res) =>
      res.arrayBuffer(),
    );
    const portraitImageBase64 = Buffer.from(portraitImage).toString("base64");

    // ai 호출
    await db
      .update(hairstyleSuggestion)
      .set({
        status: "GENERATING",
      })
      .where(eq(hairstyleSuggestion.id, id));

    const images = await generateHairstyle(portraitImageBase64, hairstyle);
    // 생성된 이미지를 스토리지에 저장 후 데이터베이스에 저장
    for (const image of images) {
      const filename = `/${user.email}/${crypto.randomUUID()}.png`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filename, image, { contentType: "image/png" });
      if (!data || error) {
        continue;
      }
      await db
        .update(hairstyleSuggestion)
        .set({
          imageUrl: data.fullPath,
          status: "COMPLETED",
        })
        .where(eq(hairstyleSuggestion.id, id));
    }
  }

  return NextResponse.json("done");
}
