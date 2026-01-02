
import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Trash,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';
import { Product, Addon, AddonCategory, CanvasElement, CustomizationData, CustomizationMode } from './types';
import { fetchShopifyProducts, fetchShopifyAddons, addToCart, isShopifyConnected } from './services/shopifyService';
import { getDesignSuggestions } from './services/geminiService';
import CustomizerCanvas from './components/Customizer/Canvas';
import Sidebar from './components/Customizer/Sidebar';

const App: React.FC = () => {
  const [step, setStep] = useState<'selection' | 'details' | 'customizer'>('selection');
  const [products, setProducts] = useState<Product[]>([]);
  const [letterAddons, setLetterAddons] = useState<Addon[]>([]);
  const [patchAddons, setPatchAddons] = useState<Addon[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [customMode, setCustomMode] = useState<CustomizationMode>('COLOR');
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAids, setShowAids] = useState(true);
  
  // AI States
  const [aiInspiration, setAiInspiration] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Single-instance embroidery state
  const [embroideryText, setEmbroideryText] = useState('');
  const [embroideryFont, setEmbroideryFont] = useState('cursive');
  const [embroideryColor, setEmbroideryColor] = useState('#000000');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, lettersRes, patchesRes] = await Promise.all([
          fetchShopifyProducts(),
          fetchShopifyAddons('letters', AddonCategory.LETTERS),
          fetchShopifyAddons('patches', AddonCategory.PATCHES)
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
      const addons = canvasElements.map(el => el.addon?.title || el.text || 'Element');
      const suggestion = await getDesignSuggestions(selectedProduct.title, addons);
      setAiInspiration(suggestion);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariantId(product.variantId);
    setStep('details');
    setAiInspiration('');
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
    if (!selectedProduct || isAddingToCart) return;
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
      setTimeout(() => {
        window.location.assign(checkoutUrl);
      }, 1500);
    } catch (err) {
      console.error("Cart Error:", err);
      alert("Something went wrong. Please try again.");
      setIsAddingToCart(false);
    }
  };

  const MockBadge = () => !isShopifyConnected() ? (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/10 backdrop-blur-md rounded-full border border-slate-900/10 flex items-center gap-2 z-[100] pointer-events-none">
      <Zap size={12} className="text-slate-900" />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Demo Mode</span>
    </div>
  ) : null;

  if (step === 'selection') {
    return (
      <div className="min-h-screen bg-white">
        <MockBadge />
        <header className="px-8 py-20 max-w-7xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-none">STYLN CUSTOM</h1>
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.5em]">Choose Your Base Piece</p>
        </header>

        <main className="max-w-7xl mx-auto px-8 pb-32">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Fetching Collection...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {products.map(product => (
                <div key={product.id} className="group cursor-pointer" onClick={() => handleProductSelect(product)}>
                  <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden mb-10 flex items-center justify-center p-16 rounded-[48px] group-hover:bg-slate-100 transition-all duration-700 shadow-sm">
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
        <MockBadge />
        <div className="flex-[3] relative flex items-center justify-center p-20 bg-white h-1/2 lg:h-auto overflow-hidden">
          <button onClick={() => setStep('selection')} className="absolute top-12 left-12 p-4 text-slate-300 hover:text-slate-900 transition-colors z-10">
            <ChevronLeft size={36} />
          </button>
          <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="max-w-full max-h-[85%] object-contain drop-shadow-2xl z-0" />
        </div>

        <div className="flex-[2] bg-slate-50 p-16 lg:p-24 overflow-y-auto h-1/2 lg:h-auto border-l border-slate-100">
          <div className="max-w-md mx-auto h-full flex flex-col">
            <h2 className="text-5xl font-black text-slate-900 mb-12 leading-[1] uppercase tracking-tighter">{selectedProduct.title}</h2>
            
            <div className="space-y-12 flex-1">
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles size={18} className="text-pink-600" />
                  <h4 className="text-[10px] font-black text-pink-600 uppercase tracking-widest">AI Stylist Advice</h4>
                </div>
                {aiInspiration ? (
                  <p className="text-slate-600 text-sm font-medium leading-relaxed italic animate-in fade-in slide-in-from-bottom-2">
                    "{aiInspiration}"
                  </p>
                ) : (
                  <button 
                    onClick={fetchAiSuggestions}
                    disabled={isLoadingAi}
                    className="text-slate-400 hover:text-pink-600 text-sm font-bold uppercase tracking-tight transition-colors flex items-center gap-2"
                  >
                    {isLoadingAi ? 'Consulting Gemini...' : 'Get Styling Ideas'}
                  </button>
                )}
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Description</h4>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{selectedProduct.description}</p>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Personalisation</h4>
                 <button 
                   onClick={() => setStep('customizer')}
                   className="w-full flex items-center justify-between p-6 border-2 border-pink-600 rounded-3xl text-pink-600 font-black tracking-[0.2em] uppercase text-[11px] hover:bg-pink-50 transition-all shadow-2xl shadow-pink-100"
                 >
                   Start Customizing
                   <Sparkles size={16} />
                 </button>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Price</span>
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{selectedProduct.price.toFixed(2)} {selectedProduct.currency}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('selection')} className="flex-1 py-5 bg-slate-200 text-slate-500 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-slate-300">Back</button>
                <button onClick={() => setStep('customizer')} className="flex-[2] py-5 bg-pink-600 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-pink-700 shadow-xl shadow-pink-200">Customize</button>
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
        <MockBadge />
        <div className="flex-[3] relative flex flex-col h-2/3 lg:h-auto overflow-hidden">
          <header className="h-24 flex items-center justify-between px-12 border-b border-slate-50 bg-white z-30">
            <button onClick={() => setStep('details')} className="text-slate-300 hover:text-slate-900 transition-colors p-3">
              <ChevronLeft size={32} />
            </button>
            <div className="flex gap-4">
              <button 
                onClick={fetchAiSuggestions}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-pink-600 hover:bg-pink-50 transition-colors px-6 py-3 border border-pink-100 rounded-full bg-white shadow-sm"
              >
                <Sparkles size={14} /> Magic Suggest
              </button>
              <button onClick={clearAll} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors px-6 py-3 border border-slate-100 rounded-full bg-white shadow-sm">
                <Trash size={14} /> Reset
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
                  className="absolute bottom-12 right-12 bg-red-500 text-white p-5 rounded-full shadow-2xl hover:bg-red-600 transition-all z-40"
                >
                  <Trash2 size={24} />
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
          letterAddons={letterAddons}
          patchAddons={patchAddons}
        />

        {(showSuccess || isAddingToCart) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-white rounded-[64px] p-20 max-w-xl w-full text-center shadow-2xl scale-in-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 ${showSuccess ? 'bg-emerald-50 text-emerald-500' : 'bg-pink-50 text-pink-500'}`}>
                {showSuccess ? <CheckCircle2 size={64} /> : <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600" />}
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
                {showSuccess ? 'Saving Design' : 'Creating Cart'}
              </h3>
              <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest mb-10">
                {showSuccess ? "Hold tight, we're building your cart..." : "Preparing your custom items..."}
              </p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full bg-pink-600 transition-all duration-500 ${showSuccess ? 'w-full' : 'w-1/2 animate-pulse'}`} />
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
