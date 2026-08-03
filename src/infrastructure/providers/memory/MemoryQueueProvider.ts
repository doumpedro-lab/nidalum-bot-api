import { IQueueProvider, QueuePayload } from '../../../core/interfaces/IQueueProvider';
import { logger } from '../../logging/logger';

export class MemoryQueueProvider implements IQueueProvider {
  private queues: Map<string, QueuePayload[]> = new Map();

  async enqueue(queueName: string, payload: QueuePayload, executeAt?: Date): Promise<void> {
    logger.info(`[MemoryQueue] Enqueueing to ${queueName}`, { executeAt });
    
    const queue = this.queues.get(queueName) || [];
    queue.push(payload);
    this.queues.set(queueName, queue);

    // Si on voulait vraiment simuler un worker local, on mettrait un setTimeout ici.
  }
}
