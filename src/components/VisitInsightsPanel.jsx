import { useEffect, useMemo, useState } from 'react';
import './VisitInsightsPanel.css';

const formatTimestamp = (value) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

function VisitInsightsPanel() {
  const token = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return new URLSearchParams(window.location.search).get('insights');
  }, []);
  const [status, setStatus] = useState(token ? 'loading' : 'hidden');
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isMounted = true;

    const loadInsights = async () => {
      try {
        const response = await fetch(`/api/visit-insights?token=${encodeURIComponent(token)}`, {
          cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load visit insights.');
        }

        if (!isMounted) {
          return;
        }

        setInsights(data);
        setError('');
        setStatus('ready');
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setStatus('error');
        setError(loadError instanceof Error ? loadError.message : 'Failed to load visit insights.');
      }
    };

    loadInsights();
    const intervalId = window.setInterval(loadInsights, 45000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [token]);

  if (!token || status === 'hidden') {
    return null;
  }

  const closePanel = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('insights');
    window.history.replaceState({}, '', url.toString());
    window.location.reload();
  };

  return (
    <aside className="visit-insights-panel" aria-live="polite">
      <div className="visit-insights-panel__header">
        <div>
          <p className="visit-insights-panel__eyebrow mono">visit insights</p>
          <h2 className="visit-insights-panel__title">Country, city, ASN</h2>
        </div>
        <button
          className="visit-insights-panel__close mono"
          type="button"
          onClick={closePanel}
        >
          close
        </button>
      </div>

      {status === 'loading' ? <p className="visit-insights-panel__message mono">loading…</p> : null}
      {status === 'error' ? <p className="visit-insights-panel__message mono">{error}</p> : null}

      {status === 'ready' && insights ? (
        <>
          <div className="visit-insights-panel__total">
            <span className="visit-insights-panel__total-label mono">tracked visits</span>
            <span className="visit-insights-panel__total-value">{insights.totalVisits}</span>
          </div>

          <div className="visit-insights-panel__grid">
            <section>
              <h3 className="visit-insights-panel__section-title mono">Top Countries</h3>
              <ul className="visit-insights-panel__list">
                {insights.topCountries.map((entry) => (
                  <li key={entry.label} className="visit-insights-panel__list-item">
                    <span>{entry.label}</span>
                    <span className="mono">{entry.count}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="visit-insights-panel__section-title mono">Top Cities</h3>
              <ul className="visit-insights-panel__list">
                {insights.topCities.map((entry) => (
                  <li key={entry.label} className="visit-insights-panel__list-item">
                    <span>{entry.label}</span>
                    <span className="mono">{entry.count}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="visit-insights-panel__section-title mono">Top Networks</h3>
              <ul className="visit-insights-panel__list">
                {insights.topNetworks.map((entry) => (
                  <li key={entry.label} className="visit-insights-panel__list-item">
                    <span>{entry.label}</span>
                    <span className="mono">{entry.count}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section>
            <h3 className="visit-insights-panel__section-title mono">Recent Visits</h3>
            <ul className="visit-insights-panel__recent-list">
              {insights.recentVisits.map((visit) => (
                <li key={visit.id} className="visit-insights-panel__recent-item">
                  <div>
                    <p>{[visit.city, visit.country].filter(Boolean).join(', ') || 'Unknown location'}</p>
                    <p className="visit-insights-panel__recent-network mono">
                      {[visit.asn, visit.asName].filter(Boolean).join(' ') || 'ASN unavailable'}
                    </p>
                  </div>
                  <time className="mono" dateTime={visit.recordedAt}>
                    {formatTimestamp(visit.recordedAt)}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </aside>
  );
}

export default VisitInsightsPanel;
