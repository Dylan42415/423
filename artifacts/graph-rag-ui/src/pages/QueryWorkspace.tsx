import QueryPanel from "@/components/QueryPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Network, BrainCircuit, ExternalLink, Link2, Key, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function QueryWorkspace() {
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

        {/* Answer Card */}
        <Card className="bg-card border-card-border shadow-sm rounded-xl">
          <CardHeader className="pb-3 px-5 pt-5">
            <CardTitle className="text-sm font-semibold flex items-center text-foreground">
              <Info className="h-4 w-4 mr-2 text-primary" />
              Synthesized Answer
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <p className="text-sm text-foreground/90 leading-relaxed">
              Based on the extracted network graph, Project Alpha's architecture heavily relies on the Acme Corp acquisition, specifically their distributed consensus protocol. The Q3 revenue showed a <span className="font-bold text-green-500">12% increase</span> directly correlated to the successful integration of these systems in the New York data center under Jane Doe's supervision.
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
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20">Project Alpha</Badge>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20">Acme Corp</Badge>
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20">Jane Doe</Badge>
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500/20">New York</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Confidence Score */}
          <Card className="bg-card border-card-border shadow-sm rounded-xl">
            <CardHeader className="pb-3 px-5 pt-5">
              <CardTitle className="text-sm font-semibold flex items-center justify-between text-foreground w-full">
                <span>Confidence Score</span>
                <span className="text-lg font-bold text-primary">87%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <Progress value={87} className="h-2 bg-secondary" />
              <p className="text-xs text-muted-foreground mt-2 text-right">Based on 14 cross-verified sources</p>
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
            <div className="bg-secondary/50 rounded-lg p-4 font-mono text-xs overflow-x-auto flex items-center whitespace-nowrap text-muted-foreground">
              <span className="text-blue-500 font-semibold">(Jane Doe)</span>
              <span className="mx-2 text-foreground/50">-[SUPERVISES]-&gt;</span>
              <span className="text-orange-500 font-semibold">(NY Data Center)</span>
              <span className="mx-2 text-foreground/50">&lt;-[HOSTS]-</span>
              <span className="text-green-500 font-semibold">(Acme System)</span>
              <span className="mx-2 text-foreground/50">-[INTEGRATES_WITH]-&gt;</span>
              <span className="text-primary font-semibold">(Project Alpha)</span>
            </div>
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
