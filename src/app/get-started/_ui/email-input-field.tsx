import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { GetStartedFormData } from "./get-started-form-schema";

interface EmailInputFieldProps {
  form: UseFormReturn<GetStartedFormData>;
}

export function EmailInputField({ form }: EmailInputFieldProps) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem className="slide-in-from-top-10 animate-in fade-in">
          <FormLabel>이메일 주소</FormLabel>
          <FormControl>
            <Input type="email" placeholder="your@email.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
