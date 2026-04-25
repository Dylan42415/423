import { Search, Bell, Settings, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function TopNavbar() {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-6 justify-between shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-xl font-semibold text-foreground hidden md:block">GraphRAG Intelligence</h2>
      </div>

      <div className="flex-1 max-w-md px-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search across all intelligence..." className="w-full bg-card border-card-border pl-9 focus-visible:ring-primary rounded-full h-9" data-testid="input-global-search" />
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent/10" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
          <Badge className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[10px] rounded-full border-2 border-background">3</Badge>
        </button>
        <Link href="/settings" className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent/10 flex items-center justify-center" data-testid="button-settings-top">
          <Settings className="h-5 w-5" />
        </Link>
        <button className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground border border-border hover:border-primary transition-colors" data-testid="button-user-profile">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
