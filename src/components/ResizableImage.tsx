"use client";

import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { useRef, useCallback } from "react";

function ResizableImageView({ node, updateAttributes, selected }: any) {
  const imgRef = useRef<HTMLImageElement>(null);
  const startX = useRef(0);
  const startW = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startX.current = e.clientX;
      startW.current = imgRef.current?.offsetWidth ?? 200;

      const onMove = (ev: MouseEvent) => {
        const w = Math.max(50, startW.current + ev.clientX - startX.current);
        updateAttributes({ width: w });
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [updateAttributes]
  );

  return (
    <NodeViewWrapper as="span" className="inline-block relative">
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt ?? ""}
        style={{
          width: node.attrs.width ? `${node.attrs.width}px` : "auto",
          maxWidth: "100%",
          display: "block",
        }}
        draggable={false}
      />
      {selected && (
        <span
          onMouseDown={onMouseDown}
          className="absolute -right-1 -bottom-1 h-3 w-3 rounded-sm bg-blue-500 ring-2 ring-white cursor-se-resize"
        />
      )}
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => {
          if (el.style.width) return parseInt(el.style.width);
          const w = el.getAttribute("width");
          return w ? parseInt(w) : null;
        },
        renderHTML: (attrs) =>
          attrs.width
            ? { style: `width: ${attrs.width}px`, width: attrs.width }
            : {},
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});
