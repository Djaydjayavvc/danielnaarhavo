import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { subjects } from './questions';
import { memes } from './memes';

export function Play() {
  const [name, setName] = useState(localStorage.getItem('dnh_name') || '');
  const [nameSet, setNameSet] = useState(!!localStorage.getItem('dnh_name'));
  const [subjectId, setSubjectId] = useState(subjects[0].id);
  const [currentQ, setCurrentQ] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [memeIndex, setMemeIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase.from('dnh_quiz_state').select('*').eq('id', 1).single()
      .then(({ data }) => {
        if (data) {
          setSubjectId(data.subject_id);
          setCurrentQ(data.current_question);
          setRevealed(data.revealed);
          setMemeIndex(data.meme_index);
        }
      });

    const ch = supabase.channel('dnh-play')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'dnh_quiz_state' },
        (p: any) => {
          const changed = p.new.subject_id !== subjectId || p.new.current_question !== currentQ;
          if (changed) { setSubmitted(false); setAnswer(''); }
          setSubjectId(p.new.subject_id);
          setCurrentQ(p.new.current_question);
          setRevealed(p.new.revealed);
          setMemeIndex(p.new.meme_index);
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [subjectId, currentQ]);

  const saveName = () => { localStorage.setItem('dnh_name', name); setNameSet(true); };
  const submit = async () => {
    if (!answer.trim()) return;
    const { error } = await supabase.from('dnh_answers').insert({
      subject_id: subjectId, question_index: currentQ, player_name: name, answer,
    });
    if (error) console.error('Insert failed:', error);
    setSubmitted(true);
  };

  if (!nameSet) return (
    <>
      {memeIndex !== null && memes[memeIndex] && <MemeOverlay meme={memes[memeIndex]} />}
      <div style={S.page}>
        <style>{kf}</style>
        <div style={{ ...S.container, maxWidth: 440, marginTop: 80 }}>
          <div style={S.welcomeCard}>
            <div style={S.welcomeEmoji}>📚✨</div>
            <h1 style={S.h1}>Daniel naar HAVO!</h1>
            <p style={S.welcomeSub}>Wie ben je, kampioen?</p>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Typ je naam…"
              style={S.input} onKeyDown={(e) => e.key === 'Enter' && name.trim() && saveName()} />
            <button onClick={saveName} disabled={!name.trim()} style={S.btnPrimary}>Let's go! 🚀</button>
          </div>
        </div>
      </div>
    </>
  );

  const subject = subjects.find(s => s.id === subjectId) || subjects[0];
  const q = subject.questions[currentQ];
  const total = subject.questions.length;
  const progress = total > 0 ? ((currentQ + (revealed ? 1 : 0)) / total) * 100 : 0;

  if (!q) return (
    <>
      {memeIndex !== null && memes[memeIndex] && <MemeOverlay meme={memes[memeIndex]} />}
      <div style={S.page}>
        <style>{kf}</style>
        <div style={S.container}>
          <div style={S.card}>
            <h2 style={{ fontSize: 28, margin: 0 }}>🎉 Sectie klaar!</h2>
            <p style={S.muted}>Wacht op de volgende sectie…</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {memeIndex !== null && memes[memeIndex] && <MemeOverlay meme={memes[memeIndex]} />}
      <div style={S.page}>
        <style>{kf}</style>
        <div style={S.container}>
          <div style={S.greeting}>Hoi <b>{name}</b> 👋</div>
          <h1 style={S.h1}>{subject.title}</h1>

          <div style={S.progressBar}>
            <div style={{ ...S.progressFill, width: `${progress}%` }} />
          </div>
          <div style={S.progressLabel}>Vraag {currentQ + 1} van {total} 💪</div>

          <div style={S.card}>
            <div style={S.qNum}>✏️ VRAAG {currentQ + 1}</div>
            <p style={S.qText}>{q.prompt}</p>
            {q.options && (
              <div style={S.optionsBox}>
                {q.options.map((o, i) => <div key={i} style={S.option}>{o}</div>)}
              </div>
            )}
          </div>

          {!submitted ? (
            <div style={S.card}>
              <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                placeholder="Typ je antwoord hier…" rows={3} style={S.textarea} />
              <button onClick={submit} style={{ ...S.btnPrimary, marginTop: 12 }} disabled={!answer.trim()}>
                ✉️ Verstuur antwoord
              </button>
            </div>
          ) : (
            <div style={S.submittedBox}>
              <div style={S.submittedLabel}>✅ VERSTUURD — goed bezig!</div>
              <p style={S.submittedText}>{answer}</p>
            </div>
          )}

          {revealed && (
            <div style={S.reveal}>
              <div style={S.revealHeader}>✅ JUISTE ANTWOORD</div>
              <p style={S.revealAnswer}>{q.answer}</p>
              <div style={S.tipBox}>
                <div style={S.tipHeader}>💡 Wist je dat?</div>
                <p style={S.tipText}>{q.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MemeOverlay({ meme }: { meme: any }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ maxWidth: 800, width: '100%', background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        {meme.type === 'youtube' ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/${meme.src}?autoplay=1&mute=1`}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        ) : (
          <img src={meme.src} alt="meme" style={{ width: '100%', display: 'block' }} />
        )}
        {meme.caption && (
          <div style={{ padding: '14px 18px', fontSize: 18, fontWeight: 700, textAlign: 'center', color: '#5b21b6' }}>
            {meme.caption}
          </div>
        )}
      </div>
      <div style={{ marginTop: 16, color: 'white', fontSize: 14, opacity: 0.8 }}>
        🎬 Meme break! Host sluit straks…
      </div>
    </div>
  );
}

const kf = `
@keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
@keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
@keyframes wiggle { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-3deg); } 75% { transform: rotate(3deg); } }
button:hover:not(:disabled) { transform: translateY(-2px); transition: transform 0.15s; }
button:active:not(:disabled) { transform: translateY(0px) scale(0.98); }
`;

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #ddd6fe 100%)', fontFamily: '"Comic Sans MS", "Segoe UI", system-ui, sans-serif', color: '#1f2937', padding: '24px 16px' },
  container: { maxWidth: 600, margin: '0 auto' },
  welcomeCard: { background: 'white', borderRadius: 24, padding: 32, textAlign: 'center', boxShadow: '0 20px 50px rgba(124,58,237,0.18)' },
  welcomeEmoji: { fontSize: 56, marginBottom: 8, animation: 'wiggle 2s ease-in-out infinite' },
  welcomeSub: { fontSize: 16, color: '#6b7280', margin: '4px 0 16px' },
  greeting: { fontSize: 15, color: '#5b21b6', marginBottom: 4, fontWeight: 600 },
  h1: { fontSize: 26, margin: '4px 0 16px', color: '#5b21b6', fontWeight: 900, textShadow: '2px 2px 0px #fde68a' },
  progressBar: { height: 14, background: 'rgba(255,255,255,0.6)', borderRadius: 999, overflow: 'hidden', marginBottom: 6, border: '2px solid #c4b5fd' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #ec4899, #f59e0b, #10b981)', backgroundSize: '200px 100%', animation: 'shimmer 2s linear infinite', transition: 'width 0.5s' },
  progressLabel: { fontSize: 14, color: '#6d28d9', marginBottom: 20, textAlign: 'center', fontWeight: 600 },
  card: { background: 'white', borderRadius: 20, padding: 22, marginBottom: 16, boxShadow: '0 8px 24px rgba(124,58,237,0.12)', animation: 'pop 0.3s ease-out' },
  qNum: { fontSize: 12, fontWeight: 800, color: '#ec4899', letterSpacing: 1, marginBottom: 8 },
  qText: { fontSize: 20, margin: 0, lineHeight: 1.5, color: '#1f2937', fontWeight: 500 },
  optionsBox: { marginTop: 14 },
  option: { padding: '12px 14px', background: '#faf5ff', borderRadius: 12, marginBottom: 8, fontSize: 16, color: '#374151', border: '1px solid #e9d5ff' },
  input: { width: '100%', padding: 14, fontSize: 17, marginTop: 8, marginBottom: 14, borderRadius: 14, border: '2px solid #c4b5fd', boxSizing: 'border-box', fontFamily: 'inherit', textAlign: 'center' },
  textarea: { width: '100%', padding: 14, fontSize: 16, borderRadius: 14, border: '2px solid #c4b5fd', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' },
  submittedBox: { background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', border: '2px solid #a78bfa', borderRadius: 16, padding: 16, marginBottom: 16, animation: 'pop 0.3s ease-out' },
  submittedLabel: { fontSize: 12, fontWeight: 800, color: '#5b21b6', letterSpacing: 1 },
  submittedText: { margin: '6px 0 0', fontSize: 15, color: '#3b0764' },
  reveal: { background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', border: '3px solid #34d399', borderRadius: 20, padding: 22, marginBottom: 16, animation: 'pop 0.4s ease-out' },
  revealHeader: { fontSize: 12, fontWeight: 800, color: '#065f46', letterSpacing: 1 },
  revealAnswer: { fontSize: 18, margin: '8px 0 16px', fontWeight: 700, color: '#064e3b' },
  tipBox: { background: '#fff7ed', border: '2px dashed #fb923c', borderRadius: 14, padding: 14 },
  tipHeader: { fontSize: 12, fontWeight: 800, color: '#c2410c', letterSpacing: 1 },
  tipText: { fontSize: 15, margin: '6px 0 0', color: '#7c2d12', lineHeight: 1.6 },
  muted: { color: '#9ca3af' },
  btnPrimary: { padding: '14px 22px', fontSize: 16, border: 'none', borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', cursor: 'pointer', fontWeight: 800, width: '100%', fontFamily: 'inherit', boxShadow: '0 6px 16px rgba(124,58,237,0.35)' },
};
