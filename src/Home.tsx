import { useState } from 'react';
import { DanielTabs } from './DanielTabs';
import { PiscoPlay } from './PiscoPlay';

type Profile = 'daniel' | 'pisco';
const PROFILE_KEY = 'dnh_profile';

function loadProfile(): Profile | null {
  try {
    const v = localStorage.getItem(PROFILE_KEY);
    return v === 'daniel' || v === 'pisco' ? v : null;
  } catch {
    return null;
  }
}

export function Home() {
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());

  const choose = (p: Profile) => {
    try {
      localStorage.setItem(PROFILE_KEY, p);
    } catch {
      // ignore — profile just won't persist across reloads
    }
    setProfile(p);
  };

  const switchProfile = () => {
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch {
      // ignore
    }
    setProfile(null);
  };

  if (profile === 'daniel') return <DanielTabs isHost={false} onSwitchProfile={switchProfile} />;
  if (profile === 'pisco') return <PiscoPlay onSwitchProfile={switchProfile} />;

  return (
    <div style={S.page}>
      <style>{kf}</style>
      <div style={S.container}>
        <div style={S.emoji}>👋</div>
        <h1 style={S.h1}>Wie ben jij?</h1>
        <p style={S.sub}>Kies je profiel om te starten</p>

        <button
          style={{ ...S.card, background: 'white', boxShadow: '0 12px 30px rgba(0,0,0,0.25)' }}
          onClick={() => choose('daniel')}
        >
          <div style={S.cardEmoji}>👦</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1f2937' }}>Daniel</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Bio · Frans · Wiskunde · Bio H4</div>
        </button>

        <button
          style={{ ...S.card, background: 'linear-gradient(135deg, #0891b2, #0e7490)', boxShadow: '0 12px 30px rgba(8,145,178,0.4)' }}
          onClick={() => choose('pisco')}
        >
          <div style={S.cardEmoji}>💊</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>Pisco</div>
          <div style={{ fontSize: 13, color: '#cffafe', marginTop: 4 }}>Medical Terminology (EN → ES)</div>
        </button>
      </div>
    </div>
  );
}

const kf = `
  @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  button:hover { transform: translateY(-2px); transition: transform 0.15s; }
  button:active { transform: translateY(0px) scale(0.98); }
`;

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: '"Comic Sans MS", "Segoe UI", system-ui, sans-serif' },
  container: { maxWidth: 420, width: '100%', textAlign: 'center' },
  emoji: { fontSize: 48, marginBottom: 8 },
  h1: { fontSize: 30, color: 'white', fontWeight: 900, margin: '0 0 4px' },
  sub: { color: '#c7d2fe', fontSize: 15, marginBottom: 28 },
  card: { display: 'block', width: '100%', border: 'none', borderRadius: 20, padding: '24px 20px', marginBottom: 16, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', animation: 'pop 0.3s ease-out' },
  cardEmoji: { fontSize: 40, marginBottom: 8 },
};
