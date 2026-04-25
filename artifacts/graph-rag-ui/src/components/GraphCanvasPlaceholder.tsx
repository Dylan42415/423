import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize, Filter, Search as SearchIcon, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { graphNodes, graphEdges, defaultSelectedNode, graphLegend } from "@/mock/mockGraphData";

const nodeById = Object.fromEntries(graphNodes.map((n) => [n.id, n]));

export const GraphCanvasPlaceholder = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(defaultSelectedNode.id);

  const selectedDetail = selectedNodeId === defaultSelectedNode.id ? defaultSelectedNode : null;

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
          <Button variant="outline" className="h-8 w-full justify-start text-xs text-muted-foreground bg-background">
            <Filter className="h-3 w-3 mr-2" /> Filter Graph
          </Button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="800" height="600" className="opacity-80" viewBox="0 0 800 600">
          {/* Edges */}
          <g stroke="currentColor" className="text-border" strokeWidth="1" strokeDasharray="4 4">
            {graphEdges.map((edge, idx) => {
              const from = nodeById[edge.from];
              const to = nodeById[edge.to];
              if (!from || !to) return null;
              return <path key={idx} d={`M ${from.cx} ${from.cy} L ${to.cx} ${to.cy}`} />;
            })}
          </g>
          {/* Nodes */}
          <g>
            {graphNodes.map((node) => {
              const isCenter = node.id === 'node-center';
              return (
                <g key={node.id} onClick={() => setSelectedNodeId(node.id)} className="cursor-pointer">
                  {isCenter && (
                    <circle cx={node.cx} cy={node.cy} r={node.r} fill={`${node.color}33`} stroke={node.color} className="animate-pulse" strokeWidth="2" />
                  )}
                  <circle
                    cx={node.cx} cy={node.cy}
                    r={isCenter ? node.r / 2 : node.r}
                    fill={isCenter ? node.color : `${node.color}33`}
                    stroke={node.color}
                    strokeWidth={isCenter ? 0 : 2}
                  />
                  <text x={node.cx} y={node.cy + node.r + 18} className={isCenter ? "text-xs fill-foreground font-medium" : "text-[10px] fill-muted-foreground"} textAnchor="middle" fontSize={isCenter ? 12 : 10}>
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Neo4j banner */}
      <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none">
        <div className="bg-card/80 backdrop-blur border border-border px-4 py-2 rounded-full text-xs text-muted-foreground font-mono flex items-center shadow-lg">
          <Info className="h-3 w-3 mr-2 text-primary" />
          Graph Visualization Engine — Connect Neo4j or custom renderer here
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur border border-border rounded-lg p-2 flex gap-3 shadow-sm z-10">
        {graphLegend.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Entity Detail Panel */}
      {selectedDetail && (
        <div className="absolute top-4 right-4 w-64 bg-card/90 backdrop-blur border border-border rounded-lg shadow-lg z-10 flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <div className="p-3 border-b border-border bg-secondary/50 flex justify-between items-center">
            <h4 className="text-sm font-semibold text-foreground">Entity Details</h4>
            <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground" onClick={() => setSelectedNodeId(null)}>
              <span className="sr-only">Close</span>
              &times;
            </Button>
          </div>
          <div className="p-3 flex flex-col gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Name</div>
              <div className="text-sm font-medium text-foreground">{selectedDetail.name}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Type</div>
              <Badge variant="outline" className={`text-[10px] ${selectedDetail.typeBadgeClass}`}>{selectedDetail.type}</Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Properties</div>
              <div className="bg-background rounded border border-border p-2 space-y-1">
                {selectedDetail.properties.map((prop) => (
                  <div key={prop.key} className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">{prop.key}</span>
                    <span className="text-foreground font-mono">{prop.value}</span>
                  </div>
                ))}
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
