"use client";

import { DownloadIcon } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getImageUrl } from "@/lib/get-image-url";

interface ImageDownloadButtonProps {
  imageUrl: string;
  filename?: string;
}

export function ImageDownloadButton({
  imageUrl,
  filename = "hairstyle-image",
}: ImageDownloadButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDownload = () => {
    startTransition(async () => {
      try {
        const fullImageUrl = getImageUrl(imageUrl);

        // 이미지를 fetch하여 blob으로 변환
        const response = await fetch(fullImageUrl);
        if (!response.ok) {
          throw new Error("이미지 다운로드에 실패했습니다.");
        }

        const blob = await response.blob();

        // 다운로드 링크 생성
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${filename}.png`;

        // 다운로드 실행
        document.body.appendChild(link);
        link.click();

        // 정리
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("다운로드 중 오류가 발생했습니다:", error);
        alert("이미지 다운로드에 실패했습니다. 다시 시도해주세요.");
      }
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      disabled={isPending}
      className="rounded-full"
    >
      {isPending ? <Spinner /> : <DownloadIcon />}
      {isPending ? "다운로드 중..." : "다운로드"}
    </Button>
  );
}
