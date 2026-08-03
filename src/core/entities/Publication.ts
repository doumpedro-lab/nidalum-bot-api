export type PublishStatus = 'draft' | 'scheduled' | 'enqueued' | 'published' | 'partial_error' | 'failed';

export interface Publication {
  id?: string;
  campaignId?: string;
  title: string;
  body: string;
  imageUrl?: string;
  hashtags: string[];
  platforms: string[];
  
  // Les variantes générées en amont par l'IA (clé = plateforme, valeur = texte adapté)
  variants: Record<string, string>;
  
  publishDate: Date;
  status: PublishStatus;
  
  createdAt: Date;
  updatedAt: Date;
}
