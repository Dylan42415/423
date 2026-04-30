import { Collection } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface CollectionCardProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Card className="bg-card border-card-border hover:-translate-y-1 transition-transform duration-200 cursor-pointer rounded-2xl">
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-lg font-semibold text-foreground leading-tight max-w-[75%]">
          {collection.title}
        </CardTitle>
        <Badge
          variant="secondary"
          className="bg-secondary text-secondary-foreground font-mono text-xs shrink-0"
        >
          {collection.itemCount.toLocaleString()} items
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-xs text-muted-foreground mb-4">
          <Clock className="mr-1.5 h-3 w-3" />
          Updated {collection.lastUpdated}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {collection.previewItems.map((item, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="bg-background text-muted-foreground border-border text-[10px] font-normal hover:bg-accent/10"
            >
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
