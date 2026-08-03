import { IPlugin } from './IPlugin';

export interface PublishParams {
  text: string;
  imageUrl?: string;
  hashtags: string[];
}

export interface ISocialPlugin extends IPlugin {
  readonly category: 'social';
  
  /**
   * Vérifie si les paramètres requis pour la plateforme sont présents et valides.
   */
  validate(params: PublishParams): boolean | string;

  /**
   * Publie le contenu sur le réseau social et retourne l'ID ou l'URL du post.
   */
  publish(params: PublishParams): Promise<string>;
}
