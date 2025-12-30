import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Table,
  Video,
  AlertCircle,
  Minus,
  Eye,
  Edit,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

type ModalType = "link" | "image" | "video" | "table" | null;

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
}: MarkdownEditorProps) {
  const [localValue, setLocalValue] = useState(value ?? "");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isFocusedRef = useRef(false);
  const lastPropValueRef = useRef(value ?? "");

  const [isPreview, setIsPreview] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] = useState({
    url: "",
    alt: "",
    text: "",
    rows: "3",
    cols: "3",
  });

  // Keep local value in sync with external changes (e.g. loading a post),
  // but never overwrite while the user is actively typing.
  useEffect(() => {
    const next = value ?? "";
    if (next === lastPropValueRef.current) return;
    lastPropValueRef.current = next;
    if (!isFocusedRef.current) {
      setLocalValue(next);
    }
  }, [value]);

  // Push updates to parent immediately so "Save" always uses the latest content.
  const flush = (nextValue: string) => {
    lastPropValueRef.current = nextValue;
    onChange(nextValue);
  };

  // Helper to insert text at cursor position
  const insertText = (before: string, after: string = "", ph: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = localValue.substring(start, end) || ph;
    const newText =
      localValue.substring(0, start) +
      before +
      selectedText +
      after +
      localValue.substring(end);

    setLocalValue(newText);
    flush(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = localValue.substring(0, start) + text + localValue.substring(end);

    setLocalValue(newText);
    flush(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      const newCursorPos = start + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  };

  // Toolbar actions
  const handleBold = () => insertText("**", "**", "bold text");
  const handleItalic = () => insertText("*", "*", "italic text");
  const handleH1 = () => insertText("\n# ", "\n", "Heading 1");
  const handleH2 = () => insertText("\n## ", "\n", "Heading 2");
  const handleH3 = () => insertText("\n### ", "\n", "Heading 3");
  const handleBulletList = () => insertText("\n- ", "\n", "List item");
  const handleNumberedList = () => insertText("\n1. ", "\n", "List item");
  const handleQuote = () => insertText("\n> ", "\n", "Quote text");
  const handleCode = () => insertText("\n```\n", "\n```\n", "code");
  const handleHorizontalRule = () => insertAtCursor("\n\n---\n\n");
  const handleCallout = () => {
    insertAtCursor("\n> [!NOTE]\n> This is an important callout message.\n\n");
  };

  // Modal submit handlers
  const handleLinkSubmit = () => {
    const markdown = `[${modalData.text || modalData.url}](${modalData.url})`;
    insertAtCursor(markdown);
    setModalType(null);
    setModalData({ url: "", alt: "", text: "", rows: "3", cols: "3" });
  };

  const handleImageSubmit = () => {
    const markdown = `![${modalData.alt || "Image"}](${modalData.url})`;
    insertAtCursor(markdown);
    setModalType(null);
    setModalData({ url: "", alt: "", text: "", rows: "3", cols: "3" });
  };

  const handleVideoSubmit = () => {
    let embedCode = "";
    const url = modalData.url;

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be")
        ? url.split("/").pop()?.split("?")[0]
        : url.split("v=")[1]?.split("&")[0];
      embedCode = `\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>\n`;
    } else if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      embedCode = `\n<iframe width="560" height="315" src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen></iframe>\n`;
    } else {
      embedCode = `\n<video src="${url}" controls width="100%"></video>\n`;
    }

    insertAtCursor(embedCode);
    setModalType(null);
    setModalData({ url: "", alt: "", text: "", rows: "3", cols: "3" });
  };

  const handleTableSubmit = () => {
    const rows = parseInt(modalData.rows) || 3;
    const cols = parseInt(modalData.cols) || 3;

    let table = "\n";
    table +=
      "| " +
      Array(cols)
        .fill("Header")
        .map((h, i) => `${h} ${i + 1}`)
        .join(" | ") +
      " |\n";
    table += "| " + Array(cols).fill("---").join(" | ") + " |\n";
    for (let r = 0; r < rows - 1; r++) {
      table += "| " + Array(cols).fill("Cell").join(" | ") + " |\n";
    }
    table += "\n";

    insertAtCursor(table);
    setModalType(null);
    setModalData({ url: "", alt: "", text: "", rows: "3", cols: "3" });
  };

  const toolbarButtons = [
    { icon: Bold, label: "Bold", onClick: handleBold },
    { icon: Italic, label: "Italic", onClick: handleItalic },
    { divider: true },
    { icon: Heading1, label: "H1", onClick: handleH1 },
    { icon: Heading2, label: "H2", onClick: handleH2 },
    { icon: Heading3, label: "H3", onClick: handleH3 },
    { divider: true },
    { icon: List, label: "Bullet List", onClick: handleBulletList },
    { icon: ListOrdered, label: "Numbered List", onClick: handleNumberedList },
    { divider: true },
    { icon: Quote, label: "Quote", onClick: handleQuote },
    { icon: AlertCircle, label: "Callout", onClick: handleCallout },
    { icon: Code, label: "Code Block", onClick: handleCode },
    { icon: Minus, label: "Horizontal Rule", onClick: handleHorizontalRule },
    { divider: true },
    { icon: Link, label: "Insert Link", onClick: () => setModalType("link") },
    { icon: Image, label: "Insert Image", onClick: () => setModalType("image") },
    { icon: Video, label: "Insert Video", onClick: () => setModalType("video") },
    { icon: Table, label: "Insert Table", onClick: () => setModalType("table") },
  ];

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30 flex-wrap">
        {toolbarButtons.map((btn, index) =>
          btn.divider ? (
            <div key={index} className="w-px h-6 bg-border mx-1" />
          ) : (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={btn.onClick}
                >
                  <btn.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-popover border-border">
                {btn.label}
              </TooltipContent>
            </Tooltip>
          )
        )}

        <div className="flex-1" />

        <Button
          type="button"
          variant={isPreview ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          className="gap-2"
        >
          {isPreview ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {isPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      {/* Editor / Preview */}
      {isPreview ? (
        <div className="min-h-[300px] p-4 prose prose-invert max-w-none bg-background prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-strong:font-bold prose-em:italic [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_td]:p-4 [&_td]:align-top [&_td]:border [&_td]:border-border/30 [&_td_p]:my-2 [&_td_p]:text-muted-foreground [&_td_img]:rounded-lg [&_td_img]:my-0 [&_tr]:border-b [&_tr]:border-border/30 [&_iframe]:rounded-lg [&_iframe]:my-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              iframe: ({ node, ...props }) => (
                <div className="my-6 aspect-video w-full overflow-hidden rounded-lg">
                  <iframe {...props} className="h-full w-full" />
                </div>
              ),
              tr: ({ node, children }) => {
                const isLayoutRow =
                  Array.isArray((node as any)?.children) &&
                  (node as any).children.some(
                    (td: any) =>
                      td?.tagName === "td" &&
                      (td?.properties?.width === "50%" || td?.properties?.width === 50)
                  );
                if (isLayoutRow) {
                  return <tr className="grid gap-8 md:grid-cols-2">{children}</tr>;
                }
                return <tr>{children}</tr>;
              },
              td: ({ node, children }) => {
                const isLayoutCell =
                  (node as any)?.properties?.width === "50%" ||
                  (node as any)?.properties?.width === 50;
                if (isLayoutCell) {
                  return (
                    <td className="align-top p-0 border-0">
                      <div className="space-y-4">{children}</div>
                    </td>
                  );
                }
                return <td>{children}</td>;
              },
              table: ({ node, children }) => {
                const isLayoutTable =
                  Array.isArray((node as any)?.children) &&
                  (node as any).children.some(
                    (tr: any) =>
                      tr?.tagName === "tr" &&
                      Array.isArray(tr?.children) &&
                      tr.children.some(
                        (td: any) =>
                          td?.tagName === "td" &&
                          (td?.properties?.width === "50%" || td?.properties?.width === 50)
                      )
                  );
                return isLayoutTable ? (
                  <div className="my-8">
                    <table className="w-full border-collapse">{children}</table>
                  </div>
                ) : (
                  <div className="my-6 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full border-collapse">{children}</table>
                  </div>
                );
              },
            }}
          >
            {DOMPurify.sanitize(localValue, {
              ADD_TAGS: ['iframe'],
              ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'width', 'height'],
            })}
          </ReactMarkdown>
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={localValue}
          onFocus={() => {
            isFocusedRef.current = true;
          }}
          onBlur={() => {
            isFocusedRef.current = false;
            flush(localValue);
          }}
          onChange={(e) => {
            const next = e.target.value;
            setLocalValue(next);
            flush(next);
          }}
          placeholder={placeholder}
          className="min-h-[300px] border-0 rounded-none focus-visible:ring-0 bg-background font-mono text-sm resize-y"
        />
      )}

      {/* Link Modal */}
      <Dialog open={modalType === "link"} onOpenChange={() => setModalType(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">URL</Label>
              <Input
                value={modalData.url}
                onChange={(e) => setModalData((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Link Text (optional)</Label>
              <Input
                value={modalData.text}
                onChange={(e) => setModalData((prev) => ({ ...prev, text: e.target.value }))}
                placeholder="Click here"
                className="bg-background border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)} className="border-border">
              Cancel
            </Button>
            <Button onClick={handleLinkSubmit} className="bg-primary text-primary-foreground">
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={modalType === "image"} onOpenChange={() => setModalType(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">Image URL</Label>
              <Input
                value={modalData.url}
                onChange={(e) => setModalData((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Alt Text</Label>
              <Input
                value={modalData.alt}
                onChange={(e) => setModalData((prev) => ({ ...prev, alt: e.target.value }))}
                placeholder="Image description"
                className="bg-background border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)} className="border-border">
              Cancel
            </Button>
            <Button onClick={handleImageSubmit} className="bg-primary text-primary-foreground">
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog open={modalType === "video"} onOpenChange={() => setModalType(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Insert Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">Video URL</Label>
              <Input
                value={modalData.url}
                onChange={(e) => setModalData((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="YouTube, Vimeo, or direct video URL"
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">
                Supports YouTube, Vimeo, and direct video URLs
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)} className="border-border">
              Cancel
            </Button>
            <Button onClick={handleVideoSubmit} className="bg-primary text-primary-foreground">
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table Modal */}
      <Dialog open={modalType === "table"} onOpenChange={() => setModalType(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Insert Table</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Columns</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={modalData.cols}
                  onChange={(e) => setModalData((prev) => ({ ...prev, cols: e.target.value }))}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Rows</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={modalData.rows}
                  onChange={(e) => setModalData((prev) => ({ ...prev, rows: e.target.value }))}
                  className="bg-background border-border"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)} className="border-border">
              Cancel
            </Button>
            <Button onClick={handleTableSubmit} className="bg-primary text-primary-foreground">
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
