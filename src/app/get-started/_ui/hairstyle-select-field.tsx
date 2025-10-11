import { CheckIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { HairstyleSelectFormPayload } from "@/types/hairstyle";
import type { GetStartedFormData } from "./get-started-form-schema";

interface HairstyleSelectFieldProps {
  form: UseFormReturn<GetStartedFormData>;
  hairstyles: HairstyleSelectFormPayload[];
}
const MAX_HAIRSTYLE_COUNT = 3;

export function HairstyleSelectField({
  form,
  hairstyles,
}: HairstyleSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name="hairstyleIds"
      render={({ field }) => (
        <FormItem className="slide-in-from-top-10 animate-in fade-in">
          <FormLabel>헤어스타일</FormLabel>
          <FormControl>
            <div className="grid grid-cols-2 gap-2">
              {hairstyles.map((hairstyle) => {
                const isChecked = field.value.includes(hairstyle.id);
                const handleCheckedChange = (checked: boolean) => {
                  if (checked) {
                    if (field.value.length >= MAX_HAIRSTYLE_COUNT) {
                      field.value.pop();
                      return field.onChange([...field.value, hairstyle.id]);
                    }
                    return field.onChange([...field.value, hairstyle.id]);
                  }
                  return field.onChange(
                    field.value.filter((value) => value !== hairstyle.id),
                  );
                };

                return (
                  <HairstyleSelectItem
                    key={hairstyle.id}
                    hairstyle={hairstyle}
                    isChecked={isChecked}
                    handleCheckedChange={handleCheckedChange}
                  />
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function HairstyleSelectItem({
  hairstyle,
  isChecked,
  handleCheckedChange,
}: {
  hairstyle: HairstyleSelectFormPayload;
  isChecked: boolean;
  handleCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={hairstyle.id}
      key={hairstyle.id}
      className={cn(
        "w-full border rounded-lg p-3 hover:bg-accent cursor-pointer text-left relative flex items-center",
        isChecked && "border-primary bg-primary/5",
      )}
    >
      <h3 className="font-medium">{hairstyle.name}</h3>
      {isChecked && (
        <CheckIcon className="size-4 text-foreground absolute top-1/2 right-3 -translate-y-1/2" />
      )}
      <Checkbox
        className="sr-only"
        id={hairstyle.id}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
      />
    </label>
  );
}
