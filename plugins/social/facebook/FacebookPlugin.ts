import { ISocialPlugin, PublishParams } from '../../../src/core/interfaces/ISocialPlugin';
import { ConfigService } from '../../../src/core/config/ConfigService';
import { logger } from '../../../src/infrastructure/logging/logger';

export class FacebookPlugin implements ISocialPlugin {
  public readonly category = 'social';
  public readonly name = 'facebook';
  private pageId!: string;
  private accessToken!: string;

  async initialize(): Promise<void> {
    const config = ConfigService.getInstance();
    this.pageId = await config.getSecret('FACEBOOK_PAGE_ID');
    this.accessToken = await config.getSecret('FACEBOOK_ACCESS_TOKEN');
    if (!this.pageId || !this.accessToken) {
      logger.warn('FacebookPlugin initialized without credentials.');
    }
  }

  isActive(): boolean {
    return ConfigService.getInstance().getBoolean('ENABLE_FACEBOOK', true);
  }

  validate(params: PublishParams): boolean | string {
    if (!params.text) return 'Text is required for Facebook.';
    return true;
  }

  async publish(params: PublishParams): Promise<string> {
    if (!this.isActive()) throw new Error('Facebook Plugin is disabled');
    logger.info(`Publishing to Facebook Page ${this.pageId}...`);

    const fullText = `${params.text}\n\n${params.hashtags.map(h => `#${h}`).join(' ')}`;
    let url = `https://graph.facebook.com/v19.0/${this.pageId}/feed`;
    let body: any = {
      message: fullText,
      access_token: this.accessToken
    };

    if (params.imageUrl) {
      url = `https://graph.facebook.com/v19.0/${this.pageId}/photos`;
      body.url = params.imageUrl;
      body.caption = fullText;
      delete body.message;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Facebook API Error: ${JSON.stringify(data)}`);
    }

    logger.info(`Facebook post published: ${data.id}`);
    return data.id; // Returns Post ID or Photo ID
  }
}
