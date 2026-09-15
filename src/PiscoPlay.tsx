import { useEffect, useRef, useState } from 'react';
import { subjects, type Question } from './questions';

type PiscoQuestion = Question & { specialty: string };
type Mode = 'mc' | 'open' | 'mistakes';
type Screen = 'home' | 'quiz' | 'result';

const MISTAKES_KEY = 'pisco_mistakes_v1';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[.,!?¿¡]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function answerAlternatives(answer: string): string[] {
  const alts = new Set<string>();
  alts.add(normalize(answer));
  answer.split('/').forEach((part) => alts.add(normalize(part)));
  const noParens = answer.replace(/\([^)]*\)/g, '').trim();
  if (noParens) alts.add(normalize(noParens));
  const parenMatch = answer.match(/\(([^)]+)\)/);
  if (parenMatch) alts.add(normalize(parenMatch[1]));
  alts.delete('');
  return [...alts];
}

function isOpenAnswerCorrect(input: string, answer: string): boolean {
  const userNorm = normalize(input);
  if (!userNorm) return false;
  return answerAlternatives(answer).includes(userNorm);
}

function loadMistakes(): PiscoQuestion[] {
  try {
    const raw = localStorage.getItem(MISTAKES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMistakes(list: PiscoQuestion[]) {
  try {
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(list));
  } catch {
    // private mode / storage full — practice still works, just won't persist
  }
}

function getAllPiscoQuestions(): PiscoQuestion[] {
  return subjects
    .filter((s) => s.id.startsWith('pisco-'))
    .flatMap((s) => {
      const specialty = s.title.replace(/— Pisco$/, '').trim();
      return s.questions.map((q) => ({ ...q, specialty }));
    });
}

export function PiscoPlay({ onSwitchProfile }: { onSwitchProfile: () => void }) {
  const [allQuestions] = useState<PiscoQuestion[]>(() => getAllPiscoQuestions());
  const [mistakes, setMistakes] = useState<PiscoQuestion[]>(() => loadMistakes());
  const [screen, setScreen] = useState<Screen>('home');
  const [mode, setMode] = useState<Mode>('mc');
  const [pool, setPool] = useState<PiscoQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveMistakes(mistakes);
  }, [mistakes]);

  useEffect(() => {
    if (screen === 'quiz' && !feedback) inputRef.current?.focus();
  }, [qi, screen, feedback]);

  const mcCount = allQuestions.filter((q) => !!q.options).length;
  const openCount = allQuestions.filter((q) => !q.options).length;

  const start = (m: Mode) => {
    let p: PiscoQuestion[];
    if (m === 'mc') p = shuffle(allQuestions.filter((q) => !!q.options));
    else if (m === 'open') p = shuffle(allQuestions.filter((q) => !q.options));
    else p = shuffle(mistakes);
    setMode(m);
    setPool(p);
    setQi(0);
    setSelected(null);
    setInput('');
    setFeedback(null);
    setScore({ correct: 0, wrong: 0 });
    setScreen('quiz');
  };

  const cur = pool[qi];

  const addMistake = (q: PiscoQuestion) => {
    setMistakes((prev) => (prev.some((m) => m.prompt === q.prompt) ? prev : [...prev, q]));
  };

  const removeMistake = (q: PiscoQuestion) => {
    setMistakes((prev) => (prev.some((m) => m.prompt === q.prompt) ? prev.filter((m) => m.prompt !== q.prompt) : prev));
  };

  const registerResult = (ok: boolean) => {
    setFeedback(ok ? 'correct' : 'wrong');
    setScore((s) => (ok ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 }));
    if (ok && mode === 'mistakes') removeMistake(cur);
    if (!ok) addMistake(cur);
  };

  const handleMC = (optionText: string) => {
    if (selected) return;
    setSelected(optionText);
    const letter = optionText.split('.')[0].trim();
    registerResult(letter === cur.answer);
  };

  const checkOpen = () => {
    if (!input.trim() || feedback) return;
    registerResult(isOpenAnswerCorrect(input, cur.answer));
  };

  const next = () => {
    if (qi + 1 >= pool.length) {
      setScreen('result');
      return;
    }
    setQi(qi + 1);
    setSelected(null);
    setInput('');
    setFeedback(null);
  };

  if (screen === 'home') {
    return (
      <div style={S.page}>
        <style>{kf}</style>
        <div style={S.container}>
          <div style={S.header}>
            <div style={S.badge}>💊 PISCO MODE</div>
            <h1 style={S.h1}>Medical Terminology</h1>
            <p style={S.sub}>Handbook for Interpreters — Engels → Spaans</p>
          </div>

          <button style={{ ...S.modeBtn, background: 'linear-gradient(135deg, #0891b2, #0e7490)' }} onClick={() => start('mc')}>
            <div style={S.modeTitle}>🔤 Multiple Choice</div>
            <div style={S.modeSub}>{mcCount} vragen, gemixt uit alle specialismen</div>
          </button>

          <button style={{ ...S.modeBtn, background: 'linear-gradient(135deg, #0d9488, #0f766e)' }} onClick={() => start('open')}>
            <div style={S.modeTitle}>✍️ Open Vragen</div>
            <div style={S.modeSub}>{openCount} vragen, typ de vertaling</div>
          </button>

          <button
            style={{
              ...S.modeBtn,
              background: mistakes.length > 0 ? 'linear-gradient(135deg, #d97706, #b45309)' : 'rgba(255,255,255,0.06)',
              cursor: mistakes.length > 0 ? 'pointer' : 'default',
            }}
            onClick={() => mistakes.length > 0 && start('mistakes')}
            disabled={mistakes.length === 0}
          >
            <div style={S.modeTitle}>🔁 Foutenbox</div>
            <div style={S.modeSub}>
              {mistakes.length === 0 ? 'Nog geen fouten opgeslagen' : `${mistakes.length} vraag${mistakes.length === 1 ? '' : 'en'} om te oefenen`}
            </div>
          </button>

          <button style={S.switchBtn} onClick={onSwitchProfile}>↺ Wissel profiel</button>
        </div>
      </div>
    );
  }

  if (screen === 'result') {
    const total = score.correct + score.wrong;
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    const modeLabel = mode === 'mc' ? 'Multiple Choice' : mode === 'open' ? 'Open Vragen' : 'Foutenbox';
    return (
      <div style={S.page}>
        <style>{kf}</style>
        <div style={S.container}>
          <div style={S.resultCard}>
            <div style={S.resultEmoji}>{pct >= 80 ? '🎉' : pct >= 55 ? '💪' : '📚'}</div>
            <h2 style={S.resultH2}>{modeLabel} klaar!</h2>
            <div style={S.resultScore}>{pct}%</div>
            <div style={S.resultDetail}>{score.correct} / {total} goed</div>
            {mistakes.length > 0 && (
              <div style={S.resultMistakeNote}>📌 {mistakes.length} vraag{mistakes.length === 1 ? '' : 'en'} staan in je foutenbox</div>
            )}
            <button style={S.nextBtn} onClick={() => setScreen('home')}>← Terug naar Pisco menu</button>
          </div>
        </div>
      </div>
    );
  }

  if (!cur) {
    return (
      <div style={S.page}>
        <style>{kf}</style>
        <div style={S.container}>
          <div style={S.resultCard}>
            <p style={{ color: '#334155' }}>Geen vragen in deze set.</p>
            <button style={S.nextBtn} onClick={() => setScreen('home')}>← Terug</button>
          </div>
        </div>
      </div>
    );
  }

  const isMC = !!cur.options;
  const progress = (qi / pool.length) * 100;

  return (
    <div style={S.page}>
      <style>{kf}</style>
      <div style={S.container}>
        <button style={S.backBtn} onClick={() => setScreen('home')}>← Pisco menu</button>
        <div style={S.progressBar}><div style={{ ...S.progressFill, width: `${progress}%` }} /></div>
        <div style={S.scoreRow}>
          <span>Vraag {qi + 1} / {pool.length}</span>
          <span><span style={S.correctText}>✓ {score.correct}</span> · <span style={S.wrongText}>✗ {score.wrong}</span></span>
        </div>

        <div style={S.card}>
          <div style={S.specialtyTag}>{cur.specialty}</div>
          <p style={S.qText}>{cur.prompt}</p>
        </div>

        {isMC ? (
          <div style={S.choices}>
            {cur.options!.map((opt) => {
              const letter = opt.split('.')[0].trim();
              let style = { ...S.choiceBtn };
              if (selected) {
                if (letter === cur.answer) style = { ...style, ...S.choiceCorrect };
                else if (opt === selected) style = { ...style, ...S.choiceWrong };
                else style = { ...style, opacity: 0.5 };
              }
              return (
                <button key={opt} style={style} onClick={() => handleMC(opt)} disabled={!!selected}>
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          !feedback && (
            <div style={S.inputRow}>
              <input
                ref={inputRef}
                style={S.textInput}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && input.trim() && checkOpen()}
                placeholder="Typ de Spaanse vertaling..."
              />
              <button style={S.submitBtn} disabled={!input.trim()} onClick={checkOpen}>Check</button>
            </div>
          )
        )}

        {feedback && (
          <>
            <div style={{ ...S.feedback, ...(feedback === 'correct' ? S.feedbackCorrect : S.feedbackWrong) }}>
              {feedback === 'correct' ? '✓ Goed!' : (
                <>
                  ✗ Fout!
                  <div style={S.answerLine}>
                    Antwoord: {isMC ? cur.options!.find((o) => o.split('.')[0].trim() === cur.answer) : cur.answer}
                  </div>
                </>
              )}
            </div>
            <div style={S.explanation}>{cur.explanation}</div>
            <button style={S.nextBtn} onClick={next}>Volgende →</button>
          </>
        )}
      </div>
    </div>
  );
}

const kf = `
@keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
button:hover:not(:disabled) { transform: translateY(-2px); transition: transform 0.15s; }
button:active:not(:disabled) { transform: translateY(0px) scale(0.98); }
`;

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #0c1e2e 0%, #0f2942 50%, #0a3548 100%)', fontFamily: '"Comic Sans MS", "Segoe UI", system-ui, sans-serif', padding: '24px 16px' },
  container: { maxWidth: 560, margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: 24 },
  badge: { display: 'inline-block', background: 'rgba(34,211,238,0.15)', color: '#22d3ee', padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 800, letterSpacing: 1, marginBottom: 10, border: '1px solid rgba(34,211,238,0.3)' },
  h1: { fontSize: 28, margin: 0, color: 'white', fontWeight: 900 },
  sub: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  modeBtn: { display: 'block', width: '100%', border: 'none', borderRadius: 18, padding: '20px 22px', marginBottom: 14, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', animation: 'pop 0.3s ease-out', boxShadow: '0 10px 26px rgba(0,0,0,0.25)' },
  modeTitle: { fontSize: 19, fontWeight: 800, color: 'white' },
  modeSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  switchBtn: { display: 'block', width: '100%', background: 'none', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px', color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 },
  backBtn: { background: 'none', border: 'none', color: '#7dd3fc', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '8px 0', marginBottom: 10, fontFamily: 'inherit' },
  progressBar: { height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #22d3ee, #0891b2)', transition: 'width 0.4s ease' },
  scoreRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8', fontWeight: 600, marginBottom: 16 },
  correctText: { color: '#4ade80' },
  wrongText: { color: '#f87171' },
  card: { background: 'white', borderRadius: 18, padding: '20px 20px', marginBottom: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'pop 0.3s ease-out' },
  specialtyTag: { display: 'inline-block', fontSize: 11, fontWeight: 800, color: '#0e7490', background: '#ecfeff', padding: '3px 10px', borderRadius: 999, letterSpacing: 0.5, marginBottom: 10 },
  qText: { fontSize: 19, margin: 0, lineHeight: 1.5, color: '#1e293b', fontWeight: 600 },
  choices: { display: 'flex', flexDirection: 'column', gap: 8 },
  choiceBtn: { background: 'white', border: '1.5px solid #cbd5e1', borderRadius: 12, padding: '13px 16px', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', color: '#1e293b', textAlign: 'left', fontWeight: 500 },
  choiceCorrect: { background: '#dcfce7', borderColor: '#4ade80', color: '#166534' },
  choiceWrong: { background: '#fee2e2', borderColor: '#f87171', color: '#991b1b' },
  inputRow: { display: 'flex', gap: 8 },
  textInput: { flex: 1, background: 'white', border: '1.5px solid #cbd5e1', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'inherit', outline: 'none', color: '#1e293b' },
  submitBtn: { background: '#0891b2', border: 'none', borderRadius: 10, padding: '12px 20px', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' },
  feedback: { marginTop: 14, padding: '14px 16px', borderRadius: 12, fontSize: 15, fontWeight: 700 },
  feedbackCorrect: { background: 'rgba(34,197,94,0.15)', color: '#4ade80' },
  feedbackWrong: { background: 'rgba(239,68,68,0.15)', color: '#f87171' },
  answerLine: { marginTop: 4, color: 'white', fontWeight: 700 },
  explanation: { marginTop: 10, fontSize: 13, color: '#94a3b8', lineHeight: 1.5, fontStyle: 'italic' },
  nextBtn: { width: '100%', marginTop: 14, background: 'linear-gradient(135deg, #0891b2, #7c3aed)', border: 'none', borderRadius: 12, padding: 14, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  resultCard: { background: 'white', borderRadius: 20, padding: '36px 24px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', marginTop: 40 },
  resultEmoji: { fontSize: 48, marginBottom: 10 },
  resultH2: { fontSize: 22, fontWeight: 800, color: '#1e293b', margin: 0 },
  resultScore: { fontSize: 40, fontWeight: 900, color: '#0891b2', margin: '12px 0 4px' },
  resultDetail: { fontSize: 14, color: '#64748b' },
  resultMistakeNote: { marginTop: 14, fontSize: 13, color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '8px 12px' },
};
