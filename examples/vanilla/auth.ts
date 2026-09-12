/**
 * Authentication Example
 *
 * Demonstrates how to authenticate with Dorisio SDK and manage user sessions.
 */

import { DorisioClient, AuthError } from '../../src';

async function authenticationExample() {
  const client = new DorisioClient({
    baseURL: 'http://localhost:3000',
    timeout: 30000,
  });

  try {
    // 1. User Registration
    console.log('📝 Registering new user...');
    const registerResponse = await client.auth.register({
      email: 'user@example.com',
      password: 'SecurePassword123!',
      name: 'Alice Creator',
    });
    console.log('✅ User registered:', registerResponse);

    // 2. User Login
    console.log('\n🔓 Logging in...');
    const loginResponse = await client.auth.login({
      email: 'user@example.com',
      password: 'SecurePassword123!',
    });
    console.log('✅ Logged in successfully');
    console.log('   Token:', loginResponse.token);
    console.log('   User:', loginResponse.user);

    // 3. Validate Session
    console.log('\n🔍 Validating session...');
    const sessionInfo = await client.auth.validateSession();
    console.log('✅ Session valid:', sessionInfo);

    // 4. Get Current User Profile
    console.log('\n👤 Fetching user profile...');
    const profile = await client.users.getProfile();
    console.log('✅ User profile:', profile);

    // 5. Logout
    console.log('\n🚪 Logging out...');
    await client.auth.logout();
    console.log('✅ Logged out successfully');
  } catch (error) {
    if (error instanceof AuthError) {
      console.error('❌ Authentication error:', error.message);
      console.error('   Status:', error.statusCode);
      console.error('   Code:', error.code);
    } else {
      console.error('❌ Error:', error);
    }
  }
}

// Run the example
authenticationExample().catch(console.error);
