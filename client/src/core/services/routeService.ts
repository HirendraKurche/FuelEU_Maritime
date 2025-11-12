export async function fetchRoutes(filters: { vesselType?: string; fuelType?: string; year?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.vesselType && filters.vesselType !== 'all') params.append('vesselType', filters.vesselType);
  if (filters.fuelType && filters.fuelType !== 'all') params.append('fuelType', filters.fuelType);
  if (filters.year && filters.year !== 'all') params.append('year', filters.year);

  const qs = params.toString();
  const url = qs ? `/api/routes?${qs}` : '/api/routes';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch routes');
  return res.json();
}
