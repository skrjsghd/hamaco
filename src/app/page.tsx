import { HairstyleAnalysisForm } from "@/components/hairstyle-analysis-form";

export default function Home() {
  return (
    <div className="max-w-lg mx-auto px-4 min-h-svh flex flex-col justify-center items-center">
      {/* 헤더 섹션 */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">
          사진 한 장으로 찾는
          <br />
          인생 헤어스타일
        </h1>
        <p className="text-muted-foreground">
          얼굴 사진을 업로드하면 AI가 분석하여 맞춤형 헤어스타일을
          추천해드립니다.
        </p>
      </div>

      {/* 폼 섹션 */}
      <HairstyleAnalysisForm />
    </div>
  );
}
