import { ISocialPlugin, PublishParams } from '../../../src/core/interfaces/ISocialPlugin';
import { ConfigService } from '../../../src/core/config/ConfigService';
import { logger } from '../../../src/infrastructure/logging/logger';

export class ThreadsPlugin implements ISocialPlugin {
  public readonly category = 'social';
  public readonly name = 'threads';
  private threadsAccountId!: string;
  private accessToken!: string;

  async initialize(): Promise<void> {
    const config = ConfigService.getInstance();
    this.threadsAccountId = await config.getSecret('THREADS_ACCOUNT_ID');
    this.accessToken = await config.getSecret('THREADS_ACCESS_TOKEN');
  }

  isActive(): boolean {
    return ConfigService.getInstance().getBoolean('ENABLE_THREADS', true);
  }

  validate(params: PublishParams): boolean | string {
    if (!params.text) return 'Text is required for Threads.';
    return true;
  }

  async publish(params: PublishParams): Promise<string> {
    if (!this.isActive()) throw new Error('Threads Plugin is disabled');
    logger.info(`Creating Threads Media Container...`);

    const fullText = `${params.text}\n\n${params.hashtags.map(h => `#${h}`).join(' ')}`;
    
    // 1. Create Media Container
    const createUrl = `https://graph.threads.net/v1.0/${this.threadsAccountId}/threads`;
    const payload: any = {
      media_type: params.imageUrl ? 'IMAGE' : 'TEXT',
      text: fullText,
      access_token: this.accessToken
    };
    if (params.imageUrl) payload.image_url = params.imageUrl;

    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const createData = await createRes.json();
    if (!createRes.ok) throw new Error(`Threads Create Error: ${JSON.stringify(createData)}`);

    const creationId = createData.id;

    // 2. Publish
    logger.info(`Publishing Threads Media: ${creationId}`);
    const publishUrl = `https://graph.threads.net/v1.0/${this.threadsAccountId}/threads_publish`;
    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: this.accessToken
      })
    });
    
    const publishData = await publishRes.json();
    if (!publishRes.ok) throw new Error(`Threads Publish Error: ${JSON.stringify(publishData)}`);

    logger.info(`Threads post published: ${publishData.id}`);
    return publishData.id;
  }
}
