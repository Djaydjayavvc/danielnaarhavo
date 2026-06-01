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
  // ─────────────────── EASY ───────────────────
  {
    id: "bio-3.1-easy",
    title: "📗 3.1 — Waardoor zoveel soorten",
    questions: [
      { prompt: "Wat is de beste definitie van een 'soort'?", options: ["A. Dieren die op elkaar lijken", "B. Organismen die samen vruchtbare nakomelingen kunnen krijgen", "C. Organismen die in hetzelfde gebied leven", "D. Planten en dieren met dezelfde kleur"], answer: "B", explanation: "Een soort = groep organismen die met elkaar vruchtbare nakomelingen kunnen krijgen. Een paard en ezel krijgen samen een muilezel, maar die is onvruchtbaar — dus twee verschillende soorten." },
      { prompt: "Waarom zijn er zoveel verschillende soorten op aarde?", options: ["A. Door toeval", "B. Door evolutie en aanpassing aan verschillende omgevingen", "C. Mensen hebben ze gemaakt", "D. Omdat de aarde groot is"], answer: "B", explanation: "Verschillende omgevingen vragen verschillende aanpassingen. Over miljoenen jaren ontstaan zo veel soorten via evolutie." },
      { prompt: "Wetenschappers delen al het leven op aarde in 5 grote groepen ('rijken'). Welke zijn dat?", answer: "Planten, dieren, schimmels, bacteriën en protisten (eencelligen).", explanation: "De 5 rijken: 1) Planten (fotosynthese), 2) Dieren (bewegen, eten anderen), 3) Schimmels (paddenstoelen, gist), 4) Bacteriën (eencellig), 5) Protisten (eencelligen zoals amoeben en algen)." },
      { prompt: "Waarom zijn een paard en een ezel niet dezelfde soort, ook al lijken ze veel op elkaar?", answer: "Omdat hun nakomeling (muilezel) onvruchtbaar is — ze kunnen samen geen vruchtbare nakomelingen krijgen.", explanation: "De definitie van soort hangt af van of de nakomelingen zélf weer jongen kunnen krijgen. Muilezels kunnen dat niet, dus paard en ezel blijven twee aparte soorten." }
    ]
  },
  {
    id: "bio-3.2-easy",
    title: "📗 3.2 — Biodiversiteit",
    questions: [
      { prompt: "Wat betekent 'biodiversiteit'?", options: ["A. Aantal dieren in een dierentuin", "B. Verscheidenheid aan leven op aarde", "C. Hoeveel planten in een bos groeien", "D. Aantal mensen op aarde"], answer: "B", explanation: "Biodiversiteit = de variatie aan soorten, genen en ecosystemen op aarde." },
      { prompt: "Welke gebieden hebben de hoogste biodiversiteit?", options: ["A. Woestijnen en poolgebieden", "B. Tropische regenwouden en koraalriffen", "C. Steden", "D. Akkers en weilanden"], answer: "B", explanation: "Tropische regenwouden en koraalriffen herbergen miljoenen soorten dankzij het warme klimaat en stabiele omstandigheden." },
      { prompt: "Noem twee redenen waarom biodiversiteit belangrijk is.", answer: "1) Planten en dieren leveren voedsel, zuurstof en medicijnen. 2) Veel soorten samen houden ecosystemen stabiel — als één soort wegvalt, kunnen anderen de rol overnemen.", explanation: "Biodiversiteit is als een puzzel — elke soort heeft een rol." },
      { prompt: "Noem drie bedreigingen voor biodiversiteit.", answer: "Verlies van leefgebied, klimaatverandering en vervuiling. (Ook goed: overbevissing, jacht, invasieve soorten.)", explanation: "De meeste bedreigingen worden veroorzaakt door menselijk handelen." }
    ]
  },
  {
    id: "bio-3.3-easy",
    title: "📗 3.3 — Evolutie",
    questions: [
      { prompt: "Wie bedacht de theorie van evolutie door natuurlijke selectie?", options: ["A. Einstein", "B. Newton", "C. Charles Darwin", "D. Mendel"], answer: "C", explanation: "Charles Darwin publiceerde in 1859 'On the Origin of Species' na zijn reis met de Beagle." },
      { prompt: "Leg in eigen woorden uit hoe natuurlijke selectie werkt. Gebruik het woord 'aanpassing'.", answer: "Binnen een soort zijn er kleine verschillen tussen individuen. Organismen met een betere aanpassing aan hun omgeving overleven vaker en krijgen meer nakomelingen. Over veel generaties verandert de soort.", explanation: "Drie stappen: 1) variatie bestaat al, 2) selectie door de omgeving, 3) erfelijke doorgave." },
      { prompt: "Wat is een mutatie?", options: ["A. Een dier dat doodgaat", "B. Een toevallige verandering in het DNA", "C. Een ziekte", "D. Een keuze die een dier maakt"], answer: "B", explanation: "Mutaties zijn willekeurige veranderingen in het DNA. De meeste hebben geen effect, sommige zijn schadelijk, en heel soms geeft een mutatie een voordeel." },
      { prompt: "Op een eiland leven vogels met korte en lange snavels. Er groeien alleen bloemen met diepe kelken. Welke vogels overleven beter, en wat gebeurt na vele generaties?", answer: "Vogels met lange snavels kunnen bij de nectar — zij overleven en krijgen meer nakomelingen. Na vele generaties hebben vrijwel alle vogels lange snavels.", explanation: "Schoolvoorbeeld van natuurlijke selectie — precies wat Darwin zag bij de Galápagos-vinken." }
    ]
  },
  {
    id: "bio-3.4-easy",
    title: "📗 3.4 — Stambomen & fossielen",
    questions: [
      { prompt: "Wat laat een stamboom van soorten zien?", options: ["A. Hoe oud een boom is", "B. De familie van één persoon", "C. Hoe soorten met elkaar verwant zijn en zijn ontstaan", "D. Welke dieren in een bos leven"], answer: "C", explanation: "Een stamboom toont evolutionaire verwantschap. Hoe dichter twee soorten bij elkaar staan, hoe recenter hun gemeenschappelijke voorouder." },
      { prompt: "Wat is een fossiel?", options: ["A. Een levend oud dier", "B. Versteende resten of afdrukken van organismen uit het verleden", "C. Een tekening van een dinosaurus", "D. Een gekleurde steen"], answer: "B", explanation: "Fossielen ontstaan als een dood organisme snel bedekt wordt door sediment, waarna mineralen het langzaam vervangen." },
      { prompt: "Waarom worden niet alle gestorven dieren fossielen?", answer: "Omdat een dood lichaam meestal wordt opgegeten of vergaat voordat het kan verstenen. Alleen als het snel bedekt wordt door sediment en door aardlagen wordt platgedrukt, kan het verstenen. Door verschuiving van aardlagen komen fossielen later soms weer aan het oppervlak.", explanation: "Daarom kennen we vooral fossielen van dieren met botten of schelpen." },
      { prompt: "Wat kunnen wetenschappers leren door fossielen te bestuderen?", answer: "Welke soorten vroeger leefden, hoe ze eruitzagen, hoe oud ze zijn, en hoe ze zijn veranderd over tijd.", explanation: "Door fossielen uit verschillende aardlagen te vergelijken, zie je hoe soorten geleidelijk veranderden." }
    ]
  },
  {
    id: "bio-3.5-easy",
    title: "📗 3.5 — Leven in het verleden",
    questions: [
      { prompt: "Welke groep organismen ontstond als eerste op aarde?", options: ["A. Dinosaurussen", "B. Planten op het land", "C. Bacteriën in de zee", "D. Mensen"], answer: "C", explanation: "Het eerste leven (eencellige bacteriën) ontstond zo'n 3,8 miljard jaar geleden in de zee." },
      { prompt: "Zet in volgorde van oudste naar nieuwste: dinosaurussen, eerste mensen, eerste planten op land, eerste leven in zee.", answer: "1) Eerste leven in zee → 2) Eerste planten op land → 3) Dinosaurussen → 4) Eerste mensen.", explanation: "Leven begon in zee, kwam pas veel later op het land, dinosaurussen kwamen ~230 miljoen jaar geleden, en mensen pas ~300.000 jaar geleden." },
      { prompt: "Wat is de meest waarschijnlijke oorzaak van het uitsterven van de dinosaurussen?", options: ["A. Een ijstijd", "B. Een grote meteorietinslag", "C. Jacht door mensen", "D. Ziekte"], answer: "B", explanation: "Ongeveer 66 miljoen jaar geleden sloeg een grote meteoriet in bij het huidige Mexico. De stofwolk blokkeerde de zon." },
      { prompt: "Wat is een massa-extinctie?", answer: "Een periode waarin in korte tijd heel veel verschillende soorten tegelijk uitsterven.", explanation: "Er zijn 5 grote massa-extincties geweest. Sommigen zeggen dat we nu de 6e meemaken." }
    ]
  },
  {
    id: "bio-3.6-easy",
    title: "📗 3.6 — Uitsterven & nieuwe soorten",
    questions: [
      { prompt: "Noem drie oorzaken waardoor een soort kan uitsterven.", answer: "Klimaatverandering, verlies van leefgebied en overbejaging door mensen. (Ook goed: ziekte, vervuiling, natuurramp.)", explanation: "Vandaag is verlies van leefgebied (ontbossing, bebouwing) de #1 oorzaak." },
      { prompt: "Hoe ontstaan nieuwe soorten?", answer: "Als een deel van een populatie geïsoleerd raakt (door rivier, zee, bergketen), passen ze zich aan een andere omgeving aan. Na vele generaties verschillen ze zoveel dat ze geen vruchtbare nakomelingen meer kunnen krijgen met de oorspronkelijke groep.", explanation: "Dit heet 'soortvorming' of 'speciatie'. Eilanden zoals de Galápagos zijn perfecte plekken voor dit proces." },
      { prompt: "Welke uitspraak over uitsterven is JUIST?", options: ["A. Uitsterven gebeurt alleen door mensen", "B. Een uitgestorven soort kan later weer terugkomen", "C. Soorten kunnen uitsterven door klimaatverandering, ziekte of verlies van leefgebied", "D. Dinosaurussen leven nog steeds"], answer: "C", explanation: "Uitsterven is permanent — een soort komt nooit meer terug." },
      { prompt: "Geef twee voorbeelden van soorten die door mensen zijn uitgestorven of bijna uitgestorven.", answer: "De dodo (uitgestorven) en de wolharige mammoet (uitgestorven). Ook goed: reuzenpanda, Sumatraanse tijger, Tasmaanse tijger, Javaanse neushoorn.", explanation: "Mensen veroorzaken uitsterven door jacht, leefgebied vernietigen, en invasieve soorten introduceren." }
    ]
  },
  {
    id: "bio-samenvatting-easy",
    title: "📗 Samenvatting — Hele H3",
    questions: [
      { prompt: "Wat is het verschil tussen een mutatie en natuurlijke selectie?", answer: "Een mutatie is een toevallige verandering in het DNA — dat zorgt voor variatie. Natuurlijke selectie is het proces waarbij de omgeving 'kiest' welke organismen overleven. Kort: mutatie levert de variatie, natuurlijke selectie bepaalt welke variatie blijft.", explanation: "Geheugensteuntje: mutatie = de loterij, natuurlijke selectie = de winnaar kiezen." },
      { prompt: "Hoe weten wetenschappers dat evolutie echt gebeurt? Noem 2 bewijzen.", answer: "1) Fossielen tonen geleidelijke veranderingen over miljoenen jaren. 2) DNA-vergelijkingen tussen soorten laten verwantschap zien. Ook goed: homologe organen, waarneembare evolutie (resistente bacteriën).", explanation: "Evolutie is een van de best onderbouwde theorieën in de wetenschap." },
      { prompt: "Wat is biodiversiteit, en waarom is het belangrijk om die te beschermen?", answer: "Biodiversiteit is de verscheidenheid aan leven op aarde. Belangrijk omdat ecosystemen stabiel blijven, we afhankelijk zijn van soorten voor voedsel/medicijnen/zuurstof, en uitgestorven soorten nooit terugkomen.", explanation: "Hoge biodiversiteit = veerkrachtig ecosysteem." },
      { prompt: "Beschrijf in 3–4 zinnen hoe een nieuwe vogelsoort kan ontstaan op een geïsoleerd eiland.", answer: "Vogels komen op een eiland aan en raken geïsoleerd. Door natuurlijke selectie passen ze zich aan aan het lokale voedsel en omgeving. Over vele generaties veranderen snavels, kleuren en gedrag. Uiteindelijk verschillen ze zoveel dat ze geen vruchtbare nakomelingen meer kunnen krijgen met de oorspronkelijke soort.", explanation: "Precies wat Darwin zag bij de Galápagos-vinken." },
      { prompt: "Wat is een fossiel en wat kunnen we ervan leren?", answer: "Een versteende rest of afdruk van een organisme uit het verleden. We leren welke soorten leefden, hoe ze eruitzagen, wanneer ze leefden, en hoe ze evolueerden.", explanation: "Fossielen zijn de tijdcapsules van het leven." }
    ]
  },

  // ─────────────────── HARD ───────────────────
  {
    id: "bio-3.1-hard",
    title: "🔥 3.1 — Soorten (pittig)",
    questions: [
      { prompt: "Een leeuw en een tijger kunnen in een dierentuin samen jongen krijgen: de 'liger'. Sommige liger-vrouwtjes zijn zelfs vruchtbaar. Wat zegt dit over de soortdefinitie?", options: ["A. Leeuw en tijger zijn dezelfde soort", "B. Ligers zijn een nieuwe soort", "C. De soortdefinitie heeft soms grijze gebieden", "D. Dit is een biologische fout"], answer: "C", explanation: "De definitie werkt meestal, maar er zijn uitzonderingen. In de natuur ontmoeten leeuw en tijger elkaar nooit — ze leven op andere continenten. Daarom blijven ze twee aparte soorten." },
      { prompt: "Waarom is de 'soort'-definitie soms moeilijk toe te passen? Geef 2 voorbeelden.", answer: "1) Sommige hybriden zijn (deels) vruchtbaar — zoals ligers. 2) Bacteriën planten zich vaak ongeslachtelijk voort, dus 'vruchtbare nakomelingen' werkt anders. 3) Bij uitgestorven soorten kunnen we niet testen of ze samen jongen kregen.", explanation: "De biologie kent veel grijze gebieden — definities zijn handig maar nooit 100% sluitend." },
      { prompt: "Welke uitspraak over soortverschillen is FOUT?", options: ["A. Soorten kunnen verschillen in DNA", "B. Soorten kunnen verschillen in uiterlijk", "C. Twee dieren die in hetzelfde gebied leven, zijn automatisch dezelfde soort", "D. Soorten kunnen verschillen in gedrag"], answer: "C", explanation: "In hetzelfde gebied kunnen veel verschillende soorten naast elkaar leven (bv. een bos vol verschillende vogels, insecten, planten). Andersom kan één soort in meerdere gebieden leven." },
      { prompt: "Insecten vormen de grootste groep dieren op aarde — er zijn miljoenen verschillende soorten. Geef 2 redenen waarom er zoveel insectensoorten zijn ontstaan.", answer: "1) Hun kleine lichaam maakt veel verschillende leefplekken (niches) mogelijk. 2) Snelle voortplanting = veel generaties = snelle evolutie. 3) Vliegvermogen = nieuwe gebieden bereiken. 4) Hard pantser = goed beschermd.", explanation: "Kleiner organisme + sneller voortplanten + meer niches = meer kans op nieuwe soorten." }
    ]
  },
  {
    id: "bio-3.2-hard",
    title: "🔥 3.2 — Biodiversiteit (pittig)",
    questions: [
      { prompt: "Een populatie panda's bestaat uit 100 dieren met bijna identiek DNA. Wat is het GROOTSTE risico?", options: ["A. Te veel concurrentie", "B. Lage genetische diversiteit — één ziekte kan de hele populatie raken", "C. Ze zullen muteren", "D. Ze worden te groot"], answer: "B", explanation: "Biodiversiteit is niet alleen aantal SOORTEN, maar ook variatie BINNEN een soort. Als alle individuen bijna identiek zijn, kan één ziekte de hele populatie wegvagen." },
      { prompt: "Geef een concreet voorbeeld waarom verlies van biodiversiteit slecht is voor de geneeskunde.", answer: "Veel medicijnen komen uit planten of dieren. Bijvoorbeeld: aspirine uit wilgenbast, taxol (kankermedicijn) uit de taxusboom, penicilline uit een schimmel. Als soorten uitsterven voordat we ze onderzocht hebben, missen we mogelijke medicijnen.", explanation: "~25% van moderne medicijnen komt oorspronkelijk uit planten." },
      { prompt: "Waarom hebben koraalriffen zoveel biodiversiteit?", options: ["A. Omdat het koud is", "B. Warm helder water, veel licht, en de complexe structuur biedt veel schuilplaatsen en voedselbronnen", "C. Omdat mensen ze beschermen", "D. Omdat er weinig stroming is"], answer: "B", explanation: "Koraal zelf is dier én huis — het maakt een 3D-landschap vol holletjes en spleten. Daardoor vinden honderden vis- en schaaldiersoorten plek om te leven." },
      { prompt: "Vroeger plantten boeren wereldwijd één soort banaan (de Gros Michel). In de jaren '50 werd die bijna helemaal weggevaagd door een schimmel. Leg uit wat hier gebeurde — en wat dit ons leert over biodiversiteit.", answer: "Alle Gros Michel-bananen waren genetisch identiek (klonen). Toen er een schimmel kwam die deze soort kon aantasten, was er geen enkele variant resistent. Les: lage genetische diversiteit maakt populaties extreem kwetsbaar voor ziektes.", explanation: "Hetzelfde gevaar geldt nu voor de Cavendish-banaan die we nu eten. Monoculturen = risico." }
    ]
  },
  {
    id: "bio-3.3-hard",
    title: "🔥 3.3 — Evolutie (pittig)",
    questions: [
      { prompt: "Een giraffe rekt elke dag zijn nek om bij hoge bladeren te komen. Volgens Darwin's natuurlijke selectie betekent dit dat...", options: ["A. De nek van die giraffe steeds langer wordt en hij dat doorgeeft aan zijn jongen", "B. Giraffes die toevallig al een langere nek hadden, meer overlevingskans hadden — hun jongen ook", "C. Het DNA van de giraffe verandert door het rekken", "D. Alle giraffes precies even lang worden"], answer: "B", explanation: "Klassieke valkuil. Antwoord A is de THEORIE VAN LAMARCK — die was fout. Darwin: variatie bestaat al, omgeving selecteert. Eigenschappen die je tijdens je leven verkrijgt, geef je NIET door aan kinderen." },
      { prompt: "Waarom leiden de meeste mutaties NIET tot evolutie?", answer: "Omdat de meeste mutaties geen effect hebben (neutraal) of juist schadelijk zijn — die organismen sterven of krijgen geen nakomelingen. Alleen mutaties die een voordeel geven én worden doorgegeven, kunnen evolutie sturen.", explanation: "Mutaties zijn willekeurig, maar selectie is niet willekeurig." },
      { prompt: "Een boer spuit insecticide op zijn akker. In het begin sterven bijna alle insecten. Na 5 jaar werkt het middel nauwelijks meer. Leg uit wat er biologisch is gebeurd.", answer: "Een paar insecten hadden van nature een mutatie waardoor ze ongevoelig waren voor het middel. Die overleefden en plantten zich voort. Hun resistente nakomelingen vormden steeds een groter deel van de populatie. Na 5 jaar zijn bijna alle insecten resistent — natuurlijke selectie in versneld tempo.", explanation: "Gebeurt nu écht op grote schaal: resistente bacteriën tegen antibiotica, resistente onkruiden tegen herbiciden." },
      { prompt: "'Survival of the fittest' betekent...", options: ["A. Het sterkste dier overleeft", "B. Het dier dat het best aangepast is aan zijn omgeving overleeft en plant zich voort", "C. Het slimste dier wint", "D. Het grootste dier eet de rest op"], answer: "B", explanation: "Veelgemaakte fout: 'fittest' betekent NIET 'sterkste'. Een kleine, snelle muis kan 'fitter' zijn dan een grote olifant in zijn eigen omgeving." },
      { prompt: "Als natuurlijke selectie altijd de beste aanpassing kiest, waarom zijn organismen dan niet 'perfect'? Geef minimaal 2 redenen.", answer: "1) De omgeving verandert constant — aanpassingen lopen altijd achter. 2) Evolutie werkt alleen met bestaande variatie, niet vanaf nul. 3) Trade-offs: voordeel in één ding kan nadeel zijn in iets anders. 4) Toeval speelt ook een rol.", explanation: "Voorbeeld: het oog van mensen heeft een blinde vlek. Een octopus heeft dat probleem niet. Evolutie werkt met wat er al is." }
    ]
  },
  {
    id: "bio-3.4-hard",
    title: "🔥 3.4 — Stambomen (pittig)",
    questions: [
      { prompt: "Op een stamboom zie je: mens, chimpansee, gorilla, orang-oetan. Mens en chimpansee zitten op dezelfde tak. Wat betekent dit?", options: ["A. Mensen stammen af van chimpansees", "B. Mens en chimpansee hebben een recentere gemeenschappelijke voorouder dan met de gorilla", "C. Chimpansees zijn 'meer ontwikkeld' dan gorilla's", "D. Mens en chimpansee zijn identiek"], answer: "B", explanation: "Mega belangrijke valkuil! Mensen stammen NIET af van chimpansees — we delen een gemeenschappelijke VOOROUDER. Die voorouder leefde ~6 miljoen jaar geleden. Beide takken zijn sindsdien evenlang aan het evolueren." },
      { prompt: "Waarom zitten er gaten in het fossielenarchief (geen 'missing links' voor alle dieren)?", options: ["A. Omdat evolutie sprongen maakt", "B. Omdat lang niet alle gestorven dieren fossielen worden — vooral zachte delen niet", "C. Omdat wetenschappers niet goed hebben gezocht", "D. Omdat evolutie niet bestaat"], answer: "B", explanation: "Fossilisatie is zeldzaam. Voor elk fossiel dat we vinden, zijn er miljoenen organismen geweest waarvan niets overbleef." },
      { prompt: "Hoe weten wetenschappers hoe OUD een fossiel is?", answer: "Door de leeftijd van de aardlaag waarin het fossiel zit te bepalen — diepere lagen zijn meestal ouder (relatieve datering). En door radioactieve isotopen in het fossiel of de aardlaag te meten; die vervallen met een bekende snelheid (absolute datering).", explanation: "Zo weten we dat de dinosaurussen ~66 miljoen jaar geleden uitstierven, en dat het eerste leven ~3,8 miljard jaar oud is." },
      { prompt: "Een walvis is een zoogdier, maar zwemt in zee net als vissen. Wat zegt de stamboom hierover?", options: ["A. Walvissen stammen af van vissen", "B. Walvissen stammen af van landzoogdieren die later terug naar zee gingen", "C. Walvissen en vissen zijn dezelfde soort", "D. Walvissen zijn vissen geworden door evolutie"], answer: "B", explanation: "Walvissen hebben longen, geven melk, en hebben skeletresten van achterpoten — bewijs dat hun voorouders op land liepen. Ze gingen ~50 miljoen jaar geleden terug naar zee." }
    ]
  },
  {
    id: "bio-3.5-hard",
    title: "🔥 3.5 — Verleden (pittig)",
    questions: [
      { prompt: "Wat is een belangrijk GEVOLG van een massa-extinctie, naast het uitsterven van veel soorten?", options: ["A. De aarde stopt met draaien", "B. Er ontstaat ruimte voor nieuwe soorten om de vrijgekomen niches op te vullen", "C. Alle leven verdwijnt definitief", "D. Het klimaat blijft voor altijd hetzelfde"], answer: "B", explanation: "Massa-extincties zijn paradoxaal: ze veroorzaken evolutie. Na de dinosaurussen kregen zoogdieren (waaronder onze voorouders) de ruimte om te diversifiëren. Zonder die meteoriet zouden wij niet bestaan." },
      { prompt: "Wanneer verschenen de eerste mensen op aarde?", options: ["A. ~300.000 jaar geleden", "B. ~65 miljoen jaar geleden", "C. Tegelijk met de dinosaurussen", "D. ~5 miljoen jaar geleden"], answer: "A", explanation: "Heel recent in aardse geschiedenis! Als je de hele geschiedenis van de aarde inkort tot 24 uur, verschijnt de mens pas in de laatste paar seconden voor middernacht." },
      { prompt: "Welk tijdperk duurde het langst op aarde?", options: ["A. Het tijdperk van de mens", "B. Het tijdperk van de dinosaurussen (~165 miljoen jaar)", "C. De ijstijd", "D. De middeleeuwen"], answer: "B", explanation: "Dinosaurussen domineerden ~165 miljoen jaar. Mensen bestaan pas ~300.000 jaar — minder dan 0,2% van de dinotijd." },
      { prompt: "Het leven op aarde bestaat al 3,8 miljard jaar. Waarom is de mens pas zo laat verschenen?", answer: "Evolutie heeft enorm veel tijd nodig om complexe organismen te ontwikkelen. Eerst eencellig leven, daarna meercellig, daarna planten en dieren in zee, dan op land, dan gewervelden, zoogdieren, primaten, en uiteindelijk pas mensen. Elke stap kostte miljoenen jaren.", explanation: "Het meeste 'evolutiewerk' zat in het maken van complex meercellig leven uit eenvoudige cellen. Dat duurde miljarden jaren." }
    ]
  },
  {
    id: "bio-3.6-hard",
    title: "🔥 3.6 — Uitsterven (pittig)",
    questions: [
      { prompt: "Wetenschappers zeggen dat we nu mogelijk in een 6e massa-extinctie zitten. Wat is het GROOTSTE verschil met de vorige 5?", options: ["A. Deze gaat veel langzamer", "B. Deze wordt veroorzaakt door één soort: de mens", "C. Deze treft alleen dieren, geen planten", "D. Deze is een mythe"], answer: "B", explanation: "De vorige 5 werden veroorzaakt door natuurlijke gebeurtenissen (meteoriet, vulkaan, klimaat). De 6e wordt veroorzaakt door één soort: wij. Soorten sterven nu 100-1000× sneller uit dan normaal." },
      { prompt: "Op een continent leeft één vogelsoort. De vogels in het noorden migreren naar het zuiden, maar door een nieuw ontstaan gebergte kunnen ze elkaar niet meer bereiken. Na 100.000 jaar zijn er TWEE soorten. Hoe heet dit proces?", options: ["A. Mutatie", "B. Geografische isolatie (soortvorming door isolatie)", "C. Convergente evolutie", "D. Massa-extinctie"], answer: "B", explanation: "Klassiek voorbeeld van soortvorming. Een fysieke barrière (berg, rivier, zee) scheidt een populatie. Beide kanten evolueren apart, tot ze geen vruchtbare jongen meer kunnen krijgen samen." },
      { prompt: "Eilanden hebben vaak unieke soorten die nergens anders voorkomen. Leg uit waarom dat zo is — en waarom deze soorten extra kwetsbaar zijn voor uitsterven.", answer: "Dieren die op een eiland geïsoleerd raken, evolueren apart van de rest. Na vele generaties zijn het unieke soorten. Ze zijn kwetsbaar omdat: 1) populaties klein zijn (één ramp kan ze wegvagen), 2) er geen 'reservepopulatie' elders is, 3) ze vaak geen ervaring hebben met roofdieren of concurrenten van buitenaf.", explanation: "Voorbeeld: de dodo op Mauritius. Geen roofdieren, dus geen vluchtinstinct. Toen mensen kwamen met ratten en honden, was hij binnen 80 jaar uitgestorven." },
      { prompt: "Een walvis en een vis lijken qua bouw veel op elkaar (stroomlijn, vinnen), maar zijn niet nauw verwant. Wat verklaart hun gelijkenis?", options: ["A. Walvissen stammen direct af van vissen", "B. Ze hebben zich onafhankelijk aangepast aan dezelfde omgeving — water", "C. Toeval", "D. Ze zijn dezelfde soort"], answer: "B", explanation: "Dit heet CONVERGENTE evolutie: dezelfde leefomgeving levert dezelfde oplossingen. Vleugels van vogels en vleermuizen zijn een ander voorbeeld." }
    ]
  },
  {
    id: "bio-samenvatting-hard",
    title: "🔥 Eindtoets — Samenvatting (pittig)",
    questions: [
      { prompt: "Welke van deze uitspraken is FOUT?", options: ["A. Mensen stammen af van apen", "B. Mens en chimpansee hebben een gemeenschappelijke voorouder", "C. Evolutie gebeurt nog steeds", "D. Bacteriën evolueren sneller dan grote dieren"], answer: "A", explanation: "Mensen stammen NIET af van apen — we delen een gemeenschappelijke voorouder. Die voorouder was géén chimpansee. Beide takken zijn sindsdien evenlang aan het evolueren in hun eigen richting." },
      { prompt: "Een nieuwe ziekte komt op aarde. Sommige dieren in een populatie hebben toevallig een gen dat hen beschermt. Voorspel wat er met de populatie gaat gebeuren over 100 generaties.", answer: "Dieren zonder het beschermende gen sterven of krijgen minder nakomelingen. Dieren met het gen overleven en planten zich voort. Hun nakomelingen erven dat gen. Na 100 generaties heeft bijna de hele populatie het beschermende gen. Dit is natuurlijke selectie.", explanation: "Hoe sterker de selectiedruk (ziekte = leven of dood), hoe sneller een eigenschap zich verspreidt." },
      { prompt: "Wat is het verband tussen massa-extincties en het ontstaan van nieuwe soorten?", answer: "Massa-extincties laten niches (plekken in een ecosysteem) leeg achter. Overlevende soorten kunnen deze niches opvullen en zich daar aan aanpassen. Zo ontstaan nieuwe soorten. Zonder de uitsterving van de dinosaurussen waren zoogdieren (en wij) waarschijnlijk nooit zo groot en divers geworden.", explanation: "Uitsterven is dus niet alleen een einde — het is ook een nieuw begin voor andere soorten." },
      { prompt: "Een nieuwe soort ontstaat het snelst wanneer...", options: ["A. Een populatie heel groot is", "B. Een populatie geïsoleerd raakt in een nieuwe omgeving met andere selectiedruk", "C. Het klimaat constant blijft", "D. Er geen mutaties zijn"], answer: "B", explanation: "Drie ingrediënten voor snelle soortvorming: isolatie (geen genuitwisseling), nieuwe selectiedruk (andere omgeving), en variatie (mutaties). Eilanden zijn perfecte recepten." },
      { prompt: "Welke combinatie is GEEN bewijs voor evolutie?", options: ["A. Fossielen die geleidelijke veranderingen tonen", "B. DNA-overeenkomsten tussen verschillende soorten", "C. Homologe organen (zelfde botten in mens, walvis, vleermuis)", "D. Dat alle dieren ogen hebben"], answer: "D", explanation: "A, B en C zijn klassieke evolutiebewijzen. D klopt niet eens (lang niet alle dieren hebben ogen), en al hadden ze die wél, dan zou dat geen bewijs zijn. Convergente evolutie kan vergelijkbare structuren bij niet-verwante soorten verklaren." },
      { prompt: "Vroeger gebruikten artsen veel verschillende antibiotica. Nu werken sommige antibiotica nauwelijks meer tegen bacteriële infecties. Leg uit waarom — en wat dit betekent voor de geneeskunde.", answer: "Bacteriën met een toevallige mutatie die hen resistent maakt, overleefden de antibiotica. Die plantten zich voort. Na vele generaties zijn de meeste bacteriën resistent. Dit is natuurlijke selectie in versneld tempo. Voor de geneeskunde betekent dit dat infecties die vroeger makkelijk te behandelen waren, nu weer dodelijk kunnen zijn — en dat we constant nieuwe antibiotica moeten ontwikkelen.", explanation: "Antibioticaresistentie is een van de grootste medische problemen van deze eeuw. Levend bewijs dat evolutie nu nog steeds gebeurt." }
    ]
  }
];
