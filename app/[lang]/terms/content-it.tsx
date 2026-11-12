import type { LegalSection } from '@/components/LegalPage'
import Link from '@/components/LocLink'

// Italian version of the Terms & Conditions (same section ids and order as the English page)
export function termsSectionsIt(email: string): LegalSection[] {
  return [
    {
      id: 'about-us',
      heading: 'Chi siamo',
      body: (
        <>
          <p>
            Questo sito è gestito da <strong>Nefertiti Retreats</strong> (&ldquo;Nefertiti&rdquo;, &ldquo;noi&rdquo;,
            &ldquo;nostro&rdquo;), un produttore di ritiri con sede tra l&apos;Egitto e l&apos;Italia. Progettiamo e
            produciamo ritiri di benessere in Egitto per coach, facilitatori e guide di ritiri, e organizziamo anche
            ritiri nostri.
          </p>
          <p>
            Puoi contattarci in qualsiasi momento all&apos;indirizzo <a href={`mailto:${email}`}>{email}</a>.
          </p>
        </>
      ),
    },
    {
      id: 'using-the-site',
      heading: 'Uso del sito',
      body: (
        <>
          <p>Utilizzando questo sito accetti i presenti Termini. Se non li accetti, ti chiediamo di non usare il sito.</p>
          <p>Nell&apos;utilizzo del sito ti impegni a non:</p>
          <ul>
            <li>usarlo per scopi illeciti o in modo da danneggiarlo, renderlo inaccessibile o sovraccaricarlo;</li>
            <li>tentare di accedere senza autorizzazione a qualsiasi parte del sito, della sua area di amministrazione o dei suoi sistemi;</li>
            <li>inviare richieste false, fuorvianti o spam, né fornire i dati di un&apos;altra persona senza il suo permesso;</li>
            <li>copiare, estrarre o riutilizzare i nostri contenuti, foto o video senza la nostra autorizzazione scritta.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'information',
      heading: 'Informazioni presenti sul sito',
      body: (
        <>
          <p>
            Tutto ciò che trovi su questo sito (destinazioni, esperienze, servizi, descrizioni dei ritiri, date e
            fotografie) ha scopo puramente informativo e di ispirazione. Ci impegniamo a mantenerlo accurato e
            aggiornato, ma i dettagli possono cambiare (ad esempio strutture, programmi, disponibilità o condizioni
            locali) e alcuni contenuti possono avere carattere illustrativo.
          </p>
          <p>
            Nulla di quanto pubblicato sul sito costituisce un&apos;offerta vincolante. Il programma esatto, ciò che è
            incluso e il prezzo di ogni ritiro vengono confermati solo per iscritto, come descritto di seguito.
          </p>
        </>
      ),
    },
    {
      id: 'enquiries',
      heading: 'Richieste e WhatsApp',
      body: (
        <>
          <p>
            Inviare una richiesta tramite il modulo di contatto, via email o su WhatsApp non genera una prenotazione né
            un contratto: avvia semplicemente una conversazione. Puntiamo a risponderti entro 48 ore, ma non possiamo
            garantire i tempi di risposta né di poter soddisfare ogni richiesta.
          </p>
          <p>
            Come trattiamo le informazioni che ci invii è spiegato nella nostra <Link href="/privacy">Informativa sulla privacy</Link>.
          </p>
        </>
      ),
    },
    {
      id: 'bookings',
      heading: 'Prenotazioni, prezzi e pagamenti',
      body: (
        <>
          <p>
            I prezzi non sono pubblicati su questo sito. Ogni ritiro, sia che lo produciamo per te come guida di ritiri
            sia che tu partecipi a uno dei nostri ritiri come ospite, viene confermato tramite una{' '}
            <strong>proposta scritta o un accordo di prenotazione separato</strong>. Tale documento indica il programma,
            ciò che è incluso e ciò che non lo è, il prezzo, il piano dei pagamenti (compreso l&apos;eventuale acconto)
            e le condizioni di cancellazione e rimborso.
          </p>
          <p>
            Se qualcosa nella proposta scritta o nell&apos;accordo di prenotazione differisce dai presenti Termini, per
            quella prenotazione prevale la proposta o l&apos;accordo di prenotazione.
          </p>
        </>
      ),
    },
    {
      id: 'third-parties',
      heading: 'Partner e fornitori terzi',
      body: (
        <>
          <p>
            Per creare ogni ritiro collaboriamo con partner indipendenti come hotel, campi, imbarcazioni, società di
            trasporto, guide, professionisti e fornitori di attività. Alcuni di loro sono presentati nelle nostre
            pagine dedicate ai partner. Questi partner forniscono i loro servizi secondo i propri termini e restano
            responsabili dei propri servizi, del proprio personale e dei propri locali.
          </p>
          <p>
            Scegliamo i nostri partner con attenzione ma, nei limiti consentiti dalla legge, non rispondiamo di azioni o
            omissioni di terzi indipendenti che esulano dal nostro ragionevole controllo.
          </p>
        </>
      ),
    },
    {
      id: 'travel',
      heading: 'Viaggio, salute e assicurazione',
      body: (
        <>
          <p>Salvo diversa indicazione nel tuo accordo di prenotazione, ogni viaggiatore è responsabile di:</p>
          <ul>
            <li>essere in possesso di un passaporto valido e dell&apos;eventuale visto necessario per entrare in Egitto;</li>
            <li>stipulare un&apos;assicurazione di viaggio completa, che comprenda spese mediche e annullamento;</li>
            <li>
              verificare di essere idoneo a partecipare alle attività previste (come yoga, escursioni nel deserto, nuoto,
              snorkeling o gite in barca) e comunicarci in anticipo eventuali condizioni di salute, allergie o esigenze
              alimentari di cui dobbiamo essere a conoscenza;
            </li>
            <li>seguire le indicazioni di guide, istruttori e personale locale, e rispettare le leggi e le usanze locali.</li>
          </ul>
          <p>
            Le attività di benessere proposte durante un ritiro non costituiscono un trattamento medico e non sostituiscono
            il parere di un professionista sanitario.
          </p>
        </>
      ),
    },
    {
      id: 'retreat-leaders',
      heading: 'Per le guide di ritiri',
      body: (
        <p>
          Se produciamo un ritiro per te, resti responsabile dei contenuti delle tue sessioni e dei tuoi insegnamenti,
          dell&apos;accuratezza di ciò che comunichi ai tuoi partecipanti e del possesso di eventuali qualifiche o
          assicurazioni richieste dalla tua attività. Il nostro lavoro di produzione e gli accordi con i tuoi
          partecipanti sono definiti nell&apos;accordo scritto stipulato con noi.
        </p>
      ),
    },
    {
      id: 'force-majeure',
      heading: 'Eventi al di fuori del nostro controllo',
      body: (
        <p>
          Non rispondiamo di ritardi, modifiche o cancellazioni causati da eventi che esulano dal nostro ragionevole
          controllo, come condizioni meteorologiche estreme, calamità naturali, epidemie, provvedimenti governativi,
          scioperi, disordini civili, interruzioni dei voli o chiusura di siti o strutture. In tali casi faremo del
          nostro meglio per offrire un&apos;alternativa adeguata, e le conseguenze per ogni prenotazione seguiranno il
          tuo accordo di prenotazione.
        </p>
      ),
    },
    {
      id: 'intellectual-property',
      heading: 'Proprietà intellettuale',
      body: (
        <p>
          Il nome e il logo Nefertiti, nonché i testi, le fotografie, i video e il design di questo sito, appartengono a
          noi o ai nostri licenziatari e partner. Puoi consultare e condividere i link alle nostre pagine per uso
          personale, ma non puoi copiare, riprodurre o utilizzare commercialmente i nostri contenuti senza la nostra
          autorizzazione scritta.
        </p>
      ),
    },
    {
      id: 'links',
      heading: 'Link e lingue',
      body: (
        <>
          <p>
            Il sito può contenere link ad altri siti e servizi, come WhatsApp, Instagram o i siti dei nostri partner.
            Non controlliamo tali siti e non siamo responsabili dei loro contenuti o delle loro pratiche.
          </p>
          <p>
            Il sito è disponibile in inglese e in italiano. In caso di differenze di significato tra le due versioni,
            prevale la versione inglese.
          </p>
        </>
      ),
    },
    {
      id: 'liability',
      heading: 'La nostra responsabilità',
      body: (
        <>
          <p>
            Forniamo questo sito &ldquo;così com&apos;è&rdquo;. Non garantiamo che sia sempre disponibile, ininterrotto o
            privo di errori.
          </p>
          <p>
            Nei limiti consentiti dalla legge, non rispondiamo di alcuna perdita indiretta o consequenziale derivante
            dall&apos;uso di questo sito. Nulla nei presenti Termini limita una responsabilità che non può essere
            limitata ai sensi della legge applicabile, compresa la responsabilità per morte o lesioni personali causate
            da negligenza, o per frode.
          </p>
        </>
      ),
    },
    {
      id: 'law',
      heading: 'Legge applicabile',
      body: (
        <p>
          I presenti Termini sono disciplinati dalle leggi della Repubblica Araba d&apos;Egitto. Ciò non pregiudica le
          tutele inderogabili di cui godi ai sensi delle leggi sul consumo del Paese in cui risiedi.
        </p>
      ),
    },
    {
      id: 'changes',
      heading: 'Modifiche ai presenti Termini',
      body: (
        <p>
          Possiamo aggiornare i presenti Termini di tanto in tanto. Si applica la versione pubblicata in questa pagina,
          con la relativa data di &ldquo;ultimo aggiornamento&rdquo;. Le modifiche non incidono sulle prenotazioni già
          confermate per iscritto.
        </p>
      ),
    },
    {
      id: 'contact',
      heading: 'Contattaci',
      body: (
        <p>
          Hai domande sui presenti Termini? Scrivici a <a href={`mailto:${email}`}>{email}</a> oppure contattaci tramite la
          nostra <Link href="/contact">pagina dei contatti</Link>.
        </p>
      ),
    },
  ]
}
