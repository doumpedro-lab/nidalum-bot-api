export interface EnqueuePayload {
  publicationId: string;
  platform: string;
}

export interface IQueueService {
  /**
   * Ajoute une tâche de publication dans la file d'attente
   * @param payload Contient l'ID de la publication et la plateforme cible
   * @param scheduleTime Date prévue (optionnel)
   */
  enqueuePublication(payload: EnqueuePayload, scheduleTime?: Date): Promise<void>;
}
