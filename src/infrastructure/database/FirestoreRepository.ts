import { IRepository } from '../../core/interfaces/IRepository';
import { db } from '../../firebase';

export class FirestoreRepository<T> implements IRepository<T> {
  constructor(private collectionName: string) {}

  async findById(id: string): Promise<T | null> {
    const doc = await db.collection(this.collectionName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as unknown as T;
  }

  async findAll(conditions?: Record<string, any>): Promise<T[]> {
    let query: any = db.collection(this.collectionName);
    
    if (conditions) {
      for (const [key, value] of Object.entries(conditions)) {
        query = query.where(key, '==', value);
      }
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as unknown as T));
  }

  async create(item: Omit<T, 'id'>): Promise<string> {
    const docRef = await db.collection(this.collectionName).add(item as any);
    return docRef.id;
  }

  async update(id: string, item: Partial<T>): Promise<void> {
    await db.collection(this.collectionName).doc(id).update(item as any);
  }

  async delete(id: string): Promise<void> {
    await db.collection(this.collectionName).doc(id).delete();
  }
}
