import { cn } from "@/lib/utils";

function FormHeaderSectionRoot(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

function FormHeaderSectionTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("text-3xl font-bold mb-2 whitespace-pre-line", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

function FormHeaderSectionDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export const FormHeaderSection = {
  Root: FormHeaderSectionRoot,
  Title: FormHeaderSectionTitle,
  Description: FormHeaderSectionDescription,
};
