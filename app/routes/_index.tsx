
import {useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import React, {Suspense} from 'react';
import App from '../../App';
import {fetchShopifyProducts, fetchShopifyAddons} from '../../services/shopifyService';
import {AddonCategory} from '../../types';

export async function loader({context}: LoaderFunctionArgs) {
  // Fetch data in parallel on the server
  const [products, letterAddons, patchAddons] = await Promise.all([
    fetchShopifyProducts(),
    fetchShopifyAddons('letters', AddonCategory.LETTERS),
    fetchShopifyAddons('patches', AddonCategory.PATCHES),
  ]);

  return json({
    products,
    letterAddons,
    patchAddons,
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  
  // Guard for Konva browser-only dependencies
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <App 
      initialProducts={data.products} 
      initialLetterAddons={data.letterAddons} 
      initialPatchAddons={data.patchAddons} 
    />
  );
}
