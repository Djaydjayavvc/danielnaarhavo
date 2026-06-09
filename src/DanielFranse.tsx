import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";

// ─── DATA ───────────────────────────────────────────────────────────
const VOCAB: Record<string, [string, string][]> = {
  A: [
    ["jouer de la batterie", "drummen"],
    ["jouer de la guitare", "gitaar spelen"],
    ["jouer du piano", "piano spelen"],
    ["jouer de la flute", "fluit spelen"],
    ["la musique", "de muziek"],
    ["tu peux", "jij kunt"],
    ["choisir", "kiezen"],
    ["commencer", "beginnen"],
    ["la fois", "de keer"],
    ["le jour", "de dag"],
    ["la semaine", "de week"],
    ["le mois", "de maand"],
    ["pendant", "tijdens"],
    ["bientôt", "gauw"],
    ["encore", "nog"],
    ["depuis", "sinds"],
  ],
  B: [
    ["faire de la natation", "zwemmen"],
    ["faire du basket", "basketballen"],
    ["faire du tennis", "tennissen"],
    ["faire de la danse", "dansen"],
    ["faire du foot", "voetballen"],
    ["faire du vélo", "wielrennen"],
    ["gagner", "winnen"],
    ["rester", "blijven"],
    ["l'équipe", "het team"],
    ["le match", "de wedstrijd"],
    ["la compétition", "de competitie"],
    ["l'entraînement", "de training"],
    ["le rêve", "de droom"],
    ["parce que", "omdat"],
    ["jusqu'à", "tot"],
    ["prochain(e)", "volgende"],
  ],
  E: [
    ["venir", "komen"],
    ["penser", "denken"],
    ["attendre", "wachten"],
    ["la solution", "de oplossing"],
    ["la porte", "de deur"],
    ["sans", "zonder"],
    ["dommage", "jammer"],
    ["dangereux", "gevaarlijk"],
    ["possible", "mogelijk"],
    ["important(e)", "belangrijk"],
    ["fou, folle", "gek"],
    ["bête", "stom"],
    ["donc", "dus"],
    ["selon", "volgens"],
    ["à la piscine", "naar het zwembad"],
    ["à la plage", "naar het strand"],
  ],
  F: [
    ["faire du théâtre", "toneelspelen"],
    ["l'expérience", "de ervaring"],
    ["le rendez-vous", "de afspraak"],
    ["la prison", "de gevangenis"],
    ["permis", "toegestaan"],
    ["montrer", "laten zien"],
    ["la chance", "de kans / het geluk"],
    ["chaque", "iedere / elke"],
    ["rêver", "dromen"],
    ["participer", "deelnemen"],
    ["demain", "morgen"],
    ["maintenant", "nu"],
    ["hier", "gisteren"],
    ["aujourd'hui", "vandaag"],
    ["ce matin", "vanmorgen"],
    ["cet après-midi", "vanmiddag"],
  ],
};

const PHRASES: [string, string][] = [
  ["Tu joues d'un instrument?", "Speel jij een muziekinstrument?"],
  ["Oui, je joue de la guitare.", "Ja, ik speel gitaar."],
  ["Tu fais du sport?", "Sport jij?"],
  ["Oui, je fais de la natation.", "Ja, ik zwem."],
  ["Je fais du foot deux fois par semaine.", "Ik voetbal twee keer per week."],
  ["Tu as un match quand?", "Wanneer heb je een wedstrijd?"],
  ["J'ai un match le samedi.", "Ik heb zaterdag een wedstrijd."],
  ["On va au cinéma?", "Gaan wij naar de bioscoop?"],
  ["Oui, d'accord.", "Ja, oké."],
  ["À quelle heure?", "Hoe laat?"],
  ["À trois heures.", "Om drie uur."],
  ["Qu'est-ce qu'on va faire ce weekend?", "Wat gaan wij dit weekend doen?"],
  ["Je ne sais pas.", "Ik weet het niet."],
  ["À tout à l'heure!", "Tot straks!"],
];

interface VerbData {
  label: string;
  present: Record<string, string>;
  passeCompose?: string;
  note?: string;
}

const VERBS: Record<string, VerbData> = {
  faire: {
    label: "Faire (doen/maken)",
    present: { je: "fais", tu: "fais", "il/elle/on": "fait", nous: "faisons", vous: "faites", "ils/elles": "font" },
    passeCompose: "j'ai fait",
    note: "Passé composé = avoir + fait",
  },
  être: {
    label: "Être (zijn)",
    present: { je: "suis", tu: "es", "il/elle/on": "est", nous: "sommes", vous: "êtes", "ils/elles": "sont" },
  },
  avoir: {
    label: "Avoir (hebben)",
    present: { je: "ai", tu: "as", "il/elle/on": "a", nous: "avons", vous: "avez", "ils/elles": "ont" },
  },
  aller: {
    label: "Aller (gaan)",
    present: { je: "vais", tu: "vas", "il/elle/on": "va", nous: "allons", vous: "allez", "ils/elles": "vont" },
  },
};

const ER_ENDINGS: Record<string, string> = {
  je: "-e",
  tu: "-es",
  "il/elle/on": "-e",
  nous: "-ons",
  vous: "-ez",
  "ils/elles": "-ent",
};

const CLOCK_TIMES = [
  // Hele uren
  { hour: 1, min: 0, answer: "une heure" },
  { hour: 3, min: 0, answer: "trois heures" },
  { hour: 7, min: 0, answer: "sept heures" },
  { hour: 11, min: 0, answer: "onze heures" },
  // Et quart (kwart over)
  { hour: 2, min: 15, answer: "deux heures et quart" },
  { hour: 4, min: 15, answer: "quatre heures et quart" },
  { hour: 9, min: 15, answer: "neuf heures et quart" },
  { hour: 12, min: 15, answer: "midi et quart" },
  { hour: 0, min: 15, answer: "minuit et quart" },
  // Et demie (half)
  { hour: 3, min: 30, answer: "trois heures et demie" },
  { hour: 5, min: 30, answer: "cinq heures et demie" },
  { hour: 10, min: 30, answer: "dix heures et demie" },
  { hour: 12, min: 30, answer: "midi et demie" },
  { hour: 0, min: 30, answer: "minuit et demie" },
  // Moins le quart (kwart voor)
  { hour: 4, min: 45, answer: "cinq heures moins le quart" },
  { hour: 6, min: 45, answer: "sept heures moins le quart" },
  { hour: 11, min: 45, answer: "midi moins le quart" },
  { hour: 12, min: 45, answer: "une heure moins le quart" },
  // Minuten erbij (rechts van 12)
  { hour: 1, min: 5, answer: "une heure cinq" },
  { hour: 5, min: 10, answer: "cinq heures dix" },
  { hour: 6, min: 20, answer: "six heures vingt" },
  { hour: 7, min: 25, answer: "sept heures vingt-cinq" },
  { hour: 8, min: 20, answer: "huit heures vingt" },
  // Moins minuten (links van 12)
  { hour: 2, min: 35, answer: "trois heures moins vingt-cinq" },
  { hour: 8, min: 35, answer: "neuf heures moins vingt-cinq" },
  { hour: 9, min: 40, answer: "dix heures moins vingt" },
  { hour: 10, min: 50, answer: "onze heures moins dix" },
  { hour: 6, min: 50, answer: "sept heures moins dix" },
  { hour: 11, min: 55, answer: "midi moins cinq" },
  // Midi en minuit met minuten
  { hour: 12, min: 0, answer: "midi" },
  { hour: 0, min: 0, answer: "minuit" },
  { hour: 12, min: 5, answer: "midi cinq" },
  { hour: 12, min: 10, answer: "midi dix" },
];

const WORD_ORDER_QS = [
  {
    q: "Hoe zeg je: 'Ik ga de wedstrijd winnen' in het Frans?",
    a: "Je vais gagner le match.",
    hint: "In het Frans staan werkwoorden altijd bij elkaar.",
  },
  {
    q: "Hoe zeg je: 'Morgen ga ik voetballen' in het Frans?",
    a: "Demain, je vais faire du foot.",
    hint: "De bepaling van tijd staat aan het begin of einde van de zin.",
  },
  {
    q: "Hoe zeg je: 'Ik heb zaterdag een wedstrijd' in het Frans?",
    a: "J'ai un match le samedi.",
    hint: "De bepaling van tijd staat aan het begin of einde.",
  },
  {
    q: "Hoe zeg je: 'Hij heeft een tekening gemaakt' in het Frans?",
    a: "Il a fait un dessin.",
    hint: "Passé composé van faire = avoir + fait.",
  },
];

type GrammarQ =
  | { type: "mc"; cat: string; question: string; answer: string; choices: string[] }
  | { type: "text"; cat: string; question: string; answer: string; hint?: string };

const GRAMMAR_QS: GrammarQ[] = [
  // ── Vul de juiste vorm in ──
  { type: "mc", cat: "Conjugatie", question: "Nous ___ au cinéma. (aller)", answer: "allons", choices: ["allons", "allez", "vont", "vais"] },
  { type: "mc", cat: "Conjugatie", question: "Je ___ mes devoirs. (faire)", answer: "fais", choices: ["fais", "fait", "font", "faites"] },
  { type: "mc", cat: "Conjugatie", question: "Il ___ content. (être)", answer: "est", choices: ["est", "suis", "es", "sont"] },
  { type: "mc", cat: "Conjugatie", question: "Tu ___ un frère? (avoir)", answer: "as", choices: ["as", "ai", "a", "avons"] },
  { type: "mc", cat: "Conjugatie", question: "Ils ___ du sport. (faire)", answer: "font", choices: ["font", "fait", "fais", "faisons"] },
  { type: "mc", cat: "Conjugatie", question: "Vous ___ en vacances? (aller)", answer: "allez", choices: ["allez", "allons", "vont", "vas"] },
  { type: "mc", cat: "Conjugatie", question: "Elle ___ intelligente. (être)", answer: "est", choices: ["est", "êtes", "sommes", "sont"] },
  { type: "mc", cat: "Conjugatie", question: "Nous ___ faim. (avoir)", answer: "avons", choices: ["avons", "avez", "ont", "ai"] },
  // ── Welke tijd is dit? ──
  { type: "mc", cat: "Welke tijd?", question: "\"Je joue de la guitare.\"", answer: "tegenwoordige tijd", choices: ["tegenwoordige tijd", "passé composé"] },
  { type: "mc", cat: "Welke tijd?", question: "\"Il a fait du sport.\"", answer: "passé composé", choices: ["tegenwoordige tijd", "passé composé"] },
  { type: "mc", cat: "Welke tijd?", question: "\"Nous allons au cinéma.\"", answer: "tegenwoordige tijd", choices: ["tegenwoordige tijd", "passé composé"] },
  { type: "mc", cat: "Welke tijd?", question: "\"Tu as joué au foot?\"", answer: "passé composé", choices: ["tegenwoordige tijd", "passé composé"] },
  { type: "mc", cat: "Welke tijd?", question: "\"Elle fait de la danse.\"", answer: "tegenwoordige tijd", choices: ["tegenwoordige tijd", "passé composé"] },
  { type: "mc", cat: "Welke tijd?", question: "\"Ils ont gagné le match.\"", answer: "passé composé", choices: ["tegenwoordige tijd", "passé composé"] },
  // ── Maak de passé composé ──
  { type: "text", cat: "Passé composé", question: "Maak passé composé: \"Je fais un dessin.\"", answer: "J'ai fait un dessin.", hint: "faire → avoir + fait. Let op apostrof: J'ai..." },
  { type: "text", cat: "Passé composé", question: "Maak passé composé: \"Il fait du basket.\"", answer: "Il a fait du basket.", hint: "il → avoir (a) + fait" },
  { type: "text", cat: "Passé composé", question: "Maak passé composé: \"Nous faisons du sport.\"", answer: "Nous avons fait du sport.", hint: "nous → avoir (avons) + fait" },
  // ── -er werkwoorden in context ──
  { type: "mc", cat: "-er werkwoorden", question: "Ils ___ à huit heures. (commencer)", answer: "commencent", choices: ["commencent", "commence", "commencez", "commençons"] },
  { type: "mc", cat: "-er werkwoorden", question: "Tu ___ le piano? (jouer)", answer: "joues", choices: ["joues", "joue", "jouez", "jouons"] },
  { type: "mc", cat: "-er werkwoorden", question: "Nous ___ le match. (gagner)", answer: "gagnons", choices: ["gagnons", "gagnez", "gagnent", "gagne"] },
  { type: "mc", cat: "-er werkwoorden", question: "Elle ___ à danser. (commencer)", answer: "commence", choices: ["commence", "commencent", "commencez", "commençons"] },
  { type: "mc", cat: "-er werkwoorden", question: "Vous ___ au foot? (jouer)", answer: "jouez", choices: ["jouez", "joue", "jouons", "jouent"] },
  // ── Fix de woordvolgorde ──
  { type: "text", cat: "Woordvolgorde", question: "Zet in de juiste volgorde: cinéma / au / je / vais", answer: "Je vais au cinéma.", hint: "Werkwoord volgt direct na het onderwerp." },
  { type: "text", cat: "Woordvolgorde", question: "Zet in de juiste volgorde: fait / il / un / dessin / a", answer: "Il a fait un dessin.", hint: "Passé composé: onderwerp + avoir + fait + rest." },
  { type: "text", cat: "Woordvolgorde", question: "Zet in de juiste volgorde: foot / du / faisons / nous", answer: "Nous faisons du foot.", hint: "Onderwerp + werkwoord + rest." },
  { type: "text", cat: "Woordvolgorde", question: "Zet in de juiste volgorde: demain / match / un / j'ai", answer: "J'ai un match demain.", hint: "Tijdsbepaling gaat naar het einde van de zin." },
];

// ─── HELPERS ────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickChoices(correct: string, allOptions: string[], count = 4): string[] {
  const others = allOptions.filter((o) => o !== correct);
  const picked = shuffle(others).slice(0, count - 1);
  return shuffle([correct, ...picked]);
}

async function saveAttempt(
  category: string,
  question: string,
  givenAnswer: string | null,
  correctAnswer: string,
  isCorrect: boolean
) {
  const { error } = await supabase.from("quiz_attempts").insert({
    subject: "frans",
    category,
    question,
    given_answer: givenAnswer,
    correct_answer: correctAnswer,
    is_correct: isCorrect,
  });
  if (error) console.error("saveAttempt failed:", error);
}

// ─── HERHALING TYPES & HELPERS ─────────────────────────────────────

interface HerhalingItem {
  category: string;
  question: string;
  correct_answer: string;
  currentStreak: number;
}

function herhalingKey(item: HerhalingItem): string {
  return `${item.question}|||${item.correct_answer}`;
}

function categoryLabel(cat: string): string {
  if (cat.startsWith("vocab_")) return "Vocab " + cat.slice(6);
  if (cat === "werkwoorden") return "Werkwoorden";
  if (cat === "kloktijden") return "Kloktijden";
  if (cat === "zinnen") return "Zinnen";
  if (cat === "woordvolgorde") return "Woordvolgorde";
  if (cat === "grammatica") return "Grammatica";
  return cat;
}

async function loadHerhalingData(): Promise<{ items: HerhalingItem[]; streaks: Record<string, number> }> {
  type Row = { category: string; question: string; correct_answer: string; is_correct: boolean };
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("category, question, correct_answer, is_correct")
    .eq("subject", "frans")
    .order("created_at", { ascending: true });
  if (error) { console.error("loadHerhalingData:", error); return { items: [], streaks: {} }; }

  const grouped = new Map<string, Row[]>();
  for (const a of (data ?? []) as Row[]) {
    const key = `${a.question}|||${a.correct_answer}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(a);
  }

  const items: HerhalingItem[] = [];
  const streaks: Record<string, number> = {};
  for (const attempts of grouped.values()) {
    if (!attempts.some(a => !a.is_correct)) continue;
    let streak = 0;
    for (let i = attempts.length - 1; i >= 0; i--) {
      if (attempts[i].is_correct) streak++;
      else break;
    }
    if (streak >= 3) continue;
    const orig = attempts.find(a => !a.category.startsWith("herhaling")) ?? attempts[0];
    const item: HerhalingItem = { category: orig.category, question: orig.question, correct_answer: orig.correct_answer, currentStreak: streak };
    items.push(item);
    streaks[herhalingKey(item)] = streak;
  }
  return { items, streaks };
}

function getHerhalingChoices(item: HerhalingItem, allItems: HerhalingItem[]): string[] {
  const pool: string[] = [...new Set(
    allItems.filter(i => i.category === item.category).map(i => i.correct_answer)
  )];
  if (pool.length < 4) {
    if (item.category.startsWith("vocab_")) {
      const s = item.category.slice(6);
      const pairs = VOCAB[s] ?? [];
      const isFrToNl = pairs.some(p => p[1] === item.correct_answer);
      for (const p of pairs) {
        const v = isFrToNl ? p[1] : p[0];
        if (!pool.includes(v)) pool.push(v);
      }
    } else if (item.category === "zinnen") {
      for (const p of PHRASES) { if (!pool.includes(p[1])) pool.push(p[1]); }
    } else if (item.category === "kloktijden") {
      for (const t of CLOCK_TIMES) { if (!pool.includes(t.answer)) pool.push(t.answer); }
    }
  }
  return pickChoices(item.correct_answer, pool);
}

// ─── CLOCK FACE COMPONENT ──────────────────────────────────────────
interface ClockFaceProps {
  hour: number;
  minute: number;
}

function ClockFace({ hour, minute }: ClockFaceProps) {
  const h = ((hour % 12) + minute / 60) * 30;
  const m = minute * 6;
  return (
    <svg viewBox="0 0 200 200" style={{ width: 160, height: 160 }}>
      <circle cx="100" cy="100" r="94" fill="#fefcf3" stroke="#1a2744" strokeWidth="3" />
      {[...Array(12)].map((_, i) => {
        const angle = ((i + 1) * 30 * Math.PI) / 180;
        const x = 100 + 76 * Math.sin(angle);
        const y = 100 - 76 * Math.cos(angle);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" style={{ fontSize: 14, fontWeight: 600, fill: "#1a2744", fontFamily: "'DM Sans'" }}>
            {i + 1}
          </text>
        );
      })}
      <line x1="100" y1="100" x2={100 + 48 * Math.sin((h * Math.PI) / 180)} y2={100 - 48 * Math.cos((h * Math.PI) / 180)} stroke="#1a2744" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="100" y1="100" x2={100 + 66 * Math.sin((m * Math.PI) / 180)} y2={100 - 66 * Math.cos((m * Math.PI) / 180)} stroke="#e8553d" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="4" fill="#1a2744" />
    </svg>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0f1729",
  card: "#182340",
  cardHover: "#1e2d52",
  accent: "#3b82f6",
  accentGlow: "rgba(59,130,246,.25)",
  green: "#22c55e",
  greenGlow: "rgba(34,197,94,.2)",
  red: "#ef4444",
  redGlow: "rgba(239,68,68,.2)",
  orange: "#f59e0b",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textBright: "#f8fafc",
  border: "#2a3a5c",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Outfit:wght@600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: 'DM Sans', sans-serif;
  }

  .app {
    min-height: 100vh;
    max-width: 520px;
    margin: 0 auto;
    padding: 20px 16px 40px;
  }

  .header {
    text-align: center;
    margin-bottom: 28px;
    padding-top: 12px;
  }
  .header h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 28px;
    font-weight: 800;
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }
  .header p {
    color: ${COLORS.textDim};
    font-size: 14px;
    margin-top: 4px;
  }
  .header .exam-badge {
    display: inline-block;
    margin-top: 8px;
    background: rgba(245,158,11,.15);
    color: ${COLORS.orange};
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid rgba(245,158,11,.25);
  }

  .menu-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 12px;
  }
  .menu-btn {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.border};
    border-radius: 14px;
    padding: 16px 12px;
    cursor: pointer;
    transition: all .2s;
    text-align: center;
  }
  .menu-btn:hover { background: ${COLORS.cardHover}; border-color: ${COLORS.accent}; }
  .menu-btn .icon { font-size: 26px; margin-bottom: 6px; }
  .menu-btn .label {
    font-size: 13px;
    font-weight: 600;
    color: ${COLORS.textBright};
    line-height: 1.3;
  }
  .menu-btn .sub {
    font-size: 11px;
    color: ${COLORS.textDim};
    margin-top: 2px;
  }
  .menu-btn.full { grid-column: 1 / -1; }

  .back-btn {
    background: none;
    border: none;
    color: ${COLORS.textDim};
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 0;
    margin-bottom: 12px;
    font-family: 'DM Sans';
  }
  .back-btn:hover { color: ${COLORS.textBright}; }

  .progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,.06);
    border-radius: 3px;
    margin-bottom: 16px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, ${COLORS.accent}, #a78bfa);
    border-radius: 3px;
    transition: width .4s ease;
  }

  .score-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    font-size: 13px;
    color: ${COLORS.textDim};
    font-weight: 500;
  }
  .score-row .correct { color: ${COLORS.green}; }
  .score-row .wrong { color: ${COLORS.red}; }

  .question-card {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    padding: 24px 20px;
    margin-bottom: 14px;
    text-align: center;
  }
  .question-card .direction {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${COLORS.textDim};
    margin-bottom: 10px;
  }
  .question-card .word {
    font-family: 'Outfit', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: ${COLORS.textBright};
    line-height: 1.3;
  }

  .choices {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .choice-btn {
    background: ${COLORS.card};
    border: 1.5px solid ${COLORS.border};
    border-radius: 12px;
    padding: 14px 16px;
    cursor: pointer;
    font-size: 15px;
    font-family: 'DM Sans';
    color: ${COLORS.text};
    text-align: left;
    transition: all .15s;
    font-weight: 500;
  }
  .choice-btn:hover:not(.locked) {
    background: ${COLORS.cardHover};
    border-color: ${COLORS.accent};
  }
  .choice-btn.correct {
    background: ${COLORS.greenGlow};
    border-color: ${COLORS.green};
    color: ${COLORS.green};
  }
  .choice-btn.wrong {
    background: ${COLORS.redGlow};
    border-color: ${COLORS.red};
    color: ${COLORS.red};
  }
  .choice-btn.locked { cursor: default; opacity: .6; }
  .choice-btn.locked.correct { opacity: 1; }

  .conjugation-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 12px;
  }
  .conj-cell {
    background: rgba(255,255,255,.04);
    border-radius: 10px;
    padding: 10px;
    text-align: center;
  }
  .conj-cell .pronoun {
    font-size: 11px;
    color: ${COLORS.textDim};
    text-transform: uppercase;
    letter-spacing: .5px;
  }
  .conj-cell .form {
    font-size: 16px;
    font-weight: 600;
    color: ${COLORS.textBright};
    margin-top: 2px;
  }

  .input-row {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }
  .text-input {
    flex: 1;
    background: rgba(255,255,255,.06);
    border: 1.5px solid ${COLORS.border};
    border-radius: 10px;
    padding: 12px 14px;
    color: ${COLORS.textBright};
    font-size: 15px;
    font-family: 'DM Sans';
    outline: none;
    transition: border-color .2s;
  }
  .text-input:focus { border-color: ${COLORS.accent}; }
  .submit-btn {
    background: ${COLORS.accent};
    border: none;
    border-radius: 10px;
    padding: 12px 18px;
    color: white;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    font-family: 'DM Sans';
    white-space: nowrap;
  }
  .submit-btn:disabled { opacity: .4; cursor: default; }

  .feedback {
    margin-top: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
  }
  .feedback.correct { background: ${COLORS.greenGlow}; color: ${COLORS.green}; border: 1px solid rgba(34,197,94,.2); }
  .feedback.wrong { background: ${COLORS.redGlow}; color: ${COLORS.red}; border: 1px solid rgba(239,68,68,.2); }
  .feedback .answer-line { color: ${COLORS.textBright}; margin-top: 4px; font-weight: 600; }

  .next-btn {
    width: 100%;
    margin-top: 14px;
    background: linear-gradient(135deg, ${COLORS.accent}, #7c3aed);
    border: none;
    border-radius: 12px;
    padding: 14px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans';
    transition: opacity .2s;
  }
  .next-btn:hover { opacity: .9; }

  .result-card {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
  }
  .result-card .emoji { font-size: 48px; margin-bottom: 12px; }
  .result-card h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: ${COLORS.textBright};
  }
  .result-card .score-text {
    font-size: 36px;
    font-weight: 800;
    font-family: 'Outfit';
    margin: 12px 0 4px;
  }
  .result-card .score-text.great { color: ${COLORS.green}; }
  .result-card .score-text.ok { color: ${COLORS.orange}; }
  .result-card .score-text.low { color: ${COLORS.red}; }
  .result-card .detail { font-size: 14px; color: ${COLORS.textDim}; }

  .clock-container { display: flex; justify-content: center; margin: 16px 0; }

  .section-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 14px;
  }
  .pill {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: 1.5px solid ${COLORS.border};
    background: ${COLORS.card};
    color: ${COLORS.textDim};
    font-family: 'DM Sans';
    transition: all .2s;
  }
  .pill.active {
    background: ${COLORS.accentGlow};
    border-color: ${COLORS.accent};
    color: ${COLORS.accent};
  }

  .hint-btn {
    background: none;
    border: none;
    color: ${COLORS.orange};
    font-size: 13px;
    cursor: pointer;
    margin-top: 8px;
    font-family: 'DM Sans';
    font-weight: 500;
  }
  .hint-text {
    font-size: 13px;
    color: ${COLORS.orange};
    margin-top: 6px;
    font-style: italic;
  }

  .study-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .study-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${COLORS.card};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 10px 14px;
    cursor: pointer;
    transition: all .2s;
  }
  .study-row:hover { background: ${COLORS.cardHover}; }
  .study-row .fr { font-weight: 600; color: ${COLORS.textBright}; font-size: 14px; }
  .study-row .nl { color: ${COLORS.textDim}; font-size: 13px; }
  .study-row .nl.show { color: ${COLORS.green}; }

  .summary-section {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 12px;
  }
  .summary-section h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: ${COLORS.textBright};
    margin-bottom: 14px;
  }
  .summary-rule {
    background: rgba(255,255,255,.04);
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 8px;
  }
  .summary-rule h3 {
    font-size: 14px;
    font-weight: 700;
    color: ${COLORS.accent};
    margin-bottom: 6px;
  }
  .summary-rule p {
    font-size: 13px;
    color: ${COLORS.text};
    line-height: 1.7;
  }
  .summary-tip {
    background: rgba(245,158,11,.1);
    border: 1px solid rgba(245,158,11,.2);
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 8px;
    font-size: 13px;
    color: ${COLORS.orange};
    line-height: 1.6;
  }
  .summary-example {
    background: rgba(59,130,246,.08);
    border: 1px solid rgba(59,130,246,.15);
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 8px;
    font-size: 13px;
    color: #93c5fd;
    line-height: 1.6;
  }
`;

// ─── MODES ──────────────────────────────────────────────────────────
const MODES = [
  { id: "vocab", icon: "📝", label: "Woordjes", sub: "A B E F" },
  { id: "verbs", icon: "🔤", label: "Werkwoorden", sub: "Faire · Être · Avoir · Aller" },
  { id: "clock", icon: "🕐", label: "Kloktijden", sub: "Hoe laat is het?" },
  { id: "phrases", icon: "💬", label: "Zinnen", sub: "Phrases-clés" },
  { id: "wordorder", icon: "🔀", label: "Woordvolgorde", sub: "Zinsbouw" },
  { id: "grammar", icon: "✏️", label: "Grammatica", sub: "Conjugaties · Tijden" },
  { id: "study", icon: "📖", label: "Overzicht", sub: "Alles bekijken" },
  { id: "samenvatting", icon: "📋", label: "Samenvatting", sub: "Ezelsbruggetjes & tips" },
];

const CATEGORY_MAP: Record<string, string[]> = {
  vocab: ["vocab_A", "vocab_B", "vocab_E", "vocab_F"],
  verbs: ["werkwoorden"],
  clock: ["kloktijden"],
  phrases: ["zinnen"],
  wordorder: ["woordvolgorde"],
  grammar: ["grammatica"],
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────
export default function DanielFranse() {
  const [mode, setMode] = useState<string | null>(null);
  const [herhalingItems, setHerhalingItems] = useState<HerhalingItem[]>([]);
  const [herhalingStreaks, setHerhalingStreaks] = useState<Record<string, number>>({});
  const [herhalingLoading, setHerhalingLoading] = useState(true);

  useEffect(() => {
    loadHerhalingData().then(({ items, streaks }) => {
      setHerhalingItems(items);
      setHerhalingStreaks(streaks);
      setHerhalingLoading(false);
    });
  }, []);

  const onHerhalingStreak = (key: string, newStreak: number) => {
    setHerhalingStreaks(prev => ({ ...prev, [key]: newStreak }));
  };

  const herhalingIsMastered = (key: string) => (herhalingStreaks[key] ?? 0) >= 3;
  const herhalingRemaining = herhalingItems.filter(item => !herhalingIsMastered(herhalingKey(item))).length;

  const modeCount = (modeId: string): number => {
    const cats = CATEGORY_MAP[modeId] ?? [];
    return herhalingItems.filter(item => cats.includes(item.category) && !herhalingIsMastered(herhalingKey(item))).length;
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <h1>🇫🇷 Chapitre 7</h1>
          <p>Grandes Lignes · Proefwerk</p>
          <div className="exam-badge">📅 Toets: 10 juni</div>
        </div>

        {!mode ? (
          <>
            <div
              className="menu-btn full"
              style={{
                marginBottom: 10,
                background: herhalingRemaining > 0 ? "rgba(245,158,11,.13)" : undefined,
                borderColor: herhalingRemaining > 0 ? COLORS.orange : undefined,
              }}
              onClick={() => setMode("herhaling")}
            >
              <div className="icon">🔁</div>
              <div className="label">Herhaling</div>
              <div className="sub">
                {herhalingLoading
                  ? "Laden…"
                  : herhalingRemaining > 0
                    ? `${herhalingRemaining} vragen te oefenen`
                    : "Geen openstaande vragen"}
              </div>
            </div>
            <div className="menu-grid">
              {MODES.map((m) => {
                const count = modeCount(m.id);
                const isFull = m.id === "study" || m.id === "samenvatting";
                return (
                  <div key={m.id} className={`menu-btn${isFull ? " full" : ""}`} onClick={() => setMode(m.id)}>
                    <div className="icon">{m.icon}</div>
                    <div className="label">{m.label}{count > 0 ? ` (${count} 🔁)` : ""}</div>
                    <div className="sub">{m.sub}</div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <button className="back-btn" onClick={() => setMode(null)}>← Terug naar menu</button>
            {mode === "vocab" && <VocabQuiz />}
            {mode === "verbs" && <VerbQuiz />}
            {mode === "clock" && <ClockQuiz />}
            {mode === "phrases" && <PhraseQuiz />}
            {mode === "wordorder" && <WordOrderQuiz />}
            {mode === "herhaling" && (
              <HerhalingQuiz
                allItems={herhalingItems}
                streaks={herhalingStreaks}
                loading={herhalingLoading}
                onStreak={onHerhalingStreak}
              />
            )}
            {mode === "grammar" && <GrammarQuiz />}
            {mode === "study" && <StudyOverview />}
            {mode === "samenvatting" && <Samenvatting />}
          </>
        )}
      </div>
    </>
  );
}

// ─── VOCAB QUIZ ─────────────────────────────────────────────────────
interface VocabQuestion {
  prompt: string;
  answer: string;
  choices: string[];
  section: string;
}

function VocabQuiz() {
  const [sections, setSections] = useState<string[]>(["A", "B", "E", "F"]);
  const [direction, setDirection] = useState("fr"); // fr→nl or nl→fr
  const [questions, setQuestions] = useState<VocabQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [started, setStarted] = useState(false);

  const start = () => {
    const pool = sections.flatMap((s) => VOCAB[s].map((pair) => ({ pair, section: s })));
    const allAnswers = pool.map(({ pair }) => (direction === "fr" ? pair[1] : pair[0]));
    const qs: VocabQuestion[] = shuffle(pool).map(({ pair, section }) => {
      const prompt = direction === "fr" ? pair[0] : pair[1];
      const answer = direction === "fr" ? pair[1] : pair[0];
      return { prompt, answer, choices: pickChoices(answer, allAnswers), section };
    });
    setQuestions(qs);
    setQi(0);
    setSelected(null);
    setScore({ correct: 0, wrong: 0 });
    setStarted(true);
  };

  const toggleSection = (s: string) => {
    setSections((prev) => (prev.includes(s) ? (prev.length > 1 ? prev.filter((x) => x !== s) : prev) : [...prev, s]));
  };

  if (!started) {
    return (
      <>
        <div className="question-card">
          <div className="direction">Kies secties</div>
          <div className="section-pills" style={{ justifyContent: "center", marginTop: 8 }}>
            {["A", "B", "E", "F"].map((s) => (
              <button key={s} className={`pill${sections.includes(s) ? " active" : ""}`} onClick={() => toggleSection(s)}>
                {s}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="direction">Richting</div>
            <div className="section-pills" style={{ justifyContent: "center", marginTop: 8 }}>
              <button className={`pill${direction === "fr" ? " active" : ""}`} onClick={() => setDirection("fr")}>Frans → NL</button>
              <button className={`pill${direction === "nl" ? " active" : ""}`} onClick={() => setDirection("nl")}>NL → Frans</button>
            </div>
          </div>
        </div>
        <button className="next-btn" onClick={start}>Start quiz ({sections.flatMap((s) => VOCAB[s]).length} woorden)</button>
      </>
    );
  }

  const cur = questions[qi];
  const done = qi >= questions.length;

  if (done) {
    const pct = Math.round((score.correct / questions.length) * 100);
    return (
      <div className="result-card">
        <div className="emoji">{pct >= 80 ? "🎉" : pct >= 55 ? "💪" : "📚"}</div>
        <h2>{pct >= 80 ? "Goed bezig!" : pct >= 55 ? "Bijna!" : "Nog even oefenen"}</h2>
        <div className={`score-text ${pct >= 80 ? "great" : pct >= 55 ? "ok" : "low"}`}>{pct}%</div>
        <div className="detail">{score.correct} / {questions.length} goed</div>
        <button className="next-btn" onClick={() => setStarted(false)} style={{ marginTop: 20 }}>Opnieuw</button>
      </div>
    );
  }

  const handleChoice = (c: string) => {
    if (selected) return;
    setSelected(c);
    const isCorrect = c === cur.answer;
    if (isCorrect) setScore((s) => ({ ...s, correct: s.correct + 1 }));
    else setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
    saveAttempt(`vocab_${cur.section}`, cur.prompt, c, cur.answer, isCorrect);
  };

  return (
    <>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${(qi / questions.length) * 100}%` }} /></div>
      <div className="score-row">
        <span>Vraag {qi + 1} / {questions.length}</span>
        <span><span className="correct">✓ {score.correct}</span> · <span className="wrong">✗ {score.wrong}</span></span>
      </div>
      <div className="question-card">
        <div className="direction">{direction === "fr" ? "Frans → Nederlands" : "Nederlands → Frans"}</div>
        <div className="word">{cur.prompt}</div>
      </div>
      <div className="choices">
        {cur.choices.map((c) => {
          let cls = "choice-btn";
          if (selected) {
            cls += " locked";
            if (c === cur.answer) cls += " correct";
            else if (c === selected) cls += " wrong";
          }
          return <button key={c} className={cls} onClick={() => handleChoice(c)}>{c}</button>;
        })}
      </div>
      {selected && <button className="next-btn" onClick={() => { setQi(qi + 1); setSelected(null); }}>Volgende →</button>}
    </>
  );
}

// ─── VERB QUIZ ──────────────────────────────────────────────────────
type VerbQuestion =
  | { type: "conjugate"; verb: string; label: string; pronoun: string; answer: string }
  | { type: "er"; pronoun: string; answer: string }
  | { type: "passe"; answer: string };

function VerbQuiz() {
  const pronouns = ["je", "tu", "il/elle/on", "nous", "vous", "ils/elles"];
  const verbKeys = Object.keys(VERBS);
  const [questions, setQuestions] = useState<VerbQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [started, setStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (started && inputRef.current) inputRef.current.focus();
  }, [qi, started]);

  const start = () => {
    const qs: VerbQuestion[] = [];
    // irregular verbs
    verbKeys.forEach((vk) => {
      const v = VERBS[vk];
      shuffle(pronouns).slice(0, 3).forEach((p) => {
        qs.push({ type: "conjugate", verb: vk, label: v.label, pronoun: p, answer: v.present[p] });
      });
    });
    // -er verb endings
    pronouns.forEach((p) => {
      qs.push({ type: "er", pronoun: p, answer: ER_ENDINGS[p] });
    });
    // passé composé faire
    qs.push({ type: "passe", answer: "j'ai fait" });
    setQuestions(shuffle(qs));
    setQi(0);
    setInput("");
    setFeedback(null);
    setScore({ correct: 0, wrong: 0 });
    setStarted(true);
  };

  if (!started) {
    return (
      <>
        <div className="question-card">
          <div className="direction">Werkwoorden overzicht</div>
          {verbKeys.map((vk) => {
            const v = VERBS[vk];
            return (
              <div key={vk} style={{ marginBottom: 16 }}>
                <div className="word" style={{ fontSize: 18, marginBottom: 8 }}>{v.label}</div>
                <div className="conjugation-grid">
                  {pronouns.map((p) => (
                    <div className="conj-cell" key={p}>
                      <div className="pronoun">{p}</div>
                      <div className="form">{v.present[p]}</div>
                    </div>
                  ))}
                </div>
                {v.passeCompose && (
                  <div style={{ marginTop: 8, fontSize: 13, color: COLORS.orange }}>Passé composé: {v.passeCompose} ({v.note})</div>
                )}
              </div>
            );
          })}
          <div style={{ marginTop: 12 }}>
            <div className="word" style={{ fontSize: 18, marginBottom: 8 }}>Werkwoorden op -er</div>
            <div className="conjugation-grid">
              {pronouns.map((p) => (
                <div className="conj-cell" key={p}>
                  <div className="pronoun">{p}</div>
                  <div className="form">{ER_ENDINGS[p]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="next-btn" onClick={start}>Start quiz ({4 * 3 + 6 + 1} vragen)</button>
      </>
    );
  }

  const done = qi >= questions.length;
  if (done) {
    const pct = Math.round((score.correct / questions.length) * 100);
    return (
      <div className="result-card">
        <div className="emoji">{pct >= 80 ? "🎉" : pct >= 55 ? "💪" : "📚"}</div>
        <h2>{pct >= 80 ? "Top!" : pct >= 55 ? "Goed bezig!" : "Oefen nog even"}</h2>
        <div className={`score-text ${pct >= 80 ? "great" : pct >= 55 ? "ok" : "low"}`}>{pct}%</div>
        <div className="detail">{score.correct} / {questions.length} goed</div>
        <button className="next-btn" onClick={() => setStarted(false)} style={{ marginTop: 20 }}>Opnieuw</button>
      </div>
    );
  }

  const cur = questions[qi];
  let prompt = "";
  if (cur.type === "conjugate") prompt = `${cur.label}: ${cur.pronoun} ...?`;
  else if (cur.type === "er") prompt = `Werkwoord op -er: ${cur.pronoun} → welke uitgang?`;
  else prompt = "Passé composé van 'faire' (ik heb gedaan)?";

  const check = () => {
    const ok = input.trim().toLowerCase() === cur.answer.toLowerCase();
    setFeedback(ok ? "correct" : "wrong");
    setScore((s) => ok ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });
    saveAttempt("werkwoorden", prompt, input.trim(), cur.answer, ok);
  };

  const next = () => {
    setQi(qi + 1);
    setInput("");
    setFeedback(null);
  };

  return (
    <>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${(qi / questions.length) * 100}%` }} /></div>
      <div className="score-row">
        <span>Vraag {qi + 1} / {questions.length}</span>
        <span><span className="correct">✓ {score.correct}</span> · <span className="wrong">✗ {score.wrong}</span></span>
      </div>
      <div className="question-card">
        <div className="direction">Werkwoorden</div>
        <div className="word" style={{ fontSize: 20 }}>{prompt}</div>
      </div>
      {!feedback && (
        <div className="input-row">
          <input ref={inputRef} className="text-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && input.trim() && check()} placeholder="Typ je antwoord..." />
          <button className="submit-btn" disabled={!input.trim()} onClick={check}>Check</button>
        </div>
      )}
      {feedback && (
        <>
          <div className={`feedback ${feedback}`}>
            {feedback === "correct" ? "✓ Goed!" : <>✗ Fout! <div className="answer-line">Antwoord: {cur.answer}</div></>}
          </div>
          <button className="next-btn" onClick={next}>Volgende →</button>
        </>
      )}
    </>
  );
}

// ─── CLOCK QUIZ ─────────────────────────────────────────────────────
interface ClockQuestion {
  hour: number;
  min: number;
  answer: string;
  choices: string[];
}

function ClockQuiz() {
  const [questions, setQuestions] = useState<ClockQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  useEffect(() => {
    const allAnswers = CLOCK_TIMES.map((t) => t.answer);
    const qs = shuffle(CLOCK_TIMES).map((t) => ({
      ...t,
      choices: pickChoices(t.answer, allAnswers),
    }));
    setQuestions(qs);
  }, []);

  if (!questions.length) return null;

  const done = qi >= questions.length;
  if (done) {
    const pct = Math.round((score.correct / questions.length) * 100);
    return (
      <div className="result-card">
        <div className="emoji">{pct >= 80 ? "🕐" : "⏰"}</div>
        <h2>{pct >= 80 ? "Kloktijden onder de knie!" : "Oefen de klok nog even"}</h2>
        <div className={`score-text ${pct >= 80 ? "great" : pct >= 55 ? "ok" : "low"}`}>{pct}%</div>
        <div className="detail">{score.correct} / {questions.length} goed</div>
        <button className="next-btn" onClick={() => { setQi(0); setSelected(null); setScore({ correct: 0, wrong: 0 }); setQuestions(shuffle([...questions])); }} style={{ marginTop: 20 }}>Opnieuw</button>
      </div>
    );
  }

  const cur = questions[qi];
  const handleChoice = (c: string) => {
    if (selected) return;
    setSelected(c);
    const isCorrect = c === cur.answer;
    if (isCorrect) setScore((s) => ({ ...s, correct: s.correct + 1 }));
    else setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
    saveAttempt("kloktijden", `${cur.hour}:${String(cur.min).padStart(2, "0")}`, c, cur.answer, isCorrect);
  };

  return (
    <>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${(qi / questions.length) * 100}%` }} /></div>
      <div className="score-row">
        <span>Vraag {qi + 1} / {questions.length}</span>
        <span><span className="correct">✓ {score.correct}</span> · <span className="wrong">✗ {score.wrong}</span></span>
      </div>
      <div className="question-card">
        <div className="direction">Hoe laat is het?</div>
        <div className="clock-container"><ClockFace hour={cur.hour} minute={cur.min} /></div>
        <div style={{ fontSize: 13, color: COLORS.textDim }}>{cur.hour}:{String(cur.min).padStart(2, "0")}</div>
      </div>
      <div className="choices">
        {cur.choices.map((c) => {
          let cls = "choice-btn";
          if (selected) {
            cls += " locked";
            if (c === cur.answer) cls += " correct";
            else if (c === selected) cls += " wrong";
          }
          return <button key={c} className={cls} onClick={() => handleChoice(c)}>{c}</button>;
        })}
      </div>
      {selected && <button className="next-btn" onClick={() => { setQi(qi + 1); setSelected(null); }}>Volgende →</button>}
    </>
  );
}

// ─── PHRASE QUIZ ────────────────────────────────────────────────────
interface PhraseQuestion {
  prompt: string;
  answer: string;
  choices: string[];
}

function PhraseQuiz() {
  const [questions, setQuestions] = useState<PhraseQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  useEffect(() => {
    const allNl = PHRASES.map((p) => p[1]);
    const qs = shuffle(PHRASES).map(([fr, nl]) => ({
      prompt: fr,
      answer: nl,
      choices: pickChoices(nl, allNl),
    }));
    setQuestions(qs);
  }, []);

  if (!questions.length) return null;

  const done = qi >= questions.length;
  if (done) {
    const pct = Math.round((score.correct / questions.length) * 100);
    return (
      <div className="result-card">
        <div className="emoji">{pct >= 80 ? "💬" : "🗣️"}</div>
        <h2>{pct >= 80 ? "Zinnen zitten erin!" : "Nog even herhalen"}</h2>
        <div className={`score-text ${pct >= 80 ? "great" : pct >= 55 ? "ok" : "low"}`}>{pct}%</div>
        <div className="detail">{score.correct} / {questions.length} goed</div>
        <button className="next-btn" onClick={() => { setQi(0); setSelected(null); setScore({ correct: 0, wrong: 0 }); setQuestions(shuffle([...questions])); }} style={{ marginTop: 20 }}>Opnieuw</button>
      </div>
    );
  }

  const cur = questions[qi];
  const handleChoice = (c: string) => {
    if (selected) return;
    setSelected(c);
    const isCorrect = c === cur.answer;
    if (isCorrect) setScore((s) => ({ ...s, correct: s.correct + 1 }));
    else setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
    saveAttempt("zinnen", cur.prompt, c, cur.answer, isCorrect);
  };

  return (
    <>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${(qi / questions.length) * 100}%` }} /></div>
      <div className="score-row">
        <span>Vraag {qi + 1} / {questions.length}</span>
        <span><span className="correct">✓ {score.correct}</span> · <span className="wrong">✗ {score.wrong}</span></span>
      </div>
      <div className="question-card">
        <div className="direction">Frans → Nederlands</div>
        <div className="word" style={{ fontSize: 18 }}>{cur.prompt}</div>
      </div>
      <div className="choices">
        {cur.choices.map((c) => {
          let cls = "choice-btn";
          if (selected) {
            cls += " locked";
            if (c === cur.answer) cls += " correct";
            else if (c === selected) cls += " wrong";
          }
          return <button key={c} className={cls} onClick={() => handleChoice(c)}>{c}</button>;
        })}
      </div>
      {selected && <button className="next-btn" onClick={() => { setQi(qi + 1); setSelected(null); }}>Volgende →</button>}
    </>
  );
}

// ─── WORD ORDER QUIZ ────────────────────────────────────────────────
function WordOrderQuiz() {
  const [qi, setQi] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, [qi]);

  const qs = WORD_ORDER_QS;
  const done = qi >= qs.length;

  if (done) {
    const pct = Math.round((score.correct / qs.length) * 100);
    return (
      <div className="result-card">
        <div className="emoji">🔀</div>
        <h2>{pct >= 75 ? "Woordvolgorde begrepen!" : "Herhaal de regels"}</h2>
        <div className={`score-text ${pct >= 75 ? "great" : "ok"}`}>{pct}%</div>
        <div className="detail">{score.correct} / {qs.length} goed</div>
        <button className="next-btn" onClick={() => { setQi(0); setInput(""); setFeedback(null); setShowHint(false); setScore({ correct: 0, wrong: 0 }); }} style={{ marginTop: 20 }}>Opnieuw</button>
      </div>
    );
  }

  const cur = qs[qi];
  const check = () => {
    const clean = (s: string) => s.toLowerCase().replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim();
    const ok = clean(input) === clean(cur.a);
    setFeedback(ok ? "correct" : "wrong");
    setScore((s) => ok ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });
    saveAttempt("woordvolgorde", cur.q, input.trim(), cur.a, ok);
  };
  const next = () => { setQi(qi + 1); setInput(""); setFeedback(null); setShowHint(false); };

  return (
    <>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${(qi / qs.length) * 100}%` }} /></div>
      <div className="score-row">
        <span>Vraag {qi + 1} / {qs.length}</span>
        <span><span className="correct">✓ {score.correct}</span> · <span className="wrong">✗ {score.wrong}</span></span>
      </div>
      <div className="question-card">
        <div className="direction">Woordvolgorde</div>
        <div className="word" style={{ fontSize: 17 }}>{cur.q}</div>
        {!showHint && !feedback && <button className="hint-btn" onClick={() => setShowHint(true)}>💡 Hint</button>}
        {showHint && <div className="hint-text">{cur.hint}</div>}
      </div>
      {!feedback && (
        <div className="input-row">
          <input ref={inputRef} className="text-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && input.trim() && check()} placeholder="Typ de Franse zin..." />
          <button className="submit-btn" disabled={!input.trim()} onClick={check}>Check</button>
        </div>
      )}
      {feedback && (
        <>
          <div className={`feedback ${feedback}`}>
            {feedback === "correct" ? "✓ Goed!" : <>✗ Niet helemaal. <div className="answer-line">{cur.a}</div></>}
          </div>
          <button className="next-btn" onClick={next}>Volgende →</button>
        </>
      )}
    </>
  );
}

// ─── HERHALING COMPONENTS ───────────────────────────────────────────

interface HerhalingQuizProps {
  allItems: HerhalingItem[];
  streaks: Record<string, number>;
  loading: boolean;
  onStreak: (key: string, newStreak: number) => void;
}

function HerhalingQuiz({ allItems, streaks, loading, onStreak }: HerhalingQuizProps) {
  const [view, setView] = useState<"entry" | "quiz">("entry");
  const [quizFilter, setQuizFilter] = useState<string | null>(null);

  const isMastered = (key: string) => (streaks[key] ?? 0) >= 3;
  const remaining = allItems.filter(item => !isMastered(herhalingKey(item)));

  if (loading) {
    return (
      <div className="question-card">
        <div className="direction">Laden…</div>
        <div className="word" style={{ fontSize: 18 }}>Herhaling ophalen</div>
      </div>
    );
  }

  if (view === "quiz") {
    const sessionItems = quizFilter
      ? allItems.filter(item => item.category === quizFilter && !isMastered(herhalingKey(item)))
      : remaining;
    return (
      <HerhalingSession
        items={sessionItems}
        allItems={allItems}
        streaks={streaks}
        onStreak={onStreak}
        onDone={() => setView("entry")}
      />
    );
  }

  return (
    <HerhalingEntry
      allItems={allItems}
      streaks={streaks}
      onStartAll={() => { setQuizFilter(null); setView("quiz"); }}
      onStartCategory={(cat) => { setQuizFilter(cat); setView("quiz"); }}
    />
  );
}

function HerhalingEntry({
  allItems,
  streaks,
  onStartAll,
  onStartCategory,
}: {
  allItems: HerhalingItem[];
  streaks: Record<string, number>;
  onStartAll: () => void;
  onStartCategory: (cat: string) => void;
}) {
  const isMastered = (key: string) => (streaks[key] ?? 0) >= 3;
  const remaining = allItems.filter(item => !isMastered(herhalingKey(item)));

  if (allItems.length === 0) {
    return (
      <div className="result-card">
        <div className="emoji">✨</div>
        <h2>Nog geen fouten!</h2>
        <div className="detail" style={{ marginTop: 8 }}>Maak eerst wat quizzen en kom dan hier terug.</div>
      </div>
    );
  }

  const CAT_ORDER = ["vocab_A", "vocab_B", "vocab_E", "vocab_F", "zinnen", "kloktijden", "werkwoorden", "woordvolgorde", "grammatica"];
  const catInfos: { cat: string; rem: number }[] = [];
  const seenCats = new Set<string>();

  for (const cat of CAT_ORDER) {
    const inCat = allItems.filter(item => item.category === cat);
    if (inCat.length === 0) continue;
    seenCats.add(cat);
    catInfos.push({ cat, rem: inCat.filter(item => !isMastered(herhalingKey(item))).length });
  }
  for (const item of allItems) {
    if (seenCats.has(item.category)) continue;
    seenCats.add(item.category);
    const inCat = allItems.filter(i => i.category === item.category);
    catInfos.push({ cat: item.category, rem: inCat.filter(i => !isMastered(herhalingKey(i))).length });
  }

  return (
    <>
      <div className="question-card" style={{ textAlign: "center", marginBottom: 12 }}>
        <div className="direction">Te herhalen</div>
        <div className="word">{remaining.length}</div>
        <div style={{ fontSize: 13, color: COLORS.textDim, marginTop: 4 }}>
          {remaining.length === 0
            ? "Alles gemeisterd! 🏆"
            : `van de ${allItems.length} vragen nog open`}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {catInfos.map(({ cat, rem }) => {
          const done = rem === 0;
          return (
            <div key={cat} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: done ? "rgba(34,197,94,.08)" : COLORS.card,
              border: `1px solid ${done ? COLORS.green : COLORS.border}`,
              borderRadius: 12, padding: "10px 14px",
            }}>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: COLORS.textBright }}>
                {categoryLabel(cat)}
              </span>
              {done ? (
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.green }}>✓ Klaar</span>
              ) : (
                <>
                  <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.orange, minWidth: 36, textAlign: "right" }}>
                    {rem} 🔁
                  </span>
                  <button
                    className="submit-btn"
                    style={{ padding: "6px 14px", fontSize: 12, borderRadius: 8, marginLeft: 4 }}
                    onClick={() => onStartCategory(cat)}
                  >
                    Oefen
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {remaining.length > 0 ? (
        <button className="next-btn" onClick={onStartAll}>
          🔁 Start alles ({remaining.length})
        </button>
      ) : (
        <div className="result-card">
          <div className="emoji">🏆</div>
          <h2>Alles gemeisterd!</h2>
          <div className="detail" style={{ marginTop: 8 }}>
            Je hebt alle vragen 3× achter elkaar goed. Geweldig!
          </div>
        </div>
      )}
    </>
  );
}

function HerhalingSession({
  items,
  allItems,
  streaks,
  onStreak,
  onDone,
}: {
  items: HerhalingItem[];
  allItems: HerhalingItem[];
  streaks: Record<string, number>;
  onStreak: (key: string, newStreak: number) => void;
  onDone: () => void;
}) {
  const [queue, setQueue] = useState<HerhalingItem[]>(() => shuffle([...items]));
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [localStreaks, setLocalStreaks] = useState<Record<string, number>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const getStreak = (key: string) => localStreaks[key] ?? streaks[key] ?? 0;
  const isMastered = (key: string) => getStreak(key) >= 3;
  const isTyped = (cat: string) => cat === "werkwoorden" || cat === "woordvolgorde" || cat === "grammatica";
  const remaining = items.filter(item => !isMastered(herhalingKey(item))).length;

  useEffect(() => {
    const cur = queue[qi];
    if (!feedback && cur && isTyped(cur.category) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [qi, feedback, queue]);

  const cur = queue[qi];
  if (!cur) return null;

  const typed = isTyped(cur.category);
  const choices = typed ? [] : getHerhalingChoices(cur, allItems);

  const submit = async (answer: string) => {
    if (feedback) return;
    const key = herhalingKey(cur);
    const ok = typed
      ? answer.toLowerCase().trim() === cur.correct_answer.toLowerCase().trim()
      : answer === cur.correct_answer;
    const newStreak = ok ? getStreak(key) + 1 : 0;
    setLocalStreaks(prev => ({ ...prev, [key]: newStreak }));
    onStreak(key, newStreak);
    setFeedback(ok ? "correct" : "wrong");
    await saveAttempt(cur.category, cur.question, answer, cur.correct_answer, ok);
  };

  const next = () => {
    setSelected(null);
    setInput("");
    setFeedback(null);

    let nextQi = qi + 1;
    while (nextQi < queue.length && isMastered(herhalingKey(queue[nextQi]))) nextQi++;

    if (nextQi >= queue.length) {
      const notMastered = items.filter(item => !isMastered(herhalingKey(item)));
      if (notMastered.length === 0) { onDone(); return; }
      const newQ = shuffle([...notMastered]);
      setQueue(newQ);
      setQi(0);
    } else {
      setQi(nextQi);
    }
  };

  const curStreak = getStreak(herhalingKey(cur));
  const dots = "●".repeat(Math.min(curStreak, 3)) + "○".repeat(Math.max(0, 3 - curStreak));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.orange }}>
          🔁 Nog {remaining} {remaining === 1 ? "vraag" : "vragen"}
        </span>
        <span style={{ fontSize: 14, color: COLORS.textDim, letterSpacing: 3 }}>
          {dots} {curStreak}/3
        </span>
      </div>

      <div className="question-card">
        <div className="direction">{categoryLabel(cur.category)}</div>
        <div className="word" style={{ fontSize: 20 }}>{cur.question}</div>
      </div>

      {!feedback && !typed && (
        <div className="choices">
          {choices.map(c => (
            <button
              key={c}
              className={`choice-btn${selected === c ? " selected" : ""}`}
              onClick={() => { if (!feedback) { setSelected(c); submit(c); } }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {!feedback && typed && (
        <div className="input-row">
          <input
            ref={inputRef}
            className="text-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && input.trim()) submit(input.trim()); }}
            placeholder="Typ je antwoord…"
          />
          <button className="submit-btn" disabled={!input.trim()} onClick={() => { if (input.trim()) submit(input.trim()); }}>Check</button>
        </div>
      )}

      {feedback && !typed && (
        <>
          <div className="choices">
            {choices.map(c => {
              let cls = "choice-btn locked";
              if (c === cur.correct_answer) cls += " correct";
              else if (c === selected) cls += " wrong";
              return <button key={c} className={cls}>{c}</button>;
            })}
          </div>
          <div className={`feedback ${feedback}`}>
            {feedback === "correct"
              ? <>{curStreak >= 3 ? "⭐ Gemeisterd!" : `✓ Goed! (${curStreak}/3 op rij)`}</>
              : <>✗ Fout! <div className="answer-line">{cur.correct_answer}</div></>}
          </div>
          <button className="next-btn" onClick={next}>Volgende →</button>
        </>
      )}

      {feedback && typed && (
        <>
          <div className={`feedback ${feedback}`}>
            {feedback === "correct"
              ? <>{curStreak >= 3 ? "⭐ Gemeisterd!" : `✓ Goed! (${curStreak}/3 op rij)`}</>
              : <>✗ Fout! <div className="answer-line">{cur.correct_answer}</div></>}
          </div>
          <button className="next-btn" onClick={next}>Volgende →</button>
        </>
      )}
    </>
  );
}

// ─── CLOCK HALVES SVG (for Samenvatting) ───────────────────────────
function ClockHalfsSVG() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: 150, height: 150, display: "block", margin: "0 auto 14px" }}>
      <circle cx="100" cy="100" r="94" fill="#0f1729" stroke="#2a3a5c" strokeWidth="2" />
      <path d="M 100 6 A 94 94 0 0 1 100 194 L 100 100 Z" fill="rgba(34,197,94,.14)" />
      <path d="M 100 6 A 94 94 0 0 0 100 194 L 100 100 Z" fill="rgba(245,158,11,.14)" />
      <line x1="100" y1="6" x2="100" y2="194" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" />
      {[...Array(12)].map((_, i) => {
        const angle = ((i + 1) * 30 * Math.PI) / 180;
        const x = 100 + 76 * Math.sin(angle);
        const y = 100 - 76 * Math.cos(angle);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: 13, fontWeight: 600, fill: "#e2e8f0", fontFamily: "'DM Sans'" }}>
            {i + 1}
          </text>
        );
      })}
      <text x="148" y="92" textAnchor="middle" style={{ fontSize: 9, fill: "#22c55e", fontWeight: 700, fontFamily: "'DM Sans'" }}>+min</text>
      <text x="52" y="92" textAnchor="middle" style={{ fontSize: 9, fill: "#f59e0b", fontWeight: 700, fontFamily: "'DM Sans'" }}>moins</text>
    </svg>
  );
}

// ─── GRAMMAR QUIZ ────────────────────────────────────────────────────
function GrammarQuiz() {
  const [questions, setQuestions] = useState<GrammarQ[]>([]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuestions(shuffle([...GRAMMAR_QS]));
  }, []);

  useEffect(() => {
    const cur = questions[qi];
    if (cur?.type === "text" && !feedback && inputRef.current) inputRef.current.focus();
  }, [qi, feedback, questions]);

  if (!questions.length) return null;

  const done = qi >= questions.length;
  if (done) {
    const pct = Math.round((score.correct / questions.length) * 100);
    return (
      <div className="result-card">
        <div className="emoji">{pct >= 80 ? "🎉" : pct >= 55 ? "💪" : "📚"}</div>
        <h2>{pct >= 80 ? "Grammatica top!" : pct >= 55 ? "Goed bezig!" : "Blijven oefenen!"}</h2>
        <div className={`score-text ${pct >= 80 ? "great" : pct >= 55 ? "ok" : "low"}`}>{pct}%</div>
        <div className="detail">{score.correct} / {questions.length} goed</div>
        <button className="next-btn" onClick={() => { setQuestions(shuffle([...GRAMMAR_QS])); setQi(0); setSelected(null); setInput(""); setFeedback(null); setShowHint(false); setScore({ correct: 0, wrong: 0 }); }} style={{ marginTop: 20 }}>Opnieuw</button>
      </div>
    );
  }

  const cur = questions[qi];

  const check = (answer: string) => {
    if (feedback) return;
    let ok: boolean;
    if (cur.type === "text") {
      const clean = (s: string) => s.toLowerCase().replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim();
      ok = clean(answer) === clean(cur.answer);
    } else {
      ok = answer === cur.answer;
    }
    setFeedback(ok ? "correct" : "wrong");
    if (ok) setScore(s => ({ ...s, correct: s.correct + 1 }));
    else setScore(s => ({ ...s, wrong: s.wrong + 1 }));
    if (cur.type === "mc") setSelected(answer);
    saveAttempt("grammatica", cur.question, answer, cur.answer, ok);
  };

  const next = () => { setQi(qi + 1); setSelected(null); setInput(""); setFeedback(null); setShowHint(false); };

  return (
    <>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${(qi / questions.length) * 100}%` }} /></div>
      <div className="score-row">
        <span>Vraag {qi + 1} / {questions.length}</span>
        <span><span className="correct">✓ {score.correct}</span> · <span className="wrong">✗ {score.wrong}</span></span>
      </div>
      <div className="question-card">
        <div className="direction">{cur.cat}</div>
        <div className="word" style={{ fontSize: cur.type === "mc" && cur.cat === "Welke tijd?" ? 17 : 18 }}>{cur.question}</div>
        {cur.type === "text" && !feedback && (
          <>
            {!showHint && cur.hint && <button className="hint-btn" onClick={() => setShowHint(true)}>💡 Hint</button>}
            {showHint && cur.hint && <div className="hint-text">{cur.hint}</div>}
          </>
        )}
      </div>
      {cur.type === "mc" && !feedback && (
        <div className="choices">
          {cur.choices.map(c => (
            <button key={c} className="choice-btn" onClick={() => check(c)}>{c}</button>
          ))}
        </div>
      )}
      {cur.type === "text" && !feedback && (
        <div className="input-row">
          <input ref={inputRef} className="text-input" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && input.trim()) check(input.trim()); }}
            placeholder="Typ je antwoord..." />
          <button className="submit-btn" disabled={!input.trim()} onClick={() => check(input.trim())}>Check</button>
        </div>
      )}
      {feedback && cur.type === "mc" && (
        <>
          <div className="choices">
            {cur.choices.map(c => {
              let cls = "choice-btn locked";
              if (c === cur.answer) cls += " correct";
              else if (c === selected) cls += " wrong";
              return <button key={c} className={cls}>{c}</button>;
            })}
          </div>
          <div className={`feedback ${feedback}`}>
            {feedback === "correct" ? "✓ Goed!" : <>✗ Fout! <div className="answer-line">{cur.answer}</div></>}
          </div>
          <button className="next-btn" onClick={next}>Volgende →</button>
        </>
      )}
      {feedback && cur.type === "text" && (
        <>
          <div className={`feedback ${feedback}`}>
            {feedback === "correct" ? "✓ Goed!" : <>✗ Fout! <div className="answer-line">{cur.answer}</div></>}
          </div>
          <button className="next-btn" onClick={next}>Volgende →</button>
        </>
      )}
    </>
  );
}

// ─── SAMENVATTING ────────────────────────────────────────────────────
function Samenvatting() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div className="summary-section">
        <h2>🕐 Kloktijden</h2>
        <ClockHalfsSVG />
        <div className="summary-tip">
          💡 <strong>Ezelsbruggetje:</strong><br />
          <strong>Rechts van 12</strong> = je TELT erbij op:<br />
          cinq → dix → et quart → vingt → vingt-cinq → et demie<br /><br />
          <strong>Links van 12</strong> = je TREKT eraf van het volgende uur:<br />
          moins vingt-cinq → moins vingt → moins le quart → moins dix → moins cinq
        </div>
        <div className="summary-rule">
          <h3>⭐ Speciale woorden</h3>
          <p>
            12:00 = <strong>midi</strong> (middag) &nbsp;·&nbsp; 0:00 = <strong>minuit</strong> (middernacht)<br />
            12:30 = <strong>midi et demie</strong> &nbsp;·&nbsp; 0:15 = <strong>minuit et quart</strong><br />
            12:45 = <strong>une heure moins le quart</strong> (het uur ná midi is 1)
          </p>
        </div>
        <div className="summary-example">
          <strong>Voorbeeld — hoe laat is 8:40?</strong><br />
          ➜ 40 minuten past 8 = 20 minuten VOOR 9<br />
          ➜ 8:40 = <strong>neuf heures moins vingt</strong>
        </div>
      </div>

      <div className="summary-section">
        <h2>✏️ Grammatica</h2>

        <div className="summary-rule">
          <h3>🔵 Faire (doen/maken)</h3>
          <p>
            je <strong>fais</strong> · tu <strong>fais</strong> (hetzelfde!) · il/elle <strong>fait</strong> (s weg)<br />
            nous <strong>faisons</strong> · vous <strong>faites</strong> · ils <strong>font</strong> (compleet anders!)
          </p>
        </div>
        <div className="summary-tip">
          💡 <strong>Passé composé van faire = avoir + fait, altijd!</strong><br />
          j'ai fait · tu as fait · il a fait · nous avons fait · vous avez fait · ils ont fait
        </div>

        <div className="summary-rule">
          <h3>🟢 Être (zijn)</h3>
          <p>
            je <strong>suis</strong> · tu <strong>es</strong> · il/elle <strong>est</strong><br />
            nous <strong>sommes</strong> · vous <strong>êtes</strong> · ils <strong>sont</strong><br />
            Tip: suis/es/est klinken als "swee / eh / eh" — de meervouden zijn compleet anders, gewoon stampen!
          </p>
        </div>

        <div className="summary-rule">
          <h3>🟡 Avoir (hebben)</h3>
          <p>
            j'<strong>ai</strong> · tu <strong>as</strong> · il/elle <strong>a</strong><br />
            nous <strong>avons</strong> · vous <strong>avez</strong> · ils <strong>ont</strong><br />
            Tip: ai/as/a = superkorte woordjes! De meervouden beginnen met av- (of ont voor ils).
          </p>
        </div>

        <div className="summary-rule">
          <h3>🔴 Aller (gaan)</h3>
          <p>
            je <strong>vais</strong> · tu <strong>vas</strong> · il/elle <strong>va</strong><br />
            nous <strong>allons</strong> · vous <strong>allez</strong> · ils <strong>vont</strong><br />
            Tip: vais/vas/va beginnen allemaal met <strong>VA</strong>. allons/allez beginnen met <strong>AL</strong>. vont = de uitzondering!
          </p>
        </div>

        <div className="summary-rule">
          <h3>📗 -er werkwoorden</h3>
          <p>
            Stam = woord zonder -er. Dan plak je:<br />
            je: <strong>-e</strong> · tu: <strong>-es</strong> · il/elle: <strong>-e</strong> &nbsp;(je/tu/il klinken <em>hetzelfde</em>!)<br />
            nous: <strong>-ons</strong> · vous: <strong>-ez</strong> · ils: <strong>-ent</strong> (klinkt als de stam, de -ent is stil)
          </p>
        </div>

        <div className="summary-tip">
          💡 <strong>Woordvolgorde:</strong> Werkwoorden staan in het Frans altijd <strong>naast elkaar</strong> (als buren).<br />
          Tijdsbepaling (morgen, zaterdag) gaat naar het <strong>BEGIN of EINDE</strong> van de zin, nooit ertussen.<br />
          ✅ <em>Demain, je vais faire du foot.</em> &nbsp; ✅ <em>Je vais faire du foot demain.</em>
        </div>
      </div>
    </div>
  );
}

// ─── STUDY OVERVIEW ─────────────────────────────────────────────────
function StudyOverview() {
  const [section, setSection] = useState("A");
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const toggle = (i: number) => setRevealed((r) => ({ ...r, [i]: !r[i] }));

  const allSections: Record<string, [string, string][]> = { ...VOCAB, Zinnen: PHRASES };

  return (
    <>
      <div className="section-pills">
        {["A", "B", "E", "F", "Zinnen"].map((s) => (
          <button key={s} className={`pill${section === s ? " active" : ""}`} onClick={() => { setSection(s); setRevealed({}); }}>{s}</button>
        ))}
      </div>
      <div className="study-list">
        {allSections[section].map(([fr, nl], i) => (
          <div key={i} className="study-row" onClick={() => toggle(i)}>
            <span className="fr">{fr}</span>
            <span className={`nl${revealed[i] ? " show" : ""}`}>{revealed[i] ? nl : "Tik om te zien"}</span>
          </div>
        ))}
      </div>
    </>
  );
}
