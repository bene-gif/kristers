import { useEffect, useState } from 'react';
import './ViewCounter.css';

const VISITOR_FLAG = 'kristersdzenis-portfolio:visit-counted';

function ViewCounter() {
  const [count, setCount] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;

    const updateCount = async () => {
      const response = await fetch('/api/visit-count', {
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load visit count.');
      }

      if (typeof data.totalCount !== 'number') {
        throw new Error('Counter value missing from response');
      }

      if (!isMounted) {
        return;
      }

      setCount(data.totalCount);
      setStatus('ready');
    };

    const loadCount = async () => {
      const shouldIncrement = !window.localStorage.getItem(VISITOR_FLAG);
      const domain = window.location.hostname;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const pagePath = window.location.pathname;
      const pageTitle = document.title;
      const referrer = document.referrer;

      try {
        const response = await fetch('/api/visit-log', {
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
        });

        if (!response.ok) {
          throw new Error(`Counter request failed with ${response.status}`);
        }

        const data = await response.json();
        if (!isMounted) {
          return;
        }

        if (shouldIncrement) {
          window.localStorage.setItem(VISITOR_FLAG, 'true');
        }

        if (typeof data.totalCount === 'number') {
          setCount(data.totalCount);
          setStatus('ready');
          return;
        }

        await updateCount();
      } catch {
        try {
          await updateCount();
        } catch {
          if (isMounted) {
            setStatus('error');
          }
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
