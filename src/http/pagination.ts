/**
 * Pagination Utilities
 *
 * Helpers for handling paginated API responses.
 */

import { PaginationMeta } from '../types';

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export class PaginationHelper {
  /**
   * Build query parameters for pagination
   */
  static buildQueryParams(options?: PaginationOptions): Record<string, string | number> {
    return {
      page: options?.page ?? 1,
      pageSize: options?.pageSize ?? 20,
    };
  }

  /**
   * Build query string for pagination
   */
  static buildQueryString(options?: PaginationOptions): string {
    const params = this.buildQueryParams(options);
    return new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
  }

  /**
   * Calculate total pages
   */
  static calculateTotalPages(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  }

  /**
   * Check if there are more pages
   */
  static hasNextPage(meta: PaginationMeta): boolean {
    return meta.page < meta.totalPages;
  }

  /**
   * Check if there is a previous page
   */
  static hasPreviousPage(meta: PaginationMeta): boolean {
    return meta.page > 1;
  }

  /**
   * Get next page number
   */
  static getNextPageNumber(meta: PaginationMeta): number | null {
    return this.hasNextPage(meta) ? meta.page + 1 : null;
  }

  /**
   * Get previous page number
   */
  static getPreviousPageNumber(meta: PaginationMeta): number | null {
    return this.hasPreviousPage(meta) ? meta.page - 1 : null;
  }

  /**
   * Validate pagination options
   */
  static validate(options: PaginationOptions): void {
    if (options.page !== undefined && options.page < 1) {
      throw new Error('Page must be >= 1');
    }

    if (options.pageSize !== undefined && options.pageSize < 1) {
      throw new Error('PageSize must be >= 1');
    }
  }
}
