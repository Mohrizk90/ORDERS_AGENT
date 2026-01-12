// Centralized error handling utilities

/**
 * Parse Supabase error to user-friendly message
 */
export const parseSupabaseError = (error) => {
  if (!error) return 'An unknown error occurred';

  // Handle Supabase-specific error codes
  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        return 'No records found';
      case 'PGRST205':
        // Table doesn't exist - this is handled gracefully in services
        return null; // Return null to indicate this should be handled silently
      case 'PGRST301':
        return 'Invalid request parameters';
      case '23505':
        return 'A record with this ID already exists';
      case '23503':
        return 'Cannot delete: related records exist';
      case '42501':
        return 'Permission denied. Check your Row Level Security (RLS) policies.';
      case 'PGRST204':
        return 'Record not found';
      default:
        break;
    }
  }

  // Handle network errors
  if (error.message?.includes('Failed to fetch')) {
    return 'Network error. Please check your connection.';
  }

  if (error.message?.includes('NetworkError')) {
    return 'Network error. Please check your connection.';
  }

  // Return the error message if available
  if (error.message) {
    return error.message;
  }

  // Fallback
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Log error for debugging (only in development)
 */
export const logError = (context, error) => {
  if (import.meta.env.DEV) {
    // Don't log missing table errors as they're handled gracefully
    if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
      // Silently handle - table doesn't exist, which is expected in some setups
      return;
    }
    console.error(`[${context}]`, error);
  }
};

/**
 * Create error result object
 */
export const createErrorResult = (error, context = 'Operation') => {
  logError(context, error);
  return {
    data: null,
    error: parseSupabaseError(error),
    success: false,
  };
};

/**
 * Create success result object
 */
export const createSuccessResult = (data) => {
  return {
    data,
    error: null,
    success: true,
  };
};

/**
 * Wrap async operation with error handling
 */
export const withErrorHandling = async (operation, context = 'Operation') => {
  try {
    const result = await operation();
    return createSuccessResult(result);
  } catch (error) {
    return createErrorResult(error, context);
  }
};
