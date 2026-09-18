'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, ScanSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageUploader } from '@/components/image-uploader'
import { ResultCard } from '@/components/result-card'
import type { AnalysisResult } from '@/lib/types'

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function EquipmentAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleSelect = useCallback((f: File) => {
    setFile(f)
    setResult(null)
    setError(null)
  }, [])

  const handleClear = useCallback(() => {
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!file) return
    setStatus('loading')
    setError(null)
    setResult(null)
    try {
      const dataUrl = await readAsDataUrl(file)
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl, mediaType: file.type }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || '분석에 실패했습니다.')
      setResult(data as AnalysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석에 실패했습니다.')
    } finally {
      setStatus('idle')
    }
  }, [file])

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <ImageUploader
          previewUrl={previewUrl}
          onSelect={handleSelect}
          onClear={handleClear}
          disabled={status === 'loading'}
        />

        {previewUrl && (
          <Button
            onClick={handleAnalyze}
            disabled={status === 'loading'}
            size="lg"
            className="mt-4 w-full text-base font-semibold"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                분석 중...
              </>
            ) : (
              <>
                <ScanSearch className="size-5" />
                분석하기
              </>
            )}
          </Button>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
        >
          {error}
        </p>
      )}

      {status === 'loading' && <AnalyzingSkeleton />}

      {result && status === 'idle' && <ResultCard result={result} />}
    </div>
  )
}

function AnalyzingSkeleton() {
  return (
    <div
      className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Loader2 className="size-6 animate-spin" />
        </span>
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="h-12 animate-pulse rounded-xl bg-muted" />
      <div className="space-y-2.5">
        <div className="h-16 animate-pulse rounded-xl bg-muted" />
        <div className="h-16 animate-pulse rounded-xl bg-muted" />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        AI가 장비를 식별하고 안전 수칙을 점검하고 있습니다...
      </p>
    </div>
  )
}
