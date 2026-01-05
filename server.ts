import type { AppLoadContext } from '@shopify/remix-oxygen';
import { RemixServer } from '@remix-run/react';
import { renderToReadableStream } from 'react-dom/server';

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: any,
    context: AppLoadContext,
) {
    const body = await renderToReadableStream(
        <RemixServer context={ remixContext } url = { request.url } />,
    );

    responseHeaders.set('Content-Type', 'text/html');

    return new Response(body, {
        headers: responseHeaders,
        status: responseStatusCode,
    });
}
