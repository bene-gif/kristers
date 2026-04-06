import { randomUUID, timingSafeEqual } from 'node:crypto';
import { list, put } from '@vercel/blob';

const VISIT_PREFIX = 'visit-insights/';

const decodeHeader = (value) => {
  if (!value) {
    return null;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const getClientIp = (headers) => {
  const forwarded = headers.get('x-forwarded-for');

  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || null;
  }

  return headers.get('x-real-ip')?.trim() || null;
};

const parseAsn = (organization) => {
  if (!organization) {
    return {
      asn: null,
      asName: null,
    };
  }

  const match = organization.match(/^(AS\d+)\s+(.+)$/i);

  if (!match) {
    return {
      asn: organization.trim(),
      asName: null,
    };
  }

  return {
    asn: match[1],
    asName: match[2].trim(),
  };
};

const fetchAsnDetails = async (ipAddress) => {
  if (!ipAddress) {
    return {
      asn: null,
      asName: null,
      city: null,
      region: null,
      country: null,
    };
  }

  try {
    const response = await fetch(`https://ipinfo.io/${ipAddress}/json`, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`ASN lookup failed with ${response.status}`);
    }

    const data = await response.json();
    const parsed = parseAsn(data.org);

    return {
      asn: parsed.asn,
      asName: parsed.asName,
      city: data.city || null,
      region: data.region || null,
      country: data.country || null,
    };
  } catch {
    return {
      asn: null,
      asName: null,
      city: null,
      region: null,
      country: null,
    };
  }
};

export const hasVisitInsightsStorage = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export const hasVisitInsightsToken = () => Boolean(process.env.VISIT_INSIGHTS_TOKEN);

export const isVisitInsightsAuthorized = (providedToken) => {
  const expectedToken = process.env.VISIT_INSIGHTS_TOKEN;

  if (!expectedToken || !providedToken) {
    return false;
  }

  const expectedBuffer = Buffer.from(expectedToken);
  const providedBuffer = Buffer.from(providedToken);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
};

export const buildVisitRecord = async (request, payload) => {
  const headers = request.headers;
  const ipAddress = getClientIp(headers);
  const asnDetails = await fetchAsnDetails(ipAddress);

  return {
    id: randomUUID(),
    recordedAt: new Date().toISOString(),
    host: payload.domain || headers.get('host') || null,
    path: payload.pagePath || '/',
    pageTitle: payload.pageTitle || null,
    referrer: payload.referrer || null,
    country: decodeHeader(headers.get('x-vercel-ip-country')) || asnDetails.country,
    region: decodeHeader(headers.get('x-vercel-ip-country-region')) || asnDetails.region,
    city: decodeHeader(headers.get('x-vercel-ip-city')) || asnDetails.city,
    asn: asnDetails.asn,
    asName: asnDetails.asName,
    source: payload.visitKind || 'page-load',
  };
};

export const storeVisitRecord = async (visit) => {
  const dayKey = visit.recordedAt.slice(0, 10);

  await put(`${VISIT_PREFIX}${dayKey}/${visit.id}.json`, JSON.stringify(visit), {
    access: 'public',
    addRandomSuffix: false,
    cacheControlMaxAge: 0,
    contentType: 'application/json',
  });
};

export const loadVisitRecords = async () => {
  const blobs = [];
  let cursor;

  do {
    const page = await list({
      cursor,
      limit: 1000,
      prefix: VISIT_PREFIX,
    });

    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const visits = [];

  await Promise.all(blobs.map(async (blob) => {
    const response = await fetch(blob.url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return;
    }

    try {
      const visit = await response.json();
      visits.push(visit);
    } catch {
      // Ignore malformed records rather than failing the whole dashboard.
    }
  }));

  return visits.sort((left, right) => right.recordedAt.localeCompare(left.recordedAt));
};

const rankCounts = (labels) => {
  const counts = new Map();

  labels.forEach((label) => {
    if (!label) {
      return;
    }

    counts.set(label, (counts.get(label) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })
    .slice(0, 8)
    .map(([label, count]) => ({
      label,
      count,
    }));
};

export const summarizeVisits = (visits) => ({
  totalVisits: visits.length,
  topCountries: rankCounts(visits.map((visit) => visit.country)),
  topCities: rankCounts(visits.map((visit) => {
    if (!visit.city) {
      return null;
    }

    return visit.country ? `${visit.city}, ${visit.country}` : visit.city;
  })),
  topNetworks: rankCounts(visits.map((visit) => {
    if (!visit.asn && !visit.asName) {
      return null;
    }

    return [visit.asn, visit.asName].filter(Boolean).join(' ');
  })),
  recentVisits: visits.slice(0, 24).map((visit) => ({
    id: visit.id,
    recordedAt: visit.recordedAt,
    country: visit.country,
    city: visit.city,
    asn: visit.asn,
    asName: visit.asName,
    path: visit.path,
  })),
});

export const countTrackedVisits = (visits) => visits.filter((visit) => visit.source !== 'repeat-browser-visit').length;
