import {
  buildVisitRecord,
  hasVisitInsightsStorage,
  storeVisitRecord,
} from '../lib/visit-insights.js';

const json = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  },
});

export const runtime = 'nodejs';

export async function POST(request) {
  if (!hasVisitInsightsStorage()) {
    return json({
      configured: false,
      error: 'Visit insights storage is not configured.',
    }, 503);
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  try {
    const visit = await buildVisitRecord(request, payload);
    await storeVisitRecord(visit);

    return json({
      configured: true,
      logged: true,
    }, 201);
  } catch (error) {
    console.error('visit-log failed', error);
    return json({ error: 'Failed to log visit metadata.' }, 500);
  }
}
