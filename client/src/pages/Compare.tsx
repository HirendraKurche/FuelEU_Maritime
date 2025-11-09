import ComparisonTable, { ComparisonData } from "@/components/ComparisonTable";
import ComparisonChart, { ChartData } from "@/components/ComparisonChart";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function Compare() {
  // TODO: remove mock data - fetch from GET /routes/comparison
  const mockComparisons: ComparisonData[] = [
    {
      routeId: 'R002',
      vesselType: 'BulkCarrier',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 88.0,
      baselineGhgIntensity: 91.0,
      percentDiff: -3.30,
      isCompliant: true,
      target: 89.3368,
    },
    {
      routeId: 'R003',
      vesselType: 'Tanker',
      fuelType: 'MGO',
      year: 2024,
      ghgIntensity: 93.5,
      baselineGhgIntensity: 91.0,
      percentDiff: 2.75,
      isCompliant: false,
      target: 89.3368,
    },
    {
      routeId: 'R004',
      vesselType: 'RoRo',
      fuelType: 'HFO',
      year: 2025,
      ghgIntensity: 89.2,
      baselineGhgIntensity: 91.0,
      percentDiff: -1.98,
      isCompliant: true,
      target: 89.3368,
    },
    {
      routeId: 'R005',
      vesselType: 'Container',
      fuelType: 'LNG',
      year: 2025,
      ghgIntensity: 90.5,
      baselineGhgIntensity: 91.0,
      percentDiff: -0.55,
      isCompliant: false,
      target: 89.3368,
    },
  ];

  // TODO: remove mock data - transform API data
  const chartData: ChartData[] = mockComparisons.map((comp) => ({
    routeId: comp.routeId,
    baseline: comp.baselineGhgIntensity,
    actual: comp.ghgIntensity,
    target: comp.target,
  }));

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

      <ComparisonTable comparisons={mockComparisons} />
    </div>
  );
}
