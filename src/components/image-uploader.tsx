"use client";

import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { formatFileSize } from "@/lib/imageUtils";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
  isLoading?: boolean;
  maxSize?: number;
  acceptedTypes?: string[];
  value?: File | null;
  disabled?: boolean;
}

export function ImageUploader({
  onImageSelect,
  isLoading = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  value,
  disabled = false,
}: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleImageChange = (file: File) => {
    onImageSelect(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isLoading) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isLoading) return;

    if (e.dataTransfer.files?.[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isLoading) return;

    if (e.target.files?.[0]) {
      handleImageChange(e.target.files[0]);
    }
  };

  const acceptString = acceptedTypes.join(",");

  if (imagePreview && value && value instanceof File) {
    return (
      <div className="space-y-4">
        <img
          src={imagePreview}
          alt="이미지 미리보기"
          className="w-full rounded-lg overflow-hidden aspect-square object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer block relative group overflow-hidden",
          disabled || isLoading
            ? "opacity-50 cursor-not-allowed"
            : dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="gap-y-2 flex flex-col items-center justify-center">
          <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <UploadIcon size={16} />
          </div>
          <div>
            <p className="text-sm font-medium">
              {isLoading
                ? "업로드 중..."
                : "클릭하거나 파일을 드래그해서 업로드"}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WebP (최대 {formatFileSize(maxSize)})
            </p>
          </div>
        </div>

        <input
          type="file"
          accept={acceptString}
          onChange={handleFileInput}
          className="sr-only"
          disabled={disabled || isLoading}
        />
      </label>
    </div>
  );
}
