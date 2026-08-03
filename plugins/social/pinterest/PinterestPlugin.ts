import { ISocialPlugin, PublishParams } from '../../../src/core/interfaces/ISocialPlugin';
import { ConfigService } from '../../../src/core/config/ConfigService';
import { logger } from '../../../src/infrastructure/logging/logger';

export class PinterestPlugin implements ISocialPlugin {
  public readonly category = 'social';
  public readonly name = 'pinterest';
  private boardId!: string;
  private accessToken!: string;

  async initialize(): Promise<void> {
    const config = ConfigService.getInstance();
    this.boardId = await config.getSecret('PINTEREST_BOARD_ID');
    this.accessToken = await config.getSecret('PINTEREST_ACCESS_TOKEN');
  }

  isActive(): boolean {
    return ConfigService.getInstance().getBoolean('ENABLE_PINTEREST', true);
  }

  validate(params: PublishParams): boolean | string {
    if (!params.imageUrl) return 'Image URL is required for Pinterest.';
    return true;
  }

  async publish(params: PublishParams): Promise<string> {
    if (!this.isActive()) throw new Error('Pinterest Plugin is disabled');
    logger.info(`Publishing to Pinterest Board ${this.boardId}...`);

    const fullText = `${params.text}\n\n${params.hashtags.map(h => `#${h}`).join(' ')}`;
    const url = `https://api.pinterest.com/v5/pins`;

    const body = {
      board_id: this.boardId,
      media_source: {
        source_type: 'image_url',
        url: params.imageUrl
      },
      description: fullText
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Pinterest API Error: ${JSON.stringify(data)}`);
    }

    logger.info(`Pinterest pin published: ${data.id}`);
    return data.id;
  }
}
