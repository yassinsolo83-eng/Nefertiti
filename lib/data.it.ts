// Italian version of the built-in texts in lib/data.ts.
// They are used on the /it pages whenever the Studio has no Italian text for something.

import type { PageTexts } from '@/lib/data'

type DestText = { title: string; tagline: string; feeling: string; desc: string; experiences: string[]; idealFor: string[] }

export const destinationsIt: Record<string, DestText> = {
  cairo: {
    title: 'Il Cairo e Giza',
    tagline: 'Dove l\'antico incontra il contemporaneo',
    feeling: 'Ritmo · Storia · Connessione',
    desc: 'Per chi guida ritiri e vuole unire benessere, storia, cultura, gastronomia e lusso contemporaneo.',
    experiences: [
      'Piramidi di Giza', 'Grande Museo Egizio', 'Yoga e meditazione all\'alba',
      'Esperienze sul Nilo', 'Il Cairo storico', 'Via Al-Muizz', 'Hammam tradizionali',
      'Esperienze gastronomiche egiziane', 'Hotel di lusso', 'Cene sui rooftop',
      'Laboratori artistici e culturali', 'Esperienze con artigiani locali',
    ],
    idealFor: ['Benessere culturale', 'Ritiri al femminile', 'Crescita personale', 'Mindfulness', 'Ritiri di leadership', 'Multi-destinazione'],
  },
  'red-sea': {
    title: 'Il Mar Rosso',
    tagline: 'Spazio per respirare',
    feeling: 'Sale · Luce · Ampiezza',
    desc: 'El Gouna, Hurghada, Soma Bay e altre località selezionate del Mar Rosso offrono un ritmo più lento, costruito attorno all\'acqua, al movimento, alla natura e al benessere in resort.',
    experiences: [
      'Yoga in spiaggia', 'Meditazione all\'alba', 'Giornate in barca privata', 'Snorkeling e nuoto',
      'Breathwork in riva al mare', 'Trattamenti spa', 'Sound healing', 'Attività in acqua',
      'Soggiorni in resort di lusso', 'Sessioni al tramonto', 'Esperienze in yacht', 'Combinazioni deserto e mare',
    ],
    idealFor: ['Yoga', 'Fitness', 'Pilates', 'Mindfulness', 'Breathwork', 'Benessere di lusso', 'Benessere aziendale'],
  },
  luxor: {
    title: 'Luxor',
    tagline: 'Dove il tempo si ferma',
    feeling: 'Antico · Cerimoniale · Senza tempo',
    desc: 'Il più grande museo a cielo aperto del mondo. Templi, tombe e la Riva Occidentale sono uno sfondo profondo per ritiri costruiti attorno a storia, cerimonia e riflessione. Pratica al mattino. Giornate di esplorazione. Pomeriggi tranquilli sul Nilo.',
    experiences: [
      'Mongolfiera all\'alba', 'Karnak e Tempio di Luxor', 'Valle dei Re',
      'Yoga con vista sul Nilo', 'Esperienze sulla Riva Occidentale', 'Meditazioni nei templi',
      'Cene private', 'Sessioni al tramonto sul fiume', 'Racconti e storie della cultura',
    ],
    idealFor: ['Immersione culturale', 'Mindfulness', 'Crescita personale', 'Yoga', 'Viaggi trasformativi', 'Ritiri premium'],
  },
  siwa: {
    title: 'Oasi di Siwa',
    tagline: 'Disconnettersi per riconnettersi',
    feeling: 'Silenzio · Abbandono · Senza tempo',
    desc: 'Circondata da deserto, palmeti, sorgenti naturali e laghi salati, Siwa offre un ambiente intimo per piccoli gruppi che cercano riservatezza e immersione profonda.',
    experiences: [
      'Esperienze nei laghi salati', 'Escursioni nel deserto', 'Sorgenti naturali', 'Meditazione e breathwork',
      'Osservazione delle stelle', 'Cucina e cultura locale', 'Sessioni nel palmeto', 'Tramonti nel deserto',
      'Journaling', 'Cerchi in piccoli gruppi', 'Artigianato tradizionale',
    ],
    idealFor: ['Ritiri intimi', 'Mindfulness', 'Ritiri al femminile', 'Ritiri creativi', 'Digital detox', 'Rallentare'],
  },
  desert: {
    title: 'Il Deserto',
    tagline: 'Il silenzio ha un linguaggio tutto suo',
    feeling: 'Quiete · Stelle · Spazio',
    desc: 'Il deserto egiziano offre a chi guida un ritiro qualcosa di completamente diverso da un resort tradizionale. Spazi aperti e poche distrazioni creano uno scenario straordinario per riflessione, creatività e connessione.',
    experiences: [
      'Meditazione e breathwork', 'Journaling', 'Cerimonie sonore', 'Cerchi di donne',
      'Camminate consapevoli', 'Osservazione delle stelle', 'Cene nel deserto', 'Pratiche all\'alba',
      'Esperienze notturne nel deserto', 'Cerimonie private', 'Digital detox',
    ],
    idealFor: ['Meditazione', 'Mindfulness', 'Ritiri spirituali', 'Cerchi di donne', 'Ritiri creativi', 'Crescita personale'],
  },
  aswan: {
    title: 'Assuan',
    tagline: 'L\'anima del Nilo',
    feeling: 'Nubiano · Sereno · Dorato',
    desc: 'Il tratto più pacifico del Nilo in Egitto: villaggi nubiani, navigazione in feluca e luce dorata. Un ambiente lento e ricco di anima per ritiri costruiti attorno ad acqua, cultura e quiete.',
    experiences: ['Navigazione in feluca e dahabiya', 'Villaggi e cultura nubiana', 'Meditazione lungo il fiume', 'Visite al Tempio di Philae', 'Sessioni al tramonto sul fiume', 'Yoga con vista sul Nilo', 'Racconti e storie della cultura'],
    idealFor: ['Immersione culturale', 'Mindfulness', 'Viaggi trasformativi', 'Yoga', 'Ritiri premium'],
  },
  countryside: {
    title: 'Campagna e fattorie del Cairo',
    tagline: 'Rallenta. Torna alla natura.',
    feeling: 'Verde · Radicato · Rigenerante',
    desc: 'Poco fuori dal Cairo, fattorie, giardini e tenute agricole offrono un ambiente radicato e nutriente: vicino alla città, ma a un mondo di distanza.',
    experiences: ['Cene dal produttore alla tavola', 'Yoga in giardino', 'Laboratori di nutrizione', 'Passeggiate nella natura', 'Digital detox', 'Rituali di slow living', 'Sessioni di erbe e benessere'],
    idealFor: ['Ritiri di nutrizione', 'Digital detox', 'Ritiri creativi', 'Ritiri per team'],
  },
  fayoum: {
    title: 'Fayoum',
    tagline: 'La natura a portata di mano',
    feeling: 'Laghi · Deserto · Leggerezza',
    desc: 'Laghi, cascate, deserto e villaggi di ceramisti a breve distanza dal Cairo: una fuga accessibile per ritiri di fine settimana e di breve durata.',
    experiences: ['Yoga sul lago', 'Meditazione nel deserto', 'Laboratori di ceramica', 'Visite alle cascate', 'Sessioni al tramonto', 'Cerchi creativi', 'Immersione nella natura'],
    idealFor: ['Ritiri di fine settimana', 'Creatività', 'Yoga', 'Programmi nella natura'],
  },
  dahab: {
    title: 'Dahab e Sinai meridionale',
    tagline: 'Montagne. Mare. Semplicità.',
    feeling: 'Autentico · Libero · Elementare',
    desc: 'Una cittadina costiera rilassata, incorniciata da montagne e Mar Rosso: elementare, tranquilla e perfetta per un benessere legato all\'avventura.',
    experiences: ['Yoga in spiaggia', 'Apnea e snorkeling', 'Escursioni in montagna', 'Breathwork in riva al mare', 'Esperienze beduine', 'Osservazione delle stelle', 'Sound healing'],
    idealFor: ['Benessere e avventura', 'Yoga', 'Breathwork', 'Fitness'],
  },
  'marsa-alam': {
    title: 'Marsa Alam',
    tagline: 'Il Mar Rosso selvaggio',
    feeling: 'Incontaminato · Quieto · Blu',
    desc: 'Uno dei tratti più incontaminati del Mar Rosso: barriere coralline intatte, resort tranquilli e spazio per staccare completamente.',
    experiences: ['Giornate private sulla barriera', 'Meditazione in spiaggia', 'Snorkeling e immersioni', 'Yoga in riva all\'acqua', 'Immersione nella natura', 'Breathwork al tramonto', 'Digital detox'],
    idealFor: ['Ritiri nella natura', 'Mindfulness', 'Yoga', 'Digital detox'],
  },
  sharm: {
    title: 'Sharm El Sheikh',
    tagline: 'Il benessere dei resort incontra il Sinai',
    feeling: 'Comfort · Mare · Leggerezza',
    desc: 'Resort di livello mondiale, facile accesso internazionale e la costa del Sinai: ideale per gruppi numerosi e benessere aziendale.',
    experiences: ['Giornate nella spa del resort', 'Yoga di gruppo', 'Escursioni in barca', 'Programmi di benessere', 'Attività di team', 'Sessioni al tramonto', 'Combinazioni mare e deserto'],
    idealFor: ['Gruppi numerosi', 'Benessere aziendale', 'Benessere di lusso'],
  },
  'soma-bay': {
    title: 'Soma Bay',
    tagline: 'Benessere in riva all\'acqua',
    feeling: 'Calma · Premium · Spazioso',
    desc: 'Una penisola serena, nota per i resort di benessere premium, le spa di talassoterapia e un ritmo più lento e raffinato in riva al mare.',
    experiences: ['Spa di talassoterapia', 'Yoga in spiaggia', 'Breathwork', 'Sessioni private di benessere', 'Golf e movimento', 'Sound healing', 'Ritiri per dirigenti'],
    idealFor: ['Benessere premium', 'Yoga', 'Benessere per dirigenti'],
  },
  'north-coast': {
    title: 'Costa Nord',
    tagline: 'L\'Egitto mediterraneo',
    feeling: 'Luminoso · Ventilato · Conviviale',
    desc: 'La costa mediterranea dell\'Egitto: luminosa, ventilata e conviviale, al meglio per il benessere estivo e i ritiri attivi.',
    experiences: ['Fitness in spiaggia', 'Yoga al mattino', 'Nuoto in mare', 'Benessere sociale', 'Movimento al tramonto', 'Programmi di gruppo', 'Sessioni estive'],
    idealFor: ['Benessere estivo', 'Fitness', 'Ritiri aziendali'],
  },
}

export const combinationsIt = [
  'Il Cairo + Mar Rosso',
  'Il Cairo + Fayoum',
  'Il Cairo + Siwa',
  'Il Cairo + Luxor + Assuan',
  'Luxor + Crociera sul Nilo + Assuan',
  'Il Cairo + Campagna + Mar Rosso',
  'Il Cairo + Deserto + Mar Rosso',
  'Il Cairo + Luxor + Mar Rosso',
]

// Same order as `experiences` in lib/data.ts
export const experiencesIt = [
  { title: 'Rituali dell\'hammam', text: 'Rituali tradizionali egiziani di purificazione, vapore e antiche pratiche di bellezza.' },
  { title: 'Sound healing', text: 'Gong, campane tibetane e respiro in spazi pensati per un ascolto profondo.' },
  { title: 'Tramonti in feluca', text: 'Navigazione privata sul Nilo mentre il cielo si tinge d\'oro.' },
  { title: 'Yoga all\'alba', text: 'Movimento all\'alba, accanto alle Piramidi, al mare o al deserto.' },
  { title: 'Breathwork nel deserto', text: 'Cielo aperto, silenzio e respiro nel paesaggio più antico dell\'Egitto.' },
  { title: 'Laboratori di bellezza egiziana', text: 'Oli naturali, erbe e rituali tradizionali per la cura della pelle.' },
  { title: 'Danza del ventre', text: 'Autentica danza orientale egiziana: espressiva, gioiosa e radicata in secoli di tradizione.' },
  { title: 'Yoga galleggiante', text: 'Yoga praticato sull\'acqua: equilibrio, respiro e quiete sostenuti dolcemente dalla superficie.' },
]

// Same order as `serviceTiers` in lib/data.ts
export const serviceTiersIt = [
  {
    title: 'CONSULENZA SUL RITIRO',
    desc: 'Per i coach che hanno un\'idea ma hanno bisogno di aiuto per trasformarla in un ritiro realizzabile.',
    items: ['Sessione conoscitiva', 'Consulenza sulla destinazione', 'Sviluppo del concept', 'Itinerario preliminare', 'Consigli sulle strutture', 'Quadro del budget'],
  },
  {
    title: 'PROGETTAZIONE E PIANIFICAZIONE DEL RITIRO',
    desc: 'Per i coach che vogliono sviluppare insieme a noi l\'intero ritiro.',
    items: ['Tutto ciò che è incluso nella Consulenza', 'Itinerario dettagliato', 'Ricerca degli alloggi', 'Trattative con gli hotel', 'Trasporti', 'Ricerca delle attività', 'Fornitori di benessere', 'Gestione del budget'],
  },
  {
    title: 'PRODUZIONE COMPLETA DEL RITIRO',
    desc: 'Il nostro servizio completo, dall\'inizio alla fine. Tu arrivi e guidi. Noi gestiamo l\'esperienza.',
    items: ['Progettazione completa', 'Gestione degli hotel', 'Transfer dall\'aeroporto', 'Gestione dei fornitori', 'Produzione sul posto', 'Coordinamento fotografico', 'Supporto multilingue'],
  },
]

// Same order as `steps` in lib/data.ts
export const stepsIt: [string, string][] = [
  ['PARLIAMONE', 'Raccontaci della tua pratica, della tua community, delle date che preferisci, del numero di persone e del budget.'],
  ['COMPRENDIAMO LA TUA VISIONE', 'Esploriamo cosa vuoi che i tuoi ospiti sentano, imparino e vivano.'],
  ['CREIAMO IL CONCEPT', 'Ti consigliamo destinazioni, alloggi ed esperienze adatti al tuo ritiro.'],
  ['RICEVI LA TUA PROPOSTA', 'Un concept di ritiro su misura, con itinerario, logistica e budget.'],
  ['LO COSTRUIAMO', 'Una volta approvata la proposta, iniziamo con prenotazioni, trattative e produzione.'],
  ['PORTI LA TUA COMMUNITY', 'Tu ti concentri sulla preparazione del tuo programma e dei tuoi ospiti.'],
  ['BENVENUTI IN EGITTO', 'Il nostro team ti accoglie e gestisce il ritiro sul posto.'],
  ['TU GUIDI. NOI PRODUCIAMO.', 'Tu ti dedichi a ciò che sai fare meglio. Noi restiamo dietro le quinte.'],
]

export const faqsIt: [string, string][] = [
  [
    'Devo aver già organizzato un ritiro?',
    'Assolutamente no. Molti dei nostri ospiti stanno organizzando il loro primo ritiro. Ti guidiamo in ogni decisione, dal concept e dalla destinazione fino al più piccolo dettaglio sul posto.',
  ],
  [
    'Che tipo di ritiri producete?',
    'Yoga, meditazione, breathwork, sound healing, cerchi di donne, coaching intensivi, benessere aziendale e altro ancora. Se la tua pratica genera trasformazione, possiamo costruire un ritiro attorno ad essa.',
  ],
  [
    'Con quanto anticipo dovremmo iniziare a pianificare?',
    'Idealmente da quattro a sei mesi prima delle date desiderate. Detto questo, abbiamo prodotto bellissimi ritiri anche con tempi più brevi: scrivici e ti diremo onestamente cosa è possibile.',
  ],
  [
    'Potete occuparvi di tutto o solo di una parte?',
    'Entrambe le cose. Scegli la produzione completa e gestiamo ogni elemento, oppure seleziona il supporto per singole parti (strutture, esperienze, logistica) mantenendo il controllo del resto.',
  ],
  [
    'Quanto costa un ritiro con Nefertiti?',
    'Ogni ritiro è su misura, quindi il prezzo dipende da destinazione, numero di persone, durata ed esperienze scelte. Raccontaci la tua visione e costruiremo intorno ad essa una proposta trasparente.',
  ],
]

export const appointmentServicesIt = [
  'Consulenza sul ritiro',
  'Progettazione e pianificazione del ritiro',
  'Produzione completa del ritiro',
  'Ricerca della destinazione',
  'Viaggio multi-destinazione',
  'Ritiro di benessere aziendale',
  'Non lo so ancora',
]

export const homeStatLabelsIt = [
  'Anni di produzione di eventi',
  'Destinazioni in tutto l\'Egitto',
  'Su misura: non ci sono due ritiri uguali',
  'Possibilità per il tuo ritiro',
]

export const whatsappMessageIt = 'Ciao Nefertiti! Vorrei prenotare una call conoscitiva per organizzare un ritiro in Egitto.'

export const destinationTravelIt: Record<string, string> = {
  countryside: '~1 ora in auto',
  fayoum: '~1,5-2 ore in auto',
  'north-coast': '~3 ore in auto',
  siwa: '~8 ore in auto',
  desert: '~6-7 ore in auto',
  'red-sea': '~1 ora di volo · ~5 ore in auto',
  'soma-bay': '~1 ora di volo · ~5,5 ore in auto',
  'marsa-alam': '~1,25 ore di volo · ~8 ore in auto',
  luxor: '~1,25 ore di volo · ~10 ore in auto · ~10 ore in treno notturno',
  aswan: '~1,5 ore di volo · ~13,5 ore in treno notturno',
  sharm: '~1 ora di volo · ~6 ore in auto',
  dahab: '~1 ora di volo fino a Sharm + ~1,25 ore di transfer',
}

type DetailText = { overview: string; bestTime: string; highlights: { title: string; desc: string }[] }

// Highlights keep the order of lib/data.ts
export const destinationDetailsIt: Record<string, DetailText> = {
  cairo: {
    overview:
      'Il Cairo è una città che non sta mai ferma, ma nel suo ritmo c\'è profondità. Il tuo ritiro qui si muove tra monumenti antichi, incontri culturali intimi e lusso raffinato. È il luogo in cui storia e trasformazione si incontrano.',
    highlights: [
      { title: 'Le Piramidi all\'alba', desc: 'Inizia la giornata con movimento e meditazione ai piedi dell\'ultima meraviglia antica ancora in piedi.' },
      { title: 'Esperienze sul Nilo', desc: 'Navigazione privata in feluca, sessioni al tramonto sul fiume e cene sull\'acqua: il Nilo come sfondo del tuo ritiro.' },
      { title: 'Hammam tradizionali', desc: 'Antichi rituali di bagno in ambienti storici: purificazione, calore e quiete.' },
      { title: 'Hotel di lusso e ristorazione', desc: 'Alloggi di livello mondiale con cene sui rooftop, suite benessere private e viste sulla città.' },
      { title: 'Laboratori artistici e culturali', desc: 'Esperienze con artigiani locali, calligrafia, laboratori di cucina egiziana e visite a gallerie contemporanee.' },
    ],
    bestTime: 'Da ottobre ad aprile',
  },
  'red-sea': {
    overview:
      'Il Mar Rosso crea un ritmo fatto di acqua, luce e spazio aperto. Che il tuo ritiro sia incentrato su yoga, breathwork, fitness o semplicemente sul rallentare, la costa offre il contenitore perfetto.',
    highlights: [
      { title: 'Yoga e movimento in spiaggia', desc: 'Pratica quotidiana in riva al mare: il suono delle onde, l\'aria salmastra e la luce del mattino.' },
      { title: 'Giornate in barca privata', desc: 'Esperienze in yacht e in barca: snorkeling, nuoto e sessioni di breathwork in mare aperto.' },
      { title: 'Spa e benessere', desc: 'Talassoterapia, trattamenti, sound healing e sessioni private di benessere in contesti di resort.' },
      { title: 'Sessioni al tramonto', desc: 'L\'ora d\'oro in riva al mare: meditazione, journaling e cerchi di gruppo mentre il cielo cambia colore.' },
      { title: 'Barriera corallina e attività in acqua', desc: 'Snorkeling, immersioni e nuoto in alcune delle acque più limpide del mondo.' },
    ],
    bestTime: 'Tutto l\'anno (alta stagione: marzo – maggio, settembre – novembre)',
  },
  luxor: {
    overview:
      'Luxor non è solo una destinazione: è una soglia. Templi costruiti per la trasformazione, un fiume che ha visto passare millenni e una luce che cambia tutto ciò che tocca. I ritiri qui hanno un peso e una bellezza che non si trovano altrove.',
    highlights: [
      { title: 'Mongolfiera all\'alba', desc: 'Fluttua sopra la Valle dei Re all\'alba: una delle aperture più potenti per una giornata di ritiro.' },
      { title: 'Meditazioni nei templi', desc: 'Pratica in spazi pensati per il rituale: Karnak, il Tempio di Luxor, la Riva Occidentale.' },
      { title: 'Yoga con vista sul Nilo', desc: 'Movimento mattutino in strutture boutique con vista ininterrotta sul fiume.' },
      { title: 'Sessioni al tramonto sul fiume', desc: 'Navigazione in feluca, breathwork e cerchi di gruppo sul Nilo mentre la luce svanisce.' },
    ],
    bestTime: 'Da ottobre ad aprile',
  },
  siwa: {
    overview:
      'A Siwa l\'Egitto diventa un sussurro. Circondata da deserto, palmeti, sorgenti naturali e laghi salati, questa oasi remota toglie tutto il superfluo. I ritiri qui sono intimi, senza fretta e profondamente immersivi.',
    highlights: [
      { title: 'Esperienze nei laghi salati', desc: 'Galleggia nei laghi salati di Siwa, ricchi di minerali: un reset naturale per corpo e mente.' },
      { title: 'Escursioni nel deserto', desc: 'Un viaggio nel Grande Mare di Sabbia: dune, silenzio, osservazione delle stelle e campi notturni nel deserto.' },
      { title: 'Sorgenti naturali', desc: 'Sorgenti calde e fredde nascoste tra le palme: antiche, rigeneranti, private.' },
      { title: 'Stelle e cerimonie notturne', desc: 'Nessun inquinamento luminoso: il cielo del Sahara diventa il soffitto per la pratica serale.' },
    ],
    bestTime: 'Da ottobre ad aprile',
  },
  desert: {
    overview:
      'Il deserto non compete per la tua attenzione: tiene spazio. Cielo aperto, silenzio elementare e un paesaggio immutato da migliaia di anni. I ritiri qui sono spogliati di ogni distrazione e colmi di significato.',
    highlights: [
      { title: 'Meditazione e breathwork', desc: 'Pratica in uno spazio aperto: niente muri, niente rumore, niente distrazioni. Solo respiro e cielo.' },
      { title: 'Cerimonie sonore', desc: 'Campane tibetane, gong e voce si diffondono in modo diverso nel deserto: profondo, risonante, indimenticabile.' },
      { title: 'Campi notturni nel deserto', desc: 'Dormi sotto le stelle in campi curati nel deserto: il lusso incontra la natura selvaggia.' },
      { title: 'Cene nel deserto', desc: 'Cene private sotto le stelle: cibo cotto sul fuoco, lanterne, lunghi tavoli sulla sabbia.' },
    ],
    bestTime: 'Da ottobre ad aprile',
  },
}

// Italian values for lib/data.ts `pageTextDefaults`
export const pageTextDefaultsIt: PageTexts = {
  taglineWhy: 'Trova la tua pace interiore',
  taglineDestinations: 'Un viaggio di ritorno a te stesso',
  taglineRetreats: 'Oltre la fuga c\'è il rinnovamento',
  taglineTestimonials: 'Pace e spiritualità',
  howItWorksTitle: 'Dalla prima idea all\'arrivo.',
  retreatsTitle: 'PARTECIPA A UN RITIRO NEFERTITI.',
  exploreTitle: 'C\'è ancora molto da scoprire.',
  teamTitle: 'Il nostro team',
  testimonialsTitle: 'Cosa dicono le guide dei ritiri',
  experiencesTitle: 'Esperienze',
  experiencesSubtitle: 'Momenti curati, intrecciati attorno al tuo ritiro.',
  experiencesLead: 'Ogni esperienza è pensata per approfondire la connessione: con l\'Egitto, con la tua pratica e gli uni con gli altri.',
  experiencesButton: 'Progetta la mia esperienza',
  servicesTitle: 'Servizi',
  servicesSubtitle: 'Produzione di ritiri su misura, costruita sulla tua visione.',
  servicesLead: 'Scegli il livello di supporto più adatto alla tua esperienza.',
  servicesButton: 'Parliamo del tuo ritiro',
  howItWorksPageTitle: 'Come funziona',
  howItWorksPageSubtitle: 'Un percorso chiaro e guidato, dall\'idea all\'arrivo.',
  howItWorksPageLead: 'Otto passi, dal tuo primo messaggio fino a ritrovarti in Egitto con la tua community.',
  howItWorksPageButton: 'Condividi la tua idea, poi prenota una call',
  aboutTitle: 'Chi siamo',
  aboutSubtitle: 'La storia e le persone dietro Nefertiti.',
  footerTagline: 'Trova la tua pace interiore.',
  footerLine1: 'Tu guidi la trasformazione. Noi creiamo l\'esperienza.',
  footerLine2: 'Con sede tra Egitto e Italia.',
  footerLocation: 'Il Cairo · Siwa · Ovunque',
  labelWhy: 'PERCHÉ L\'EGITTO',
  labelWay: 'IL MODO NEFERTITI',
  labelHowItWorks: 'COME FUNZIONA',
  labelRetreats: 'I NOSTRI RITIRI',
  labelExplore: 'SCOPRI DI PIÙ',
  labelTeam: 'IL NOSTRO TEAM',
  labelTestimonials: 'CON LE LORO PAROLE',
  partnersEyebrow: '◆ IL NOSTRO TEAM',
  partnersTitle: 'Conosci i professionisti dietro\nil tuo percorso di guarigione',
  partnersButton: 'Diventa partner',
  collaborationsEyebrow: '◆ COLLABORAZIONI',
  collaborationsTitle: 'Le aziende e i brand\ncon cui creiamo',
  collaborationsLead: 'Nefertiti collabora con aziende e brand di tutto il mondo per creare ritiri in Egitto.',
  labelCollaborations: 'COLLABORAZIONI',
  collaborationsHomeTitle: 'Le nostre collaborazioni',
  retreatsEyebrow: '◆ RITIRI NEFERTITI',
  retreatsPageTitle: 'Ritiri',
  retreatsLead: 'I nostri ritiri in tutto l\'Egitto: piccoli gruppi, programmi curati e luoghi che restano con te a lungo dopo la partenza. Trova qui sotto il tuo prossimo viaggio.',
  retreatsListLabel: 'PROSSIMI RITIRI',
  retreatsEmptyText: 'Stiamo pianificando nuove date. Raccontaci cosa stai cercando e ti avviseremo per primo.',
  retreatsEmptyButton: 'Mettiti in contatto',
  destPageEyebrow: '◆ DESTINAZIONI',
  destPageTitle: 'Dove portiamo il tuo ritiro',
  destPageSub: 'Dalle piramidi al Mar Rosso, dalle oasi al Deserto Bianco: scegli un luogo sulla mappa e scopri cosa rende possibile.',
  destPageButton: 'Crea un ritiro in Egitto',
  footerSignoff: 'Fatto con presenza',
  navButton: 'Prenota una call',
}

// Menu names by page (the English ones come from the Studio's Site Settings → Menu)
export const menuLabelsIt: Record<string, string> = {
  '/': 'Home',
  '/about': 'Chi siamo',
  '/#vision': 'Perché l\'Egitto',
  '/destinations': 'Destinazioni',
  '/retreats': 'Ritiri',
  '/experiences': 'Esperienze',
  '/services': 'Servizi',
  '/partners': 'Partner',
  '/collaborations': 'Collaborazioni',
  '/how-it-works': 'Come funziona',
  '/contact': 'Contatti',
  '/pre-call': 'Pre-call',
}
