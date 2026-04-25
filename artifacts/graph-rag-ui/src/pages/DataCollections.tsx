import { collections } from "@/mock/mockData";
import CollectionCard from "@/components/CollectionCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DataCollections() {
  const { toast } = useToast();

  const handleCollectionClick = (title: string) => {
    toast({
      title: "Collection Selected",
      description: `Opened ${title} for analysis.`,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Data Collections</h1>
          <p className="text-sm text-muted-foreground">Manage and organize your curated knowledge graphs.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-card-border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search collections..." 
            className="w-full pl-9 bg-background border-input focus-visible:ring-primary h-10"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto h-10 bg-background border-input">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {collections.map(collection => (
          <div key={collection.id} onClick={() => handleCollectionClick(collection.title)}>
            <CollectionCard collection={collection} />
          </div>
        ))}
      </div>
    </div>
  );
}
