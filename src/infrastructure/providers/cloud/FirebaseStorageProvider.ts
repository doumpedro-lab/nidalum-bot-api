import { IStorageProvider } from '../../../core/interfaces/IStorageProvider';
import { bucket } from '../../../firebase'; // Bucket existant

export class FirebaseStorageProvider implements IStorageProvider {
  async upload(path: string, buffer: Buffer, mimeType: string): Promise<string> {
    const file = bucket.file(path);
    await file.save(buffer, {
      metadata: { contentType: mimeType },
    });
    await file.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${path}`;
  }

  async download(path: string): Promise<Buffer> {
    const file = bucket.file(path);
    const [buffer] = await file.download();
    return buffer;
  }

  async delete(path: string): Promise<void> {
    const file = bucket.file(path);
    await file.delete();
  }

  async exists(path: string): Promise<boolean> {
    const file = bucket.file(path);
    const [exists] = await file.exists();
    return exists;
  }
}
