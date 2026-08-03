import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { HealthCheckUseCase } from '../../../application/useCases/HealthCheckUseCase';

export class HealthController {
  static async check(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = container.resolve(HealthCheckUseCase);
      const result = await useCase.execute();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static version(req: Request, res: Response): void {
    res.status(200).json({ success: true, data: { version: '1.0.0-MVP' } });
  }
}
