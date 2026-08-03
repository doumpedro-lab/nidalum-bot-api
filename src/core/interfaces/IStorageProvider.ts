export interface IStorageProvider {
  /**
   * Uploade un fichier et retourne son URL publique
   */
  upload(path: string, buffer: Buffer, mimeType: string): Promise<string>;

  /**
   * Télécharge un fichier depuis le stockage
   */
  download(path: string): Promise<Buffer>;

  /**
   * Supprime un fichier
   */
  delete(path: string): Promise<void>;

  /**
   * Vérifie si un fichier existe
   */
  exists(path: string): Promise<boolean>;
}
