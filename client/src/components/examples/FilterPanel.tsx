import { useState } from 'react';
import FilterPanel from '../FilterPanel';

export default function FilterPanelExample() {
  const [vesselType, setVesselType] = useState('all');
  const [fuelType, setFuelType] = useState('all');
  const [year, setYear] = useState('all');

  return (
    <div className="p-6">
      <FilterPanel
        vesselType={vesselType}
        fuelType={fuelType}
        year={year}
        onVesselTypeChange={setVesselType}
        onFuelTypeChange={setFuelType}
        onYearChange={setYear}
        onApply={() => console.log('Apply filters', { vesselType, fuelType, year })}
        onClear={() => {
          setVesselType('all');
          setFuelType('all');
          setYear('all');
        }}
      />
    </div>
  );
}
