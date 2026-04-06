import {
  countTrackedVisits,
  hasVisitInsightsStorage,
  loadVisitRecords,
} from '../lib/visit-insights.js';

const json = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  },
});

export const runtime = 'nodejs';

export async function GET() {
  if (!hasVisitInsightsStorage()) {
    return json({
      configured: false,
      error: 'Visit insights storage is not configured.',
    }, 503);
  }

  try {
    const visits = await loadVisitRecords();

    return json({
      configured: true,
      totalCount: countTrackedVisits(visits),
    });
  } catch {
    return json({ error: 'Failed to load visit count.' }, 500);
  }
}
