import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "positive" | "negative" | "neutral";
  className?: string;
}

export default function KPICard({ label, value, subtitle, icon: Icon, trend, className }: KPICardProps) {
  const getTrendColor = () => {
    if (!trend) return "";
    switch (trend) {
      case "positive":
        return "text-green-600 dark:text-green-500";
      case "negative":
        return "text-red-600 dark:text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={`p-6 ${className || ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            {label}
          </p>
          <p className="text-3xl font-bold font-mono" data-testid={`kpi-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-sm font-medium mt-2 ${getTrendColor()}`} data-testid={`kpi-subtitle-${label.toLowerCase().replace(/\s+/g, '-')}`}>
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className="ml-4">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
    </Card>
  );
}
