import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIProvider, TextVariants } from '../../../core/interfaces/IAIProvider';
import { ConfigService } from '../../../core/config/ConfigService';
import { logger } from '../../logging/logger';

export class GeminiProvider implements IAIProvider {
  public readonly name = 'gemini';
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  private async getModel() {
    if (!this.model) {
      const apiKey = await ConfigService.getInstance().getSecret('GEMINI_API_KEY');
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
    return this.model;
  }

  async generateVariants(baseText: string, platforms: string[]): Promise<TextVariants> {
    const isAiEnabled = ConfigService.getInstance().getBoolean('ENABLE_AI', false);
    
    if (!isAiEnabled) {
      logger.info('AI is disabled via config, returning base text for all platforms');
      return platforms.reduce((acc, p) => ({ ...acc, [p]: baseText }), {});
    }

    try {
      const model = await this.getModel();

      const prompt = `Adapte le texte suivant pour ces plateformes sociales : ${platforms.join(', ')}.\n
Règles :\n
- LinkedIn : Professionnel, aéré, hashtags pertinents.\n
- X : Court (280 max), accrocheur.\n
- Threads : Conversationnel.\n
- Pinterest : Orienté visuel, mots-clés forts.\n
- Instagram : Visuel, emojis, hashtags.\n
- Facebook : Engageant, pose une question.\n\n
Retourne UNIQUEMENT un objet JSON (sans bloc de code Markdown) avec la plateforme en clé et le texte en valeur.\n
Texte de base : "${baseText}"`;

      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Extraction basique du JSON pour le MVP
      const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonStr) as TextVariants;
    } catch (error) {
      logger.error('Gemini generation failed, falling back to base text', error);
      return platforms.reduce((acc, p) => ({ ...acc, [p]: baseText }), {});
    }
  }
}
