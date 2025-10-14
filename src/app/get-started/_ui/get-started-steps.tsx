"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { Fragment, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { applyHairstyleGeneration } from "@/app/actions";
import { PageHeaderNav } from "@/components/page-header-nav";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { compressImageToTargetSize, convertToBase64 } from "@/lib/imageUtils";
import type { HairstyleSelectFormPayload } from "@/types/hairstyle";
import { FormBottomSection } from "./form-bottom-section";
import { FormHeaderSection } from "./form-header-section";
import {
  type GetStartedFormData,
  getStartedFormSchema,
} from "./get-started-form-schema";
import { HairstyleSelectField } from "./hairstyle-select-field";
import { ImageUploadField } from "./image-upload-field";

interface GetStartedStepsProps {
  hairstyles: HairstyleSelectFormPayload[];
}

const STEP_CONFIG = [
  {
    key: "HAIRSTYLE_SELECT",
    title: "헤어스타일을\n 최대 3개까지 선택해주세요",
    description: null,
    buttonText: "내 사진 올리기",
  },
  {
    key: "IMAGE_UPLOAD",
    title: "내 얼굴 사진 올리기",
    description: "얼굴이 뚜렷할수록 더 정확한 결과를 받을 수 있어요.",
    buttonText: "분석하기",
  },
] as const;

export function GetStartedSteps({ hairstyles }: GetStartedStepsProps) {
  const [steps, setSteps] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const form = useForm<GetStartedFormData>({
    resolver: zodResolver(getStartedFormSchema),
    defaultValues: {
      hairstyleIds: [],
      image: undefined,
    },
  });

  const handleMoveNextStep = async () => {
    switch (steps) {
      case 0: {
        const isValid = await form.trigger("hairstyleIds");
        if (isValid) {
          setSteps((prev) => prev + 1);
        }
        break;
      }
      default:
        break;
    }
  };

  const handleSubmit = (data: GetStartedFormData) =>
    startTransition(async () => {
      const { hairstyleIds, image } = data;

      // 이미지를 1MB 이하로 압축
      const compressedImage = await compressImageToTargetSize(image, 1);

      // 압축된 이미지를 Base64로 변환
      const base64Image = await convertToBase64(compressedImage);

      await applyHairstyleGeneration({
        hairstyleIds,
        base64Image,
      });
    });

  const renderStepField = (key: (typeof STEP_CONFIG)[number]["key"]) => {
    switch (key) {
      case "HAIRSTYLE_SELECT":
        return <HairstyleSelectField form={form} hairstyles={hairstyles} />;
      case "IMAGE_UPLOAD":
        return <ImageUploadField form={form} />;
    }
  };

  const currentStep = STEP_CONFIG[steps];
  const disabledSubmitButton =
    steps === STEP_CONFIG.length - 1 && !form.formState.isValid;

  return (
    <div className="max-w-lg mx-auto px-6 min-h-svh pb-20 space-y-10 relative">
      <PageHeaderNav href="/" />
      <FormHeaderSection.Root>
        <FormHeaderSection.Title>{currentStep.title}</FormHeaderSection.Title>
        {currentStep.description && (
          <FormHeaderSection.Description>
            {currentStep.description}
          </FormHeaderSection.Description>
        )}
      </FormHeaderSection.Root>
      <Form {...form}>
        <form
          id="get-started-form"
          className="space-y-10 w-full"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* 다음 스텝의 필드가 항상 위로 오도록 뒤집어서 렌더링 */}
          {STEP_CONFIG.map((step, index) => {
            if (index > steps) {
              return null;
            }
            return (
              <Fragment key={step.key}>{renderStepField(step.key)}</Fragment>
            );
          }).reverse()}
          <FormBottomSection>
            <Button
              type={disabledSubmitButton ? "button" : "submit"}
              className="w-full"
              size={"lg"}
              disabled={disabledSubmitButton}
              onClick={handleMoveNextStep}
            >
              {isPending && <Loader className="animate-spin" />}
              {currentStep.buttonText}
            </Button>
          </FormBottomSection>
        </form>
      </Form>
    </div>
  );
}
