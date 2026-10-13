# Dark Days Chronicles — progetto Android

App Android nativa (WebView) che contiene il gioco completo in `app/src/main/assets/index.html`.
Funziona offline. Con la connessione attiva carica anche i caratteri tipografici originali; senza connessione usa caratteri di sistema simili.

## Strada A — APK compilato da GitHub (nessuna installazione)

1. Crea un account gratuito su github.com, se non lo hai.
2. Crea un nuovo repository (pubblico o privato), per esempio `dark-days-chronicles`.
3. Nella pagina del repository: **Add file → Upload files**, e trascina **il contenuto** di questa cartella
   (le cartelle `app`, `.github` e i file `settings.gradle.kts`, `build.gradle.kts`, `gradle.properties`).
   La cartella `.github` è nascosta su alcuni sistemi: assicurati che venga caricata, altrimenti la compilazione non parte.
4. Premi **Commit changes**. Si avvia da solo il workflow **Build APK** (scheda **Actions**, circa 3–5 minuti).
5. Quando l'esecuzione è verde, aprila e scarica l'artefatto **DarkDaysChronicles-apk** (uno zip con dentro l'APK).
6. Copia `DarkDaysChronicles.apk` sul telefono e aprilo. Android ti chiederà di consentire l'installazione da questa fonte.

Per ricompilare dopo una modifica basta caricare di nuovo i file: il workflow riparte a ogni commit
(oppure da **Actions → Build APK → Run workflow**).

## Strada B — Android Studio

1. Installa Android Studio.
2. **File → Open** e scegli questa cartella. Lascia che sincronizzi Gradle.
3. **Build → Build App Bundle(s) / APK(s) → Build APK(s)**, oppure premi ▶ con il telefono collegato via USB.

## Note

- L'APK è firmato con la chiave di debug: va benissimo per installarlo sui tuoi dispositivi e per condividerlo,
  ma per pubblicarlo sul Play Store serve una chiave di firma tua e un App Bundle (.aab).
- Identificativo app: `com.darkdays.chronicles`. Versione 1.0, Android 8.0 o superiore.
- Il tasto Indietro chiude i menu del gioco; dalla schermata principale manda l'app in background senza perdere la partita.
- I salvataggi restano nel telefono, nella memoria dell'app.
