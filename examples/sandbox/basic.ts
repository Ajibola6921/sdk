/**
 * Sandbox Mode - Basic Example
 *
 * Test SDK features without hitting real testnet.
 * Perfect for UI development and integration testing.
 */

import { createSandboxClient } from '../../src/sandbox/sandbox-client';

async function sandboxExample() {
  // Create sandbox client - all responses are mocked
  const client = createSandboxClient({
    latency: 100, // Simulate 100ms network delay
    seed: 42, // Deterministic responses (same seed = same data)
  });

  console.log('🏝️  Dorisio SDK Sandbox Mode Demo\n');

  try {
    // 1. Create a tip (instant, no real transaction)
    console.log('💡 Creating a tip...');
    const tip = await client.payments.createTip({
      creatorId: '550e8400-e29b-41d4-a716-446655440000',
      amount: 50,
      message: 'Great content!',
    });
    console.log('✅ Tip created:', tip.id);
    console.log('   Amount:', tip.amount, tip.currency);
    console.log('   Status:', tip.status);

    // 2. Get transaction history
    console.log('\n📊 Fetching transaction history...');
    const history = await client.payments.getTransactionHistory({
      limit: 5,
    });
    console.log('✅ Retrieved history');
    console.log('   Total transactions:', history.total);
    console.log('   This page:', history.transactions.length);
    history.transactions.slice(0, 2).forEach((tx) => {
      console.log(`   - $${tx.amount} (${tx.status})`);
    });

    // 3. Check transaction status
    console.log('\n🔍 Checking transaction status...');
    const status = await client.payments.getTransaction(tip.id);
    console.log('✅ Transaction status:', status.status);

    // 4. Authenticate
    console.log('\n🔐 Authenticating...');
    const session = await client.auth.login({
      email: 'user@example.com',
      password: 'password123',
    });
    console.log('✅ Logged in');
    console.log('   User:', session.user.name);
    console.log('   Role:', session.user.role);

    // 5. Get creator info
    console.log('\n👤 Fetching creator info...');
    const creator = await client.creators.getCreator(
      '550e8400-e29b-41d4-a716-446655440000'
    );
    console.log('✅ Creator retrieved');
    console.log('   Name:', creator.displayName);
    console.log('   Verified:', creator.verified);
    console.log('   Earnings:', creator.totalEarnings, 'USD');

    // 6. Get wallet info
    console.log('\n💰 Fetching wallet info...');
    const wallet = await client.wallet.getBalance();
    console.log('✅ Wallet retrieved');
    console.log('   Network:', wallet.network);
    console.log('   Balance:', wallet.balance, wallet.currency);

    // 7. Check sandbox config
    console.log('\n⚙️  Sandbox Configuration');
    const config = client.getSandboxConfig();
    console.log('   Latency:', config.latency, 'ms');
    console.log('   Seed:', config.seed);
    console.log('   Error rate:', (config.errorRate * 100).toFixed(1), '%');
    console.log('   Is Sandbox:', config.isSandbox);

    console.log('\n✨ Sandbox mode works perfectly for UI development!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run example
sandboxExample().catch(console.error);
