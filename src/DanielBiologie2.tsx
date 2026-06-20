import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from './lib/supabase';
import { BIO2_QUESTIONS, SUB_TOPIC_LABELS, type Bio2Question } from './biologie2-questions';

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  bg: '#0f1729',
  card: '#182340',
  cardHover: '#1e2d52',
  accent: '#22c55e',
  accentGlow: 'rgba(34,197,94,.25)',
  green: '#22c55e',
  greenGlow: 'rgba(34,197,94,.2)',
  red: '#ef4444',
  redGlow: 'rgba(239,68,68,.2)',
  orange: '#f59e0b',
  purple: '#a78bfa',
  teal: '#14b8a6',
  text: '#e2e8f0',
  textDim: '#94a3b8',
  textBright: '#f8fafc',
  border: '#2a3a5c',
};

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .b2-app { min-height: 100vh; max-width: 520px; margin: 0 auto; padding: 20px 16px 60px; }

  .b2-header { text-align: center; margin-bottom: 20px; padding-top: 12px; }
  .b2-header h1 {
    font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 800;
    background: linear-gradient(135deg, #22c55e, #14b8a6);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .b2-header p { color: ${C.textDim}; font-size: 13px; margin-top: 4px; }

  .b2-tabs-wrap {
    overflow-x: auto; -webkit-overflow-scrolling: touch;
    scrollbar-width: none; margin-bottom: 20px;
  }
  .b2-tabs-wrap::-webkit-scrollbar { display: none; }
  .b2-tabs {
    display: flex; gap: 4px; background: ${C.card}; border-radius: 14px;
    padding: 4px; min-width: max-content;
  }
  .b2-tab {
    padding: 10px 11px; border: none; border-radius: 10px;
    font-weight: 700; font-size: 11px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .2s; line-height: 1.25;
    color: ${C.textDim}; background: none; white-space: nowrap; text-align: center;
  }
  .b2-tab.active { background: ${C.accent}; color: #fff; }
  .b2-tab.active-sam { background: #10b981; color: #fff; }
  .b2-tab.active-her { background: ${C.orange}; color: #fff; }
  .b2-tab-badge {
    display: inline-block; background: rgba(255,255,255,.25);
    border-radius: 10px; padding: 1px 6px; font-size: 10px; margin-left: 3px;
  }

  .b2-start-card {
    background: ${C.card}; border: 1px solid ${C.border}; border-radius: 16px;
    padding: 28px 20px; text-align: center;
  }
  .b2-start-card .icon { font-size: 40px; margin-bottom: 10px; }
  .b2-start-card h2 { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; color: ${C.textBright}; }
  .b2-start-card .sub { font-size: 13px; color: ${C.textDim}; margin-top: 6px; }

  .b2-back { background: none; border: none; color: ${C.textDim}; font-size: 14px;
    font-weight: 500; cursor: pointer; padding: 8px 0; margin-bottom: 14px;
    font-family: 'DM Sans'; }
  .b2-back:hover { color: ${C.textBright}; }

  .b2-progress { width: 100%; height: 6px; background: rgba(255,255,255,.06);
    border-radius: 3px; margin-bottom: 14px; overflow: hidden; }
  .b2-progress-fill {
    height: 100%; border-radius: 3px; transition: width .4s ease;
    background: linear-gradient(90deg, ${C.accent}, ${C.teal});
  }

  .b2-score-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 14px; font-size: 13px; color: ${C.textDim}; font-weight: 500;
  }
  .b2-score-row .ok { color: ${C.green}; }
  .b2-score-row .bad { color: ${C.red}; }

  .b2-card {
    background: ${C.card}; border: 1px solid ${C.border}; border-radius: 16px;
    padding: 22px 18px; margin-bottom: 14px;
  }
  .b2-card .sub-label {
    font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
    color: ${C.textDim}; margin-bottom: 10px;
  }
  .b2-card .question-text {
    font-size: 16px; font-weight: 600; color: ${C.textBright}; line-height: 1.55;
  }

  .b2-choices { display: flex; flex-direction: column; gap: 8px; }
  .b2-choice {
    background: ${C.card}; border: 1.5px solid ${C.border}; border-radius: 12px;
    padding: 15px 16px; cursor: pointer; font-size: 14px; font-family: 'DM Sans';
    color: ${C.text}; text-align: left; transition: all .15s; font-weight: 500;
  }
  .b2-choice:hover:not(.locked) { background: ${C.cardHover}; border-color: ${C.accent}; }
  .b2-choice.correct { background: ${C.greenGlow}; border-color: ${C.green}; color: ${C.green}; }
  .b2-choice.wrong { background: ${C.redGlow}; border-color: ${C.red}; color: ${C.red}; }
  .b2-choice.locked { cursor: default; opacity: .6; }
  .b2-choice.locked.correct { opacity: 1; }

  .b2-feedback {
    margin-top: 12px; padding: 14px 16px; border-radius: 12px;
    font-size: 14px; font-weight: 600; line-height: 1.6;
  }
  .b2-feedback.correct {
    background: ${C.greenGlow}; color: ${C.green};
    border: 1px solid rgba(34,197,94,.25);
  }
  .b2-feedback.wrong {
    background: ${C.redGlow}; color: ${C.red};
    border: 1px solid rgba(239,68,68,.25);
  }
  .b2-feedback .explanation { color: ${C.textBright}; margin-top: 6px; font-weight: 500; font-size: 13px; }

  .b2-next {
    width: 100%; margin-top: 14px;
    background: linear-gradient(135deg, ${C.accent}, ${C.teal});
    border: none; border-radius: 12px; padding: 15px;
    color: white; font-size: 15px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans'; transition: opacity .2s;
  }
  .b2-next:hover { opacity: .9; }
  .b2-next.secondary {
    background: ${C.card}; border: 1px solid ${C.border}; margin-top: 10px;
  }

  .b2-result {
    background: ${C.card}; border: 1px solid ${C.border}; border-radius: 16px;
    padding: 32px 24px; text-align: center;
  }
  .b2-result .emoji { font-size: 48px; margin-bottom: 12px; }
  .b2-result h2 { font-family: 'Outfit'; font-size: 22px; font-weight: 700; color: ${C.textBright}; }
  .b2-result .pct { font-size: 40px; font-weight: 800; font-family: 'Outfit'; margin: 12px 0 4px; }
  .b2-result .pct.great { color: ${C.green}; }
  .b2-result .pct.ok { color: ${C.orange}; }
  .b2-result .pct.low { color: ${C.red}; }
  .b2-result .detail { font-size: 14px; color: ${C.textDim}; }

  .b2-her-group {
    display: flex; align-items: center; gap: 10px;
    background: ${C.card}; border: 1px solid ${C.border};
    border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; cursor: pointer;
    transition: all .2s;
  }
  .b2-her-group:hover { background: ${C.cardHover}; }
  .b2-her-group .gname { flex: 1; font-size: 14px; font-weight: 700; color: ${C.textBright}; }
  .b2-her-group .gcount { font-size: 13px; font-weight: 700; color: ${C.orange}; }
  .b2-her-group .gpractice {
    background: ${C.accent}; border: none; border-radius: 8px;
    padding: 6px 14px; color: white; font-size: 12px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans';
  }

  .b2-streak-dots { font-size: 18px; letter-spacing: 2px; }

  /* ── Samenvatting ──────────────────────────────────────────────── */
  .b2-sam-chapter {
    font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 800;
    color: ${C.textBright}; margin: 24px 0 12px; padding-bottom: 8px;
    border-bottom: 2px solid ${C.border};
  }
  .b2-sam-chapter:first-child { margin-top: 0; }
  .b2-sam-block {
    border-radius: 14px; padding: 16px 16px 12px; margin-bottom: 12px;
    border: 1px solid transparent;
  }
  .b2-sam-block.green { background: rgba(34,197,94,.08); border-color: rgba(34,197,94,.2); }
  .b2-sam-block.orange { background: rgba(245,158,11,.08); border-color: rgba(245,158,11,.2); }
  .b2-sam-block.red { background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.2); }
  .b2-sam-block h3 {
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 800;
    letter-spacing: .3px; margin-bottom: 12px;
  }
  .b2-sam-block.green h3 { color: ${C.green}; }
  .b2-sam-block.orange h3 { color: ${C.orange}; }
  .b2-sam-block.red h3 { color: ${C.red}; }
  .b2-sam-subhead {
    font-size: 13px; font-weight: 700; color: ${C.textBright};
    margin: 12px 0 6px;
  }
  .b2-sam-subhead:first-of-type { margin-top: 0; }
  .b2-sam-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
  .b2-sam-list li {
    font-size: 13px; color: ${C.text}; line-height: 1.55; padding-left: 16px;
    position: relative;
  }
  .b2-sam-list li::before { content: '•'; position: absolute; left: 0; color: ${C.textDim}; }
  .b2-sam-list li strong { color: ${C.textBright}; }
  .b2-sam-list li em { color: ${C.accent}; font-style: normal; }

  .b2-host-section {
    background: ${C.card}; border: 1px solid ${C.border}; border-radius: 14px;
    padding: 16px; margin-bottom: 14px;
  }
  .b2-host-section h3 {
    font-family: 'Outfit'; font-size: 15px; font-weight: 700;
    color: ${C.textBright}; margin-bottom: 12px;
  }
  .b2-stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .b2-stat-box {
    background: rgba(255,255,255,.04); border-radius: 10px; padding: 14px 10px; text-align: center;
  }
  .b2-stat-box .sval { font-size: 26px; font-weight: 800; font-family: 'Outfit'; color: ${C.textBright}; }
  .b2-stat-box .slabel { font-size: 11px; color: ${C.textDim}; margin-top: 3px; }
  .b2-host-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px; }
  .b2-host-table th {
    text-align: left; padding: 8px 10px; color: ${C.textDim};
    border-bottom: 1px solid ${C.border}; font-weight: 600; font-size: 12px;
  }
  .b2-host-table td {
    padding: 10px 10px; border-bottom: 1px solid rgba(42,58,92,.5);
    color: ${C.text}; vertical-align: top;
  }
  .b2-host-table tr:last-child td { border-bottom: none; }

  /* ── Question type filter ─────────────────────────────────────────── */
  .b2-type-filter {
    display: flex; gap: 6px; justify-content: center; margin: 14px 0 4px; flex-wrap: wrap;
  }
  .b2-type-btn {
    padding: 7px 16px; border: 1.5px solid ${C.border}; border-radius: 20px;
    background: none; color: ${C.textDim}; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans'; transition: all .15s;
  }
  .b2-type-btn.active { background: ${C.accent}; border-color: ${C.accent}; color: #fff; }

  /* ── Open question input ──────────────────────────────────────────── */
  .b2-open-input {
    width: 100%; background: rgba(255,255,255,.04); border: 1.5px solid ${C.border};
    border-radius: 12px; padding: 14px 16px; color: ${C.textBright}; font-size: 15px;
    font-family: 'DM Sans'; resize: vertical; min-height: 80px; margin-top: 14px;
    outline: none; transition: border-color .15s; line-height: 1.5;
  }
  .b2-open-input:focus { border-color: ${C.accent}; }
  .b2-open-input::placeholder { color: ${C.textDim}; }

  /* ── Answer comparison ────────────────────────────────────────────── */
  .b2-answer-compare {
    margin-top: 14px; padding: 16px; border-radius: 12px;
    background: rgba(255,255,255,.04); border: 1px solid ${C.border};
  }
  .b2-ac-label {
    font-size: 11px; font-weight: 700; color: ${C.textDim};
    letter-spacing: .5px; text-transform: uppercase; margin-bottom: 4px;
  }
  .b2-ac-val { font-size: 14px; color: ${C.textBright}; line-height: 1.55; font-weight: 500; }
  .b2-ac-correct { color: ${C.green}; }
  .b2-ac-expl { font-size: 13px; color: ${C.textDim}; margin-top: 10px; line-height: 1.55; }

  /* ── Self-evaluation buttons ──────────────────────────────────────── */
  .b2-self-eval { display: flex; gap: 8px; margin-top: 12px; }
  .b2-se-knew, .b2-se-didnt {
    flex: 1; padding: 14px; border-radius: 12px;
    font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans'; transition: all .15s;
  }
  .b2-se-knew { background: ${C.greenGlow}; color: ${C.green}; border: 1.5px solid ${C.green}; }
  .b2-se-knew:hover { background: rgba(34,197,94,.35); }
  .b2-se-didnt { background: ${C.redGlow}; color: ${C.red}; border: 1.5px solid ${C.red}; }
  .b2-se-didnt:hover { background: rgba(239,68,68,.35); }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fireConfetti() {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
}

async function saveAttempt(q: Bio2Question, answer: string, isCorrect: boolean) {
  const { error } = await supabase.from('dnh_bio2_attempts').insert({
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

async function upsertHerhaling(q: Bio2Question) {
  const { error } = await supabase.from('dnh_bio2_herhaling').upsert(
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
    .from('dnh_bio2_herhaling')
    .select('times_correct')
    .eq('question_id', questionId)
    .single();
  const next = (data?.times_correct ?? 0) + 1;
  if (next >= 2) {
    await supabase.from('dnh_bio2_herhaling').delete().eq('question_id', questionId);
    return 'graduated';
  }
  await supabase.from('dnh_bio2_herhaling').update({ times_correct: next }).eq('question_id', questionId);
  return 'continued';
}

async function fetchHerhalingCount(): Promise<number> {
  const { count } = await supabase
    .from('dnh_bio2_herhaling')
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
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

type TabId = '4.1' | '4.2' | '4.3' | '4.4' | '4.5' | '4.6' | '4.7' | 'samenvatting' | 'herhaling';

const TAB_SUB_TOPIC: Record<string, string> = {
  '4.1': 'fit_blijven',
  '4.2': 'spieren_pezen',
  '4.3': 'skelet',
  '4.4': 'botverbindingen',
  '4.5': 'blessures',
  '4.6': 'steunweefsels',
  '4.7': 'skeletten_vergelijken',
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DanielBiologie2({ isHost }: { isHost: boolean }) {
  const [tab, setTab] = useState<TabId>('4.1');
  const [herhalingCount, setHerhalingCount] = useState(0);

  const refreshCount = () => fetchHerhalingCount().then(setHerhalingCount);

  useEffect(() => { refreshCount(); }, []);

  if (isHost) {
    return (
      <>
        <style>{css}</style>
        <Bio2Host />
      </>
    );
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: '4.1', label: '4.1\nFit' },
    { id: '4.2', label: '4.2\nSpieren' },
    { id: '4.3', label: '4.3\nSkelet' },
    { id: '4.4', label: '4.4\nGewrichten' },
    { id: '4.5', label: '4.5\nBlessures' },
    { id: '4.6', label: '4.6\nWeefsel' },
    { id: '4.7', label: '4.7\nExtra' },
    { id: 'samenvatting', label: '📖\nSam.' },
    { id: 'herhaling', label: '🔁' + (herhalingCount > 0 ? ` ${herhalingCount}` : '') },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="b2-app">
        <div className="b2-header">
          <h1>🧬 Biologie H4</h1>
          <p>Bewegen · Hoofdstuk 4</p>
        </div>

        <div className="b2-tabs-wrap">
          <div className="b2-tabs">
            {tabs.map(t => {
              const isActive = tab === t.id;
              const cls = isActive
                ? t.id === 'samenvatting' ? 'b2-tab active-sam'
                : t.id === 'herhaling' ? 'b2-tab active-her'
                : 'b2-tab active'
                : 'b2-tab';
              return (
                <button key={t.id} className={cls} onClick={() => setTab(t.id)}
                  style={{ whiteSpace: 'pre-line' }}>
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {tab !== 'samenvatting' && tab !== 'herhaling' && (
          <Bio2Quiz
            key={tab}
            subTopic={TAB_SUB_TOPIC[tab]}
            tabLabel={SUB_TOPIC_LABELS[TAB_SUB_TOPIC[tab]]}
            onWrongAnswer={refreshCount}
          />
        )}
        {tab === 'herhaling' && (
          <Bio2Herhaling onBadgeChange={refreshCount} />
        )}
        {tab === 'samenvatting' && <Bio2Samenvatting />}
      </div>
    </>
  );
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
function Bio2Quiz({
  subTopic,
  tabLabel,
  onWrongAnswer,
}: {
  subTopic: string;
  tabLabel: string;
  onWrongAnswer: () => void;
}) {
  const allPool = BIO2_QUESTIONS.filter(q => q.sub_topic === subTopic);
  const [typeFilter, setTypeFilter] = useState<'all' | 'mc' | 'open'>('all');

  const hasMC = allPool.some(q => !q.type || q.type === 'multiple_choice');
  const hasOpen = allPool.some(q => q.type === 'open');

  const pool = typeFilter === 'mc'
    ? allPool.filter(q => !q.type || q.type === 'multiple_choice')
    : typeFilter === 'open'
    ? allPool.filter(q => q.type === 'open')
    : allPool;

  const [questions, setQuestions] = useState<Bio2Question[]>([]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [started, setStarted] = useState(false);
  const [openAnswer, setOpenAnswer] = useState('');
  const [openChecked, setOpenChecked] = useState(false);

  const startQuiz = () => {
    setQuestions(shuffle(pool));
    setQi(0);
    setSelected(null);
    setFeedback(null);
    setScore({ correct: 0, wrong: 0 });
    setOpenAnswer('');
    setOpenChecked(false);
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="b2-start-card">
        <div className="icon">🦴</div>
        <h2>{tabLabel}</h2>
        {hasMC && hasOpen && (
          <div className="b2-type-filter">
            {(['all', 'mc', 'open'] as const).map(f => (
              <button
                key={f}
                className={`b2-type-btn${typeFilter === f ? ' active' : ''}`}
                onClick={() => setTypeFilter(f)}
              >
                {f === 'all' ? 'Alles' : f === 'mc' ? 'MC' : 'Open vragen'}
              </button>
            ))}
          </div>
        )}
        <div className="sub">{pool.length} vragen</div>
        <button className="b2-next" style={{ marginTop: 20 }} onClick={startQuiz}>
          Start quiz →
        </button>
      </div>
    );
  }

  if (qi >= questions.length) {
    const total = questions.length;
    const pct = Math.round((score.correct / total) * 100);
    const cls = pct >= 80 ? 'great' : pct >= 55 ? 'ok' : 'low';
    return (
      <div className="b2-result">
        <div className="emoji">{pct >= 80 ? '🎉' : pct >= 55 ? '💪' : '📚'}</div>
        <h2>{pct >= 80 ? 'Geweldig!' : pct >= 55 ? 'Goed bezig!' : 'Blijven oefenen!'}</h2>
        <div className={`pct ${cls}`}>{pct}%</div>
        <div className="detail">{score.correct} / {total} goed</div>
        {score.wrong > 0 && (
          <div style={{ marginTop: 8, fontSize: 13, color: C.orange }}>
            {score.wrong} fout → toegevoegd aan 🔁 Herhaling
          </div>
        )}
        <button className="b2-next" style={{ marginTop: 20 }} onClick={() => setStarted(false)}>
          Terug naar menu
        </button>
        <button className="b2-next secondary" onClick={startQuiz}>
          Opnieuw proberen
        </button>
      </div>
    );
  }

  const cur = questions[qi];
  const isOpen = cur.type === 'open';

  const handleAnswer = async (opt: string) => {
    if (feedback) return;
    const isCorrect = opt === cur.correct_answer;
    setSelected(opt);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setScore(s => isCorrect ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });
    await saveAttempt(cur, opt, isCorrect);
    if (!isCorrect) {
      await upsertHerhaling(cur);
      onWrongAnswer();
    }
  };

  const handleOpenCheck = () => {
    if (openAnswer.trim()) setOpenChecked(true);
  };

  const handleSelfEval = async (knew: boolean) => {
    setFeedback(knew ? 'correct' : 'wrong');
    setScore(s => knew ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });
    await saveAttempt(cur, openAnswer, knew);
    if (!knew) {
      await upsertHerhaling(cur);
      onWrongAnswer();
    }
  };

  const next = () => {
    setQi(qi + 1);
    setSelected(null);
    setFeedback(null);
    setOpenAnswer('');
    setOpenChecked(false);
  };

  return (
    <>
      <div className="b2-progress">
        <div className="b2-progress-fill" style={{ width: `${(qi / questions.length) * 100}%` }} />
      </div>
      <div className="b2-score-row">
        <span>Vraag {qi + 1} van {questions.length}</span>
        <span>
          <span className="ok">✓ {score.correct}</span>
          {' · '}
          <span className="bad">✗ {score.wrong}</span>
        </span>
      </div>

      <div className="b2-card">
        <div className="sub-label">{SUB_TOPIC_LABELS[cur.sub_topic] ?? cur.sub_topic}</div>
        <div className="question-text">{cur.prompt}</div>
      </div>

      {isOpen ? (
        <>
          {!openChecked && (
            <>
              <textarea
                className="b2-open-input"
                value={openAnswer}
                onChange={e => setOpenAnswer(e.target.value)}
                placeholder="Typ je antwoord hier..."
              />
              <button
                className="b2-next"
                style={{ marginTop: 12 }}
                onClick={handleOpenCheck}
                disabled={!openAnswer.trim()}
              >
                Check →
              </button>
            </>
          )}
          {openChecked && !feedback && (
            <>
              <div className="b2-answer-compare">
                <div className="b2-ac-label">Jouw antwoord</div>
                <div className="b2-ac-val">{openAnswer || '—'}</div>
                <div className="b2-ac-label" style={{ marginTop: 10 }}>Correct antwoord</div>
                <div className="b2-ac-val b2-ac-correct">{cur.correct_answer}</div>
                {cur.explanation && <div className="b2-ac-expl">{cur.explanation}</div>}
              </div>
              <div className="b2-self-eval">
                <button className="b2-se-knew" onClick={() => handleSelfEval(true)}>✅ Wist ik</button>
                <button className="b2-se-didnt" onClick={() => handleSelfEval(false)}>❌ Wist ik niet</button>
              </div>
            </>
          )}
          {feedback && (
            <>
              <div className={`b2-feedback ${feedback}`}>
                {feedback === 'correct' ? '✅ Goed bijgehouden!' : '❌ Toegevoegd aan herhaling'}
                <div className="explanation">{cur.explanation}</div>
              </div>
              <button className="b2-next" onClick={next}>
                {qi + 1 < questions.length ? 'Volgende →' : 'Resultaat bekijken'}
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <div className="b2-choices">
            {(cur.options ?? []).map(opt => {
              let cls = 'b2-choice';
              if (feedback) {
                cls += ' locked';
                if (opt === cur.correct_answer) cls += ' correct';
                else if (opt === selected) cls += ' wrong';
              }
              return (
                <button key={opt} className={cls} onClick={() => handleAnswer(opt)}>
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`b2-feedback ${feedback}`}>
              {feedback === 'correct' ? '✅ Goed!' : `❌ Fout! Jouw antwoord: ${selected}`}
              <div className="explanation">{cur.explanation}</div>
            </div>
          )}

          {feedback && (
            <button className="b2-next" onClick={next}>
              {qi + 1 < questions.length ? 'Volgende →' : 'Resultaat bekijken'}
            </button>
          )}
        </>
      )}
    </>
  );
}

// ─── HERHALING ────────────────────────────────────────────────────────────────
function Bio2Herhaling({ onBadgeChange }: { onBadgeChange: () => void }) {
  const [rows, setRows] = useState<HerhalingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [inSession, setInSession] = useState(false);

  const loadRows = async () => {
    const { data } = await supabase
      .from('dnh_bio2_herhaling')
      .select('*')
      .order('sub_topic');
    setRows((data as HerhalingRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { loadRows(); }, []);

  if (loading) {
    return (
      <div className="b2-card" style={{ textAlign: 'center' }}>
        <div className="sub-label">Laden…</div>
        <div className="question-text" style={{ fontSize: 16 }}>Herhaling ophalen…</div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="b2-result">
        <div className="emoji">✨</div>
        <h2>Geen herhaling</h2>
        <div className="detail" style={{ marginTop: 8 }}>
          Maak eerst vragen. Foute antwoorden komen hier terecht.
        </div>
      </div>
    );
  }

  if (inSession) {
    const sessionRows = filter ? rows.filter(r => r.sub_topic === filter) : [...rows];
    return (
      <HerhalingSession
        initialRows={sessionRows}
        onDone={() => { loadRows(); onBadgeChange(); setInSession(false); setFilter(null); }}
        onBadgeChange={onBadgeChange}
      />
    );
  }

  type Group = { key: string; label: string; count: number; sub_topic: string };
  const groups: Group[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    if (!seen.has(r.sub_topic)) {
      seen.add(r.sub_topic);
      groups.push({
        key: r.sub_topic,
        label: SUB_TOPIC_LABELS[r.sub_topic] ?? r.sub_topic,
        count: rows.filter(x => x.sub_topic === r.sub_topic).length,
        sub_topic: r.sub_topic,
      });
    }
  }

  return (
    <>
      <div className="b2-card" style={{ textAlign: 'center', marginBottom: 14 }}>
        <div className="sub-label">Te herhalen</div>
        <div style={{ fontSize: 40, fontWeight: 800, fontFamily: 'Outfit', color: C.orange }}>
          {rows.length}
        </div>
        <div style={{ fontSize: 13, color: C.textDim, marginTop: 4 }}>vragen nog open</div>
      </div>

      {groups.map(g => (
        <div key={g.key} className="b2-her-group">
          <div className="gname">{g.label}</div>
          <div className="gcount">{g.count} 🔁</div>
          <button className="gpractice" onClick={() => { setFilter(g.sub_topic); setInSession(true); }}>
            Oefen
          </button>
        </div>
      ))}

      <button className="b2-next" style={{ marginTop: 8 }}
        onClick={() => { setFilter(null); setInSession(true); }}>
        🔁 Start alles ({rows.length})
      </button>
    </>
  );
}

// ─── HERHALING SESSION ────────────────────────────────────────────────────────
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
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [lastStatus, setLastStatus] = useState<'continued' | 'graduated' | null>(null);
  const [openAnswer, setOpenAnswer] = useState('');
  const [openChecked, setOpenChecked] = useState(false);

  const active = initialRows.filter(r => !graduated.has(r.question_id));

  const findNextQi = (from: number): number => {
    for (let i = from; i < queue.length; i++) {
      if (!graduated.has(queue[i].question_id)) return i;
    }
    return queue.length;
  };

  const effectiveQi = findNextQi(qi);
  const curRow = effectiveQi < queue.length ? queue[effectiveQi] : null;
  const curQ = curRow ? BIO2_QUESTIONS.find(q => q.id === curRow.question_id) : null;

  if (active.length === 0) {
    return (
      <div className="b2-result">
        <div className="emoji">🏆</div>
        <h2>Alles gemeisterd!</h2>
        <div className="detail" style={{ marginTop: 8 }}>
          Je hebt alle vragen 2× goed beantwoord. Top!
        </div>
        <button className="b2-next" style={{ marginTop: 20 }} onClick={onDone}>Terug</button>
      </div>
    );
  }

  if (!curRow) {
    const remaining = initialRows.filter(r => !graduated.has(r.question_id));
    setQueue(shuffle(remaining));
    setQi(0);
    return null;
  }

  const isOpen = curQ?.type === 'open';
  const options = !isOpen ? (curQ?.options ?? []) : [];

  const handleAnswer = async (opt: string) => {
    if (feedback) return;
    const isCorrect = opt === (curQ?.correct_answer ?? curRow.correct_answer);
    setSelected(opt);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (curQ) await saveAttempt(curQ, opt, isCorrect);

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
      if (curQ) await upsertHerhaling(curQ);
    }
  };

  const handleOpenCheck = () => {
    if (openAnswer.trim()) setOpenChecked(true);
  };

  const handleOpenSelfEval = async (knew: boolean) => {
    setFeedback(knew ? 'correct' : 'wrong');
    if (curQ) await saveAttempt(curQ, openAnswer, knew);

    if (knew) {
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
      if (curQ) await upsertHerhaling(curQ);
    }
  };

  const next = () => {
    setSelected(null);
    setFeedback(null);
    setLastStatus(null);
    setOpenAnswer('');
    setOpenChecked(false);
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

  const curCount = localCounts[curRow.question_id] ?? 0;
  const dots = '●'.repeat(Math.min(curCount, 2)) + '○'.repeat(Math.max(0, 2 - curCount));
  const topicLabel = SUB_TOPIC_LABELS[curRow.sub_topic] ?? curRow.sub_topic;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.orange }}>
          🔁 Nog {active.length} {active.length === 1 ? 'vraag' : 'vragen'}
        </span>
        <span className="b2-streak-dots" style={{ color: C.textDim }}>
          {dots} {curCount}/2
        </span>
      </div>

      <div className="b2-card">
        <div className="sub-label">{topicLabel}</div>
        <div className="question-text">{curRow.question_text}</div>
      </div>

      {isOpen ? (
        <>
          {!openChecked && !feedback && (
            <>
              <textarea
                className="b2-open-input"
                value={openAnswer}
                onChange={e => setOpenAnswer(e.target.value)}
                placeholder="Typ je antwoord hier..."
              />
              <button
                className="b2-next"
                style={{ marginTop: 12 }}
                onClick={handleOpenCheck}
                disabled={!openAnswer.trim()}
              >
                Check →
              </button>
            </>
          )}
          {openChecked && !feedback && (
            <>
              <div className="b2-answer-compare">
                <div className="b2-ac-label">Jouw antwoord</div>
                <div className="b2-ac-val">{openAnswer || '—'}</div>
                <div className="b2-ac-label" style={{ marginTop: 10 }}>Correct antwoord</div>
                <div className="b2-ac-val b2-ac-correct">{curRow.correct_answer}</div>
                {curQ?.explanation && <div className="b2-ac-expl">{curQ.explanation}</div>}
              </div>
              <div className="b2-self-eval">
                <button className="b2-se-knew" onClick={() => handleOpenSelfEval(true)}>✅ Wist ik</button>
                <button className="b2-se-didnt" onClick={() => handleOpenSelfEval(false)}>❌ Wist ik niet</button>
              </div>
            </>
          )}
          {feedback && (
            <div className={`b2-feedback ${feedback}`}>
              {feedback === 'correct' && lastStatus === 'graduated'
                ? '🎉 Goed gedaan! Verwijderd uit herhaling!'
                : feedback === 'correct'
                ? '✅ Nog 1x goed voor verwijdering'
                : '❌ Toegevoegd aan herhaling'}
              {curQ?.explanation && <div className="explanation">{curQ.explanation}</div>}
            </div>
          )}
        </>
      ) : (
        <>
          {options.length > 0 && (
            <div className="b2-choices">
              {options.map(opt => {
                const correctAns = curQ?.correct_answer ?? curRow.correct_answer;
                let cls = 'b2-choice';
                if (feedback) {
                  cls += ' locked';
                  if (opt === correctAns) cls += ' correct';
                  else if (opt === selected) cls += ' wrong';
                }
                return (
                  <button key={opt} className={cls} onClick={() => handleAnswer(opt)}>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
          {feedback && (
            <div className={`b2-feedback ${feedback}`}>
              {feedback === 'correct' && lastStatus === 'graduated'
                ? '🎉 Goed gedaan! Verwijderd uit herhaling!'
                : feedback === 'correct'
                ? '✅ Nog 1x goed voor verwijdering'
                : `❌ Fout! Antwoord: ${curRow.correct_answer}`}
              {curQ?.explanation && <div className="explanation">{curQ.explanation}</div>}
            </div>
          )}
        </>
      )}

      {feedback && (
        <button className="b2-next" onClick={next}>Volgende →</button>
      )}
    </>
  );
}

// ─── HOST DASHBOARD ───────────────────────────────────────────────────────────
function Bio2Host() {
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
      supabase.from('dnh_bio2_attempts').select('*').order('created_at', { ascending: false }),
      supabase.from('dnh_bio2_herhaling').select('*').order('sub_topic'),
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
      <div className="b2-app">
        <div className="b2-header"><h1>🧬 Bio H4 Host</h1></div>
        <div className="b2-card" style={{ textAlign: 'center' }}>
          <div className="question-text" style={{ fontSize: 15 }}>Laden…</div>
        </div>
      </div>
    );
  }

  const total = attempts.length;
  const correct = attempts.filter(a => a.is_correct).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

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

  const wrongAnswers = attempts.filter(a => !a.is_correct);
  const everWrong = new Set(attempts.filter(a => !a.is_correct).map(a => a.question_id));
  const stillInHerhaling = herhaling.length;
  const graduatedCount = everWrong.size - stillInHerhaling;
  const fmt = (d: string) => new Date(d).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="b2-app">
      <div className="b2-header">
        <h1>🧬 Bio H4</h1>
        <p>Host-overzicht · ververst om {lastRefresh.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <div className="b2-host-section">
        <h3>📊 Totaal</h3>
        <div className="b2-stat-grid">
          <div className="b2-stat-box">
            <div className="sval">{total}</div>
            <div className="slabel">vragen gemaakt</div>
          </div>
          <div className="b2-stat-box">
            <div className="sval" style={{ color: C.green }}>{correct}</div>
            <div className="slabel">goed</div>
          </div>
          <div className="b2-stat-box">
            <div className="sval" style={{ color: pct >= 70 ? C.green : pct >= 50 ? C.orange : C.red }}>
              {pct}%
            </div>
            <div className="slabel">score</div>
          </div>
        </div>
      </div>

      {breakdown.length > 0 && (
        <div className="b2-host-section">
          <h3>📂 Per onderwerp</h3>
          <table className="b2-host-table">
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

      <div className="b2-host-section">
        <h3>🔁 Herhaling status</h3>
        <div className="b2-stat-grid">
          <div className="b2-stat-box">
            <div className="sval" style={{ color: C.orange }}>{stillInHerhaling}</div>
            <div className="slabel">nog open</div>
          </div>
          <div className="b2-stat-box">
            <div className="sval" style={{ color: C.green }}>{graduatedCount > 0 ? graduatedCount : 0}</div>
            <div className="slabel">afgerond</div>
          </div>
          <div className="b2-stat-box">
            <div className="sval">{everWrong.size}</div>
            <div className="slabel">ooit fout</div>
          </div>
        </div>
        {herhaling.length > 0 && (
          <table className="b2-host-table" style={{ marginTop: 12 }}>
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
                  <td style={{ fontSize: 12, maxWidth: 200 }}>
                    {r.question_text.slice(0, 60)}{r.question_text.length > 60 ? '…' : ''}
                  </td>
                  <td style={{ fontSize: 12 }}>{SUB_TOPIC_LABELS[r.sub_topic] ?? r.sub_topic}</td>
                  <td style={{ textAlign: 'center' }}>{r.times_correct}/2</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {wrongAnswers.length > 0 && (
        <div className="b2-host-section">
          <h3>❌ Foute antwoorden ({wrongAnswers.length})</h3>
          <table className="b2-host-table">
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
                  <td style={{ fontSize: 12, maxWidth: 160 }}>
                    {a.question_text.slice(0, 50)}{a.question_text.length > 50 ? '…' : ''}
                  </td>
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
        <div className="b2-result">
          <div className="emoji">📭</div>
          <h2>Nog geen pogingen</h2>
          <div className="detail" style={{ marginTop: 8 }}>Wacht tot Daniel begint met oefenen.</div>
        </div>
      )}
    </div>
  );
}

// ─── SAMENVATTING ─────────────────────────────────────────────────────────────
function Bio2Samenvatting() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ✅ ZEKER KENNEN */}
      <div className="b2-sam-block green">
        <h3>✅ ZEKER KENNEN</h3>

        <p className="b2-sam-subhead">4.1 Fit blijven</p>
        <ul className="b2-sam-list">
          <li>Bewegen = <strong>botten + spieren + gewrichten</strong></li>
          <li>Door bewegen: spierkracht ↑, uithoudingsvermogen ↑, goed humeur</li>
          <li>Te weinig bewegen → lichamelijke gezondheid achteruit</li>
        </ul>

        <p className="b2-sam-subhead" style={{ marginTop: 14 }}>4.2 Spieren &amp; pezen</p>
        <ul className="b2-sam-list">
          <li>Opbouw: <strong>celkernen → spiervezels → spierbundels → spier</strong></li>
          <li>Biceps + triceps = <strong>antagonisten</strong> (tegengestelde bewegingen)</li>
          <li>Pezen verbinden <em>spieren</em> met <em>botten</em> (taai, sterk, trekken niet samen)</li>
          <li>Achillespees = kuitspier → hielbot</li>
          <li>3 soorten: <strong>skeletspieren</strong> (bewust) · <strong>gladde spieren</strong> (onbewust, onvermoeibaar) · <strong>hartspier</strong> (onbewust, onvermoeibaar)</li>
          <li>Langzame spiervezels = rood = langdurige inspanning | Snelle = wit/roze = korte krachtige inspanning</li>
        </ul>

        <p className="b2-sam-subhead" style={{ marginTop: 14 }}>4.3 Skelet</p>
        <ul className="b2-sam-list">
          <li><strong>206 botten</strong>, 4 functies: beweging · bescherming organen · stevigheid · rode bloedcellen aanmaken</li>
          <li>Schedel beschermt hersenen · borstkas beschermt hart + longen</li>
          <li>Wervelkolom: <strong>halswervels → borstwervels → lendenwervels → heiligbeen → staartbeen</strong>. Dubbele S-vorm = schokdemper</li>
          <li>Tussenwervelschijven = soepel bewegen</li>
          <li>Schoudergordel = 2 schouderbladen + 2 sleutelbeenderen</li>
          <li>Bekkengordel = 2 heupbeenderen + heiligbeen + staartbeen</li>
          <li><em>Ellepijp</em> = kant van de pink (P!) · <em>spaakbeen</em> = kant van de duim</li>
          <li>Elke vinger 3 kootjes (duim + grote teen: 2)</li>
        </ul>

        <p className="b2-sam-subhead" style={{ marginTop: 14 }}>4.4 Botverbindingen</p>
        <ul className="b2-sam-list">
          <li><strong>Kogelgewricht</strong> (schouder, heup) = alle richtingen</li>
          <li><strong>Scharniergewricht</strong> (knie, elleboog) = 2 richtingen (buigen/strekken)</li>
          <li><strong>Rolgewricht</strong> (bij elleboog) = hand draaien</li>
          <li>Onderdelen: gewrichtskom + gewrichtskop + kraakbeen + gewrichtssmeer + gewrichtskapsel + gewrichtsbanden</li>
          <li><strong>Kraakbeenverbinding</strong> = tussenwervelschijven (buigzaam)</li>
          <li><strong>Naadverbinding</strong> = schedel (geen beweging)</li>
          <li>Fontanellen = zachte plekken baby-schedel (dicht na 12-18 maanden)</li>
        </ul>

        <p className="b2-sam-subhead" style={{ marginTop: 14 }}>4.5 Blessures</p>
        <ul className="b2-sam-list">
          <li><strong>Kneuzing</strong> = blauwe plek → koelen 20 min</li>
          <li><strong>Verstuiking</strong> = banden/pezen gerekt, botten komen terug → koelen + rust</li>
          <li><strong>Ontwrichting</strong> = botten blijven verkeerd → arts moet terugzetten</li>
          <li><strong>Scheur</strong> = in spieren/pezen/banden → deskundige hulp</li>
          <li><strong>Botbreuk</strong> = pijn + zwelling + bloeduitstorting → ziekenhuis/gips</li>
          <li>Röntgenfoto = botten zien | MRI = zachte weefsels | Echo = geluid</li>
        </ul>

        <p className="b2-sam-subhead" style={{ marginTop: 14 }}>4.6 Steunweefsels</p>
        <ul className="b2-sam-list">
          <li><strong>Compact beenweefsel</strong> = harde buitenkant (bij pijpbeenderen)</li>
          <li><strong>Sponsachtig beenweefsel</strong> = in uiteinden + platte botten, bevat rood beenmerg</li>
          <li>Rood beenmerg = maakt rode bloedcellen</li>
          <li>Kalkstof = hardheid · lijmstof = buigzaamheid</li>
          <li>Jong = veel lijmstof (buigzaam) · oud = minder lijmstof (breekbaar)</li>
          <li><strong>Groeischijf</strong> = kraakbeenschijf die beencellen aanmaakt → uitgegroeid ≈ 21 jaar (jongens)</li>
          <li>Kraakbeen = geen bloedvaten, elastisch</li>
        </ul>

        <p className="b2-sam-subhead" style={{ marginTop: 14 }}>4.7 Skeletten vergelijken</p>
        <ul className="b2-sam-list">
          <li>Ongewerveld (geen skelet): kwallen, wormen, naaktslakken</li>
          <li>Exoskelet: weekdieren (<em>kalk</em>) · insecten (<em>chitine</em>) · kreeftachtigen (<em>kalk + chitine</em>)</li>
          <li>Inwendig skelet (gewerveld): vissen · amfibieën · reptielen · vogels · zoogdieren</li>
          <li>Hoefgangers (paard) = op teentop/hoef · Teengangers (hond) = op kootjes · Zoolgangers (mens, beer) = hele voetzool</li>
        </ul>
      </div>

      {/* 💡 TIPS */}
      <div className="b2-sam-block orange">
        <h3>💡 TIPS &amp; EZELSBRUGGETJES</h3>
        <ul className="b2-sam-list">
          <li><strong>"Ellepijp = Pink met een P"</strong> — ellepijp zit aan de pink-kant</li>
          <li><strong>Antagonisten = "ANTi"</strong> = tégen elkaar (biceps buigt, triceps strekt)</li>
          <li><strong>206 botten</strong> — denk aan het telefoonnummer dat je moet onthouden</li>
          <li><strong>Kogelgewricht</strong> = denk aan een joystick (alle richtingen). <strong>Scharniergewricht</strong> = denk aan een deur (alleen open/dicht)</li>
          <li><strong>Fontanellen</strong> = "fontein" = zachte plek waar je het bloed voelt kloppen bij een baby</li>
          <li><strong>Compact</strong> = "compact auto" = stevig, sterk. <strong>Sponsachtig</strong> = "spons" = vol gaatjes</li>
          <li><strong>"KOSR"</strong> voor blessures van licht naar zwaar: Kneuzing → Ontwrichting → Scheur → bReuk</li>
        </ul>
      </div>

      {/* ⚠️ VEELGEMAAKTE FOUTEN */}
      <div className="b2-sam-block red">
        <h3>⚠️ VEELGEMAAKTE FOUTEN</h3>
        <ul className="b2-sam-list">
          <li>Pezen verbinden spieren met <strong>BOTTEN</strong> (niet botten met botten — dat zijn gewrichtsbanden!)</li>
          <li>De neus is <strong>KRAAKBEEN</strong>, niet bot (alleen het neusbeen bovenaan is bot)</li>
          <li>Kraakbeen bevat <strong>GEEN bloedvaten</strong> (botten WEL)</li>
          <li>Gladde spieren zijn <strong>ONVERMOEIBAAR</strong>, skeletspieren NIET</li>
          <li>Onderkaak is het enige <strong>LOSSE</strong> bot van de schedel</li>
          <li>Tussenwervelschijf = kraakbeenVERBINDING (niet een gewricht)</li>
        </ul>
      </div>

    </div>
  );
}
