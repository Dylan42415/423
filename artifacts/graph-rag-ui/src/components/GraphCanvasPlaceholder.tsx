import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize, Filter, Search as SearchIcon, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const GraphCanvasPlaceholder = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>("node-1");

  return (
    <div className="relative w-full h-full bg-[#0a0f1a] rounded-xl border border-border overflow-hidden flex font-sans" data-testid="graph-canvas">
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 w-48">
        <div className="bg-card/80 backdrop-blur border border-border rounded-lg p-1.5 flex gap-1 shadow-sm">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-accent/20 hover:text-accent"><ZoomIn className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-accent/20 hover:text-accent"><ZoomOut className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-accent/20 hover:text-accent"><Maximize className="h-4 w-4" /></Button>
        </div>
        <div className="bg-card/80 backdrop-blur border border-border rounded-lg p-2 shadow-sm flex flex-col gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input className="h-8 pl-7 text-xs bg-background" placeholder="Search entities..." />
          </div>
          <Button variant="outline" className="h-8 w-full justify-start text-xs text-muted-foreground bg-background"><Filter className="h-3 w-3 mr-2" /> Filter Graph</Button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="800" height="600" className="opacity-80" viewBox="0 0 800 600">
          {/* Edges */}
          <g stroke="currentColor" className="text-border" strokeWidth="1" strokeDasharray="4 4">
            <path d="M 400 300 L 250 150" />
            <path d="M 400 300 L 550 150" />
            <path d="M 400 300 L 200 400" />
            <path d="M 400 300 L 600 400" />
            <path d="M 400 300 L 400 500" />
            <path d="M 250 150 L 350 100" />
            <path d="M 550 150 L 650 200" />
            <path d="M 200 400 L 150 500" />
            <path d="M 600 400 L 700 350" />
          </g>

          {/* Nodes */}
          <g>
            {/* Center Node */}
            <circle cx="400" cy="300" r="30" className="fill-primary/20 stroke-primary animate-pulse" strokeWidth="2" />
            <circle cx="400" cy="300" r="15" className="fill-primary" />
            <text x="400" y="345" className="text-xs fill-foreground font-medium text-center" textAnchor="middle">Project Alpha</text>
            
            {/* Other Nodes */}
            <circle cx="250" cy="150" r="20" className="fill-blue-500/20 stroke-blue-500" strokeWidth="2" />
            <text x="250" y="185" className="text-[10px] fill-muted-foreground" textAnchor="middle">Acme Corp</text>
            
            <circle cx="550" cy="150" r="20" className="fill-green-500/20 stroke-green-500" strokeWidth="2" />
            <text x="550" y="185" className="text-[10px] fill-muted-foreground" textAnchor="middle">Q3 Report</text>
            
            <circle cx="200" cy="400" r="20" className="fill-purple-500/20 stroke-purple-500" strokeWidth="2" />
            <text x="200" y="435" className="text-[10px] fill-muted-foreground" textAnchor="middle">Jane Doe</text>
            
            <circle cx="600" cy="400" r="20" className="fill-orange-500/20 stroke-orange-500" strokeWidth="2" />
            <text x="600" y="435" className="text-[10px] fill-muted-foreground" textAnchor="middle">New York</text>
            
            <circle cx="400" cy="500" r="20" className="fill-yellow-500/20 stroke-yellow-500" strokeWidth="2" />
            <text x="400" y="535" className="text-[10px] fill-muted-foreground" textAnchor="middle">Merger Event</text>
            
            {/* Outer Nodes */}
            <circle cx="350" cy="100" r="15" className="fill-blue-500/20 stroke-blue-500" strokeWidth="1" />
            <circle cx="650" cy="200" r="15" className="fill-green-500/20 stroke-green-500" strokeWidth="1" />
            <circle cx="150" cy="500" r="15" className="fill-purple-500/20 stroke-purple-500" strokeWidth="1" />
            <circle cx="700" cy="350" r="15" className="fill-orange-500/20 stroke-orange-500" strokeWidth="1" />
          </g>
        </svg>
      </div>

      <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none">
        <div className="bg-card/80 backdrop-blur border border-border px-4 py-2 rounded-full text-xs text-muted-foreground font-mono flex items-center shadow-lg">
          <Info className="h-3 w-3 mr-2 text-primary" />
          Graph Visualization Engine — Connect Neo4j or custom renderer here
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur border border-border rounded-lg p-2 flex gap-3 shadow-sm z-10">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-primary"></div><span className="text-[10px] text-muted-foreground">Core</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-[10px] text-muted-foreground">Company</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div><span className="text-[10px] text-muted-foreground">Report</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div><span className="text-[10px] text-muted-foreground">Person</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div><span className="text-[10px] text-muted-foreground">Location</span></div>
      </div>

      {/* Entity Detail Panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 w-64 bg-card/90 backdrop-blur border border-border rounded-lg shadow-lg z-10 flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <div className="p-3 border-b border-border bg-secondary/50 flex justify-between items-center">
            <h4 className="text-sm font-semibold text-foreground">Entity Details</h4>
            <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground" onClick={() => setSelectedNode(null)}>
              <span className="sr-only">Close</span>
              &times;
            </Button>
          </div>
          <div className="p-3 flex flex-col gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Name</div>
              <div className="text-sm font-medium text-foreground">Project Alpha</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Type</div>
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">Core Project</Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Properties</div>
              <div className="bg-background rounded border border-border p-2 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">status</span>
                  <span className="text-foreground font-mono">"Active"</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">budget</span>
                  <span className="text-foreground font-mono">1.2M</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">start_date</span>
                  <span className="text-foreground font-mono">"2023-01-15"</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <Button className="w-full text-xs h-7" variant="secondary">Expand Relationships</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphCanvasPlaceholder;
