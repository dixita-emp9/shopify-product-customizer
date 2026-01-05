import { defineConfig } from '@shopify/hydrogen/config';

export default defineConfig({
    shopify: {
        storeDomain: 'your-actual-store.myshopify.com', // Replace with your real store
        storefrontToken: {
            publicToken: process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
        },
        storefrontApiVersion: '2024-10',
    },
});