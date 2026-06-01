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
    await supabase.from('dnh_answers').insert({
      subject_id: subjectId, question_index: currentQ, player_name: name, answer,
    });
    setSubmitted(true);
  };

  if (!nameSet) return (
    <div style={{ padding: 24, maxWidth: 500, margin: 'auto', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Wie ben je?</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Jouw naam"
        style={{ padding: 10, fontSize: 16, width: '100%', marginBottom: 8, borderRadius: 6, border: '1px solid #ccc' }} />
      <button onClick={saveName} disabled={!name.trim()} style={btn}>Start</button>
    </div>
  );

  const subject = subjects.find(s => s.id === subjectId) || subjects[0];
  const q = subject.questions[currentQ];
  if (!q) return <div style={{ padding: 24 }}>Quiz klaar! 🎉</div>;

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: 'auto', fontFamily: 'system-ui, sans-serif', color: '#222' }}>
      <p style={{ color: '#666' }}>Hoi <b>{name}</b> 👋 — {subject.title}</p>
      <h2>Vraag {currentQ + 1}</h2>
      <p style={{ fontSize: 18 }}>{q.prompt}</p>
      {q.options && <ul>{q.options.map((o, i) => <li key={i}>{o}</li>)}</ul>}

      {!submitted ? (
        <>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="Jouw antwoord…" rows={3}
            style={{ width: '100%', padding: 10, fontSize: 16, marginTop: 8, borderRadius: 6, border: '1px solid #ccc', fontFamily: 'inherit' }} />
          <button onClick={submit} style={{ ...btn, marginTop: 8 }}>Verstuur</button>
        </>
      ) : (
        <p style={{ background: '#eef3ff', padding: 12, borderRadius: 8 }}>
          ✅ Verstuurd: <b>{answer}</b>
        </p>
      )}

      {revealed && (
        <div style={{ background: '#e8f5e9', padding: 12, marginTop: 16, borderRadius: 8 }}>
          <b>✅ Juiste antwoord:</b> {q.answer}
          {q.explanation && <p style={{ marginTop: 8 }}>{q.explanation}</p>}
        </div>
      )}
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: '10px 16px', fontSize: 15, border: 'none', borderRadius: 6,
  background: '#2563eb', color: 'white', cursor: 'pointer',
};
