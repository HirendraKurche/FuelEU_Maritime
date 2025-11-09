import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from '@/components/ui/card';

export interface ChartData {
  routeId: string;
  baseline: number;
  actual: number;
  target: number;
}

interface ComparisonChartProps {
  data: ChartData[];
}

export default function ComparisonChart({ data }: ComparisonChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">GHG Intensity Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="routeId" 
            className="text-xs"
            tick={{ fill: 'hsl(var(--foreground))' }}
          />
          <YAxis 
            label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft' }}
            className="text-xs"
            tick={{ fill: 'hsl(var(--foreground))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
          />
          <Legend />
          <ReferenceLine 
            y={89.3368} 
            stroke="hsl(var(--destructive))" 
            strokeDasharray="3 3" 
            label={{ value: 'Target: 89.3368', fill: 'hsl(var(--destructive))' }}
          />
          <Bar dataKey="baseline" fill="hsl(var(--chart-1))" name="Baseline" />
          <Bar dataKey="actual" fill="hsl(var(--chart-2))" name="Actual" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
