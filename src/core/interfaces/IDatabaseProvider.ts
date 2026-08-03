export interface IDatabaseProvider {
  /**
   * Trouve un document par son ID
   */
  findById<T>(collection: string, id: string): Promise<T | null>;

  /**
   * Récupère plusieurs documents selon des filtres
   */
  find<T>(collection: string, filters: Record<string, any>): Promise<T[]>;

  /**
   * Crée un document et retourne son ID généré
   */
  create<T>(collection: string, data: Omit<T, 'id'>): Promise<string>;

  /**
   * Met à jour un document existant
   */
  update<T>(collection: string, id: string, data: Partial<T>): Promise<void>;

  /**
   * Supprime un document
   */
  delete(collection: string, id: string): Promise<void>;
}
