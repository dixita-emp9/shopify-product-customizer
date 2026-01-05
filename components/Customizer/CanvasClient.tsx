
import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Text as KonvaText, Rect } from 'react-konva';
import { CanvasElement } from '../../types';
import { Info, Move } from 'lucide-react';

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
    // Add check for layer existence before calling batchDraw
    if (isSelected && trRef.current && trRef.current.getLayer()) {
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  if (!isSelected) return null;

  return (
    <Transformer
      ref={trRef}
      rotateEnabled={true}
      anchorSize={14}
      anchorStroke="#db2777"
      anchorFill="white"
      anchorCornerRadius={10}
      borderStroke="#db2777"
      borderDash={[4, 4]}
      keepRatio={true}
      enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
    />
  );
};

const URLImage = ({ src, x, y, width, height, rotation, isSelected, onSelect, onChange }: any) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  // Fix: Initialize useRef with null to provide the expected 1 argument (initial value)
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => setImage(img);
  }, [src]);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
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
        // Fix: Wrap onSelect in an arrow function to avoid passing Konva event argument to a function that expects 0
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
  // Fix: Initialize useRef with null to provide the expected 1 argument (initial value)
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <KonvaText
        text={text}
        x={x}
        y={y}
        rotation={rotation}
        fontSize={40}
        fontFamily={fontFamily}
        fill={color}
        draggable
        ref={shapeRef}
        // Fix: Wrap onSelect in an arrow function to avoid passing Konva event argument to a function that expects 0
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
  const spacing = 50;
  for (let x = 0; x <= width; x += spacing) {
    lines.push(<Rect key={`v-${x}`} x={x} y={0} width={1} height={height} fill="rgba(219, 39, 119, 0.1)" />);
  }
  for (let y = 0; y <= height; y += spacing) {
    lines.push(<Rect key={`h-${y}`} x={0} y={y} width={width} height={1} fill="rgba(219, 39, 119, 0.1)" />);
  }
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
    <div className="flex flex-col h-full w-full bg-white relative overflow-hidden">
      <div className="bg-pink-50 border-b border-pink-100 p-3 px-6 flex items-start gap-3 z-20">
        <Info className="text-pink-600 shrink-0 mt-0.5" size={18} />
        <div className="text-pink-800 text-[11px] font-bold uppercase tracking-tight">
          <p>Letters: 2 lines, max 5 chars each • Embroidery: 1 line, max 12 chars</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white relative p-4">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden select-none flex flex-wrap justify-around items-center rotate-[-15deg]">
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="text-2xl font-black text-slate-900 m-8">STYLN</span>
          ))}
        </div>

        <Stage
          width={width}
          height={height}
          onMouseDown={handleStageClick}
          onTouchStart={handleStageClick}
          ref={stageRef}
          className="shadow-2xl bg-white rounded-2xl border border-slate-100 overflow-hidden"
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
    </div>
  );
};

export default CustomizerCanvas;
