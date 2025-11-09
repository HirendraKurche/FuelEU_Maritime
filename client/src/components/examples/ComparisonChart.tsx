import ComparisonChart from '../ComparisonChart';

export default function ComparisonChartExample() {
  const mockData = [
    { routeId: 'R001', baseline: 91.0, actual: 91.0, target: 89.3368 },
    { routeId: 'R002', baseline: 91.0, actual: 88.0, target: 89.3368 },
    { routeId: 'R003', baseline: 91.0, actual: 93.5, target: 89.3368 },
    { routeId: 'R004', baseline: 91.0, actual: 89.2, target: 89.3368 },
  ];

  return (
    <div className="p-6">
      <ComparisonChart data={mockData} />
    </div>
  );
}
