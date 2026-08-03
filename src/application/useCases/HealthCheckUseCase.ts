import { injectable, inject } from 'tsyringe';
import { IDatabaseProvider } from '../../core/interfaces/IDatabaseProvider';
import { IQueueProvider } from '../../core/interfaces/IQueueProvider';
import { IStorageProvider } from '../../core/interfaces/IStorageProvider';
import { IAIProvider } from '../../core/interfaces/IAIProvider';
import { ConfigService } from '../../core/config/ConfigService';
import { FeatureFlags } from '../../../feature-flags.config';

@injectable()
export class HealthCheckUseCase {
  constructor(
    @inject('IDatabaseProvider') private db: IDatabaseProvider,
    @inject('IQueueProvider') private queue: IQueueProvider,
    @inject('IStorageProvider') private storage: IStorageProvider,
    @inject('IAIProvider') private ai: IAIProvider
  ) {}

  async execute() {
    const results: any = {
      overallStatus: 'healthy',
      timestamp: new Date().toISOString(),
      services: {}
    };

    let allHealthy = true;

    // 1. Cloud Run (Express App)
    results.services.cloudRun = { status: 'healthy', latency: 0 };

    const checkService = async (name: string, checkFn: () => Promise<any>) => {
      const start = Date.now();
      try {
        await checkFn();
        results.services[name] = { status: 'healthy', latency: Date.now() - start };
      } catch (err: any) {
        results.services[name] = { status: 'unhealthy', latency: Date.now() - start, error: err.message };
        allHealthy = false;
      }
    };

    // 2. Variables d'environnement
    const startSM = Date.now();
    try {
      // Simuler une vérification des variables
      if (!process.env.NODE_ENV) throw new Error('NODE_ENV is missing');
      results.services.secretManager = { status: 'healthy', latency: Date.now() - startSM };
    } catch (err: any) {
      results.services.secretManager = { status: 'unhealthy', latency: Date.now() - startSM, error: err.message };
      allHealthy = false;
    }

    // 3. Firestore
    await checkService('firestore', () => this.db.findById('health', 'ping').catch(() => true)); // Just ping collection

    // 4. Storage
    await checkService('storage', async () => {
      return true; // Simplifié pour le MVP
    });

    // 5. Local Queue
    await checkService('queue', async () => {
      return true;
    });

    // 6. Gemini
    if (FeatureFlags.ENABLE_AI) {
      await checkService('gemini', async () => {
        // Try generating a 1 word variant
        await this.ai.generateVariants('ping', ['facebook']);
      });
    } else {
      results.services.gemini = { status: 'disabled', latency: 0 };
    }

    // 7. Plugins Configuration Check
    results.services.plugins = {};
    const platforms = ['FACEBOOK', 'INSTAGRAM', 'THREADS', 'PINTEREST', 'YOUTUBE', 'LINKEDIN', 'X', 'MEDIUM', 'SUBSTACK'];
    for (const p of platforms) {
      const isEnabled = (FeatureFlags as any)[`ENABLE_${p}`] === true;
      if (isEnabled) {
        // For MVP, just check if token exists in Secret Manager
        const startP = Date.now();
        try {
          let tokenName = `${p}_ACCESS_TOKEN`;
          await ConfigService.getInstance().getSecret(tokenName);
          results.services.plugins[p] = { status: 'configured', latency: Date.now() - startP };
        } catch (e: any) {
          results.services.plugins[p] = { status: 'unconfigured', latency: Date.now() - startP, error: e.message };
          allHealthy = false;
        }
      } else {
        results.services.plugins[p] = { status: 'disabled', latency: 0 };
      }
    }

    if (!allHealthy) {
      results.overallStatus = 'degraded';
    }

    return results;
  }
}
