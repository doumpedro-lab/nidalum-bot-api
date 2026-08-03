export interface TextVariants {
  [platform: string]: string;
}

export interface IAIProvider {
  /**
   * Identifiant du provider (ex: 'gemini', 'openai')
   */
  readonly name: string;

  /**
   * Génère les variantes de textes pour les différentes plateformes
   * @param baseText Texte d'origine (brouillon ou template)
   * @param platforms Les plateformes cibles (ex: ['linkedin', 'x'])
   * @returns Un objet associant chaque plateforme à son texte adapté
   */
  generateVariants(baseText: string, platforms: string[]): Promise<TextVariants>;
}
