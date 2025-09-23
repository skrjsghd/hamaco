"use client";

import { ImageUp } from "lucide-react";
import { useState } from "react";
import { formatFileSize } from "@/lib/imageUtils";

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

    // 이미지 미리보기 생성
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
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

  return (
    <div className="space-y-4">
      <label
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer block ${disabled || isLoading
          ? "opacity-50 cursor-not-allowed"
          : dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {imagePreview && value && value instanceof File ? (
          <div className="space-y-4">
            <div
              className="mx-auto max-h-48 rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${imagePreview})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                aspectRatio: "1",
                maxWidth: "192px",
              }}
              role="img"
              aria-label="업로드된 이미지 미리보기"
            />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>파일명:</strong> {value.name}
              </p>
              <p>
                <strong>크기:</strong> {formatFileSize(value.size)}
              </p>
              <p className="text-xs">
                다른 이미지를 업로드하려면 클릭하거나 드래그해주세요.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageUp className="mx-auto size-10 text-muted-foreground" />
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
        )}
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
