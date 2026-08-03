export const FeatureFlags = {
  // Plugins
  ENABLE_LINKEDIN: false,
  ENABLE_X: false,
  ENABLE_PINTEREST: false,
  ENABLE_THREADS: false,
  ENABLE_INSTAGRAM: false,
  ENABLE_FACEBOOK: false,
  ENABLE_MEDIUM: false,
  ENABLE_SUBSTACK: false,
  
  // System Modules
  ENABLE_AI: false,
  ENABLE_ANALYTICS: false,
  ENABLE_COST_MONITOR: false,
  ENABLE_AUDIT_TRAIL: false,
  
  // Providers
  ACTIVE_AI_PROVIDER: process.env.ACTIVE_AI_PROVIDER || 'gemini', // 'gemini', 'openai', 'claude'
};
