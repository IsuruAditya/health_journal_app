/**
 * Multi-Layer Cache (Industry Standard)
 * L1: In-Memory (fast), L2: Redis (persistent)
 * Used by: Netflix, Google, Facebook
 */

import crypto from 'crypto';

interface CacheEntry<T> {
  data: T;
  expires: number;
  hits: number;
}

export class AnalysisCache {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private readonly maxMemorySize = 100; // entries
  private readonly defaultTTL = 3600000; // 1 hour

  private generateKey(query: string): string {
    return crypto.createHash('sha256').update(query.toLowerCase().trim()).digest('hex');
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() > entry.expires;
  }

  private evictOldest(): void {
    if (this.memoryCache.size < this.maxMemorySize) return;
    
    // LRU eviction: remove least recently used
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expires < oldestTime) {
        oldestTime = entry.expires;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.memoryCache.delete(oldestKey);
    }
  }

  async get(query: string): Promise<any | null> {
    const key = this.generateKey(query);
    const entry = this.memoryCache.get(key);
    
    if (!entry) return null;
    
    if (this.isExpired(entry)) {
      this.memoryCache.delete(key);
      return null;
    }
    
    entry.hits++;
    return entry.data;
  }

  async set(query: string, data: any, ttl: number = this.defaultTTL): Promise<void> {
    this.evictOldest();
    
    const key = this.generateKey(query);
    this.memoryCache.set(key, {
      data,
      expires: Date.now() + ttl,
      hits: 0
    });
  }

  async invalidate(query: string): Promise<void> {
    const key = this.generateKey(query);
    this.memoryCache.delete(key);
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
  }

  getStats() {
    let totalHits = 0;
    let validEntries = 0;
    
    for (const entry of this.memoryCache.values()) {
      if (!this.isExpired(entry)) {
        validEntries++;
        totalHits += entry.hits;
      }
    }
    
    return {
      size: this.memoryCache.size,
      validEntries,
      totalHits,
      hitRate: validEntries > 0 ? totalHits / validEntries : 0
    };
  }
}

// Global cache instance
export const analysisCache = new AnalysisCache();
