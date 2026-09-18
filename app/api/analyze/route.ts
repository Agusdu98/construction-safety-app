import { generateText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const analysisSchema = z.object({
  isConstructionEquipment: z
    .boolean()
    .describe('사진에 건설 현장 장비가 식별되면 true, 장비가 아니면 false'),
  equipment: z
    .string()
    .describe('식별된 장비의 한국어 이름. 장비가 아니면 사진에 보이는 대상 설명'),
  confidence: z
    .enum(['높음', '보통', '낮음'])
    .describe('장비 식별에 대한 확신도'),
  summary: z.string().describe('현장 작업자를 위한 한 줄 요약 (한국어, 60자 이내)'),
  safetyIssues: z
    .array(
      z.object({
        title: z.string().describe('안전 이슈 제목 (짧게)'),
        severity: z
          .enum(['높음', '중간', '낮음'])
          .describe('위험 심각도'),
        description: z.string().describe('무엇이 문제이고 어떻게 조치해야 하는지'),
      }),
    )
    .describe('발견된 안전 수칙 위반 사항 목록. 없으면 빈 배열'),
})

export type AnalysisResult = z.infer<typeof analysisSchema>

export async function POST(req: Request) {
  try {
    const { image, mediaType } = (await req.json()) as {
      image?: string
      mediaType?: string
    }

    if (!image) {
      return Response.json({ error: '이미지가 필요합니다.' }, { status: 400 })
    }

    const { output } = await generateText({
      model: 'google/gemini-3.8-flash',
      output: Output.object({ schema: analysisSchema }),
      system: [
        '당신은 산업안전 전문가이자 건설 장비 감식 전문가입니다.',
        '업로드된 사진을 분석하여 건설 현장 장비의 종류를 식별하고,',
        '한국 산업안전보건 기준에 따른 안전 수칙 위반 사항을 찾아냅니다.',
        '개인보호구(안전모/안전화/안전대) 미착용, 위험 반경 내 작업자, 전도/협착/추락 위험,',
        '장비 결함, 부적절한 적재, 신호수 부재 등을 중점적으로 점검하세요.',
        '사진에서 실제로 확인 가능한 사실만 근거로 판단하고, 추측은 최소화하세요.',
        '모든 응답 텍스트는 한국어로 작성합니다.',
      ].join(' '),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '이 사진의 건설 장비를 식별하고 안전 수칙 위반 사항을 점검해 주세요.',
            },
            {
              type: 'file',
              data: image,
              mediaType: mediaType || 'image/jpeg',
            },
          ],
        },
      ],
    })

    return Response.json(output)
  } catch (err) {
    console.log('[v0] analyze error:', err instanceof Error ? err.message : err)
    return Response.json(
      { error: '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 },
    )
  }
}
