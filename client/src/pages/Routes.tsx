import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import FilterPanel from "@/components/FilterPanel";
import RoutesTable, { RouteData } from "@/components/RoutesTable";
import { useToast } from "@/hooks/use-toast";

export default function Routes() {
  const [vesselType, setVesselType] = useState("all");
  const [fuelType, setFuelType] = useState("all");
  const [year, setYear] = useState("all");
  const { toast } = useToast();

  const { data: routes = [], isLoading } = useQuery<RouteData[]>({
    queryKey: ['/api/routes', vesselType, fuelType, year],
    queryFn: async () => {
      const result = await import('../core/services/routeService');
      return result.fetchRoutes({ vesselType, fuelType, year });
    },
  });

  const setBaselineMutation = useMutation({
    mutationFn: async (routeId: string) => {
      return apiRequest("POST", `/api/routes/${routeId}/baseline`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          query.queryKey[0] === '/api/routes' ||
          query.queryKey[0] === '/api/routes/comparison'
      });
      toast({
        title: "Baseline Set",
        description: "Route baseline has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to set baseline",
        variant: "destructive",
      });
    },
  });

  const handleApplyFilters = () => {
    // Filters are already applied via query key
  };

  const handleClearFilters = () => {
    setVesselType("all");
    setFuelType("all");
    setYear("all");
  };

  const handleSetBaseline = (routeId: string) => {
    setBaselineMutation.mutate(routeId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading routes...</p>
      </div>
    );
  }

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

      <RoutesTable routes={routes} onSetBaseline={handleSetBaseline} />
    </div>
  );
}
