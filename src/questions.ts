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
    title: "📗 Makkelijk — 3.1 Waardoor zoveel soorten",
    questions: [
      {
        prompt: "Wat is de beste definitie van een 'soort'?",
        options: ["A. Dieren die op elkaar lijken", "B. Organismen die samen vruchtbare nakomelingen kunnen krijgen", "C. Organismen die in hetzelfde gebied leven", "D. Planten en dieren met dezelfde kleur"],
        answer: "B",
        explanation: "Een soort = groep organismen die met elkaar vruchtbare nakomelingen kunnen krijgen. Een paard en ezel krijgen samen een muilezel, maar die is onvruchtbaar — dus twee verschillende soorten."
      },
      {
        prompt: "Waarom zijn er zoveel verschillende soorten op aarde?",
        options: ["A. Door toeval", "B. Door evolutie en aanpassing aan verschillende omgevingen", "C. Mensen hebben ze gemaakt", "D. Omdat de aarde groot is"],
        answer: "B",
        explanation: "Verschillende omgevingen vragen verschillende aanpassingen. Over miljoenen jaren ontstaan zo veel soorten via evolutie."
      },
      {
        prompt: "Wetenschappers delen al het leven op aarde in 5 grote groepen ('rijken'). Welke zijn dat?",
        answer: "Planten, dieren, schimmels, bacteriën en protisten (eencelligen).",
        explanation: "De 5 rijken: 1) Planten (maken zelf voedsel via fotosynthese), 2) Dieren (bewegen en eten andere organismen), 3) Schimmels (zoals paddenstoelen en gist), 4) Bacteriën (eencellig, overal te vinden), 5) Protisten (eencelligen zoals amoeben en algen)."
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
    title: "📗 Makkelijk — 3.2 Biodiversiteit",
    questions: [
      {
        prompt: "Wat betekent 'biodiversiteit'?",
        options: ["A. Aantal dieren in een dierentuin", "B. Verscheidenheid aan leven op aarde", "C. Hoeveel planten in een bos groeien", "D. Aantal mensen op aarde"],
        answer: "B",
        explanation: "Biodiversiteit = de variatie aan soorten, genen en ecosystemen op aarde. Hoe meer verschillende soorten, hoe hoger de biodiversiteit."
      },
      {
        prompt: "Welke gebieden hebben de hoogste biodiversiteit?",
        options: ["A. Woestijnen en poolgebieden", "B. Tropische regenwouden en koraalriffen", "C. Steden", "D. Akkers en weilanden"],
        answer: "B",
        explanation: "Tropische regenwouden en koraalriffen herbergen miljoenen soorten dankzij het warme klimaat en stabiele omstandigheden."
      },
      {
        prompt: "Noem twee redenen waarom biodiversiteit belangrijk is.",
        answer: "1) Planten en dieren leveren voedsel, zuurstof en medicijnen. 2) Veel soorten samen houden ecosystemen stabiel — als één soort wegvalt, kunnen anderen de rol overnemen.",
        explanation: "Biodiversiteit is als een puzzel — elke soort heeft een rol. Hoe meer soorten, hoe stabieler en gezonder een ecosysteem."
      },
      {
        prompt: "Noem drie bedreigingen voor biodiversiteit.",
        answer: "Verlies van leefgebied, klimaatverandering en vervuiling. (Ook goed: overbevissing, jacht, invasieve soorten.)",
        explanation: "De meeste bedreigingen worden veroorzaakt door menselijk handelen. Daarom heet de huidige periode soms het 'antropoceen'."
      }
    ]
  },
  {
    id: "bio-3.3",
    title: "📗 Makkelijk — 3.3 Evolutie",
    questions: [
      {
        prompt: "Wie bedacht de theorie van evolutie door natuurlijke selectie?",
        options: ["A. Einstein", "B. Newton", "C. Charles Darwin", "D. Mendel"],
        answer: "C",
        explanation: "Charles Darwin publiceerde in 1859 'On the Origin of Species' na zijn reis met de Beagle, waarin hij vinken op de Galápagos-eilanden bestudeerde."
      },
      {
        prompt: "Leg in eigen woorden uit hoe natuurlijke selectie werkt. Gebruik het woord 'aanpassing'.",
        answer: "Binnen een soort zijn er kleine verschillen tussen individuen. Organismen met een betere aanpassing aan hun omgeving overleven vaker en krijgen meer nakomelingen. Over veel generaties verandert de soort.",
        explanation: "Drie stappen: 1) variatie bestaat al, 2) selectie door de omgeving, 3) erfelijke doorgave. Dit proces, herhaald over duizenden generaties, leidt tot nieuwe soorten."
      },
      {
        prompt: "Wat is een mutatie?",
        options: ["A. Een dier dat doodgaat", "B. Een toevallige verandering in het DNA", "C. Een ziekte", "D. Een keuze die een dier maakt"],
        answer: "B",
        explanation: "Mutaties zijn willekeurige veranderingen in het DNA. De meeste hebben geen effect, sommige zijn schadelijk, en heel soms geeft een mutatie een voordeel — dan kan natuurlijke selectie erop inwerken."
      },
      {
        prompt: "Op een eiland leven vogels met korte en lange snavels. Er groeien alleen bloemen met diepe kelken. Welke vogels overleven beter, en wat gebeurt na vele generaties?",
        answer: "Vogels met lange snavels kunnen bij de nectar — zij overleven en krijgen meer nakomelingen. Na vele generaties hebben vrijwel alle vogels lange snavels.",
        explanation: "Schoolvoorbeeld van natuurlijke selectie — precies wat Darwin zag bij de Galápagos-vinken."
      }
    ]
  },
  {
    id: "bio-3.4",
    title: "📗 Makkelijk — 3.4 Stambomen & fossielen",
    questions: [
      {
        prompt: "Wat laat een stamboom van soorten zien?",
        options: ["A. Hoe oud een boom is", "B. De familie van één persoon", "C. Hoe soorten met elkaar verwant zijn en zijn ontstaan", "D. Welke dieren in een bos leven"],
        answer: "C",
        explanation: "Een stamboom toont evolutionaire verwantschap. Hoe dichter twee soorten bij elkaar staan, hoe recenter hun gemeenschappelijke voorouder."
      },
      {
        prompt: "Wat is een fossiel?",
        options: ["A. Een levend oud dier", "B. Versteende resten of afdrukken van organismen uit het verleden", "C. Een tekening van een dinosaurus", "D. Een gekleurde steen"],
        answer: "B",
        explanation: "Fossielen ontstaan als een dood organisme snel bedekt wordt door sediment, waarna mineralen het langzaam vervangen. Zo blijft de vorm bewaard in steen."
      },
      {
        prompt: "Waarom worden niet alle gestorven dieren fossielen?",
        answer: "Omdat een dood lichaam meestal wordt opgegeten of vergaat voordat het kan verstenen. Alleen als het snel bedekt wordt door sediment en door aardlagen wordt platgedrukt, kan het verstenen. Door verschuiving van aardlagen komen fossielen later soms weer aan het oppervlak.",
        explanation: "Daarom kennen we vooral fossielen van dieren met botten of schelpen, en uit moerassige gebieden waar snel sediment werd afgezet."
      },
      {
        prompt: "Wat kunnen wetenschappers leren door fossielen te bestuderen?",
        answer: "Welke soorten vroeger leefden, hoe ze eruitzagen, hoe oud ze zijn, en hoe ze zijn veranderd over tijd.",
        explanation: "Door fossielen uit verschillende aardlagen te vergelijken, zie je hoe soorten geleidelijk veranderden — direct bewijs voor evolutie."
      }
    ]
  },
  {
    id: "bio-3.5",
    title: "📗 Makkelijk — 3.5 Leven in het verleden",
    questions: [
      {
        prompt: "Welke groep organismen ontstond als eerste op aarde?",
        options: ["A. Dinosaurussen", "B. Planten op het land", "C. Bacteriën in de zee", "D. Mensen"],
        answer: "C",
        explanation: "Het eerste leven (eencellige bacteriën) ontstond zo'n 3,8 miljard jaar geleden in de zee. Alles wat daarna kwam, stamt daarvan af."
      },
      {
        prompt: "Zet in volgorde van oudste naar nieuwste: dinosaurussen, eerste mensen, eerste planten op land, eerste leven in zee.",
        answer: "1) Eerste leven in zee → 2) Eerste planten op land → 3) Dinosaurussen → 4) Eerste mensen.",
        explanation: "Leven begon in zee, kwam pas veel later op het land, dinosaurussen kwamen ~230 miljoen jaar geleden, en mensen pas ~300.000 jaar geleden."
      },
      {
        prompt: "Wat is de meest waarschijnlijke oorzaak van het uitsterven van de dinosaurussen?",
        options: ["A. Een ijstijd", "B. Een grote meteorietinslag", "C. Jacht door mensen", "D. Ziekte"],
        answer: "B",
        explanation: "Ongeveer 66 miljoen jaar geleden sloeg een grote meteoriet in bij het huidige Mexico. De stofwolk blokkeerde de zon, planten stierven, en de hele voedselketen stortte in."
      },
      {
        prompt: "Wat is een massa-extinctie?",
        answer: "Een periode waarin in korte tijd heel veel verschillende soorten tegelijk uitsterven.",
        explanation: "Er zijn 5 grote massa-extincties geweest. Sommigen zeggen dat we nu de 6e meemaken, door menselijk handelen."
      }
    ]
  },
  {
    id: "bio-3.6",
    title: "📗 Makkelijk — 3.6 Uitsterven & nieuwe soorten",
    questions: [
      {
        prompt: "Noem drie oorzaken waardoor een soort kan uitsterven.",
        answer: "Klimaatverandering, verlies van leefgebied en overbejaging door mensen. (Ook goed: ziekte, vervuiling, natuurramp.)",
        explanation: "Vandaag is verlies van leefgebied (ontbossing, bebouwing) de #1 oorzaak."
      },
      {
        prompt: "Hoe ontstaan nieuwe soorten?",
        answer: "Als een deel van een populatie geïsoleerd raakt (door rivier, zee, bergketen), passen ze zich aan een andere omgeving aan. Na vele generaties verschillen ze zoveel dat ze geen vruchtbare nakomelingen meer kunnen krijgen met de oorspronkelijke groep.",
        explanation: "Dit heet 'soortvorming' of 'speciatie'. Eilanden zoals de Galápagos zijn perfecte plekken voor dit proces."
      },
      {
        prompt: "Welke uitspraak over uitsterven is JUIST?",
        options: ["A. Uitsterven gebeurt alleen door mensen", "B. Een uitgestorven soort kan later weer terugkomen", "C. Soorten kunnen uitsterven door klimaatverandering, ziekte of verlies van leefgebied", "D. Dinosaurussen leven nog steeds"],
        answer: "C",
        explanation: "Uitsterven is permanent — een soort komt nooit meer terug."
      },
      {
        prompt: "Geef twee voorbeelden van soorten die door mensen zijn uitgestorven of bijna uitgestorven.",
        answer: "De dodo (uitgestorven) en de wolharige mammoet (uitgestorven). Ook goed: reuzenpanda, Sumatraanse tijger, Tasmaanse tijger, Javaanse neushoorn.",
        explanation: "Mensen veroorzaken uitsterven door jacht, leefgebied vernietigen, en invasieve soorten introduceren."
      }
    ]
  },
  {
    id: "bio-algemeen",
    title: "📗 Makkelijk — Hele hoofdstuk 3",
    questions: [
      {
        prompt: "Wat is het verschil tussen een mutatie en natuurlijke selectie?",
        answer: "Een mutatie is een toevallige verandering in het DNA — dat zorgt voor variatie. Natuurlijke selectie is het proces waarbij de omgeving 'kiest' welke organismen overleven. Kort: mutatie levert de variatie, natuurlijke selectie bepaalt welke variatie blijft.",
        explanation: "Geheugensteuntje: mutatie = de loterij, natuurlijke selectie = de winnaar kiezen."
      },
      {
        prompt: "Hoe weten wetenschappers dat evolutie echt gebeurt? Noem 2 bewijzen.",
        answer: "1) Fossielen tonen geleidelijke veranderingen over miljoenen jaren. 2) DNA-vergelijkingen tussen soorten laten verwantschap zien. Ook goed: homologe organen (zelfde botten in mens, walvis, vleermuis), waarneembare evolutie (resistente bacteriën).",
        explanation: "Evolutie is een van de best onderbouwde theorieën in de wetenschap."
      },
      {
        prompt: "Wat is biodiversiteit, en waarom is het belangrijk om die te beschermen?",
        answer: "Biodiversiteit is de verscheidenheid aan leven op aarde. Belangrijk omdat ecosystemen stabiel blijven, we afhankelijk zijn van soorten voor voedsel/medicijnen/zuurstof, en uitgestorven soorten nooit terugkomen.",
        explanation: "Hoge biodiversiteit = veerkrachtig ecosysteem. Lage biodiversiteit = kwetsbaar systeem dat snel kan instorten."
      },
      {
        prompt: "Beschrijf in 3–4 zinnen hoe een nieuwe vogelsoort kan ontstaan op een geïsoleerd eiland.",
        answer: "Vogels komen op een eiland aan en raken geïsoleerd. Door natuurlijke selectie passen ze zich aan aan het lokale voedsel en omgeving. Over vele generaties veranderen snavels, kleuren en gedrag. Uiteindelijk verschillen ze zoveel dat ze geen vruchtbare nakomelingen meer kunnen krijgen met de oorspronkelijke soort.",
        explanation: "Precies wat Darwin zag bij de Galápagos-vinken: isolatie + tijd + selectie = nieuwe soort."
      },
      {
        prompt: "Wat is een fossiel en wat kunnen we ervan leren?",
        answer: "Een versteende rest of afdruk van een organisme uit het verleden. We leren welke soorten leefden, hoe ze eruitzagen, wanneer ze leefden, en hoe ze evolueerden.",
        explanation: "Fossielen zijn de tijdcapsules van het leven."
      }
    ]
  },
  {
    id: "bio-pittig",
    title: "🔥 Pittig — Eindtoets",
    questions: [
      {
        prompt: "Een leeuw en een tijger kunnen in een dierentuin samen jongen krijgen: de 'liger'. Sommige liger-vrouwtjes zijn zelfs vruchtbaar. Wat zegt dit over de soortdefinitie?",
        options: ["A. Leeuw en tijger zijn dezelfde soort", "B. Ligers zijn een nieuwe soort", "C. De soortdefinitie heeft soms grijze gebieden", "D. Dit is een biologische fout"],
        answer: "C",
        explanation: "De soortdefinitie (vruchtbare nakomelingen) werkt meestal, maar er zijn uitzonderingen. In de natuur zouden leeuw en tijger elkaar nooit ontmoeten — ze leven op andere continenten. In dierentuinen wel. Daarom worden ze nog steeds als twee aparte soorten gezien."
      },
      {
        prompt: "Een giraffe rekt elke dag zijn nek om bij hoge bladeren te komen. Volgens Darwin's natuurlijke selectie betekent dit dat...",
        options: ["A. De nek van die giraffe steeds langer wordt en hij dat doorgeeft aan zijn jongen", "B. Giraffes die toevallig al een langere nek hadden, meer overlevingskans hadden — hun jongen ook", "C. Het DNA van de giraffe verandert door het rekken", "D. Alle giraffes precies even lang worden"],
        answer: "B",
        explanation: "Dit is een klassieke valkuil. Antwoord A is de THEORIE VAN LAMARCK — die was fout. Darwin liet zien dat variatie al bestaat (sommige giraffes zijn van nature langer), en de omgeving 'selecteert' wie overleeft. Eigenschappen die je tijdens je leven ontwikkelt, geef je NIET door."
      },
      {
        prompt: "Waarom leiden de meeste mutaties NIET tot evolutie?",
        answer: "Omdat de meeste mutaties geen effect hebben (neutraal) of juist schadelijk zijn — die organismen sterven of krijgen geen nakomelingen. Alleen mutaties die een voordeel geven én worden doorgegeven, kunnen evolutie sturen.",
        explanation: "Mutaties zijn willekeurig, maar selectie is niet willekeurig. Zonder selectie zou een mutatie alleen door toeval in een populatie blijven."
      },
      {
        prompt: "Een walvis en een vis hebben allebei een stroomlijnvormig lichaam en vinnen, maar walvissen zijn zoogdieren. Wat verklaart hun gelijkenis?",
        options: ["A. Walvissen stammen direct af van vissen", "B. Ze hebben zich onafhankelijk aangepast aan hetzelfde leven in water", "C. Ze zijn nauw verwant", "D. Toeval"],
        answer: "B",
        explanation: "Dit heet CONVERGENTE evolutie: dezelfde leefomgeving (water) levert dezelfde oplossingen (stroomlijn, vinnen). Walvissen komen eigenlijk van landzoogdieren — hun voorouders liepen op het land en gingen later terug naar zee."
      },
      {
        prompt: "Op een stamboom zie je: mens, chimpansee, gorilla, orang-oetan. Mens en chimpansee zitten op dezelfde tak. Wat betekent dit?",
        options: ["A. Mensen stammen af van chimpansees", "B. Mensen en chimpansees hebben een recentere gemeenschappelijke voorouder dan met de gorilla", "C. Chimpansees zijn 'meer ontwikkeld' dan gorilla's", "D. Mens en chimpansee zijn identiek"],
        answer: "B",
        explanation: "Mega belangrijke valkuil! Mensen stammen NIET af van chimpansees — we delen een gemeenschappelijke VOOROUDER. Die voorouder leefde ~6 miljoen jaar geleden. Beide takken zijn sindsdien evenlang aan het evolueren."
      },
      {
        prompt: "Een boer spuit insecticide op zijn akker. In het begin sterven bijna alle insecten. Na 5 jaar werkt het middel nauwelijks meer. Leg uit wat er biologisch is gebeurd.",
        answer: "Een paar insecten hadden van nature een mutatie waardoor ze ongevoelig waren voor de insecticide. Die overleefden en plantten zich voort. Hun resistente nakomelingen vormden steeds een groter deel van de populatie. Na 5 jaar zijn bijna alle insecten resistent — natuurlijke selectie in versneld tempo.",
        explanation: "Dit gebeurt nu écht op grote schaal: resistente bacteriën tegen antibiotica, resistente onkruiden tegen herbiciden. Levend bewijs voor evolutie."
      },
      {
        prompt: "Een populatie panda's bestaat uit 100 dieren met bijna identiek DNA. Wat is het GROOTSTE risico?",
        options: ["A. Te veel concurrentie", "B. Lage genetische diversiteit — een ziekte of klimaatverandering kan de hele populatie raken", "C. Ze zullen muteren", "D. Ze worden te groot"],
        answer: "B",
        explanation: "Biodiversiteit is niet alleen aantal SOORTEN, maar ook variatie BINNEN een soort (genetische diversiteit). Als alle individuen bijna hetzelfde DNA hebben, kan één ziekte de hele populatie wegvagen. Daarom is inteelt zo gevaarlijk."
      },
      {
        prompt: "Wat is een belangrijk GEVOLG van een massa-extinctie, naast het uitsterven van veel soorten?",
        options: ["A. De aarde stopt met draaien", "B. Er ontstaat ruimte voor nieuwe soorten om de vrijgekomen niches op te vullen", "C. Alle leven verdwijnt definitief", "D. Het klimaat blijft voor altijd hetzelfde"],
        answer: "B",
        explanation: "Massa-extincties zijn paradoxaal: ze veroorzaken evolutie. Na de dinosaurussen kregen zoogdieren (waaronder onze voorouders) de ruimte om te groeien en diversifiëren. Zonder die meteoriet zouden wij niet bestaan."
      },
      {
        prompt: "Als natuurlijke selectie altijd de beste aanpassing kiest, waarom zijn organismen dan niet 'perfect'? Geef minimaal 2 redenen.",
        answer: "1) De omgeving verandert constant — aanpassingen lopen altijd achter. 2) Evolutie werkt alleen met bestaande variatie, niet vanaf nul. 3) Trade-offs: voordeel in één ding kan nadeel zijn in iets anders (bv. grote spieren = veel energie nodig). 4) Toeval speelt ook een rol.",
        explanation: "Mooi voorbeeld: het oog van mensen heeft een 'blinde vlek' omdat de zenuwen voor de netvliescellen langs lopen. Een octopus heeft dat probleem niet — bij hen zit het slimmer. Evolutie werkt met wat er al is, niet met wat 'optimaal' zou zijn."
      },
      {
        prompt: "Geef een concreet voorbeeld waarom verlies van biodiversiteit slecht is voor de geneeskunde.",
        answer: "Veel medicijnen komen uit planten of dieren. Bijvoorbeeld: aspirine uit wilgenbast, een belangrijk kankermedicijn (taxol) uit de taxusboom, en penicilline uit een schimmel. Als soorten uitsterven voordat we ze hebben onderzocht, missen we mogelijke medicijnen die we nooit zullen ontdekken.",
        explanation: "Naar schatting komt ~25% van alle moderne medicijnen oorspronkelijk uit planten. Het tropisch regenwoud is een gigantische, grotendeels onontdekte 'medicijnkast' die we aan het kappen zijn."
      },
      {
        prompt: "Wetenschappers zeggen dat we nu mogelijk in een 6e massa-extinctie zitten. Wat is het GROOTSTE verschil met de vorige 5?",
        options: ["A. Deze gaat veel langzamer", "B. Deze wordt veroorzaakt door één soort: de mens", "C. Deze treft alleen dieren, geen planten", "D. Deze is een mythe"],
        answer: "B",
        explanation: "De vorige 5 werden veroorzaakt door natuurlijke gebeurtenissen (meteoriet, vulkanische uitbarsting, klimaatverschuiving). De 6e wordt veroorzaakt door één soort: wij. Soorten sterven nu 100 tot 1000 keer sneller uit dan normaal."
      },
      {
        prompt: "Welke van deze uitspraken is FOUT?",
        options: ["A. Mensen stammen af van apen", "B. Mensen en chimpansees hebben een gemeenschappelijke voorouder", "C. Evolutie is nog steeds bezig", "D. Bacteriën evolueren sneller dan grote dieren"],
        answer: "A",
        explanation: "Klassieke misverstand! Mensen stammen NIET af van apen — we delen een gemeenschappelijke voorouder. Die voorouder was géén chimpansee. Beide soorten zijn sindsdien evenlang aan het evolueren in hun eigen richting."
      }
    ]
  }
];
