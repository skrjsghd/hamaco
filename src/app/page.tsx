import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="max-w-lg mx-auto px-6 min-h-svh space-y-10">
      {/* Hero */}
      <section className="py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">
          미용실 가기 전에
          <br />
          인생 헤어스타일 찾기
        </h1>
        <p className="text-muted-foreground mb-10">
          AI가 맞춤형 헤어스타일을 추천해드립니다.
        </p>

        <Button asChild>
          <Link href="/get-started">헤어스타일 분석하기</Link>
        </Button>
      </section>

      <section>
        <div className="text-center">
          <h2 className="text-2xl font-bold">우리 이거 해줘요</h2>
        </div>

        <div>헤어스타일 컨설팅</div>
        <div>메이크업 컨설팅</div>
        <div>코디 컨설팅</div>
      </section>

      {/* FAQ Section */}
      <section className="pb-24">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">자주 묻는 질문</h2>
          <p className="text-muted-foreground mt-2">
            궁금하신 점을 확인해보세요
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              AI는 어떻게 헤어스타일을 추천하나요?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              업로드하신 사진을 통해 얼굴형을 분석하고, AI가 얼굴형에 가장 잘
              어울리는 헤어스타일을 추천해드립니다. 수천 개의 헤어스타일
              데이터를 학습한 AI 모델이 개인별 맞춤 추천을 제공합니다.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>업로드한 사진은 안전한가요?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              네, 안전합니다. 업로드하신 사진은 헤어스타일 분석에만 사용되며,
              분석 완료 후 자동으로 삭제됩니다. 개인정보 보호를 최우선으로 하고
              있습니다.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>어떤 사진을 업로드해야 하나요?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              얼굴이 정면으로 잘 보이는 사진을 추천합니다. 조명이 밝고, 얼굴형이
              명확하게 드러나는 사진일수록 더 정확한 분석 결과를 받으실 수
              있습니다.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              추천받은 헤어스타일을 저장할 수 있나요?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              추천 결과 페이지에서 마음에 드는 헤어스타일을 스크린샷으로
              저장하거나, 미용실에 방문하실 때 결과 페이지를 보여주시면 됩니다.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>서비스 이용료가 있나요?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              현재는 베타 서비스 기간으로 무료로 이용하실 수 있습니다. 이메일을
              등록하시면 정식 서비스 출시 소식과 특별 혜택을 받아보실 수
              있습니다.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
