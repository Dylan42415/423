import { CollectionDetailed } from "@/types";
import { FileText, GitBranch, Network } from "lucide-react";

interface CollectionStatsProps {
  collection: CollectionDetailed;
}

export default function CollectionStats({ collection }: CollectionStatsProps) {
  const stats = [
    { label: "Files", value: collection.itemCount.toLocaleString(), icon: FileText, color: "text-primary" },
    { label: "Entities", value: collection.entityCount.toLocaleString(), icon: Network, color: "text-emerald-400" },
    { label: "Relationships", value: collection.relationshipCount.toLocaleString(), icon: GitBranch, color: "text-violet-400" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-background rounded-xl border border-border p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{s.label}</span>
          </div>
          <span className="text-lg font-bold text-foreground tabular-nums">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
