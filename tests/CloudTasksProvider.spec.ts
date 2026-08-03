import { CloudTasksProvider } from '../src/infrastructure/providers/cloud/CloudTasksProvider';

// Mock Cloud Tasks Client
jest.mock('@google-cloud/tasks', () => {
  return {
    CloudTasksClient: jest.fn().mockImplementation(() => ({
      queuePath: jest.fn().mockReturnValue('mock-path'),
      createTask: jest.fn().mockResolvedValue([{ name: 'task/mock-task-id' }])
    }))
  };
});

describe('CloudTasksProvider', () => {
  let provider: CloudTasksProvider;

  beforeEach(() => {
    process.env.GCP_PROJECT_ID = 'test';
    process.env.GCP_LOCATION = 'test';
    process.env.WORKER_SERVICE_URL = 'http://test';
    provider = new CloudTasksProvider();
    jest.clearAllMocks();
  });

  it('should enqueue a task immediately', async () => {
    await expect(provider.enqueue('social-queue', { eventName: 'test', data: {} })).resolves.toBeUndefined();
  });

  it('should enqueue a scheduled task', async () => {
    const futureDate = new Date(Date.now() + 10000);
    await expect(provider.enqueue('social-queue', { eventName: 'test', data: {} }, futureDate)).resolves.toBeUndefined();
  });
});
