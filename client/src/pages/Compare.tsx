import { useQuery } from "@tanstack/react-query";
import ComparisonTable, { ComparisonData } from "@/components/ComparisonTable";
import ComparisonChart, { ChartData } from "@/components/ComparisonChart";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function Compare() {
  const { data: comparisons = [], isLoading, error } = useQuery<ComparisonData[]>({
    queryKey: ['/api/routes/comparison'],
    queryFn: async () => {
      const svc = await import('../core/services/complianceService');
      return svc.fetchComparison();
    },
  });

  const chartData: ChartData[] = comparisons.map((comp) => ({
    routeId: comp.routeId,
    baseline: comp.baselineGhgIntensity,
    actual: comp.ghgIntensity,
    target: comp.target,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading comparison data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="p-8 text-center">
          <p className="text-destructive">Error loading comparison data: {error.message}</p>
        </Card>
      </div>
    );
  }

  if (comparisons.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Compliance Comparison</h1>
          <p className="text-muted-foreground">
            Compare route emissions against baseline and regulatory targets
          </p>
        </div>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No baseline route set. Please set a baseline in the Routes tab first.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Compliance Comparison</h1>
        <p className="text-muted-foreground">
          Compare route emissions against baseline and regulatory targets
        </p>
      </div>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Compliance Target</p>
            <p className="text-sm text-muted-foreground mt-1">
              Routes must achieve <span className="font-mono font-semibold">89.3368 gCO₂e/MJ</span> or lower
              (2% below the baseline of 91.16 gCO₂e/MJ) to be compliant with FuelEU Maritime regulations.
            </p>
          </div>
        </div>
      </Card>

      <ComparisonChart data={chartData} />

      <ComparisonTable comparisons={comparisons} />
    </div>
  );
}
