import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, AlertTriangle, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";
import { insightLineData, insightTrendItems, insightAnomalyData, LineDataPoint, TrendItem, AnomalyData } from "@/mock/mockInsights";

interface InsightWidgetProps {
  type: 'line' | 'heatmap' | 'cluster' | 'kpi' | 'trend' | 'anomaly';
  title: string;
  data?: {
    value?: string;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    points?: LineDataPoint[];
    items?: TrendItem[];
    anomaly?: AnomalyData;
  };
}

export default function InsightWidget({ type, title, data }: InsightWidgetProps) {
  const renderContent = () => {
    switch (type) {
      case 'kpi':
        return (
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-foreground">{data?.value ?? '—'}</span>
            <div className="flex items-center mt-2 text-sm">
              <span className={cn("font-medium flex items-center", data?.trendDirection === 'up' ? "text-green-500" : "text-destructive")}>
                {data?.trendDirection === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {data?.trend ?? '—'}
              </span>
              <span className="text-muted-foreground ml-2">vs last week</span>
            </div>
          </div>
        );

      case 'line': {
        const points = data?.points ?? insightLineData;
        if (!points.length) {
          return (
            <div className="h-[200px] w-full flex items-center justify-center bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">No data available</p>
            </div>
          );
        }
        return (
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--primary))' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      }

      case 'heatmap':
        return (
          <div className="h-[200px] w-full bg-secondary/30 rounded-lg flex items-center justify-center border border-border/50">
            <div className="text-center">
              <div className="grid grid-cols-5 gap-1 mb-2">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-sm bg-primary" style={{ opacity: (i % 7) / 8 + 0.15 }} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">Activity Heatmap — connect data source</span>
            </div>
          </div>
        );

      case 'cluster':
        return (
          <div className="h-[200px] w-full bg-secondary/30 rounded-lg flex items-center justify-center border border-border/50 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-50">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/50 absolute top-8 left-10" />
              <div className="w-24 h-24 rounded-full bg-primary/20 border border-primary/50 absolute top-12 right-12" />
              <div className="w-20 h-20 rounded-full bg-purple-500/20 border border-purple-500/50 absolute bottom-6 left-1/2 -translate-x-1/2" />
            </div>
            <span className="text-xs text-muted-foreground z-10 bg-background/80 px-2 py-1 rounded">Entity Clusters — connect graph renderer</span>
          </div>
        );

      case 'anomaly': {
        const anomaly = data?.anomaly ?? insightAnomalyData;
        return (
          <div className="h-[200px] w-full flex flex-col items-center justify-center bg-destructive/10 rounded-lg border border-destructive/20 text-center p-4">
            <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
            <h4 className="text-sm font-semibold text-destructive mb-1">{anomaly.title}</h4>
            <p className="text-xs text-muted-foreground max-w-[200px]">{anomaly.description}</p>
            <Button variant="outline" size="sm" className="mt-4 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground">
              Investigate
            </Button>
          </div>
        );
      }

      case 'trend': {
        const items = data?.items ?? insightTrendItems;
        if (!items.length) {
          return (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-xs text-muted-foreground">No trend data available</p>
            </div>
          );
        }
        return (
          <div className="h-[200px] w-full flex flex-col justify-center">
            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Card className="bg-card border-card-border shadow-sm">
      <CardHeader className="pb-4 pt-5 px-5">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
