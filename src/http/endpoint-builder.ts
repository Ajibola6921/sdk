/**
 * Endpoint Builder
 *
 * Type-safe builder for constructing API endpoint requests.
 */

import { HttpClient, RequestOptions } from './http-client';
import { ResponseNormalizer } from './response-normalizer';
import { ApiResponse } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface EndpointConfig<TRequest = unknown, TResponse = unknown> {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description?: string;
}

export class TypedEndpointBuilder<TRequest = unknown, TResponse = unknown> {
  private config: EndpointConfig<TRequest, TResponse>;
  private httpClient: HttpClient;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(config: EndpointConfig<TRequest, TResponse>, httpClient: HttpClient) {
    this.config = config;
    this.httpClient = httpClient;
  }

  /**
   * Build request options
   */
  private buildRequestOptions(body?: TRequest, options?: Partial<RequestOptions>): RequestOptions {
    return {
      method: this.config.method,
      body: body as Record<string, unknown> | undefined,
      ...options,
    };
  }

  /**
   * Execute request
   */
  async execute(
    body?: TRequest,
    options?: Partial<RequestOptions>
  ): Promise<ApiResponse<TResponse>> {
    const requestOptions = this.buildRequestOptions(body, options);
    return this.httpClient.request<ApiResponse<TResponse>>(this.config.path, requestOptions);
  }

  /**
   * Execute request and extract data
   */
  async executeForData(body?: TRequest, options?: Partial<RequestOptions>): Promise<TResponse> {
    const response = await this.execute(body, options);
    return ResponseNormalizer.extractData(response);
  }

  /**
   * Get endpoint configuration
   */
  getConfig(): Readonly<EndpointConfig<TRequest, TResponse>> {
    return { ...this.config };
  }

  /**
   * Update path (for dynamic parameters)
   */
  withPath(path: string): TypedEndpointBuilder<TRequest, TResponse> {
    return new TypedEndpointBuilder({ ...this.config, path }, this.httpClient);
  }
}

/**
 * Factory for creating typed endpoints
 */
export class EndpointFactory {
  constructor(private httpClient: HttpClient) {}

  /**
   * Create typed endpoint
   */
  createEndpoint<TRequest = unknown, TResponse = unknown>(
    config: EndpointConfig<TRequest, TResponse>
  ): TypedEndpointBuilder<TRequest, TResponse> {
    return new TypedEndpointBuilder(config, this.httpClient);
  }

  /**
   * Create GET endpoint
   */
  createGetEndpoint<TResponse = unknown>(path: string, description?: string) {
    return this.createEndpoint<void, TResponse>({
      path,
      method: 'GET',
      description,
    });
  }

  /**
   * Create POST endpoint
   */
  createPostEndpoint<TRequest = unknown, TResponse = unknown>(path: string, description?: string) {
    return this.createEndpoint<TRequest, TResponse>({
      path,
      method: 'POST',
      description,
    });
  }

  /**
   * Create PUT endpoint
   */
  createPutEndpoint<TRequest = unknown, TResponse = unknown>(path: string, description?: string) {
    return this.createEndpoint<TRequest, TResponse>({
      path,
      method: 'PUT',
      description,
    });
  }

  /**
   * Create PATCH endpoint
   */
  createPatchEndpoint<TRequest = unknown, TResponse = unknown>(path: string, description?: string) {
    return this.createEndpoint<TRequest, TResponse>({
      path,
      method: 'PATCH',
      description,
    });
  }

  /**
   * Create DELETE endpoint
   */
  createDeleteEndpoint<TResponse = unknown>(path: string, description?: string) {
    return this.createEndpoint<void, TResponse>({
      path,
      method: 'DELETE',
      description,
    });
  }
}
