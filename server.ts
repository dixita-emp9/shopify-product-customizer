import type { AppLoadContext } from '@shopify/remix-oxygen';
import { RemixServer } from '@remix-run/react';
import { renderToReadableStream } from 'react-dom/server';
// Fix: Import React to use React.createElement in a non-JSX (.ts) file
import React from 'react';

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: any,
    context: AppLoadContext,
) {
    // Fix: Use React.createElement instead of JSX syntax which is not allowed in .ts files
    const body = await renderToReadableStream(
        React.createElement(RemixServer, { context: remixContext, url: request.url }),
    );

    responseHeaders.set('Content-Type', 'text/html');

    return new Response(body, {
        headers: responseHeaders,
        status: responseStatusCode,
    });
}