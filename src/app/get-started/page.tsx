import { db } from "@/lib/db";
import { GetStartedSteps } from "./_ui/get-started-steps";

export default async function GetStartedPage() {
  // DB에서 모든 hairstyles 조회
  const hairstyles = await db.query.hairstyle.findMany({
    orderBy: (hairstyle, { asc }) => [asc(hairstyle.name)],
  });

  return <GetStartedSteps hairstyles={hairstyles} />;
}
