export type Question = {
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
};

export type Subject = {
  id: string;
  title: string;
  questions: Question[];
};

export const subjects: Subject[] = [
  {
    id: "bio-3.1",
    title: "3.1 — Waardoor zoveel soorten",
    questions: [
      {
        prompt: "Wat is de beste definitie van een 'soort'?",
        options: [
          "A. Dieren die op elkaar lijken",
          "B. Organismen die samen vruchtbare nakomelingen kunnen krijgen",
          "C. Organismen die in hetzelfde gebied leven",
          "D. Planten en dieren met dezelfde kleur"
        ],
        answer: "B",
        explanation: "Een soort = groep organismen die met elkaar vruchtbare nakomelingen kunnen krijgen. Een paard en ezel krijgen samen een muilezel, maar die is onvruchtbaar — dus zijn het twee verschillende soorten."
      },
      {
        prompt: "Waarom zijn er zoveel verschillende soorten op aarde?",
        options: [
          "A. Door toeval",
          "B. Door evolutie en aanpassing aan verschillende omgevingen",
          "C. Mensen hebben ze gemaakt",
          "D. Omdat de aarde groot is"
        ],
        answer: "B",
        explanation: "Verschillende omgevingen (zee, woestijn, tropisch bos) vragen verschillende aanpassingen. Over miljoenen jaren ontstaan zo veel soorten via evolutie."
      },
      {
        prompt: "In welke groepen (rijken) worden organismen ingedeeld?",
        answer: "Planten, dieren, schimmels, bacteriën en protisten (eencelligen).",
        explanation: "Wetenschappers delen alle leven in 5 rijken in op basis van bouw en eigenschappen. Elk rijk wordt verder verdeeld in soorten."
      },
      {
        prompt: "Waarom zijn een paard en een ezel niet dezelfde soort, ook al lijken ze veel op elkaar?",
        answer: "Omdat hun nakomeling (muilezel) onvruchtbaar is — ze kunnen samen geen vruchtbare nakomelingen krijgen.",
        explanation: "De definitie van soort hangt af van of de nakomelingen zélf weer jongen kunnen krijgen. Muilezels kunnen dat niet, dus paard en ezel blijven twee aparte soorten."
      }
    ]
  },
  {
    id: "bio-3.2",
    title: "3.2 — Biodiversiteit",
    questions: [
      {
        prompt: "Wat betekent 'biodiversiteit'?",
        options: [
          "A. Aantal dieren in een dierentuin",
          "B. Verscheidenheid aan leven op aarde",
          "C. Hoeveel planten in een bos groeien",
          "D. Aantal mensen op aarde"
        ],
        answer: "B",
        explanation: "Biodiversiteit = de variatie aan soorten, genen en ecosystemen op aarde. Hoe meer verschillende soorten, hoe hoger de biodiversiteit."
      },
      {
        prompt: "Welke gebieden hebben de hoogste biodiversiteit?",
        options: [
          "A. Woestijnen en poolgebieden",
          "B. Tropische regenwouden en koraalriffen",
          "C. Steden",
          "D. Akkers en weilanden"
        ],
        answer: "B",
        explanation: "Tropische regenwouden en koraalriffen herbergen miljoenen soorten dankzij het warme klimaat en de stabiele omstandigheden."
      },
      {
        prompt: "Noem twee redenen waarom biodiversiteit belangrijk is.",
        answer: "Bijv: planten leveren medicijnen, zuurstof en voedsel; soorten houden ecosystemen in evenwicht; bestuiving (bijen) is nodig voor onze voedselproductie; verlies van één soort kan een hele voedselketen verstoren.",
        explanation: "Biodiversiteit is als een puzzel — elke soort heeft een rol. Hoe meer soorten, hoe stabieler en gezonder een ecosysteem."
      },
      {
        prompt: "Noem drie bedreigingen voor biodiversiteit.",
        answer: "Bijv: ontbossing, klimaatverandering, vervuiling, overbevissing, jacht, verlies van leefgebied door bebouwing, invasieve soorten.",
        explanation: "De meeste bedreigingen worden veroorzaakt door menselijk handelen. Daarom heet de huidige periode soms het 'antropoceen'."
      }
    ]
  },
  {
    id: "bio-3.3",
    title: "3.3 — Evolutie",
    questions: [
      {
        prompt: "Wie bedacht de theorie van evolutie door natuurlijke selectie?",
        options: ["A. Einstein", "B. Newton", "C. Charles Darwin", "D. Mendel"],
        answer: "C",
        explanation: "Charles Darwin publiceerde in 1859 'On the Origin of Species' na zijn reis met de Beagle, waarin hij vinken op de Galápagos-eilanden bestudeerde."
      },
      {
        prompt: "Leg in eigen woorden uit hoe natuurlijke selectie werkt. Gebruik het woord 'aanpassing'.",
        answer: "Binnen een soort zijn er kleine verschillen tussen individuen. Organismen met een betere aanpassing aan hun omgeving overleven vaker en krijgen meer nakomelingen. Hun eigenschappen worden zo doorgegeven. Over veel generaties verandert de soort.",
        explanation: "Drie stappen: 1) variatie bestaat al, 2) selectie door de omgeving, 3) erfelijke doorgave. Dit proces, herhaald over duizenden generaties, leidt tot nieuwe soorten."
      },
      {
        prompt: "Wat is een mutatie?",
        options: [
          "A. Een dier dat doodgaat",
          "B. Een toevallige verandering in het DNA",
          "C. Een ziekte",
          "D. Een keuze die een dier maakt"
        ],
        answer: "B",
        explanation: "Mutaties zijn willekeurige veranderingen in het DNA. De meeste hebben geen effect, sommige zijn schadelijk, en een enkele keer geeft een mutatie een voordeel — dan kan natuurlijke selectie erop inwerken."
      },
      {
        prompt: "Op een eiland leven vogels met korte en lange snavels. Er groeien alleen bloemen met diepe kelken. Welke vogels overleven beter, en wat gebeurt na vele generaties?",
        answer: "Vogels met lange snavels kunnen bij de nectar — zij overleven en krijgen meer nakomelingen. Na vele generaties hebben vrijwel alle vogels lange snavels.",
        explanation: "Dit is precies het soort voorbeeld dat Darwin zag bij de Galápagos-vinken. Het is een schoolvoorbeeld van natuurlijke selectie."
      }
    ]
  },
  {
    id: "bio-3.4",
    title: "3.4 — Stambomen en fossielen",
    questions: [
      {
        prompt: "Wat laat een stamboom van soorten zien?",
        options: [
          "A. Hoe oud een boom is",
          "B. De familie van één persoon",
          "C. Hoe soorten met elkaar verwant zijn en zijn ontstaan",
          "D. Welke dieren in een bos leven"
        ],
        answer: "C",
        explanation: "Een stamboom (fylogenetische boom) toont evolutionaire verwantschap. Hoe dichter twee soorten bij elkaar staan, hoe recenter hun gemeenschappelijke voorouder."
      },
      {
        prompt: "Wat is een fossiel?",
        options: [
          "A. Een levend oud dier",
          "B. Versteende resten of afdrukken van organismen uit het verleden",
          "C. Een tekening van een dinosaurus",
          "D. Een gekleurde steen"
        ],
        answer: "B",
        explanation: "Fossielen ontstaan als een dood organisme snel bedekt wordt door sediment (bv. modder), waarna mineralen het langzaam vervangen. Zo blijft de vorm bewaard in steen."
      },
      {
        prompt: "Waarom worden niet alle gestorven dieren fossielen?",
        answer: "Voor een fossiel moet het lichaam snel bedekt worden door sediment, zodat het niet opgegeten wordt of vergaat. Dat gebeurt zelden. Harde delen (botten, schelpen) blijven beter bewaard dan zachte delen.",
        explanation: "Daarom kennen we vooral fossielen van dieren met botten of schelpen, en uit moerassige gebieden waar snel sediment werd afgezet."
      },
      {
        prompt: "Wat kunnen wetenschappers leren door fossielen te bestuderen?",
        answer: "Welke soorten vroeger leefden, hoe ze eruitzagen, hoe oud ze zijn, hoe ze zijn veranderd over tijd, en hoe ze verwant zijn aan huidige soorten.",
        explanation: "Door fossielen uit verschillende aardlagen te vergelijken, zie je hoe soorten geleidelijk veranderden — direct bewijs voor evolutie."
      }
    ]
  },
  {
    id: "bio-3.5",
    title: "3.5 — Leven in het verleden",
    questions: [
      {
        prompt: "Welke groep organismen ontstond als eerste op aarde?",
        options: [
          "A. Dinosaurussen",
          "B. Planten op het land",
          "C. Bacteriën in de zee",
          "D. Mensen"
        ],
        answer: "C",
        explanation: "Het eerste leven (eencellige bacteriën) ontstond zo'n 3,8 miljard jaar geleden in de zee. Alle complex leven dat daarna kwam, stamt daarvan af."
      },
      {
        prompt: "Zet in volgorde van oudste naar nieuwste: dinosaurussen, eerste mensen, eerste planten op land, eerste leven in zee.",
        answer: "1) Eerste leven in zee (bacteriën) → 2) Eerste planten op land → 3) Dinosaurussen → 4) Eerste mensen.",
        explanation: "Leven begon in zee, kwam pas veel later op het land, dinosaurussen kwamen ~230 miljoen jaar geleden, en mensen pas ~300.000 jaar geleden — een zeer recente verschijning."
      },
      {
        prompt: "Wat is de meest waarschijnlijke oorzaak van het uitsterven van de dinosaurussen?",
        options: [
          "A. Een ijstijd",
          "B. Een grote meteorietinslag",
          "C. Jacht door mensen",
          "D. Ziekte"
        ],
        answer: "B",
        explanation: "Ongeveer 66 miljoen jaar geleden sloeg een grote meteoriet in bij het huidige Mexico. De stofwolk blokkeerde de zon, waardoor planten stierven en de hele voedselketen instortte."
      },
      {
        prompt: "Wat is een massa-extinctie?",
        answer: "Een periode waarin in korte tijd heel veel verschillende soorten tegelijk uitsterven.",
        explanation: "Er zijn in de geschiedenis 5 grote massa-extincties geweest. Sommige wetenschappers zeggen dat we nu de 6e meemaken, veroorzaakt door menselijk handelen."
      }
    ]
  },
  {
    id: "bio-3.6",
    title: "3.6 — Uitsterven en nieuwe soorten",
    questions: [
      {
        prompt: "Noem drie oorzaken waardoor een soort kan uitsterven.",
        answer: "Bijv: klimaatverandering, verlies van leefgebied, ziekte, overbejaging door mensen, vervuiling, natuurramp, concurrentie met andere soorten.",
        explanation: "Veel oorzaken combineren. Vandaag is verlies van leefgebied (ontbossing, bebouwing) de #1 oorzaak van uitsterven."
      },
      {
        prompt: "Hoe ontstaan nieuwe soorten?",
        answer: "Als een deel van een populatie geïsoleerd raakt (bv. door een rivier of zee), passen ze zich aan andere omgevingen aan. Na vele generaties verschillen ze zo veel dat ze geen vruchtbare nakomelingen meer kunnen krijgen met de oorspronkelijke groep — dan is het een nieuwe soort.",
        explanation: "Dit heet 'soortvorming' of 'speciatie'. Eilanden zoals de Galápagos zijn perfecte plekken voor dit proces."
      },
      {
        prompt: "Welke uitspraak over uitsterven is JUIST?",
        options: [
          "A. Uitsterven gebeurt alleen door mensen",
          "B. Als een soort uitsterft, kan hij later weer terugkomen",
          "C. Soorten kunnen uitsterven door bv. klimaatverandering, ziekte of verlies van leefgebied",
          "D. Dinosaurussen leven nog steeds"
        ],
        answer: "C",
        explanation: "Uitsterven is permanent — een soort komt nooit meer terug. Oorzaken zijn divers: natuurlijk (klimaat, ziekte) of door mensen (jacht, ontbossing)."
      },
      {
        prompt: "Geef twee voorbeelden van soorten die door mensen zijn uitgestorven of bijna uitgestorven.",
        answer: "Bijv: dodo (volledig uitgestorven), reuzenpanda (bijna), wolharige mammoet (uitgestorven), Sumatraanse tijger (bijna), Tasmaanse tijger (uitgestorven).",
        explanation: "Mensen veroorzaken uitsterven door jacht, leefgebied vernietigen, en het introduceren van nieuwe soorten die de oorspronkelijke verdringen."
      }
    ]
  },
  {
    id: "bio-algemeen",
    title: "Algemeen — Hele hoofdstuk 3",
    questions: [
      {
        prompt: "Wat is het verschil tussen een mutatie en natuurlijke selectie?",
        answer: "Een mutatie is een toevallige verandering in het DNA. Natuurlijke selectie is het proces waarbij de omgeving 'kiest' welke organismen het beste overleven en zich voortplanten. Mutatie levert de variatie, selectie bepaalt welke variatie blijft.",
        explanation: "Geheugensteuntje: mutatie = de loterij, natuurlijke selectie = de winnaar kiezen. Beide samen sturen evolutie."
      },
      {
        prompt: "Hoe weten wetenschappers dat evolutie echt gebeurt? Noem 2 bewijzen.",
        answer: "Bijv: fossielen tonen geleidelijke veranderingen over tijd; DNA-vergelijkingen tussen soorten laten verwantschap zien; bouw van skelet (bv. arm-bot bij mens, walvis en vleermuis is hetzelfde); evolutie is direct waarneembaar (bv. resistente bacteriën, vlinders die kleur veranderen).",
        explanation: "Evolutie is een van de best onderbouwde theorieën in de wetenschap. Het bewijs komt uit meerdere onafhankelijke richtingen die elkaar bevestigen."
      },
      {
        prompt: "Wat is biodiversiteit, en waarom is het belangrijk om die te beschermen?",
        answer: "Biodiversiteit is de verscheidenheid aan leven op aarde. Het is belangrijk omdat ecosystemen stabiel blijven, we afhankelijk zijn van planten en dieren (voedsel, medicijnen, zuurstof), en omdat verloren soorten nooit terugkomen.",
        explanation: "Een ecosysteem met veel soorten is veerkrachtig. Als één soort wegvalt, kunnen andere de rol overnemen. Bij weinig biodiversiteit stort alles makkelijk in elkaar."
      },
      {
        prompt: "Beschrijf in 3–4 zinnen hoe een nieuwe vogelsoort kan ontstaan op een geïsoleerd eiland.",
        answer: "Vogels komen op een eiland aan en raken geïsoleerd. Door natuurlijke selectie passen ze zich aan aan het lokale voedsel en de omgeving. Over vele generaties veranderen hun snavels, kleuren en gedrag. Uiteindelijk verschillen ze zo veel van hun voorouders dat ze geen nakomelingen meer kunnen krijgen — een nieuwe soort.",
        explanation: "Precies wat Darwin observeerde bij de Galápagos-vinken. Isolatie + tijd + selectie = nieuwe soort."
      },
      {
        prompt: "Wat is een fossiel en wat kunnen we ervan leren?",
        answer: "Een fossiel is een versteende rest of afdruk van een organisme uit het verleden. We leren ervan welke soorten leefden, hoe ze eruitzagen, wanneer ze leefden, en hoe ze evolueerden.",
        explanation: "Fossielen zijn de tijdcapsules van het leven. Door ze in aardlagen te vergelijken, zien we direct hoe leven veranderde."
      }
    ]
  }
];
