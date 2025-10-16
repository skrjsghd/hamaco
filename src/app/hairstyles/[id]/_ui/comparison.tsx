"use client";

import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/lib/get-image-url";
import { cn } from "@/lib/utils";

interface ComparisonProps {
  originalImageUrl: string;
  transformedImageUrl: string;
}

export function Comparison({
  originalImageUrl,
  transformedImageUrl,
}: ComparisonProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const handlePointerDown = () => {
    setShowOriginal(true);
  };

  const handlePointerUp = () => {
    setShowOriginal(false);
  };

  const handlePointerLeave = () => {
    setShowOriginal(false);
  };

  return (
    <div
      className={cn(
        "relative transition-transform",
        showOriginal && "scale-95",
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <Image
        src={getImageUrl(transformedImageUrl)}
        alt="transformed"
        width={500}
        height={500}
        className="aspect-square rounded-lg select-none pointer-events-none object-cover object-top"
      />
      <Image
        src={getImageUrl(originalImageUrl)}
        alt="original"
        width={500}
        height={500}
        className={cn(
          "aspect-square rounded-lg select-none pointer-events-none object-cover object-top absolute top-0 left-0 transition-all",
          showOriginal ? "opacity-100 blur-none" : "opacity-0 blur-xs",
        )}
      />
    </div>
  );
}
