/**
 * Token Bucket Rate Limiter (Industry Standard)
 * Used by: AWS, Stripe, Shopify
 */

interface RateLimitConfig {
  maxTokens: number;
  refillRate: number; // tokens per second
  refillInterval?: number; // ms
}

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      refillInterval: 1000,
      ...config
    };
    this.tokens = this.config.maxTokens;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = (timePassed / this.config.refillInterval) * this.config.refillRate;
    
    this.tokens = Math.min(this.config.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  async acquire(tokens: number = 1): Promise<boolean> {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }

  getAvailableTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }

  getWaitTime(tokens: number = 1): number {
    this.refill();
    if (this.tokens >= tokens) return 0;
    
    const needed = tokens - this.tokens;
    return Math.ceil((needed / this.config.refillRate) * this.config.refillInterval);
  }
}

// Global rate limiters
export const rateLimiters = {
  // Per-user limits
  perUser: new Map<string, RateLimiter>(),
  
  // Global AI service limit
  aiService: new RateLimiter({
    maxTokens: 10,
    refillRate: 2 // 2 requests per second
  }),
  
  getUserLimiter(userId: string): RateLimiter {
    if (!this.perUser.has(userId)) {
      this.perUser.set(userId, new RateLimiter({
        maxTokens: 5,
        refillRate: 1 // 1 request per second per user
      }));
    }
    return this.perUser.get(userId)!;
  }
};
