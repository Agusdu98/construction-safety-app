export type Confidence = '높음' | '보통' | '낮음'
export type Severity = '높음' | '중간' | '낮음'

export interface SafetyIssue {
  title: string
  severity: Severity
  description: string
}

export interface AnalysisResult {
  isConstructionEquipment: boolean
  equipment: string
  confidence: Confidence
  summary: string
  safetyIssues: SafetyIssue[]
}
