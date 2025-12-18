/**
 * Environment variable validation
 * Ensures all required environment variables are set before runtime
 */

export function validateEnv() {
  const required = ['DATABASE_URL'];
  const aiKeys = ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY'];

  // Check for AI provider
  const hasAiKey = aiKeys.some((key) => process.env[key]);
  if (!hasAiKey) {
    throw new Error(
      'Missing AI provider key. Set either ANTHROPIC_API_KEY or OPENAI_API_KEY in .env.local'
    );
  }

  // Check for required variables
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. Check .env.local and .env.example`
    );
  }

  console.log('✅ Environment validation passed');
}

// Validate on module load
if (typeof window === 'undefined') {
  // Only validate on server-side
  try {
    validateEnv();
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    // Don't throw in development to allow partial functionality
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}
