import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface StatusBadgeProps {
  isCompliant: boolean;
  size?: "sm" | "default";
}

export default function StatusBadge({ isCompliant, size = "default" }: StatusBadgeProps) {
  return (
    <Badge 
      variant={isCompliant ? "default" : "destructive"}
      className="gap-1"
      data-testid={`status-badge-${isCompliant ? 'compliant' : 'non-compliant'}`}
    >
      {isCompliant ? (
        <>
          <CheckCircle2 className="h-3 w-3" />
          Compliant
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          Non-Compliant
        </>
      )}
    </Badge>
  );
}
