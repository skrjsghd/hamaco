/**
 * 이미지 처리 및 유효성 검사 유틸리티 함수들
 */

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 업로드된 이미지 파일의 유효성을 검사합니다.
 */
export function validateImage(file: File): ImageValidationResult {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  // 파일 크기 검사
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "파일 크기는 10MB 이하여야 합니다.",
    };
  }

  // 파일 타입 검사
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      isValid: false,
      error: "JPEG, PNG, WebP 형식만 지원됩니다.",
    };
  }

  return { isValid: true };
}

/**
 * 이미지 파일을 Base64 문자열로 변환합니다.
 */
export async function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // data:image/...;base64, 부분을 제거하고 순수 base64만 반환
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => {
      reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * 이미지 파일의 크기를 확인합니다.
 */
export async function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 로드할 수 없습니다."));
    };

    img.src = url;
  });
}

/**
 * 이미지를 리사이즈하고 압축합니다.
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.8,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    if (!ctx) {
      reject(new Error("Canvas context를 생성할 수 없습니다."));
      return;
    }

    img.onload = () => {
      // 원본 크기 유지하면서 최대 크기 제한
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height);

      // Blob으로 변환
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error("이미지 압축에 실패했습니다."));
          }
        },
        file.type,
        quality,
      );
    };

    img.onerror = () => {
      reject(new Error("이미지를 로드할 수 없습니다."));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * 파일 크기를 읽기 쉬운 형태로 변환합니다.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / k ** i).toFixed(2)) + " " + sizes[i];
}

