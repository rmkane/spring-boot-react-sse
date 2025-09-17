import type { OperationType } from '@/types/Operation';
import type { SystemEvent } from '@/types/SystemEvent';

export interface SseEvent {
  operation: OperationType;
  event: SystemEvent;
}
