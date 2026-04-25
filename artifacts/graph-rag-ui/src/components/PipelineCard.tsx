import { PipelineJob, PipelineStage } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, Clock, XCircle, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PipelineCardProps {
  job: PipelineJob;
}

export default function PipelineCard({ job }: PipelineCardProps) {
  return (
    <Card className="bg-card border-card-border rounded-xl overflow-hidden shadow-sm mb-4">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
              <File className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-[300px]" title={job.fileName}>{job.fileName}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] uppercase bg-background">{job.fileType}</Badge>
                <span className="text-xs text-muted-foreground">ID: {job.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 md:justify-end overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {job.stages.map((stage, idx) => (
              <div key={idx} className="flex items-center">
                <div className={cn("flex flex-col items-center gap-1.5 min-w-[70px]", 
                  stage.status === 'active' ? "opacity-100" : 
                  stage.status === 'done' ? "opacity-90" : 
                  "opacity-50"
                )}>
                  <div className="relative">
                    {stage.status === 'done' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {stage.status === 'active' && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                        <Loader2 className="h-5 w-5 text-primary animate-spin relative z-10" />
                      </>
                    )}
                    {stage.status === 'pending' && <Clock className="h-5 w-5 text-muted-foreground" />}
                    {stage.status === 'failed' && <XCircle className="h-5 w-5 text-destructive" />}
                  </div>
                  <span className={cn("text-[10px] font-medium tracking-tight", 
                    stage.status === 'active' ? "text-primary" : 
                    stage.status === 'failed' ? "text-destructive" : 
                    "text-muted-foreground"
                  )}>
                    {stage.name}
                  </span>
                </div>
                {idx < job.stages.length - 1 && (
                  <div className={cn("w-6 h-[2px] mx-1 rounded-full", stage.status === 'done' ? "bg-green-500/50" : "bg-border")} />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
