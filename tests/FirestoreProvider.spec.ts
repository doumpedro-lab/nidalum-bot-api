import { FirestoreProvider } from '../src/infrastructure/providers/cloud/FirestoreProvider';

// Mock de Firestore
jest.mock('../src/firebase', () => {
  const mockDoc = {
    get: jest.fn().mockResolvedValue({ exists: true, id: '123', data: () => ({ name: 'test' }) }),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  };
  
  const mockCollection = {
    doc: jest.fn().mockReturnValue(mockDoc),
    add: jest.fn().mockResolvedValue({ id: '456' }),
    where: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      docs: [{ id: '123', data: () => ({ name: 'test' }) }]
    })
  };
  
  return {
    db: {
      collection: jest.fn().mockReturnValue(mockCollection)
    }
  };
});

describe('FirestoreProvider', () => {
  let provider: FirestoreProvider;

  beforeEach(() => {
    provider = new FirestoreProvider();
    jest.clearAllMocks();
  });

  it('should findById', async () => {
    const result = await provider.findById('testCollection', '123');
    expect(result).toEqual({ id: '123', name: 'test' });
  });

  it('should create', async () => {
    const id = await provider.create('testCollection', { name: 'new' });
    expect(id).toBe('456');
  });

  it('should update', async () => {
    await expect(provider.update('testCollection', '123', { name: 'updated' })).resolves.toBeUndefined();
  });

  it('should delete', async () => {
    await expect(provider.delete('testCollection', '123')).resolves.toBeUndefined();
  });

  it('should find with filters', async () => {
    const result = await provider.find('testCollection', { name: 'test' });
    expect(result).toEqual([{ id: '123', name: 'test' }]);
  });
});
