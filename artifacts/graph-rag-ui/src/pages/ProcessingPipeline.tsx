import { pipelineJobs } from "@/mock/mockData";
import PipelineCard from "@/components/PipelineCard";
import { Badge } from "@/components/ui/badge";

export default function ProcessingPipeline() {
  const activeCount = pipelineJobs.filter(j => j.stages.some(s => s.status === 'active')).length;
  const completedCount = pipelineJobs.filter(j => j.stages.every(s => s.status === 'done')).length;
  const failedCount = pipelineJobs.filter(j => j.stages.some(s => s.status === 'failed')).length;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Processing Pipeline</h1>
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 animate-pulse">
              {activeCount} Active Jobs
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Monitor extraction, categorization, and graph merge stages.</p>
        </div>
      </div>

      {/* Summary Row */}
      <div className="flex gap-4 p-4 bg-card rounded-xl border border-card-border overflow-x-auto shadow-sm">
        <div className="flex flex-col pr-6 border-r border-border min-w-[120px]">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Files</span>
          <span className="text-2xl font-bold text-foreground">{pipelineJobs.length}</span>
        </div>
        <div className="flex flex-col pr-6 border-r border-border min-w-[120px]">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Active</span>
          <span className="text-2xl font-bold text-primary">{activeCount}</span>
        </div>
        <div className="flex flex-col pr-6 border-r border-border min-w-[120px]">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Completed</span>
          <span className="text-2xl font-bold text-green-500">{completedCount}</span>
        </div>
        <div className="flex flex-col min-w-[120px]">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Failed</span>
          <span className="text-2xl font-bold text-destructive">{failedCount}</span>
        </div>
      </div>

      {/* Pipeline Jobs */}
      <div className="flex flex-col mt-2">
        {pipelineJobs.map(job => (
          <PipelineCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
