import { HardHat } from 'lucide-react'
import { EquipmentAnalyzer } from '@/components/equipment-analyzer'

export default function Page() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
        <header className="mb-8 text-center">
          <span className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <HardHat className="size-8" />
          </span>
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            현장 장비 안전 점검 AI
          </h1>
          <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            건설 장비 사진을 업로드하면 AI가 장비 종류를 판별하고 안전 수칙 위반
            여부를 확인해 드립니다.
          </p>
        </header>

        <EquipmentAnalyzer />
      </div>
    </main>
  )
}
