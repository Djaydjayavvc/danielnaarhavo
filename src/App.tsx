import { useState } from 'react';
import { Host } from './Host';
import { Play } from './Play';
import DanielFranse from './DanielFranse';
import DanielWiskunde from './DanielWiskunde';
import DanielBiologie2 from './DanielBiologie2';

const tabBar = `
  .tab-bar {
    display: flex;
    background: #1a1a2e;
    border-bottom: 2px solid #2a2a4a;
    padding: 0 16px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .tab-btn {
    padding: 14px 24px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    border: none;
    background: none;
    cursor: pointer;
    color: #94a3b8;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
    transition: color 0.15s, border-color 0.15s;
    font-family: system-ui, sans-serif;
  }
  .tab-btn:hover { color: #e2e8f0; }
  .tab-btn.active { color: #60a5fa; border-bottom-color: #60a5fa; }
`;

export default function App() {
  const isHost = new URLSearchParams(window.location.search).get('host') === '1';
  const [tab, setTab] = useState<'bio' | 'french' | 'wiskunde' | 'bio2'>('bio');

  return (
    <>
      <style>{tabBar}</style>
      <div className="tab-bar">
        <button className={`tab-btn${tab === 'bio' ? ' active' : ''}`} onClick={() => setTab('bio')}>
          📚 Bio
        </button>
        <button className={`tab-btn${tab === 'french' ? ' active' : ''}`} onClick={() => setTab('french')}>
          🇫🇷 Frans
        </button>
        <button className={`tab-btn${tab === 'wiskunde' ? ' active' : ''}`} onClick={() => setTab('wiskunde')}>
          📐 Wiskunde
        </button>
        <button className={`tab-btn${tab === 'bio2' ? ' active' : ''}`} onClick={() => setTab('bio2')}>
          🧬 Bio H4
        </button>
      </div>
      {tab === 'bio' && (isHost ? <Host /> : <Play />)}
      {tab === 'french' && <DanielFranse />}
      {tab === 'wiskunde' && <DanielWiskunde isHost={isHost} />}
      {tab === 'bio2' && <DanielBiologie2 isHost={isHost} />}
    </>
  );
}
