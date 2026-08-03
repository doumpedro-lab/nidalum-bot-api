export interface IPlugin {
  /**
   * Nom de la catégorie (ex: 'social', 'blog', 'music')
   */
  readonly category: string;

  /**
   * Nom unique du plugin (ex: 'linkedin', 'spotify')
   */
  readonly name: string;

  /**
   * Méthode d'initialisation du plugin
   */
  initialize(): Promise<void>;

  /**
   * Indique si le plugin est actif (via ConfigService)
   */
  isActive(): boolean;
}
