import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppHeader from "@/components/AppHeader";
import Routes from "@/pages/Routes";
import Compare from "@/pages/Compare";
import Banking from "@/pages/Banking";
import Pooling from "@/pages/Pooling";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Routes} />
      <Route path="/compare" component={Compare} />
      <Route path="/banking" component={Banking} />
      <Route path="/pooling" component={Pooling} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <AppHeader />
          <main className="container max-w-7xl mx-auto px-6 py-8">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
