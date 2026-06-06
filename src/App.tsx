import { Host } from './Host';
import { Play } from './Play';
import DanielFranse from './DanielFranse';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('french') === '1') return <DanielFranse />;
  const isHost = params.get('host') === '1';
  return isHost ? <Host /> : <Play />;
}
