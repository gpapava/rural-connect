"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { ResizableImage } from "./ResizableImage";
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  List, ListOrdered, Link as LinkIcon,
  AlignLeft, AlignCenter, AlignRight, Heading2, Heading3,
  Image as ImageIcon, Video, Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: Props) {
  const t = useTranslations("editor");
  const effectivePlaceholder = placeholder ?? t("placeholder");
  const [showSource, setShowSource] = useState(false);
  const [sourceHtml, setSourceHtml] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: effectivePlaceholder }),
      ResizableImage.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt(t("promptUrl"));
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  const insertImage = () => {
    const url = window.prompt(t("promptImageUrl"));
    if (url?.trim()) editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  const toggleSource = () => {
    if (showSource) {
      editor.commands.setContent(sourceHtml);
      onChange(editor.getHTML());
      setShowSource(false);
    } else {
      setSourceHtml(editor.getHTML());
      setShowSource(true);
    }
  };

  const insertVideo = () => {
    const url = window.prompt(t("promptVideoUrl"));
    if (!url?.trim()) return;

    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) {
      // TipTap YouTube extension doesn't support Vimeo — insert as iframe HTML
      editor.chain().focus().insertContent(
        `<iframe src="https://player.vimeo.com/video/${vimeo[1]}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
      ).run();
    } else {
      // Let TipTap's YouTube extension handle it
      editor.commands.setYoutubeVideo({ src: url.trim() });
    }
  };

  const ToolbarBtn = ({
    onClick, active, title, children,
  }: { onClick: () => void; active?: boolean; title?: string; children: React.ReactNode }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={cn(
        "rounded p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors",
        active && "bg-gray-200 text-gray-900"
      )}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="mx-1 w-px bg-gray-300" />;

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title={t("bold")}>
          <Bold className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title={t("italic")}>
          <Italic className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title={t("underline")}>
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title={t("strikethrough")}>
          <Strikethrough className="h-4 w-4" />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title={t("heading2")}>
          <Heading2 className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title={t("heading3")}>
          <Heading3 className="h-4 w-4" />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title={t("bulletList")}>
          <List className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title={t("orderedList")}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title={t("alignLeft")}>
          <AlignLeft className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title={t("alignCenter")}>
          <AlignCenter className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title={t("alignRight")}>
          <AlignRight className="h-4 w-4" />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={setLink} active={editor.isActive("link")} title={t("insertLink")}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={insertImage} title={t("insertImage")}>
          <ImageIcon className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn onClick={insertVideo} title={t("embedVideo")}>
          <Video className="h-4 w-4" />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={toggleSource} active={showSource} title={t("editHtmlSource")}>
          <Code2 className="h-4 w-4" />
        </ToolbarBtn>
      </div>
      {showSource ? (
        <div className="flex flex-col">
          <textarea
            value={sourceHtml}
            onChange={(e) => setSourceHtml(e.target.value)}
            className="w-full resize-y px-4 py-3 font-mono text-xs text-gray-800 focus:outline-none"
            style={{ minHeight: 200 }}
            spellCheck={false}
          />
          <div className="flex items-center gap-2 border-t border-gray-200 bg-gray-50 px-3 py-2">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); toggleSource(); }}
              className="rounded-lg bg-[#1a73e8] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1557b0] transition-colors"
            >
              {t("applyHtml")}
            </button>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setShowSource(false); }}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {t("cancel")}
            </button>
            <span className="ml-auto text-xs text-gray-400">{t("rawHtmlEditor")}</span>
          </div>
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
