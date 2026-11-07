# Cronologia delle versioni

## 3.0 — 2026-11-07

**Griglia esagonale**
- Il combattimento si gioca su esagoni: sei direzioni, distanze naturali, fiancheggiamento dalla parte opposta.
- Movimento, linea di vista, copertura, aree degli incantesimi, terreni, fuoco e IA sono stati riscritti per la nuova griglia.
- Le mappe a inchiostro disegnano gli esagoni a mano; in orizzontale la griglia si gira.

**Combattimento**
- **Maestrie delle armi** (regole 5e 2024) per guerrieri, paladini, ranger e ladri:
  - Indebolire (spada lunga, mazza);
  - Incalzare (stocco, spada corta, arco corto);
  - Rallentare (arco lungo, giavellotto);
  - Spingere (martello: chi sbatte contro un ostacolo si fa male, chi finisce tra le fiamme brucia);
  - Rovesciare (bastone).
- "Kill cam": i colpi critici e i colpi che abbattono un capo o l'ultimo nemico hanno un breve effetto di zoom e luce.
- Nuovi oggetti da combattimento: **Olio infuocato** (azione bonus, +1d4 fuoco ai colpi) e **Acqua consacrata** (4d6 radiosi ai non morti).

**Crafting e mercato**
- **Materiali:** erbe, resina, polvere d'ossa, ferro, essenza d'ombra, frammenti di sole. Si ottengono così:
  - li lasciano i nemici, in base a chi sono;
  - si raccolgono riposando all'aperto;
  - si comprano nei negozi.
- **Alchimia** dal menu (scheda Crafting), ovunque fuori dal combattimento: pozioni, fuoco dell'alchimista, olio, acqua consacrata, pergamene. Alcune ricette vanno imparate e alcune richiedono un chierico, un paladino o un mago nel gruppo.
- **Fucina** per migliorare armi e armature:
  - Hild ad Ashford;
  - il Mercato delle Candele;
  - l'eremo di Hrun, dove si forgiano le armi dei Custodi.
- **Mercato:** si può vendere a metà prezzo. Mara è diventata un'erborista. Nell'Atto III c'è un nuovo mercante.

**Storia: indovinelli, rompicapo e missioni segrete**
- **Missione segreta «Le Tre Fiamme dei Custodi»:**
  - un indovinello al pozzo di Ashford;
  - il rompicapo della meridiana spezzata a Vesperia;
  - la porta del silenzio all'eremo di Hrun.
  - Chi trova le tre fiamme ottiene la leggendaria **Lanterna dei Custodi**.
- **Missione segreta «Il ladro di ricordi»:** un enigma logico nella Via degli Speziali (chi mente?) e uno scontro con un capo.
- Nuovi personaggi: Hild la fabbra, Nell, Vell lo speziale, Hrun l'ultimo fabbro dei Custodi.
- Ricette insegnate da Madre Seraphine, Nonna Grisa e Pellin.
- Le missioni segrete compaiono nel diario solo dopo essere state scoperte.

**Lingue**
- Tutti i testi nuovi sono in italiano, inglese e spagnolo. Un controllo automatico verifica che nessun testo del gioco manchi di una traduzione.

## 2.2.1 — 2026-10-15
- Schermata iniziale in orizzontale rifatta per i telefoni: entra tutta nello schermo senza scorrere, il Sole Nero ha la giusta misura, Carica / Imprese / Capitoli stanno su una riga.

## 2.2 — 2026-10-15

**Terreni con effetti**
- **Alture:** da un'altura i tiri a distanza hanno +2 a colpire e +2 di gittata contro chi sta più in basso; salirci costa 1 movimento in più.
- **Sterpaglia e paglia:** sono terreno difficile, danno mezza copertura a chi ci sta dentro e prendono fuoco con gli incantesimi e gli oggetti di fuoco. Le fiamme bruciano chi le attraversa, si propagano e lasciano cenere.
- **Macerie e neve alta:** terreno difficile (costa 2 movimento).
- **Cerchi sacri:** curano i vivi all'inizio del turno e bruciano i non morti.
- **Ostacoli alti** (colonne, menhir, massi, cataste, scaffali, alberi): bloccano la linea di vista. Si riconoscono dall'ombra tratteggiata lunga.

**Zone d'azione e movimento**
- **Zone d'azione colorate:** rosso per gli attacchi, arancione per incantesimi e abilità, giallo per la Guardia, scuro per le caselle fuori vista. Toccando un nemico in guardia si vede la sua zona.
- **Movimento in due tempi:** tocchi una casella e vedi il percorso con il costo; poi confermi con **Vai** o toccando di nuovo. I cerchi dorati indicano le caselle raggiungibili con uno Scatto. Dalle Opzioni si può tornare al movimento immediato.

**Combattimento**
- **Bersagli esposti** (✸): un nemico fiancheggiato in mischia, oppure senza copertura e già impegnato da un tuo alleato, subisce critici con 18–20. Vale in entrambe le direzioni.
- **Capi nemici** in alcuni scontri (Snik, Mira Benda, Varga il Pallido, Doran Varn), segnati da una corona. I nemici parlano durante lo scontro e lasciano intuire che, se il capo cade, gli altri fuggono; i fuggitivi danno metà dell'esperienza.

**Correzioni**
- Le percentuali mostrate per i tiri a distanza contavano la copertura due volte: ora corrispondono al tiro reale.

## 2.1 — 2026-10-15

**Capitoli e aggiornamenti**
- La storia è ora organizzata in capitoli: tutta la campagna attuale è il *Capitolo I — Il Sole Nero*. Gruppo, oggetti, livello e scelte passano al capitolo successivo; schermata **Capitoli** dal titolo.
- Il gioco controlla se è stata pubblicata una nuova versione su GitHub e propone di scaricarla, con le note di rilascio.

**Schermo e comodità**
- Modalità orizzontale, predefinita su telefono, con disposizione dedicata per tutte le schermate. In alternativa si può scegliere verticale o automatica dalle Opzioni.
- Tre slot di salvataggio manuali, oltre al salvataggio automatico.
- Esportazione e importazione della partita come codice testuale.
- Bestiario dei nemici incontrati e 12 imprese da sbloccare.
- Opzioni per la dimensione del testo e per ridurre gli effetti grafici.

**Sviluppo e distribuzione**
- Firma dell'APK stabile: da ora gli aggiornamenti si installano sopra la versione precedente. Chi ha la 2.0 o precedente deve disinstallarla una volta.
- Sorgenti divisi in moduli (`src/`) con strumenti di build, verifica della trama e simulatore di bilanciamento.
- Build automatica con test e rilascio su GitHub Releases a ogni tag.
- Versione giocabile nel browser in `docs/` (GitHub Pages).
- README, documentazione di design e di sviluppo, screenshot.

## 2.0 — 2026-10-14

**Combattimento tattico (in stile XCOM)**
- Fiancheggiamento, attacchi di opportunità, Disimpegno, Guardia (overwatch), Spinta, Attacco poderoso e reazioni.
- Schieramento del gruppo prima dello scontro.
- Caselle rischiose evidenziate e probabilità di colpire visibili.
- IA dei nemici "utility": valuta copertura, fiancheggiamento e rischio di ogni casella.
- Sfide facoltative durante gli scontri e bottino casuale.

**Progressione (in stile Baldur's Gate)**
- Talenti, ninnoli, pergamene, nuovi negozi e oggetti, riposo breve con i dadi vita.
- Il dungeon opzionale delle Volte di Aurel con il suo guardiano.
- Velocità di combattimento regolabile.

## 1.5 — 2026-10-14
- La mappa di combattimento non copre più i pannelli inferiori.
- Primo scontro riequilibrato, perché prima si vinceva solo con la fortuna.

## 1.4 — 2026-10-14
- Mappe disegnate a inchiostro e pennino.
- Miniature dipinte al posto dei segnalini.
- Copertura naturale data da rocce, alberi e rovine.

## 1.3 — 2026-10-14
- Musica di sottofondo procedurale che segue l'atmosfera, ed effetti sonori.

## 1.2 — 2026-10-14
- Nuova grafica per il titolo animato, la creazione del personaggio, le scene della storia e il lancio dei dadi.

## 1.1 — 2026-10-14
- Nuova grafica ed effetti per il combattimento.

## 1.0 — 2026-10-14
- Prima versione: storia in tre atti, tre lingue, creazione del personaggio in stile 5e, combattimento a turni e app Android.
