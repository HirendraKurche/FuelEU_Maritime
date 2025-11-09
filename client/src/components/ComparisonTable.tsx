import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";

export interface ComparisonData {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  baselineGhgIntensity: number;
  percentDiff: number;
  isCompliant: boolean;
  target: number;
}

interface ComparisonTableProps {
  comparisons: ComparisonData[];
}

export default function ComparisonTable({ comparisons }: ComparisonTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Route ID</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Vessel Type</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">Fuel Type</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">Year</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">
                Baseline<br />
                <span className="text-[10px] font-normal text-muted-foreground">gCO₂e/MJ</span>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">
                Actual<br />
                <span className="text-[10px] font-normal text-muted-foreground">gCO₂e/MJ</span>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">
                Target<br />
                <span className="text-[10px] font-normal text-muted-foreground">gCO₂e/MJ</span>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">% Diff</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisons.map((comp, index) => (
              <TableRow key={comp.routeId} className="hover-elevate" data-testid={`row-comparison-${comp.routeId}`}>
                <TableCell className="font-medium font-mono">{comp.routeId}</TableCell>
                <TableCell>{comp.vesselType}</TableCell>
                <TableCell>
                  <Badge variant="outline">{comp.fuelType}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{comp.year}</TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {comp.baselineGhgIntensity.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {comp.ghgIntensity.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {comp.target.toFixed(4)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  <span className={comp.percentDiff > 0 ? "text-red-600 dark:text-red-500" : "text-green-600 dark:text-green-500"}>
                    {comp.percentDiff > 0 ? '+' : ''}{comp.percentDiff.toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <StatusBadge isCompliant={comp.isCompliant} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
