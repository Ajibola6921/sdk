/**
 * Payment Example
 *
 * Demonstrates how to send tips using Dorisio SDK with idempotency support.
 */

import { DorisioClient, PaymentError, Schemas, v4 as uuidv4 } from '../../src';

async function paymentExample() {
  const client = new DorisioClient({
    baseURL: 'http://localhost:3000',
    timeout: 30000,
  });

  try {
    // 1. Validate tip input using exported schemas
    console.log('✅ Using Dorisio schemas for validation...');
    const tipInput = {
      amount: 50,
      currency: 'USD' as const,
      creatorId: '550e8400-e29b-41d4-a716-446655440000',
      message: 'Great content!',
      idempotencyKey: uuidv4(), // Generate unique key per request
    };

    // Validate with Zod schema before sending
    const validated = Schemas.Payment.createTip.parse(tipInput);
    console.log('✅ Input validated:', validated);

    // 2. Send tip (first time)
    console.log('\n💳 Sending tip (attempt 1)...');
    const tipResponse1 = await client.payments.createTip({
      amount: tipInput.amount,
      currency: tipInput.currency,
      creatorId: tipInput.creatorId,
      message: tipInput.message,
      idempotencyKey: tipInput.idempotencyKey, // Use same key for retry
    });
    console.log('✅ Tip sent successfully');
    console.log('   Transaction ID:', tipResponse1.transactionId);
    console.log('   Status:', tipResponse1.status);

    // 3. Retry with same idempotency key (simulating retry on timeout)
    console.log('\n🔄 Retrying with same idempotency key (should return same transaction)...');
    const tipResponse2 = await client.payments.createTip({
      amount: tipInput.amount,
      currency: tipInput.currency,
      creatorId: tipInput.creatorId,
      message: tipInput.message,
      idempotencyKey: tipInput.idempotencyKey, // Same key prevents double-charge
    });
    console.log('✅ Idempotent retry succeeded');
    console.log('   Same transaction ID?', tipResponse1.transactionId === tipResponse2.transactionId);

    // 4. Get transaction history
    console.log('\n📊 Fetching transaction history...');
    const history = await client.payments.getTransactionHistory({
      limit: 10,
    });
    console.log('✅ Transaction history retrieved');
    console.log('   Total transactions:', history.total);
    console.log('   Page:', history.page);
    console.log('   Recent tip:', history.transactions[0]);

    // 5. Get transaction details
    console.log('\n🔍 Fetching transaction details...');
    const transactionDetails = await client.payments.getTransaction(
      tipResponse1.transactionId
    );
    console.log('✅ Transaction details:');
    console.log('   ID:', transactionDetails.id);
    console.log('   Amount:', transactionDetails.amount, transactionDetails.currency);
    console.log('   Status:', transactionDetails.status);
    console.log('   Created:', transactionDetails.createdAt);
  } catch (error) {
    if (error instanceof PaymentError) {
      console.error('❌ Payment error:', error.message);
      console.error('   Status:', error.statusCode);
      if (error.transactionHash) {
        console.error('   Transaction:', error.transactionHash);
      }
    } else {
      console.error('❌ Error:', error);
    }
  }
}

// Run the example
paymentExample().catch(console.error);
