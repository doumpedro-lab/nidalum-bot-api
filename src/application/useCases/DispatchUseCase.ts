import { inject, injectable } from 'tsyringe';
import { IDatabaseProvider } from '../../core/interfaces/IDatabaseProvider';
import { IQueueProvider } from '../../core/interfaces/IQueueProvider';
import { logger } from '../../infrastructure/logging/logger';
import { Publication } from '../../core/entities/Publication';

interface DispatchInput {
  publicationId: string;
}

@injectable()
export class DispatchUseCase {
  constructor(
    @inject('IDatabaseProvider') private db: IDatabaseProvider,
    @inject('IQueueProvider') private queue: IQueueProvider
  ) {}

  async execute(input: DispatchInput): Promise<any> {
    logger.info(`[DispatchUseCase] Dispatching publication ${input.publicationId}`);
    
    // 1. Lire la publication depuis Firestore
    const publication = await this.db.findById<Publication>('publications', input.publicationId);
    if (!publication) {
      throw new Error(`Publication ${input.publicationId} not found`);
    }

    if (publication.status !== 'scheduled' && publication.status !== 'draft') {
      throw new Error(`Publication ${input.publicationId} has invalid status: ${publication.status}`);
    }

    // 2. Mettre dans la queue pour chaque plateforme
    const enqueuedPlatforms = [];
    for (const platform of publication.platforms) {
      const payload = {
        eventName: 'publication.publish',
        data: {
          publicationId: publication.id,
          platform
        }
      };

      await this.queue.enqueue('social-publisher-queue', payload);
      enqueuedPlatforms.push(platform);
      logger.info(`[DispatchUseCase] Enqueued for platform: ${platform}`);
    }

    // 3. Mettre à jour le statut dans Firestore
    await this.db.update('publications', input.publicationId, { status: 'enqueued' });

    return {
      success: true,
      publicationId: input.publicationId,
      enqueuedPlatforms
    };
  }
}
