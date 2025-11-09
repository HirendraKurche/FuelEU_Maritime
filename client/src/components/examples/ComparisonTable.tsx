import ComparisonTable from '../ComparisonTable';

export default function ComparisonTableExample() {
  const mockComparisons = [
    {
      routeId: 'R002',
      vesselType: 'BulkCarrier',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 88.0,
      baselineGhgIntensity: 91.0,
      percentDiff: -3.30,
      isCompliant: true,
      target: 89.3368,
    },
    {
      routeId: 'R003',
      vesselType: 'Tanker',
      fuelType: 'MGO',
      year: 2024,
      ghgIntensity: 93.5,
      baselineGhgIntensity: 91.0,
      percentDiff: 2.75,
      isCompliant: false,
      target: 89.3368,
    },
  ];

  return (
    <div className="p-6">
      <ComparisonTable comparisons={mockComparisons} />
    </div>
  );
}
