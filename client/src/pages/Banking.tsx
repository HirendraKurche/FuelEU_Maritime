import { useState } from "react";
import BankingPanel from "@/components/BankingPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Banking() {
  const [selectedYear, setSelectedYear] = useState("2025");

  // TODO: remove mock data - fetch from GET /compliance/cb?year=YYYY
  const mockBankingData = {
    shipId: "SHIP001",
    year: parseInt(selectedYear),
    cbBefore: 1245.8,
    bankedAmount: 892.3,
    cbAfter: 1245.8,
  };

  const handleBank = (amount: number) => {
    console.log("Banking surplus:", amount);
    // TODO: remove mock functionality - implement POST /banking/bank
  };

  const handleApply = (amount: number) => {
    console.log("Applying banked surplus:", amount);
    // TODO: remove mock functionality - implement POST /banking/apply
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

      <BankingPanel
        shipId={mockBankingData.shipId}
        year={mockBankingData.year}
        cbBefore={mockBankingData.cbBefore}
        bankedAmount={mockBankingData.bankedAmount}
        cbAfter={mockBankingData.cbAfter}
        onBank={handleBank}
        onApply={handleApply}
      />
    </div>
  );
}
