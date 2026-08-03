import { FacebookPlugin } from '../plugins/social/facebook/FacebookPlugin';
import { InstagramPlugin } from '../plugins/social/instagram/InstagramPlugin';
import { PinterestPlugin } from '../plugins/social/pinterest/PinterestPlugin';
import { ThreadsPlugin } from '../plugins/social/threads/ThreadsPlugin';

// Mock node fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 'mock-post-id' }),
  })
) as jest.Mock;

describe('Social Plugins MVP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ENABLE_FACEBOOK = 'true';
    process.env.ENABLE_INSTAGRAM = 'true';
    process.env.ENABLE_PINTEREST = 'true';
    process.env.ENABLE_THREADS = 'true';
    process.env.FACEBOOK_PAGE_ID = 'test-fb';
    process.env.FACEBOOK_ACCESS_TOKEN = 'test-fb-token';
    process.env.INSTAGRAM_ACCOUNT_ID = 'test-ig';
    process.env.PINTEREST_BOARD_ID = 'test-pin';
    process.env.PINTEREST_ACCESS_TOKEN = 'test-pin-token';
    process.env.THREADS_ACCOUNT_ID = 'test-threads';
    process.env.THREADS_ACCESS_TOKEN = 'test-threads-token';
  });

  it('FacebookPlugin should publish text', async () => {
    const plugin = new FacebookPlugin();
    await plugin.initialize();
    
    expect(plugin.validate({ text: '', hashtags: [] })).toBe('Text is required for Facebook.');
    expect(plugin.validate({ text: 'Hello', hashtags: [] })).toBe(true);
    
    const id = await plugin.publish({ text: 'Hello Facebook', hashtags: ['test'] });
    expect(id).toBe('mock-post-id');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('InstagramPlugin should publish image', async () => {
    const plugin = new InstagramPlugin();
    await plugin.initialize();
    
    expect(plugin.validate({ text: 'No image', hashtags: [] })).toBe('Image URL is required for Instagram.');
    
    const id = await plugin.publish({ text: 'Hello IG', imageUrl: 'http://img.com', hashtags: ['test'] });
    expect(id).toBe('mock-post-id');
    expect(fetch).toHaveBeenCalledTimes(2); // Create container + Publish
  });

  it('PinterestPlugin should publish image', async () => {
    const plugin = new PinterestPlugin();
    await plugin.initialize();
    
    expect(plugin.validate({ text: 'No image', hashtags: [] })).toBe('Image URL is required for Pinterest.');
    
    const id = await plugin.publish({ text: 'Hello Pin', imageUrl: 'http://img.com', hashtags: ['test'] });
    expect(id).toBe('mock-post-id');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('ThreadsPlugin should publish text', async () => {
    const plugin = new ThreadsPlugin();
    await plugin.initialize();
    
    expect(plugin.validate({ text: '', hashtags: [] })).toBe('Text is required for Threads.');
    
    const id = await plugin.publish({ text: 'Hello Threads', hashtags: ['test'] });
    expect(id).toBe('mock-post-id');
    expect(fetch).toHaveBeenCalledTimes(2); // Create container + Publish
  });
});
