"use client";

import { HairstyleAnalysisForm } from "@/components/hairstyle-analysis-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
            HairUlt
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            AI가 분석하는 맞춤형 헤어스타일 추천 서비스
          </p>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            얼굴 사진을 업로드하면 AI가 얼굴형을 분석하여 가장 어울리는 헤어스타일을 추천해드립니다.
          </p>
        </div>

        {/* 폼 섹션 */}
        <div className="flex justify-center">
          <HairstyleAnalysisForm />
        </div>

      </div>
    </div>
  );
}
