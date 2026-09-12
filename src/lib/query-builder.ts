/**
 * Query & Pagination Utilities
 *
 * Build clean queries with filtering, sorting, and pagination.
 */

export interface QueryOptions {
  limit?: number;
  offset?: number;
  cursor?: string;
  sort?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

/**
 * Build query string from options
 */
export function buildQueryString(options: QueryOptions = {}): string {
  const params = new URLSearchParams();

  if (options.limit) {
    params.append('limit', String(options.limit));
  }
  if (options.offset) {
    params.append('offset', String(options.offset));
  }
  if (options.cursor) {
    params.append('cursor', options.cursor);
  }
  if (options.sort) {
    params.append('sort', options.sort);
  }

  // Add filters
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(`filter[${key}]`, String(value));
      }
    });
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

/**
 * Parse pagination metadata from response
 */
export function parsePaginationMeta(response: any): {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
} {
  const page = response.page || 1;
  const pageSize = response.pageSize || response.limit || 20;
  const total = response.total || 0;
  const hasMore = page * pageSize < total;

  return { page, pageSize, total, hasMore };
}

/**
 * List tips with filtering and pagination
 *
 * @example
 * ```ts
 * const results = await listTips(client, {
 *   limit: 10,
 *   filters: { creatorId: 'xxx', status: 'confirmed' },
 * });
 *
 * console.log(results.items); // Array of tips
 * console.log(results.hasMore); // true if more pages exist
 * ```
 */
export async function listTips(
  client: any,
  options: QueryOptions = {}
): Promise<PaginationResult<any>> {
  const query = buildQueryString(options);
  const response = await client.request('GET', `/api/v1/transactions/history${query}`);

  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to fetch tips');
  }

  const { page, pageSize, total, hasMore } = parsePaginationMeta(response.data);
  const offset = options.offset || 0;

  return {
    items: response.data.transactions || [],
    total,
    page,
    pageSize,
    hasMore,
    nextCursor: hasMore ? String(offset + pageSize) : undefined,
    prevCursor: offset > 0 ? String(Math.max(0, offset - pageSize)) : undefined,
  };
}

/**
 * List creator tips with filtering and pagination
 */
export async function listCreatorTips(
  client: any,
  creatorId: string,
  options: QueryOptions = {}
): Promise<PaginationResult<any>> {
  const query = buildQueryString(options);
  const response = await client.request(
    'GET',
    `/api/v1/transactions/creator/${creatorId}${query}`
  );

  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to fetch creator tips');
  }

  const { page, pageSize, total, hasMore } = parsePaginationMeta(response.data);
  const offset = options.offset || 0;

  return {
    items: response.data.transactions || [],
    total,
    page,
    pageSize,
    hasMore,
    nextCursor: hasMore ? String(offset + pageSize) : undefined,
    prevCursor: offset > 0 ? String(Math.max(0, offset - pageSize)) : undefined,
  };
}

/**
 * List creators with filtering and pagination
 */
export async function listCreators(
  client: any,
  options: QueryOptions = {}
): Promise<PaginationResult<any>> {
  const query = buildQueryString(options);
  const response = await client.request('GET', `/api/v1/creators${query}`);

  if (!response.success) {
    throw new Error(response.error?.message || 'Failed to fetch creators');
  }

  const { page, pageSize, total, hasMore } = parsePaginationMeta(response.data);
  const offset = options.offset || 0;

  return {
    items: response.data.creators || [],
    total,
    page,
    pageSize,
    hasMore,
    nextCursor: hasMore ? String(offset + pageSize) : undefined,
    prevCursor: offset > 0 ? String(Math.max(0, offset - pageSize)) : undefined,
  };
}

/**
 * List verified creators
 */
export async function listVerifiedCreators(
  client: any,
  options: QueryOptions = {}
): Promise<PaginationResult<any>> {
  return listCreators(client, {
    ...options,
    filters: { ...options.filters, verified: true },
  });
}

/**
 * Paginate through results manually
 *
 * @example
 * ```ts
 * const paginator = createPaginator(client, 'tips', { limit: 10 });
 *
 * const page1 = await paginator.next();
 * const page2 = await paginator.next();
 * await paginator.previous();
 * ```
 */
export class Paginator<T> {
  private offset = 0;
  private readonly pageSize: number;
  private readonly endpoint: string;
  private readonly client: any;
  private readonly filters?: Record<string, any>;

  constructor(
    client: any,
    endpoint: 'tips' | 'creators' | 'creator-tips',
    options: QueryOptions = {}
  ) {
    this.client = client;
    this.endpoint = endpoint;
    this.pageSize = options.limit || 20;
    this.filters = options.filters;
  }

  /**
   * Fetch next page
   */
  async next(): Promise<PaginationResult<T>> {
    const result = await this.fetchPage();
    if (result.hasMore) {
      this.offset += this.pageSize;
    }
    return result;
  }

  /**
   * Fetch previous page
   */
  async previous(): Promise<PaginationResult<T>> {
    this.offset = Math.max(0, this.offset - this.pageSize);
    return this.fetchPage();
  }

  /**
   * Jump to specific page
   */
  async goto(pageNumber: number): Promise<PaginationResult<T>> {
    this.offset = (pageNumber - 1) * this.pageSize;
    return this.fetchPage();
  }

  /**
   * Reset to first page
   */
  reset(): void {
    this.offset = 0;
  }

  /**
   * Current offset
   */
  getOffset(): number {
    return this.offset;
  }

  /**
   * Fetch current page
   */
  private async fetchPage(): Promise<PaginationResult<T>> {
    const options: QueryOptions = {
      limit: this.pageSize,
      offset: this.offset,
      filters: this.filters,
    };

    if (this.endpoint === 'tips') {
      return listTips(this.client, options) as any;
    } else if (this.endpoint === 'creators') {
      return listCreators(this.client, options) as any;
    } else {
      throw new Error(`Unknown endpoint: ${this.endpoint}`);
    }
  }
}

/**
 * Create a paginator for iterating through results
 */
export function createPaginator<T>(
  client: any,
  endpoint: 'tips' | 'creators' | 'creator-tips',
  options?: QueryOptions
): Paginator<T> {
  return new Paginator(client, endpoint, options);
}
