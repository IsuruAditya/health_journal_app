/**
 * Metrics & Monitoring (Industry Standard)
 * RED Metrics: Rate, Errors, Duration
 * Used by: Datadog, Prometheus, New Relic
 */

interface MetricData {
  count: number;
  sum: number;
  min: number;
  max: number;
  avg: number;
}

class Histogram {
  private values: number[] = [];
  private readonly maxSize = 1000;

  record(value: number): void {
    this.values.push(value);
    if (this.values.length > this.maxSize) {
      this.values.shift();
    }
  }

  getStats(): MetricData {
    if (this.values.length === 0) {
      return { count: 0, sum: 0, min: 0, max: 0, avg: 0 };
    }

    const sum = this.values.reduce((a, b) => a + b, 0);
    return {
      count: this.values.length,
      sum,
      min: Math.min(...this.values),
      max: Math.max(...this.values),
      avg: sum / this.values.length
    };
  }

  getPercentile(p: number): number {
    if (this.values.length === 0) return 0;
    const sorted = [...this.values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }
}

class Counter {
  private value = 0;

  inc(amount: number = 1): void {
    this.value += amount;
  }

  get(): number {
    return this.value;
  }

  reset(): void {
    this.value = 0;
  }
}

export class Metrics {
  // Rate metrics
  private requestCounter = new Counter();
  private successCounter = new Counter();
  private errorCounter = new Counter();

  // Duration metrics
  private durationHistogram = new Histogram();
  private cacheHitCounter = new Counter();
  private cacheMissCounter = new Counter();

  // Rate limiting metrics
  private rateLimitHitCounter = new Counter();
  private queuedRequestCounter = new Counter();

  recordRequest(): void {
    this.requestCounter.inc();
  }

  recordSuccess(duration: number): void {
    this.successCounter.inc();
    this.durationHistogram.record(duration);
  }

  recordError(): void {
    this.errorCounter.inc();
  }

  recordCacheHit(): void {
    this.cacheHitCounter.inc();
  }

  recordCacheMiss(): void {
    this.cacheMissCounter.inc();
  }

  recordRateLimitHit(): void {
    this.rateLimitHitCounter.inc();
  }

  recordQueuedRequest(): void {
    this.queuedRequestCounter.inc();
  }

  getMetrics() {
    const duration = this.durationHistogram.getStats();
    const totalRequests = this.requestCounter.get();
    const cacheTotal = this.cacheHitCounter.get() + this.cacheMissCounter.get();

    return {
      // Rate
      requests: {
        total: totalRequests,
        success: this.successCounter.get(),
        errors: this.errorCounter.get(),
        errorRate: totalRequests > 0 ? (this.errorCounter.get() / totalRequests) * 100 : 0
      },
      
      // Duration
      duration: {
        avg: duration.avg,
        min: duration.min,
        max: duration.max,
        p50: this.durationHistogram.getPercentile(50),
        p95: this.durationHistogram.getPercentile(95),
        p99: this.durationHistogram.getPercentile(99)
      },

      // Cache
      cache: {
        hits: this.cacheHitCounter.get(),
        misses: this.cacheMissCounter.get(),
        hitRate: cacheTotal > 0 ? (this.cacheHitCounter.get() / cacheTotal) * 100 : 0
      },

      // Rate Limiting
      rateLimiting: {
        hits: this.rateLimitHitCounter.get(),
        queued: this.queuedRequestCounter.get()
      }
    };
  }

  reset(): void {
    this.requestCounter.reset();
    this.successCounter.reset();
    this.errorCounter.reset();
    this.cacheHitCounter.reset();
    this.cacheMissCounter.reset();
    this.rateLimitHitCounter.reset();
    this.queuedRequestCounter.reset();
  }
}

// Global metrics instance
export const metrics = new Metrics();
