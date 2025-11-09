import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface RouteData {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline?: boolean;
}

interface RoutesTableProps {
  routes: RouteData[];
  onSetBaseline: (routeId: string) => void;
}

export default function RoutesTable({ routes, onSetBaseline }: RoutesTableProps) {
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
                GHG Intensity<br />
                <span className="text-[10px] font-normal text-muted-foreground">gCO₂e/MJ</span>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">
                Fuel Consumption<br />
                <span className="text-[10px] font-normal text-muted-foreground">tonnes</span>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">
                Distance<br />
                <span className="text-[10px] font-normal text-muted-foreground">km</span>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">
                Total Emissions<br />
                <span className="text-[10px] font-normal text-muted-foreground">tonnes</span>
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route, index) => (
              <TableRow key={route.id} className="hover-elevate" data-testid={`row-route-${route.routeId}`}>
                <TableCell className="font-medium font-mono" data-testid={`text-route-id-${index}`}>
                  {route.routeId}
                </TableCell>
                <TableCell>{route.vesselType}</TableCell>
                <TableCell>
                  <Badge variant="outline">{route.fuelType}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{route.year}</TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {route.ghgIntensity.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {route.fuelConsumption.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {route.distance.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {route.totalEmissions.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {route.isBaseline ? (
                    <Badge variant="secondary">Baseline</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSetBaseline(route.routeId)}
                      data-testid={`button-set-baseline-${route.routeId}`}
                    >
                      Set Baseline
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
