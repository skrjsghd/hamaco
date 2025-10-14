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
 * 이미지를 목표 파일 크기까지 압축하고 리사이징합니다.
 * 반복적으로 품질을 낮추고 크기를 조정하여 목표 크기를 달성합니다.
 *
 * @param file 원본 이미지 파일
 * @param targetSizeInMB 목표 파일 크기 (MB 단위, 기본값: 1MB)
 * @param maxWidth 최대 너비 (기본값: 2048px)
 * @param maxHeight 최대 높이 (기본값: 2048px)
 * @returns 압축된 이미지 파일
 */
export async function compressImageToTargetSize(
  file: File,
  targetSizeInMB: number = 1,
  maxWidth: number = 2048,
  maxHeight: number = 2048,
): Promise<File> {
  const targetSizeInBytes = targetSizeInMB * 1024 * 1024;

  // 이미 목표 크기보다 작으면 원본 반환
  if (file.size <= targetSizeInBytes) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(url);

      try {
        let compressedFile = file;
        let currentWidth = maxWidth;
        let currentHeight = maxHeight;
        let quality = 0.9;
        const minQuality = 0.3;
        const minSize = 512; // 최소 크기 제한

        // 최대 10번 시도
        for (let attempt = 0; attempt < 10; attempt++) {
          compressedFile = await compressImageWithSettings(
            img,
            file,
            currentWidth,
            currentHeight,
            quality,
          );

          // 목표 크기 달성
          if (compressedFile.size <= targetSizeInBytes) {
            resolve(compressedFile);
            return;
          }

          // 다음 시도를 위한 설정 조정
          if (quality > minQuality) {
            // 품질 먼저 낮춤
            quality -= 0.1;
          } else if (currentWidth > minSize || currentHeight > minSize) {
            // 품질이 최소치에 도달하면 크기 축소
            currentWidth = Math.max(minSize, Math.floor(currentWidth * 0.8));
            currentHeight = Math.max(minSize, Math.floor(currentHeight * 0.8));
            quality = 0.9; // 품질 리셋
          } else {
            // 더 이상 압축할 수 없음
            break;
          }
        }

        // 목표 크기를 달성하지 못했지만 최선의 결과 반환
        resolve(compressedFile);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 로드할 수 없습니다."));
    };

    img.src = url;
  });
}

/**
 * 주어진 설정으로 이미지를 압축하는 내부 함수
 */
async function compressImageWithSettings(
  img: HTMLImageElement,
  originalFile: File,
  maxWidth: number,
  maxHeight: number,
  quality: number,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context를 생성할 수 없습니다."));
      return;
    }

    // 비율 유지하면서 크기 조정
    let { width, height } = img;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.floor(width * ratio);
      height = Math.floor(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    // 이미지 그리기
    ctx.drawImage(img, 0, 0, width, height);

    // 이미지 타입 결정 (WebP 지원 시 WebP 사용)
    const outputType =
      originalFile.type === "image/png" ? "image/png" : "image/jpeg";

    // Blob으로 변환
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const compressedFile = new File([blob], originalFile.name, {
            type: outputType,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          reject(new Error("이미지 압축에 실패했습니다."));
        }
      },
      outputType,
      quality,
    );
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
