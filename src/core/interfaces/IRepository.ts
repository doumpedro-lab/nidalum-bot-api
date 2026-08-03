export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(conditions?: Record<string, any>): Promise<T[]>;
  create(item: Omit<T, 'id'>): Promise<string>;
  update(id: string, item: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
}
