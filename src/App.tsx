import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { RequireAuth } from "@/components/RequireAuth";
import { ChatAgent } from "@/components/ChatAgent";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import CatalogVertical from "@/pages/CatalogVertical";
import Pricing from "@/pages/Pricing";
import Dashboard from "@/pages/Dashboard";
import ImageStudio from "@/pages/ImageStudio";
import WebCrawler from "@/pages/WebCrawler";
import ProjectHistory from "@/pages/ProjectHistory";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";
import type { JSX } from "react";

function protect(Page: () => JSX.Element) {
  return () => (
    <RequireAuth>
      <Page />
    </RequireAuth>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/catalog/:code" component={CatalogVertical} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/dashboard" component={protect(Dashboard)} />
      <Route path="/dashboard/history" component={protect(ProjectHistory)} />
      <Route path="/dashboard/settings" component={protect(Settings)} />
      <Route path="/dashboard/help" component={protect(Help)} />
      <Route path="/studio/images" component={protect(ImageStudio)} />
      <Route path="/studio/crawler" component={protect(WebCrawler)} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
          <ChatAgent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
