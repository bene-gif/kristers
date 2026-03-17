import { Analytics } from '@vercel/analytics/react';
import CustomCursor from './components/CustomCursor';
import ProjectList from './components/ProjectList';
import './components/ProjectList.css';

function App() {
  return (
    <>
      <CustomCursor />
      <ProjectList />
      <Analytics />
    </>
  );
}

export default App;
