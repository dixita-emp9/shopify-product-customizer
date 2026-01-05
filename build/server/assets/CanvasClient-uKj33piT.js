import { jsxs, jsx } from "react/jsx-runtime";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image, Text, Transformer, Rect } from "react-konva";
import { Info } from "lucide-react";
const CustomTransformer = ({ trRef, isSelected }) => {
  useEffect(() => {
    if (isSelected && trRef.current && trRef.current.getLayer()) {
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  if (!isSelected) return null;
  return /* @__PURE__ */ jsx(
    Transformer,
    {
      ref: trRef,
      rotateEnabled: true,
      anchorSize: 14,
      anchorStroke: "#db2777",
      anchorFill: "white",
      anchorCornerRadius: 10,
      borderStroke: "#db2777",
      borderDash: [4, 4],
      keepRatio: true,
      enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"]
    }
  );
};
const URLImage = ({ src, x, y, width, height, rotation, isSelected, onSelect, onChange }) => {
  const [image, setImage] = useState(null);
  const shapeRef = useRef(null);
  const trRef = useRef(null);
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
  return /* @__PURE__ */ jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsx(
      Image,
      {
        image: image || void 0,
        x,
        y,
        width,
        height,
        rotation,
        draggable: true,
        ref: shapeRef,
        onClick: () => onSelect(),
        onTap: () => onSelect(),
        onDragEnd: (e) => {
          onChange({ position: { x: e.target.x(), y: e.target.y() } });
        },
        onTransformEnd: () => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            position: { x: node.x(), y: node.y() },
            size: {
              width: Math.max(20, node.width() * scaleX),
              height: Math.max(20, node.height() * scaleY)
            },
            rotation: node.rotation()
          });
        }
      }
    ),
    /* @__PURE__ */ jsx(CustomTransformer, { trRef, isSelected })
  ] });
};
const CustomText = ({ text, fontFamily, color, x, y, rotation, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef(null);
  const trRef = useRef(null);
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
    }
  }, [isSelected]);
  return /* @__PURE__ */ jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsx(
      Text,
      {
        text,
        x,
        y,
        rotation,
        fontSize: 40,
        fontFamily,
        fill: color,
        draggable: true,
        ref: shapeRef,
        onClick: () => onSelect(),
        onTap: () => onSelect(),
        onDragEnd: (e) => {
          onChange({ position: { x: e.target.x(), y: e.target.y() } });
        },
        onTransformEnd: () => {
          const node = shapeRef.current;
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            position: { x: node.x(), y: node.y() },
            rotation: node.rotation()
          });
        }
      }
    ),
    /* @__PURE__ */ jsx(CustomTransformer, { trRef, isSelected })
  ] });
};
const GridAids = ({ width, height }) => {
  const lines = [];
  const spacing = 50;
  for (let x = 0; x <= width; x += spacing) {
    lines.push(/* @__PURE__ */ jsx(Rect, { x, y: 0, width: 1, height, fill: "rgba(219, 39, 119, 0.1)" }, `v-${x}`));
  }
  for (let y = 0; y <= height; y += spacing) {
    lines.push(/* @__PURE__ */ jsx(Rect, { x: 0, y, width, height: 1, fill: "rgba(219, 39, 119, 0.1)" }, `h-${y}`));
  }
  return /* @__PURE__ */ jsx(React.Fragment, { children: lines });
};
const CustomizerCanvas = ({
  backgroundImageUrl,
  elements,
  onUpdateElement,
  onSelectElement,
  selectedId,
  width,
  height,
  showAids
}) => {
  const [bgImage, setBgImage] = useState(null);
  const stageRef = useRef(null);
  useEffect(() => {
    const img = new window.Image();
    img.src = backgroundImageUrl;
    img.crossOrigin = "anonymous";
    img.onload = () => setBgImage(img);
  }, [backgroundImageUrl]);
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      onSelectElement(null);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full w-full bg-white relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-pink-50 border-b border-pink-100 p-3 px-6 flex items-start gap-3 z-20", children: [
      /* @__PURE__ */ jsx(Info, { className: "text-pink-600 shrink-0 mt-0.5", size: 18 }),
      /* @__PURE__ */ jsx("div", { className: "text-pink-800 text-[11px] font-bold uppercase tracking-tight", children: /* @__PURE__ */ jsx("p", { children: "Letters: 2 lines, max 5 chars each • Embroidery: 1 line, max 12 chars" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex items-center justify-center bg-white relative p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden select-none flex flex-wrap justify-around items-center rotate-[-15deg]", children: Array.from({ length: 40 }).map((_, i) => /* @__PURE__ */ jsx("span", { className: "text-2xl font-black text-slate-900 m-8", children: "STYLN" }, i)) }),
      /* @__PURE__ */ jsxs(
        Stage,
        {
          width,
          height,
          onMouseDown: handleStageClick,
          onTouchStart: handleStageClick,
          ref: stageRef,
          className: "shadow-2xl bg-white rounded-2xl border border-slate-100 overflow-hidden",
          children: [
            /* @__PURE__ */ jsxs(Layer, { children: [
              bgImage && /* @__PURE__ */ jsx(
                Image,
                {
                  image: bgImage,
                  width,
                  height,
                  listening: false
                }
              ),
              showAids && /* @__PURE__ */ jsx(GridAids, { width, height })
            ] }),
            /* @__PURE__ */ jsx(Layer, { children: elements.map((el) => {
              if (el.type === "addon" && el.addon) {
                return /* @__PURE__ */ jsx(
                  URLImage,
                  {
                    src: el.addon.imageUrl,
                    x: el.position.x,
                    y: el.position.y,
                    width: el.size.width,
                    height: el.size.height,
                    rotation: el.rotation,
                    isSelected: el.instanceId === selectedId,
                    onSelect: () => onSelectElement(el.instanceId),
                    onChange: (updates) => onUpdateElement(el.instanceId, updates)
                  },
                  el.instanceId
                );
              }
              if ((el.type === "image" || el.type === "vinyl") && el.imageUrl) {
                return /* @__PURE__ */ jsx(
                  URLImage,
                  {
                    src: el.imageUrl,
                    x: el.position.x,
                    y: el.position.y,
                    width: el.size.width,
                    height: el.size.height,
                    rotation: el.rotation,
                    isSelected: el.instanceId === selectedId,
                    onSelect: () => onSelectElement(el.instanceId),
                    onChange: (updates) => onUpdateElement(el.instanceId, updates)
                  },
                  el.instanceId
                );
              }
              if (el.type === "text" || el.type === "embroidery") {
                return /* @__PURE__ */ jsx(
                  CustomText,
                  {
                    text: el.text,
                    fontFamily: el.fontFamily,
                    color: el.color,
                    x: el.position.x,
                    y: el.position.y,
                    rotation: el.rotation,
                    isSelected: el.instanceId === selectedId,
                    onSelect: () => onSelectElement(el.instanceId),
                    onChange: (updates) => onUpdateElement(el.instanceId, updates)
                  },
                  el.instanceId
                );
              }
              return null;
            }) })
          ]
        }
      )
    ] })
  ] });
};
export {
  CustomizerCanvas as default
};
