
import { Product, Addon, CustomizationData } from '../types';
import { MOCK_PRODUCTS, MOCK_ADDONS } from '../constants';

/**
 * IMPORTANT: Replace these with your actual Shopify store credentials to enable live sync.
 * To obtain these:
 * 1. Go to Shopify Admin > Settings > Apps and sales channels > Develop apps.
 * 2. Create an app and enable 'Storefront API' scopes.
 * 3. Use the 'Storefront access token'.
 */
const SHOPIFY_STORE_DOMAIN = 'your-store-name.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'your_public_storefront_access_token';

async function shopifyFetch({ query, variables = {} }: { query: string; variables?: any }) {
  // If the credentials are placeholders, we return null to trigger fallback
  if (SHOPIFY_STORE_DOMAIN.includes('your-store-name') || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.warn('Shopify credentials not configured. Falling back to mock data.');
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

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.errors) {
      console.error('Shopify API Errors:', result.errors);
      throw new Error('Shopify API error');
    }
    return result.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    // Return null to allow calling functions to handle the fallback
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

export const fetchAddonsByCategory = async (category: string): Promise<Addon[]> => {
  const query = `
    query getAddons($query: String!) {
      products(first: 50, query: $query) {
        edges {
          node {
            id
            title
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                  }
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({ 
    query, 
    variables: { query: `tag:addon AND tag:${category}` } 
  });

  if (!data || !data.products) {
    return MOCK_ADDONS.filter(a => a.category === category);
  }

  return data.products.edges.map((edge: any) => {
    const node = edge.node;
    const variant = node.variants.edges[0]?.node;
    return {
      id: node.id,
      productId: node.id,
      variantId: variant?.id,
      category: category as any,
      title: node.title,
      imageUrl: variant?.image?.url || '',
      price: parseFloat(variant?.price?.amount || '0')
    };
  });
};

export const addToCart = async (customization: CustomizationData): Promise<string> => {
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
  
  const lines = [
    {
      merchandiseId: customization.selectedVariantId,
      quantity: 1,
      attributes: [
        { key: '_bundleId', value: bundleId },
        { key: 'Customization Data', value: JSON.stringify(customization.elements) },
        { key: 'Personalization Type', value: customization.personalizationType }
      ]
    }
  ];

  customization.elements.forEach(el => {
    if (el.type === 'addon' && el.addon) {
      lines.push({
        merchandiseId: el.addon.variantId,
        quantity: 1,
        attributes: [
          { key: '_bundleId', value: bundleId },
          { key: '_parentProduct', value: customization.baseProduct.title }
        ]
      });
    }
  });

  const variables = {
    input: {
      lines
    }
  };

  const data = await shopifyFetch({ query: mutation, variables });
  
  // If API fails or is not configured, we return a fake checkout URL for testing
  if (!data || !data.cartCreate) {
    console.warn('Checkout failed or API not configured. Returning mock checkout URL.');
    return 'https://checkout.shopify.com/mock-checkout-url';
  }

  if (data.cartCreate.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart.checkoutUrl;
};
