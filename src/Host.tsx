import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { subjects } from './questions';

export function Host() {
  const [subjectId, setSubjectId] = useState(subjects[0].id);
  const [currentQ, setCurrentQ] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('dnh_quiz_state').select('*').eq('id', 1).single()
      .then(({ data }) => {
        if (data) {
          setSubjectId(data.subject_id);
          setCurrentQ(data.current_question);
          setRevealed(data.revealed);
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
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // Optimistic: update local state immediately, then fire DB update
  const update = async (u: any) => {
    if ('subject_id' in u) setSubjectId(u.subject_id);
    if ('current_question' in u) setCurrentQ(u.current_question);
    if ('revealed' in u) setRevealed(u.revealed);
    const { error } = await supabase.from('dnh_quiz_state').update(u).eq('id', 1);
    if (error) console.error('Update failed:', error);
  };

  const reveal = () => update({ revealed: true });
  const next = () => update({ current_question: currentQ + 1, revealed: false });
  const reset = () => update({ current_question: 0, revealed: false });
  const switchSubject = (id: string) => update({ subject_id: id, current_question: 0, revealed: false });

  const subject = subjects.find(s => s.id === subjectId) || subjects[0];
  const q = subject.questions[currentQ];
  const total = subject.questions.length;
  const qAns = answers.filter(a => a.subject_id === subjectId && a.question_index === currentQ);
  const progress = total > 0 ? ((currentQ + (revealed ? 1 : 0)) / total) * 100 : 0;

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <div>
            <div style={S.eyebrow}>🎓 HOST · Daniel naar HAVO</div>
            <h1 style={S.h1}>{subject.title}</h1>
          </div>
          <select value={subjectId} onChange={e => switchSubject(e.target.value)} style={S.select}>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>

        <div style={S.progressBar}>
          <div style={{ ...S.progressFill, width: `${progress}%` }} />
        </div>
        <div style={S.progressLabel}>Vraag {Math.min(currentQ + 1, total)} van {total}</div>

        {!q ? (
          <div style={S.card}>
            <h2 style={{ marginTop: 0 }}>Klaar! 🎉</h2>
            <p style={S.muted}>Je hebt alle vragen van deze sectie gehad.</p>
            <button onClick={reset} style={S.btnPrimary}>↺ Opnieuw beginnen</button>
          </div>
        ) : (
          <>
            <div style={S.card}>
              <div style={S.qNum}>VRAAG {currentQ + 1}</div>
              <p style={S.qText}>{q.prompt}</p>
              {q.options && (
                <ul style={S.options}>
                  {q.options.map((o, i) => <li key={i} style={S.option}>{o}</li>)}
                </ul>
              )}
            </div>

            <div style={S.card}>
              <h3 style={S.cardTitle}>Antwoorden ({qAns.length})</h3>
              {qAns.length === 0
                ? <p style={S.muted}>Nog niemand…</p>
                : <ul style={S.answersList}>
                    {qAns.map(a => (
                      <li key={a.id} style={S.answerItem}>
                        <b style={{ color: '#4f46e5' }}>{a.player_name}:</b> {a.answer}
                      </li>
                    ))}
                  </ul>}
            </div>

            {revealed && (
              <div style={S.reveal}>
                <div style={S.revealLabel}>✅ JUISTE ANTWOORD</div>
                <p style={S.revealAnswer}>{q.answer}</p>
                <div style={S.revealLabel}>💡 UITLEG</div>
                <p style={S.revealExpl}>{q.explanation}</p>
              </div>
            )}

            <div style={S.actions}>
              {!revealed
                ? <button onClick={reveal} style={S.btnPrimary}>🔍 Toon antwoord</button>
                : <button onClick={next} style={S.btnPrimary}>➡️ Volgende vraag</button>}
              <button onClick={reset} style={S.btnSecondary}>↺ Reset</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1f2937', padding: '24px 16px' },
  container: { maxWidth: 720, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  eyebrow: { fontSize: 12, color: '#6b7280', letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' },
  h1: { fontSize: 24, margin: '4px 0 0', color: '#111827' },
  select: { padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', background: 'white', fontSize: 14 },
  progressBar: { height: 8, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', transition: 'width 0.3s' },
  progressLabel: { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  card: { background: 'white', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  cardTitle: { margin: '0 0 12px', fontSize: 15, color: '#374151' },
  qNum: { fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 1, marginBottom: 8 },
  qText: { fontSize: 18, margin: 0, lineHeight: 1.5 },
  options: { listStyle: 'none', padding: 0, margin: '12px 0 0' },
  option: { padding: '8px 0', borderTop: '1px solid #f3f4f6', fontSize: 15 },
  answersList: { listStyle: 'none', padding: 0, margin: 0 },
  answerItem: { padding: '10px 12px', background: '#f9fafb', borderRadius: 8, marginBottom: 8, fontSize: 14, lineHeight: 1.5 },
  muted: { color: '#9ca3af', margin: 0 },
  reveal: { background: 'linear-gradient(135deg, #d1fae5, #ecfdf5)', border: '1px solid #6ee7b7', borderRadius: 12, padding: 20, marginBottom: 16 },
  revealLabel: { fontSize: 11, fontWeight: 700, color: '#047857', letterSpacing: 1, marginTop: 4 },
  revealAnswer: { fontSize: 16, margin: '4px 0 12px', fontWeight: 600, color: '#064e3b' },
  revealExpl: { fontSize: 14, margin: '4px 0 0', color: '#065f46', lineHeight: 1.6 },
  actions: { display: 'flex', gap: 8, marginTop: 8 },
  btnPrimary: { padding: '12px 20px', fontSize: 15, border: 'none', borderRadius: 8, background: '#4f46e5', color: 'white', cursor: 'pointer', fontWeight: 600, flex: 1 },
  btnSecondary: { padding: '12px 20px', fontSize: 15, border: '1px solid #d1d5db', borderRadius: 8, background: 'white', color: '#4b5563', cursor: 'pointer', fontWeight: 500 },
};
