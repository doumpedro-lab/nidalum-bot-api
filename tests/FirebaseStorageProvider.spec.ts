import { FirebaseStorageProvider } from '../src/infrastructure/providers/cloud/FirebaseStorageProvider';

// Mock de Storage
jest.mock('../src/firebase', () => {
  const mockFile = {
    save: jest.fn().mockResolvedValue(undefined),
    makePublic: jest.fn().mockResolvedValue(undefined),
    download: jest.fn().mockResolvedValue([Buffer.from('test')]),
    delete: jest.fn().mockResolvedValue(undefined),
    exists: jest.fn().mockResolvedValue([true]),
  };

  return {
    bucket: {
      name: 'test-bucket',
      file: jest.fn().mockReturnValue(mockFile)
    }
  };
});

describe('FirebaseStorageProvider', () => {
  let provider: FirebaseStorageProvider;

  beforeEach(() => {
    provider = new FirebaseStorageProvider();
    jest.clearAllMocks();
  });

  it('should upload file and return url', async () => {
    const url = await provider.upload('test.jpg', Buffer.from('test'), 'image/jpeg');
    expect(url).toBe('https://storage.googleapis.com/test-bucket/test.jpg');
  });

  it('should download file', async () => {
    const buffer = await provider.download('test.jpg');
    expect(buffer.toString()).toBe('test');
  });

  it('should delete file', async () => {
    await expect(provider.delete('test.jpg')).resolves.toBeUndefined();
  });

  it('should check if exists', async () => {
    const exists = await provider.exists('test.jpg');
    expect(exists).toBe(true);
  });
});
