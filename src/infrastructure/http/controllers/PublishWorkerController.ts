import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';
import { PublishWorkerUseCase } from '../../../application/useCases/PublishWorkerUseCase';

const workerSchema = z.object({
  publicationId: z.string().min(1, 'publicationId is required'),
  platform: z.enum(['facebook', 'instagram', 'threads', 'pinterest'])
});

export class PublishWorkerController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate payload coming from Cloud Tasks
      const parsed = workerSchema.parse(req.body);

      // Execute UseCase
      const useCase = container.resolve(PublishWorkerUseCase);
      const result = await useCase.execute({ 
        publicationId: parsed.publicationId,
        platform: parsed.platform
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
