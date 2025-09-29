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
    <div className="max-w-lg mx-auto px-4 py-6 min-h-svh space-y-10">
      {result.hairstyles.map((hairstyle) => (
        <div key={hairstyle.imageUrl}>
          <h3 className="text-lg font-bold">{hairstyle.name}</h3>
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${hairstyle.imageUrl}`}
            alt={hairstyle.name}
            width={500}
            height={500}
            className="aspect-square rounded-lg overflow-hidden object-cover object-top"
          />
        </div>
      ))}
    </div>
  );
}
