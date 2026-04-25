import InsightWidget from "@/components/InsightWidget";
import { insightMetrics } from "@/mock/mockData";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Filter } from "lucide-react";

export default function Insights() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Intelligence Insights</h1>
          <p className="text-sm text-muted-foreground">High-level analytics and anomalies derived from the knowledge graph.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="bg-card border-border text-foreground hover:bg-accent/10">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            Last 7 Days
          </Button>
          <Button variant="outline" size="icon" className="bg-card border-border text-foreground hover:bg-accent/10">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insightMetrics.map((metric, idx) => (
          <InsightWidget 
            key={idx}
            type="kpi"
            title={metric.title}
            data={metric}
          />
        ))}
      </div>

      {/* Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightWidget 
          type="line"
          title="Entity Growth Over Time"
        />
        <InsightWidget 
          type="heatmap"
          title="Query Activity Heatmap"
        />
      </div>

      {/* Mixed Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InsightWidget 
          type="cluster"
          title="Topic Clusters"
        />
        <InsightWidget 
          type="trend"
          title="Trending Entities"
        />
        <InsightWidget 
          type="anomaly"
          title="System Alerts"
        />
      </div>

      {/* Footer Action */}
      <div className="flex justify-end pt-4 border-t border-border mt-4">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Export Complete Infographic
        </Button>
      </div>
    </div>
  );
}
