import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Clock, Bookmark, Sparkles } from "lucide-react";
import CypherEditor from "./CypherEditor";
import { queryHistory, savedPrompts } from "@/mock/mockData";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function QueryPanel() {
  const [nlQuery, setNlQuery] = useState("");

  return (
    <div className="flex flex-col h-full bg-card border-r border-border" data-testid="query-panel">
      <Tabs defaultValue="nl" className="flex flex-col h-full">
        <div className="px-4 pt-4 pb-2 border-b border-border">
          <TabsList className="grid w-full grid-cols-2 bg-secondary rounded-lg">
            <TabsTrigger value="nl" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs">
              Natural Language
            </TabsTrigger>
            <TabsTrigger value="cypher" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs font-mono">
              Cypher
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <TabsContent value="nl" className="flex-1 flex flex-col m-0 p-4 gap-4 data-[state=active]:flex">
            <div className="relative">
              <Textarea 
                placeholder="Ask a question about your data..." 
                className="min-h-[120px] bg-background border-input resize-none pr-10 rounded-xl focus-visible:ring-primary/50 text-sm"
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                data-testid="textarea-nl-query"
              />
              <Button size="icon" className="absolute bottom-3 right-3 h-8 w-8 rounded-full shadow-md hover:scale-105 transition-transform" disabled={!nlQuery}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Saved Prompts</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {savedPrompts.map(prompt => (
                <Badge key={prompt.id} variant="secondary" className="cursor-pointer hover:bg-accent hover:text-accent-foreground text-xs font-normal py-1 px-2.5 rounded-md transition-colors" onClick={() => setNlQuery(prompt.query)}>
                  {prompt.label}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-2 pt-2 border-t border-border">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Recent Queries</span>
            </div>
            <ScrollArea className="flex-1 pr-4 -mr-4">
              <div className="flex flex-col gap-2 pb-4">
                {queryHistory.filter(q => q.mode === 'Natural Language').map(item => (
                  <div key={item.id} className="p-3 rounded-lg border border-border bg-background/50 hover:bg-background cursor-pointer transition-colors group">
                    <p className="text-sm text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-2">{item.query}</p>
                    <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="cypher" className="flex-1 flex flex-col m-0 p-4 data-[state=active]:flex">
            <div className="flex-1 pb-4">
              <CypherEditor />
            </div>
            <div className="flex items-center gap-2 mb-2 pt-2 border-t border-border">
              <Bookmark className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Saved Cypher</span>
            </div>
            <ScrollArea className="h-48 pr-4 -mr-4">
              <div className="flex flex-col gap-2">
                {queryHistory.filter(q => q.mode === 'Cypher').map(item => (
                  <div key={item.id} className="p-2.5 rounded-lg border border-border bg-background/50 hover:bg-background cursor-pointer transition-colors">
                    <p className="text-xs text-muted-foreground font-mono mb-1 truncate">{item.query}</p>
                    <span className="text-[10px] text-muted-foreground/70">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
