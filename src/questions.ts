export type Question = {
  prompt: string;
  options?: string[];
  answer: string;
  explanation?: string;
};

export type Subject = {
  id: string;
  title: string;
  questions: Question[];
};

export const subjects: Subject[] = [
  {
    id: "bio-h3",
    title: "Biologie — H3: Evolutie & Biodiversiteit",
    questions: [
      {
        prompt: "Wat is de beste definitie van een 'soort'?",
        options: [
          "A. Dieren die op elkaar lijken",
          "B. Organismen die samen vruchtbare nakomelingen kunnen krijgen",
          "C. Organismen die in hetzelfde gebied leven",
          "D. Planten en dieren met dezelfde kleur",
        ],
        answer: "B",
        explanation: "Een soort = organismen die samen vruchtbare nakomelingen kunnen krijgen.",
      },
      {
        prompt: "Waardoor zijn er zoveel verschillende soorten op aarde?",
        options: ["A. Door toeval", "B. Door evolutie en aanpassing aan de omgeving", "C. Mensen hebben ze gemaakt", "D. De aarde is groot"],
        answer: "B",
      },
      {
        prompt: "Wat betekent 'biodiversiteit'?",
        options: ["A. Aantal dieren in een dierentuin", "B. Verscheidenheid aan leven op aarde", "C. Hoeveel planten in een bos groeien", "D. Aantal mensen op aarde"],
        answer: "B",
      },
      {
        prompt: "Wie bedacht de theorie van natuurlijke selectie?",
        options: ["A. Einstein", "B. Newton", "C. Charles Darwin", "D. Mendel"],
        answer: "C",
      },
      {
        prompt: "Wat is een fossiel?",
        options: ["A. Een levend oud dier", "B. Versteende resten of afdruk van een organisme uit het verleden", "C. Een tekening van een dinosaurus", "D. Een steen met kleur"],
        answer: "B",
      },
      {
        prompt: "Een stamboom laat zien:",
        options: ["A. Hoe oud een boom is", "B. De familie van één persoon", "C. Hoe soorten met elkaar verwant zijn en zijn ontstaan", "D. Welke dieren in een bos leven"],
        answer: "C",
      },
      {
        prompt: "Leg in eigen woorden uit hoe natuurlijke selectie werkt. Gebruik het woord 'aanpassing'.",
        answer: "Organismen met een betere aanpassing aan hun omgeving overleven vaker en krijgen meer nakomelingen. Daardoor verandert de soort over generaties.",
      },
      {
        prompt: "Noem drie oorzaken waardoor een soort kan uitsterven.",
        answer: "Bijv: klimaatverandering, verlies van leefgebied, ziekte, te veel jagen door mensen, natuurramp.",
      },
      {
        prompt: "Hoe weten wetenschappers welke dieren vroeger op aarde leefden? Noem twee manieren.",
        answer: "Fossielen onderzoeken; vergelijken van DNA en lichaamsbouw met huidige soorten; aardlagen bestuderen.",
      },
      {
        prompt: "Op een eiland leven vogels met korte en lange snavels. Er groeien alleen bloemen met diepe kelken. Welke vogels overleven beter en wat gebeurt na vele generaties?",
        answer: "Vogels met lange snavels kunnen bij de nectar — die overleven en planten zich meer voort. Na veel generaties hebben bijna alle vogels lange snavels (natuurlijke selectie).",
      },
      {
        prompt: "Zet in volgorde (oudste → nieuwste): eerste mensen, dinosaurussen, eerste leven in de zee, eerste planten op het land.",
        answer: "1. Eerste leven in zee (bacteriën) → 2. Eerste planten op land → 3. Dinosaurussen → 4. Eerste mensen.",
      },
    ],
  },
];
