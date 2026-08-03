import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';
import { IAIProvider } from '../../../core/interfaces/IAIProvider';

const generateSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  platforms: z.array(z.string()).min(1, 'At least one platform is required')
});

export class GenerateContentController {
  static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = generateSchema.parse(req.body);

      // MVP : on injecte IAIProvider directement pour générer. 
      // Dans une V2, on utiliserait un GenerateContentUseCase qui sauvegarde aussi en BDD.
      const aiProvider = container.resolve<IAIProvider>('IAIProvider');
      const result = await aiProvider.generateVariants(parsed.text, parsed.platforms);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
