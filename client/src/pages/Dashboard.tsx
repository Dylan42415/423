import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { EMPTY_GRAPH_STATS } from "@/constants/emptyData";
import MetricCard from "@/components/MetricCard";
import { FileText, Activity, Database, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/cn";

export default function Dashboard() {
  const [graphStats, setGraphStats] = useState(EMPTY_GRAPH_STATS);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [queryHistory, setQueryHistory] = useState<any[]>([]);
  const [dashboardReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, sources, history] = await Promise.all([
          api.getGraphStats(),
          api.getSources(),
          api.getQueryHistory(),
        ]);
        setGraphStats(stats);
        setUploadedFiles(sources);
        setQueryHistory(history);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Intelligence Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your GraphRAG workspace and processing pipelines.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Files"
          value={graphStats.totalFiles}
          icon={<FileText className="h-4 w-4" />}
          change={graphStats.totalFilesChange}
          changeType={graphStats.totalFilesChangeType}
        />
        <MetricCard
          title="Active Jobs"
          value={graphStats.activeJobs}
          icon={<Activity className="h-4 w-4" />}
          change={graphStats.activeJobsChange}
          changeType={graphStats.activeJobsChangeType}
        />
        <MetricCard
          title="Graph Entities"
          value={graphStats.entityCount}
          icon={<Database className="h-4 w-4" />}
          change={graphStats.entityCountChange}
          changeType={graphStats.entityCountChangeType}
        />
        <MetricCard
          title="Relationships"
          value={graphStats.relationshipCount}
          icon={<Network className="h-4 w-4" />}
          change={graphStats.relationshipCountChange}
          changeType={graphStats.relationshipCountChangeType}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Uploads */}
        <Card className="bg-card border-card-border flex flex-col rounded-2xl shadow-sm">
          <CardHeader className="pb-3 border-b border-border px-5 pt-5">
            <CardTitle className="text-base font-semibold text-foreground">
              Recent Uploads
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[300px]">
              {uploadedFiles.length === 0 ? (
                <div className="flex items-center justify-center h-full py-8 text-sm text-muted-foreground">
                  No uploads yet.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {uploadedFiles.slice(0, 5).map((file) => (
                    <div
                      key={file.id}
                      className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-9 w-9 rounded bg-secondary flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-foreground truncate">
                            {file.fileName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {file.uploadTimestamp} • {file.size}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] uppercase font-semibold border-none ml-4 shrink-0",
                          file.status === "Completed"
                            ? "bg-green-500/10 text-green-500"
                            : file.status === "Processing"
                              ? "bg-amber-500/10 text-amber-500 animate-pulse"
                              : file.status === "Failed"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-blue-500/10 text-blue-500",
                        )}
                      >
                        {file.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Queries */}
        <Card className="bg-card border-card-border flex flex-col rounded-2xl shadow-sm">
          <CardHeader className="pb-3 border-b border-border px-5 pt-5">
            <CardTitle className="text-base font-semibold text-foreground">
              Recent Queries
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[300px]">
              {queryHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full py-8 text-sm text-muted-foreground">
                  No queries yet.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {queryHistory.slice(0, 5).map((query) => (
                    <div
                      key={query.id}
                      className="p-4 hover:bg-secondary/30 transition-colors flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-background text-muted-foreground border-border"
                        >
                          {query.mode}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {query.timestamp}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-sm text-foreground",
                          query.mode === "Cypher" &&
                            "font-mono text-xs text-primary",
                        )}
                      >
                        {query.query}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Generated Reports */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Generated Infographics & Reports
        </h3>
        {dashboardReports.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No reports generated yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardReports.map((report) => (
              <Card
                key={report.id}
                className="bg-card border-card-border overflow-hidden rounded-xl group cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="h-32 bg-secondary/50 border-b border-border flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background" />
                  <Network className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors group-hover:scale-110 duration-300" />
                </div>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-foreground">
                    {report.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {report.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
