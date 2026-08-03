export interface ICacheProvider {
  /**
   * Récupère une valeur du cache
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Stocke une valeur dans le cache
   * @param ttl Time To Live en secondes (optionnel)
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Supprime une valeur du cache
   */
  delete(key: string): Promise<void>;

  /**
   * Vide tout le cache
   */
  clear(): Promise<void>;
}
