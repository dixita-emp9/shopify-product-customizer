
import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Download,
  Trash,
  ChevronLeft,
  CheckCircle2,
  Share2,
  ChevronDown
} from 'lucide-react';
import { Product, Addon, CanvasElement, CustomizationData, CustomizationMode } from './types';
import { fetchShopifyProducts, addToCart } from './services/shopifyService';
import CustomizerCanvas from './components/Customizer/Canvas';
import Sidebar from './components/Customizer/Sidebar';

const App: React.FC = () => {
  const [step, setStep] = useState<'selection' | 'details' | 'customizer'>('selection');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [customMode, setCustomMode] = useState<CustomizationMode>('COLOR');
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAids, setShowAids] = useState(true);

  // Single-instance embroidery state
  const [embroideryText, setEmbroideryText] = useState('');
  const [embroideryFont, setEmbroideryFont] = useState('cursive');
  const [embroideryColor, setEmbroideryColor] = useState('#000000');

  useEffect(() => {
    fetchShopifyProducts().then((res) => {
      setProducts(res);
      if (res.length > 0) {
        setSelectedProduct(res[0]);
        setSelectedVariantId(res[0].variantId);
      }
    }).catch(err => {
      console.error("Failed to fetch products:", err);
    });
  }, []);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariantId(product.variantId);
    setStep('details');
  };

  const addAddonToCanvas = (addon: Addon) => {
    const newElement: CanvasElement = {
      instanceId: `el-${Date.now()}`,
      type: 'addon',
      addon,
      position: { x: 200, y: 250 },
      size: { width: 80, height: 100 },
      rotation: 0,
      zIndex: canvasElements.length,
    };
    setCanvasElements([...canvasElements, newElement]);
    setSelectedElementId(newElement.instanceId);
  };

  const handleUpdateEmbroidery = (text: string, font: string, color: string) => {
    setEmbroideryText(text);
    setEmbroideryFont(font);
    setEmbroideryColor(color);

    setCanvasElements(prev => {
      const existing = prev.find(el => el.type === 'embroidery');
      if (existing) {
        return prev.map(el => el.type === 'embroidery' ? {
          ...el,
          text,
          fontFamily: font,
          color
        } : el);
      } else {
        const newEl: CanvasElement = {
          instanceId: 'embroidery-main',
          type: 'embroidery',
          text,
          fontFamily: font,
          color,
          position: { x: 150, y: 300 },
          size: { width: 200, height: 50 },
          rotation: 0,
          zIndex: 100,
        };
        return [...prev, newEl];
      }
    });
  };

  const addVinylToCanvas = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newElement: CanvasElement = {
        instanceId: `vinyl-${Date.now()}`,
        type: 'vinyl',
        imageUrl: dataUrl,
        position: { x: 150, y: 250 },
        size: { width: 150, height: 150 },
        rotation: 0,
        zIndex: canvasElements.length,
      };
      setCanvasElements([...canvasElements, newElement]);
      setSelectedElementId(newElement.instanceId);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements(els => els.map(el => el.instanceId === id ? { ...el, ...updates } : el));
  };

  const deleteElement = () => {
    if (!selectedElementId) return;
    setCanvasElements(els => els.filter(el => el.instanceId !== selectedElementId));
    if (selectedElementId === 'embroidery-main') {
      setEmbroideryText('');
    }
    setSelectedElementId(null);
  };

  const clearAll = () => {
    setCanvasElements([]);
    setEmbroideryText('');
    setSelectedElementId(null);
  };

  const addonPrice = canvasElements.reduce((sum, el) => {
    if (el.type === 'addon' && el.addon) return sum + el.addon.price;
    if (el.type === 'embroidery' || el.type === 'vinyl') return sum + 60;
    return sum;
  }, 0);

  const totalPrice = (selectedProduct?.price || 0) + addonPrice;

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    setIsAddingToCart(true);
    
    const customization: CustomizationData = {
      baseProduct: selectedProduct,
      selectedVariantId,
      mode: customMode,
      elements: canvasElements,
      totalPrice,
      currency: selectedProduct.currency,
      personalizationType: customMode || 'COLOR'
    };

    try {
      const checkoutUrl = await addToCart(customization);
      setShowSuccess(true);
      
      // Redirect to Shopify checkout after a brief delay to show success UI
      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 2000);
    } catch (err) {
      console.error("Cart Error:", err);
      alert("There was an issue adding your custom item to the cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (step === 'selection') {
    return (
      <div className="min-h-screen bg-white">
        <header className="px-8 py-20 max-w-7xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-none">STYLN CUSTOM</h1>
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.5em]">Choose Your Base Piece</p>
        </header>

        <main className="max-w-7xl mx-auto px-8 pb-32">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Fetching Products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {products.map(product => (
                <div key={product.id} className="group cursor-pointer" onClick={() => handleProductSelect(product)}>
                  <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden mb-10 flex items-center justify-center p-16 rounded-[48px] group-hover:bg-slate-100 transition-all duration-700">
                    <div className="absolute inset-0 opacity-[0.03] flex flex-wrap justify-around items-center rotate-[-15deg] pointer-events-none">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <span key={i} className="text-2xl font-black text-slate-900 m-6">STYLN</span>
                      ))}
                    </div>
                    <img src={product.imageUrl} alt={product.title} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-1000 drop-shadow-xl" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">{product.title}</h3>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{product.price.toFixed(2)} {product.currency}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  if (step === 'details' && selectedProduct) {
    return (
      <div className="h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-[3] relative flex items-center justify-center p-20 bg-white h-1/2 lg:h-auto overflow-hidden">
          <button onClick={() => setStep('selection')} className="absolute top-12 left-12 p-4 text-slate-300 hover:text-slate-900 transition-colors z-10">
            <ChevronLeft size={36} />
          </button>
          <div className="absolute top-12 right-12 flex gap-4 z-10">
             <button className="p-4 bg-white shadow-xl rounded-full text-slate-400 hover:text-slate-900 transition-all">
                <Share2 size={20} />
              </button>
          </div>
          <div className="absolute inset-0 opacity-[0.02] flex flex-wrap justify-around items-center rotate-[-15deg] pointer-events-none select-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i} className="text-3xl font-black text-slate-900 m-12">STYLN</span>
            ))}
          </div>
          <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="max-w-full max-h-[85%] object-contain drop-shadow-2xl z-0" />
        </div>

        <div className="flex-[2] bg-slate-50 p-16 lg:p-24 overflow-y-auto h-1/2 lg:h-auto border-l border-slate-100">
          <div className="max-w-md mx-auto h-full flex flex-col">
            <h2 className="text-5xl font-black text-slate-900 mb-16 leading-[1] uppercase tracking-tighter">{selectedProduct.title}</h2>
            
            <div className="space-y-16 flex-1">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Material</h4>
                  <p className="text-slate-900 font-black text-xs uppercase">{selectedProduct.material || 'Premium'}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Dimensions</h4>
                  <p className="text-slate-900 font-black text-xs uppercase">{selectedProduct.dimensions || 'Standard'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Description</h4>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{selectedProduct.description}</p>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Personalisation</h4>
                 <div className="relative">
                    <button 
                      onClick={() => setStep('customizer')}
                      className="w-full flex items-center justify-between p-6 border-2 border-pink-600 rounded-3xl text-pink-600 font-black tracking-[0.2em] uppercase text-[11px] hover:bg-pink-50 transition-all shadow-2xl shadow-pink-100"
                    >
                      Pick Personalisation
                      <ChevronDown className="-rotate-90" size={20} />
                    </button>
                 </div>
              </div>
            </div>

            <div className="mt-20 pt-12 border-t border-slate-200">
              <div className="flex items-center justify-between mb-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{selectedProduct.price.toFixed(2)} {selectedProduct.currency}</span>
              </div>
              <div className="flex gap-6">
                <button onClick={() => setStep('selection')} className="flex-1 py-6 bg-slate-200 text-slate-500 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-slate-300 transition-all">Back</button>
                <button onClick={() => setStep('customizer')} className="flex-[2] py-6 bg-pink-600 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-pink-700 transition-all shadow-2xl shadow-pink-200">Customize Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'customizer' && selectedProduct) {
    const bgImage = selectedProduct.variants?.find(v => v.id === selectedVariantId)?.imageUrl || selectedProduct.imageUrl;

    return (
      <div className="h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-[3] relative flex flex-col h-2/3 lg:h-auto overflow-hidden">
          <header className="h-24 flex items-center justify-between px-12 border-b border-slate-50 bg-white z-30">
            <button onClick={() => setStep('details')} className="text-slate-300 hover:text-slate-900 transition-colors p-3">
              <ChevronLeft size={32} />
            </button>
            <div className="flex gap-5">
              <button onClick={clearAll} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors px-6 py-3 border border-slate-100 rounded-full bg-white shadow-sm">
                <Trash size={14} /> Clear All
              </button>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors px-6 py-3 border border-slate-100 rounded-full bg-white shadow-sm">
                <Download size={14} /> Download
              </button>
            </div>
          </header>

          <div className="flex-1 relative bg-slate-50 flex items-center justify-center p-12 overflow-hidden">
             <CustomizerCanvas
                backgroundImageUrl={bgImage}
                elements={canvasElements}
                onUpdateElement={handleUpdateElement}
                onSelectElement={setSelectedElementId}
                selectedId={selectedElementId}
                width={550}
                height={650}
                showAids={showAids}
              />

              {selectedElementId && (
                <button 
                  onClick={deleteElement}
                  className="absolute bottom-16 right-16 bg-red-500 text-white p-6 rounded-full shadow-[0_20px_60px_rgba(239,68,68,0.4)] hover:bg-red-600 transition-all scale-in-center z-40"
                >
                  <Trash2 size={32} />
                </button>
              )}
          </div>
        </div>

        <Sidebar 
          product={selectedProduct}
          selectedVariantId={selectedVariantId}
          onVariantChange={setSelectedVariantId}
          mode={customMode}
          onModeChange={setCustomMode}
          onAddAddon={addAddonToCanvas} 
          onUpdateEmbroidery={handleUpdateEmbroidery}
          onAddVinyl={addVinylToCanvas}
          totalPrice={totalPrice}
          currency={selectedProduct.currency}
          onBack={() => setStep('details')}
          onAddToCart={handleAddToCart}
          showAids={showAids}
          onToggleAids={setShowAids}
          embroideryState={{ text: embroideryText, font: embroideryFont, color: embroideryColor }}
        />

        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-white rounded-[64px] p-20 max-w-xl w-full text-center shadow-[0_64px_256px_rgba(0,0,0,0.15)] scale-in-center">
              <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-12 text-emerald-500">
                <CheckCircle2 size={80} />
              </div>
              <h3 className="text-5xl font-black text-slate-900 mb-6 uppercase leading-none tracking-tighter">Design Saved!</h3>
              <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] mb-14">Redirecting to Shopify Checkout...</p>
              <div className="flex gap-4">
                 <button 
                  onClick={() => setShowSuccess(false)}
                  className="flex-1 bg-slate-100 text-slate-900 py-6 rounded-full font-black uppercase text-[11px] tracking-widest hover:bg-slate-200 transition-all"
                >
                  Stay Here
                </button>
                <div className="flex-1 bg-pink-600 text-white py-6 rounded-full font-black uppercase text-[11px] tracking-widest animate-pulse flex items-center justify-center">
                  Loading...
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default App;
