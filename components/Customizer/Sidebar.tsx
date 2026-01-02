
import React, { useState } from 'react';
import { 
  Addon, 
  AddonCategory, 
  CustomizationMode, 
  Product 
} from '../../types';
import { 
  EMBROIDERY_FONTS, 
  EMBROIDERY_COLORS 
} from '../../constants';
import { 
  ChevronDown, 
  Check, 
  ImageIcon,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  product: Product;
  selectedVariantId: string;
  onVariantChange: (id: string) => void;
  mode: CustomizationMode;
  onModeChange: (mode: CustomizationMode) => void;
  onAddAddon: (addon: Addon) => void;
  onUpdateEmbroidery: (text: string, font: string, color: string) => void;
  onAddVinyl: (file: File) => void;
  totalPrice: number;
  currency: string;
  onBack: () => void;
  onAddToCart: () => void;
  showAids: boolean;
  onToggleAids: (show: boolean) => void;
  embroideryState: { text: string, font: string, color: string };
  letterAddons: Addon[];
  patchAddons: Addon[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
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
  const [activeTab, setActiveTab] = useState<'LETTERS' | 'PATCHES'>('LETTERS');
  const [drillDownGroup, setDrillDownGroup] = useState<string | null>(null);
  const [autoTidy, setAutoTidy] = useState(false);

  const handleModeChange = (newMode: CustomizationMode) => {
    onModeChange(newMode);
    setDrillDownGroup(null);
  };

  // Group letters by their base color for selection
  const letterGroups = Array.from(new Set(letterAddons.map(a => a.baseColorGroup))).filter(Boolean);
  
  // Find a representative addon for the color group UI
  const getGroupAddon = (group: string) => letterAddons.find(a => a.baseColorGroup === group);

  const filteredLetters = drillDownGroup 
    ? letterAddons.filter(a => a.baseColorGroup === drillDownGroup)
    : [];

  return (
    <div className="w-full lg:w-[450px] h-full flex flex-col bg-slate-50 border-l border-slate-200 overflow-hidden shadow-2xl">
      <div className="p-8 bg-white border-b border-slate-200">
        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Personalisation Mode</label>
        <div className="relative group">
          <select 
            className="w-full appearance-none bg-slate-50 border-2 border-pink-600 rounded-2xl px-5 py-4 font-black text-slate-900 focus:outline-none transition-all cursor-pointer text-xs uppercase tracking-widest"
            value={mode || ''}
            onChange={(e) => handleModeChange(e.target.value as CustomizationMode)}
          >
            <option value="COLOR">Pick Personalisation</option>
            <option value="LETTERS_PATCHES">Letters & Patches</option>
            <option value="EMBROIDERY">Embroidery</option>
            <option value="VINYL">Cricut / Vinyl</option>
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-600 pointer-events-none" size={20} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        
        {mode === 'COLOR' && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Select Product Variant</h3>
            <div className="grid grid-cols-4 gap-4">
              {product.variants?.map((v) => (
                <button 
                  key={v.id}
                  onClick={() => onVariantChange(v.id)}
                  className="group flex flex-col items-center gap-3"
                >
                  <div 
                    className={`w-14 h-14 rounded-full border-2 transition-all flex items-center justify-center ${selectedVariantId === v.id ? 'border-pink-600 scale-110 shadow-lg' : 'border-white hover:border-slate-200'}`}
                    style={{ backgroundColor: v.color }}
                  >
                    {selectedVariantId === v.id && <Check className="text-white drop-shadow-md" size={24} />}
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{v.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'LETTERS_PATCHES' && (
          <div className="space-y-6">
            <div className="flex bg-slate-200/50 p-1.5 rounded-full mb-6">
              <button
                onClick={() => { setActiveTab('LETTERS'); setDrillDownGroup(null); }}
                className={`flex-1 py-3 rounded-full text-[10px] font-black tracking-widest transition-all ${
                  activeTab === 'LETTERS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                LETTERS
              </button>
              <button
                onClick={() => { setActiveTab('PATCHES'); setDrillDownGroup(null); }}
                className={`flex-1 py-3 rounded-full text-[10px] font-black tracking-widest transition-all ${
                  activeTab === 'PATCHES' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                PATCHES
              </button>
            </div>

            {activeTab === 'LETTERS' ? (
              drillDownGroup ? (
                <div className="space-y-6">
                  <button 
                    onClick={() => setDrillDownGroup(null)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-pink-600 hover:text-pink-700"
                  >
                    <ChevronLeft size={16} /> Back to colors
                  </button>
                  <div className="grid grid-cols-4 gap-3">
                    {filteredLetters.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => onAddAddon(item)}
                        className="aspect-square bg-white rounded-2xl p-3 border border-slate-100 hover:border-pink-500 transition-all shadow-sm flex items-center justify-center group"
                      >
                        <img src={item.imageUrl} alt={item.title} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-5">
                  {letterGroups.map((group) => {
                    const addon = getGroupAddon(group!);
                    if (!addon) return null;
                    return (
                      <div 
                        key={group}
                        className="group flex flex-col items-center cursor-pointer"
                        onClick={() => setDrillDownGroup(group!)}
                      >
                        <div className="w-full aspect-square bg-white rounded-2xl p-4 border border-slate-100 group-hover:border-pink-500 transition-all flex items-center justify-center mb-3 shadow-sm">
                          <img src={addon.imageUrl} alt={group!} className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="text-[9px] uppercase font-black text-slate-400 text-center leading-none tracking-tight">
                          {group}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {patchAddons.map((addon) => (
                  <div 
                    key={addon.id}
                    className="group flex flex-col items-center cursor-pointer"
                    onClick={() => onAddAddon(addon)}
                  >
                    <div className="w-full aspect-square bg-white rounded-2xl p-4 border border-slate-100 group-hover:border-pink-500 transition-all flex items-center justify-center mb-3 shadow-sm">
                      <img src={addon.imageUrl} alt={addon.title} className="max-w-full max-h-full object-contain" />
                    </div>
                    <span className="text-[9px] uppercase font-black text-slate-400 text-center leading-none tracking-tight">
                      {addon.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === 'EMBROIDERY' && (
          <div className="space-y-8">
             <div className="bg-pink-50 p-5 rounded-2xl">
              <p className="text-[11px] text-pink-800 font-bold leading-relaxed uppercase tracking-tight">
                Up to 60 characters max. 1 line with up to 12 characters. Case sensitive.
              </p>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Font Style</label>
              <div className="grid grid-cols-2 gap-3">
                {EMBROIDERY_FONTS.map(font => (
                  <button 
                    key={font.id}
                    onClick={() => onUpdateEmbroidery(embroideryState.text, font.family, embroideryState.color)}
                    className={`py-4 px-4 border-2 rounded-2xl font-bold transition-all text-sm ${embroideryState.font === font.family ? 'border-pink-600 bg-pink-50 text-pink-600' : 'border-slate-100 bg-white text-slate-400'}`}
                    style={{ fontFamily: font.family }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thread Color</label>
              <div className="flex flex-wrap gap-3">
                {EMBROIDERY_COLORS.map(color => (
                  <button 
                    key={color.name}
                    onClick={() => onUpdateEmbroidery(embroideryState.text, embroideryState.font, color.hex)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${embroideryState.color === color.hex ? 'border-pink-600 scale-125 shadow-md' : 'border-white hover:border-slate-200'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Embroidery Text</label>
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={60}
                  value={embroideryState.text}
                  onChange={(e) => onUpdateEmbroidery(e.target.value, embroideryState.font, embroideryState.color)}
                  placeholder="Enter text..."
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-5 font-black text-slate-900 focus:outline-none focus:border-pink-600 transition-all shadow-sm uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {mode === 'VINYL' && (
          <div className="space-y-8">
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ImageIcon size={40} />
              </div>
              <label className="inline-block px-10 py-5 bg-pink-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-pink-700 transition-colors shadow-lg shadow-pink-100">
                Choose File
                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onAddVinyl(e.target.files[0])} />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="p-10 bg-white border-t border-slate-100 space-y-10">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto Tidy & Align</span>
            <button 
              onClick={() => setAutoTidy(!autoTidy)}
              className={`w-14 h-7 rounded-full transition-all relative ${autoTidy ? 'bg-pink-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${autoTidy ? 'left-[32px]' : 'left-1.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Show design aids</span>
            <button 
              onClick={() => onToggleAids(!showAids)}
              className={`w-14 h-7 rounded-full transition-all relative ${showAids ? 'bg-pink-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${showAids ? 'left-[32px]' : 'left-1.5'}`} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">
              {totalPrice.toFixed(2)} {currency}
            </span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={onBack}
              className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-full font-black text-[10px] tracking-[0.2em] hover:bg-slate-200 transition-all uppercase"
            >
              Back
            </button>
            <button 
              onClick={onAddToCart}
              className="flex-[2] py-5 bg-pink-600 text-white rounded-full font-black text-[10px] tracking-[0.2em] hover:bg-pink-700 shadow-2xl shadow-pink-200 transition-all uppercase"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
