import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { subjects } from './questions';
import { memes } from './memes';

export function Host() {
  const [subjectId, setSubjectId] = useState(subjects[0].id);
  const [currentQ, setCurrentQ] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
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
    supabase.from('dnh_answers').select('*').order('created_at')
      .then(({ data }) => setAnswers(data || []));

    const ch = supabase.channel('dnh-host')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dnh_answers' },
        (p: any) => setAnswers(prev => [...prev, p.new]))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'dnh_quiz_state' },
        (p: any) => {
          setSubjectId(p.new.subject_id);
          setCurrentQ(p.new.current_question);
          setRevealed(p.new.revealed);
          setMemeIndex(p.new.meme_index);
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const update = async (u: any) => {
    if ('subject_id' in u) setSubjectId(u.subject_id);
    if ('current_question' in u) setCurrentQ(u.current_question);
    if ('revealed' in u) setRevealed(u.revealed);
    if ('meme_index' in u) setMemeIndex(u.meme_index);
    const { error } = await supabase.from('dnh_quiz_state').update(u).eq('id', 1);
    if (error) console.error('Update failed:', error);
  };

  const reveal = () => update({ revealed: true });
  const next = () => update({ current_question: currentQ + 1, revealed: false });
  const reset = () => update({ current_question: 0, revealed: false });
  const switchSubject = (id: string) => update({ subject_id: id, current_question: 0, revealed: false });
  const showRandomMeme = () => update({ meme_index: Math.floor(Math.random() * memes.length) });
  const showMeme = (i: number) => update({ meme_index: i });
  const closeMeme = () => update({ meme_index: null });

  const subject = subjects.find(s => s.id === subjectId) || subjects[0];
  const q = subject.questions[currentQ];
  const total = subject.questions.length;
  const qAns = answers.filter(a => a.subject_id === subjectId && a.question_index === currentQ);
  const progress = total > 0 ? ((currentQ + (revealed ? 1 : 0)) / total) * 100 : 0;

  return (
    <div style={S.page}>
      <style>{kf}</style>
      {memeIndex !== null && memes[memeIndex] && (
        <MemeOverlay meme={memes[memeIndex]} onClose={closeMeme} isHost />
      )}
      <div style={S.container}>
        <div style={S.headerRow}>
          <div style={S.badge}>🎓 HOST MODE</div>
          <h1 style={S.h1}>Daniel naar HAVO 🚀</h1>
        </div>

        <div style={S.chipRow}>
          {subjects.map(s => (
            <button key={s.id} onClick={() => switchSubject(s.id)}
              style={{ ...S.chip, ...(s.id === subjectId ? S.chipActive : {}) }}>
              {s.title.split('—')[0].trim()}
            </button>
          ))}
        </div>

        <div style={S.subjectTitle}>{subject.title}</div>

        <div style={S.progressBar}>
          <div style={{ ...S.progressFill, width: `${progress}%` }} />
        </div>
        <div style={S.progressLabel}>
          {!q ? '🎉 Klaar!' : `Vraag ${currentQ + 1} van ${total}`}
        </div>

        {!q ? (
          <div style={S.card}>
            <h2 style={{ marginTop: 0, fontSize: 28 }}>🎉 Sectie klaar!</h2>
            <p style={S.muted}>Goed bezig, kies een volgende sectie of begin opnieuw.</p>
            <button onClick={reset} style={S.btnPrimary}>↺ Opnieuw beginnen</button>
          </div>
        ) : (
          <>
            <div style={S.card}>
              <div style={S.qNum}>✏️ VRAAG {currentQ + 1}</div>
              <p style={S.qText}>{q.prompt}</p>
              {q.options && (
                <div style={S.optionsBox}>
                  {q.options.map((o, i) => <div key={i} style={S.option}>{o}</div>)}
                </div>
              )}
            </div>

            <div style={S.card}>
              <h3 style={S.cardTitle}>📬 Antwoorden ({qAns.length})</h3>
              {qAns.length === 0
                ? <p style={S.muted}>⏳ Wachten op antwoorden…</p>
                : <div>{qAns.map(a => (
                    <div key={a.id} style={S.answerItem}>
                      <span style={S.answerName}>{a.player_name}</span>
                      <span style={S.answerText}>{a.answer}</span>
                    </div>
                  ))}</div>}
            </div>

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

            <div style={S.actions}>
              {!revealed
                ? <button onClick={reveal} style={S.btnPrimary}>🔍 Toon antwoord</button>
                : <button onClick={next} style={S.btnPrimary}>➡️ Volgende vraag</button>}
              <button onClick={showRandomMeme} style={S.btnMeme}>🎬 Meme</button>
              <button onClick={reset} style={S.btnSecondary}>↺ Reset</button>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
              Specifieke meme: {memes.map((_m, i) => (
                <button key={i} onClick={() => showMeme(i)} style={S.memePill}>{i + 1}</button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MemeOverlay({ meme, onClose, isHost }: { meme: any; onClose: () => void; isHost?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ maxWidth: 800, width: '100%', background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        {meme.type === 'youtube' ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/${meme.src}?autoplay=1&mute=0`}
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
      {isHost && (
        <button onClick={onClose} style={{ marginTop: 20, padding: '12px 24px', fontSize: 15, fontWeight: 700, border: 'none', borderRadius: 12, background: 'white', color: '#1f2937', cursor: 'pointer' }}>
          ✖ Sluit meme
        </button>
      )}
      {!isHost && (
        <div style={{ marginTop: 16, color: 'white', fontSize: 14, opacity: 0.8 }}>
          🎬 Meme break! Host sluit straks…
        </div>
      )}
    </div>
  );
}

const kf = `
@keyframes pop { 0% { transform: scale(0.95); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
@keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
button:hover { transform: translateY(-2px); transition: transform 0.15s; }
button:active { transform: translateY(0px) scale(0.98); }
`;

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #ddd6fe 100%)', fontFamily: '"Comic Sans MS", "Segoe UI", system-ui, sans-serif', color: '#1f2937', padding: '24px 16px' },
  container: { maxWidth: 720, margin: '0 auto' },
  headerRow: { textAlign: 'center', marginBottom: 20 },
  badge: { display: 'inline-block', background: '#fbbf24', color: '#78350f', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 800, letterSpacing: 1, marginBottom: 8 },
  h1: { fontSize: 32, margin: 0, color: '#5b21b6', fontWeight: 900, textShadow: '2px 2px 0px #fde68a' },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 12 },
  chip: { padding: '6px 14px', borderRadius: 999, border: '2px solid #c4b5fd', background: 'white', color: '#6d28d9', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' },
  chipActive: { background: '#7c3aed', color: 'white', borderColor: '#7c3aed', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' },
  subjectTitle: { textAlign: 'center', fontSize: 18, fontWeight: 700, color: '#5b21b6', marginBottom: 14 },
  progressBar: { height: 14, background: 'rgba(255,255,255,0.6)', borderRadius: 999, overflow: 'hidden', marginBottom: 6, border: '2px solid #c4b5fd' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #ec4899, #f59e0b, #10b981)', backgroundSize: '200px 100%', animation: 'shimmer 2s linear infinite', transition: 'width 0.5s' },
  progressLabel: { fontSize: 14, color: '#6d28d9', marginBottom: 20, textAlign: 'center', fontWeight: 600 },
  card: { background: 'white', borderRadius: 20, padding: 22, marginBottom: 16, boxShadow: '0 8px 24px rgba(124,58,237,0.12)', animation: 'pop 0.3s ease-out' },
  cardTitle: { margin: '0 0 12px', fontSize: 17, color: '#5b21b6', fontWeight: 700 },
  qNum: { fontSize: 12, fontWeight: 800, color: '#ec4899', letterSpacing: 1, marginBottom: 8 },
  qText: { fontSize: 20, margin: 0, lineHeight: 1.5, color: '#1f2937', fontWeight: 500 },
  optionsBox: { marginTop: 14 },
  option: { padding: '12px 14px', background: '#faf5ff', borderRadius: 12, marginBottom: 8, fontSize: 16, color: '#374151', border: '1px solid #e9d5ff' },
  answerItem: { display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 14px', background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: 12, marginBottom: 8 },
  answerName: { fontWeight: 800, color: '#92400e', fontSize: 14 },
  answerText: { fontSize: 15, color: '#451a03' },
  muted: { color: '#9ca3af', margin: 0 },
  reveal: { background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', border: '3px solid #34d399', borderRadius: 20, padding: 22, marginBottom: 16, animation: 'pop 0.4s ease-out' },
  revealHeader: { fontSize: 12, fontWeight: 800, color: '#065f46', letterSpacing: 1 },
  revealAnswer: { fontSize: 18, margin: '8px 0 16px', fontWeight: 700, color: '#064e3b' },
  tipBox: { background: '#fff7ed', border: '2px dashed #fb923c', borderRadius: 14, padding: 14 },
  tipHeader: { fontSize: 12, fontWeight: 800, color: '#c2410c', letterSpacing: 1 },
  tipText: { fontSize: 15, margin: '6px 0 0', color: '#7c2d12', lineHeight: 1.6 },
  actions: { display: 'flex', gap: 10, marginTop: 8 },
  btnPrimary: { padding: '14px 22px', fontSize: 16, border: 'none', borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', cursor: 'pointer', fontWeight: 800, flex: 1, fontFamily: 'inherit', boxShadow: '0 6px 16px rgba(124,58,237,0.35)' },
  btnSecondary: { padding: '14px 18px', fontSize: 15, border: '2px solid #c4b5fd', borderRadius: 14, background: 'white', color: '#6d28d9', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' },
  btnMeme: { padding: '14px 18px', fontSize: 15, border: 'none', borderRadius: 14, background: 'linear-gradient(135deg, #f59e0b, #ec4899)', color: 'white', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' },
  memePill: { padding: '4px 10px', margin: '0 4px', fontSize: 12, border: '1px solid #d1d5db', borderRadius: 999, background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 },
};
