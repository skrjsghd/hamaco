"use client";

import { RotateCcwIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { ImageUploader } from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { GetStartedFormData } from "./get-started-form-schema";

interface ImageUploadFieldProps {
  form: UseFormReturn<GetStartedFormData>;
}

export function ImageUploadField({ form }: ImageUploadFieldProps) {
  const handleResetImage = () => {
    form.resetField("image");
  };

  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field }) => (
        <FormItem className="slide-in-from-top-10 animate-in fade-in">
          <div className="flex items-center justify-between">
            <FormLabel>얼굴 사진</FormLabel>
            {field.value && (
              <Button variant="outline" size="sm" onClick={handleResetImage}>
                <RotateCcwIcon />
                다시 올리기
              </Button>
            )}
          </div>
          <FormControl>
            <ImageUploader onImageSelect={field.onChange} value={field.value} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
