/**
 * Centralized error handling utility
 * Replaces console.error with proper error handling
 */

export const handleError = (error, context = '') => {
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Error tracking service integration would go here
    // Example: Sentry.captureException(error, { extra: { context } })
    return
  }
  
  // In development, log with context
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error(`[${context}]`, error)
  }
}

export const createErrorResponse = (message, code = 'UNKNOWN_ERROR') => {
  return {
    error: true,
    message,
    code,
    timestamp: new Date().toISOString()
  }
}


