export async function fetchComparison() {
  const res = await fetch('/api/routes/comparison');
  if (!res.ok) throw new Error('Failed to fetch comparison data');
  return res.json();
}

export async function fetchAdjustedCB(year: string) {
  const res = await fetch(`/api/compliance/adjusted-cb?year=${year}`);
  if (!res.ok) throw new Error('Failed to fetch adjusted CB');
  return res.json();
}

export async function fetchCB(year: string) {
  const res = await fetch(`/api/compliance/cb?year=${year}`);
  if (!res.ok) throw new Error('Failed to fetch compliance balance');
  return res.json();
}
