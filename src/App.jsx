import { Suspense, lazy, useMemo, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import IntroOverlay from './components/IntroOverlay';
import ProjectList from './components/ProjectList';
import './components/ProjectList.css';

const VisitInsightsPanel = lazy(() => import('./components/VisitInsightsPanel'));

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const showInsightsPanel = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return new URLSearchParams(window.location.search).has('insights');
  }, []);

  return (
      <>
      {showIntro ? <IntroOverlay onComplete={() => setShowIntro(false)} /> : null}
      <div className={`app-shell ${showIntro ? 'app-shell--hidden' : 'app-shell--ready'}`}>
        <ProjectList />
        {showInsightsPanel ? (
          <Suspense fallback={null}>
            <VisitInsightsPanel />
          </Suspense>
        ) : null}
      </div>
      <Analytics />
    </>
  );
}

export default App;
