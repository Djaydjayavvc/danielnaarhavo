import { DanielTabs } from './DanielTabs';
import { Home } from './Home';

export default function App() {
  const isHost = new URLSearchParams(window.location.search).get('host') === '1';
  if (isHost) return <DanielTabs isHost />;
  return <Home />;
}
