'use client'

import { useCallback, useRef, useState } from 'react'
import { ImageUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  previewUrl: string | null
  onSelect: (file: File) => void
  onClear: () => void
  disabled?: boolean
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

export function ImageUploader({
  previewUrl,
  onSelect,
  onClear,
  disabled,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      setError(null)
      const file = files?.[0]
      if (!file) return
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드할 수 있습니다.')
        return
      }
      if (file.size > 12 * 1024 * 1024) {
        setError('파일 크기는 12MB 이하여야 합니다.')
        return
      }
      onSelect(file)
    },
    [onSelect],
  )

  if (previewUrl) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl || '/placeholder.svg'}
          alt="업로드한 장비 사진 미리보기"
          className="max-h-[420px] w-full object-contain"
        />
        {!disabled && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition hover:bg-background"
            aria-label="사진 제거"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isDragging
            ? 'border-primary bg-accent'
            : 'border-border bg-muted/40 hover:border-primary/60 hover:bg-accent/50',
        )}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <ImageUp className="size-7" />
        </span>
        <span className="space-y-1">
          <span className="block text-base font-semibold text-foreground">
            사진을 여기로 끌어다 놓으세요
          </span>
          <span className="block text-sm text-muted-foreground">
            또는 탭하여 갤러리 / 카메라에서 선택
          </span>
        </span>
        <span className="text-xs text-muted-foreground">
          JPG · PNG · WEBP · 최대 12MB
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        capture="environment"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
