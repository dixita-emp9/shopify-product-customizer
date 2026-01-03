
import { Product, Addon, AddonCategory, CustomizationData } from '../types';
import { MOCK_PRODUCTS, MOCK_ADDONS } from '../constants';

/**
 * CONFIGURATION: 
 * Set these values to connect your live Shopify store.
 */
const SHOPIFY_STORE_DOMAIN: string = 'thehappytribe.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN: string = '6765755d3621848f5e51817e0b265309'; 
const API_VERSION = '2024-04';

export const isShopifyConnected = () => {
  const isDefault = SHOPIFY_STORE_DOMAIN === 'your-store-name.myshopify.com';
  const hasToken = SHOPIFY_STOREFRONT_ACCESS_TOKEN && SHOPIFY_STOREFRONT_ACCESS_TOKEN.length > 10;
  return !isDefault && !!SHOPIFY_STORE_DOMAIN && hasToken;
};

const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_COLLECTION_QUERY = `
  query getCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) {
        edges {
          node {
            id
            title
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
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function shopifyFetch({ query, variables = {} }: { query: string; variables?: any }) {
  if (!isShopifyConnected()) return null;

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    // Fix: Cast result to any to fix type 'unknown' errors on properties errors and data
    const result = (await response.json()) as any;
    if (result.errors) console.error('Shopify GraphQL Errors:', result.errors);
    if (!response.ok) return null;
    return result.data || null;
  } catch (error) {
    console.error('Shopify API Fetch Error:', error);
    return null;
  }
}

export const fetchShopifyProducts = async (): Promise<Product[]> => {
  try {
    const data = await shopifyFetch({ query: GET_PRODUCTS_QUERY, variables: { first: 50 } });
    if (!data?.products) return MOCK_PRODUCTS;

    return data.products.edges.map((edge: any) => {
      const node = edge.node;
      const variants = node.variants.edges.map((vEdge: any) => vEdge.node);
      const firstVariant = variants.find((v: any) => v.availableForSale) || variants[0];
      const mainImageUrl = node.images.edges[0]?.node?.url || (firstVariant?.image?.url || '');
      
      return {
        id: node.id,
        variantId: firstVariant?.id || '',
        title: node.title,
        handle: node.handle,
        price: parseFloat(firstVariant?.price?.amount || '0'),
        currency: firstVariant?.price?.currencyCode || 'AED',
        imageUrl: mainImageUrl,
        description: node.description,
        variants: variants.map((v: any) => ({
          id: v.id,
          title: v.title,
          imageUrl: v.image?.url || mainImageUrl,
          color: v.selectedOptions.find((o: any) => ['color', 'colour', 'style'].includes(o.name.toLowerCase()))?.value || '#000000'
        }))
      };
    });
  } catch (e) {
    return MOCK_PRODUCTS;
  }
};

export const fetchShopifyAddons = async (collectionHandle: string, category: AddonCategory): Promise<Addon[]> => {
  try {
    const data = await shopifyFetch({ 
      query: GET_COLLECTION_QUERY, 
      variables: { handle: collectionHandle, first: 100 } 
    });
    
    if (!data?.collection?.products) {
      return MOCK_ADDONS.filter(a => a.category === category);
    }

    const addons: Addon[] = [];
    data.collection.products.edges.forEach((edge: any) => {
      const node = edge.node;
      node.variants.edges.forEach((vEdge: any) => {
        const v = vEdge.node;
        const colorOption = v.selectedOptions.find((o: any) => ['color', 'colour'].includes(o.name.toLowerCase()));
        const letterOption = v.selectedOptions.find((o: any) => o.name.toLowerCase() === 'letter');
        
        addons.push({
          id: v.id,
          productId: node.id,
          variantId: v.id,
          category: category,
          title: v.title === 'Default Title' ? node.title : `${node.title} - ${v.title}`,
          imageUrl: v.image?.url || '',
          price: parseFloat(v.price.amount),
          colorName: colorOption?.value,
          letter: letterOption?.value || node.title.charAt(0).toUpperCase(),
          baseColorGroup: colorOption?.value
        });
      });
    });

    return addons;
  } catch (e) {
    return MOCK_ADDONS.filter(a => a.category === category);
  }
};

export const addToCart = async (customization: CustomizationData): Promise<string> => {
  if (!isShopifyConnected()) return 'https://checkout.shopify.com/mock-checkout-url';

  const mutation = `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart { id checkoutUrl }
        userErrors { field message }
      }
    }
  `;

  const essentialElements = customization.elements.map(el => ({
    t: el.type,
    txt: el.text || '',
    aid: el.addon?.id || '',
    pos: el.position,
    rot: el.rotation
  }));

  const lines = [{
    merchandiseId: customization.selectedVariantId,
    quantity: 1,
    attributes: [
      { key: '_customization_json', value: JSON.stringify(essentialElements) },
      { key: 'Personalization Mode', value: customization.personalizationType }
    ]
  }];

  try {
    const data = await shopifyFetch({ query: mutation, variables: { input: { lines } } });
    if (data?.cartCreate?.cart?.checkoutUrl) return data.cartCreate.cart.checkoutUrl;
  } catch (error) {
    console.error('Error during addToCart:', error);
  }
  return 'https://checkout.shopify.com/mock-checkout-url';
};
