import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
const defaultCypherQuery = "";

export const CypherEditor = ({
  onRun,
  isLoading,
}: {
  onRun?: (query: string) => void;
  isLoading?: boolean;
}) => {
  const [query, setQuery] = useState(defaultCypherQuery);

  const handleRun = () => {
    if (query.trim() && onRun) {
      onRun(query);
    }
  };

  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden border border-border bg-[#0d1117] font-mono text-sm shadow-inner"
      data-testid="cypher-editor"
    >
      <div className="bg-secondary/50 px-3 py-2 flex justify-between items-center border-b border-border">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Cypher Query
        </span>
        <Button
          size="sm"
          className="h-7 text-xs px-2.5 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleRun}
          disabled={isLoading || !query.trim()}
        >
          <Play className="h-3 w-3 mr-1" />
          {isLoading ? "Running..." : "Run Query"}
        </Button>
      </div>
      <div className="flex flex-1 relative">
        <div className="w-10 bg-[#161b22] border-r border-border text-right pr-2 py-3 text-[#484f58] select-none text-xs flex flex-col items-end">
          {query.split("\n").map((_, i) => (
            <div key={i} className="h-5">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-[#c9d1d9] p-3 focus:outline-none resize-none leading-[20px]"
          spellCheck={false}
          data-testid="textarea-cypher-input"
        />
      </div>
    </div>
  );
};

export default CypherEditor;
