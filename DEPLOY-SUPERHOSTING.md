# NPM Enterijeri – deploy na SuperHosting

## Šta je pripremljeno

- **database-export.sql** – kompletan izvoz baze u jednom fajlu (import u phpMyAdmin)
- **@vite()** u `react-app.blade.php` – automatsko učitavanje build fajlova
- **npm run build** – production bundle u `public/build/`

---

## VAŽNO: Zahtevi ka localhost:5173 na produkciji

Ako vidiš u Network tabu zahteve ka `http://localhost:5173/@vite/client` ili `[::1]:5173` – uzrok je fajl **`public/hot`** na serveru. Taj fajl Laravel koristi da zna da koristi Vite dev server umesto build fajlova.

**Rešenje:** Obriši fajl **`public/hot`** (i `public/build/hot` ako postoji) na hostingu preko File Managera. Zatim osveži stranicu.

---

## Korak 1: Export baze (ako još nisi)

Lokalno u root foldera projekta pokreni:

```bash
php export-database.php
```

Dobijaš `database-export.sql`. Sačuvaj ga, koristićeš ga u phpMyAdmin.

---

## Korak 2: Kreiranje baze na SuperHosting

1. Uloguj se u **Panel SuperHosting** (panel.superhosting.pl)
2. Otvori **phpMyAdmin** ili **Baze podataka**
3. Kreiraj novu MySQL bazu:
   - Naziv (npr. `npmenterijeri`)
   - Korisnik i lozinka
   - Zapiši: host, baza, korisnik, lozinka

---

## Korak 3: Import baze

1. U phpMyAdmin izaberi novu bazu
2. Kartica **Uvezi** (Import)
3. Izaberi fajl **database-export.sql**
4. Klikni **Izvrši**

---

## Korak 4: Upload fajlova

Preko **File Managera** ili FTP pošalji sve fajlove projekta na hosting.

### Šta NE uploadovati / obrisi pre uploada

- **`public/hot`** – OBRIŠI pre uploada ili na serveru odmah posle! Ovaj fajl nastaje kad radi `npm run dev` i izaziva zahteve ka localhostu na produkciji.
- **`node_modules/`** – ne treba
- **`public/build/hot`** – obriši ako postoji

### Šta obavezno uploadovati

- Ceo sadržaj foldera (bez `node_modules`, `vendor` ako želiš da ih kasnije instaliraš)

### Šta ne mora

- `node_modules/` – ne
- `vendor/` – mora da se uploaduje ili da se na hostingu instalira (ako imaš PHP/Composer)
- `.env` – NE uploadovati sa lokala; na hostingu napravi novi (vidi ispod)
- `.git/` – opciono

### Preporučeno: upload celog projekta

Ako koristiš FTP/File Manager, uploaduj:

```
app/
bootstrap/
config/
database/
  database-export.sql  (opciono, već imaš u root)
  migrations/
public/
resources/
routes/
storage/
  app/
  framework/
  logs/
vendor/
.htaccess  (ako postoji u rootu)
composer.json
composer.lock
artisan
export-database.php
```

---

## Korak 5: Struktura na hostingu

SuperHosting obično ima:
- `public_html` ili `www` – korenski folder za sajt
- `domains/tvojdomen.rs/public_html` – za određenu domenu

### Laravel zahteva da se document root pokazuje na `public`

**Opcija A** – document root = `public_html` (kao da je to `public`):

- U root projekta preimenuj ili kopiraj sadržaj:
  - sadržaj `public/` → u `public_html/`
  - ostale foldere (`app`, `bootstrap`, itd.) iznad nivoa `public_html` (npr. u `npmenterijeri/`)

**Opcija B** – symlink ili redirect:

Ako moraš da imaš sve u jednom folderu, u root dodaj `index.php` koji koristi parent `public/index.php`:

```php
<?php
// index.php u root - redirect na public
require __DIR__.'/public/index.php';
```

Ako hosting dozvoljava symlink: `public_html` → symlink na `projekat/public`.

---

## Korak 6: Fajl .env na hostingu

U root foldera projekta (gde su `app`, `config`, itd.) kreiraj `.env` sa:

```env
APP_NAME="NPM Enterijeri"
APP_ENV=production
APP_KEY=base64:TvojGenerisaniKljuc
APP_DEBUG=false
APP_URL=https://tvoj-domen.rs

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=ime_baze_sa_superhosting
DB_USERNAME=korisnik_baze
DB_PASSWORD=lozinka_baze

CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

### Generisanje APP_KEY

Lokalno pokreni:

```bash
php artisan key:generate --show
```

 Kopiraj vrednost i ubaci u `APP_KEY=`.

---

## Korak 7: Dozvole (permissions)

Za `storage/` i `bootstrap/cache/` postavi dozvole na **755** ili **775** (preko File Managera).

---

## Korak 8: Testiranje

1. Otvori: `https://tvoj-domen.rs`
2. Proveri: početna stranica, `/admin/login`

---

## Česta pitanja

**Sajt pokazuje 500 grešku**
- Proveri da li postoji `.env` i da li su `DB_*` tačni
- Proveri `storage/logs/laravel.log`
- Proveri dozvole na `storage` i `bootstrap/cache`

**Stilovi/JS se ne učitavaju**
- Da li je `public/build/` uploadovan
- Da li putanje u `.env` odgovaraju domeni (`APP_URL`)

**Baza ne radi**
- Proveri `DB_HOST` (često `localhost` ili IP koju daje SuperHosting)
- Proveri da li je baza importovana u phpMyAdmin

---

## Kontakt SuperHosting podrške

Ako nemaš pristup terminalu, pitaj ih:
- Kako postaviti document root na `public`
- Da li imaju način da se pokrenu `php artisan` komande (npr. deploy skripta)
