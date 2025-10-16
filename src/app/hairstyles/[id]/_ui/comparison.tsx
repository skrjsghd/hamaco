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
      className="relative"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <Image
        src={getImageUrl(transformedImageUrl)}
        alt="transformed"
        width={500}
        height={500}
        className={cn(
          "aspect-square select-none pointer-events-none object-cover object-top w-full",
        )}
      />
      <Image
        src={getImageUrl(originalImageUrl)}
        alt="original"
        width={500}
        height={500}
        className={cn(
          "aspect-square select-none pointer-events-none object-cover object-top absolute top-0 left-0 transition-all w-full duration-300",
          showOriginal ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
