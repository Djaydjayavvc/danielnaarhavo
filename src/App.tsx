import { Host } from './Host';
import { Play } from './Play';

export default function App() {
  const isHost = new URLSearchParams(window.location.search).get('host') === '1';
  return isHost ? <Host /> : <Play />;
}
