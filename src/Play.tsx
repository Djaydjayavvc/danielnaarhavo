import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { subjects } from './questions';

export function Play() {
  const [name, setName] = useState(localStorage.getItem('dnh_name') || '');
  const [nameSet, setNameSet] = useState(!!localStorage.getItem('dnh_name'));
  const [subjectId, setSubjectId] = useState(subjects[0].id);
  const [currentQ, setCurrentQ] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    supabase.from('dnh_quiz_state').select('*').eq('id', 1).single()
      .then(({ data }) => {
        if (data) {
          setSubjectId(data.subject_id);
          setCurrentQ(data.current_question);
          setRevealed(data.revealed);
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
    <div style={S.page}>
      <div style={{ ...S.container, maxWidth: 440, marginTop: 60 }}>
        <div style={S.card}>
          <div style={S.eyebrow}>👋 Welkom</div>
          <h1 style={S.h1}>Wie ben je?</h1>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Jouw naam"
            style={S.input} />
          <button onClick={saveName} disabled={!name.trim()} style={S.btnPrimary}>Start</button>
        </div>
      </div>
    </div>
  );

  const subject = subjects.find(s => s.id === subjectId) || subjects[0];
  const q = subject.questions[currentQ];
  const total = subject.questions.length;
  const progress = total > 0 ? ((currentQ + (revealed ? 1 : 0)) / total) * 100 : 0;

  if (!q) return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.card}>
          <h2>Klaar! 🎉</h2>
          <p style={S.muted}>Wacht tot de host de volgende sectie start.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
          <img src="/daniel.jpg" alt="daniel" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }} />
          <div style={S.eyebrow}>Hoi {name} 👋</div>
        </div>
        <h1 style={S.h1}>{subject.title}</h1>

        <div style={S.progressBar}>
          <div style={{ ...S.progressFill, width: `${progress}%` }} />
        </div>
        <div style={S.progressLabel}>Vraag {Math.min(currentQ + 1, total)} van {total}</div>

        <div style={S.card}>
          <div style={S.qNum}>VRAAG {currentQ + 1}</div>
          <p style={S.qText}>{q.prompt}</p>
          {q.options && (
            <ul style={S.options}>
              {q.options.map((o, i) => <li key={i} style={S.option}>{o}</li>)}
            </ul>
          )}
        </div>

        {!submitted ? (
          <div style={S.card}>
            <textarea value={answer} onChange={e => setAnswer(e.target.value)}
              placeholder="Jouw antwoord…" rows={3} style={S.textarea} />
            <button onClick={submit} style={{ ...S.btnPrimary, marginTop: 12 }} disabled={!answer.trim()}>
              Verstuur
            </button>
          </div>
        ) : (
          <div style={S.submittedBox}>
            <div style={S.submittedLabel}>✅ VERSTUURD</div>
            <p style={S.submittedText}>{answer}</p>
          </div>
        )}

        {revealed && (
          <div style={S.reveal}>
            <div style={S.revealLabel}>✅ JUISTE ANTWOORD</div>
            <p style={S.revealAnswer}>{q.answer}</p>
            <div style={S.revealLabel}>💡 UITLEG</div>
            <p style={S.revealExpl}>{q.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1f2937', padding: '24px 16px' },
  container: { maxWidth: 600, margin: '0 auto' },
  eyebrow: { fontSize: 12, color: '#6b7280', letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' },
  h1: { fontSize: 24, margin: '4px 0 16px', color: '#111827' },
  progressBar: { height: 8, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', transition: 'width 0.3s' },
  progressLabel: { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  card: { background: 'white', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  qNum: { fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 1, marginBottom: 8 },
  qText: { fontSize: 18, margin: 0, lineHeight: 1.5 },
  options: { listStyle: 'none', padding: 0, margin: '12px 0 0' },
  option: { padding: '10px 0', borderTop: '1px solid #f3f4f6', fontSize: 15 },
  input: { width: '100%', padding: 12, fontSize: 16, marginTop: 12, marginBottom: 12, borderRadius: 8, border: '1px solid #d1d5db', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #d1d5db', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' },
  submittedBox: { background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 12, padding: 16, marginBottom: 16 },
  submittedLabel: { fontSize: 11, fontWeight: 700, color: '#4338ca', letterSpacing: 1 },
  submittedText: { margin: '6px 0 0', fontSize: 15 },
  reveal: { background: 'linear-gradient(135deg, #d1fae5, #ecfdf5)', border: '1px solid #6ee7b7', borderRadius: 12, padding: 20, marginBottom: 16 },
  revealLabel: { fontSize: 11, fontWeight: 700, color: '#047857', letterSpacing: 1, marginTop: 4 },
  revealAnswer: { fontSize: 16, margin: '4px 0 12px', fontWeight: 600, color: '#064e3b' },
  revealExpl: { fontSize: 14, margin: '4px 0 0', color: '#065f46', lineHeight: 1.6 },
  muted: { color: '#9ca3af' },
  btnPrimary: { padding: '12px 20px', fontSize: 15, border: 'none', borderRadius: 8, background: '#4f46e5', color: 'white', cursor: 'pointer', fontWeight: 600, width: '100%' },
};
