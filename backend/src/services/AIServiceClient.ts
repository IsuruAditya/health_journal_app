import axios, { AxiosInstance } from 'axios';

/**
 * AI Service Client with industry-standard patterns:
 * - Circuit breaker pattern
 * - Retry logic with exponential backoff
 * - Timeout handling
 * - Error logging
 * - Fire-and-forget for non-critical operations
 */
export class AIServiceClient {
  private client: AxiosInstance;
  private circuitBreakerOpen: boolean = false;
  private failureCount: number = 0;
  private readonly maxFailures: number = 3;
  private readonly resetTimeout: number = 60000; // 1 minute

  constructor() {
    this.client = axios.create({
      baseURL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
      timeout: 5000, // 5 second timeout for non-critical operations
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.AI_API_KEY || 'ai-rag-demo-key-2024'
      }
    });
  }

  /**
   * Delete record from AI service (fire-and-forget)
   * Industry standard: Non-blocking, graceful degradation
   */
  async deleteRecordAsync(recordId: number): Promise<void> {
    // Don't block if circuit breaker is open
    if (this.circuitBreakerOpen) {
      console.warn(`[AI Service] Circuit breaker open, skipping delete for record ${recordId}`);
      return;
    }

    // Fire and forget - don't await
    this.deleteRecordInternal(recordId).catch(error => {
      console.error(`[AI Service] Failed to delete record ${recordId}:`, error.message);
      this.handleFailure();
    });
  }

  /**
   * Internal delete with retry logic
   */
  private async deleteRecordInternal(recordId: number, retries: number = 2): Promise<void> {
    try {
      await this.client.post('/api/v1/delete_record', {
        record_id: recordId.toString()
      });
      
      // Reset failure count on success
      this.failureCount = 0;
      console.log(`[AI Service] Successfully deleted record ${recordId}`);
      
    } catch (error: any) {
      if (retries > 0 && this.isRetryableError(error)) {
        // Exponential backoff: wait before retry
        await this.delay(1000 * (3 - retries));
        return this.deleteRecordInternal(recordId, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    return (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT' ||
      (error.response && error.response.status >= 500)
    );
  }

  /**
   * Handle service failure - circuit breaker pattern
   */
  private handleFailure(): void {
    this.failureCount++;
    
    if (this.failureCount >= this.maxFailures) {
      console.warn(`[AI Service] Circuit breaker opened after ${this.failureCount} failures`);
      this.circuitBreakerOpen = true;
      
      // Reset circuit breaker after timeout
      setTimeout(() => {
        console.log('[AI Service] Circuit breaker reset');
        this.circuitBreakerOpen = false;
        this.failureCount = 0;
      }, this.resetTimeout);
    }
  }

  /**
   * Utility: delay for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Health check - test if AI service is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/v1/health', { timeout: 3000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

// Singleton instance - industry standard
export const aiServiceClient = new AIServiceClient();
