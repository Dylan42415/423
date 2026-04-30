import { useState, useMemo, useEffect } from "react";
import { api } from "@/services/api";
import { CollectionDetailed } from "@/types";
import CollectionGrid from "@/components/collections/CollectionGrid";
import CollectionDetailPanel from "@/components/collections/CollectionDetailPanel";
import CreateCollectionModal from "@/components/collections/CreateCollectionModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Database, Network, GitBranch } from "lucide-react";

export default function DataCollections() {
  const [collections, setCollections] = useState<CollectionDetailed[]>([]);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionDetailed | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sources, collectionsData] = await Promise.all([
          api.getSources(),
          api.getCollections(),
        ]);
        
        // Map Sources to Collections for UI compatibility
        const mappedSources: CollectionDetailed[] = sources.map((s: any) => ({
          id: s.id,
          title: s.fileName || "Unnamed Source",
          description: `Extracted from ${s.type} file`,
          itemCount: 1,
          entityCount: s.entityCount || 0,
          relationshipCount: s.relationshipCount || 0,
          status: (s.status as any) || "Active",
          lastUpdated: s.timestamp,
          tags: [s.type, "Source"],
          previewItems: [],
          files: [],
          entities: [],
          relatedQueries: [],
        }));

        const mappedCollections: CollectionDetailed[] = collectionsData.map((c: any) => ({
          ...c,
          description: c.description || "",
          entityCount: c.entityCount || 0,
          relationshipCount: c.relationshipCount || 0,
          itemCount: c.itemCount || 0,
          status: c.status || "Active",
          tags: ["Collection"],
          previewItems: [],
          files: [],
          entities: [],
          relatedQueries: [],
        }));

        setCollections([...mappedCollections, ...mappedSources]);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
        Loading intelligence collections...
      </div>
    );
  }

  const handleCreate = async (data: { title: string; description: string }) => {
    try {
      const newCol = await api.createCollection(data);
      const mapped: CollectionDetailed = {
        ...newCol,
        itemCount: 0,
        entityCount: 0,
        relationshipCount: 0,
        lastUpdated: new Date().toISOString(),
        tags: ["Collection"],
        previewItems: [],
        files: [],
        entities: [],
        relatedQueries: [],
      };
      setCollections((prev) => [mapped, ...prev]);
      setSelectedCollection(mapped);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create collection:", err);
    }
  };
  const filteredCollections = useMemo(() => {
    return collections.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [collections, searchQuery, statusFilter]);

  const handleSelect = (collection: CollectionDetailed) => {
    setSelectedCollection((prev) =>
      prev?.id === collection.id ? null : collection,
    );
  };

  // Summary totals
  const totalEntities = collections.reduce((acc, c) => acc + c.entityCount, 0);
  const totalRelationships = collections.reduce(
    (acc, c) => acc + c.relationshipCount,
    0,
  );
  const totalFiles = collections.reduce((acc, c) => acc + c.itemCount, 0);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Page Header */}
      <div className="px-8 pt-8 pb-6 shrink-0">
        <div className="flex flex-col gap-2 md:flex-row md:items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Data Collections
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Knowledge graph grouping layers over your multimodal intelligence
              data.
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="shrink-0"
            data-testid="button-create-collection"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Collection
          </Button>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              icon: Database,
              label: "Collections",
              value: collections.length,
              color: "text-primary",
            },
            {
              icon: Network,
              label: "Total Entities",
              value: totalEntities.toLocaleString(),
              color: "text-emerald-400",
            },
            {
              icon: GitBranch,
              label: "Total Relationships",
              value: totalRelationships.toLocaleString(),
              color: "text-violet-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-card border border-card-border rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <s.icon className={`h-4 w-4 shrink-0 ${s.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-bold text-foreground tabular-nums">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections, tags, descriptions..."
              className="pl-9 bg-card border-card-border"
              data-testid="input-search-collections"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-40 bg-card border-card-border"
              data-testid="dropdown-filter-status"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Empty">Empty</SelectItem>
            </SelectContent>
          </Select>
          {(searchQuery || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-clear-filters"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content area — grid + optional side panel */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Grid */}
        <div
          className={`flex-1 overflow-y-auto px-8 pb-8 transition-all duration-250 ${selectedCollection ? "pr-4" : ""}`}
        >
          {filteredCollections.length > 0 && (
            <p className="text-xs text-muted-foreground mb-4">
              {filteredCollections.length} collection
              {filteredCollections.length !== 1 ? "s" : ""}
              {searchQuery || statusFilter !== "all" ? " matching filters" : ""}
            </p>
          )}
          <CollectionGrid
            collections={filteredCollections}
            selectedId={selectedCollection?.id ?? null}
            onSelect={handleSelect}
          />
        </div>

        {/* Detail Panel */}
        {selectedCollection && (
          <div className="w-[380px] shrink-0 overflow-hidden border-l border-border">
            <CollectionDetailPanel
              collection={selectedCollection}
              onClose={() => setSelectedCollection(null)}
            />
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateCollectionModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
