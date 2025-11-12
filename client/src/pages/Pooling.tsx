import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import PoolingPanel, { PoolMember } from "@/components/PoolingPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AdjustedCB } from "@shared/schema";

export default function Pooling() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const { toast } = useToast();

  const { data: adjustedCBData = [] } = useQuery<AdjustedCB[]>({
    queryKey: ['/api/compliance/adjusted-cb', selectedYear],
    queryFn: async () => {
      const svc = await import('../core/services/complianceService');
      return svc.fetchAdjustedCB(selectedYear);
    },
  });

  const members: PoolMember[] = adjustedCBData.map(cb => ({
    shipId: cb.shipId,
    cbBefore: cb.cbBefore,
    cbAfter: cb.cbAfter,
  }));

  const createPoolMutation = useMutation({
    mutationFn: async (selectedMembers: PoolMember[]) => {
      return apiRequest("POST", "/api/pools", {
        year: parseInt(selectedYear),
        members: selectedMembers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/adjusted-cb', selectedYear] });
      toast({
        title: "Success",
        description: "Pool created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create pool",
        variant: "destructive",
      });
    },
  });

  const handleCreatePool = (selectedMembers: PoolMember[]) => {
    createPoolMutation.mutate(selectedMembers);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Pooling Management</h1>
          <p className="text-muted-foreground">
            Create compliance pools to redistribute balance among ships
          </p>
        </div>
        
        <div className="w-40">
          <Label htmlFor="year-select" className="text-xs font-medium text-muted-foreground mb-2 block">
            Year
          </Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger id="year-select" data-testid="select-pooling-year">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Pool Validation Rules</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Pool sum (adjusted CB) must be ≥ 0</li>
              <li>• Deficit ships cannot exit with worse balance</li>
              <li>• Surplus ships cannot exit with negative balance</li>
              <li>• Minimum 2 ships required per pool</li>
            </ul>
          </div>
        </div>
      </Card>

      <PoolingPanel members={members} onCreatePool={handleCreatePool} />
    </div>
  );
}
