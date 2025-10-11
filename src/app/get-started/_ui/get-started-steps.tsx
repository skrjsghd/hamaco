"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { applyHairstyleGeneration } from "@/app/actions";
import { PageHeaderNav } from "@/components/page-header-nav";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { convertToBase64 } from "@/lib/imageUtils";
import type { HairstyleSelectFormPayload } from "@/types/hairstyle";
import { EmailInputField } from "./email-input-field";
import { FormBottomSection } from "./form-bottom-section";
import { FormHeaderSection } from "./form-header-section";
import { STEP_CONTENT } from "./get-started-constants";
import {
  type GetStartedFormData,
  getStartedFormSchema,
} from "./get-started-form-schema";
import { GetStartedFormSubmitDrawer } from "./get-started-form-submit-drawer";
import { HairstyleSelectField } from "./hairstyle-select-field";
import { ImageUploadField } from "./image-upload-field";

interface GetStartedStepsProps {
  hairstyles: HairstyleSelectFormPayload[];
}

export function GetStartedSteps({ hairstyles }: GetStartedStepsProps) {
  const [steps, setSteps] = useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<GetStartedFormData>({
    resolver: zodResolver(getStartedFormSchema),
    defaultValues: {
      email: "",
      hairstyleIds: [],
      image: undefined,
    },
  });

  const handleMoveNextStep = async () => {
    switch (steps) {
      case 0: {
        const isValid = await form.trigger("email");
        if (isValid) {
          setSteps((prev) => prev + 1);
        }
        break;
      }
      case 1: {
        const isValid = await form.trigger("image");
        if (isValid) {
          setSteps((prev) => prev + 1);
        }
        break;
      }
      case 2: {
        const isValid = await form.trigger("hairstyleIds");
        if (isValid) {
          setIsDrawerOpen(true);
        }
        break;
      }
      default:
        break;
    }
  };

  const handleSubmit = (data: GetStartedFormData) =>
    startTransition(async () => {
      const { email, hairstyleIds, image } = data;
      const base64Image = await convertToBase64(image);
      const { message } = await applyHairstyleGeneration({
        email,
        hairstyleIds,
        base64Image,
      });
      toast.error(message);
    });

  const disabledSubmitButton = steps === 2 && !form.formState.isValid;

  return (
    <div className="max-w-lg mx-auto px-6 min-h-svh pb-20 space-y-10 relative">
      <PageHeaderNav href="/" />
      <FormHeaderSection.Root>
        <FormHeaderSection.Title>
          {STEP_CONTENT[steps].title}
        </FormHeaderSection.Title>
        {steps === 1 && (
          <FormHeaderSection.Description>
            {STEP_CONTENT[steps].description}
          </FormHeaderSection.Description>
        )}
      </FormHeaderSection.Root>
      <Form {...form}>
        <form
          id="get-started-form"
          className="space-y-10 w-full"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {steps >= 2 && (
            <HairstyleSelectField form={form} hairstyles={hairstyles} />
          )}
          {steps >= 1 && <ImageUploadField form={form} />}
          {steps >= 0 && <EmailInputField form={form} />}
        </form>
        <FormBottomSection>
          <Button
            type="button"
            className="w-full"
            size={"lg"}
            disabled={disabledSubmitButton}
            onClick={handleMoveNextStep}
          >
            {STEP_CONTENT[steps].buttonText}
          </Button>
        </FormBottomSection>
      </Form>

      {/* 마지막 폼 제출 드로어 */}
      <GetStartedFormSubmitDrawer
        hairstyles={hairstyles}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        data={form.getValues()}
      >
        <Button
          size="lg"
          type="submit"
          form="get-started-form"
          disabled={isPending}
        >
          {isPending ? <Loader className="animate-spin" /> : "분석하기"}
        </Button>
      </GetStartedFormSubmitDrawer>
    </div>
  );
}
