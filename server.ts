import {createRequestHandler} from '@shopify/remix-oxygen';
// @ts-ignore - virtual module handled by react-router
import * as build from 'virtual:react-router/server-build';

export default {
  async fetch(request: Request, env: any, executionContext: any) {
    const handleRequest = createRequestHandler({
      build: build as any,
      mode: process.env.NODE_ENV,
      getLoadContext: () => ({env, executionContext}),
    });
    return handleRequest(request);
  },
};