import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';
import { DispatchController } from '../controllers/DispatchController';
import { PublishWorkerController } from '../controllers/PublishWorkerController';
import { GenerateContentController } from '../controllers/GenerateContentController';

const router = Router();

// Routes MVP requises
router.get('/health', HealthController.check);
router.get('/version', HealthController.version);
router.post('/dispatch', DispatchController.handle);
router.post('/worker/publish', PublishWorkerController.handle);
router.post('/content/generate', GenerateContentController.handle);

export default router;
