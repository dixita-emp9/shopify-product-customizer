
import {createRequestHandler} from '@shopify/remix-oxygen';
import * as build from '@remix-run/dev/server-build';

export default {
  async fetch(request: Request, env: any, executionContext: any) {
    const handleRequest = createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
    });
    return handleRequest(request, {env, executionContext});
  },
};
