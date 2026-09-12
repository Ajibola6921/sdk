# Dorisio SDK - React Examples

Production-ready React components demonstrating Dorisio SDK integration.

## Components

### 1. CreateTip Component (`CreateTip.tsx`)

A complete form component for sending tips to creators.

**Features:**
- Input validation using exported Zod schemas
- Idempotency key support for safe retries
- Loading and error states
- Success feedback
- Character counter for message field

**Usage:**
```tsx
import { CreateTipComponent } from './examples/react/CreateTip';
import { DorisioProvider } from 'dorisio-sdk/react';

export function App() {
  return (
    <DorisioProvider config={{ baseURL: 'http://localhost:3000' }}>
      <CreateTipComponent
        creatorId="550e8400-e29b-41d4-a716-446655440000"
        onSuccess={(txId) => console.log('Tip sent:', txId)}
        onError={(error) => console.error('Failed:', error)}
      />
    </DorisioProvider>
  );
}
```

### 2. WalletStatus Component (`WalletStatus.tsx`)

Display connected wallet balance and network information.

**Features:**
- Real-time wallet balance display
- Network indicator (testnet/mainnet)
- Manual refresh button
- Error handling for unlinked wallets
- Loading state

**Usage:**
```tsx
import { WalletStatus } from './examples/react/WalletStatus';
import { DorisioProvider } from 'dorisio-sdk/react';

export function DashboardPage() {
  return (
    <DorisioProvider config={{ baseURL: 'http://localhost:3000' }}>
      <WalletStatus />
    </DorisioProvider>
  );
}
```

## Hooks Used

### `useCreateTip()`
Send tips with validation and idempotency support.

```tsx
const { createTip, loading, error, data } = useCreateTip();

const result = await createTip({
  amount: 50,
  currency: 'USD',
  creatorId: 'xxx',
  idempotencyKey: uuidv4(),
});
```

### `useWallet()`
Fetch and display wallet information.

```tsx
const { wallet, loading, error, refetch } = useWallet();

console.log(wallet?.balance); // Current balance
refetch?.(); // Manually refresh
```

## Setup

1. Install SDK:
```bash
npm install dorisio-sdk
```

2. Wrap your app with DorisioProvider:
```tsx
import { DorisioProvider } from 'dorisio-sdk/react';

export function App() {
  return (
    <DorisioProvider
      config={{
        baseURL: process.env.REACT_APP_API_URL,
        timeout: 30000,
      }}
    >
      {/* Your components */}
    </DorisioProvider>
  );
}
```

3. Use the components:
```tsx
<CreateTipComponent creatorId="..." />
<WalletStatus />
```

## Best Practices

- ✅ Validate inputs with exported Schemas before submission
- ✅ Use unique idempotency keys for each payment attempt
- ✅ Handle domain-specific errors (PaymentError, WalletVerificationError)
- ✅ Show loading states during operations
- ✅ Implement refresh/retry UI patterns
- ✅ Use environment variables for API URLs
- ✅ Log errors for debugging
- ✅ Test with small amounts first

## Environment Variables

```bash
REACT_APP_API_URL=http://localhost:3000
REACT_APP_STELLAR_NETWORK=testnet
```

## TypeScript Support

All components are fully typed and use TypeScript by default. Use them in your TSX files:

```tsx
import { CreateTipComponent } from './examples/react/CreateTip';
import type { CreateTipFormProps } from './examples/react/CreateTip';
```
