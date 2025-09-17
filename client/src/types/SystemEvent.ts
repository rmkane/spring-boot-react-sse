import type { SeverityType } from '@/types/Severity'

export interface SystemEvent {
  id: string
  name: string
  description: string
  severity: SeverityType
  createdAt: string
  updatedAt: string
  active: boolean
  count: number
}
