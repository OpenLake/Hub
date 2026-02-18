import { Injectable, Logger } from '@nestjs/common';
import axios, { Method } from 'axios';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  async forward(options: {
    service: string;
    url: string;
    method: Method;
    headers?: any;
    data?: any;
    params?: any;
  }): Promise<{
    step: string;
    status: number;
    data: any;
    headers: Record<string, any>;
  }> {
    const { service, url, method, headers, data, params } = options;

    try {
      this.logger.log(`Proxying ${method} ${url} to ${service}`);

      // Filter headers
      const forwardedHeaders = { ...headers };
      delete forwardedHeaders['host'];
      delete forwardedHeaders['content-length'];
      delete forwardedHeaders['connection'];
      delete forwardedHeaders['accept-encoding'];

      const response = await axios({
        method,
        url,
        data,
        params,
        headers: forwardedHeaders,
        validateStatus: () => true, // Pass through all status codes
      });

      return {
        step: 'proxy_response',
        status: response.status,
        data: response.data,
        headers: response.headers as Record<string, string | number | string[]>,
      };
    } catch (error) {
      this.logger.error(`Proxy error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
