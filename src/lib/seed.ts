import { generateObject } from "ai";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { hairstyle } from "@/schema";
import { db } from "./db";

const HAIR_LENGTH = [
  "AboveEar",
  "EarToJaw",
  "BelowJaw",
  "Shoulder",
  "Collarbone",
  "Bust",
  "MidBack",
  "Waist",
] as const;

const CUT_TYPE = ["Bob", "Pixie", "Layered"] as const;

const PERM_TYPE = ["C_Curl", "S_Curl", "Hippie"] as const;

const STRAIGHT_TYPE = ["NaturalStraight", "VolumeMagic"] as const;

const UPDO_TYPE = ["Ponytail", "Bun", "HalfUp", "AllBack"] as const;

const CURL_PATTERN = ["Loose", "Medium", "Tight"] as const;

const BANG_TYPE = ["SeeThrough", "Full", "Choppy"] as const;

const VOLUME_TYPE = ["Flat", "Root", "Sides", "Overall"] as const;

const LAYERING_TYPE = ["Light", "Medium", "Heavy"] as const;

const FINISH_TEXTURE = ["Glossy", "Natural", "Matte"] as const;

const hairstyleSchema = z.object({
  name: z.string().max(256),
  description: z
    .string()
    .optional()
    .describe(
      "A brief description of the hairstyle in two lines or under 200 characters.",
    ),
  hairLength: z.enum(HAIR_LENGTH),
  cutType: z.enum(CUT_TYPE).optional(),
  permType: z.enum(PERM_TYPE).optional(),
  straightType: z.enum(STRAIGHT_TYPE).optional(),
  updoType: z.enum(UPDO_TYPE).optional(),
  curlPattern: z.enum(CURL_PATTERN).optional(),
  bangsType: z.enum(BANG_TYPE).optional(),
  volumeType: z.enum(VOLUME_TYPE).optional(),
  layeringType: z.enum(LAYERING_TYPE).optional(),
  finishTexture: z.enum(FINISH_TEXTURE).optional(),
});

const womenHairstyles = [
  "세미허쉬컷",
  "세미허쉬펌",
  "레이어드컷",
  "레이어드펌",
  "샌드컷",
  "샌드펌",
  "슬릭컷",
  "슬릭펌",
  "베베펌",
  "베베컷",
  "로피펌",
  "단발펌",
  "태슬컷",
  "태슬펌",
  "빌드펌",
  "히피펌",
  "허그펌",
  "그레이스펌",
  "엘리자벳펌",
];

async function main() {
  console.log(`총 ${womenHairstyles.length}개의 헤어스타일 분석 시작...`);

  for (const style of womenHairstyles) {
    const existingHairstyle = await db.query.hairstyle.findFirst({
      where: eq(hairstyle.name, style),
    });

    if (existingHairstyle) {
      console.log(`✓ ${style} 이미 존재합니다.`);
      continue;
    }

    const result = await generateObject({
      model: "openai/gpt-5",
      prompt: `Analyze the hairstyle in detail and give me the structured data: ${style}`,
      schema: hairstyleSchema,
    });

    await db.insert(hairstyle).values(result.object);
    console.log(
      `✓ ${style} 분석 완료 (토큰: ${result.usage?.totalTokens || "N/A"})`,
    );
  }

  console.log(
    `✓ ${womenHairstyles.length}개의 헤어스타일이 DB에 저장되었습니다.`,
  );

  process.exit(0);
}

main().catch(console.error);
