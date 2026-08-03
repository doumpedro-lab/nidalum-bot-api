export interface QueuePayload {
  eventName: string;
  data: any;
}

export interface IQueueProvider {
  /**
   * Ajoute une tâche à la file d'attente
   * @param queueName Nom de la file (ex: 'social-publish')
   * @param payload Données de la tâche
   * @param executeAt Optionnel: date d'exécution prévue
   */
  enqueue(queueName: string, payload: QueuePayload, executeAt?: Date): Promise<void>;
}
