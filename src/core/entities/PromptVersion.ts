export type PromptCategory = 'social' | 'blog' | 'newsletter' | 'book_chapter' | 'music_promo';

export interface PromptVersion {
  id?: string;
  category: PromptCategory;
  version: number;
  language: string;
  content: string; // Le template textuel, ex: "Tu es un expert..."
  costPerUseUsd: number; // Coût estimé à l'utilisation
  isActive: boolean;
  createdAt: Date;
}
