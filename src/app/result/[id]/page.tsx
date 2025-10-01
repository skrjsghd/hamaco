import { eq } from "drizzle-orm";
import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Comparison,
  ComparisonHandle,
  ComparisonItem,
} from "@/components/ui/shadcn-io/comparison";
import { db } from "@/lib/db";
import { getImageUrl } from "@/lib/get-image-url";
import { user } from "@/schema";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await db.query.user.findFirst({
    where: eq(user.id, id),
    with: {
      hairstyleSuggestions: {
        with: {
          hairstyle: true,
        },
      },
    },
  });

  if (!result) {
    return <div>Profile not found</div>;
  }

  const { hairstyleSuggestions, portraitImageUrl } = result;

  return (
    <div className="max-w-lg mx-auto min-h-svh space-y-10 pb-6">
      <header className="flex justify-between items-center py-2">
        <Button asChild variant={"ghost"}>
          <Link href="/">
            <ChevronLeftIcon />
            홈으로
          </Link>
        </Button>
      </header>
      <div className="px-4">
        {hairstyleSuggestions.map(({ hairstyle, imageUrl }) => (
          <div key={imageUrl}>
            <h3 className="text-lg font-bold">{hairstyle.name}</h3>
            <Comparison className="aspect-square rounded-lg border shadow-sm">
              <ComparisonItem position="left">
                <Image
                  src={getImageUrl(portraitImageUrl ?? "")}
                  alt="portrait"
                  width={500}
                  height={500}
                  className="object-cover object-top"
                />
              </ComparisonItem>
              <ComparisonItem position="right">
                <Image
                  src={getImageUrl(imageUrl)}
                  alt={hairstyle.name}
                  width={500}
                  height={500}
                  className="object-cover object-top"
                />
              </ComparisonItem>
              <ComparisonHandle />
            </Comparison>
          </div>
        ))}
      </div>
    </div>
  );
}
