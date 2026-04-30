import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

// Layout
import AppLayout from "@/layouts/AppLayout";

// Pages
import Dashboard from "@/pages/Dashboard";
import UploadSources from "@/pages/UploadSources";
import ProcessingPipeline from "@/pages/ProcessingPipeline";
import DataCollections from "@/pages/DataCollections";
import QueryWorkspace from "@/pages/QueryWorkspace";
import GraphExplorer from "@/pages/GraphExplorer";
import Insights from "@/pages/Insights";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/upload" component={UploadSources} />
        <Route path="/pipeline" component={ProcessingPipeline} />
        <Route path="/collections" component={DataCollections} />
        <Route path="/query" component={QueryWorkspace} />
        <Route path="/graph" component={GraphExplorer} />
        <Route path="/insights" component={Insights} />
        <Route path="/reports" component={Dashboard} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  useEffect(() => {
    // Force dark mode for this enterprise theme
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
