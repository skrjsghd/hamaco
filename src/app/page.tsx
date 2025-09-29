import { HairstyleAnalysisForm } from "@/components/hairstyle-analysis-form";

export default function Home() {
  return (
    <div className="max-w-lg mx-auto px-4 min-h-svh flex flex-col justify-center items-center">
      {/* 헤더 섹션 */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          미용실 가기 전에
          <br />
          인생 헤어스타일 찾기
        </h1>
        <p className="text-muted-foreground">
          AI가 맞춤형 헤어스타일을 추천해드립니다.
        </p>
      </div>

      {/* 폼 섹션 */}
      <HairstyleAnalysisForm />
    </div>
  );
}
