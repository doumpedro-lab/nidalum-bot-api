import { logger } from '../../infrastructure/logging/logger';

export class CostMonitorService {
  /**
   * Enregistre le coût d'une génération IA
   */
  async recordAICost(provider: string, tokensUsed: number, estimatedCostUsd: number): Promise<void> {
    logger.info(`AI Cost Recorded [${provider}]: ${tokensUsed} tokens, $${estimatedCostUsd}`);
    // Plus tard: sauvegarder dans la collection 'cost_analytics'
  }

  /**
   * Enregistre le coût opérationnel d'une publication (Cloud Tasks + Run)
   */
  async recordCloudCost(publicationId: string, costUsd: number): Promise<void> {
    logger.info(`Cloud Cost Recorded for Pub [${publicationId}]: $${costUsd}`);
  }
}
