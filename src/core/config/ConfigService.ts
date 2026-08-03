export class ConfigService {
  private static instance: ConfigService;

  private constructor() {}

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * For non-sensitive configs (feature flags, URLs)
   */
  public get(key: string, defaultValue: string = ''): string {
    return process.env[key] || defaultValue;
  }

  /**
   * For feature flags
   */
  public getBoolean(key: string, defaultValue: boolean = false): boolean {
    if (process.env[key] === 'true') return true;
    if (process.env[key] === 'false') return false;
    return defaultValue;
  }

  /**
   * Gets a secret from environment variables (Render.com compatibility)
   */
  public async getSecret(secretName: string): Promise<string> {
    return process.env[secretName] || '';
  }
}
