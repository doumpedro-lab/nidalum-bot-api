import 'reflect-metadata';
import request from 'supertest';
import app from '../src/infrastructure/http/app';
import { container } from 'tsyringe';

// Mocks UseCases to test controllers in isolation
jest.mock('../src/application/useCases/HealthCheckUseCase', () => {
  return {
    HealthCheckUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({ status: 'healthy', mock: true })
    }))
  };
});

jest.mock('../src/application/useCases/DispatchUseCase', () => {
  return {
    DispatchUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({ success: true, publicationId: '123' })
    }))
  };
});

jest.mock('../src/application/useCases/PublishWorkerUseCase', () => {
  return {
    PublishWorkerUseCase: jest.fn().mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue({ success: true, postId: 'post-123' })
    }))
  };
});

jest.mock('../src/core/interfaces/IAIProvider', () => {
  return {
    IAIProvider: jest.fn()
  };
});

describe('Express API Endpoints', () => {
  beforeAll(() => {
    container.registerSingleton('IAIProvider', class MockAI {
      async generateVariants() {
        return { facebook: 'mock fb' };
      }
    } as any);
  });

  it('GET /api/v1/health should return 200', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
  });

  it('GET /api/v1/version should return 200', async () => {
    const res = await request(app).get('/api/v1/version');
    expect(res.status).toBe(200);
    expect(res.body.data.version).toBe('1.0.0-MVP');
  });

  it('POST /api/v1/dispatch should return 200 for valid payload', async () => {
    const res = await request(app)
      .post('/api/v1/dispatch')
      .send({ publicationId: 'pub-123' });
    expect(res.status).toBe(200);
    expect(res.body.data.publicationId).toBe('123');
  });

  it('POST /api/v1/dispatch should return error for invalid payload', async () => {
    const res = await request(app)
      .post('/api/v1/dispatch')
      .send({}); // missing publicationId
    expect(res.status).toBe(500); // Because of the global error handler mapping Zod error
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/worker/publish should return 200 for valid payload', async () => {
    const res = await request(app)
      .post('/api/v1/worker/publish')
      .send({ publicationId: 'pub-123', platform: 'facebook' });
    expect(res.status).toBe(200);
    expect(res.body.data.postId).toBe('post-123');
  });

  it('POST /api/v1/content/generate should return 200 for valid payload', async () => {
    const res = await request(app)
      .post('/api/v1/content/generate')
      .send({ text: 'Hello', platforms: ['facebook'] });
    expect(res.status).toBe(200);
    expect(res.body.data.facebook).toBe('mock fb');
  });
});
