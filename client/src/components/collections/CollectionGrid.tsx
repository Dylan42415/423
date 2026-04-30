import { CollectionDetailed } from "@/types";
import CollectionCard from "./CollectionCard";
import { Database } from "lucide-react";

interface CollectionGridProps {
  collections: CollectionDetailed[];
  selectedId: string | null;
  onSelect: (collection: CollectionDetailed) => void;
}

export default function CollectionGrid({
  collections,
  selectedId,
  onSelect,
}: CollectionGridProps) {
  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
          <Database className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          No collections found
        </p>
        <p className="text-xs text-muted-foreground">
          Try adjusting your search or create a new collection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          isSelected={selectedId === collection.id}
          onClick={() => onSelect(collection)}
        />
      ))}
    </div>
  );
}
