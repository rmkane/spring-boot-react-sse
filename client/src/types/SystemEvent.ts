export interface SystemEvent {
  id: string
  name: string
  description: string
  severity: 'INFO' | 'WARNING' | 'CRITICAL'
  createdAt: string
  updatedAt: string
  active: boolean
  count: number
}
