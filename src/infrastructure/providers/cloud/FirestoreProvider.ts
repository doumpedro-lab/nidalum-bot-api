import { IDatabaseProvider } from '../../../core/interfaces/IDatabaseProvider';
import { db } from '../../../firebase'; // Instance existante

export class FirestoreProvider implements IDatabaseProvider {
  async findById<T>(collection: string, id: string): Promise<T | null> {
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as unknown as T;
  }

  async find<T>(collection: string, filters: Record<string, any>): Promise<T[]> {
    let query: any = db.collection(collection);
    
    for (const [key, value] of Object.entries(filters)) {
      query = query.where(key, '==', value);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as unknown as T));
  }

  async create<T>(collection: string, data: Omit<T, 'id'>): Promise<string> {
    const docRef = await db.collection(collection).add(data as any);
    return docRef.id;
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<void> {
    await db.collection(collection).doc(id).update(data as any);
  }

  async delete(collection: string, id: string): Promise<void> {
    await db.collection(collection).doc(id).delete();
  }
}
