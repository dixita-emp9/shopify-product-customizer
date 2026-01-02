
import { Product, Addon, CustomizationData } from '../types';
import { MOCK_PRODUCTS, MOCK_ADDONS } from '../constants';

/**
 * CONFIGURATION: 
 * Set these values to connect your live Shopify store.
 * If left as placeholders, the app automatically uses high-quality mock data.
 */
const SHOPIFY_STORE_DOMAIN = 'your-store-name.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = ''; // e.g., 'shpat_...'

/**
 * Helper to check if the app is connected to a real Shopify instance.
 */
export const isShopifyConnected = () => {
  return (
    SHOPIFY_STORE_DOMAIN && 
    !SHOPIFY_STORE_DOMAIN.includes('your-store-name') && 
    SHOPIFY_STOREFRONT_ACCESS_TOKEN.length > 0
  );
};

async function shopifyFetch({ query, variables = {} }: { query: string; variables?: any }) {
  if (!isShopifyConnected()) {
    // Silently return null to allow fallback without throwing 'Failed to fetch'
    return null;
  }

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    // Only log if we actually expected a successful connection
    if (isShopifyConnected()) {
      console.error('Shopify Fetch Error:', error);
    }
    return null;
  }
}

export const fetchShopifyProducts = async (): Promise<Product[]> => {
  const query = `
    query getProducts {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                  }
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ query });
  
  if (!data || !data.products) {
    return MOCK_PRODUCTS;
  }

  return data.products.edges.map((edge: any) => {
    const node = edge.node;
    const firstVariant = node.variants.edges[0]?.node;
    
    return {
      id: node.id,
      variantId: firstVariant?.id || '',
      title: node.title,
      handle: node.handle,
      price: parseFloat(firstVariant?.price?.amount || '0'),
      currency: firstVariant?.price?.currencyCode || 'USD',
      imageUrl: node.images.edges[0]?.node?.url || '',
      description: node.description,
      variants: node.variants.edges.map((vEdge: any) => ({
        id: vEdge.node.id,
        title: vEdge.node.title,
        imageUrl: vEdge.node.image?.url || node.images.edges[0]?.node?.url,
        color: vEdge.node.title.toLowerCase()
      }))
    };
  });
};

export const addToCart = async (customization: CustomizationData): Promise<string> => {
  if (!isShopifyConnected()) {
    return 'https://checkout.shopify.com/mock-checkout-url';
  }

  const mutation = `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const bundleId = `bundle_${Date.now()}`;
  const lines = [{
    merchandiseId: customization.selectedVariantId,
    quantity: 1,
    attributes: [
      { key: '_bundleId', value: bundleId },
      { key: 'Customization', value: 'See Admin App' }
    ]
  }];

  const data = await shopifyFetch({ query: mutation, variables: { input: { lines } } });
  
  if (!data || !data.cartCreate) {
    return 'https://checkout.shopify.com/mock-checkout-url';
  }

  return data.cartCreate.cart.checkoutUrl;
};
