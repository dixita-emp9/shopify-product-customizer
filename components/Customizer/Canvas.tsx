import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Text as KonvaText, Rect } from 'react-konva';
import { CanvasElement } from '../../types';
import { Info } from 'lucide-react';

interface CanvasProps {
  backgroundImageUrl: string;
  elements: CanvasElement[];
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onSelectElement: (id: string | null) => void;
  selectedId: string | null;
  width: number;
  height: number;
  showAids: boolean;
}

const CustomTransformer = ({ trRef, isSelected }: any) => {
  useEffect(() => {
    if (isSelected && trRef.current && trRef.current.getLayer()) {
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  if (!isSelected) return null;

  return (
    <Transformer
      ref={trRef}
      rotateEnabled={true}
      anchorSize={18}
      anchorStroke="#db2777"
      anchorFill="white"
      anchorCornerRadius={12}
      borderStroke="#db2777"
      borderDash={[6, 6]}
      borderStrokeWidth={2}
      keepRatio={true}
      enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
    />
  );
};

const URLImage = ({ src, x, y, width, height, rotation, isSelected, onSelect, onChange }: any) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const img = new window.Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => setImage(img);
  }, [src]);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      if (trRef.current && typeof trRef.current.nodes === 'function') {
        trRef.current.nodes([shapeRef.current]);
      }
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <KonvaImage
        image={image || undefined}
        x={x}
        y={y}
        width={width}
        height={height}
        rotation={rotation}
        draggable
        ref={shapeRef}
        onClick={() => onSelect()}
        onTap={() => onSelect()}
        onDragEnd={(e) => {
          onChange({ position: { x: e.target.x(), y: e.target.y() } });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            position: { x: node.x(), y: node.y() },
            size: {
              width: Math.max(20, node.width() * scaleX),
              height: Math.max(20, node.height() * scaleY),
            },
            rotation: node.rotation(),
          });
        }}
      />
      <CustomTransformer trRef={trRef} isSelected={isSelected} />
    </React.Fragment>
  );
};

const CustomText = ({ text, fontFamily, color, x, y, rotation, isSelected, onSelect, onChange }: any) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      if (trRef.current && typeof trRef.current.nodes === 'function') {
        trRef.current.nodes([shapeRef.current]);
      }
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <KonvaText
        text={text}
        x={x}
        y={y}
        rotation={rotation}
        fontSize={48}
        fontFamily={fontFamily}
        fill={color}
        draggable
        ref={shapeRef}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={10}
        shadowOffset={{ x: 2, y: 2 }}
        onClick={() => onSelect()}
        onTap={() => onSelect()}
        onDragEnd={(e) => {
          onChange({ position: { x: e.target.x(), y: e.target.y() } });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            position: { x: node.x(), y: node.y() },
            rotation: node.rotation(),
          });
        }}
      />
      <CustomTransformer trRef={trRef} isSelected={isSelected} />
    </React.Fragment>
  );
};

const GridAids = ({ width, height }: { width: number, height: number }) => {
  const lines = [];
  const spacing = 40;
  for (let x = 0; x <= width; x += spacing) {
    lines.push(<Rect key={`v-${x}`} x={x} y={0} width={1} height={height} fill="rgba(219, 39, 119, 0.08)" />);
  }
  for (let y = 0; y <= height; y += spacing) {
    lines.push(<Rect key={`h-${y}`} x={0} y={y} width={width} height={1} fill="rgba(219, 39, 119, 0.08)" />);
  }
  lines.push(<Rect key="v-center" x={width/2} y={0} width={2} height={height} fill="rgba(219, 39, 119, 0.2)" />);
  lines.push(<Rect key="h-center" x={0} y={height/2} width={width} height={2} fill="rgba(219, 39, 119, 0.2)" />);
  
  return <React.Fragment>{lines}</React.Fragment>;
};

const CustomizerCanvas: React.FC<CanvasProps> = ({
  backgroundImageUrl,
  elements,
  onUpdateElement,
  onSelectElement,
  selectedId,
  width,
  height,
  showAids
}) => {
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const img = new window.Image();
    img.src = backgroundImageUrl;
    img.crossOrigin = "anonymous";
    img.onload = () => setBgImage(img);
  }, [backgroundImageUrl]);

  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      onSelectElement(null);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative overflow-hidden rounded-[64px] shadow-2xl border border-white">
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-5 px-10 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Info className="text-pink-600" size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Workspace</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase">Synchronized</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white relative p-10">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden select-none flex flex-wrap justify-around items-center rotate-[-25deg]">
          {Array.from({ length: 48 }).map((_, i) => (
            <span key={i} className="text-3xl font-black text-slate-900 m-10">STYLN BRAND</span>
          ))}
        </div>

        <Stage
          width={width}
          height={height}
          onMouseDown={handleStageClick}
          onTouchStart={handleStageClick}
          ref={stageRef}
          className="shadow-[0_40px_100px_rgba(0,0,0,0.1)] bg-white rounded-[40px] border border-slate-50 overflow-hidden"
        >
          <Layer>
            {bgImage && (
              <KonvaImage
                image={bgImage}
                width={width}
                height={height}
                listening={false}
              />
            )}
            {showAids && <GridAids width={width} height={height} />}
          </Layer>
          <Layer>
            {elements.map((el) => {
              if (el.type === 'addon' && el.addon) {
                return (
                  <URLImage
                    key={el.instanceId}
                    src={el.addon.imageUrl}
                    x={el.position.x}
                    y={el.position.y}
                    width={el.size.width}
                    height={el.size.height}
                    rotation={el.rotation}
                    isSelected={el.instanceId === selectedId}
                    onSelect={() => onSelectElement(el.instanceId)}
                    onChange={(updates: any) => onUpdateElement(el.instanceId, updates)}
                  />
                );
              }
              if ((el.type === 'image' || el.type === 'vinyl') && el.imageUrl) {
                return (
                  <URLImage
                    key={el.instanceId}
                    src={el.imageUrl}
                    x={el.position.x}
                    y={el.position.y}
                    width={el.size.width}
                    height={el.size.height}
                    rotation={el.rotation}
                    isSelected={el.instanceId === selectedId}
                    onSelect={() => onSelectElement(el.instanceId)}
                    onChange={(updates: any) => onUpdateElement(el.instanceId, updates)}
                  />
                );
              }
              if (el.type === 'text' || el.type === 'embroidery') {
                return (
                  <CustomText
                    key={el.instanceId}
                    text={el.text}
                    fontFamily={el.fontFamily}
                    color={el.color}
                    x={el.position.x}
                    y={el.position.y}
                    rotation={el.rotation}
                    isSelected={el.instanceId === selectedId}
                    onSelect={() => onSelectElement(el.instanceId)}
                    onChange={(updates: any) => onUpdateElement(el.instanceId, updates)}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </div>

      <div className="absolute bottom-10 left-10 pointer-events-none z-20">
         <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 shadow-sm">
           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Dimensions</span>
           <span className="text-[11px] font-black text-slate-900 uppercase">1:1 High-Res Preview</span>
         </div>
      </div>
    </div>
  );
};

export default CustomizerCanvas;