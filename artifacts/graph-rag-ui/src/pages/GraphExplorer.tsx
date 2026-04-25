import GraphCanvasPlaceholder from "@/components/GraphCanvasPlaceholder";
import { Button } from "@/components/ui/button";
import { Download, Share2, Save, MoreHorizontal } from "lucide-react";

export default function GraphExplorer() {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] w-full animate-in fade-in duration-500 -mt-2">
      <div className="flex items-center justify-between py-3 px-1 mb-2">
        <h1 className="text-lg font-bold text-foreground tracking-tight">Knowledge Graph Explorer</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 bg-card border-border text-xs">
            <Save className="h-3 w-3 mr-2" /> Save View
          </Button>
          <Button variant="outline" size="sm" className="h-8 bg-card border-border text-xs">
            <Share2 className="h-3 w-3 mr-2" /> Share
          </Button>
          <Button variant="outline" size="sm" className="h-8 bg-card border-border text-xs">
            <Download className="h-3 w-3 mr-2" /> Export
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 rounded-xl overflow-hidden border border-border shadow-sm">
        <GraphCanvasPlaceholder />
      </div>
    </div>
  );
}
