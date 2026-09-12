import crypto from 'crypto';

/**
 * Webhook event payload structure
 */
export interface WebhookPayload {
  id: string;
  timestamp: number;
  event: string;
  data: Record<string, any>;
}

/**
 * Verifies webhook signature to ensure authenticity
 * Uses HMAC-SHA256 for signature verification
 *
 * @param payload - The webhook payload (JSON string or object)
 * @param signature - The signature header from the webhook request
 * @param secret - Your webhook secret from Dorisio dashboard
 * @returns true if signature is valid, false otherwise
 *
 * @example
 * ```ts
 * const isValid = verifyWebhookSignature(
 *   JSON.stringify(payload),
 *   req.headers['x-dorisio-signature'] as string,
 *   process.env.DORISIO_WEBHOOK_SECRET!
 * );
 * if (!isValid) throw new Error('Invalid webhook signature');
 * ```
 */
export function verifyWebhookSignature(
  payload: string | Record<string, any>,
  signature: string,
  secret: string
): boolean {
  try {
    // Normalize payload to string
    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);

    // Create HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');

    // Use constant-time comparison to prevent timing attacks
    return constantTimeEqual(signature, expectedSignature);
  } catch {
    return false;
  }
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Parse and validate webhook payload structure
 *
 * @param payload - The raw webhook payload
 * @returns Parsed webhook payload if valid
 * @throws Error if payload structure is invalid
 *
 * @example
 * ```ts
 * const event = parseWebhookPayload(req.body);
 * if (event.event === 'tip.confirmed') {
 *   const tipData = event.data as TipConfirmedData;
 *   // Handle confirmed tip
 * }
 * ```
 */
export function parseWebhookPayload(payload: unknown): WebhookPayload {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid webhook payload: must be an object');
  }

  const p = payload as Record<string, any>;

  if (!p.id || typeof p.id !== 'string') {
    throw new Error('Invalid webhook payload: missing or invalid id');
  }

  if (!p.timestamp || typeof p.timestamp !== 'number') {
    throw new Error('Invalid webhook payload: missing or invalid timestamp');
  }

  if (!p.event || typeof p.event !== 'string') {
    throw new Error('Invalid webhook payload: missing or invalid event');
  }

  if (!p.data || typeof p.data !== 'object') {
    throw new Error('Invalid webhook payload: missing or invalid data');
  }

  return p as WebhookPayload;
}

/**
 * Webhook event types
 */
export enum WebhookEventType {
  TIP_CREATED = 'tip.created',
  TIP_CONFIRMED = 'tip.confirmed',
  TIP_FAILED = 'tip.failed',
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',
  WALLET_VERIFIED = 'wallet.verified',
  WITHDRAWAL_COMPLETED = 'withdrawal.completed',
}

/**
 * Webhook event handler type
 */
export type WebhookEventHandler = (event: WebhookPayload) => void | Promise<void>;
