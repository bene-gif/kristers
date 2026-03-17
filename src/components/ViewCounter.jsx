import { useEffect, useState } from 'react';
import './ViewCounter.css';

const VISITOR_FLAG = 'kristersdzenis-portfolio:visit-counted';
const COUNTER_ENDPOINT = 'https://visitor.6developer.com/visit';

function ViewCounter() {
  const [count, setCount] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;

    const loadCount = async () => {
      const shouldIncrement = !window.localStorage.getItem(VISITOR_FLAG);
      const domain = window.location.hostname;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const pagePath = window.location.pathname;
      const pageTitle = document.title;
      const referrer = document.referrer;

      fetch('/api/visit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          timezone,
          pagePath,
          pageTitle,
          referrer,
          visitKind: shouldIncrement ? 'first-browser-visit' : 'repeat-browser-visit',
        }),
        keepalive: true,
      }).catch(() => {});

      try {
        const response = shouldIncrement
          ? await fetch(COUNTER_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                domain,
                timezone,
                page_path: pagePath,
                page_title: pageTitle,
                referrer,
              }),
            })
          : await fetch(`${COUNTER_ENDPOINT}?domain=${encodeURIComponent(domain)}`);

        if (!response.ok) {
          throw new Error(`Counter request failed with ${response.status}`);
        }

        const data = await response.json();
        if (!isMounted) {
          return;
        }

        if (typeof data.totalCount === 'number') {
          setCount(data.totalCount);
          setStatus('ready');
          if (shouldIncrement) {
            window.localStorage.setItem(VISITOR_FLAG, 'true');
          }
          return;
        }

        throw new Error('Counter value missing from response');
      } catch {
        if (isMounted) {
          setStatus('error');
        }
      }
    };

    loadCount();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="view-counter" aria-live="polite">
      <span className="view-counter__label">Visits</span>
      <span className="view-counter__value">
        {status === 'ready' && count !== null ? count.toLocaleString() : '--'}
      </span>
    </div>
  );
}

export default ViewCounter;
