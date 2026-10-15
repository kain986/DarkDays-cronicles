# Documento di design

## Visione

Un gioco di ruolo a turni da tasca, pensato per sessioni brevi sul telefono. Ha tre modelli di riferimento:

- **Baldur's Gate**: storia con scelte che contano, compagni con una personalità, prove di abilità, bottino e negozi;
- **Icewind Dale**: dungeon e scontri impegnativi contro gruppi di nemici;
- **XCOM**: copertura, fiancheggiamento, Guardia, probabilità visibili e una mappa leggibile a colpo d'occhio.

Le regole sono un adattamento semplificato di D&D 5ª edizione: chi conosce la 5e ritrova i concetti, chi non la conosce non deve leggere un manuale.

## Ambientazione e storia

Valtenebra, una valle in cui il sole si è spento da quaranta giorni. Il protagonista porta sulla mano un marchio legato al Sole Nero.

**Capitolo I — Il Sole Nero** (circa 5–6 ore):

| Atto | Contenuto |
|---|---|
| I — La Lanterna e il Bosco | il carro dei prigionieri, Ashford, il mulino dei goblin, il cimitero, il campo del culto, le Pietre di Varga |
| II — La Città delle Candele | Vesperia, la torre del Guardiano, il duca, le fogne, il dungeon opzionale delle Volte di Aurel |
| III — La Corona di Cenere | il passo innevato, la fortezza, lo Specchio, Seraphine e l'Avatar |

Ci sono tre finali (L'Alba, Il Crepuscolo libero, Il Re di Cenere), che dipendono dalle scelte e dagli alleati raccolti. I compagni sono:

- **Brenna Ironvow**, chierica nana;
- **Kael Varn**, ladro umano;
- **Ilyra**, maga elfa.

Ognuno ha dialoghi propri e un talento personale.

I capitoli successivi riprendono la stessa partita: gruppo, livello, oggetti e flag della storia passano al capitolo seguente.

## Personaggio

- **Razze:** Umano, Elfo, Nano, Halfling, Mezzorco, Tiefling. Ognuna dà bonus alle caratteristiche e un tratto.
- **Classi:** Guerriero, Paladino, Ladro, Ranger, Mago, Chierico. Ognuna ha i suoi dadi vita, armature, competenze, privilegi e incantesimi (incantatori completi e mezzi incantatori).
- **Background:** Soldato, Accolito, Criminale, Sapiente, Nobile, Viandante. Ognuno dà abilità e qualche reazione specifica nella storia.
- **Caratteristiche:** acquisto a punti con 27 punti, oppure i valori consigliati per la classe.
- **Progressione:** tabella dei punti esperienza della 5e. Livello massimo 7 nel Capitolo I; la tabella arriva fino al 12 per i capitoli futuri. Ai livelli 4 e 8 si sceglie un aumento delle caratteristiche oppure un talento (Tiratore scelto, Maestro d'armi, Robusto, Allerta, Mobile, Sentinella).
- **Riposi:**
  - due riposi brevi tra un riposo lungo e l'altro, in cui si spendono i dadi vita e si recuperano alcune risorse;
  - il riposo lungo, nei luoghi sicuri, ripristina tutto.

## Prove

Si tira 1d20 + modificatore contro una classe difficoltà (CD) mostrata sul pulsante. Il 20 naturale riesce sempre e l'1 naturale fallisce sempre.

Chi tira:

- nelle prove sociali tira il protagonista;
- nelle altre prove tira il membro del gruppo più bravo in quell'abilità.

Background, oggetti e scelte precedenti possono dare vantaggio o rendere la prova automatica.

## Combattimento

**Struttura**
- Si combatte su una griglia con iniziativa (d20 + DES) e un turno per unità.
- Prima di combattere c'è una fase di schieramento: il gruppo si posiziona nelle caselle di partenza.
- In ogni turno ogni unità ha un movimento (pari alla sua velocità, in caselle), un'azione, eventuali azioni bonus e una reazione per round.

**Copertura**
- Le caselle accanto a rocce, alberi o rovine danno mezza copertura (+2 CA) o tre quarti (+5 CA) contro gli attacchi che arrivano da quella parte.
- Il talento Tiratore scelto ignora la copertura.

**Terreno**
- Ogni mappa ha una disposizione casuale di terreni, scelti in base al luogo (tabella `TCFG`).
- **Alture:** i tiri a distanza da un'altura contro chi sta più in basso hanno +2 a colpire e +2 di gittata. Salirci costa 1 movimento in più.
- **Terreno difficile:** sterpaglia, paglia, macerie e neve alta costano 2 movimento.
- **Sterpaglia e paglia** danno mezza copertura a chi ci sta dentro. Gli attacchi a distanza di fuoco e le aree di fuoco le incendiano:
  - il fuoco dura 2–3 round e a ogni round può propagarsi (40%) alla sterpaglia vicina, poi lascia cenere;
  - chi entra o inizia il turno tra le fiamme subisce 1d6 danni da fuoco.
- **Cerchio sacro:** all'inizio del turno cura 1d4+1 PF ai vivi e infligge 1d6 danni radiosi ai non morti.
- **Ostacoli alti:** bloccano la linea di vista. Quelli bassi danno solo copertura. Senza linea di vista non si può tirare, lanciare incantesimi a distanza o fare fuoco di Guardia.

**Posizione**
- **Fiancheggiamento:** se un alleato sta dalla parte opposta del bersaglio, gli attacchi in mischia hanno vantaggio.
- **Bersaglio esposto (✸):** il critico arriva con 18–20 invece che solo con 20. È esposto un bersaglio fiancheggiato in mischia, oppure, per i tiri a distanza, senza copertura e adiacente a un alleato di chi attacca. Vale per entrambe le parti.
- **Attacchi di opportunità:** uscire dalla portata di un nemico provoca un attacco gratuito. Il Disimpegno, il talento Mobile e l'Azione scaltra del ladro lo evitano.
- Prima di muoverti, le caselle rischiose sono evidenziate.

**Azioni speciali**
- **Guardia (overwatch):** rinunci all'attacco e colpisci il primo nemico che si muove nel tuo raggio. Anche gli arcieri nemici la usano quando non hanno bersagli.
- **Spinta:** butta a terra il bersaglio, e chi è a terra subisce attacchi in mischia con vantaggio. **Schivata**, **Scatto** e **Attacco poderoso** (−5 a colpire, +10 danni) completano le opzioni.
- Incantesimi e pergamene usano gli slot o le cariche. Alcuni effetti colpiscono un'area.

**Capi nemici**
- In alcuni scontri (il mulino di Snik, il ponte di Mira, le pietre di Varga, il tetto di Doran) il gruppo nemico ha un capo, segnato da una corona.
- Il capo apre lo scontro con una frase. I seguaci, durante i loro turni, fanno capire che combattono per lui, e quando è ferito vacillano.
- Se il capo cade, i seguaci fuggono (o si dissolvono, se non morti) e lo scontro è vinto; ogni fuggitivo vale metà dell'esperienza.

**Informazione**
- **Zone d'azione colorate:** rosso per gli attacchi, arancione per incantesimi e abilità, giallo per la Guardia, scuro per le caselle in gittata ma fuori vista. Toccando un nemico in guardia si vede la sua zona.
- **Movimento in due tempi:** il primo tocco mostra il percorso, il costo, il terreno di arrivo e i rischi; si conferma con **Vai** o con un secondo tocco. I cerchi dorati sono raggiungibili solo con uno Scatto. Si può scegliere il movimento immediato dalle Opzioni.
- Toccando un nemico vedi il tiro necessario e la probabilità di colpirlo, con vantaggio o svantaggio e copertura già calcolati.
- Il registro mostra tutti i tiri.

**IA dei nemici**
- Ogni nemico valuta tutte le caselle raggiungibili con una funzione di utilità: danno atteso, copertura, fiancheggiamento, rischio di attacchi di opportunità o di Guardia, distanza dal bersaglio preferito.
- I goblin hanno la fuga agile; i lupi cacciano in branco; gli arcieri cercano la copertura e restano a distanza.

**Dopo lo scontro**
- Sfide facoltative (per esempio "vinci senza che nessuno cada") danno oro o esperienza extra.
- Bottino garantito dagli scontri importanti, più bottino casuale.

**Difficoltà**
- Tre livelli. La difficoltà cambia i punti ferita e i danni dei nemici, non le regole.
- Il bilanciamento è verificato dal simulatore: a difficoltà normale ogni scontro deve essere vinto almeno il 50% delle volte da un gruppo-bot non ottimale, così un giocatore attento lo vince quasi sempre senza annoiarsi.

## Presentazione

- **Mappe:** disegnate a inchiostro e pennino su pergamena, generate al volo con il canvas.
- **Miniature:** dipinte, generate dal codice e memorizzate in cache.
- **Audio:** musica procedurale con Web Audio, con un'atmosfera diversa per esplorazione, città, combattimento, boss e tensione, più effetti sonori. Niente file audio esterni.
- **Orientamento:**
  - in orizzontale (predefinito sul telefono) la storia è su due colonne e in combattimento la mappa sta a sinistra e il pannello delle azioni a destra;
  - in verticale tutto è impilato.
- **Accessibilità:** dimensione del testo regolabile, effetti ridotti (rispetta anche `prefers-reduced-motion`) e velocità del combattimento regolabile.

## Meta

- Salvataggio automatico dopo ogni scena e ogni scontro.
- 3 slot manuali.
- Codice di esportazione (prefisso `DDC1:`) per spostare la partita tra dispositivi.
- Bestiario dei nemici incontrati.
- 12 imprese.
- Controllo degli aggiornamenti tramite GitHub Releases.
