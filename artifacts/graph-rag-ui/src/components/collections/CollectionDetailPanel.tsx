import { CollectionDetailed } from "@/types";
import { Badge } from "@/components/ui/badge";
import { X, FileText, Network, GitBranch, Search, Clock, MessageSquare, Cpu } from "lucide-react";
import CollectionStats from "./CollectionStats";
import { cn } from "@/lib/utils";

interface CollectionDetailPanelProps {
  collection: CollectionDetailed;
  onClose: () => void;
}

const fileTypeColor: Record<string, string> = {
  PDF: "bg-red-500/10 text-red-400 border-red-500/20",
  CSV: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  JSON: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  XLSX: "bg-green-500/10 text-green-400 border-green-500/20",
  DOCX: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  TXT: "bg-muted text-muted-foreground border-border",
  YAML: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  SQL: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  GraphML: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const entityTypeColor: Record<string, string> = {
  Organization: "bg-blue-500/10 text-blue-400",
  Person: "bg-violet-500/10 text-violet-400",
  Location: "bg-amber-500/10 text-amber-400",
  Metric: "bg-emerald-500/10 text-emerald-400",
  Event: "bg-red-500/10 text-red-400",
  System: "bg-cyan-500/10 text-cyan-400",
  Service: "bg-indigo-500/10 text-indigo-400",
  Feature: "bg-pink-500/10 text-pink-400",
  default: "bg-muted text-muted-foreground",
};

export default function CollectionDetailPanel({ collection, onClose }: CollectionDetailPanelProps) {
  return (
    <div className="flex flex-col h-full bg-card border-l border-border overflow-hidden animate-in slide-in-from-right duration-250">
      {/* Panel header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border shrink-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-semibold text-foreground truncate">{collection.title}</h2>
            {collection.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] font-normal">{tag}</Badge>
            ))}
          </div>
          {collection.description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{collection.description}</p>
          )}
        </div>
        <button onClick={onClose} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors shrink-0 mt-0.5" data-testid="button-detail-close">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Stats */}
        <div className="px-5 py-4 border-b border-border">
          <CollectionStats collection={collection} />
        </div>

        {/* Graph preview placeholder */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Graph Preview</p>
          <div className="h-36 rounded-xl bg-background border border-border flex items-center justify-center relative overflow-hidden">
            {/* Decorative animated nodes */}
            <svg width="100%" height="100%" className="absolute inset-0 opacity-30">
              <circle cx="30%" cy="40%" r="6" fill="hsl(217 91% 60%)" />
              <circle cx="60%" cy="25%" r="5" fill="hsl(160 84% 39%)" />
              <circle cx="75%" cy="60%" r="7" fill="hsl(265 83% 68%)" />
              <circle cx="45%" cy="70%" r="5" fill="hsl(38 92% 50%)" />
              <circle cx="20%" cy="68%" r="4" fill="hsl(217 91% 60%)" />
              <line x1="30%" y1="40%" x2="60%" y2="25%" stroke="hsl(217 91% 60%)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="60%" y1="25%" x2="75%" y2="60%" stroke="hsl(160 84% 39%)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="75%" y1="60%" x2="45%" y2="70%" stroke="hsl(265 83% 68%)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="45%" y1="70%" x2="20%" y2="68%" stroke="hsl(217 91% 60%)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30%" y1="40%" x2="45%" y2="70%" stroke="hsl(38 92% 50%)" strokeWidth="1" strokeDasharray="3,3" />
            </svg>
            <div className="relative z-10 text-center">
              <Cpu className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-[10px] text-muted-foreground">Graph preview — connect Neo4j renderer</p>
            </div>
          </div>
        </div>

        {/* Files */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3 w-3" /> Files
            </p>
            <span className="text-[10px] text-muted-foreground">{collection.files.length} shown</span>
          </div>
          {collection.files.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No files in this collection yet.</p>
          ) : (
            <div className="space-y-2">
              {collection.files.map((file) => (
                <div key={file.id} className="flex items-center gap-2.5 group" data-testid={`row-file-${file.id}`}>
                  <Badge variant="outline" className={cn("text-[9px] font-mono shrink-0 border", fileTypeColor[file.type] || "bg-muted text-muted-foreground border-border")}>{file.type}</Badge>
                  <span className="text-xs text-foreground flex-1 truncate group-hover:text-primary transition-colors cursor-pointer">{file.name}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{file.size}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Entities */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Network className="h-3 w-3" /> Top Entities
          </p>
          {collection.entities.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No entities extracted yet.</p>
          ) : (
            <div className="space-y-2">
              {collection.entities.map((entity) => (
                <div key={entity.id} className="flex items-center gap-2" data-testid={`row-entity-${entity.id}`}>
                  <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded-md", entityTypeColor[entity.type] || entityTypeColor.default)}>{entity.type}</span>
                  <span className="text-xs text-foreground flex-1 truncate">{entity.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{entity.mentions} mentions</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related queries */}
        <div className="px-5 py-4">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Search className="h-3 w-3" /> Related Queries
          </p>
          {collection.relatedQueries.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No queries run against this collection yet.</p>
          ) : (
            <div className="space-y-2.5">
              {collection.relatedQueries.map((q) => (
                <div key={q.id} className="bg-background border border-border rounded-lg p-3" data-testid={`row-query-${q.id}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant={q.mode === 'Cypher' ? 'default' : 'secondary'} className="text-[9px] h-4 px-1.5">{q.mode === 'Cypher' ? 'Cypher' : 'NL'}</Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" /> {q.runAt}</span>
                  </div>
                  <p className={cn("text-xs leading-relaxed", q.mode === 'Cypher' ? "font-mono text-primary" : "text-foreground")}>{q.query}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
