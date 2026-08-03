import { GeminiProvider } from '../src/infrastructure/providers/cloud/GeminiProvider';

// Mock Generative AI
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify({ linkedin: 'LinkedIn text', x: 'X text' })
          }
        })
      })
    }))
  };
});

describe('GeminiProvider', () => {
  let provider: GeminiProvider;

  beforeEach(() => {
    process.env.ENABLE_AI = 'true';
    provider = new GeminiProvider();
    jest.clearAllMocks();
  });

  it('should generate variants successfully', async () => {
    const result = await provider.generateVariants('Base text', ['linkedin', 'x']);
    expect(result).toEqual({ linkedin: 'LinkedIn text', x: 'X text' });
  });

  it('should fallback to base text if AI is disabled', async () => {
    process.env.ENABLE_AI = 'false';
    const result = await provider.generateVariants('Base text', ['linkedin', 'x']);
    expect(result).toEqual({ linkedin: 'Base text', x: 'Base text' });
  });
});
