import type { LegalSection } from '@/components/LegalPage'

// Italian version of the Privacy Policy (same section ids and order as the English page)
export function privacySectionsIt(email: string): LegalSection[] {
  return [
    {
      id: 'who-we-are',
      heading: 'Chi è responsabile dei tuoi dati',
      body: (
        <p>
          <strong>Nefertiti Retreats</strong> (&ldquo;noi&rdquo;, &ldquo;nostro&rdquo;), con sede tra l&apos;Egitto e
          l&apos;Italia, è responsabile dei dati personali raccolti tramite questo sito. Per qualsiasi domanda o
          richiesta in materia di privacy, scrivici a <a href={`mailto:${email}`}>{email}</a>.
        </p>
      ),
    },
    {
      id: 'what-we-collect',
      heading: 'Cosa raccogliamo',
      body: (
        <>
          <p><strong>Le informazioni che ci fornisci.</strong> Quando invii una richiesta tramite il modulo di contatto raccogliamo:</p>
          <ul>
            <li>il tuo nome e indirizzo email;</li>
            <li>il tuo numero di telefono / WhatsApp (facoltativo);</li>
            <li>il tipo di ritiro che ti interessa e, se pertinente, lo specifico ritiro per cui ci scrivi;</li>
            <li>il tuo messaggio e la data e l&apos;ora in cui è stato inviato.</li>
          </ul>
          <p>
            Se ci contatti via email o su WhatsApp, riceviamo il tuo nome, i tuoi recapiti e tutto ciò che scegli di
            condividere nella conversazione. Se compili il nostro modulo pre-call, raccogliamo anche le risposte che
            scegli di darci sul tuo lavoro, sulla tua community e sul ritiro che stai pianificando (ad esempio
            dimensione del gruppo, date, destinazioni e budget stimato). Se poi prenoti un ritiro, potremmo chiederti
            ulteriori dettagli necessari per organizzarlo (come i dati del passaporto, esigenze alimentari o
            informazioni sulla salute che scegli di condividere); questi dati sono trattati come descritto in questa
            informativa e nel tuo accordo di prenotazione.
          </p>
          <p>
            <strong>Le informazioni raccolte automaticamente.</strong> Come la maggior parte dei siti, il nostro
            fornitore di hosting registra dati tecnici di base come il tuo indirizzo IP, il tipo di browser e le pagine
            richieste, per motivi di sicurezza e per mantenere il sito in funzione. Utilizziamo inoltre statistiche
            sui visitatori rispettose della privacy (vedi <a href="#cookies">Cookie e tecnologie simili</a>).
          </p>
        </>
      ),
    },
    {
      id: 'how-we-use',
      heading: 'Come usiamo le tue informazioni',
      body: (
        <>
          <p>Usiamo le tue informazioni per:</p>
          <ul>
            <li>rispondere alla tua richiesta e parlare del tuo ritiro o della tua prenotazione;</li>
            <li>preparare proposte, organizzare ritiri e fornire i servizi che ci chiedi;</li>
            <li>mantenere sicuro il sito e proteggerlo da spam e abusi;</li>
            <li>capire, in forma aggregata, come viene utilizzato il sito per migliorarlo;</li>
            <li>adempiere ai nostri obblighi legali, contabili e fiscali.</li>
          </ul>
          <p>
            Non vendiamo i tuoi dati personali e non ti inseriamo in una mailing list di marketing senza il tuo
            consenso esplicito.
          </p>
        </>
      ),
    },
    {
      id: 'legal-basis',
      heading: 'Base giuridica',
      body: (
        <>
          <p>
            Dove si applicano il Regolamento generale sulla protezione dei dati dell&apos;UE (GDPR) o la Legge egiziana
            sulla protezione dei dati personali (Legge n. 151 del 2020), ci basiamo sui seguenti fondamenti:
          </p>
          <ul>
            <li><strong>Misure precontrattuali ed esecuzione del contratto</strong>: rispondere alla tua richiesta e organizzare il tuo ritiro;</li>
            <li><strong>Legittimo interesse</strong>: gestire, proteggere e migliorare il nostro sito e la nostra attività;</li>
            <li><strong>Consenso</strong>: quando scegli di condividere informazioni facoltative, come dati sulla salute o sull&apos;alimentazione; puoi revocare il consenso in qualsiasi momento;</li>
            <li><strong>Obbligo di legge</strong>: conservare la documentazione richiesta dalla legge.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'sharing',
      heading: 'Con chi le condividiamo',
      body: (
        <>
          <p>Condividiamo le tue informazioni solo quando necessario, con:</p>
          <ul>
            <li>
              <strong>Fornitori di servizi</strong> che gestiscono il nostro sito e i nostri strumenti per nostro conto:
              Vercel (hosting del sito e statistiche sui visitatori), Sanity (archiviazione sicura del sistema di gestione
              dei contenuti, comprese le richieste) e il nostro fornitore di posta elettronica;
            </li>
            <li>
              <strong>Partner dei ritiri</strong> come hotel, società di trasporto e guide, ma solo i dati di cui hanno
              bisogno per realizzare il tuo ritiro e solo quando stai prenotando con noi;
            </li>
            <li>
              <strong>Guide di ritiri</strong>, quando partecipi a un ritiro che produciamo per loro e hanno bisogno dei
              tuoi dati per organizzarlo;
            </li>
            <li><strong>Autorità</strong>, quando siamo tenuti a farlo per legge.</li>
          </ul>
          <p>
            Se ci scrivi su WhatsApp, la conversazione è soggetta anche all&apos;informativa sulla privacy di WhatsApp.
          </p>
        </>
      ),
    },
    {
      id: 'transfers',
      heading: 'Trasferimenti internazionali',
      body: (
        <p>
          Lavoriamo tra l&apos;Egitto e l&apos;Italia e alcuni dei nostri fornitori di servizi conservano i dati in altri
          Paesi, compresi gli Stati Uniti. Quando le tue informazioni vengono trasferite fuori dal Paese in cui sono state
          raccolte, ci affidiamo alle garanzie adeguate offerte da tali fornitori, come le Clausole contrattuali tipo
          della Commissione europea.
        </p>
      ),
    },
    {
      id: 'cookies',
      heading: 'Cookie e tecnologie simili',
      body: (
        <>
          <p>Limitiamo i cookie al minimo:</p>
          <ul>
            <li>
              <strong>Statistiche sui visitatori</strong>: utilizziamo Vercel Web Analytics, che misura le visualizzazioni
              di pagina in forma aggregata senza usare cookie e senza identificare i singoli visitatori.
            </li>
            <li>
              <strong>Salvato sul tuo dispositivo</strong>: il modulo pre-call conserva una bozza delle tue risposte nel
              browser (archiviazione locale) così da poterlo riprendere, e viene cancellata una volta inviato il modulo.
              La chiusura della barra degli annunci viene ricordata per la durata della visita e le impostazioni di
              comfort che scegli vengono conservate per la volta successiva. Tutto questo resta sul tuo dispositivo e non
              viene inviato a noi.
            </li>
            <li>
              <strong>Servizi Google</strong>: i nostri caratteri web vengono caricati da Google, quindi Google riceve il
              tuo indirizzo IP e informazioni di base sul browser quando la pagina viene caricata. Consulta
              l&apos;informativa sulla privacy di Google per sapere come Google tratta questi dati.
            </li>
          </ul>
          <p>Puoi bloccare o eliminare i cookie in qualsiasi momento dalle impostazioni del tuo browser.</p>
        </>
      ),
    },
    {
      id: 'retention',
      heading: 'Per quanto tempo le conserviamo',
      body: (
        <p>
          Conserviamo le richieste per il tempo necessario a parlare con te del tuo ritiro e, in generale, non oltre 24
          mesi dall&apos;ultimo contatto se non segue alcuna prenotazione. Le informazioni relative alle prenotazioni
          vengono conservate per il tempo richiesto da esigenze contabili, fiscali e legali. Quando non abbiamo più
          bisogno delle tue informazioni, le cancelliamo.
        </p>
      ),
    },
    {
      id: 'security',
      heading: 'Come le proteggiamo',
      body: (
        <p>
          Il sito è servito tramite una connessione sicura (HTTPS). Le richieste sono archiviate in modo privato e
          possono essere consultate solo da persone autorizzate attraverso la nostra area di amministrazione protetta da
          password. Nessun sistema è completamente sicuro, ma adottiamo misure ragionevoli per proteggere le tue
          informazioni.
        </p>
      ),
    },
    {
      id: 'your-rights',
      heading: 'I tuoi diritti',
      body: (
        <>
          <p>A seconda di dove vivi, hai il diritto di:</p>
          <ul>
            <li>accedere ai dati personali che conserviamo su di te;</li>
            <li>chiederci di correggerli o aggiornarli;</li>
            <li>chiederci di cancellarli;</li>
            <li>opporti al modo in cui li utilizziamo o chiederci di limitarne il trattamento;</li>
            <li>riceverne una copia in un formato portabile;</li>
            <li>revocare il consenso in qualsiasi momento, quando ci basiamo sul consenso.</li>
          </ul>
          <p>
            Per esercitare uno qualsiasi di questi diritti, scrivici a <a href={`mailto:${email}`}>{email}</a>. Ti
            risponderemo entro un mese. Hai inoltre il diritto di presentare reclamo a un&apos;autorità per la
            protezione dei dati: in Italia, il Garante per la protezione dei dati personali; in Egitto, il Personal Data
            Protection Centre; oppure l&apos;autorità del tuo Paese.
          </p>
        </>
      ),
    },
    {
      id: 'children',
      heading: 'Minori',
      body: (
        <p>
          Questo sito è destinato agli adulti. Non raccogliamo consapevolmente dati personali di persone di età inferiore
          ai 18 anni. Se ritieni che un minore ci abbia inviato i propri dati, contattaci e li cancelleremo.
        </p>
      ),
    },
    {
      id: 'changes',
      heading: 'Modifiche a questa informativa',
      body: (
        <p>
          Possiamo aggiornare questa Informativa sulla privacy di tanto in tanto. L&apos;ultima versione sarà sempre
          disponibile in questa pagina, con la data dell&apos;ultimo aggiornamento.
        </p>
      ),
    },
  ]
}
