/**
 * Sandbox Mode - Query & Pagination Example
 *
 * Demonstrates query building, filtering, and pagination utilities.
 */

import {
  createSandboxClient,
  listTips,
  listCreators,
  createPaginator,
  buildQueryString,
} from '../../src';

async function paginationExample() {
  const client = createSandboxClient({
    latency: 50,
    seed: 123,
  });

  console.log('📄 Pagination & Query Utilities Demo\n');

  try {
    // 1. Build custom query string
    console.log('🔨 Building custom query...');
    const query = buildQueryString({
      limit: 10,
      offset: 0,
      sort: 'desc',
      filters: {
        status: 'confirmed',
        minAmount: 10,
      },
    });
    console.log('✅ Query string:', query);

    // 2. List tips with filtering
    console.log('\n💬 Listing tips with filters...');
    const tips = await listTips(client, {
      limit: 5,
      filters: {
        status: 'confirmed',
      },
    });
    console.log(`✅ Found ${tips.total} tips`);
    console.log(`   Showing: ${tips.items.length} items`);
    console.log(`   Has more pages: ${tips.hasMore}`);
    tips.items.slice(0, 2).forEach((tip) => {
      console.log(`   - Tip #${tip.id.substring(0, 8)}: $${tip.amount}`);
    });

    // 3. List creators
    console.log('\n👥 Listing creators...');
    const creators = await listCreators(client, {
      limit: 5,
      filters: {
        verified: true,
      },
    });
    console.log(`✅ Found ${creators.total} creators`);
    creators.items.slice(0, 2).forEach((creator) => {
      console.log(`   - ${creator.displayName} (@${creator.username})`);
    });

    // 4. Use paginator for manual iteration
    console.log('\n📑 Using Paginator for manual navigation...');
    const paginator = createPaginator(client, 'tips', { limit: 3 });

    // Get first page
    console.log('   Fetching page 1...');
    let page = await paginator.next();
    console.log(`   ✅ Page 1: ${page.items.length} items`);

    // Get second page
    if (page.hasMore) {
      console.log('   Fetching page 2...');
      page = await paginator.next();
      console.log(`   ✅ Page 2: ${page.items.length} items`);
    }

    // Go back to first page
    console.log('   Going back to page 1...');
    paginator.reset();
    page = await paginator.next();
    console.log(`   ✅ Back to page 1: ${page.items.length} items`);

    // 5. Jump to specific page
    console.log('\n🚀 Jumping to specific page...');
    paginator.reset();
    page = await paginator.goto(2);
    console.log(`✅ Jumped to page 2: ${page.items.length} items`);

    console.log('\n✨ Pagination utilities make filtering and sorting easy!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run example
paginationExample().catch(console.error);
