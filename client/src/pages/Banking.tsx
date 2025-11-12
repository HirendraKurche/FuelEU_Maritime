import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import BankingPanel from "@/components/BankingPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { AdjustedCB } from "@shared/schema";

export default function Banking() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedShip, setSelectedShip] = useState<string>("");
  const { toast } = useToast();

  const { data: adjustedCBData = [] } = useQuery<AdjustedCB[]>({
    queryKey: ['/api/compliance/adjusted-cb', selectedYear],
    queryFn: async () => {
      const svc = await import('../core/services/complianceService');
      return svc.fetchAdjustedCB(selectedYear);
    },
  });

  // Auto-select first ship when data loads or changes
  useEffect(() => {
    if (adjustedCBData.length > 0 && !adjustedCBData.find(cb => cb.shipId === selectedShip)) {
      setSelectedShip(adjustedCBData[0].shipId);
    }
  }, [adjustedCBData, selectedShip]);

  const bankingData = adjustedCBData.find(cb => cb.shipId === selectedShip) || null;

  const bankMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!bankingData) throw new Error("No ship selected");
      return apiRequest("POST", "/api/banking/bank", {
        shipId: bankingData.shipId,
        year: parseInt(selectedYear),
        amount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/adjusted-cb', selectedYear] });
      toast({
        title: "Success",
        description: "Surplus banked successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to bank surplus",
        variant: "destructive",
      });
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!bankingData) throw new Error("No ship selected");
      return apiRequest("POST", "/api/banking/apply", {
        shipId: bankingData.shipId,
        year: parseInt(selectedYear),
        amount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/adjusted-cb', selectedYear] });
      toast({
        title: "Success",
        description: "Banked surplus applied successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to apply banked surplus",
        variant: "destructive",
      });
    },
  });

  const handleBank = (amount: number) => {
    bankMutation.mutate(amount);
  };

  const handleApply = (amount: number) => {
    applyMutation.mutate(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Banking Operations</h1>
          <p className="text-muted-foreground">
            Manage surplus compliance balance banking and application
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="w-40">
            <Label htmlFor="ship-select" className="text-xs font-medium text-muted-foreground mb-2 block">
              Ship
            </Label>
            <Select value={selectedShip} onValueChange={setSelectedShip}>
              <SelectTrigger id="ship-select" data-testid="select-ship">
                <SelectValue placeholder="Select ship" />
              </SelectTrigger>
              <SelectContent>
                {adjustedCBData.map((ship) => (
                  <SelectItem key={ship.shipId} value={ship.shipId}>
                    {ship.shipId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-40">
            <Label htmlFor="year-select" className="text-xs font-medium text-muted-foreground mb-2 block">
              Year
            </Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="year-select" data-testid="select-banking-year">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {bankingData ? (
        <BankingPanel
          shipId={bankingData.shipId}
          year={bankingData.year}
          cbBefore={bankingData.cbBefore}
          bankedAmount={bankingData.bankedAmount}
          cbAfter={bankingData.cbAfter}
          onBank={handleBank}
          onApply={handleApply}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No ship data available for the selected year. Please try a different year.
          </p>
        </div>
      )}
    </div>
  );
}
