import QueryPanel from "@/components/QueryPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Network,
  BrainCircuit,
  ExternalLink,
  Link2,
  Key,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { api, type QueryResponse } from "@/services/api";

export default function QueryWorkspace() {
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.queryGraph(query);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCypherQuery = async (cypher: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.queryCypher(cypher);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full gap-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Left Panel */}
      <div className="w-full md:w-[400px] xl:w-[450px] shrink-0 h-full rounded-2xl overflow-hidden shadow-sm border border-border">
        <QueryPanel 
          onSearch={handleQuery} 
          onCypherSearch={handleCypherQuery}
          isLoading={isLoading} 
        />
      </div>

      {/* Right Panel - Results */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-6 scrollbar-hide">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Reasoning over the Knowledge Graph...</p>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-destructive">
            <Info className="h-10 w-10" />
            <p className="font-medium text-lg">Query Failed</p>
            <p className="text-sm max-w-md text-center">{error}</p>
          </div>
        ) : !result ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <BrainCircuit className="h-12 w-12 opacity-20" />
            <p>Enter a query to explore the Graph-RAG system.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 pb-4 pt-1">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Query Results
              </h2>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  Analysis Complete
                </Badge>
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
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {result.answer}
                </p>
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
                  {result.supporting_entities?.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No entities extracted.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {result.supporting_entities?.map((entity) => (
                        <Badge
                          key={entity}
                          variant="secondary"
                          className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
                        >
                          {entity}
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
                    <span className="text-lg font-bold text-primary">
                      {Math.round((result.confidence || 0) * 100)}%
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <Progress
                    value={(result.confidence || 0) * 100}
                    className="h-2 bg-secondary"
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    Graph-RAG internal metric
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Raw Results (for Cypher queries) */}
            {result.raw_results && result.raw_results.length > 0 && (
              <Card className="bg-card border-card-border shadow-sm rounded-xl">
                <CardHeader className="pb-3 px-5 pt-5">
                  <CardTitle className="text-sm font-semibold flex items-center text-foreground">
                    <div className="h-4 w-4 mr-2 rounded bg-primary/20 flex items-center justify-center text-[10px] text-primary">
                      {`{ }`}
                    </div>
                    Raw JSON Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="bg-secondary/50 rounded-lg p-4 font-mono text-[10px] overflow-x-auto max-h-[300px] scrollbar-hide text-muted-foreground whitespace-pre">
                    {JSON.stringify(result.raw_results, null, 2)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Graph Path */}
            <Card className="bg-card border-card-border shadow-sm rounded-xl">
              <CardHeader className="pb-3 px-5 pt-5">
                <CardTitle className="text-sm font-semibold flex items-center text-foreground">
                  <Link2 className="h-4 w-4 mr-2 text-muted-foreground" />
                  Critical Graph Path
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                {!result.graph_path || result.graph_path.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No graph path available.
                  </p>
                ) : (
                  <div className="bg-secondary/50 rounded-lg p-4 font-mono text-xs overflow-x-auto flex flex-col gap-2 text-muted-foreground">
                    {result.graph_path.map((segment, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-1">
                        <span className="font-semibold text-primary/80">Path {idx + 1}:</span>
                        <span>Nodes: {segment.nodes.join(", ")}</span>
                        <span>Edges: {segment.edges.join(", ")}</span>
                      </div>
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
                    <h4 className="text-sm font-semibold text-foreground">
                      Visualize this Query
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Open the Knowledge Graph Explorer to interact with these
                      entities.
                    </p>
                  </div>
                </div>
                <Link href="/graph">
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Open Explorer <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
