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

  const update = (u: any) => supabase.from('dnh_quiz_state').update(u).eq('id', 1);
  const reveal = () => update({ revealed: true });
  const next = () => update({ current_question: currentQ + 1, revealed: false });
  const reset = () => update({ current_question: 0, revealed: false });
  const switchSubject = (id: string) => update({ subject_id: id, current_question: 0, revealed: false });

  const subject = subjects.find(s => s.id === subjectId) || subjects[0];
  const q = subject.questions[currentQ];
  const qAns = answers.filter(a => a.subject_id === subjectId && a.question_index === currentQ);

  return (
    <div style={{ padding: 24, maxWidth: 760, margin: 'auto', fontFamily: 'system-ui, sans-serif', color: '#222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, color: '#666', margin: 0 }}>🎓 Host — Daniel naar HAVO</h1>
        <select value={subjectId} onChange={e => switchSubject(e.target.value)} style={{ padding: 6 }}>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </div>

      <h2 style={{ color: '#444' }}>{subject.title}</h2>

      {!q ? (
        <>
          <h3>Quiz klaar! 🎉</h3>
          <button onClick={reset} style={btn}>Opnieuw beginnen</button>
        </>
      ) : (
        <>
          <h3>Vraag {currentQ + 1} / {subject.questions.length}</h3>
          <p style={{ fontSize: 18 }}>{q.prompt}</p>
          {q.options && <ul>{q.options.map((o, i) => <li key={i}>{o}</li>)}</ul>}

          <h4 style={{ marginTop: 24 }}>Antwoorden ({qAns.length}):</h4>
          {qAns.length === 0 ? <p style={{ color: '#888' }}>Nog niemand…</p> : (
            <ul>{qAns.map(a => <li key={a.id}><b>{a.player_name}:</b> {a.answer}</li>)}</ul>
          )}

          {revealed && (
            <div style={{ background: '#e8f5e9', padding: 12, marginTop: 16, borderRadius: 8 }}>
              <b>✅ Juiste antwoord:</b> {q.answer}
              {q.explanation && <p style={{ marginTop: 8 }}>{q.explanation}</p>}
            </div>
          )}

          <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
            {!revealed
              ? <button onClick={reveal} style={btn}>🔍 Toon antwoord</button>
              : <button onClick={next} style={btn}>➡️ Volgende vraag</button>}
            <button onClick={reset} style={{ ...btn, marginLeft: 'auto', background: '#eee', color: '#444' }}>↺ Reset</button>
          </div>
        </>
      )}
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: '10px 16px', fontSize: 15, border: 'none', borderRadius: 6,
  background: '#2563eb', color: 'white', cursor: 'pointer',
};
