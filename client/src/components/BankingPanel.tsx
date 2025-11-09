import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useState } from "react";

interface BankingPanelProps {
  shipId: string;
  year: number;
  cbBefore: number;
  bankedAmount: number;
  cbAfter: number;
  onBank: (amount: number) => void;
  onApply: (amount: number) => void;
}

export default function BankingPanel({
  shipId,
  year,
  cbBefore,
  bankedAmount,
  cbAfter,
  onBank,
  onApply,
}: BankingPanelProps) {
  const [bankAmount, setBankAmount] = useState("");
  const [applyAmount, setApplyAmount] = useState("");

  const canBank = cbAfter > 0;
  const canApply = bankedAmount > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            CB Before Banking
          </p>
          <p className="text-3xl font-bold font-mono" data-testid="text-cb-before">
            {cbBefore.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">gCO₂eq</p>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Banked Amount
          </p>
          <p className="text-3xl font-bold font-mono text-green-600 dark:text-green-500" data-testid="text-banked-amount">
            {bankedAmount.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">gCO₂eq available</p>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            CB After Banking
          </p>
          <p className="text-3xl font-bold font-mono" data-testid="text-cb-after">
            {cbAfter.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">gCO₂eq</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownToLine className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Bank Surplus</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Store surplus compliance balance for future use
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bank-amount">Amount to Bank (gCO₂eq)</Label>
              <Input
                id="bank-amount"
                type="number"
                placeholder="0.00"
                value={bankAmount}
                onChange={(e) => setBankAmount(e.target.value)}
                disabled={!canBank}
                className="font-mono"
                data-testid="input-bank-amount"
              />
            </div>
            <Button
              onClick={() => {
                if (bankAmount) {
                  onBank(parseFloat(bankAmount));
                  setBankAmount("");
                }
              }}
              disabled={!canBank || !bankAmount}
              className="w-full"
              data-testid="button-bank-surplus"
            >
              Bank Surplus
            </Button>
            {!canBank && (
              <p className="text-xs text-destructive">
                Cannot bank with negative or zero CB
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpFromLine className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Apply Banked</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Use previously banked surplus to cover deficit
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="apply-amount">Amount to Apply (gCO₂eq)</Label>
              <Input
                id="apply-amount"
                type="number"
                placeholder="0.00"
                value={applyAmount}
                onChange={(e) => setApplyAmount(e.target.value)}
                disabled={!canApply}
                className="font-mono"
                data-testid="input-apply-amount"
              />
            </div>
            <Button
              onClick={() => {
                if (applyAmount) {
                  onApply(parseFloat(applyAmount));
                  setApplyAmount("");
                }
              }}
              disabled={!canApply || !applyAmount}
              className="w-full"
              data-testid="button-apply-banked"
            >
              Apply Banked
            </Button>
            {!canApply && (
              <p className="text-xs text-muted-foreground">
                No banked surplus available
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
