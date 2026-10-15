# Guida allo sviluppo

Il gioco è una singola pagina HTML5 (HTML + CSS + JavaScript, senza librerie). I file in `src/` sono concatenati da `tools/build.mjs` nell'ordine del nome. Le cartelle dei capitoli vengono inserite subito dopo `15_chapters.js`. Tutto finisce nello stesso scope globale, quindi ogni file vede le costanti e le funzioni dei file precedenti.

Uscite della build:

| File | Uso |
|---|---|
| `dist/dark-days-chronicles.html` | anteprima (non versionato) |
| `docs/index.html` | versione web per GitHub Pages |
| `app/src/main/assets/index.html` | gioco dentro l'app Android, con l'aggancio del tasto Indietro (`window.ddcBack`) |

La build inserisce `GAME_VERSION`, letto da `versionName` in `app/build.gradle.kts`, e `IS_APP`, che vale `true` solo nell'asset Android. Controlla anche la sintassi di tutto il codice: se c'è un errore indica il file e la riga.

## Ciclo di lavoro

```bash
node tools/build.mjs && node tools/validate-story.mjs && node tools/simulate.mjs --quick
```

Poi apri `docs/index.html` nel browser. Con gli strumenti per sviluppatori in modalità dispositivo (per esempio 844×390) puoi provare la disposizione orizzontale.

## Testi e lingue

Ogni testo visibile è un array `[italiano, inglese, spagnolo]` e si mostra con `tr(arr)`. Le stringhe dell'interfaccia stanno in `UI` dentro `10_data.js` e si leggono con `T_("chiave")`. Non scrivere mai testo in una sola lingua.

## Scene

Una scena è una voce di `SC`:

```js
SC.a1_mill = {
  bg: "mill",                         // sfondo illustrato (vedi `BG`)
  loc: ["Il mulino", "The mill", "El molino"],
  t: ["Testo…", "Text…", "Texto…"],   // oppure una funzione che restituisce l'array (testo dinamico)
  once: () => { xp(50); },            // eseguita solo la prima volta che si entra nella scena
  enter: () => { set("saw_mill"); },  // eseguita a ogni ingresso
  ch: [ /* scelte */ ],
};
```

Il paragrafo che comincia in maiuscolo prima di un `\n\n` viene mostrato come titolo, per esempio `"ATTO I — …\n\n"`. `cat(a, b, …)` unisce più blocchi di testo trilingue saltando quelli vuoti, utile per testi condizionali.

### Scelte

Ogni scelta ha `t` (il testo) e una o più di queste chiavi:

| Chiave | Effetto |
|---|---|
| `go: "scena"` | va alla scena |
| `req: () => bool` | la scelta compare solo se la condizione è vera |
| `check: {sk, dc, ok, ko, pc, adv, auto}` | prova di abilità con il d20. `sk` è la chiave dell'abilità (`ath`, `pers`, `sle`, `per`…); al posto di `sk` si può usare `save: "wis"` per un tiro salvezza. `pc: 1` fa tirare il protagonista invece del membro più bravo. `adv` e `auto` sono funzioni facoltative: `adv` dà vantaggio, `auto` fa riuscire la prova automaticamente. |
| `fight: "chiave"` + `win: "scena"` | combattimento dello scontro `ENC[chiave]` (può essere una funzione); `surprise: 1` fa iniziare i nemici |
| `cost: n` | costa n monete d'oro (la scelta fallisce se non bastano) |
| `fx: () => {…}` | effetto qualsiasi prima del resto |
| `rest: 1` | riposo lungo |
| `shop: "chiave"` | apre il negozio `SHOPS[chiave]` |
| `end: 1` | fine del capitolo: la scena corrente deve essere uno dei finali dichiarati in `defineChapter` |
| `toTitle: 1` | salva e torna al titolo |

Funzioni di supporto per `once`, `enter` e `fx`:

- `has(flag)` e `set(flag, v)` per leggere e impostare i flag della storia;
- `inP(id)` per sapere se un compagno è nel gruppo;
- `join(id)` per aggiungere un compagno;
- `gold(n)`, `item(k, n)`, `take(k)` e `xp(n)` per oro, oggetti ed esperienza;
- `dmgParty(n)` per infliggere danni a tutto il gruppo;
- `longRest()` e `shortRest()` per i riposi.

I flag restano nel salvataggio e passano ai capitoli successivi.

## Capitoli

```
src/chapters/ch2_<nome>/
  00_chapter.js    defineChapter({...}) + scena iniziale
  10_act1.js …     atti, in ordine di nome
```

```js
defineChapter({
  id: "ch2",
  num: ["Capitolo II", "Chapter II", "Capítulo II"],
  title: ["…", "…", "…"],
  blurb: ["…", "…", "…"],                // descrizione nella schermata Capitoli
  start: "ch2_start",
  maxLevel: 10,                          // livello massimo raggiungibile (tabella XPT fino al 12)
  endings: { ch2_end_a: ["…", "…", "…"] } // scene finali (devono avere una scelta con end:1)
});
SC.ch2_start = { bg: "road", loc: […], t: […], ch: [{ t: […], go: "ch2_a1_intro" }] };
```

Regole:

- **Prefissa gli id delle scene** con il capitolo (`ch2_…`), perché le scene di tutti i capitoli condividono `SC`.
- L'ordine dei capitoli è l'ordine delle cartelle. `nextChapter()` collega automaticamente la fine di un capitolo all'inizio del successivo.
- Le partite già arrivate alla fine stanno nella scena `ch_wait`: quando esce il nuovo capitolo, **Continua** le porta alla sua scena iniziale. Ogni fine capitolo salva anche una copia in `ddc-chapter-<id>`.
- Per reagire alle scelte passate usa i flag (`has("doran_ally")`) oppure `S.chaptersDone.ch1`, che contiene l'id del finale ottenuto (`end_dawn`, `end_twilight`, `end_dark`).
- Nuovi nemici, scontri, oggetti e mappe vanno in `10_data.js`, oppure in un file dati del capitolo che li aggiunga agli oggetti esistenti (`FOES.nuovo = {...}`).

`validate-story.mjs` controlla che:

- ogni `go`/`ok`/`ko`/`win` punti a una scena esistente;
- ogni `fight` punti a uno scontro esistente;
- ogni scena sia raggiungibile da un inizio di capitolo;
- ogni capitolo abbia la scena iniziale e i finali.

## Combattimento

- **Nemici** (`FOES`): `hp`, `ac`, `spd` (caselle), `xp`, `atk` (una lista con `b` per il bonus, `d` per i dadi, `r` per la gittata, `t` per il tipo di danno e `ranged`), più tratti come `undead`, `pack` (vantaggio se un alleato è adiacente al bersaglio), `boss` e `sv` (bonus ai tiri salvezza).
- **Scontri** (`ENC`): `map`, `foes` e `gold`. Il bottino garantito è in `LOOT[chiave]`; quello casuale viene da `rollLoot`.
- **Mappe** (`MAPS`): colori e numero di ostacoli. Il disegno a inchiostro e la copertura stanno in `70_maps_minis_cover.js`.
- **Regole** in `40_combat_rules.js`: tiri per colpire, copertura (`coverFor`), fiancheggiamento (`flanked`), reazioni (`provoke`, `overwatchCheck`) e IA (`aiValue`, `aiTurn`).

## Oggetti

`ITEMS` in `10_data.js`. Il campo `use` decide il comportamento:

- `heal` con `dice`: cura;
- `equip` con `slot` (`w` arma, `a` armatura, `t` ninnolo) e `v`;
- `throw` e `scroll` per gli oggetti da combattimento.

`price` lo rende acquistabile nei negozi (`SHOPS`).

## Test

- **`tools/validate-story.mjs`** controlla il grafo della storia (vedi sopra).
- **`tools/simulate.mjs`** gioca tutti gli scontri della campagna con un gruppo-bot, per ogni classe e difficoltà:
  - `--quick` fa poche partite;
  - `--runs N`, `--classes a,b` e `--diff 0|1|2` regolano la simulazione;
  - `--verbose` mostra la percentuale di vittorie scontro per scontro.

  Fallisce (exit 1) se uno scontro è vinto meno del 50% delle volte. Usalo dopo ogni modifica a nemici, scontri o regole.

## Android

`app/` è un'app WebView minimale (`MainActivity.java`) che:

- carica `assets/index.html`;
- gira il tasto Indietro al gioco;
- apre i link esterni nel browser (per esempio il download degli aggiornamenti);
- espone `DDCAndroid.setOrientation("land" | "port" | "auto")` e `DDCAndroid.appVersion()`.

Per rilasciare: aumenta `versionCode`/`versionName`, aggiungi la sezione in `CHANGELOG.md` e fai il push su `main`. La CI crea la release `vX.Y` con l'APK, se non esiste già.
