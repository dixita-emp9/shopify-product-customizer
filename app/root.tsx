import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from 'react-router';

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <Meta />
                <Links />
                <title>Shopify Customizer</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <style>{`body { font-family: 'Inter', sans-serif; }`}</style>
            </head>
            <body className="bg-slate-50 text-slate-900">
                <Outlet />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}