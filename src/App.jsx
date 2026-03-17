import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import IntroOverlay from './components/IntroOverlay';
import ProjectList from './components/ProjectList';
import VisitInsightsPanel from './components/VisitInsightsPanel';
import './components/ProjectList.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
      <>
      {showIntro ? <IntroOverlay onComplete={() => setShowIntro(false)} /> : null}
      <div className={`app-shell ${showIntro ? 'app-shell--hidden' : 'app-shell--ready'}`}>
        <ProjectList />
        <VisitInsightsPanel />
      </div>
      <Analytics />
    </>
  );
}

export default App;
