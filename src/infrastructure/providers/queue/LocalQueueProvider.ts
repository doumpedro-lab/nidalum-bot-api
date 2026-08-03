import { IQueueProvider, QueuePayload } from '../../../core/interfaces/IQueueProvider';
import { container } from 'tsyringe';
import { PublishWorkerUseCase } from '../../../application/useCases/PublishWorkerUseCase';
import { logger } from '../../logging/logger';

export class LocalQueueProvider implements IQueueProvider {
  async enqueue(queueName: string, payload: QueuePayload, executeAt?: Date): Promise<void> {
    const delay = executeAt ? Math.max(0, executeAt.getTime() - Date.now()) : 0;
    
    setTimeout(async () => {
      try {
        logger.info(`[LocalQueue] Démarrage de la tâche (queue: ${queueName})`);
        const publishWorkerUseCase = container.resolve(PublishWorkerUseCase);
        
        await publishWorkerUseCase.execute(payload as any);
        logger.info(`[LocalQueue] Tâche terminée avec succès`);
      } catch (error) {
        logger.error(`[LocalQueue] Erreur lors de l'exécution de la tâche`, error);
      }
    }, delay);
  }
}
