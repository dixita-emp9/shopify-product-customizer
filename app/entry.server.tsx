import { ServerRouter } from 'react-router';
import type { EntryContext } from '@react-router/node';
import { isbot } from 'isbot';
import { renderToString } from 'react-dom/server';

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    reactRouterContext: EntryContext,
) {
    const html = renderToString(
        <ServerRouter context={reactRouterContext} url={request.url} />
    );

    responseHeaders.set('Content-Type', 'text/html');

    return new Response('<!DOCTYPE html>' + html, {
        headers: responseHeaders,
        status: responseStatusCode,
    });
}