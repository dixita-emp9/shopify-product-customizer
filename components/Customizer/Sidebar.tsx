
import React, { useState } from 'react';
import { 
  Addon, 
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

  // Letters grouping logic
  const letterGroups: string[] = Array.from(new Set(letterAddons.map(a => a.baseColorGroup))).filter((g): g is string => !!g);
  const filteredLetters = drillDownGroup && activeTab === 'LETTERS'
    ? letterAddons.filter(a => a.baseColorGroup === drillDownGroup)
    : [];

  // Patches grouping logic
  const patchGroups: string[] = Array.from(new Set(patchAddons.map(a => a.designGroup))).filter((g): g is string => !!g);
  const filteredPatches = drillDownGroup && activeTab === 'PATCHES'
    ? patchAddons.filter(a => a.designGroup === drillDownGroup)
    : [];

  const getRepresentativeAddon = (group: string, category: 'letters' | 'patches') => {
    if (category === 'letters') {
      return letterAddons.find(a => a.baseColorGroup === group && (a.letter === 'A' || a.letter === 'S'));
    }
    return patchAddons.find(a => a.designGroup === group);
  };

  return (
    <div className="w-full lg:w-[450px] h-full flex flex-col bg-white border-l border-slate-100 overflow-hidden">
      {/* Mode Header */}
      <div className="p-8 border-b border-slate-50">
        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Personalisation Mode</label>
        <div className="relative">
          <select 
            className="w-full appearance-none bg-slate-50 border-2 border-pink-600 rounded-2xl px-6 py-5 font-black text-slate-900 focus:outline-none transition-all cursor-pointer text-xs uppercase tracking-widest shadow-lg shadow-pink-50"
            value={mode || ''}
            onChange={(e) => handleModeChange(e.target.value as CustomizationMode)}
          >
            <option value="COLOR">Pick Personalisation</option>
            <option value="LETTERS_PATCHES">Letters & Patches</option>
            <option value="EMBROIDERY">Embroidery</option>
            <option value="VINYL">Cricut / Vinyl</option>
          </select>
          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-pink-600 pointer-events-none" size={18} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        
        {mode === 'COLOR' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Select Base Colour</h3>
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
                  <span className={`text-[9px] font-black uppercase tracking-tighter ${selectedVariantId === v.id ? 'text-pink-600' : 'text-slate-400'}`}>
                    {v.title.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'LETTERS_PATCHES' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex bg-slate-100 p-1.5 rounded-full">
              <button
                onClick={() => { setActiveTab('LETTERS'); setDrillDownGroup(null); }}
                className={`flex-1 py-4 rounded-full text-[10px] font-black tracking-widest transition-all ${
                  activeTab === 'LETTERS' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'
                }`}
              >
                LETTERS
              </button>
              <button
                onClick={() => { setActiveTab('PATCHES'); setDrillDownGroup(null); }}
                className={`flex-1 py-4 rounded-full text-[10px] font-black tracking-widest transition-all ${
                  activeTab === 'PATCHES' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'
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
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    <ChevronLeft size={16} /> Back to colors
                  </button>
                  <div className="grid grid-cols-4 gap-4">
                    {filteredLetters.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => onAddAddon(item)}
                        className="aspect-square bg-white rounded-2xl p-4 border border-slate-100 hover:border-pink-500 hover:shadow-xl transition-all group"
                      >
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {letterGroups.map((group) => {
                    const addon = getRepresentativeAddon(group, 'letters');
                    if (!addon) return null;
                    return (
                      <div 
                        key={group}
                        className="group flex flex-col items-center cursor-pointer"
                        onClick={() => setDrillDownGroup(group)}
                      >
                        <div className="w-full aspect-square bg-slate-50 rounded-3xl p-5 border border-transparent group-hover:border-pink-500 group-hover:bg-white group-hover:shadow-xl transition-all flex items-center justify-center mb-3">
                          <img src={addon.imageUrl} alt={group} className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="text-[10px] uppercase font-black text-slate-400 group-hover:text-slate-900 transition-colors">
                          {group}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              drillDownGroup ? (
                <div className="space-y-6">
                  <button 
                    onClick={() => setDrillDownGroup(null)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    <ChevronLeft size={16} /> Back to designs
                  </button>
                  <div className="grid grid-cols-3 gap-4">
                    {filteredPatches.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => onAddAddon(item)}
                        className="aspect-square bg-white rounded-2xl p-5 border border-slate-100 hover:border-pink-500 hover:shadow-xl transition-all group"
                      >
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                        <p className="mt-2 text-[9px] font-black uppercase text-slate-400">{item.colorName}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {patchGroups.map((group) => {
                    const addon = getRepresentativeAddon(group, 'patches');
                    if (!addon) return null;
                    return (
                      <div 
                        key={group}
                        className="group flex flex-col items-center cursor-pointer"
                        onClick={() => setDrillDownGroup(group)}
                      >
                        <div className="w-full aspect-square bg-slate-50 rounded-[40px] p-8 border border-transparent group-hover:border-pink-500 group-hover:bg-white group-hover:shadow-xl transition-all flex items-center justify-center mb-4">
                          <img src={addon.imageUrl} alt={group} className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="text-[11px] uppercase font-black text-slate-400 group-hover:text-slate-900 tracking-wider">
                          {group}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        )}

        {mode === 'EMBROIDERY' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-pink-50 p-6 rounded-[32px] border border-pink-100">
              <p className="text-[11px] text-pink-800 font-bold leading-relaxed uppercase tracking-tight">
                Case sensitive. 1 line max. 12 characters max. Professional finish.
              </p>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Font Style</label>
              <div className="grid grid-cols-2 gap-4">
                {EMBROIDERY_FONTS.map(font => (
                  <button 
                    key={font.id}
                    onClick={() => onUpdateEmbroidery(embroideryState.text, font.family, embroideryState.color)}
                    className={`py-5 px-4 border-2 rounded-2xl font-bold transition-all text-sm ${embroideryState.font === font.family ? 'border-pink-600 bg-pink-50 text-pink-600' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                    style={{ fontFamily: font.family }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Thread Colour</label>
              <div className="flex flex-wrap gap-4">
                {EMBROIDERY_COLORS.map(color => (
                  <button 
                    key={color.name}
                    onClick={() => onUpdateEmbroidery(embroideryState.text, embroideryState.font, color.hex)}
                    className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${embroideryState.color === color.hex ? 'border-pink-600 scale-125 shadow-lg' : 'border-white hover:border-slate-200'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Embroidery Text</label>
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={12}
                  value={embroideryState.text}
                  onChange={(e) => onUpdateEmbroidery(e.target.value, embroideryState.font, embroideryState.color)}
                  placeholder="Type here..."
                  className="w-full bg-slate-50 border-2 border-transparent rounded-3xl px-8 py-6 font-black text-slate-900 focus:outline-none focus:border-pink-600 focus:bg-white transition-all shadow-inner text-lg uppercase tracking-wider"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">
                  {embroideryState.text.length}/12
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'VINYL' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[48px] p-12 text-center space-y-8 shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <ImageIcon size={48} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-900 uppercase">Custom Vinyl Graphic</p>
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
                  Upload your logo or high-res artwork.<br/>Max file size 5MB.
                </p>
              </div>
              <label className="inline-block px-12 py-6 bg-pink-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:bg-pink-700 transition-all shadow-2xl shadow-pink-200 active:scale-95">
                Select Artwork
                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onAddVinyl(e.target.files[0])} />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Summary */}
      <div className="p-10 bg-white border-t border-slate-50 space-y-10">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alignment Assist</span>
            <button 
              onClick={() => setAutoTidy(!autoTidy)}
              className={`w-14 h-7 rounded-full transition-all relative ${autoTidy ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${autoTidy ? 'left-[32px]' : 'left-1.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grid Overlays</span>
            <button 
              onClick={() => onToggleAids(!showAids)}
              className={`w-14 h-7 rounded-full transition-all relative ${showAids ? 'bg-pink-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${showAids ? 'left-[32px]' : 'left-1.5'}`} />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-baseline justify-between border-t border-slate-50 pt-8">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subtotal</span>
            <span className="text-4xl font-black text-slate-900 tracking-tighter">
              {totalPrice.toFixed(2)} <span className="text-xs text-slate-400 font-bold ml-1">{currency}</span>
            </span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={onBack}
              className="flex-1 py-6 bg-slate-50 text-slate-500 rounded-full font-black text-[10px] tracking-widest hover:bg-slate-100 transition-all uppercase"
            >
              Back
            </button>
            <button 
              onClick={onAddToCart}
              className="flex-[2] py-6 bg-pink-600 text-white rounded-full font-black text-[10px] tracking-widest hover:bg-pink-700 shadow-2xl shadow-pink-200 transition-all uppercase active:scale-[0.98]"
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
