import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface FilterPanelProps {
  vesselType: string;
  fuelType: string;
  year: string;
  onVesselTypeChange: (value: string) => void;
  onFuelTypeChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function FilterPanel({
  vesselType,
  fuelType,
  year,
  onVesselTypeChange,
  onFuelTypeChange,
  onYearChange,
  onApply,
  onClear,
}: FilterPanelProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold uppercase tracking-wide">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Vessel Type
          </label>
          <Select value={vesselType} onValueChange={onVesselTypeChange}>
            <SelectTrigger data-testid="select-vessel-type">
              <SelectValue placeholder="All vessels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vessels</SelectItem>
              <SelectItem value="Container">Container</SelectItem>
              <SelectItem value="BulkCarrier">Bulk Carrier</SelectItem>
              <SelectItem value="Tanker">Tanker</SelectItem>
              <SelectItem value="RoRo">RoRo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Fuel Type
          </label>
          <Select value={fuelType} onValueChange={onFuelTypeChange}>
            <SelectTrigger data-testid="select-fuel-type">
              <SelectValue placeholder="All fuels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fuels</SelectItem>
              <SelectItem value="HFO">HFO</SelectItem>
              <SelectItem value="LNG">LNG</SelectItem>
              <SelectItem value="MGO">MGO</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Year
          </label>
          <Select value={year} onValueChange={onYearChange}>
            <SelectTrigger data-testid="select-year">
              <SelectValue placeholder="All years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button onClick={onApply} className="flex-1" data-testid="button-apply-filters">
            Apply
          </Button>
          <Button onClick={onClear} variant="outline" size="icon" data-testid="button-clear-filters">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
