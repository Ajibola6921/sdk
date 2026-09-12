# Sandbox Mode Examples

Test your Dorisio integration without touching the real network. Perfect for UI development, demos, and integration testing.

## What is Sandbox Mode?

Sandbox mode simulates all API responses using deterministic mock data. This means:

✅ **No network calls** - Test offline
✅ **Instant responses** - Optional latency simulation
✅ **Deterministic** - Same seed = same data every time
✅ **No side effects** - Safe to test payment flows
✅ **Full feature parity** - All SDK methods work identically

## Quick Start

```typescript
import { createSandboxClient } from 'dorisio-sdk';

// Create sandbox client instead of real client
const client = createSandboxClient({
  latency: 100, // Optional: simulate 100ms network delay
  seed: 42,     // Optional: deterministic responses
});

// Use exactly like the real client
const tip = await client.payments.createTip({
  creatorId: 'xxx',
  amount: 50,
});

console.log(tip.id); // Real UUID, but mocked
```

## Examples

### 1. Basic Usage (`basic.ts`)

Get started with sandbox mode:

```bash
npx ts-node examples/sandbox/basic.ts
```

Shows:
- Creating tips (instant, no real transaction)
- Fetching transaction history
- Checking transaction status
- Authentication flows
- Creator and wallet info
- Sandbox configuration

### 2. Query & Pagination (`pagination.ts`)

Learn filtering and pagination utilities:

```bash
npx ts-node examples/sandbox/pagination.ts
```

Shows:
- Building custom queries with filters
- Listing and filtering tips
- Listing and filtering creators
- Manual pagination with Paginator class
- Jumping to specific pages
- Cursor-based navigation

## Configuration Options

### Latency

Simulate network delays:

```typescript
const client = createSandboxClient({
  latency: 200, // 200ms delay on each request
});

// Or set dynamically
client.setLatency(500);
```

Set to `0` for instant responses (default when omitted).

### Seed

Generate deterministic mock data:

```typescript
const client = createSandboxClient({
  seed: 42, // Same seed = same responses every time
});

// Same seed → same tip ID, user info, etc.
const tip = await client.payments.createTip({ /* ... */ });
// Repeatable for screenshots, demos, tests
```

Change seed dynamically:

```typescript
client.setSeed(100); // New seed = different data
```

### Error Simulation

Test error handling:

```typescript
const client = createSandboxClient({
  errorRate: 0.2, // 20% of requests fail randomly
});

client.setErrorRate(0.5); // Change to 50% failure rate
```

Perfect for testing:
- Retry logic
- Error boundaries
- Loading states
- Fallback UI

## Use Cases

### 1. UI Development

Build and test components before backend is ready:

```typescript
// src/components/TipButton.tsx
const client = process.env.NODE_ENV === 'development'
  ? createSandboxClient() // During dev
  : new DorisioClient();   // In production

function TipButton() {
  const { createTip, loading, error } = useCreateTip();
  // Your component code...
}
```

### 2. Integration Testing

Test your integration without network calls:

```typescript
// tests/tip-flow.test.ts
test('creating a tip works', async () => {
  const client = createSandboxClient({ seed: 42 });
  
  const tip = await client.payments.createTip({
    creatorId: 'xxx',
    amount: 50,
  });
  
  expect(tip.id).toBeDefined();
  expect(tip.status).toBe('pending');
});
```

### 3. Demo & Presentation

Show off the SDK in a live demo:

```typescript
// Generate reproducible data
const client = createSandboxClient({
  seed: 12345,    // Same data every time
  latency: 200,   // Realistic feel
  errorRate: 0,   // No surprises
});

// Walk through payment flow confidently
```

### 4. Onboarding & Documentation

Help new integrators get started:

```typescript
// Every developer can run this without setup
const client = createSandboxClient();

// Works immediately - no API keys, servers, or setup
await client.payments.createTip({ /* ... */ });
```

## Query Utilities

### List Tips

```typescript
import { listTips } from 'dorisio-sdk';

const results = await listTips(client, {
  limit: 20,
  offset: 0,
  filters: {
    status: 'confirmed',
    creatorId: 'xxx',
  },
});

console.log(results.items);     // Array of tips
console.log(results.total);     // Total count
console.log(results.hasMore);   // Are there more pages?
console.log(results.nextCursor); // Cursor for next page
```

### List Creators

```typescript
import { listCreators, listVerifiedCreators } from 'dorisio-sdk';

// All creators
const allCreators = await listCreators(client, { limit: 50 });

// Only verified
const verified = await listVerifiedCreators(client, { limit: 50 });
```

### Paginator Class

```typescript
import { createPaginator } from 'dorisio-sdk';

const paginator = createPaginator(client, 'tips', { limit: 10 });

// Next page
const page1 = await paginator.next();

// Previous page
const previous = await paginator.previous();

// Jump to page
const page5 = await paginator.goto(5);

// Reset to first page
paginator.reset();
const firstPage = await paginator.next();
```

## Testing Error Handling

```typescript
const client = createSandboxClient({
  errorRate: 0.3, // 30% of requests fail
});

try {
  await client.payments.createTip({ /* ... */ });
} catch (error) {
  // Test error UI, retry logic, etc.
  console.log('Request failed (expected in sandbox)');
}
```

## Switching to Production

When ready to go live, just switch the client:

```typescript
// During development
const client = createSandboxClient();

// In production
const client = new DorisioClient({
  baseURL: 'https://api.dorisio.com',
  token: process.env.DORISIO_TOKEN,
});

// Everything else stays the same!
```

## Tips

1. **Use seeds for reproducible demos** - Same seed = same data every time
2. **Disable latency for tests** - Set `latency: 0` in automated tests
3. **Enable latency for demos** - Set `latency: 200+` to feel realistic
4. **Test error handling** - Use `errorRate` to verify error UI works
5. **Deterministic tests** - Always use a fixed seed for reproducible tests

## Learn More

- See [basic.ts](./basic.ts) for quick start
- See [pagination.ts](./pagination.ts) for queries and filtering
- Check main [README](../../README.md) for full SDK documentation
