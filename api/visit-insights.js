import {
  hasVisitInsightsStorage,
  hasVisitInsightsToken,
  isVisitInsightsAuthorized,
  loadVisitRecords,
  summarizeVisits,
} from '../lib/visit-insights.js';

const json = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  },
});

export const runtime = 'nodejs';

export async function GET(request) {
  if (!hasVisitInsightsStorage()) {
    return json({
      configured: false,
      error: 'Visit insights storage is not configured.',
    }, 503);
  }

  if (!hasVisitInsightsToken()) {
    return json({
      configured: false,
      error: 'Visit insights token is not configured.',
    }, 503);
  }

  const url = new URL(request.url);
  const providedToken = url.searchParams.get('token') || request.headers.get('x-visit-insights-token');

  if (!isVisitInsightsAuthorized(providedToken)) {
    return json({ error: 'Unauthorized.' }, 401);
  }

  try {
    const visits = await loadVisitRecords();

    return json({
      configured: true,
      generatedAt: new Date().toISOString(),
      ...summarizeVisits(visits),
    });
  } catch {
    return json({ error: 'Failed to load visit insights.' }, 500);
  }
}
