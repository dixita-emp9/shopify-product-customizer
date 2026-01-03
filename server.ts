
import {createRequestHandler} from '@shopify/remix-oxygen';
import * as build from '@remix-run/dev/server-build';

export default {
  async fetch(request: Request, env: any, executionContext: any) {
    // Cast build to any to bypass strict type checking for the ServerBuild object
    const handleRequest = createRequestHandler({
      build: build as any,
      mode: process.env.NODE_ENV,
      getLoadContext: () => ({env, executionContext}),
    });
    // handleRequest expects only 1 argument (the request) when getLoadContext is used
    return handleRequest(request);
  },
};
