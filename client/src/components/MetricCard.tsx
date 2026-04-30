import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon?: ReactNode;
}

export default function MetricCard({
  title,
  value,
  change,
  changeType,
  icon,
}: MetricCardProps) {
  return (
    <Card className="bg-card border-card-border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground tracking-tight">
            {title}
          </span>
          {icon && (
            <div className="text-primary bg-primary/10 p-2 rounded-lg">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{value}</span>
          {change && (
            <span
              className={cn(
                "text-xs font-medium flex items-center",
                changeType === "up"
                  ? "text-green-500"
                  : changeType === "down"
                    ? "text-destructive"
                    : "text-muted-foreground",
              )}
            >
              {changeType === "up" && (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              )}
              {changeType === "down" && (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              )}
              {changeType === "neutral" && <Minus className="h-3 w-3 mr-0.5" />}
              {change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
