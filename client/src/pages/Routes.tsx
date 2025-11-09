import { useState } from "react";
import FilterPanel from "@/components/FilterPanel";
import RoutesTable, { RouteData } from "@/components/RoutesTable";

export default function Routes() {
  // TODO: remove mock functionality - replace with real API calls
  const [vesselType, setVesselType] = useState("all");
  const [fuelType, setFuelType] = useState("all");
  const [year, setYear] = useState("all");

  // TODO: remove mock data - fetch from API
  const mockRoutes: RouteData[] = [
    {
      id: '1',
      routeId: 'R001',
      vesselType: 'Container',
      fuelType: 'HFO',
      year: 2024,
      ghgIntensity: 91.0,
      fuelConsumption: 5000,
      distance: 12000,
      totalEmissions: 4500,
      isBaseline: true,
    },
    {
      id: '2',
      routeId: 'R002',
      vesselType: 'BulkCarrier',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumption: 4800,
      distance: 11500,
      totalEmissions: 4200,
    },
    {
      id: '3',
      routeId: 'R003',
      vesselType: 'Tanker',
      fuelType: 'MGO',
      year: 2024,
      ghgIntensity: 93.5,
      fuelConsumption: 5100,
      distance: 12500,
      totalEmissions: 4700,
    },
    {
      id: '4',
      routeId: 'R004',
      vesselType: 'RoRo',
      fuelType: 'HFO',
      year: 2025,
      ghgIntensity: 89.2,
      fuelConsumption: 4900,
      distance: 11800,
      totalEmissions: 4300,
    },
    {
      id: '5',
      routeId: 'R005',
      vesselType: 'Container',
      fuelType: 'LNG',
      year: 2025,
      ghgIntensity: 90.5,
      fuelConsumption: 4950,
      distance: 11900,
      totalEmissions: 4400,
    },
  ];

  // TODO: remove mock functionality - implement real filtering
  const filteredRoutes = mockRoutes.filter((route) => {
    if (vesselType !== "all" && route.vesselType !== vesselType) return false;
    if (fuelType !== "all" && route.fuelType !== fuelType) return false;
    if (year !== "all" && route.year.toString() !== year) return false;
    return true;
  });

  const handleApplyFilters = () => {
    console.log("Applying filters:", { vesselType, fuelType, year });
    // TODO: remove mock functionality - trigger API call with filters
  };

  const handleClearFilters = () => {
    setVesselType("all");
    setFuelType("all");
    setYear("all");
    console.log("Filters cleared");
  };

  const handleSetBaseline = (routeId: string) => {
    console.log("Setting baseline for route:", routeId);
    // TODO: remove mock functionality - implement POST /routes/:id/baseline
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Routes Management</h1>
        <p className="text-muted-foreground">
          View and manage maritime routes with emissions data
        </p>
      </div>

      <FilterPanel
        vesselType={vesselType}
        fuelType={fuelType}
        year={year}
        onVesselTypeChange={setVesselType}
        onFuelTypeChange={setFuelType}
        onYearChange={setYear}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <RoutesTable routes={filteredRoutes} onSetBaseline={handleSetBaseline} />
    </div>
  );
}
