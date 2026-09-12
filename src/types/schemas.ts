import { z } from 'zod';

/**
 * Authentication schemas
 */
export const AuthSchemas = {
  /**
   * User login credentials
   */
  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),

  /**
   * User registration data
   */
  register: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1, 'Name is required'),
  }),

  /**
   * Wallet linking challenge response
   */
  walletChallenge: z.object({
    challenge: z.string(),
    timeout: z.number().positive(),
  }),

  /**
   * Signed challenge submission
   */
  walletVerification: z.object({
    challenge: z.string(),
    signature: z.string(),
    publicKey: z.string(),
  }),
};

/**
 * Payment schemas
 */
export const PaymentSchemas = {
  /**
   * Create tip request (with optional idempotency key)
   */
  createTip: z.object({
    amount: z.number().positive('Amount must be greater than 0'),
    currency: z.enum(['USD', 'EUR', 'XLM']),
    creatorId: z.string().uuid('Invalid creator ID'),
    message: z.string().max(500).optional(),
    idempotencyKey: z.string().uuid().optional(),
  }),

  /**
   * Transaction details
   */
  transaction: z.object({
    id: z.string(),
    hash: z.string(),
    amount: z.number(),
    currency: z.string(),
    status: z.enum(['pending', 'confirmed', 'failed']),
    createdAt: z.date(),
    confirmedAt: z.date().optional(),
  }),

  /**
   * Payment history filter
   */
  historyFilter: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    status: z.enum(['pending', 'confirmed', 'failed']).optional(),
    limit: z.number().positive().max(100).default(20),
    offset: z.number().nonnegative().default(0),
  }),
};

/**
 * Creator schemas
 */
export const CreatorSchemas = {
  /**
   * Creator profile
   */
  profile: z.object({
    id: z.string().uuid(),
    username: z.string().min(3).max(50),
    displayName: z.string().min(1).max(100),
    bio: z.string().max(500).optional(),
    verified: z.boolean(),
    walletAddress: z.string().optional(),
  }),

  /**
   * Creator verification request
   */
  verification: z.object({
    creatorId: z.string().uuid(),
    verificationMethod: z.enum(['email', 'phone', 'identity']),
  }),

  /**
   * Creator payout request
   */
  payout: z.object({
    creatorId: z.string().uuid(),
    amount: z.number().positive(),
    currency: z.enum(['USD', 'EUR', 'XLM']),
    destination: z.string(),
  }),
};

/**
 * Wallet schemas
 */
export const WalletSchemas = {
  /**
   * Wallet info
   */
  wallet: z.object({
    address: z.string(),
    network: z.enum(['testnet', 'mainnet']),
    balance: z.number().nonnegative(),
    currency: z.string(),
  }),

  /**
   * Wallet link request
   */
  linkWallet: z.object({
    publicKey: z.string(),
    network: z.enum(['testnet', 'mainnet']),
  }),
};

/**
 * Combine all schemas into a single export
 */
export const Schemas = {
  Auth: AuthSchemas,
  Payment: PaymentSchemas,
  Creator: CreatorSchemas,
  Wallet: WalletSchemas,
};

/**
 * Type inference helpers for commonly used schemas
 */
export type CreateTipInput = z.infer<typeof PaymentSchemas.createTip>;
export type TransactionDetails = z.infer<typeof PaymentSchemas.transaction>;
export type CreatorProfile = z.infer<typeof CreatorSchemas.profile>;
export type WalletInfo = z.infer<typeof WalletSchemas.wallet>;
