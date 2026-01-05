import { jsx, jsxs } from "react/jsx-runtime";
import { ServerRouter, UNSAFE_withComponentProps, Meta, Links, Outlet, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import * as ReactDOMServer from "react-dom/server";
import { useState, useEffect } from "react";
import { ChevronDown, Check, ChevronLeft, ImageIcon, Sparkles, Trash, Trash2, CheckCircle2, Zap } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
async function handleRequest(request, responseStatusCode, responseHeaders, reactRouterContext) {
  const body = await ReactDOMServer.renderToReadableStream(
    /* @__PURE__ */ jsx(ServerRouter, { context: reactRouterContext, url: request.url }),
    {
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      }
    }
  );
  if (isbot(request.headers.get("user-agent"))) {
    await body.allReady;
  }
  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width,initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {}), /* @__PURE__ */ jsx("title", {
        children: "Shopify Customizer"
      }), /* @__PURE__ */ jsx("script", {
        src: "https://cdn.tailwindcss.com"
      }), /* @__PURE__ */ jsx("link", {
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
        rel: "stylesheet"
      }), /* @__PURE__ */ jsx("style", {
        children: `body { font-family: 'Inter', sans-serif; }`
      })]
    }), /* @__PURE__ */ jsxs("body", {
      className: "bg-slate-50 text-slate-900",
      children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
var AddonCategory = /* @__PURE__ */ ((AddonCategory2) => {
  AddonCategory2["EMBROIDERY"] = "embroidery";
  AddonCategory2["LETTERS"] = "letters";
  AddonCategory2["PATCHES"] = "patches";
  AddonCategory2["VINYL"] = "vinyl";
  return AddonCategory2;
})(AddonCategory || {});
const MOCK_PRODUCTS = [
  {
    id: "gid://shopify/Product/1",
    variantId: "gid://shopify/ProductVariant/101",
    title: "SPECIAL EDITION Personalised Pouch - Medium",
    handle: "personalised-pouch-medium",
    price: 130,
    currency: "AED",
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1200",
    description: "A versatile and stylish pouch perfect for organizing your essentials with a personal touch.",
    material: "Nylon & Gold-tone hardware",
    dimensions: "H 12cm x W 19cm x D 5cm",
    variants: [
      { id: "v1", title: "Pink Safari", color: "#ffb6c1", imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1200" },
      { id: "v2", title: "Black Onyx", color: "#000000", imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1200" },
      { id: "v3", title: "Royal Navy", color: "#000080", imageUrl: "https://images.unsplash.com/photo-1544816153-12ad5d7133a2?auto=format&fit=crop&q=80&w=1200" }
    ]
  },
  {
    id: "gid://shopify/Product/2",
    variantId: "gid://shopify/ProductVariant/202",
    title: "Luxury Canvas Tote - Large",
    handle: "luxury-canvas-tote",
    price: 245,
    currency: "AED",
    imageUrl: "https://images.unsplash.com/photo-1544816153-12ad5d7133a2?auto=format&fit=crop&q=80&w=1200",
    description: "Durable and spacious tote bag made from premium heavyweight canvas.",
    material: "Heavyweight Canvas & Leather straps",
    dimensions: "H 35cm x W 45cm x D 15cm",
    variants: [
      { id: "v4", title: "Natural", color: "#f5f5dc", imageUrl: "https://images.unsplash.com/photo-1544816153-12ad5d7133a2?auto=format&fit=crop&q=80&w=1200" },
      { id: "v5", title: "Black", color: "#000000", imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1200" }
    ]
  }
];
const LETTER_COLORS = [
  "White",
  "Cream",
  "Lemon",
  "Brown",
  "Baby Pink",
  "Rose Pink",
  "Neon Pink",
  "Fuchsia",
  "Lilac",
  "Purple",
  "Turquoise",
  "Baby Blue",
  "Neon Green",
  "Green",
  "Royal Blue",
  "Navy Blue",
  "Black",
  "Yellow",
  "Pastel Orange",
  "Orange",
  "Red"
];
const MOCK_ADDONS = [
  ...LETTER_COLORS.map((color, index) => ({
    id: `letter_base_${color}`,
    productId: `gid://shopify/Product/700${index}`,
    variantId: `gid://shopify/ProductVariant/7000${index}`,
    category: AddonCategory.LETTERS,
    title: `${color} Letter`,
    colorName: color,
    letter: "A",
    imageUrl: `https://api.dicebear.com/7.x/initials/svg?seed=A&backgroundColor=${getColorHex(color)}&fontSize=60`,
    price: 8,
    baseColorGroup: color
  })),
  {
    id: "patch_base_1",
    productId: "gid://shopify/Product/801",
    variantId: "gid://shopify/ProductVariant/8010",
    category: AddonCategory.PATCHES,
    title: "Retro Rocket",
    colorName: "Original",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/1043/1043444.png",
    price: 15
  },
  {
    id: "patch_base_2",
    productId: "gid://shopify/Product/802",
    variantId: "gid://shopify/ProductVariant/8020",
    category: AddonCategory.PATCHES,
    title: "Peace Sign",
    colorName: "Original",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/1044/1044237.png",
    price: 12
  },
  {
    id: "patch_base_3",
    productId: "gid://shopify/Product/803",
    variantId: "gid://shopify/ProductVariant/8030",
    category: AddonCategory.PATCHES,
    title: "Smiley Face",
    colorName: "Yellow",
    imageUrl: "https://cdn-icons-png.flaticon.com/512/742/742751.png",
    price: 10
  }
];
const EMBROIDERY_FONTS = [
  { id: "Lucida", name: "Lucida", family: "cursive" },
  { id: "Monotype", name: "Monotype", family: "serif" },
  { id: "Bianca", name: "Bianca", family: "Georgia" },
  { id: "Zachary", name: "Zachary", family: "Times New Roman" },
  { id: "Playball", name: "Playball", family: "cursive" }
];
const EMBROIDERY_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Red", hex: "#FF0000" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Purple", hex: "#800080" },
  { name: "Green", hex: "#008000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Neon Yellow", hex: "#CCFF00" },
  { name: "Orange", hex: "#FFA500" }
];
function getColorHex(name) {
  const map = {
    "White": "ffffff",
    "Cream": "f5f5dc",
    "Lemon": "fff44f",
    "Brown": "964b00",
    "Baby Pink": "f4c2c2",
    "Rose Pink": "ff66cc",
    "Neon Pink": "ff6ec7",
    "Fuchsia": "ff00ff",
    "Lilac": "c8a2c8",
    "Purple": "800080",
    "Turquoise": "40e0d0",
    "Baby Blue": "89cff0",
    "Neon Green": "39ff14",
    "Green": "008000",
    "Royal Blue": "4169e1",
    "Navy Blue": "000080",
    "Black": "000000",
    "Yellow": "ffff00",
    "Pastel Orange": "ffb347",
    "Orange": "ffa500",
    "Red": "ff0000"
  };
  return map[name] || "cccccc";
}
const SHOPIFY_STORE_DOMAIN = "thehappytribe.myshopify.com";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = "6765755d3621848f5e51817e0b265309";
const API_VERSION = "2024-04";
const isShopifyConnected = () => {
  const hasToken = SHOPIFY_STOREFRONT_ACCESS_TOKEN.length > 10;
  return hasToken;
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
async function shopifyFetch({ query, variables = {} }) {
  if (!isShopifyConnected()) return null;
  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN
      },
      body: JSON.stringify({ query, variables })
    });
    const result = await response.json();
    if (result.errors) console.error("Shopify GraphQL Errors:", result.errors);
    if (!response.ok) return null;
    return result.data || null;
  } catch (error) {
    if (isShopifyConnected()) console.error("Shopify Network Error:", error);
    return null;
  }
}
const fetchShopifyProducts = async () => {
  const data = await shopifyFetch({ query: GET_PRODUCTS_QUERY, variables: { first: 50 } });
  if (!(data == null ? void 0 : data.products)) return MOCK_PRODUCTS;
  return data.products.edges.map((edge) => {
    var _a, _b, _c, _d, _e;
    const node = edge.node;
    const variants = node.variants.edges.map((vEdge) => vEdge.node);
    const firstVariant = variants.find((v) => v.availableForSale) || variants[0];
    const mainImageUrl = ((_b = (_a = node.images.edges[0]) == null ? void 0 : _a.node) == null ? void 0 : _b.url) || (((_c = firstVariant == null ? void 0 : firstVariant.image) == null ? void 0 : _c.url) || "");
    return {
      id: node.id,
      variantId: (firstVariant == null ? void 0 : firstVariant.id) || "",
      title: node.title,
      handle: node.handle,
      price: parseFloat(((_d = firstVariant == null ? void 0 : firstVariant.price) == null ? void 0 : _d.amount) || "0"),
      currency: ((_e = firstVariant == null ? void 0 : firstVariant.price) == null ? void 0 : _e.currencyCode) || "AED",
      imageUrl: mainImageUrl,
      description: node.description,
      variants: variants.map((v) => {
        var _a2, _b2;
        return {
          id: v.id,
          title: v.title,
          imageUrl: ((_a2 = v.image) == null ? void 0 : _a2.url) || mainImageUrl,
          color: ((_b2 = v.selectedOptions.find((o) => ["color", "colour", "style"].includes(o.name.toLowerCase()))) == null ? void 0 : _b2.value) || "#000000"
        };
      })
    };
  });
};
const fetchShopifyAddons = async (collectionHandle, category) => {
  var _a;
  const data = await shopifyFetch({
    query: GET_COLLECTION_QUERY,
    variables: { handle: collectionHandle, first: 100 }
  });
  if (!((_a = data == null ? void 0 : data.collection) == null ? void 0 : _a.products)) {
    console.warn(`No addons found for collection: ${collectionHandle}, using partial mock fallback.`);
    return MOCK_ADDONS.filter((a) => a.category === category);
  }
  const addons = [];
  data.collection.products.edges.forEach((edge) => {
    const node = edge.node;
    node.variants.edges.forEach((vEdge) => {
      var _a2;
      const v = vEdge.node;
      const colorOption = v.selectedOptions.find((o) => ["color", "colour"].includes(o.name.toLowerCase()));
      const letterOption = v.selectedOptions.find((o) => o.name.toLowerCase() === "letter");
      addons.push({
        id: v.id,
        productId: node.id,
        variantId: v.id,
        category,
        title: v.title === "Default Title" ? node.title : `${node.title} - ${v.title}`,
        imageUrl: ((_a2 = v.image) == null ? void 0 : _a2.url) || "",
        price: parseFloat(v.price.amount),
        colorName: colorOption == null ? void 0 : colorOption.value,
        letter: (letterOption == null ? void 0 : letterOption.value) || node.title.charAt(0).toUpperCase(),
        baseColorGroup: colorOption == null ? void 0 : colorOption.value
      });
    });
  });
  return addons;
};
const addToCart = async (customization) => {
  var _a, _b;
  if (!isShopifyConnected()) return "https://checkout.shopify.com/mock-checkout-url";
  const mutation = `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart { id checkoutUrl }
        userErrors { field message }
      }
    }
  `;
  const essentialElements = customization.elements.map((el) => {
    var _a2;
    return {
      t: el.type,
      txt: el.text || "",
      aid: ((_a2 = el.addon) == null ? void 0 : _a2.id) || "",
      pos: el.position,
      rot: el.rotation
    };
  });
  const lines = [{
    merchandiseId: customization.selectedVariantId,
    quantity: 1,
    attributes: [
      { key: "_customization_json", value: JSON.stringify(essentialElements) },
      { key: "Personalization Mode", value: customization.personalizationType }
    ]
  }];
  try {
    const data = await shopifyFetch({ query: mutation, variables: { input: { lines } } });
    if ((_b = (_a = data == null ? void 0 : data.cartCreate) == null ? void 0 : _a.cart) == null ? void 0 : _b.checkoutUrl) return data.cartCreate.cart.checkoutUrl;
  } catch (error) {
    console.error("Error during addToCart:", error);
  }
  return "https://checkout.shopify.com/mock-checkout-url";
};
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const getDesignSuggestions = async (productTitle, currentAddons) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is customizing a ${productTitle}. 
                Currently added: ${currentAddons.join(", ") || "Nothing yet"}.
                Suggest 3 creative placement ideas or style themes (e.g. Vintage, Cyberpunk, Floral) that would look good. 
                Keep it short and inspiring.`
    });
    return response.text || "Try adding some bold patches to the chest area!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Personalize your item with unique patches and embroidery!";
  }
};
function CanvasWrapper(props) {
  const [Canvas, setCanvas] = useState(null);
  useEffect(() => {
    import("./assets/CanvasClient-uKj33piT.js").then((module) => {
      setCanvas(() => module.default);
    });
  }, []);
  if (!Canvas) {
    return /* @__PURE__ */ jsx("div", { className: "flex flex-col h-full w-full bg-white relative overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-600", children: "Loading canvas..." })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx(Canvas, { ...props });
}
const Sidebar = ({
  product,
  selectedVariantId,
  onVariantChange,
  mode,
  onModeChange,
  onAddAddon,
  onUpdateEmbroidery,
  onAddVinyl,
  totalPrice,
  currency,
  onBack,
  onAddToCart,
  showAids,
  onToggleAids,
  embroideryState,
  letterAddons,
  patchAddons
}) => {
  var _a;
  const [activeTab, setActiveTab] = useState("LETTERS");
  const [drillDownGroup, setDrillDownGroup] = useState(null);
  const [autoTidy, setAutoTidy] = useState(false);
  const handleModeChange = (newMode) => {
    onModeChange(newMode);
    setDrillDownGroup(null);
  };
  const letterGroups = Array.from(new Set(letterAddons.map((a) => a.baseColorGroup))).filter(Boolean);
  const getGroupAddon = (group) => letterAddons.find((a) => a.baseColorGroup === group);
  const filteredLetters = drillDownGroup ? letterAddons.filter((a) => a.baseColorGroup === drillDownGroup) : [];
  return /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-[450px] h-full flex flex-col bg-slate-50 border-l border-slate-200 overflow-hidden shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-8 bg-white border-b border-slate-200", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3", children: "Personalisation Mode" }),
      /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "w-full appearance-none bg-slate-50 border-2 border-pink-600 rounded-2xl px-5 py-4 font-black text-slate-900 focus:outline-none transition-all cursor-pointer text-xs uppercase tracking-widest",
            value: mode || "",
            onChange: (e) => handleModeChange(e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "COLOR", children: "Pick Personalisation" }),
              /* @__PURE__ */ jsx("option", { value: "LETTERS_PATCHES", children: "Letters & Patches" }),
              /* @__PURE__ */ jsx("option", { value: "EMBROIDERY", children: "Embroidery" }),
              /* @__PURE__ */ jsx("option", { value: "VINYL", children: "Cricut / Vinyl" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(ChevronDown, { className: "absolute right-5 top-1/2 -translate-y-1/2 text-pink-600 pointer-events-none", size: 20 })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-8 space-y-8", children: [
      mode === "COLOR" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400", children: "Select Product Variant" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-4", children: (_a = product.variants) == null ? void 0 : _a.map((v) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onVariantChange(v.id),
            className: "group flex flex-col items-center gap-3",
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-14 h-14 rounded-full border-2 transition-all flex items-center justify-center ${selectedVariantId === v.id ? "border-pink-600 scale-110 shadow-lg" : "border-white hover:border-slate-200"}`,
                  style: { backgroundColor: v.color },
                  children: selectedVariantId === v.id && /* @__PURE__ */ jsx(Check, { className: "text-white drop-shadow-md", size: 24 })
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black text-slate-400 uppercase tracking-tighter", children: v.title })
            ]
          },
          v.id
        )) })
      ] }),
      mode === "LETTERS_PATCHES" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex bg-slate-200/50 p-1.5 rounded-full mb-6", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setActiveTab("LETTERS");
                setDrillDownGroup(null);
              },
              className: `flex-1 py-3 rounded-full text-[10px] font-black tracking-widest transition-all ${activeTab === "LETTERS" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`,
              children: "LETTERS"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setActiveTab("PATCHES");
                setDrillDownGroup(null);
              },
              className: `flex-1 py-3 rounded-full text-[10px] font-black tracking-widest transition-all ${activeTab === "PATCHES" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`,
              children: "PATCHES"
            }
          )
        ] }),
        activeTab === "LETTERS" ? drillDownGroup ? /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setDrillDownGroup(null),
              className: "flex items-center gap-2 text-[10px] font-black uppercase text-pink-600 hover:text-pink-700",
              children: [
                /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
                " Back to colors"
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3", children: filteredLetters.map((item) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onAddAddon(item),
              className: "aspect-square bg-white rounded-2xl p-3 border border-slate-100 hover:border-pink-500 transition-all shadow-sm flex items-center justify-center group",
              children: /* @__PURE__ */ jsx("img", { src: item.imageUrl, alt: item.title, className: "max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" })
            },
            item.id
          )) })
        ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-5", children: letterGroups.map((group) => {
          const addon = getGroupAddon(group);
          if (!addon) return null;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "group flex flex-col items-center cursor-pointer",
              onClick: () => setDrillDownGroup(group),
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-full aspect-square bg-white rounded-2xl p-4 border border-slate-100 group-hover:border-pink-500 transition-all flex items-center justify-center mb-3 shadow-sm", children: /* @__PURE__ */ jsx("img", { src: addon.imageUrl, alt: group, className: "max-w-full max-h-full object-contain" }) }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] uppercase font-black text-slate-400 text-center leading-none tracking-tight", children: group })
              ]
            },
            group
          );
        }) }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-5", children: patchAddons.map((addon) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "group flex flex-col items-center cursor-pointer",
            onClick: () => onAddAddon(addon),
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-full aspect-square bg-white rounded-2xl p-4 border border-slate-100 group-hover:border-pink-500 transition-all flex items-center justify-center mb-3 shadow-sm", children: /* @__PURE__ */ jsx("img", { src: addon.imageUrl, alt: addon.title, className: "max-w-full max-h-full object-contain" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] uppercase font-black text-slate-400 text-center leading-none tracking-tight", children: addon.title })
            ]
          },
          addon.id
        )) })
      ] }),
      mode === "EMBROIDERY" && /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-pink-50 p-5 rounded-2xl", children: /* @__PURE__ */ jsx("p", { className: "text-[11px] text-pink-800 font-bold leading-relaxed uppercase tracking-tight", children: "Up to 60 characters max. 1 line with up to 12 characters. Case sensitive." }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400", children: "Font Style" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: EMBROIDERY_FONTS.map((font) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onUpdateEmbroidery(embroideryState.text, font.family, embroideryState.color),
              className: `py-4 px-4 border-2 rounded-2xl font-bold transition-all text-sm ${embroideryState.font === font.family ? "border-pink-600 bg-pink-50 text-pink-600" : "border-slate-100 bg-white text-slate-400"}`,
              style: { fontFamily: font.family },
              children: font.name
            },
            font.id
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400", children: "Thread Color" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: EMBROIDERY_COLORS.map((color) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onUpdateEmbroidery(embroideryState.text, embroideryState.font, color.hex),
              className: `w-9 h-9 rounded-full border-2 transition-all ${embroideryState.color === color.hex ? "border-pink-600 scale-125 shadow-md" : "border-white hover:border-slate-200"}`,
              style: { backgroundColor: color.hex },
              title: color.name
            },
            color.name
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400", children: "Embroidery Text" }),
          /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              maxLength: 60,
              value: embroideryState.text,
              onChange: (e) => onUpdateEmbroidery(e.target.value, embroideryState.font, embroideryState.color),
              placeholder: "Enter text...",
              className: "w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-5 font-black text-slate-900 focus:outline-none focus:border-pink-600 transition-all shadow-sm uppercase"
            }
          ) })
        ] })
      ] }),
      mode === "VINYL" && /* @__PURE__ */ jsx("div", { className: "space-y-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400", children: /* @__PURE__ */ jsx(ImageIcon, { size: 40 }) }),
        /* @__PURE__ */ jsxs("label", { className: "inline-block px-10 py-5 bg-pink-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-pink-700 transition-colors shadow-lg shadow-pink-100", children: [
          "Choose File",
          /* @__PURE__ */ jsx("input", { type: "file", className: "hidden", accept: "image/*", onChange: (e) => {
            var _a2;
            return ((_a2 = e.target.files) == null ? void 0 : _a2[0]) && onAddVinyl(e.target.files[0]);
          } })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-10 bg-white border-t border-slate-100 space-y-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Auto Tidy & Align" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setAutoTidy(!autoTidy),
              className: `w-14 h-7 rounded-full transition-all relative ${autoTidy ? "bg-pink-600" : "bg-slate-200"}`,
              children: /* @__PURE__ */ jsx("div", { className: `absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${autoTidy ? "left-[32px]" : "left-1.5"}` })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Show design aids" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onToggleAids(!showAids),
              className: `w-14 h-7 rounded-full transition-all relative ${showAids ? "bg-pink-600" : "bg-slate-200"}`,
              children: /* @__PURE__ */ jsx("div", { className: `absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${showAids ? "left-[32px]" : "left-1.5"}` })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Subtotal" }),
          /* @__PURE__ */ jsxs("span", { className: "text-3xl font-black text-slate-900 tracking-tighter", children: [
            totalPrice.toFixed(2),
            " ",
            currency
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onBack,
              className: "flex-1 py-5 bg-slate-100 text-slate-500 rounded-full font-black text-[10px] tracking-[0.2em] hover:bg-slate-200 transition-all uppercase",
              children: "Back"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onAddToCart,
              className: "flex-[2] py-5 bg-pink-600 text-white rounded-full font-black text-[10px] tracking-[0.2em] hover:bg-pink-700 shadow-2xl shadow-pink-200 transition-all uppercase",
              children: "Add to Cart"
            }
          )
        ] })
      ] })
    ] })
  ] });
};
const App2 = () => {
  var _a, _b;
  const [step, setStep] = useState("selection");
  const [products, setProducts] = useState([]);
  const [letterAddons, setLetterAddons] = useState([]);
  const [patchAddons, setPatchAddons] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [customMode, setCustomMode] = useState("COLOR");
  const [canvasElements, setCanvasElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAids, setShowAids] = useState(true);
  const [aiInspiration, setAiInspiration] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [embroideryText, setEmbroideryText] = useState("");
  const [embroideryFont, setEmbroideryFont] = useState("cursive");
  const [embroideryColor, setEmbroideryColor] = useState("#000000");
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, lettersRes, patchesRes] = await Promise.all([
          fetchShopifyProducts(),
          fetchShopifyAddons("letters", AddonCategory.LETTERS),
          fetchShopifyAddons("patches", AddonCategory.PATCHES)
        ]);
        setProducts(prodRes);
        setLetterAddons(lettersRes);
        setPatchAddons(patchesRes);
        if (prodRes.length > 0) {
          setSelectedProduct(prodRes[0]);
          setSelectedVariantId(prodRes[0].variantId);
        }
      } catch (err) {
        console.error("Critical error loading initial data:", err);
      }
    };
    loadData();
  }, []);
  const fetchAiSuggestions = async () => {
    if (!selectedProduct) return;
    setIsLoadingAi(true);
    try {
      const addons = canvasElements.map((el) => {
        var _a2;
        return ((_a2 = el.addon) == null ? void 0 : _a2.title) || el.text || "Element";
      });
      const suggestion = await getDesignSuggestions(selectedProduct.title, addons);
      setAiInspiration(suggestion);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setIsLoadingAi(false);
    }
  };
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedVariantId(product.variantId);
    setStep("details");
    setAiInspiration("");
  };
  const addAddonToCanvas = (addon) => {
    const newElement = {
      instanceId: `el-${Date.now()}`,
      type: "addon",
      addon,
      position: { x: 200, y: 250 },
      size: { width: 80, height: 100 },
      rotation: 0,
      zIndex: canvasElements.length
    };
    setCanvasElements([...canvasElements, newElement]);
    setSelectedElementId(newElement.instanceId);
  };
  const handleUpdateEmbroidery = (text, font, color) => {
    setEmbroideryText(text);
    setEmbroideryFont(font);
    setEmbroideryColor(color);
    setCanvasElements((prev) => {
      const existing = prev.find((el) => el.type === "embroidery");
      if (existing) {
        return prev.map((el) => el.type === "embroidery" ? {
          ...el,
          text,
          fontFamily: font,
          color
        } : el);
      } else {
        const newEl = {
          instanceId: "embroidery-main",
          type: "embroidery",
          text,
          fontFamily: font,
          color,
          position: { x: 150, y: 300 },
          size: { width: 200, height: 50 },
          rotation: 0,
          zIndex: 100
        };
        return [...prev, newEl];
      }
    });
  };
  const addVinylToCanvas = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a2;
      const dataUrl = (_a2 = e.target) == null ? void 0 : _a2.result;
      const newElement = {
        instanceId: `vinyl-${Date.now()}`,
        type: "vinyl",
        imageUrl: dataUrl,
        position: { x: 150, y: 250 },
        size: { width: 150, height: 150 },
        rotation: 0,
        zIndex: canvasElements.length
      };
      setCanvasElements([...canvasElements, newElement]);
      setSelectedElementId(newElement.instanceId);
    };
    reader.readAsDataURL(file);
  };
  const handleUpdateElement = (id, updates) => {
    setCanvasElements((els) => els.map((el) => el.instanceId === id ? { ...el, ...updates } : el));
  };
  const deleteElement = () => {
    if (!selectedElementId) return;
    setCanvasElements((els) => els.filter((el) => el.instanceId !== selectedElementId));
    if (selectedElementId === "embroidery-main") {
      setEmbroideryText("");
    }
    setSelectedElementId(null);
  };
  const clearAll = () => {
    setCanvasElements([]);
    setEmbroideryText("");
    setSelectedElementId(null);
  };
  const addonPrice = canvasElements.reduce((sum, el) => {
    if (el.type === "addon" && el.addon) return sum + el.addon.price;
    if (el.type === "embroidery" || el.type === "vinyl") return sum + 60;
    return sum;
  }, 0);
  const totalPrice = ((selectedProduct == null ? void 0 : selectedProduct.price) || 0) + addonPrice;
  const handleAddToCart = async () => {
    if (!selectedProduct || isAddingToCart) return;
    setIsAddingToCart(true);
    const customization = {
      baseProduct: selectedProduct,
      selectedVariantId,
      mode: customMode,
      elements: canvasElements,
      totalPrice,
      currency: selectedProduct.currency,
      personalizationType: customMode || "COLOR"
    };
    try {
      const checkoutUrl = await addToCart(customization);
      setShowSuccess(true);
      setTimeout(() => {
        window.location.assign(checkoutUrl);
      }, 1500);
    } catch (err) {
      console.error("Cart Error:", err);
      alert("Something went wrong. Please try again.");
      setIsAddingToCart(false);
    }
  };
  const MockBadge = () => !isShopifyConnected() ? /* @__PURE__ */ jsxs("div", { className: "fixed top-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/10 backdrop-blur-md rounded-full border border-slate-900/10 flex items-center gap-2 z-[100] pointer-events-none", children: [
    /* @__PURE__ */ jsx(Zap, { size: 12, className: "text-slate-900" }),
    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-slate-900", children: "Demo Mode" })
  ] }) : null;
  if (step === "selection") {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white", children: [
      /* @__PURE__ */ jsx(MockBadge, {}),
      /* @__PURE__ */ jsxs("header", { className: "px-8 py-20 max-w-7xl mx-auto flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-none", children: "STYLN CUSTOM" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-[11px] font-black uppercase tracking-[0.5em]", children: "Choose Your Base Piece" })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "max-w-7xl mx-auto px-8 pb-32", children: products.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 font-bold uppercase text-[10px] tracking-widest", children: "Fetching Collection..." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16", children: products.map((product) => /* @__PURE__ */ jsxs("div", { className: "group cursor-pointer", onClick: () => handleProductSelect(product), children: [
        /* @__PURE__ */ jsx("div", { className: "aspect-[4/5] bg-slate-50 relative overflow-hidden mb-10 flex items-center justify-center p-16 rounded-[48px] group-hover:bg-slate-100 transition-all duration-700 shadow-sm", children: /* @__PURE__ */ jsx("img", { src: product.imageUrl, alt: product.title, className: "max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-1000 drop-shadow-xl" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight", children: product.title }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-400 font-bold uppercase text-[10px] tracking-widest", children: [
          product.price.toFixed(2),
          " ",
          product.currency
        ] })
      ] }, product.id)) }) })
    ] });
  }
  if (step === "details" && selectedProduct) {
    return /* @__PURE__ */ jsxs("div", { className: "h-screen bg-white flex flex-col lg:flex-row overflow-hidden", children: [
      /* @__PURE__ */ jsx(MockBadge, {}),
      /* @__PURE__ */ jsxs("div", { className: "flex-[3] relative flex items-center justify-center p-20 bg-white h-1/2 lg:h-auto overflow-hidden", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setStep("selection"), className: "absolute top-12 left-12 p-4 text-slate-300 hover:text-slate-900 transition-colors z-10", children: /* @__PURE__ */ jsx(ChevronLeft, { size: 36 }) }),
        /* @__PURE__ */ jsx("img", { src: selectedProduct.imageUrl, alt: selectedProduct.title, className: "max-w-full max-h-[85%] object-contain drop-shadow-2xl z-0" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-[2] bg-slate-50 p-16 lg:p-24 overflow-y-auto h-1/2 lg:h-auto border-l border-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto h-full flex flex-col", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-5xl font-black text-slate-900 mb-12 leading-[1] uppercase tracking-tighter", children: selectedProduct.title }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-12 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
              /* @__PURE__ */ jsx(Sparkles, { size: 18, className: "text-pink-600" }),
              /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black text-pink-600 uppercase tracking-widest", children: "AI Stylist Advice" })
            ] }),
            aiInspiration ? /* @__PURE__ */ jsxs("p", { className: "text-slate-600 text-sm font-medium leading-relaxed italic animate-in fade-in slide-in-from-bottom-2", children: [
              '"',
              aiInspiration,
              '"'
            ] }) : /* @__PURE__ */ jsx(
              "button",
              {
                onClick: fetchAiSuggestions,
                disabled: isLoadingAi,
                className: "text-slate-400 hover:text-pink-600 text-sm font-bold uppercase tracking-tight transition-colors flex items-center gap-2",
                children: isLoadingAi ? "Consulting Gemini..." : "Get Styling Ideas"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4", children: "Description" }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-500 leading-relaxed text-sm font-medium", children: selectedProduct.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2", children: "Personalisation" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setStep("customizer"),
                className: "w-full flex items-center justify-between p-6 border-2 border-pink-600 rounded-3xl text-pink-600 font-black tracking-[0.2em] uppercase text-[11px] hover:bg-pink-50 transition-all shadow-2xl shadow-pink-100",
                children: [
                  "Start Customizing",
                  /* @__PURE__ */ jsx(Sparkles, { size: 16 })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-slate-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "Base Price" }),
            /* @__PURE__ */ jsxs("span", { className: "text-4xl font-black text-slate-900 tracking-tighter", children: [
              selectedProduct.price.toFixed(2),
              " ",
              selectedProduct.currency
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => setStep("selection"), className: "flex-1 py-5 bg-slate-200 text-slate-500 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-slate-300", children: "Back" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setStep("customizer"), className: "flex-[2] py-5 bg-pink-600 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-pink-700 shadow-xl shadow-pink-200", children: "Customize" })
          ] })
        ] })
      ] }) })
    ] });
  }
  if (step === "customizer" && selectedProduct) {
    const bgImage = ((_b = (_a = selectedProduct.variants) == null ? void 0 : _a.find((v) => v.id === selectedVariantId)) == null ? void 0 : _b.imageUrl) || selectedProduct.imageUrl;
    return /* @__PURE__ */ jsxs("div", { className: "h-screen bg-white flex flex-col lg:flex-row overflow-hidden", children: [
      /* @__PURE__ */ jsx(MockBadge, {}),
      /* @__PURE__ */ jsxs("div", { className: "flex-[3] relative flex flex-col h-2/3 lg:h-auto overflow-hidden", children: [
        /* @__PURE__ */ jsxs("header", { className: "h-24 flex items-center justify-between px-12 border-b border-slate-50 bg-white z-30", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setStep("details"), className: "text-slate-300 hover:text-slate-900 transition-colors p-3", children: /* @__PURE__ */ jsx(ChevronLeft, { size: 32 }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: fetchAiSuggestions,
                className: "flex items-center gap-2 text-[10px] font-black uppercase text-pink-600 hover:bg-pink-50 transition-colors px-6 py-3 border border-pink-100 rounded-full bg-white shadow-sm",
                children: [
                  /* @__PURE__ */ jsx(Sparkles, { size: 14 }),
                  " Magic Suggest"
                ]
              }
            ),
            /* @__PURE__ */ jsxs("button", { onClick: clearAll, className: "flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors px-6 py-3 border border-slate-100 rounded-full bg-white shadow-sm", children: [
              /* @__PURE__ */ jsx(Trash, { size: 14 }),
              " Reset"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 relative bg-slate-50 flex items-center justify-center p-12 overflow-hidden", children: [
          /* @__PURE__ */ jsx(
            CanvasWrapper,
            {
              backgroundImageUrl: bgImage,
              elements: canvasElements,
              onUpdateElement: handleUpdateElement,
              onSelectElement: setSelectedElementId,
              selectedId: selectedElementId,
              width: 550,
              height: 650,
              showAids
            }
          ),
          selectedElementId && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: deleteElement,
              className: "absolute bottom-12 right-12 bg-red-500 text-white p-5 rounded-full shadow-2xl hover:bg-red-600 transition-all z-40",
              children: /* @__PURE__ */ jsx(Trash2, { size: 24 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Sidebar,
        {
          product: selectedProduct,
          selectedVariantId,
          onVariantChange: setSelectedVariantId,
          mode: customMode,
          onModeChange: setCustomMode,
          onAddAddon: addAddonToCanvas,
          onUpdateEmbroidery: handleUpdateEmbroidery,
          onAddVinyl: addVinylToCanvas,
          totalPrice,
          currency: selectedProduct.currency,
          onBack: () => setStep("details"),
          onAddToCart: handleAddToCart,
          showAids,
          onToggleAids: setShowAids,
          embroideryState: { text: embroideryText, font: embroideryFont, color: embroideryColor },
          letterAddons,
          patchAddons
        }
      ),
      (showSuccess || isAddingToCart) && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-xl animate-in fade-in duration-500", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[64px] p-20 max-w-xl w-full text-center shadow-2xl scale-in-center", children: [
        /* @__PURE__ */ jsx("div", { className: `w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 ${showSuccess ? "bg-emerald-50 text-emerald-500" : "bg-pink-50 text-pink-500"}`, children: showSuccess ? /* @__PURE__ */ jsx(CheckCircle2, { size: 64 }) : /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter", children: showSuccess ? "Saving Design" : "Creating Cart" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 font-bold uppercase text-[11px] tracking-widest mb-10", children: showSuccess ? "Hold tight, we're building your cart..." : "Preparing your custom items..." }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-slate-100 h-1.5 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: `h-full bg-pink-600 transition-all duration-500 ${showSuccess ? "w-full" : "w-1/2 animate-pulse"}` }) })
      ] }) })
    ] });
  }
  return null;
};
const _index = UNSAFE_withComponentProps(function Index() {
  return /* @__PURE__ */ jsx(App2, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-u8nAT-yv.js", "imports": ["/assets/chunk-TMI4QPZX-CWrFqL2g.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-Baqi2R5Z.js", "imports": ["/assets/chunk-TMI4QPZX-CWrFqL2g.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-JxamiJ9m.js", "imports": ["/assets/_index-Rlee23r_.js", "/assets/chunk-TMI4QPZX-CWrFqL2g.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-ec9194db.js", "version": "ec9194db", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
