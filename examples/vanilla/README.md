# Dorisio SDK - Vanilla JavaScript Examples

Simple, runnable examples for integrating Dorisio SDK in vanilla JavaScript/TypeScript applications.

## Examples

### 1. Authentication (`auth.ts`)

Learn how to:
- Register a new user
- Login with email/password
- Validate sessions
- Get user profile
- Logout

**Run:**
```bash
npx ts-node examples/vanilla/auth.ts
```

### 2. Wallet Linking (`wallet.ts`)

Learn how to:
- Generate Stellar keypairs
- Request verification challenges
- Sign challenges with your wallet
- Link wallets to accounts
- Get wallet balance

**Run:**
```bash
npx ts-node examples/vanilla/wallet.ts
```

### 3. Payments (`payment.ts`)

Learn how to:
- Send tips to creators
- Use idempotency keys for safe retries
- Validate inputs with exported Zod schemas
- Get transaction history
- Check transaction details

**Run:**
```bash
npx ts-node examples/vanilla/payment.ts
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the SDK baseURL in each example (default: `http://localhost:3000`)

3. Run any example:
```bash
npx ts-node examples/vanilla/auth.ts
```

## Key Features Demonstrated

- ✅ Type-safe client with TypeScript
- ✅ Domain-specific error handling
- ✅ Input validation with Zod schemas
- ✅ Idempotency for payment safety
- ✅ Proper async/await patterns
- ✅ Error recovery strategies

## Production Checklist

Before going to production:

- [ ] Store credentials securely (never hardcode)
- [ ] Use environment variables for API URLs
- [ ] Implement proper error logging
- [ ] Add retry logic with exponential backoff
- [ ] Use production network (mainnet for Stellar)
- [ ] Enable webhook signature verification
- [ ] Test with small transactions first
