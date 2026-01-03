
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

const MockBadge = () => !isShopifyConnected() ? (
  <div className="fixed top-8 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-slate-900 text-white rounded-full flex items-center gap-2 z-[100] shadow-2xl">
    <Zap size={14} className="text-yellow-400 fill-yellow-400" />
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Preview Mode</span>
  </div>
) : null;

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
      position: { x: 235, y: 275 },
      size: { width: 80, height: 100 },
      rotation: 0,
      zIndex: canvasElements.length,
    };
    setCanvasElements([...canvasElements, newElement]);
    setSelectedElementId(newElement.instanceId);
  };

  const handleUpdateEmbroidery = (text: string, font: string, color: string) => {
    // Strictly enforce 12 character limit as per prompt requirements
    const sanitizedText = text.slice(0, 12);
    setEmbroideryText(sanitizedText);
    setEmbroideryFont(font);
    setEmbroideryColor(color);

    setCanvasElements(prev => {
      const existing = prev.find(el => el.type === 'embroidery');
      if (existing) {
        return prev.map(el => el.type === 'embroidery' ? {
          ...el,
          text: sanitizedText,
          fontFamily: font,
          color
        } : el);
      } else {
        const newEl: CanvasElement = {
          instanceId: 'embroidery-main',
          type: 'embroidery',
          text: sanitizedText,
          fontFamily: font,
          color,
          position: { x: 175, y: 325 },
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
        position: { x: 200, y: 250 },
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
      }, 2000);
    } catch (err) {
      console.error("Cart Error:", err);
      alert("Something went wrong. Please try again.");
      setIsAddingToCart(false);
    }
  };

  if (step === 'selection') {
    return (
      <div className="min-h-screen bg-white">
        <MockBadge />
        <header className="px-12 py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-none">STYLN CUSTOM</h1>
          <div className="h-1 w-24 bg-pink-600 mb-8 rounded-full"></div>
          <p className="text-slate-400 text-[12px] font-black uppercase tracking-[0.6em]">Choose Your Iconic Base Piece</p>
        </header>

        <main className="max-w-7xl mx-auto px-12 pb-32">
          {products.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-100 border-t-pink-600"></div>
              <p className="text-slate-400 font-black uppercase text-[11px] tracking-widest">Accessing Storefront...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
              {products.map(product => (
                <div key={product.id} className="group cursor-pointer" onClick={() => handleProductSelect(product)}>
                  <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden mb-12 flex items-center justify-center p-20 rounded-[64px] group-hover:bg-slate-100 transition-all duration-700 hover:shadow-2xl">
                    <img src={product.imageUrl} alt={product.title} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-1000 drop-shadow-2xl" />
                    <div className="absolute inset-0 bg-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight">{product.title}</h3>
                    <div className="flex items-center gap-4">
                      <p className="text-slate-400 font-black uppercase text-[11px] tracking-widest">{product.price.toFixed(2)} {product.currency}</p>
                      <div className="h-1 w-8 bg-slate-100 rounded-full"></div>
                      <span className="text-[10px] font-black uppercase text-pink-600">Personalise +</span>
                    </div>
                  </div>
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
        <div className="flex-[3] relative flex items-center justify-center p-24 bg-white h-1/2 lg:h-auto">
          <button onClick={() => setStep('selection')} className="absolute top-12 left-12 p-5 text-slate-300 hover:text-slate-900 transition-all z-10 hover:scale-110">
            <ChevronLeft size={48} />
          </button>
          
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden select-none flex flex-wrap justify-around items-center rotate-[-15deg] uppercase">
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i} className="text-5xl font-black text-slate-900 m-12">STYLN BRAND</span>
            ))}
          </div>

          <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="max-w-full max-h-[80%] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] z-0 animate-in zoom-in-95 duration-700" />
        </div>

        <div className="flex-[2] bg-slate-50 p-20 lg:p-28 overflow-y-auto h-1/2 lg:h-auto border-l border-slate-100 custom-scrollbar">
          <div className="max-w-md mx-auto h-full flex flex-col">
            <h2 className="text-6xl font-black text-slate-900 mb-14 leading-[0.95] uppercase tracking-tighter">{selectedProduct.title}</h2>
            
            <div className="space-y-16 flex-1">
              <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-600">
                    <Sparkles size={22} />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">AI Concierge Advice</h4>
                </div>
                {aiInspiration ? (
                  <p className="text-slate-600 text-base font-medium leading-relaxed italic animate-in fade-in slide-in-from-bottom-2">
                    "{aiInspiration}"
                  </p>
                ) : (
                  <button 
                    onClick={fetchAiSuggestions}
                    disabled={isLoadingAi}
                    className="text-pink-600 hover:text-pink-700 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 active:scale-95"
                  >
                    {isLoadingAi ? 'Analyzing Trends...' : 'Unlock Design Suggestions'}
                    {!isLoadingAi && <div className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-ping"></div>}
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Details</h4>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{selectedProduct.description}</p>
                <div className="grid grid-cols-2 gap-8 pt-4">
                   <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase text-slate-300">Material</p>
                     <p className="text-xs font-bold text-slate-600">{selectedProduct.material || 'Premium Fabric'}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase text-slate-300">Size</p>
                     <p className="text-xs font-bold text-slate-600">{selectedProduct.dimensions || 'Standard'}</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4 pt-10">
                 <button 
                   onClick={() => setStep('customizer')}
                   className="group w-full flex items-center justify-between p-8 bg-pink-600 rounded-[40px] text-white font-black tracking-[0.3em] uppercase text-[12px] hover:bg-slate-900 transition-all shadow-2xl shadow-pink-200 hover:shadow-slate-300 active:scale-[0.98]"
                 >
                   Start Customizing
                   <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                 </button>
              </div>
            </div>

            <div className="mt-20 pt-10 border-t border-slate-200">
              <div className="flex items-center justify-between mb-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Estimated Base</span>
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{selectedProduct.price.toFixed(2)} <span className="text-xs text-slate-400">{selectedProduct.currency}</span></span>
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
          <header className="h-24 flex items-center justify-between px-16 border-b border-slate-50 bg-white z-30">
            <button onClick={() => setStep('details')} className="text-slate-300 hover:text-slate-900 transition-all p-4 hover:scale-110">
              <ChevronLeft size={40} />
            </button>
            <div className="flex gap-6">
              <button 
                onClick={fetchAiSuggestions}
                className="flex items-center gap-3 text-[10px] font-black uppercase text-pink-600 hover:bg-pink-50 transition-all px-8 py-4 border-2 border-pink-50 rounded-full bg-white shadow-sm active:scale-95"
              >
                <Sparkles size={16} /> Magic Suggest
              </button>
              <button onClick={clearAll} className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-300 hover:text-red-500 transition-all px-8 py-4 border-2 border-slate-50 rounded-full bg-white shadow-sm active:scale-95">
                <Trash size={16} /> Reset
              </button>
            </div>
          </header>

          <div className="flex-1 relative bg-slate-50/50 flex items-center justify-center p-16 overflow-hidden">
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
                  className="absolute bottom-16 right-16 bg-red-500 text-white p-6 rounded-full shadow-[0_20px_50px_rgba(239,68,68,0.4)] hover:bg-red-600 hover:scale-110 transition-all z-40 active:scale-90"
                >
                  <Trash2 size={28} />
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
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-2xl animate-in fade-in duration-500">
            <div className="bg-white rounded-[80px] p-24 max-w-2xl w-full text-center shadow-[0_50px_100px_rgba(0,0,0,0.2)] scale-in-center">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-12 ${showSuccess ? 'bg-emerald-50 text-emerald-500' : 'bg-pink-50 text-pink-500'}`}>
                {showSuccess ? <CheckCircle2 size={80} className="animate-in zoom-in duration-500" /> : <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-100 border-t-pink-600" />}
              </div>
              <h3 className="text-5xl font-black text-slate-900 mb-8 uppercase tracking-tighter">
                {showSuccess ? 'Design Secured' : 'Building Cart'}
              </h3>
              <p className="text-slate-400 font-black uppercase text-[12px] tracking-[0.4em] mb-12">
                {showSuccess ? "Transitioning to Secure Checkout..." : "Finalizing your masterpiece..."}
              </p>
              <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden p-0.5 border border-slate-100">
                <div className={`h-full bg-pink-600 rounded-full transition-all duration-[2000ms] ease-out ${showSuccess ? 'w-full' : 'w-1/3 animate-pulse'}`} />
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
