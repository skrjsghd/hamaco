import { eq } from "drizzle-orm";
import Image from "next/image";
import { db } from "@/lib/db";
import { profile } from "@/schema";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await db.query.profile.findFirst({
    where: eq(profile.id, id),
    with: {
      hairstyles: true,
    },
  });

  if (!result) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="max-w-lg mx-auto px-4 min-h-svh grid grid-cols-2 gap-4">
      {result.hairstyles.map((hairstyle) => (
        <Image
          key={hairstyle.imageUrl}
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${hairstyle.imageUrl}`}
          alt={hairstyle.name}
          sizes="100vw"
          width={500}
          height={300}
          className="w-full"
        />
      ))}
    </div>
  );
}
