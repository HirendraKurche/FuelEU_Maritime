import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Ship } from "lucide-react";

const tabs = [
  { name: "Routes", path: "/" },
  { name: "Compare", path: "/compare" },
  { name: "Banking", path: "/banking" },
  { name: "Pooling", path: "/pooling" },
];

export default function AppHeader() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Ship className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold">FuelEU Maritime</h1>
              <p className="text-xs text-muted-foreground">Compliance Platform</p>
            </div>
          </div>

          <nav className="flex gap-1" data-testid="nav-tabs">
            {tabs.map((tab) => {
              const isActive = location === tab.path;
              return (
                <Link key={tab.path} href={tab.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="relative"
                    data-testid={`link-${tab.name.toLowerCase()}`}
                  >
                    {tab.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
