import { CollectionDetailed } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Network, GitBranch, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
  collection: CollectionDetailed;
  isSelected: boolean;
  onClick: () => void;
}

const statusConfig = {
  Active: { dot: "bg-emerald-400", text: "text-emerald-400", label: "Active" },
  Processing: { dot: "bg-amber-400 animate-pulse", text: "text-amber-400", label: "Processing" },
  Empty: { dot: "bg-muted-foreground", text: "text-muted-foreground", label: "Empty" },
};

export default function CollectionCard({ collection, isSelected, onClick }: CollectionCardProps) {
  const status = statusConfig[collection.status];

  return (
    <div
      onClick={onClick}
      data-testid={`card-collection-${collection.id}`}
      className={cn(
        "group relative bg-card border rounded-2xl p-5 cursor-pointer transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20",
        isSelected
          ? "border-primary ring-1 ring-primary/40"
          : "border-card-border hover:border-primary/40"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-snug truncate">{collection.title}</h3>
          {collection.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{collection.description}</p>
          )}
        </div>
        <ChevronRight className={cn("h-4 w-4 shrink-0 mt-0.5 transition-colors", isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
      </div>

      {/* Tags */}
      {collection.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {collection.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] font-normal px-1.5 py-0 h-4">{tag}</Badge>
          ))}
          {collection.tags.length > 3 && (
            <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0 h-4">+{collection.tags.length - 3}</Badge>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{collection.itemCount.toLocaleString()} files</span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1"><Network className="h-3 w-3 text-emerald-400" />{collection.entityCount.toLocaleString()} entities</span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1"><GitBranch className="h-3 w-3 text-violet-400" />{collection.relationshipCount.toLocaleString()} rels</span>
      </div>

      {/* Preview chips */}
      <div className="flex flex-wrap gap-1 mb-3">
        {collection.previewItems.map((item, idx) => (
          <span key={idx} className="text-[10px] bg-background border border-border rounded-md px-1.5 py-0.5 text-muted-foreground">{item}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Updated {collection.lastUpdated}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          <span className={`text-[10px] font-medium ${status.text}`}>{status.label}</span>
        </div>
      </div>
    </div>
  );
}
