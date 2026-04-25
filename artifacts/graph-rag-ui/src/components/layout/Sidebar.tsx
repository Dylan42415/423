import { Link, useLocation } from "wouter";
import { LayoutDashboard, Upload, Activity, Database, Search, Network, BarChart2, FileText, Settings, Menu, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Sidebar() {
  const [location] = useLocation();
  const [expanded, setExpanded] = useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Upload, label: "Upload & Sources", href: "/upload" },
    { icon: Activity, label: "Processing Pipeline", href: "/pipeline" },
    { icon: Database, label: "Data Collections", href: "/collections" },
    { icon: Search, label: "Query Workspace", href: "/query" },
    { icon: Network, label: "Graph Explorer", href: "/graph" },
    { icon: BarChart2, label: "Insights", href: "/insights" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <aside className={cn("bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-full", expanded ? "w-64" : "w-16")}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {expanded && <span className="font-bold text-sidebar-foreground truncate tracking-tight text-lg">GraphRAG</span>}
        <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ml-auto" data-testid="button-toggle-sidebar">
          {expanded ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const content = (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-3 py-2 rounded-md transition-colors", isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", !expanded && "justify-center")} data-testid={`link-sidebar-${item.label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>
              <item.icon className="h-5 w-5 shrink-0" />
              {expanded && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );

          if (!expanded) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  {content}
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return content;
        })}
      </div>
    </aside>
  );
}
