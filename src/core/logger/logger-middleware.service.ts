import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import http from 'http';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(request: any, response: any, next: (error?: any) => void): any {
    const { body, method, originalUrl } = request;

    let responseBody: string;
    const originalSendFunc = response.send.bind(response);
    response.send = (body: string): Response => {
      responseBody = body;
      return originalSendFunc(body);
    };
    response.on('finish', () => {
      const { statusCode } = response;
      const parsedResponseBody = this.parseResponseBody(responseBody);

      this.logger.log({
        message: `${method} ${originalUrl}`,
        method,
        host: request.headers['host'] ?? null,
        originalUrl,
        body,
        headers: this.parseHeadersToLog(request.headers),
        statusCode,
        responseBody: parsedResponseBody,
        ip: request.ip,
      });
    });

    next();
  }
  private parseResponseBody(body: unknown): string {
    if (typeof body !== 'string') {
      return 'body_cannot_be_parsed';
    }

    try {
      return JSON.parse(body);
    } catch (e) {
      return body;
    }
  }

  private parseHeadersToLog(
    headers: http.IncomingHttpHeaders,
  ): Record<string, string | null> {
    return {
      authorization: headers['authorization'] ?? null,
      accept: headers['accept'] ?? null,
      userAgent: headers['user-agent'] ?? null,
      origin: headers['origin'] ?? null,
    };
  }
}
