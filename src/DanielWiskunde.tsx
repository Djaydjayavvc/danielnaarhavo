import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from './lib/supabase';
import { WISKUNDE_QUESTIONS, SUB_TOPIC_LABELS, type WiskundeQuestion } from './wiskunde-questions';

// ─── COLORS ─────────────────────────────────────────────────────────────────
const C = {
  bg: '#0f1729',
  card: '#182340',
  cardHover: '#1e2d52',
  accent: '#3b82f6',
  accentGlow: 'rgba(59,130,246,.25)',
  green: '#22c55e',
  greenGlow: 'rgba(34,197,94,.2)',
  red: '#ef4444',
  redGlow: 'rgba(239,68,68,.2)',
  orange: '#f59e0b',
  purple: '#a78bfa',
  text: '#e2e8f0',
  textDim: '#94a3b8',
  textBright: '#f8fafc',
  border: '#2a3a5c',
};

// ─── CSS ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'DM Sans', sans-serif; }

  .wsk-app { min-height: 100vh; max-width: 520px; margin: 0 auto; padding: 20px 16px 60px; }

  .wsk-header { text-align: center; margin-bottom: 20px; padding-top: 12px; }
  .wsk-header h1 {
    font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 800;
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .wsk-header p { color: ${C.textDim}; font-size: 13px; margin-top: 4px; }

  .wsk-tabs {
    display: flex; gap: 4px; background: ${C.card}; border-radius: 14px;
    padding: 4px; margin-bottom: 20px;
  }
  .wsk-tab {
    flex: 1; padding: 11px 6px; border: none; border-radius: 10px;
    font-weight: 700; font-size: 13px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .2s; line-height: 1.2;
    color: ${C.textDim}; background: none;
  }
  .wsk-tab.active-h8 { background: ${C.accent}; color: #fff; }
  .wsk-tab.active-h9 { background: ${C.purple}; color: #fff; }
  .wsk-tab.active-her { background: ${C.orange}; color: #fff; }
  .wsk-tab.active-sam { background: #10b981; color: #fff; }
  .wsk-tab-badge {
    display: inline-block; background: rgba(255,255,255,.25);
    border-radius: 10px; padding: 1px 7px; font-size: 11px; margin-left: 4px;
  }

  .wsk-menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
  .wsk-menu-btn {
    background: ${C.card}; border: 1px solid ${C.border}; border-radius: 14px;
    padding: 16px 12px; cursor: pointer; transition: all .2s; text-align: center;
    font-family: 'DM Sans', sans-serif;
  }
  .wsk-menu-btn:hover { background: ${C.cardHover}; border-color: ${C.accent}; }
  .wsk-menu-btn.full { grid-column: 1 / -1; }
  .wsk-menu-btn .icon { font-size: 24px; margin-bottom: 6px; }
  .wsk-menu-btn .label { font-size: 13px; font-weight: 700; color: ${C.textBright}; }
  .wsk-menu-btn .sub { font-size: 11px; color: ${C.textDim}; margin-top: 3px; }

  .wsk-back { background: none; border: none; color: ${C.textDim}; font-size: 14px;
    font-weight: 500; cursor: pointer; padding: 8px 0; margin-bottom: 14px;
    font-family: 'DM Sans'; }
  .wsk-back:hover { color: ${C.textBright}; }

  .wsk-progress { width: 100%; height: 6px; background: rgba(255,255,255,.06);
    border-radius: 3px; margin-bottom: 14px; overflow: hidden; }
  .wsk-progress-fill {
    height: 100%; border-radius: 3px; transition: width .4s ease;
    background: linear-gradient(90deg, ${C.accent}, ${C.purple});
  }

  .wsk-score-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 14px; font-size: 13px; color: ${C.textDim}; font-weight: 500;
  }
  .wsk-score-row .ok { color: ${C.green}; }
  .wsk-score-row .bad { color: ${C.red}; }

  .wsk-card {
    background: ${C.card}; border: 1px solid ${C.border}; border-radius: 16px;
    padding: 22px 18px; margin-bottom: 14px;
  }
  .wsk-card .sub-label {
    font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
    color: ${C.textDim}; margin-bottom: 10px;
  }
  .wsk-card .question-text {
    font-size: 17px; font-weight: 600; color: ${C.textBright}; line-height: 1.5;
  }

  .wsk-choices { display: flex; flex-direction: column; gap: 8px; }
  .wsk-choice {
    background: ${C.card}; border: 1.5px solid ${C.border}; border-radius: 12px;
    padding: 15px 16px; cursor: pointer; font-size: 15px; font-family: 'DM Sans';
    color: ${C.text}; text-align: left; transition: all .15s; font-weight: 500;
  }
  .wsk-choice:hover:not(.locked) { background: ${C.cardHover}; border-color: ${C.accent}; }
  .wsk-choice.correct { background: ${C.greenGlow}; border-color: ${C.green}; color: ${C.green}; }
  .wsk-choice.wrong { background: ${C.redGlow}; border-color: ${C.red}; color: ${C.red}; }
  .wsk-choice.locked { cursor: default; opacity: .6; }
  .wsk-choice.locked.correct { opacity: 1; }

  .wsk-num-row { display: flex; gap: 8px; margin-top: 10px; }
  .wsk-num-input {
    flex: 1; background: rgba(255,255,255,.06); border: 1.5px solid ${C.border};
    border-radius: 12px; padding: 16px 14px; color: ${C.textBright};
    font-size: 22px; font-family: 'DM Sans'; outline: none;
    transition: border-color .2s; text-align: center; font-weight: 700;
    -moz-appearance: textfield;
  }
  .wsk-num-input::-webkit-outer-spin-button,
  .wsk-num-input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .wsk-num-input:focus { border-color: ${C.accent}; }
  .wsk-check-btn {
    background: ${C.accent}; border: none; border-radius: 12px;
    padding: 16px 22px; color: white; font-weight: 700; font-size: 16px;
    cursor: pointer; font-family: 'DM Sans'; white-space: nowrap;
    transition: opacity .2s;
  }
  .wsk-check-btn:disabled { opacity: .35; cursor: default; }
  .wsk-check-btn:not(:disabled):hover { opacity: .9; }

  .wsk-feedback {
    margin-top: 12px; padding: 14px 16px; border-radius: 12px;
    font-size: 14px; font-weight: 600; line-height: 1.6;
  }
  .wsk-feedback.correct {
    background: ${C.greenGlow}; color: ${C.green};
    border: 1px solid rgba(34,197,94,.25);
  }
  .wsk-feedback.wrong {
    background: ${C.redGlow}; color: ${C.red};
    border: 1px solid rgba(239,68,68,.25);
  }
  .wsk-feedback .explanation { color: ${C.textBright}; margin-top: 6px; font-weight: 500; font-size: 13px; }

  .wsk-next {
    width: 100%; margin-top: 14px;
    background: linear-gradient(135deg, ${C.accent}, ${C.purple});
    border: none; border-radius: 12px; padding: 15px;
    color: white; font-size: 15px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans'; transition: opacity .2s;
  }
  .wsk-next:hover { opacity: .9; }

  .wsk-hint-btn {
    background: none; border: none; color: ${C.orange};
    font-size: 13px; cursor: pointer; margin-top: 10px;
    font-family: 'DM Sans'; font-weight: 500;
  }
  .wsk-hint-text { font-size: 13px; color: ${C.orange}; margin-top: 6px; font-style: italic; }

  .wsk-result {
    background: ${C.card}; border: 1px solid ${C.border}; border-radius: 16px;
    padding: 32px 24px; text-align: center;
  }
  .wsk-result .emoji { font-size: 48px; margin-bottom: 12px; }
  .wsk-result h2 { font-family: 'Outfit'; font-size: 22px; font-weight: 700; color: ${C.textBright}; }
  .wsk-result .pct {
    font-size: 40px; font-weight: 800; font-family: 'Outfit'; margin: 12px 0 4px;
  }
  .wsk-result .pct.great { color: ${C.green}; }
  .wsk-result .pct.ok { color: ${C.orange}; }
  .wsk-result .pct.low { color: ${C.red}; }
  .wsk-result .detail { font-size: 14px; color: ${C.textDim}; }

  .wsk-her-group {
    display: flex; align-items: center; gap: 10px;
    background: ${C.card}; border: 1px solid ${C.border};
    border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; cursor: pointer;
    transition: all .2s;
  }
  .wsk-her-group:hover { background: ${C.cardHover}; }
  .wsk-her-group .gname { flex: 1; font-size: 14px; font-weight: 700; color: ${C.textBright}; }
  .wsk-her-group .gcount { font-size: 13px; font-weight: 700; color: ${C.orange}; }
  .wsk-her-group .gpractice {
    background: ${C.accent}; border: none; border-radius: 8px;
    padding: 6px 14px; color: white; font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans';
  }

  .wsk-streak-dots { font-size: 18px; letter-spacing: 2px; }

  /* ── Samenvatting ────────────────────────────────────────────────── */
  .wsk-sam-chapter {
    font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 800;
    color: ${C.textBright}; margin: 24px 0 12px; padding-bottom: 8px;
    border-bottom: 2px solid ${C.border};
  }
  .wsk-sam-chapter:first-child { margin-top: 0; }
  .wsk-sam-block {
    border-radius: 14px; padding: 16px 16px 12px; margin-bottom: 12px;
    border: 1px solid transparent;
  }
  .wsk-sam-block.green {
    background: rgba(34,197,94,.08); border-color: rgba(34,197,94,.2);
  }
  .wsk-sam-block.orange {
    background: rgba(245,158,11,.08); border-color: rgba(245,158,11,.2);
  }
  .wsk-sam-block.red {
    background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.2);
  }
  .wsk-sam-block h3 {
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 800;
    letter-spacing: .3px; margin-bottom: 12px;
  }
  .wsk-sam-block.green h3 { color: ${C.green}; }
  .wsk-sam-block.orange h3 { color: ${C.orange}; }
  .wsk-sam-block.red h3 { color: ${C.red}; }
  .wsk-sam-subhead {
    font-size: 13px; font-weight: 700; color: ${C.textBright};
    margin: 12px 0 6px;
  }
  .wsk-sam-subhead:first-of-type { margin-top: 0; }
  .wsk-sam-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
  .wsk-sam-list li {
    font-size: 13px; color: ${C.text}; line-height: 1.55; padding-left: 16px;
    position: relative;
  }
  .wsk-sam-list li::before { content: '•'; position: absolute; left: 0; color: ${C.textDim}; }
  .wsk-sam-list li strong { color: ${C.textBright}; }
  .wsk-sam-list li em { color: ${C.accent}; font-style: normal; }
  .wsk-sam-example {
    background: rgba(59,130,246,.08); border: 1px solid rgba(59,130,246,.15);
    border-radius: 10px; padding: 10px 12px; margin-top: 8px;
    font-size: 12.5px; color: #93c5fd; line-height: 1.6;
  }
  .wsk-sam-steps {
    list-style: none; display: flex; flex-direction: column; gap: 6px; margin-top: 4px;
  }
  .wsk-sam-steps li {
    font-size: 13px; color: ${C.text}; line-height: 1.55; padding-left: 22px;
    position: relative;
  }
  .wsk-sam-steps li::before {
    content: attr(data-n); position: absolute; left: 0;
    font-weight: 800; color: ${C.accent}; font-size: 12px;
  }
  .wsk-sam-steps li strong { color: ${C.textBright}; }

  .wsk-host-table {
    width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px;
  }
  .wsk-host-table th {
    text-align: left; padding: 8px 10px; color: ${C.textDim};
    border-bottom: 1px solid ${C.border}; font-weight: 600; font-size: 12px;
  }
  .wsk-host-table td {
    padding: 10px 10px; border-bottom: 1px solid rgba(42,58,92,.5);
    color: ${C.text}; vertical-align: top;
  }
  .wsk-host-table tr:last-child td { border-bottom: none; }
  .wsk-host-section {
    background: ${C.card}; border: 1px solid ${C.border}; border-radius: 14px;
    padding: 16px; margin-bottom: 14px;
  }
  .wsk-host-section h3 {
    font-family: 'Outfit'; font-size: 15px; font-weight: 700;
    color: ${C.textBright}; margin-bottom: 12px;
  }
  .wsk-stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .wsk-stat-box {
    background: rgba(255,255,255,.04); border-radius: 10px; padding: 14px 10px; text-align: center;
  }
  .wsk-stat-box .sval { font-size: 26px; font-weight: 800; font-family: 'Outfit'; color: ${C.textBright}; }
  .wsk-stat-box .slabel { font-size: 11px; color: ${C.textDim}; margin-top: 3px; }
`;

// ─── HELPERS ────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function checkNumeric(raw: string, correct: string, tolerance?: number): boolean {
  const num = parseFloat(raw.trim().replace(',', '.'));
  const ans = parseFloat(correct);
  if (isNaN(num) || isNaN(ans)) return false;
  return Math.abs(num - ans) <= (tolerance ?? 0.001);
}

async function saveAttempt(q: WiskundeQuestion, answer: string, isCorrect: boolean) {
  const { error } = await supabase.from('dnh_wiskunde_attempts').insert({
    question_id: q.id,
    question_text: q.prompt,
    student_answer: answer,
    correct_answer: q.correct_answer,
    is_correct: isCorrect,
    category: q.category,
    sub_topic: q.sub_topic,
  });
  if (error) console.error('saveAttempt:', error);
}

async function upsertHerhaling(q: WiskundeQuestion) {
  const { error } = await supabase.from('dnh_wiskunde_herhaling').upsert(
    {
      question_id: q.id,
      question_text: q.prompt,
      correct_answer: q.correct_answer,
      category: q.category,
      sub_topic: q.sub_topic,
      times_correct: 0,
    },
    { onConflict: 'question_id' }
  );
  if (error) console.error('upsertHerhaling:', error);
}

async function progressHerhaling(questionId: string): Promise<'continued' | 'graduated'> {
  const { data } = await supabase
    .from('dnh_wiskunde_herhaling')
    .select('times_correct')
    .eq('question_id', questionId)
    .single();
  const next = (data?.times_correct ?? 0) + 1;
  if (next >= 2) {
    await supabase.from('dnh_wiskunde_herhaling').delete().eq('question_id', questionId);
    return 'graduated';
  }
  await supabase
    .from('dnh_wiskunde_herhaling')
    .update({ times_correct: next })
    .eq('question_id', questionId);
  return 'continued';
}

async function fetchHerhalingCount(): Promise<number> {
  const { count } = await supabase
    .from('dnh_wiskunde_herhaling')
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
}

function fireConfetti() {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
}

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface HerhalingRow {
  question_id: string;
  question_text: string;
  correct_answer: string;
  category: string;
  sub_topic: string;
  times_correct: number;
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function DanielWiskunde({ isHost }: { isHost: boolean }) {
  const [tab, setTab] = useState<'H8' | 'H9' | 'herhaling' | 'samenvatting'>('H8');
  const [herhalingCount, setHerhalingCount] = useState(0);

  const refreshCount = () => fetchHerhalingCount().then(setHerhalingCount);

  useEffect(() => { refreshCount(); }, []);

  if (isHost) {
    return (
      <>
        <style>{css}</style>
        <WiskundeHost />
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="wsk-app">
        <div className="wsk-header">
          <h1>📐 Wiskunde</h1>
          <p>G&amp;R Deel 2 · Hoofdstuk 8 &amp; 9</p>
        </div>

        <div className="wsk-tabs" style={{ fontSize: 11 }}>
          <button
            className={`wsk-tab${tab === 'H8' ? ' active-h8' : ''}`}
            onClick={() => setTab('H8')}
          >
            H8<br />Formules
          </button>
          <button
            className={`wsk-tab${tab === 'H9' ? ' active-h9' : ''}`}
            onClick={() => setTab('H9')}
          >
            H9<br />Symmetrie
          </button>
          <button
            className={`wsk-tab${tab === 'herhaling' ? ' active-her' : ''}`}
            onClick={() => setTab('herhaling')}
          >
            🔁{herhalingCount > 0 && <span className="wsk-tab-badge">{herhalingCount}</span>}
          </button>
          <button
            className={`wsk-tab${tab === 'samenvatting' ? ' active-sam' : ''}`}
            onClick={() => setTab('samenvatting')}
          >
            📖<br />Sam.
          </button>
        </div>

        {tab === 'H8' && (
          <WiskundeQuiz key="H8" category="H8" onWrongAnswer={refreshCount} />
        )}
        {tab === 'H9' && (
          <WiskundeQuiz key="H9" category="H9" onWrongAnswer={refreshCount} />
        )}
        {tab === 'herhaling' && (
          <WiskundeHerhaling onBadgeChange={refreshCount} />
        )}
        {tab === 'samenvatting' && <WiskundeSamenvatting />}
      </div>
    </>
  );
}

// ─── QUIZ COMPONENT ──────────────────────────────────────────────────────────
function WiskundeQuiz({
  category,
  onWrongAnswer,
}: {
  category: 'H8' | 'H9';
  onWrongAnswer: () => void;
}) {
  const [subTopic, setSubTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<WiskundeQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [started, setStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const catQuestions = WISKUNDE_QUESTIONS.filter(q => q.category === category);
  const subTopics = [...new Set(catQuestions.map(q => q.sub_topic))];

  const startQuiz = (topic: string | null) => {
    const pool = topic
      ? catQuestions.filter(q => q.sub_topic === topic)
      : catQuestions;
    setQuestions(shuffle(pool));
    setQi(0);
    setSelected(null);
    setInput('');
    setFeedback(null);
    setShowHint(false);
    setScore({ correct: 0, wrong: 0 });
    setStarted(true);
  };

  useEffect(() => {
    const cur = questions[qi];
    if (cur?.type === 'numeric_input' && !feedback && inputRef.current) {
      inputRef.current.focus();
    }
  }, [qi, feedback, questions]);

  if (!started) {
    return (
      <div>
        <div className="wsk-menu-grid">
          <div
            className="wsk-menu-btn full"
            onClick={() => startQuiz(null)}
          >
            <div className="icon">📋</div>
            <div className="label">Alles {category}</div>
            <div className="sub">{catQuestions.length} vragen — alles door elkaar</div>
          </div>
          {subTopics.map(st => {
            const count = catQuestions.filter(q => q.sub_topic === st).length;
            return (
              <div key={st} className="wsk-menu-btn" onClick={() => startQuiz(st)}>
                <div className="icon">{category === 'H8' ? '📊' : '📐'}</div>
                <div className="label">{SUB_TOPIC_LABELS[st] ?? st}</div>
                <div className="sub">{count} vragen</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const done = qi >= questions.length;
  if (done) {
    const total = questions.length;
    const pct = Math.round((score.correct / total) * 100);
    const cls = pct >= 80 ? 'great' : pct >= 55 ? 'ok' : 'low';
    return (
      <div className="wsk-result">
        <div className="emoji">{pct >= 80 ? '🎉' : pct >= 55 ? '💪' : '📚'}</div>
        <h2>{pct >= 80 ? 'Geweldig!' : pct >= 55 ? 'Goed bezig!' : 'Blijven oefenen!'}</h2>
        <div className={`pct ${cls}`}>{pct}%</div>
        <div className="detail">{score.correct} / {total} goed</div>
        {score.wrong > 0 && (
          <div style={{ marginTop: 8, fontSize: 13, color: C.orange }}>
            {score.wrong} fout → toegevoegd aan 🔁 Herhaling
          </div>
        )}
        <button
          className="wsk-next"
          style={{ marginTop: 20 }}
          onClick={() => {
            setStarted(false);
            setSubTopic(null);
          }}
        >
          Terug naar menu
        </button>
        <button
          className="wsk-next"
          style={{ marginTop: 10, background: C.card, border: `1px solid ${C.border}` }}
          onClick={() => startQuiz(subTopic)}
        >
          Opnieuw proberen
        </button>
      </div>
    );
  }

  const cur = questions[qi];

  const handleAnswer = async (answer: string, isCorrect: boolean) => {
    if (feedback) return;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setScore(s => isCorrect ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });
    await saveAttempt(cur, answer, isCorrect);
    if (!isCorrect) {
      await upsertHerhaling(cur);
      onWrongAnswer();
    }
  };

  const handleMC = (opt: string) => {
    if (feedback) return;
    setSelected(opt);
    handleAnswer(opt, opt === cur.correct_answer);
  };

  const handleNumeric = () => {
    if (!input.trim() || feedback) return;
    const correct = checkNumeric(input, cur.correct_answer, cur.tolerance);
    handleAnswer(input.trim(), correct);
  };

  const next = () => {
    setQi(qi + 1);
    setSelected(null);
    setInput('');
    setFeedback(null);
    setShowHint(false);
  };

  const topicLabel = SUB_TOPIC_LABELS[cur.sub_topic] ?? cur.sub_topic;

  return (
    <>
      <div className="wsk-progress">
        <div className="wsk-progress-fill" style={{ width: `${(qi / questions.length) * 100}%` }} />
      </div>
      <div className="wsk-score-row">
        <span>Vraag {qi + 1} van {questions.length}</span>
        <span>
          <span className="ok">✓ {score.correct}</span>
          {' · '}
          <span className="bad">✗ {score.wrong}</span>
        </span>
      </div>

      <div className="wsk-card">
        <div className="sub-label">{topicLabel}</div>
        <div className="question-text">{cur.prompt}</div>
        {cur.hint && !feedback && (
          <>
            {!showHint && (
              <button className="wsk-hint-btn" onClick={() => setShowHint(true)}>
                💡 Hint
              </button>
            )}
            {showHint && <div className="wsk-hint-text">{cur.hint}</div>}
          </>
        )}
      </div>

      {cur.type === 'multiple_choice' && (
        <div className="wsk-choices">
          {(cur.options ?? []).map(opt => {
            let cls = 'wsk-choice';
            if (feedback) {
              cls += ' locked';
              if (opt === cur.correct_answer) cls += ' correct';
              else if (opt === selected) cls += ' wrong';
            }
            return (
              <button key={opt} className={cls} onClick={() => handleMC(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {cur.type === 'numeric_input' && !feedback && (
        <div className="wsk-num-row">
          <input
            ref={inputRef}
            className="wsk-num-input"
            type="text"
            inputMode="decimal"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleNumeric(); }}
            placeholder="?"
          />
          <button
            className="wsk-check-btn"
            disabled={!input.trim()}
            onClick={handleNumeric}
          >
            Check
          </button>
        </div>
      )}

      {feedback && (
        <div className={`wsk-feedback ${feedback}`}>
          {feedback === 'correct' ? '✅ Goed!' : `❌ Fout! Jouw antwoord: ${cur.type === 'numeric_input' ? input.trim() : selected}`}
          <div className="explanation">{cur.explanation}</div>
        </div>
      )}

      {feedback && (
        <button className="wsk-next" onClick={next}>
          {qi + 1 < questions.length ? 'Volgende →' : 'Resultaat bekijken'}
        </button>
      )}
    </>
  );
}

// ─── HERHALING COMPONENT ─────────────────────────────────────────────────────
function WiskundeHerhaling({ onBadgeChange }: { onBadgeChange: () => void }) {
  const [rows, setRows] = useState<HerhalingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null); // null = alles
  const [inSession, setInSession] = useState(false);

  const loadRows = async () => {
    const { data } = await supabase
      .from('dnh_wiskunde_herhaling')
      .select('*')
      .order('sub_topic');
    setRows((data as HerhalingRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { loadRows(); }, []);

  if (loading) {
    return (
      <div className="wsk-card" style={{ textAlign: 'center' }}>
        <div className="sub-label">Laden…</div>
        <div className="question-text" style={{ fontSize: 16 }}>Herhaling ophalen…</div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="wsk-result">
        <div className="emoji">✨</div>
        <h2>Geen herhaling</h2>
        <div className="detail" style={{ marginTop: 8 }}>
          Maak eerst vragen. Foute antwoorden komen hier terecht.
        </div>
      </div>
    );
  }

  if (inSession) {
    const sessionRows = filter
      ? rows.filter(r => r.sub_topic === filter)
      : [...rows];

    return (
      <HerhalingSession
        initialRows={sessionRows}
        onDone={() => {
          loadRows();
          onBadgeChange();
          setInSession(false);
          setFilter(null);
        }}
        onBadgeChange={onBadgeChange}
      />
    );
  }

  // Group by category + sub_topic
  type Group = { key: string; label: string; count: number; sub_topic: string };
  const groups: Group[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    const key = `${r.category}__${r.sub_topic}`;
    if (!seen.has(key)) {
      seen.add(key);
      groups.push({
        key,
        label: SUB_TOPIC_LABELS[r.sub_topic] ?? r.sub_topic,
        count: rows.filter(x => x.sub_topic === r.sub_topic).length,
        sub_topic: r.sub_topic,
      });
    }
  }

  return (
    <>
      <div className="wsk-card" style={{ textAlign: 'center', marginBottom: 14 }}>
        <div className="sub-label">Te herhalen</div>
        <div style={{ fontSize: 40, fontWeight: 800, fontFamily: 'Outfit', color: C.orange }}>
          {rows.length}
        </div>
        <div style={{ fontSize: 13, color: C.textDim, marginTop: 4 }}>
          vragen nog open
        </div>
      </div>

      {groups.map(g => (
        <div key={g.key} className="wsk-her-group">
          <div className="gname">{g.label}</div>
          <div className="gcount">{g.count} 🔁</div>
          <button
            className="gpractice"
            onClick={() => { setFilter(g.sub_topic); setInSession(true); }}
          >
            Oefen
          </button>
        </div>
      ))}

      <button
        className="wsk-next"
        style={{ marginTop: 8 }}
        onClick={() => { setFilter(null); setInSession(true); }}
      >
        🔁 Start alles ({rows.length})
      </button>
    </>
  );
}

// ─── HERHALING SESSION ───────────────────────────────────────────────────────
function HerhalingSession({
  initialRows,
  onDone,
  onBadgeChange,
}: {
  initialRows: HerhalingRow[];
  onDone: () => void;
  onBadgeChange: () => void;
}) {
  const [localCounts, setLocalCounts] = useState<Record<string, number>>(
    () => Object.fromEntries(initialRows.map(r => [r.question_id, r.times_correct]))
  );
  const [graduated, setGraduated] = useState<Set<string>>(new Set());
  const [queue, setQueue] = useState<HerhalingRow[]>(() => shuffle([...initialRows]));
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [lastStatus, setLastStatus] = useState<'continued' | 'graduated' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = initialRows.filter(r => !graduated.has(r.question_id));

  // Advance to next non-graduated item
  const findNextQi = (from: number): number => {
    for (let i = from; i < queue.length; i++) {
      if (!graduated.has(queue[i].question_id)) return i;
    }
    return queue.length;
  };

  const effectiveQi = findNextQi(qi);
  const curRow = effectiveQi < queue.length ? queue[effectiveQi] : null;
  const curQ = curRow
    ? WISKUNDE_QUESTIONS.find(q => q.id === curRow.question_id)
    : null;

  useEffect(() => {
    if (curQ?.type === 'numeric_input' && !feedback && inputRef.current) {
      inputRef.current.focus();
    }
  }, [effectiveQi, feedback, curQ]);

  if (active.length === 0) {
    return (
      <div className="wsk-result">
        <div className="emoji">🏆</div>
        <h2>Alles gemeisterd!</h2>
        <div className="detail" style={{ marginTop: 8 }}>
          Je hebt alle vragen 2× goed beantwoord. Top!
        </div>
        <button className="wsk-next" style={{ marginTop: 20 }} onClick={onDone}>
          Terug
        </button>
      </div>
    );
  }

  if (!curRow) {
    // End of queue but still active items — reshuffle
    const remaining = initialRows.filter(r => !graduated.has(r.question_id));
    setQueue(shuffle(remaining));
    setQi(0);
    return null;
  }

  const handleAnswer = async (answer: string, isCorrect: boolean) => {
    if (feedback) return;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (curQ) await saveAttempt(curQ, answer, isCorrect);

    if (isCorrect) {
      const status = await progressHerhaling(curRow.question_id);
      setLastStatus(status);
      if (status === 'graduated') {
        setGraduated(prev => new Set([...prev, curRow.question_id]));
        fireConfetti();
        onBadgeChange();
      } else {
        setLocalCounts(prev => ({ ...prev, [curRow.question_id]: (prev[curRow.question_id] ?? 0) + 1 }));
      }
    } else {
      setLastStatus('continued');
      setLocalCounts(prev => ({ ...prev, [curRow.question_id]: 0 }));
      // Also upsert if we have the full question data
      if (curQ) await upsertHerhaling(curQ);
    }
  };

  const handleMC = (opt: string) => {
    if (feedback) return;
    setSelected(opt);
    const correct = curQ ? opt === curQ.correct_answer : opt === curRow.correct_answer;
    handleAnswer(opt, correct);
  };

  const handleNumeric = () => {
    if (!input.trim() || feedback) return;
    const correct = curQ
      ? checkNumeric(input, curQ.correct_answer, curQ.tolerance)
      : input.trim() === curRow.correct_answer;
    handleAnswer(input.trim(), correct);
  };

  const next = () => {
    setSelected(null);
    setInput('');
    setFeedback(null);
    setLastStatus(null);

    const nextQi = findNextQi(effectiveQi + 1);
    if (nextQi >= queue.length) {
      const remaining = initialRows.filter(r => !graduated.has(r.question_id));
      if (remaining.length === 0) {
        onDone();
      } else {
        setQueue(shuffle(remaining));
        setQi(0);
      }
    } else {
      setQi(nextQi);
    }
  };

  const remaining = active.length;
  const curCount = localCounts[curRow.question_id] ?? 0;
  const dots = '●'.repeat(Math.min(curCount, 2)) + '○'.repeat(Math.max(0, 2 - curCount));

  const topicLabel = SUB_TOPIC_LABELS[curRow.sub_topic] ?? curRow.sub_topic;

  // Fallback options for herhaling (no full question data)
  const options = curQ?.options ?? [];
  const isNumeric = curQ?.type === 'numeric_input';

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.orange }}>
          🔁 Nog {remaining} {remaining === 1 ? 'vraag' : 'vragen'}
        </span>
        <span className="wsk-streak-dots" style={{ color: C.textDim }}>
          {dots} {curCount}/2
        </span>
      </div>

      <div className="wsk-card">
        <div className="sub-label">{topicLabel}</div>
        <div className="question-text">{curRow.question_text}</div>
      </div>

      {!isNumeric && options.length > 0 && (
        <div className="wsk-choices">
          {options.map(opt => {
            const correctAns = curQ?.correct_answer ?? curRow.correct_answer;
            let cls = 'wsk-choice';
            if (feedback) {
              cls += ' locked';
              if (opt === correctAns) cls += ' correct';
              else if (opt === selected) cls += ' wrong';
            }
            return (
              <button key={opt} className={cls} onClick={() => handleMC(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {isNumeric && !feedback && (
        <div className="wsk-num-row">
          <input
            ref={inputRef}
            className="wsk-num-input"
            type="text"
            inputMode="decimal"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleNumeric(); }}
            placeholder="?"
          />
          <button
            className="wsk-check-btn"
            disabled={!input.trim()}
            onClick={handleNumeric}
          >
            Check
          </button>
        </div>
      )}

      {feedback && (
        <div className={`wsk-feedback ${feedback}`}>
          {feedback === 'correct' && lastStatus === 'graduated'
            ? '🎉 Goed gedaan! Verwijderd uit herhaling!'
            : feedback === 'correct'
            ? '✅ Nog 1x goed voor verwijdering'
            : `❌ Fout! Antwoord: ${curRow.correct_answer}`}
          {curQ?.explanation && (
            <div className="explanation">{curQ.explanation}</div>
          )}
        </div>
      )}

      {feedback && (
        <button className="wsk-next" onClick={next}>
          Volgende →
        </button>
      )}
    </>
  );
}

// ─── HOST DASHBOARD ──────────────────────────────────────────────────────────
function WiskundeHost() {
  type AttemptRow = {
    question_id: string;
    question_text: string;
    student_answer: string;
    correct_answer: string;
    is_correct: boolean;
    category: string;
    sub_topic: string;
    created_at: string;
  };

  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [herhaling, setHerhaling] = useState<HerhalingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = async () => {
    const [attRes, herRes] = await Promise.all([
      supabase
        .from('dnh_wiskunde_attempts')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase.from('dnh_wiskunde_herhaling').select('*').order('sub_topic'),
    ]);
    setAttempts((attRes.data as AttemptRow[]) ?? []);
    setHerhaling((herRes.data as HerhalingRow[]) ?? []);
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 10000);
    return () => clearInterval(iv);
  }, []);

  if (loading) {
    return (
      <div className="wsk-app">
        <div className="wsk-header"><h1>📐 Wiskunde Host</h1></div>
        <div className="wsk-card" style={{ textAlign: 'center' }}>
          <div className="question-text" style={{ fontSize: 15 }}>Laden…</div>
        </div>
      </div>
    );
  }

  const total = attempts.length;
  const correct = attempts.filter(a => a.is_correct).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Per sub_topic breakdown
  const subTopicKeys = [...new Set(attempts.map(a => a.sub_topic))];
  const breakdown = subTopicKeys.map(st => {
    const rows = attempts.filter(a => a.sub_topic === st);
    const ok = rows.filter(a => a.is_correct).length;
    return {
      st,
      label: SUB_TOPIC_LABELS[st] ?? st,
      total: rows.length,
      correct: ok,
      pct: Math.round((ok / rows.length) * 100),
    };
  }).sort((a, b) => a.label.localeCompare(b.label));

  // Wrong answers
  const wrongAnswers = attempts.filter(a => !a.is_correct);

  // Herhaling: unique question_ids that ever had a wrong answer
  const everWrong = new Set(attempts.filter(a => !a.is_correct).map(a => a.question_id));
  const stillInHerhaling = herhaling.length;
  const graduated = everWrong.size - stillInHerhaling;

  const fmt = (d: string) => new Date(d).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="wsk-app">
      <div className="wsk-header">
        <h1>📐 Wiskunde</h1>
        <p>Host-overzicht · ververst om {lastRefresh.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      {/* Summary stats */}
      <div className="wsk-host-section">
        <h3>📊 Totaal</h3>
        <div className="wsk-stat-grid">
          <div className="wsk-stat-box">
            <div className="sval">{total}</div>
            <div className="slabel">vragen gemaakt</div>
          </div>
          <div className="wsk-stat-box">
            <div className="sval" style={{ color: C.green }}>{correct}</div>
            <div className="slabel">goed</div>
          </div>
          <div className="wsk-stat-box">
            <div className="sval" style={{ color: pct >= 70 ? C.green : pct >= 50 ? C.orange : C.red }}>
              {pct}%
            </div>
            <div className="slabel">score</div>
          </div>
        </div>
      </div>

      {/* Per sub_topic */}
      {breakdown.length > 0 && (
        <div className="wsk-host-section">
          <h3>📂 Per onderwerp</h3>
          <table className="wsk-host-table">
            <thead>
              <tr>
                <th>Onderwerp</th>
                <th>Vragen</th>
                <th>Goed</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map(b => (
                <tr key={b.st}>
                  <td>{b.label}</td>
                  <td>{b.total}</td>
                  <td style={{ color: C.green }}>{b.correct}</td>
                  <td style={{ color: b.pct >= 70 ? C.green : b.pct >= 50 ? C.orange : C.red, fontWeight: 700 }}>
                    {b.pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Herhaling status */}
      <div className="wsk-host-section">
        <h3>🔁 Herhaling status</h3>
        <div className="wsk-stat-grid">
          <div className="wsk-stat-box">
            <div className="sval" style={{ color: C.orange }}>{stillInHerhaling}</div>
            <div className="slabel">nog open</div>
          </div>
          <div className="wsk-stat-box">
            <div className="sval" style={{ color: C.green }}>{graduated > 0 ? graduated : 0}</div>
            <div className="slabel">afgerond</div>
          </div>
          <div className="wsk-stat-box">
            <div className="sval">{everWrong.size}</div>
            <div className="slabel">ooit fout</div>
          </div>
        </div>
        {herhaling.length > 0 && (
          <table className="wsk-host-table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>Vraag</th>
                <th>Onderwerp</th>
                <th>✓ streak</th>
              </tr>
            </thead>
            <tbody>
              {herhaling.map(r => (
                <tr key={r.question_id}>
                  <td style={{ fontSize: 12, maxWidth: 200 }}>{r.question_text.slice(0, 60)}{r.question_text.length > 60 ? '…' : ''}</td>
                  <td style={{ fontSize: 12 }}>{SUB_TOPIC_LABELS[r.sub_topic] ?? r.sub_topic}</td>
                  <td style={{ textAlign: 'center' }}>{r.times_correct}/2</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Wrong answers list */}
      {wrongAnswers.length > 0 && (
        <div className="wsk-host-section">
          <h3>❌ Foute antwoorden ({wrongAnswers.length})</h3>
          <table className="wsk-host-table">
            <thead>
              <tr>
                <th>Vraag</th>
                <th>Gegeven</th>
                <th>Goed</th>
                <th>Tijd</th>
              </tr>
            </thead>
            <tbody>
              {wrongAnswers.slice(0, 50).map((a, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12, maxWidth: 160 }}>{a.question_text.slice(0, 50)}{a.question_text.length > 50 ? '…' : ''}</td>
                  <td style={{ color: C.red, fontSize: 12 }}>{a.student_answer}</td>
                  <td style={{ color: C.green, fontSize: 12 }}>{a.correct_answer}</td>
                  <td style={{ fontSize: 11, color: C.textDim }}>{fmt(a.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total === 0 && (
        <div className="wsk-result">
          <div className="emoji">📭</div>
          <h2>Nog geen pogingen</h2>
          <div className="detail" style={{ marginTop: 8 }}>Wacht tot Daniel begint met oefenen.</div>
        </div>
      )}
    </div>
  );
}

// ─── SAMENVATTING ────────────────────────────────────────────────────────────
function WiskundeSamenvatting() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ══ H8 FORMULES ══════════════════════════════════════════════ */}
      <div className="wsk-sam-chapter">📊 H8 — Formules</div>

      {/* ✅ ZEKER KENNEN */}
      <div className="wsk-sam-block green">
        <h3>✅ ZEKER KENNEN</h3>

        <p className="wsk-sam-subhead">Belangrijke begrippen</p>
        <ul className="wsk-sam-list">
          <li><strong>Begingetal</strong> = het getal ZONDER variabele. Waar de grafiek de y-as snijdt (bij x=0). In een tabel: de waarde onder de 0.</li>
          <li><strong>Stijggetal</strong> = hoeveel er PER STAP bijkomt. Grafiek gaat <em>OMHOOG</em>.</li>
          <li><strong>Daalgetal</strong> = hoeveel er PER STAP afgaat. Grafiek gaat <em>OMLAAG</em>.</li>
          <li><strong>Variabelen</strong> = de letters/woorden die veranderen (bijv. prijs en a, of tijd en afstand).</li>
        </ul>

        <p className="wsk-sam-subhead" style={{ marginTop: 14 }}>Formule herkennen</p>
        <div className="wsk-sam-example">
          inkomsten = 10 + 5t → begingetal = <strong>10</strong>, stijggetal = <strong>5</strong>, variabelen = inkomsten en t<br />
          tankinhoud = 140 − 0,8a → begingetal = <strong>140</strong>, daalgetal = <strong>0,8</strong>, variabelen = tankinhoud en a
        </div>

        <p className="wsk-sam-subhead" style={{ marginTop: 14 }}>Tabel invullen</p>
        <ul className="wsk-sam-list">
          <li>Vul de waarden van de variabele in de formule in.</li>
          <li>Voorbeeld: prijs = 12 + 3a, als a = 4 → prijs = 12 + 3×4 = <strong>24</strong></li>
        </ul>

        <p className="wsk-sam-subhead" style={{ marginTop: 14 }}>Formule maken bij een grafiek</p>
        <ol className="wsk-sam-steps">
          <li data-n="1.">Lees het <strong>begingetal</strong> af (waar de lijn de y-as raakt).</li>
          <li data-n="2.">Neem twee punten die je goed kunt aflezen.</li>
          <li data-n="3."><strong>Stijggetal</strong> = verschil y-waarden ÷ verschil x-waarden.</li>
          <li data-n="4.">Formule = begingetal + stijggetal × variabele.</li>
        </ol>

        <p className="wsk-sam-subhead" style={{ marginTop: 14 }}>Formule maken bij een tabel</p>
        <ol className="wsk-sam-steps">
          <li data-n="1."><strong>Begingetal</strong> = waarde bij 0.</li>
          <li data-n="2."><strong>Stijggetal</strong> = verschil tussen twee opeenvolgende waarden ÷ stap.</li>
          <li data-n="3.">Zet het in de formule.</li>
        </ol>

        <p className="wsk-sam-subhead" style={{ marginTop: 14 }}>Formule veranderen</p>
        <ul className="wsk-sam-list">
          <li><strong>Begingetal verandert?</strong> → tel op of trek af van het oude begingetal.</li>
          <li><strong>Stijg/daalgetal verandert?</strong> → tel op of trek af van het oude stijg/daalgetal.</li>
        </ul>
      </div>

      {/* 💡 TIPS */}
      <div className="wsk-sam-block orange">
        <h3>💡 TIPS &amp; EZELSBRUGGETJES</h3>
        <ul className="wsk-sam-list">
          <li><strong>"BeSTe Variabelen"</strong> → Begingetal, Stijg/daalgetal, Tabel, Variabelen — de 4 dingen die je moet herkennen.</li>
          <li><strong>Begingetal</strong> = "waar begin je?" → altijd bij de y-as (verticale as), altijd bij variabele = 0.</li>
          <li><strong>Stijggetal</strong> = "de helling van de lijn" → steiler = groter stijggetal.</li>
          <li><strong>Dalende lijn</strong> = MIN in de formule (bijv. 140 − 0,8a).</li>
          <li><strong>Stijgende lijn</strong> = PLUS in de formule (bijv. 12 + 3a).</li>
          <li>Bij tabel: kijk ALTIJD eerst naar het <strong>verschil</strong> tussen opeenvolgende getallen → dat is je stijg/daalgetal.</li>
          <li>Komma of punt maakt niet uit: 0,8 = 0.8 ✓</li>
        </ul>
      </div>

      {/* ══ H9 SYMMETRIE ══════════════════════════════════════════════ */}
      <div className="wsk-sam-chapter">📐 H9 — Symmetrie</div>

      {/* ✅ ZEKER KENNEN */}
      <div className="wsk-sam-block green">
        <h3>✅ ZEKER KENNEN</h3>

        <p className="wsk-sam-subhead">Lijnsymmetrie (spiegelen in een lijn)</p>
        <ul className="wsk-sam-list">
          <li>De figuur kun je vouwen langs de symmetrieas → twee gelijke helften.</li>
          <li>Spiegelbeeld heet <strong>A'B'C'</strong> (letters met accent).</li>
          <li>Elk punt ligt even ver van de spiegellijn, aan de <strong>andere kant</strong>.</li>
          <li>Gebruik: <strong>geodriehoek</strong> met loodlijn.</li>
        </ul>

        <p className="wsk-sam-subhead" style={{ marginTop: 14 }}>Puntsymmetrie (spiegelen in een punt)</p>
        <ul className="wsk-sam-list">
          <li>= Draaisymmetrie met draaihoek <strong>180°</strong>.</li>
          <li>Het punt heet het <strong>"punt van symmetrie"</strong> of "centrum".</li>
          <li>Trek een lijn van het punt door het centrum, zet dezelfde afstand aan de andere kant uit.</li>
        </ul>

        <p className="wsk-sam-subhead" style={{ marginTop: 14 }}>Vlakke figuren</p>
        <ul className="wsk-sam-list">
          <li><strong>Vierkant:</strong> 4 symmetrieassen, alle zijden gelijk, alle hoeken 90°.</li>
          <li><strong>Gelijkbenige driehoek:</strong> 1 symmetrieas, 2 gelijke zijden (benen), 2 gelijke basishoeken, 1 tophoek.</li>
        </ul>

        <p className="wsk-sam-subhead" style={{ marginTop: 14 }}>Hoeken berekenen</p>
        <ul className="wsk-sam-list">
          <li><strong>Overstaande hoeken</strong> = GELIJK (tegenover elkaar bij snijpunt).</li>
          <li><strong>Gestrekte hoek</strong> = 180° (twee hoeken naast elkaar op een lijn).</li>
          <li><strong>Evenwijdige lijnen + schuifsymmetrie:</strong> W₁ = V₄ (niet V₁!).</li>
          <li><strong>Hoekensom driehoek</strong> = 180°.</li>
          <li>ALTIJD de berekening + gebruikte regel opschrijven!</li>
        </ul>
      </div>

      {/* 💡 TIPS */}
      <div className="wsk-sam-block orange">
        <h3>💡 TIPS &amp; EZELSBRUGGETJES</h3>
        <ul className="wsk-sam-list">
          <li>🐘 <strong>"Overstaande hoeken = Olifanten zijn gelijk"</strong> — ze staan tegenOVER elkaar en zijn altijd gelijk.</li>
          <li><strong>Gestrekte hoek</strong> = denk aan een uitgestrekte arm = 180° (een rechte lijn).</li>
          <li>Bij hoeken berekenen: schrijf ALTIJD de regel erbij! "overstaande hoeken" of "gestrekte hoek = 180°" tussen haakjes.</li>
          <li><strong>Puntsymmetrie</strong> = "180° draaien" — draai je boek ondersteboven, ziet het er hetzelfde uit? Dan is het puntsymmetrisch.</li>
          <li><strong>Symmetrieassen tellen:</strong> vouw het in gedachten. Elke vouwlijn waar beide helften matchen = 1 symmetrieas.</li>
          <li><strong>Gelijkbenig</strong> = "gelijke benen" → de 2 schuine zijden zijn de benen, de onderkant is de basis.</li>
        </ul>
      </div>

      {/* ⚠️ VEELGEMAAKTE FOUTEN */}
      <div className="wsk-sam-block red">
        <h3>⚠️ VEELGEMAAKTE FOUTEN</h3>
        <ul className="wsk-sam-list">
          <li><strong>Begingetal en stijggetal omwisselen!</strong> → Begingetal staat ZONDER variabele, stijggetal staat VOOR de variabele.</li>
          <li><strong>Vergeten dat daalgetal positief is</strong> — de MIN zit al in de formule (140 − 0,8a → daalgetal = 0,8, niet −0,8).</li>
          <li><strong>Bij formule veranderen:</strong> het begingetal en stijggetal APART aanpassen, niet door elkaar.</li>
          <li><strong>Bij hoeken:</strong> W₁ = V₄ (niet V₁!) bij evenwijdige lijnen — de schuifsymmetrie verwisselt de positie.</li>
          <li><strong>Bij gelijkbenige driehoek:</strong> de BASISHOEKEN zijn gelijk (niet de tophoek en een basishoek).</li>
        </ul>
      </div>

    </div>
  );
}
