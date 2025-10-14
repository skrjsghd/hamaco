import { eq } from "drizzle-orm";
import Image from "next/image";
import { PageHeaderNav } from "@/components/page-header-nav";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getImageUrl } from "@/lib/get-image-url";
import { user } from "@/schema";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await db.query.guest.findFirst({
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
    <div className="max-w-lg mx-auto min-h-svh px-4 space-y-6">
      <PageHeaderNav href="/" />
      <h1 className="text-3xl font-bold whitespace-pre-line">
        {hairstyleSuggestions.length}개의 스타일
        <br />
        마음에 드시나요?
      </h1>

      {hairstyleSuggestions.map(({ hairstyle, imageUrl }) => (
        <div key={imageUrl}>
          <h3 className="font-semibold mb-1 text-lg text-muted-foreground">
            {hairstyle.name}
          </h3>
          <Image
            src={getImageUrl(imageUrl ?? "")}
            alt={hairstyle.name}
            width={500}
            height={500}
            className="aspect-square rounded-lg select-none pointer-events-none object-cover object-top"
          />
        </div>
      ))}

      <section className="sticky bottom-0 left-0 right-0 p-4 pt-6 pb-12 bg-gradient-to-t from-background to-transparent via-90% via-background -mx-4">
        <Button size={"lg"} className="w-full">
          모든 헤어스타일 확인하기
        </Button>
      </section>
    </div>
  );
}
