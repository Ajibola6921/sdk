/**
 * Sandbox Mode Client
 *
 * Simulates all API responses without hitting real testnet.
 * Perfect for testing UI integrations and development workflows.
 */

import { DorisioClient, type ClientConfig } from '../client';
import * as MockData from './mock-data';

export interface SandboxConfig extends ClientConfig {
  mode: 'sandbox';
  /**
   * Simulate network delays (ms). Set to 0 for instant responses.
   */
  latency?: number;
  /**
   * Seed for deterministic mock data. Same seed = same data.
   */
  seed?: number;
  /**
   * Simulate errors randomly (0-1). 0 = no errors, 0.2 = 20% error rate.
   */
  errorRate?: number;
}

/**
 * Create a sandbox client for testing without real network calls
 *
 * @example
 * ```ts
 * const client = new DorisioClient({
 *   mode: 'sandbox',
 *   latency: 200, // Simulate 200ms network delay
 * });
 *
 * // Use exactly like real client - all responses are mocked
 * const tip = await client.payments.createTip({
 *   creatorId: 'xxx',
 *   amount: 50,
 * });
 *
 * console.log(tip.id); // Real UUID, deterministic
 * ```
 */
export class SandboxClient extends DorisioClient {
  private latency: number;
  private seed: number;
  private errorRate: number;
  private requestCounter = 0;

  constructor(config: SandboxConfig) {
    // Strip sandbox-specific config before passing to parent
    const { latency, seed, errorRate, ...parentConfig } = config;

    super(parentConfig);

    this.latency = latency ?? 100;
    this.seed = seed ?? Math.random() * 10000;
    this.errorRate = errorRate ?? 0;
  }

  /**
   * Simulate network delay
   */
  private async simulateLatency(): Promise<void> {
    if (this.latency > 0) {
      return new Promise((resolve) => setTimeout(resolve, this.latency));
    }
  }

  /**
   * Simulate random errors based on errorRate
   */
  private checkError(): void {
    if (Math.random() < this.errorRate) {
      throw new Error('Simulated network error in sandbox mode');
    }
  }

  /**
   * Override request method to return mocked responses
   */
  override async request(method: string, path: string): Promise<any> {
    await this.simulateLatency();
    this.checkError();

    const seed = this.seed + this.requestCounter++;

    // Route to appropriate mock generator based on endpoint
    if (path.includes('/transactions/tip')) {
      return {
        success: true,
        data: MockData.generateMockTip(seed),
      };
    }

    if (path.includes('/transactions/history')) {
      return {
        success: true,
        data: MockData.generateMockTransactionHistory({ seed }),
      };
    }

    if (path.includes('/transactions/') && path.includes('/confirm')) {
      return {
        success: true,
        data: {
          ...MockData.generateMockTransaction(seed),
          status: 'confirmed',
        },
      };
    }

    if (path.includes('/transactions/')) {
      return {
        success: true,
        data: MockData.generateMockTransaction(seed),
      };
    }

    if (path.includes('/creators') && method === 'GET') {
      return {
        success: true,
        data: MockData.generateMockCreators({ seed }),
      };
    }

    if (path.includes('/creators/')) {
      return {
        success: true,
        data: MockData.generateMockCreator(seed),
      };
    }

    if (path.includes('/wallet')) {
      return {
        success: true,
        data: MockData.generateMockWallet(seed),
      };
    }

    if (path.includes('/auth/login')) {
      return {
        success: true,
        data: MockData.generateMockSession(seed),
      };
    }

    if (path.includes('/auth/register')) {
      return {
        success: true,
        data: MockData.generateMockSession(seed),
      };
    }

    if (path.includes('/auth/validate')) {
      return {
        success: true,
        data: MockData.generateMockSession(seed),
      };
    }

    if (path.includes('/auth/challenge')) {
      return {
        success: true,
        data: MockData.generateMockChallenge(),
      };
    }

    if (path.includes('/users/me')) {
      return {
        success: true,
        data: MockData.generateMockUser(seed),
      };
    }

    if (path.includes('/users')) {
      return {
        success: true,
        data: MockData.generateMockUser(seed),
      };
    }

    // Fallback
    return {
      success: true,
      data: { id: 'mock-response' },
    };
  }

  /**
   * Set latency for simulating network delays
   */
  setLatency(latency: number): void {
    this.latency = latency;
  }

  /**
   * Set error rate for simulating failures (0-1)
   */
  setErrorRate(errorRate: number): void {
    this.errorRate = Math.max(0, Math.min(1, errorRate));
  }

  /**
   * Set seed for deterministic responses
   */
  setSeed(seed: number): void {
    this.seed = seed;
    this.requestCounter = 0;
  }

  /**
   * Get current configuration
   */
  getSandboxConfig() {
    return {
      latency: this.latency,
      seed: this.seed,
      errorRate: this.errorRate,
      isSandbox: true,
    };
  }
}

/**
 * Create a sandbox client easily
 *
 * @example
 * ```ts
 * import { createSandboxClient } from 'dorisio-sdk/sandbox';
 *
 * const client = createSandboxClient({
 *   latency: 200,
 *   seed: 42, // Deterministic
 * });
 * ```
 */
export function createSandboxClient(config: Partial<SandboxConfig> = {}) {
  return new SandboxClient({
    ...config,
    mode: 'sandbox',
    baseUrl: config.baseUrl || 'http://sandbox.dorisio.local',
  });
}
