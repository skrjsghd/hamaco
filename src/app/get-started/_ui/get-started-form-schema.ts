import z from "zod";

export const getStartedFormSchema = z.object({
  hairstyleIds: z.array(z.string()).min(1, "헤어스타일을 선택해주세요"),
  image: z
    .instanceof(File, { message: "이미지를 업로드해주세요" })
    .refine(
      (file) => !file || file.size <= 10 * 1024 * 1024,
      "파일 크기는 10MB 이하여야 합니다",
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ),
      "JPEG, PNG, WebP 형식만 지원됩니다",
    ),
});

export type GetStartedFormData = z.infer<typeof getStartedFormSchema>;
