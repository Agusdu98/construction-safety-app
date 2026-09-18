'use client'

import {
  AlertTriangle,
  CheckCircle2,
  HardHat,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import type { AnalysisResult, Confidence, Severity } from '@/lib/types'
import { cn } from '@/lib/utils'

const confidenceStyles: Record<Confidence, string> = {
  높음: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  보통: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  낮음: 'bg-muted text-muted-foreground',
}

const severityStyles: Record<
  Severity,
  { badge: string; dot: string; label: string }
> = {
  높음: {
    badge: 'bg-destructive/12 text-destructive',
    dot: 'bg-destructive',
    label: '위험',
  },
  중간: {
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: '주의',
  },
  낮음: {
    badge: 'bg-sky-500/15 text-sky-700 dark:text-sky-400',
    dot: 'bg-sky-500',
    label: '참고',
  },
}

export function ResultCard({ result }: { result: AnalysisResult }) {
  const hasIssues = result.safetyIssues.length > 0

  return (
    <section
      aria-label="분석 결과"
      className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <HardHat className="size-6" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {result.isConstructionEquipment ? '식별된 장비' : '식별 결과'}
            </p>
            <h2 className="text-xl font-bold leading-tight text-foreground">
              {result.equipment}
            </h2>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold',
            confidenceStyles[result.confidence],
          )}
        >
          확신도 {result.confidence}
        </span>
      </header>

      <p className="rounded-xl bg-muted/60 px-4 py-3 text-sm leading-relaxed text-foreground">
        {result.summary}
      </p>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {hasIssues ? (
            <ShieldAlert className="size-4 text-destructive" />
          ) : (
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
          )}
          <h3 className="text-sm font-semibold text-foreground">
            안전 점검 {hasIssues && `(${result.safetyIssues.length}건)`}
          </h3>
        </div>

        {hasIssues ? (
          <ul className="space-y-2.5">
            {result.safetyIssues.map((issue, i) => {
              const s = severityStyles[issue.severity]
              return (
                <li
                  key={i}
                  className="rounded-xl border border-border bg-background p-3.5"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={cn('mt-0.5 size-4 shrink-0', {
                        'text-destructive': issue.severity === '높음',
                        'text-amber-500': issue.severity === '중간',
                        'text-sky-500': issue.severity === '낮음',
                      })}
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {issue.title}
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                            s.badge,
                          )}
                        >
                          <span className={cn('size-1.5 rounded-full', s.dot)} />
                          {s.label}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
            <CheckCircle2 className="size-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                이상 없음
              </p>
              <p className="text-sm text-muted-foreground">
                사진에서 뚜렷한 안전 수칙 위반 사항이 발견되지 않았습니다.
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        본 분석은 AI가 사진만으로 판단한 참고 자료이며, 실제 현장의 안전 점검을
        대체하지 않습니다.
      </p>
    </section>
  )
}
