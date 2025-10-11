"use client";

import { CameraIcon, RotateCcwIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export function CameraCapture({
  onCapture,
  onError,
  disabled = false,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      // Set streaming state first to render the video element
      setIsStreaming(true);
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? "카메라 접근 권한이 필요합니다"
          : "카메라를 시작할 수 없습니다";
      setError(errorMessage);
      setIsStreaming(false);
      onError?.(errorMessage);
    }
  }, [onError]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas to square dimensions
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate crop position to center the image
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    // Draw the cropped square image
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    // Get image data URL for preview
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedImage(imageDataUrl);

    // Convert canvas to blob and create File
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], `camera-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        onCapture(file);
        stopCamera();
      },
      "image/jpeg",
      0.95,
    );
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Show captured image preview
  if (capturedImage) {
    return (
      <div className="relative">
        <div className="aspect-square rounded-lg overflow-hidden shadow-lg border">
          <img
            src={capturedImage}
            alt="촬영된 이미지"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-4">
          <Button
            onClick={retakePhoto}
            disabled={disabled}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <RotateCcwIcon />
            재촬영
          </Button>
        </div>
      </div>
    );
  }

  if (!isStreaming && !error) {
    return (
      <div className="relative">
        <div className="aspect-square rounded-lg border shadow-sm bg-muted flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CameraIcon className="size-8 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">카메라로 촬영하기</p>
              <p className="text-xs text-muted-foreground">
                얼굴이 선명하게 보이도록 촬영해주세요
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={startCamera}
            disabled={disabled}
            className="w-full"
            size="lg"
          >
            <CameraIcon />
            카메라 시작
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <div className="aspect-square rounded-lg border border-destructive/50 shadow-sm bg-destructive/5 flex items-center justify-center">
          <div className="text-center space-y-4 px-6">
            <div className="flex justify-center">
              <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XIcon className="size-8 text-destructive" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2 text-destructive">
                카메라 오류
              </p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={startCamera}
            disabled={disabled}
            variant="outline"
            className="w-full"
            size="lg"
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Capture button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={capturePhoto}
          disabled={disabled}
          size="lg"
          className="rounded-full px-8"
        >
          <CameraIcon />
          사진 촬영
        </Button>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
