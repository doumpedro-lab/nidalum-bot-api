import { inject, injectable } from 'tsyringe';
import { IDatabaseProvider } from '../../core/interfaces/IDatabaseProvider';
import { logger } from '../../infrastructure/logging/logger';
import { Publication } from '../../core/entities/Publication';
import { FacebookPlugin } from '../../../plugins/social/facebook/FacebookPlugin';
import { InstagramPlugin } from '../../../plugins/social/instagram/InstagramPlugin';
import { ThreadsPlugin } from '../../../plugins/social/threads/ThreadsPlugin';
import { PinterestPlugin } from '../../../plugins/social/pinterest/PinterestPlugin';
import { YoutubePlugin } from '../../../plugins/social/youtube/YoutubePlugin';
import { ISocialPlugin } from '../../core/interfaces/ISocialPlugin';

interface WorkerInput {
  publicationId: string;
  platform: string;
}

@injectable()
export class PublishWorkerUseCase {
  private plugins: Map<string, ISocialPlugin> = new Map();

  constructor(
    @inject('IDatabaseProvider') private db: IDatabaseProvider
  ) {
    this.registerPlugins();
  }

  private registerPlugins() {
    this.plugins.set('facebook', new FacebookPlugin());
    this.plugins.set('instagram', new InstagramPlugin());
    this.plugins.set('threads', new ThreadsPlugin());
    this.plugins.set('pinterest', new PinterestPlugin());
    this.plugins.set('youtube', new YoutubePlugin());
  }

  async execute(input: WorkerInput): Promise<any> {
    logger.info(`[PublishWorkerUseCase] Publishing ${input.publicationId} on ${input.platform}`);

    // 1. Lire la publication
    const publication = await this.db.findById<Publication>('publications', input.publicationId);
    if (!publication) throw new Error(`Publication ${input.publicationId} not found`);

    const plugin = this.plugins.get(input.platform);
    if (!plugin) throw new Error(`Plugin not found for platform: ${input.platform}`);

    await plugin.initialize();

    if (!plugin.isActive()) {
      throw new Error(`Plugin for ${input.platform} is disabled`);
    }

    const text = publication.variants ? publication.variants[input.platform] || publication.body : publication.body;
    
    const publishParams = {
      text,
      imageUrl: publication.imageUrl,
      hashtags: publication.hashtags
    };

    const validation = plugin.validate(publishParams);
    if (validation !== true) {
      throw new Error(`Validation failed for ${input.platform}: ${validation}`);
    }

    // 2. Publier
    let postId: string;
    try {
      postId = await plugin.publish(publishParams);
    } catch (error: any) {
      logger.error(`[PublishWorkerUseCase] Failed to publish on ${input.platform}`, error);
      // Optionnel : Mettre à jour l'audit log
      throw error;
    }

    // 3. Enregistrer le résultat
    const updateData: any = {};
    updateData[`publishedIds.${input.platform}`] = postId;
    // Si toutes les plateformes sont publiées, on mettrait le status à 'published' (simplifié ici pour le MVP)
    
    await this.db.update('publications', input.publicationId, updateData);

    return {
      success: true,
      platform: input.platform,
      postId
    };
  }
}
