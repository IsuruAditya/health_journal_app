import { mockPool } from '../config/mock-database';

// Database fallback utility
export const createDatabaseFallback = () => {
  let usingMockDb = false;
  
  const withFallback = async (operation: () => Promise<any>) => {
    try {
      return await operation();
    } catch (error) {
      if (!usingMockDb) {
        console.log('⚠️  Database operation failed, switching to mock database');
        usingMockDb = true;
      }
      
      // Switch to mock database for this operation
      const originalPool = (global as any).pool;
      (global as any).pool = mockPool;
      
      try {
        return await operation();
      } finally {
        (global as any).pool = originalPool;
      }
    }
  };
  
  return { withFallback, isUsingMock: () => usingMockDb };
};