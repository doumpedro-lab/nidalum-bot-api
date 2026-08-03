import { logger } from '../../infrastructure/logging/logger';

export class RateLimiterService {
  /**
   * Vérifie si le plugin a atteint son quota.
   * Cette méthode pourra utiliser Firestore ou Redis pour tracker les appels.
   */
  async checkQuota(platform: string): Promise<boolean> {
    logger.info(`Checking quota for platform: ${platform}`);
    // Stub: Toujours autorisé pour l'instant
    return true;
  }

  /**
   * Enregistre un appel API réussi
   */
  async recordApiCall(platform: string): Promise<void> {
    logger.info(`API call recorded for platform: ${platform}`);
  }
}
