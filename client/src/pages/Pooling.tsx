import { useState } from "react";
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

export default function Pooling() {
  const [selectedYear, setSelectedYear] = useState("2025");

  // TODO: remove mock data - fetch from GET /compliance/adjusted-cb?year=YYYY
  const mockMembers: PoolMember[] = [
    { shipId: 'SHIP001', cbBefore: 1245.8, cbAfter: 800.0 },
    { shipId: 'SHIP002', cbBefore: -450.2, cbAfter: -200.0 },
    { shipId: 'SHIP003', cbBefore: 670.5, cbAfter: 400.0 },
    { shipId: 'SHIP004', cbBefore: -120.0, cbAfter: -50.0 },
    { shipId: 'SHIP005', cbBefore: 892.3, cbAfter: 600.0 },
  ];

  const handleCreatePool = (selectedMembers: PoolMember[]) => {
    console.log("Creating pool with members:", selectedMembers);
    // TODO: remove mock functionality - implement POST /pools
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

      <PoolingPanel members={mockMembers} onCreatePool={handleCreatePool} />
    </div>
  );
}
