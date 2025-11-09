import PoolingPanel from '../PoolingPanel';

export default function PoolingPanelExample() {
  const mockMembers = [
    { shipId: 'SHIP001', cbBefore: 1245.8, cbAfter: 800.0 },
    { shipId: 'SHIP002', cbBefore: -450.2, cbAfter: -200.0 },
    { shipId: 'SHIP003', cbBefore: 670.5, cbAfter: 400.0 },
    { shipId: 'SHIP004', cbBefore: -120.0, cbAfter: -50.0 },
  ];

  return (
    <div className="p-6">
      <PoolingPanel
        members={mockMembers}
        onCreatePool={(members) => console.log('Create pool with members:', members)}
      />
    </div>
  );
}
