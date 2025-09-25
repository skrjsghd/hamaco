"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ImageUploader } from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { convertToBase64 } from "@/lib/imageUtils";

const formSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요"),
  image: z
    .instanceof(File, { message: "이미지를 업로드해주세요" })
    .nullable()
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

type FormData = z.infer<typeof formSchema>;

export function HairstyleAnalysisForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      image: null,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleImageSelect = (file: File | null) => {
    if (file) {
      form.setValue("image", file);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      if (!data.image) {
        console.error("이미지가 선택되지 않았습니다.");
        return;
      }

      const base64Image = await convertToBase64(data.image);
      await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          image: base64Image,
          email: data.email,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 w-full"
      >
        {/* 이메일 필드 */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일 주소</FormLabel>
              <FormDescription>
                분석 결과를 받을 이메일 주소를 입력해주세요.
              </FormDescription>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 이미지 업로드 필드 */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>얼굴 사진</FormLabel>
              <FormDescription>
                얼굴이 선명하게 보이는 정면 사진을 업로드해주세요.
              </FormDescription>
              <FormControl>
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  isLoading={isLoading}
                  value={field.value}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          size={"lg"}
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "헤어스타일 분석 시작"
          )}
        </Button>
      </form>
    </Form>
  );
}
