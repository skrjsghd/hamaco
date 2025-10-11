import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface PageHeaderNavProps {
  href: string;
}
export function PageHeaderNav({ href = "/" }: PageHeaderNavProps) {
  return (
    <header className="flex justify-between items-center pt-4 -mx-2">
      <Button asChild variant={"ghost"} size={"icon"}>
        <Link href={href}>
          <ChevronLeftIcon className="size-6" />
        </Link>
      </Button>
    </header>
  );
}
