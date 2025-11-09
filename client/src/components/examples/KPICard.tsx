import KPICard from '../KPICard';
import { TrendingUp } from 'lucide-react';

export default function KPICardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <KPICard 
        label="Compliance Balance" 
        value="1,245.8" 
        subtitle="+12.5% from last year"
        icon={TrendingUp}
        trend="positive"
      />
      <KPICard 
        label="Total Routes" 
        value="127" 
        subtitle="Active routes"
      />
      <KPICard 
        label="Banked Surplus" 
        value="892.3" 
        subtitle="gCO₂eq available"
        trend="neutral"
      />
    </div>
  );
}
