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
| III — La Corona di Cenere | la strada delle mani e Oren, il passo innevato, la Notte dei Coltelli, la fortezza, lo Specchio, le prigioni, Seraphine e l'Avatar |

L'Atto III è il più cupo: la strada è segnata dai profughi impiccati dal culto, le assassine di Seraphine attaccano l'ultimo accampamento, nelle prigioni si ammucchiano i prigionieri dissanguati e nella sala del trono Seraphine uccide davanti al gruppo chi è salito prima di loro (il capitano della guardia o il Duca, a seconda delle alleanze).

Ci sono cinque finali, che dipendono dalle scelte e dagli alleati raccolti:

| Finale | Come si ottiene | Cosa succede |
|---|---|---|
| L'Alba | girare la Chiave | il sole torna; il prezzo è una vita: la tua, oppure quella di Seraphine redenta, oppure divisa con i sei marchiati liberati |
| La Brace | lasciare che Brenna giri la Chiave (deve essere nel gruppo attivo) | Brenna brucia al posto tuo; l'alba resta rossa per sempre |
| Il Crepuscolo libero | spezzare la Chiave (prova di Arcano, automatica se Ilyra ne ha parlato) | il legame tra il sole e gli dèi si rompe |
| Il Re di Cenere | accogliere la voce di Morrhan | diventi il nuovo signore della valle; Brenna muore cercando di fermarti |
| La Notte Eterna | rifiutare il prezzo e fuggire | nessuna alba: la valle muore di freddo e di buio |

I compagni sono:

- **Brenna Ironvow**, chierica nana;
- **Kael Varn**, ladro umano;
- **Ilyra**, maga elfa.

Ognuno ha dialoghi propri e un talento personale.

**Gruppo e roster**
- Viaggiano e combattono al massimo **4 personaggi**. Gli altri compagni reclutati aspettano all'accampamento, fino a un roster di **8**. La formazione si cambia dal menu, fuori dal combattimento.
- Le prove di abilità usano chi è nel gruppo attivo. I dialoghi, l'accampamento e l'epilogo considerano tutti i compagni reclutati.
- Gli altri compagni reclutabili:

| Compagno | Classe | Come si recluta |
|---|---|---|
| Fenn Ashwood | ranger | sempre, partendo per il Bosco Cavo (Atto I) |
| Mira Benda | guerriera | se al ponte l'hai convinta a parole; caserma dei disertori a Vesperia |
| Doran Varn | ranger | se Kael lo convince sulla Torre Campanaria |
| Hrun | paladino | all'eremo sul fianco della Corona (Atto III) |
| Nessa | ladra | sorella di Oren, liberata nelle prigioni della Corona; si unisce nel Capitolo II |

- **La morte di Fenn:** quando Seraphine si rivela all'Archivio (fine dell'Atto II), uccide Fenn per vendicarsi dei bambini sottratti al culto. È la perdita a metà storia. Il suo equipaggiamento torna nello zaino, il posto libero nel gruppo viene preso da chi è all'accampamento, e il sole di legno (se Fenn te l'ha dato) torna nel finale.
- **Le altre perdite:** nella saga muoiono altri compagni, in punti fissi o per scelta del giocatore:
  - Brenna nei finali La Brace e Il Re di Cenere del Capitolo I;
  - Hrun nel Capitolo III, quando riforgia la Chiave;
  - Mira sul Ponte Vecchio di Vesperia, nel Capitolo IV;
  - nel Capitolo V uno dei compagni attivi può restare a tenere aperta la valvola della Gola (Doran, Kael, Nessa, Ilyra o Brenna, nell'ordine), a meno di spendere la luce del cuore di Aurel.

I capitoli successivi riprendono la stessa partita: gruppo, livello, oggetti e flag della storia passano al capitolo seguente.

## La saga

| Capitolo | Livelli | Trama | Finali |
|---|---|---|---|
| I — Il Sole Nero | 1–7 | il Sole Nero sopra Valtenebra, Seraphine e l'Avatar di Morrhan | 5 (vedi sopra) |
| II — La Città dei Senza Volto | 8–16 | le Marche di Ferro e gli Spenti, Corvelle delle maschere, l'Ierofante Senza Volto (Lia, la figlia di Seraphine) | La bambola di pezza · Il rogo di Corvelle |
| III — Il Mare di Cenere | 17–26 | Saltgrave e il Faro Nero, Iskra e la flotta, la Forgia di Aurel dove Hrun riforgia la Chiave, Vashka la Fame che cammina | Il porto in fiamme · L'ultima rotta di Iskra |
| IV — La Guerra degli Dèi | 27–38 | l'occhio di Morrhan nel cielo, il cuore di Aurel nel Deserto di Vetro, l'assedio di Vesperia | Vesperia regge · La caduta di Vesperia |
| V — L'Ultima Alba | 39–50 | il ritorno a Valtenebra diventata una gola, Ashford e Liesel, la discesa nello stomaco del dio | 5 finali |

Ogni capitolo si apre in modo diverso a seconda del finale del precedente, e molte scelte lontane tornano più avanti: Oren e Nessa, i bambini di Ashford, Seraphine redenta, Lia, il Primo Custode risparmiato, gli alleati raccolti a Vesperia.

**Capitolo V — la luce del cuore.** Il cuore di Aurel ha tre cariche di luce. Si possono spendere per salvare Liesel o per tenere aperta la valvola della Gola senza sacrificare un compagno; Lia (se è stata salvata nel Capitolo II e Seraphine redenta nel I) ne restituisce una. I finali più luminosi chiedono quella che resta:

| Finale | Requisito | Cosa succede |
|---|---|---|
| L'Ultima Alba | almeno 1 carica | spingi il cuore di Aurel, e il tuo, nella bocca del dio: muori e nasce un sole nuovo |
| Il Sole Nuovo | almeno 2 cariche | diventi tu il sole, e guardi invecchiare e morire tutti quelli che ami |
| Il Mondo Senza Dèi | Ilyra nel gruppo, oppure Arcano CD 24 | spezzi entrambi i cuori: nessun dio, nessun sole, un mondo duro ma vostro |
| La Fame | sempre | mangi il dio e poi i tuoi compagni |
| La Fine di Tutto | sempre (anche prima dello scontro finale) | accetti il patto di Morrhan: i morti tornano, con una bocca dentro la bocca, e il mondo viene mangiato |

## Personaggio

- **Razze:** Umano, Elfo, Nano, Halfling, Mezzorco, Tiefling. Ognuna dà bonus alle caratteristiche e un tratto.
- **Classi:** Guerriero, Paladino, Ladro, Ranger, Mago, Chierico. Ognuna ha i suoi dadi vita, armature, competenze, privilegi e incantesimi (incantatori completi e mezzi incantatori).
- **Background:** Soldato, Accolito, Criminale, Sapiente, Nobile, Viandante. Ognuno dà abilità e qualche reazione specifica nella storia.
- **Caratteristiche:** acquisto a punti con 27 punti, oppure i valori consigliati per la classe.
- **Progressione fino al livello 50:**
  - livelli 1–20 come nella 5e; dal 21 al 50 sono livelli "epici";
  - bonus di competenza da +2 a +6 entro il 20°, poi +1 ogni 8 livelli (+10 al 50°);
  - aumento delle caratteristiche oppure un talento ai livelli 4, 8, 12, 16, 19 e poi ogni 4 livelli dal 24 (il guerriero anche al 6 e al 14, il ladro al 10); oltre il 20° le caratteristiche salgono fino a 24;
  - slot degli incantesimi fino al IV livello, che continuano a crescere; oltre il 10° i danni degli incantesimi crescono del 3% a livello; i trucchetti salgono ai livelli 5, 11, 17 e poi ogni 10;
  - privilegi di classe aggiuntivi: Indomito (guerriero 9), terzo e quarto attacco (guerriero 11 e 20), Colpi radiosi (paladino 11), Elusione e Inafferrabile (ladro 7 e 11), Passo sicuro (ranger 9), terzo attacco per paladino e ranger al 24.
  - ogni capitolo ha un tetto di livello: I fino al 7, II al 16, III al 26, IV al 38, V al 50. Nei capitoli II–V il gruppo raggiunge anche delle soglie minime di livello a ogni atto (`xpTo`).
- **Sottoclassi** (scelta definitiva al livello 3, privilegi ai livelli 3, 7 e 11):

  | Classe | Sottoclasse | 3° | 7° | 11° |
  |---|---|---|---|---|
  | Guerriero | Campione | Critico 19–20 | Sopravvissuto | Critico 18–20 |
  | Guerriero | Maestro di battaglia | Dadi di superiorità (Manovra) | d10, +1 dado | d12, +1 dado |
  | Paladino | Devozione | Arma sacra | Aura di devozione (+1 CA) | Nimbo sacro |
  | Paladino | Vendetta | Voto di inimicizia | +2 velocità | +Carisma ai danni sul bersaglio del Voto |
  | Ladro | Assassino | Vantaggio nel primo round | Furtivo con d8 | +2 dadi di furtivo |
  | Ladro | Furfante | Oggetti come azione bonus | +2 velocità | +1 CA, +3 iniziativa |
  | Ranger | Cacciatore | Uccisore di colossi | +1 CA | Uccisore di colossi due volte |
  | Ranger | Viandante delle tenebre | Saggezza all'iniziativa, +1d8 nel primo round | TS Saggezza | Ritenta un attacco mancato |
  | Mago | Invocazione | Incantesimi che risparmiano gli alleati | +Intelligenza ai danni | +25% ai danni |
  | Mago | Abiurazione | Barriera arcana | La barriera si ricarica | +2 ai tiri salvezza |
  | Chierico | Vita | Cure potenziate | Guaritore benedetto | Guarigione suprema |
  | Chierico | Guerra | Attacco bonus | Colpo divino | −3 ai danni fisici subiti |

  Il protagonista sceglie al livello 3 (anche nelle partite salvate già oltre il 3); i compagni hanno una sottoclasse adatta al personaggio: Brenna Vita, Kael Furfante, Ilyra Invocazione, Fenn e Doran Cacciatore e Viandante, Mira Maestra di battaglia, Hrun Devozione.
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
- Si combatte su una griglia di esagoni (7×9, righe dispari sfalsate) con iniziativa (d20 + DES) e un turno per unità. Le distanze sono in esagoni; il fiancheggiamento richiede un alleato nell'esagono esattamente opposto.
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

**Maestrie delle armi**
- Guerrieri, paladini, ranger e ladri applicano la maestria della loro arma quando colpiscono:
  - **Indebolire** (spada lunga, mazza): svantaggio al prossimo attacco del bersaglio;
  - **Incalzare** (stocco, spada corta, arco corto): vantaggio al prossimo attacco contro lo stesso bersaglio;
  - **Rallentare** (arco lungo, giavellotto): −2 esagoni di movimento;
  - **Spingere** (martello): un esagono più in là; contro un ostacolo o una creatura 1d4 danni, nel fuoco brucia;
  - **Rovesciare** (bastone): TS COS o a terra.
- I boss non possono essere spinti né rovesciati.

**Capi nemici**
- In alcuni scontri (il mulino di Snik, il ponte di Mira, le pietre di Varga, il tetto di Doran) il gruppo nemico ha un capo, segnato da una corona.
- Il capo apre lo scontro con una frase. I seguaci, durante i loro turni, fanno capire che combattono per lui, e quando è ferito vacillano.
- Se il capo cade, i seguaci fuggono (o si dissolvono, se non morti) e lo scontro è vinto; ogni fuggitivo vale metà dell'esperienza.

**Scontri tattici** (`77_tactical.js`)

Gli scontri chiave hanno meccaniche che premiano il ragionamento più dello scambio di colpi:

| Scontro | Meccanica | Tattica che premia |
|---|---|---|
| Mulino (Snik) | rinforzi al round 3 | abbattere il capo prima che arrivino |
| Pietre di Varga | bracieri: danni dimezzati e cura; rito in 6 round | dividere il gruppo, spegnere i bracieri |
| Torre della Lanterna | colpo telegrafato ad area (raggio 1) | non ammassarsi, uscire dagli esagoni rossi |
| Archivio Sommerso (Custode) | onda telegrafata su un'intera fila | cambiare fila al momento giusto |
| Palazzo del Duca, porta della fortezza | rinforzi | tenere una strettoia o chiudere in fretta |
| Guardiano d'ossidiana, Seraphine | seconda fase a metà vita (evocazioni, colpi telegrafati) | conservare risorse per la fase due |
| Avatar di Morrhan | due zone telegrafate a turno | movimento continuo |

Sulla mappa un riquadro descrive le regole attive (durante lo schieramento e in battaglia): bracieri, round che mancano al rito, rinforzi in arrivo, esagoni da lasciare.

Nel simulatore questi scontri, segnati con `tac: 1`, devono essere vinti almeno da un terzo dei gruppi-bot. Gli altri scontri restano alla soglia del 50%.

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
- 19 imprese, tra cui una per ciascuno dei dieci finali dei Capitoli I e V.
- Controllo degli aggiornamenti tramite GitHub Releases.

## Crafting ed economia

**Materiali e provenienza**

| Materiale | Da dove arriva | Prezzo |
|---|---|---|
| Erbe | riposi all'aperto, pallidi, negozi | 4 |
| Resina | goblin, riposi, negozi | 5 |
| Polvere d'ossa | non morti, lupi, Vesperia | 6 |
| Ferro | banditi, guardie, cavalieri, goblin | 8 |
| Essenza d'ombra | accoliti, ombre, pallidi (raro) | 25 |
| Frammento di sole | boss, segreti, Hrun | 60 |

Dopo ogni scontro, ogni nemico abbattuto (non quelli fuggiti) può lasciare materiali, al massimo 3 per tipo. Riposando all'aperto il gruppo fa una prova di Sopravvivenza per raccogliere erbe, resina e, con un tiro alto, essenza.

**Ricette**
- **Alchimia** (ovunque fuori dal combattimento):
  - pozione (2 erbe);
  - fuoco dell'alchimista (2 resina);
  - olio infuocato (resina + erbe);
  - pozione superiore (2 erbe + essenza; da Grisa o dall'Archivio);
  - acqua consacrata (erbe + 2 ossa; si impara al tempio, serve chierico o paladino);
  - pergamene (con frammenti di sole; dall'Archivio, serve un incantatore).
- **Fucina:**
  - arma +1 (4 ferro + 60 mo) e armatura +1 (4 ferro + 50 mo) da Hild, a Vesperia o da Hrun;
  - arma dei Custodi +2 (arma +1 + 2 ferro + 2 frammenti + 150 mo) solo da Hrun.

**Equilibrio**
- Fare da sé costa circa un terzo del prezzo di negozio, ma richiede materiali che arrivano giocando.
- La vendita rende metà prezzo, così il bottino superfluo diventa oro senza rompere l'economia.
- L'arma +2 non è più in vendita a Vesperia: va forgiata, così vale la deviazione all'eremo.

## Indovinelli, rompicapo e missioni segrete

**Le Tre Fiamme dei Custodi** (attraversa tutti e tre gli atti):
1. Al pozzo di Ashford c'è un indovinello; la risposta è «eco».
2. La meridiana nel cortile dell'Archivio di Vesperia ha tre anelli da ruotare. Il verso inciso dice l'ordine: sole, corona, occhio. Premere il centro con la combinazione sbagliata dà una scossa (−2 PF).
3. All'eremo di Hrun, sulla porta è inciso «Basta pronunciare il mio nome per spezzarmi». Dire «Silenzio» è sbagliato; bisogna restare in silenzio.

Con tutte e tre le fiamme si ottiene la Lanterna dei Custodi (+1d6 radiosi ai non morti, +1 ai TS); altrimenti due frammenti di sole.

**Il ladro di ricordi** (Atto II)
- Nell vende fiale di ricordi rubati.
- Nella Via degli Speziali tre sospetti fanno una dichiarazione ciascuno e uno solo dice il vero. Logicamente il ladro è Vell.
- Accusarlo porta a uno scontro con un capo; un'accusa sbagliata lo fa fuggire e la missione fallisce.

**Indovinello di Nonna Grisa** (Atto I): la risposta giusta dà due fuochi dell'alchimista e la ricetta della pozione superiore.
