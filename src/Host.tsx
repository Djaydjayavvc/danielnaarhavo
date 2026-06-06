import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { subjects } from './questions';
import { memes } from './memes';
import { bondingQuestions } from './bonding';
import { SummaryButton } from './SummaryButton';

// ─── RESULTATEN ─────────────────────────────────────────────────────

interface Attempt {
  id: number;
  subject: string;
  category: string;
  question: string;
  given_answer: string | null;
  correct_answer: string;
  is_correct: boolean;
  created_at: string;
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: 72, textAlign: 'center', background: '#f9fafb', borderRadius: 12, padding: '12px 8px', border: '1px solid #e5e7eb' }}>
      <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: 'inherit' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ResultatenTab() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = async () => {
    const { data } = await supabase
      .from('quiz_attempts')
      .select('*')
      .order('created_at', { ascending: false });
    setAttempts(data || []);
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const wipeAll = async () => {
    if (!window.confirm('Weet je zeker dat je alle history wil wissen?')) return;
    await supabase.from('quiz_attempts').delete().not('id', 'is', null);
    setAttempts([]);
  };

  const total = attempts.length;
  const correct = attempts.filter(a => a.is_correct).length;
  const wrong = total - correct;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const breakdown: Record<string, { total: number; correct: number }> = {};
  for (const a of attempts) {
    const key = `${a.subject} / ${a.category}`;
    if (!breakdown[key]) breakdown[key] = { total: 0, correct: 0 };
    breakdown[key].total++;
    if (a.is_correct) breakdown[key].correct++;
  }

  const wrongs = attempts.filter(a => !a.is_correct);

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit' });

  if (loading) return <div style={S.card}><p style={S.muted}>Laden…</p></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>
          🔄 {lastRefresh.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · auto-refresh elke 30s
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={load} style={S.btnSecondary}>🔄 Ververs</button>
          <button onClick={wipeAll} style={{ ...S.btnSecondary, borderColor: '#f87171', color: '#b91c1c' }}>🗑 Wis alles</button>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>📊 Samenvatting</h3>
        {total === 0 ? (
          <p style={S.muted}>Nog geen pogingen vastgelegd.</p>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              <StatBox label="Totaal" value={total} color="#6d28d9" />
              <StatBox label="Goed" value={correct} color="#059669" />
              <StatBox label="Fout" value={wrong} color="#dc2626" />
              <StatBox label="Score" value={`${pct}%`} color={pct >= 70 ? '#059669' : pct >= 50 ? '#d97706' : '#dc2626'} />
            </div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Per categorie</h4>
            {Object.entries(breakdown)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([key, stats]) => {
                const p = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f9fafb', borderRadius: 10, marginBottom: 6, border: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{key}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: p >= 70 ? '#059669' : p >= 50 ? '#d97706' : '#dc2626' }}>
                      {stats.correct}/{stats.total} ({p}%)
                    </span>
                  </div>
                );
              })}
          </>
        )}
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>❌ Foute antwoorden ({wrongs.length})</h3>
        {wrongs.length === 0 ? (
          <p style={S.muted}>Geen foute antwoorden! 🎉</p>
        ) : (
          <div>
            {wrongs.map(a => (
              <div key={a.id} style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: '12px 14px', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {a.subject} / {a.category}
                  </span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{fmtDate(a.created_at)} {fmtTime(a.created_at)}</span>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: '#1f2937' }}>{a.question}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, background: '#fee2e2', color: '#b91c1c', padding: '3px 10px', borderRadius: 6, fontWeight: 600 }}>
                    ✗ {a.given_answer ?? '(weet ik niet)'}
                  </span>
                  <span style={{ fontSize: 13, background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: 6, fontWeight: 600 }}>
                    ✓ {a.correct_answer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HOST ────────────────────────────────────────────────────────────

export function Host() {
  const HOST_NAME = 'Yahya';
  const [hostTab, setHostTab] = useState<'quiz' | 'resultaten'>('quiz');
  const [subjectId, setSubjectId] = useState(subjects[0].id);
  const [currentQ, setCurrentQ] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [memeIndex, setMemeIndex] = useState<number | null>(null);
  const [bondingIndex, setBondingIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [bondingAnswer, setBondingAnswer] = useState('');
  const [bondingSubmitted, setBondingSubmitted] = useState(false);

  useEffect(() => {
    supabase.from('dnh_quiz_state').select('*').eq('id', 1).single()
      .then(({ data }) => {
        if (data) {
          setSubjectId(data.subject_id);
          setCurrentQ(data.current_question);
          setRevealed(data.revealed);
          setMemeIndex(data.meme_index);
          setBondingIndex(data.bonding_index);
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
          if (p.new.bonding_index !== bondingIndex) {
            setBondingAnswer('');
            setBondingSubmitted(false);
          }
          setBondingIndex(p.new.bonding_index);
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const update = async (u: any) => {
    if ('subject_id' in u) setSubjectId(u.subject_id);
    if ('current_question' in u) setCurrentQ(u.current_question);
    if ('revealed' in u) setRevealed(u.revealed);
    if ('meme_index' in u) setMemeIndex(u.meme_index);
    if ('bonding_index' in u) {
      setBondingIndex(u.bonding_index);
      if (u.bonding_index !== bondingIndex) {
        setBondingAnswer('');
        setBondingSubmitted(false);
      }
    }
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
  const showBonding = () => update({ bonding_index: Math.floor(Math.random() * bondingQuestions.length) });
  const closeBonding = () => update({ bonding_index: null });

  const submitBonding = async () => {
    if (!bondingAnswer.trim() || bondingIndex === null) return;
    const { error } = await supabase.from('dnh_answers').insert({
      subject_id: 'bonding', question_index: bondingIndex, player_name: HOST_NAME, answer: bondingAnswer,
    });
    if (error) console.error('Insert failed:', error);
    setBondingSubmitted(true);
  };

  const subject = subjects.find(s => s.id === subjectId) || subjects[0];
  const q = subject.questions[currentQ];
  const total = subject.questions.length;
  const qAns = answers.filter(a => a.subject_id === subjectId && a.question_index === currentQ);
  const progress = total > 0 ? ((currentQ + (revealed ? 1 : 0)) / total) * 100 : 0;
  const bondingPrompt = bondingIndex !== null ? bondingQuestions[bondingIndex] : null;
  const bondingAns = bondingIndex !== null ? answers.filter(a => a.subject_id === 'bonding' && a.question_index === bondingIndex) : [];

  return (
    <div style={S.page}>
      <style>{kf}</style>
      <SummaryButton />
      {memeIndex !== null && memes[memeIndex] && (
        <MemeOverlay meme={memes[memeIndex]} onClose={closeMeme} isHost />
      )}

      <div style={S.container}>
        <div style={S.headerRow}>
          <div style={S.badge}>🎓 HOST MODE</div>
          <h1 style={S.h1}>Daniel naar HAVO 🚀</h1>
        </div>

        {/* Internal tab bar */}
        <div style={S.hostTabRow}>
          <button
            style={{ ...S.hostTab, ...(hostTab === 'quiz' ? S.hostTabActive : {}) }}
            onClick={() => setHostTab('quiz')}
          >
            🎯 Quiz
          </button>
          <button
            style={{ ...S.hostTab, ...(hostTab === 'resultaten' ? S.hostTabActive : {}) }}
            onClick={() => setHostTab('resultaten')}
          >
            📊 Resultaten
          </button>
        </div>

        {hostTab === 'resultaten' && <ResultatenTab />}

        {hostTab === 'quiz' && (
          bondingPrompt !== null ? (
            <>
              <div style={S.bondingBanner}>💬 VRAAGJE TUSSENDOOR</div>
              <div style={S.card}>
                <p style={S.qText}>{bondingPrompt}</p>
              </div>
              {!bondingSubmitted ? (
                <div style={S.card}>
                  <textarea value={bondingAnswer} onChange={e => setBondingAnswer(e.target.value)}
                    placeholder="Jouw antwoord…" rows={3} style={S.textarea} />
                  <button onClick={submitBonding} style={{ ...S.btnPrimary, marginTop: 12 }} disabled={!bondingAnswer.trim()}>
                    ✉️ Verstuur
                  </button>
                </div>
              ) : (
                <div style={S.submittedBox}>
                  <div style={S.submittedLabel}>✅ JOUW ANTWOORD</div>
                  <p style={S.submittedText}>{bondingAnswer}</p>
                </div>
              )}
              <div style={S.card}>
                <h3 style={S.cardTitle}>📬 Antwoorden ({bondingAns.length})</h3>
                {bondingAns.length === 0
                  ? <p style={S.muted}>⏳ Wachten…</p>
                  : <div>{bondingAns.map(a => (
                      <div key={a.id} style={S.answerItem}>
                        <span style={S.answerName}>{a.player_name}</span>
                        <span style={S.answerText}>{a.answer}</span>
                      </div>
                    ))}</div>}
              </div>
              <div style={S.actions}>
                <button onClick={closeBonding} style={S.btnPrimary}>📚 Verder met quiz</button>
                <button onClick={showBonding} style={S.btnSecondary}>🎲 Andere vraag</button>
              </div>
            </>
          ) : (
            <>
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
                      : <div>{qAns.map(a => {
                          const isMC = !!q.options;
                          const correct = revealed && isMC && (() => {
                            const p = (a.answer || '').trim().toUpperCase();
                            const c = (q.answer || '').trim().toUpperCase();
                            return p === c || p.startsWith(c + '.') || p.startsWith(c + ')') || p.startsWith(c + ' ');
                          })();
                          return (
                            <div key={a.id} style={{ ...S.answerItem, ...(correct ? { background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' } : {}) }}>
                              <span style={S.answerName}>{a.player_name} {correct ? '✅' : ''}</span>
                              <span style={S.answerText}>{a.answer}</span>
                            </div>
                          );
                        })}</div>}
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
                    <button onClick={showBonding} style={S.btnBonding}>💬 Vraagje</button>
                    <button onClick={showRandomMeme} style={S.btnMeme}>🎬 Meme</button>
                    <button onClick={reset} style={S.btnSecondary}>↺</button>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
                    Memes: {memes.map((_m, i) => (
                      <button key={i} onClick={() => showMeme(i)} style={S.memePill}>{i + 1}</button>
                    ))}
                  </div>
                </>
              )}
            </>
          )
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
            <iframe src={`https://www.youtube.com/embed/${meme.src}?autoplay=1&mute=0`}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        ) : (
          <img src={meme.src} alt="meme" style={{ width: '100%', display: 'block' }} />
        )}
        {meme.caption && (
          <div style={{ padding: '14px 18px', fontSize: 18, fontWeight: 700, textAlign: 'center', color: '#5b21b6' }}>{meme.caption}</div>
        )}
      </div>
      {isHost && (
        <button onClick={onClose} style={{ marginTop: 20, padding: '12px 24px', fontSize: 15, fontWeight: 700, border: 'none', borderRadius: 12, background: 'white', color: '#1f2937', cursor: 'pointer' }}>
          ✖ Sluit meme
        </button>
      )}
    </div>
  );
}

const kf = `
@keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
@keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
button:hover:not(:disabled) { transform: translateY(-2px); transition: transform 0.15s; }
button:active:not(:disabled) { transform: translateY(0px) scale(0.98); }
`;

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #ddd6fe 100%)', fontFamily: '"Comic Sans MS", "Segoe UI", system-ui, sans-serif', color: '#1f2937', padding: '24px 16px' },
  container: { maxWidth: 720, margin: '0 auto' },
  headerRow: { textAlign: 'center', marginBottom: 20 },
  badge: { display: 'inline-block', background: '#fbbf24', color: '#78350f', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 800, letterSpacing: 1, marginBottom: 8 },
  h1: { fontSize: 32, margin: 0, color: '#5b21b6', fontWeight: 900, textShadow: '2px 2px 0px #fde68a' },
  hostTabRow: { display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.5)', borderRadius: 14, padding: 4 },
  hostTab: { flex: 1, padding: '10px 16px', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 10, background: 'none', cursor: 'pointer', color: '#6b7280', fontFamily: 'inherit' },
  hostTabActive: { background: 'white', color: '#7c3aed', boxShadow: '0 2px 8px rgba(124,58,237,0.2)' },
  bondingBanner: { textAlign: 'center', background: 'linear-gradient(135deg, #f472b6, #c084fc)', color: 'white', padding: '10px 16px', borderRadius: 999, fontSize: 13, fontWeight: 800, letterSpacing: 1, marginBottom: 16, boxShadow: '0 6px 16px rgba(192,132,252,0.4)' },
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
  textarea: { width: '100%', padding: 14, fontSize: 16, borderRadius: 14, border: '2px solid #c4b5fd', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' },
  submittedBox: { background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', border: '2px solid #a78bfa', borderRadius: 16, padding: 16, marginBottom: 16 },
  submittedLabel: { fontSize: 12, fontWeight: 800, color: '#5b21b6', letterSpacing: 1 },
  submittedText: { margin: '6px 0 0', fontSize: 15, color: '#3b0764' },
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
  actions: { display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  btnPrimary: { padding: '14px 22px', fontSize: 16, border: 'none', borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', cursor: 'pointer', fontWeight: 800, flex: 1, fontFamily: 'inherit', boxShadow: '0 6px 16px rgba(124,58,237,0.35)', minWidth: 140 },
  btnSecondary: { padding: '10px 16px', fontSize: 14, border: '2px solid #c4b5fd', borderRadius: 12, background: 'white', color: '#6d28d9', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' },
  btnMeme: { padding: '14px 18px', fontSize: 15, border: 'none', borderRadius: 14, background: 'linear-gradient(135deg, #f59e0b, #ec4899)', color: 'white', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' },
  btnBonding: { padding: '14px 18px', fontSize: 15, border: 'none', borderRadius: 14, background: 'linear-gradient(135deg, #c084fc, #f472b6)', color: 'white', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' },
  memePill: { padding: '4px 10px', margin: '0 4px', fontSize: 12, border: '1px solid #d1d5db', borderRadius: 999, background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 },
};
