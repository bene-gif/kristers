import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import CustomCursor from './components/CustomCursor';
import IntroOverlay from './components/IntroOverlay';
import ProjectList from './components/ProjectList';
import './components/ProjectList.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro ? <IntroOverlay onComplete={() => setShowIntro(false)} /> : null}
      {!showIntro ? <CustomCursor /> : null}
      <div className={`app-shell ${showIntro ? 'app-shell--hidden' : 'app-shell--ready'}`}>
        <ProjectList />
      </div>
      <Analytics />
    </>
  );
}

export default App;
