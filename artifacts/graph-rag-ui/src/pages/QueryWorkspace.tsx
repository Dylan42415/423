import QueryPanel from "@/components/QueryPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Network, BrainCircuit, ExternalLink, Link2, Key, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { mockQueryResult } from "@/mock/mockQueryResults";

export default function QueryWorkspace() {
  const result = mockQueryResult;

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full gap-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Left Panel */}
      <div className="w-full md:w-[400px] xl:w-[450px] shrink-0 h-full rounded-2xl overflow-hidden shadow-sm border border-border">
        <QueryPanel />
      </div>

      {/* Right Panel - Results */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-6 scrollbar-hide">
        <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 pb-4 pt-1">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            Query Results
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Analysis Complete</Badge>
          </div>
        </div>

        {/* Synthesized Answer */}
        <Card className="bg-card border-card-border shadow-sm rounded-xl">
          <CardHeader className="pb-3 px-5 pt-5">
            <CardTitle className="text-sm font-semibold flex items-center text-foreground">
              <Info className="h-4 w-4 mr-2 text-primary" />
              Synthesized Answer
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <p className="text-sm text-foreground/90 leading-relaxed">{result.synthesizedAnswer}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Supporting Entities */}
          <Card className="bg-card border-card-border shadow-sm rounded-xl">
            <CardHeader className="pb-3 px-5 pt-5">
              <CardTitle className="text-sm font-semibold flex items-center text-foreground">
                <Key className="h-4 w-4 mr-2 text-muted-foreground" />
                Supporting Entities
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {result.supportingEntities.length === 0 ? (
                <p className="text-xs text-muted-foreground">No entities extracted.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.supportingEntities.map((entity) => (
                    <Badge key={entity.label} variant="secondary" className={entity.colorClass}>
                      {entity.label}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Confidence Score */}
          <Card className="bg-card border-card-border shadow-sm rounded-xl">
            <CardHeader className="pb-3 px-5 pt-5">
              <CardTitle className="text-sm font-semibold flex items-center justify-between text-foreground w-full">
                <span>Confidence Score</span>
                <span className="text-lg font-bold text-primary">{result.confidenceScore}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <Progress value={result.confidenceScore} className="h-2 bg-secondary" />
              <p className="text-xs text-muted-foreground mt-2 text-right">
                Based on {result.sourceCount} cross-verified sources
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Graph Path */}
        <Card className="bg-card border-card-border shadow-sm rounded-xl">
          <CardHeader className="pb-3 px-5 pt-5">
            <CardTitle className="text-sm font-semibold flex items-center text-foreground">
              <Link2 className="h-4 w-4 mr-2 text-muted-foreground" />
              Critical Graph Path
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {result.graphPath.length === 0 ? (
              <p className="text-xs text-muted-foreground">No graph path available.</p>
            ) : (
              <div className="bg-secondary/50 rounded-lg p-4 font-mono text-xs overflow-x-auto flex items-center whitespace-nowrap text-muted-foreground gap-0">
                {result.graphPath.map((step, idx) => (
                  <span key={idx} className="flex items-center">
                    <span className={`font-semibold ${step.nodeColorClass}`}>({step.nodeLabel})</span>
                    {step.edgeLabel && (
                      <span className="mx-2 text-foreground/50">{step.edgeLabel}</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Suggested Action */}
        <Card className="bg-primary/5 border-primary/20 shadow-sm rounded-xl mt-2">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Network className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Visualize this Query</h4>
                <p className="text-xs text-muted-foreground">Open the Knowledge Graph Explorer to interact with these entities.</p>
              </div>
            </div>
            <Link href="/graph">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Open Explorer <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
