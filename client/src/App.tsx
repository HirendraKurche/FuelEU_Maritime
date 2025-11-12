import React, { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppHeader from "@/components/AppHeader";

// Lazy-load route pages to enable code-splitting and reduce initial bundle size
const Routes = lazy(() => import("@/pages/Routes"));
const Compare = lazy(() => import("@/pages/Compare"));
const Banking = lazy(() => import("@/pages/Banking"));
const Pooling = lazy(() => import("@/pages/Pooling"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    // Suspense wraps the switch so lazy pages render with a fallback while loading
    <Suspense fallback={<div className="py-8 text-center">Loading...</div>}>
      <Switch>
        <Route path="/" component={Routes} />
        <Route path="/compare" component={Compare} />
        <Route path="/banking" component={Banking} />
        <Route path="/pooling" component={Pooling} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
