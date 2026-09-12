/**
 * Wallet Linking Example
 *
 * Demonstrates how to link a Stellar wallet to a Dorisio account.
 */

import { DorisioClient, WalletVerificationError } from '../../src';
import * as StellarSdk from '@stellar/stellar-sdk';

async function walletLinkingExample() {
  const client = new DorisioClient({
    baseURL: 'http://localhost:3000',
    timeout: 30000,
  });

  try {
    // 1. Generate a keypair (in production, use hardware wallet)
    console.log('🔐 Generating keypair...');
    const keypair = StellarSdk.Keypair.random();
    const publicKey = keypair.publicKey();
    console.log('✅ Keypair generated');
    console.log('   Public Key:', publicKey);

    // 2. Request verification challenge
    console.log('\n🔗 Requesting wallet challenge...');
    const challenge = await client.auth.requestWalletChallenge();
    console.log('✅ Challenge received:', challenge.challenge);

    // 3. Sign the challenge with the keypair
    console.log('\n✍️  Signing challenge...');
    const transaction = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(publicKey, '0'),
      {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET_NETWORK_PASSPHRASE,
      }
    )
      .addMemo(StellarSdk.Memo.text(challenge.challenge))
      .setTimeout(100)
      .build();

    transaction.sign(keypair);
    const signature = transaction.getKeypairSignature(keypair);
    console.log('✅ Challenge signed');

    // 4. Submit verification
    console.log('\n📤 Submitting wallet verification...');
    const verificationResponse = await client.auth.verifyAndLinkWallet({
      challenge: challenge.challenge,
      signature: signature,
      publicKey: publicKey,
    });
    console.log('✅ Wallet linked successfully');
    console.log('   Status:', verificationResponse.verified);

    // 5. Get wallet info
    console.log('\n💰 Fetching wallet info...');
    const walletInfo = await client.wallet.getBalance();
    console.log('✅ Wallet info:');
    console.log('   Address:', walletInfo.address);
    console.log('   Balance:', walletInfo.balance, walletInfo.currency);
    console.log('   Network:', walletInfo.network);
  } catch (error) {
    if (error instanceof WalletVerificationError) {
      console.error('❌ Wallet verification error:', error.message);
      console.error('   Status:', error.statusCode);
      if (error.challenge) {
        console.error('   Challenge:', error.challenge);
      }
    } else {
      console.error('❌ Error:', error);
    }
  }
}

// Run the example
walletLinkingExample().catch(console.error);
