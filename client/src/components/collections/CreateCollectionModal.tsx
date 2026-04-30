import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Tag } from "lucide-react";
import { CollectionDetailed } from "@/types";
import { Badge } from "@/components/ui/badge";

interface CreateCollectionModalProps {
  onClose: () => void;
  onCreate: (data: { title: string; description: string }) => void;
}

export default function CreateCollectionModal({
  onClose,
  onCreate,
}: CreateCollectionModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [autoAssign, setAutoAssign] = useState(false);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Escape") onClose();
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({
      title: name.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-card border border-card-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Create Collection
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Define a new knowledge graph grouping layer.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
            data-testid="button-modal-close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Collection Name <span className="text-destructive">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Air Quality Studies"
              className="bg-background border-border"
              data-testid="input-collection-name"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the purpose of this collection..."
              rows={3}
              className="bg-background border-border resize-none text-sm"
              data-testid="input-collection-description"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Tags{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a tag, press Enter"
                  className="bg-background border-border pl-8 text-sm"
                  data-testid="input-collection-tag"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addTag}
                className="shrink-0"
                data-testid="button-add-tag"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs gap-1 pr-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive transition-colors ml-0.5"
                      data-testid={`button-remove-tag-${tag}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Auto-assign toggle */}
          <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">
                Auto-assign incoming data
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                AI will automatically route relevant files into this collection.
              </p>
            </div>
            <button
              role="switch"
              aria-checked={autoAssign}
              onClick={() => setAutoAssign(!autoAssign)}
              data-testid="toggle-auto-assign"
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${autoAssign ? "bg-primary" : "bg-secondary"}`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${autoAssign ? "translate-x-4" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 pb-6">
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="button-modal-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="min-w-[120px]"
            data-testid="button-modal-create"
          >
            Create Collection
          </Button>
        </div>
      </div>
    </div>
  );
}
