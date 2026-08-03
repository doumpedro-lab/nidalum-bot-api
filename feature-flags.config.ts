export const FeatureFlags = {
  // Plugins
  ENABLE_LINKEDIN: true,
  ENABLE_X: true,
  ENABLE_PINTEREST: true,
  ENABLE_THREADS: true,
  ENABLE_INSTAGRAM: true,
  ENABLE_FACEBOOK: true,
  ENABLE_MEDIUM: true,
  ENABLE_SUBSTACK: true,
  ENABLE_YOUTUBE: true,
  
  // System Modules
  ENABLE_AI: true,
  ENABLE_ANALYTICS: false,
  ENABLE_COST_MONITOR: false,
  ENABLE_AUDIT_TRAIL: false,
  
  // Providers
  ACTIVE_AI_PROVIDER: process.env.ACTIVE_AI_PROVIDER || 'gemini', // 'gemini', 'openai', 'claude'
};
