import { eq } from "drizzle-orm";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { user } from "@/schema";
import { Comparison } from "./_ui/comparison";
import { ImageDownloadButton } from "./_ui/image-download-button";

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

  const { hairstyleSuggestions } = result;

  return (
    <div className="max-w-lg mx-auto min-h-svh space-y-8">
      <header className="flex justify-between items-center px-2 py-3 sticky top-0 bg-background">
        <Button asChild variant={"ghost"} size={"icon"}>
          <Link href={"/"}>
            <ChevronLeftIcon className="size-6" />
          </Link>
        </Button>
      </header>

      <div className="px-4">
        <h1 className="text-3xl font-bold whitespace-pre-line">
          {hairstyleSuggestions.length}개의 스타일
          <br />
          마음에 드시나요?
        </h1>
        <p className="text-muted-foreground">
          이미지를 꾹 눌러 원본도 확인해보세요.
        </p>
      </div>

      {hairstyleSuggestions.map(({ hairstyle, imageUrl }) => (
        <div key={imageUrl}>
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="font-semibold text-lg">{hairstyle.name}</h3>
            {imageUrl && (
              <ImageDownloadButton
                imageUrl={imageUrl}
                filename={`${hairstyle.name}`}
              />
            )}
          </div>
          <Comparison
            originalImageUrl={result.portraitImageUrl ?? ""}
            transformedImageUrl={imageUrl ?? ""}
          />
        </div>
      ))}

      <div className="rounded-lg bg-muted p-4 text-center">
        엄청난 혜택!
        <br />
        지금 바로 시작하세요.
      </div>

      <section className="sticky bottom-0 left-0 right-0 px-4 py-6 bg-gradient-to-t from-background to-transparent via-90% via-background">
        <Button size={"lg"} className="w-full">
          모든 헤어스타일 확인하기
        </Button>
      </section>
    </div>
  );
}
