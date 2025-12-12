/**
 * Priority Queue for Request Management (Industry Standard)
 * Used by: Shopify, GitHub, Stripe
 */

export enum Priority {
  URGENT = 1,   // Severe symptoms (severity >= 8)
  HIGH = 3,     // Moderate symptoms (severity >= 5)
  NORMAL = 5,   // Regular analysis
  LOW = 10      // Background tasks
}

interface QueueItem<T> {
  id: string;
  data: T;
  priority: Priority;
  timestamp: number;
  retries: number;
}

export class PriorityQueue<T> {
  private queue: QueueItem<T>[] = [];
  private processing = new Set<string>();
  private readonly maxConcurrent: number;
  private readonly maxRetries: number;

  constructor(maxConcurrent: number = 3, maxRetries: number = 3) {
    this.maxConcurrent = maxConcurrent;
    this.maxRetries = maxRetries;
  }

  async add(id: string, data: T, priority: Priority = Priority.NORMAL): Promise<void> {
    const item: QueueItem<T> = {
      id,
      data,
      priority,
      timestamp: Date.now(),
      retries: 0
    };

    // Insert in priority order
    const index = this.queue.findIndex(i => i.priority > priority);
    if (index === -1) {
      this.queue.push(item);
    } else {
      this.queue.splice(index, 0, item);
    }
  }

  async process(handler: (data: T) => Promise<void>): Promise<void> {
    while (this.queue.length > 0 && this.processing.size < this.maxConcurrent) {
      const item = this.queue.shift();
      if (!item) break;

      this.processing.add(item.id);

      // Process asynchronously
      this.processItem(item, handler).finally(() => {
        this.processing.delete(item.id);
      });
    }
  }

  private async processItem(item: QueueItem<T>, handler: (data: T) => Promise<void>): Promise<void> {
    try {
      await handler(item.data);
    } catch (error) {
      item.retries++;
      
      if (item.retries < this.maxRetries) {
        // Exponential backoff: 2^retries seconds
        const delay = Math.pow(2, item.retries) * 1000;
        setTimeout(() => {
          this.queue.unshift(item); // Re-add to front
        }, delay);
      } else {
        console.error(`Queue item ${item.id} failed after ${this.maxRetries} retries`);
      }
    }
  }

  getStats() {
    return {
      queueSize: this.queue.length,
      processing: this.processing.size,
      urgent: this.queue.filter(i => i.priority === Priority.URGENT).length,
      high: this.queue.filter(i => i.priority === Priority.HIGH).length,
      normal: this.queue.filter(i => i.priority === Priority.NORMAL).length,
      low: this.queue.filter(i => i.priority === Priority.LOW).length
    };
  }

  clear(): void {
    this.queue = [];
  }
}

// Global analysis queue
export const analysisQueue = new PriorityQueue<any>(2, 3); // Max 2 concurrent
