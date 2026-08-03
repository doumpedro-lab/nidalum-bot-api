export type EventHandler<T = any> = (payload: T) => Promise<void>;

export interface IEventBus {
  /**
   * Publie un événement asynchrone pour les souscripteurs
   */
  publish<T>(eventName: string, payload: T): Promise<void>;

  /**
   * Souscrit à un événement spécifique
   */
  subscribe<T>(eventName: string, handler: EventHandler<T>): void;

  /**
   * Se désabonne d'un événement
   */
  unsubscribe<T>(eventName: string, handler: EventHandler<T>): void;
}
