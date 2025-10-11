import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { HairstyleSelectFormPayload } from "@/types/hairstyle";
import type { GetStartedFormData } from "./get-started-form-schema";

interface GetStartedFormSubmitDrawerProps {
  hairstyles: HairstyleSelectFormPayload[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Pick<GetStartedFormData, "email" | "hairstyleIds">;
  children: React.ReactNode;
}
export function GetStartedFormSubmitDrawer({
  hairstyles,
  open,
  onOpenChange,
  data,
  children,
}: GetStartedFormSubmitDrawerProps) {
  const { email, hairstyleIds } = data;

  if (!open) return null;

  const selectedHairstyleNames = hairstyles
    .filter((hairstyle) => hairstyleIds.includes(hairstyle.id))
    .map(({ name }) => name);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-lg mx-auto">
        <DrawerHeader>
          <DrawerTitle>선택한 정보가 맞나요?</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-2 justify-between">
            <p className="text-muted-foreground">이메일</p>
            <p className="font-medium">{email}</p>
          </div>
          <div className="flex items-start gap-2 justify-between">
            <p className="text-muted-foreground">헤어스타일</p>
            <p className="font-medium">{selectedHairstyleNames.join(" · ")}</p>
          </div>
        </div>
        <DrawerFooter>{children}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
