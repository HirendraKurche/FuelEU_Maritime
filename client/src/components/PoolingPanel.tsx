import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

interface PoolingPanelProps {
  members: PoolMember[];
  onCreatePool: (selectedMembers: PoolMember[]) => void;
}

export default function PoolingPanel({ members, onCreatePool }: PoolingPanelProps) {
  const [selectedShips, setSelectedShips] = useState<Set<string>>(new Set());

  const toggleShip = (shipId: string) => {
    const newSelected = new Set(selectedShips);
    if (newSelected.has(shipId)) {
      newSelected.delete(shipId);
    } else {
      newSelected.add(shipId);
    }
    setSelectedShips(newSelected);
  };

  const selectedMembers = members.filter((m) => selectedShips.has(m.shipId));
  const poolSum = selectedMembers.reduce((sum, m) => sum + m.cbAfter, 0);
  const isValidPool = poolSum >= 0 && selectedMembers.length >= 2;

  // Validation: Check if deficit ships exit worse and surplus ships exit negative
  const hasInvalidDeficitShip = selectedMembers.some(
    (m) => m.cbBefore < 0 && m.cbAfter < m.cbBefore
  );
  const hasInvalidSurplusShip = selectedMembers.some(
    (m) => m.cbBefore > 0 && m.cbAfter < 0
  );

  const canCreatePool = isValidPool && !hasInvalidDeficitShip && !hasInvalidSurplusShip;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Pool Summary</h3>
            <p className="text-sm text-muted-foreground">
              {selectedMembers.length} ship{selectedMembers.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Pool Sum
            </p>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold font-mono ${poolSum >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {poolSum.toFixed(2)}
              </p>
              {poolSum >= 0 ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">gCO₂eq total</p>
          </div>
        </div>

        <Button
          onClick={() => {
            if (!canCreatePool) return;
            if (!window.confirm('Create pool with selected members?')) return;
            onCreatePool(selectedMembers);
          }}
          disabled={!canCreatePool}
          className="w-full"
          data-testid="button-create-pool"
        >
          Create Pool
        </Button>

        {selectedMembers.length > 0 && !canCreatePool && (
          <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-destructive font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pool validation failed:
            </p>
            <ul className="text-xs text-destructive mt-2 ml-6 list-disc">
              {selectedMembers.length < 2 && <li>At least 2 ships required</li>}
              {poolSum < 0 && <li>Pool sum must be ≥ 0 (current: {poolSum.toFixed(2)})</li>}
              {hasInvalidDeficitShip && <li>Deficit ships cannot exit worse</li>}
              {hasInvalidSurplusShip && <li>Surplus ships cannot exit negative</li>}
            </ul>
          </div>
        )}
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Available Ships
        </h3>
        {members.map((member) => {
          const isDeficit = member.cbBefore < 0;
          const isSurplus = member.cbBefore > 0;

          return (
            <Card key={member.shipId} className="p-4 hover-elevate" data-testid={`card-pool-member-${member.shipId}`}>
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedShips.has(member.shipId)}
                  onCheckedChange={() => toggleShip(member.shipId)}
                  data-testid={`checkbox-pool-${member.shipId}`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold font-mono">{member.shipId}</p>
                    {isDeficit && <Badge variant="destructive">Deficit</Badge>}
                    {isSurplus && <Badge variant="default">Surplus</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">CB Before</p>
                      <p className={`font-mono font-medium ${member.cbBefore < 0 ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'}`}>
                        {member.cbBefore.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CB After</p>
                      <p className={`font-mono font-medium ${member.cbAfter < 0 ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'}`}>
                        {member.cbAfter.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
