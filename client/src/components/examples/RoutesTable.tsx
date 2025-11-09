import RoutesTable from '../RoutesTable';

export default function RoutesTableExample() {
  const mockRoutes = [
    {
      id: '1',
      routeId: 'R001',
      vesselType: 'Container',
      fuelType: 'HFO',
      year: 2024,
      ghgIntensity: 91.0,
      fuelConsumption: 5000,
      distance: 12000,
      totalEmissions: 4500,
      isBaseline: true,
    },
    {
      id: '2',
      routeId: 'R002',
      vesselType: 'BulkCarrier',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumption: 4800,
      distance: 11500,
      totalEmissions: 4200,
    },
    {
      id: '3',
      routeId: 'R003',
      vesselType: 'Tanker',
      fuelType: 'MGO',
      year: 2024,
      ghgIntensity: 93.5,
      fuelConsumption: 5100,
      distance: 12500,
      totalEmissions: 4700,
    },
  ];

  return (
    <div className="p-6">
      <RoutesTable
        routes={mockRoutes}
        onSetBaseline={(routeId) => console.log('Set baseline for', routeId)}
      />
    </div>
  );
}
