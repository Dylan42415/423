import { useState, useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Filter,
  Search as SearchIcon,
  Info,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";

const graphLegend = [
  { label: "Person", color: "bg-blue-500" },
  { label: "Organization", color: "bg-amber-500" },
  { label: "Location", color: "bg-emerald-500" },
  { label: "Concept", color: "bg-violet-500" },
  { label: "Event", color: "bg-rose-500" },
];

export const GraphCanvasPlaceholder = () => {
  const [data, setData] = useState<{ nodes: any[]; links: any[] }>({
    nodes: [],
    links: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const fgRef = useRef<any>();

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const graphData = await api.getGraphData();
        console.log("Fetched Graph Data:", graphData);
        setData(graphData);
      } catch (err) {
        console.error("Failed to fetch graph data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, []);

  const handleZoomIn = () => {
    const zoom = fgRef.current.zoom();
    fgRef.current.zoom(zoom * 1.2, 400);
  };

  const handleZoomOut = () => {
    const zoom = fgRef.current.zoom();
    fgRef.current.zoom(zoom * 0.8, 400);
  };

  const handleCenter = () => {
    fgRef.current.zoomToFit(400);
  };

  return (
    <div
      className="relative w-full h-full bg-[#0a0f1a] rounded-xl border border-border overflow-hidden flex font-sans"
      data-testid="graph-canvas"
    >
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {/* Controls Panel */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 w-48">
        <div className="bg-card/80 backdrop-blur border border-border rounded-lg p-1.5 flex gap-1 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md hover:bg-accent/20 hover:text-accent"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md hover:bg-accent/20 hover:text-accent"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md hover:bg-accent/20 hover:text-accent"
            onClick={handleCenter}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
        <div className="bg-card/80 backdrop-blur border border-border rounded-lg p-2 shadow-sm flex flex-col gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="h-8 pl-7 text-xs bg-background"
              placeholder="Search entities..."
            />
          </div>
          <Button
            variant="outline"
            className="h-8 w-full justify-start text-xs text-muted-foreground bg-background"
          >
            <Filter className="h-3 w-3 mr-2" /> Filter Graph
          </Button>
        </div>
      </div>

      {/* Force Graph Canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        <ForceGraph2D
          ref={fgRef}
          graphData={data}
          nodeLabel="name"
          nodeAutoColorBy="type"
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.25}
          onNodeClick={(node) => setSelectedNode(node)}
          onBackgroundClick={() => setSelectedNode(null)}
          nodeRelSize={8}
          linkWidth={1.5}
          linkColor={() => "rgba(99, 102, 241, 0.2)"}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          backgroundColor="#0a0f1a"
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 14 / globalScale;
            ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
            
            // Draw Node Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();
            
            if (node === selectedNode) {
              ctx.strokeStyle = "#fff";
              ctx.lineWidth = 2 / globalScale;
              ctx.stroke();
            }

            // Draw Label
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fillText(label, node.x, node.y + 12 / globalScale);
          }}
          linkCanvasObjectMode={() => "after"}
          linkCanvasObject={(link: any, ctx, globalScale) => {
            const MAX_FONT_SIZE = 4;
            const LABEL_NODE_MARGIN = 10;

            const start = link.source;
            const end = link.target;

            // ignore unbound links
            if (typeof start !== "object" || typeof end !== "object") return;

            // calculate label positioning
            const textPos = {
              x: start.x + (end.x - start.x) / 2,
              y: start.y + (end.y - start.y) / 2,
            };

            const relLink = { x: end.x - start.x, y: end.y - start.y };

            const maxTextLength =
              Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) -
              LABEL_NODE_MARGIN * 2;

            const label = link.type;

            // maintain label vertical orientation
            let textAngle = Math.atan2(relLink.y, relLink.x);
            if (textAngle > Math.PI / 2) textAngle -= Math.PI;
            if (textAngle < -Math.PI / 2) textAngle += Math.PI;

            const fontSize = Math.min(MAX_FONT_SIZE, 10 / globalScale);
            ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;

            ctx.save();
            ctx.translate(textPos.x, textPos.y);
            ctx.rotate(textAngle);

            // Draw label background
            const textWidth = ctx.measureText(label).width;
            ctx.fillStyle = "rgba(10, 15, 26, 0.6)";
            ctx.fillRect(
              -textWidth / 2 - 2,
              -fontSize / 2 - 1,
              textWidth + 4,
              fontSize + 2,
            );

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
            ctx.fillText(label, 0, 0);
            ctx.restore();
          }}
        />
      </div>

      {/* Neo4j banner */}
      <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none">
        <div className="bg-card/80 backdrop-blur border border-border px-4 py-2 rounded-full text-xs text-muted-foreground font-mono flex items-center shadow-lg">
          <Info className="h-3 w-3 mr-2 text-primary" />
          Live Graph Engine — Rendering from Neo4j Aura
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur border border-border rounded-lg p-2 flex gap-3 shadow-sm z-10">
        {graphLegend.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-[10px] text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Entity Detail Panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 w-64 bg-card/90 backdrop-blur border border-border rounded-lg shadow-lg z-10 flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <div className="p-3 border-b border-border bg-secondary/50 flex justify-between items-center">
            <h4 className="text-sm font-semibold text-foreground">
              Entity Details
            </h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedNode(null)}
            >
              <span className="sr-only">Close</span>
              &times;
            </Button>
          </div>
          <div className="p-3 flex flex-col gap-3 overflow-y-auto max-h-[400px]">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Name</div>
              <div className="text-sm font-medium text-foreground">
                {selectedNode.name}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Type</div>
              <Badge variant="outline" className="text-[10px] bg-primary/10">
                {selectedNode.type}
              </Badge>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Properties
              </div>
              <div className="bg-background rounded border border-border p-2 space-y-1">
                {selectedNode.properties &&
                  Object.entries(selectedNode.properties).map(
                    ([key, value]: [string, any]) => (
                      <div
                        key={key}
                        className="flex flex-col gap-0.5 border-b border-border/50 pb-1 last:border-0"
                      >
                        <span className="text-[9px] text-muted-foreground uppercase">
                          {key}
                        </span>
                        <span className="text-[10px] text-foreground font-mono break-all">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </span>
                      </div>
                    ),
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphCanvasPlaceholder;

