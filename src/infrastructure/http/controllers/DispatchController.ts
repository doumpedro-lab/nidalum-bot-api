import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';
import { DispatchUseCase } from '../../../application/useCases/DispatchUseCase';

const dispatchSchema = z.object({
  publicationId: z.string().min(1, 'publicationId is required')
});

export class DispatchController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate
      const parsed = dispatchSchema.parse(req.body);

      // Execute UseCase
      const useCase = container.resolve(DispatchUseCase);
      const result = await useCase.execute({ publicationId: parsed.publicationId });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
