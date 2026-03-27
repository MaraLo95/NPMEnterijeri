# 🚀 NPM Enterijeri API - Uputstvo za Deploy

## Pre-deploy Checklist

- [ ] PHP 8.1+ instaliran na serveru
- [ ] MySQL 8.0+ baza podataka kreirana
- [ ] Composer instaliran
- [ ] mod_rewrite omogućen (Apache)

---

## 📦 Koraci za Deploy na Shared Hosting

### 1. Upload fajlova

1. Uploadujte **ceo sadržaj `laravel-api` foldera** na server
2. Preporučena struktura:
   ```
   /home/username/
   ├── public_html/api/     ← Samo sadržaj /public foldera
   └── laravel-api/         ← Ostatak Laravel aplikacije (VAN public_html!)
   ```

### 2. Podešavanje public foldera

Ako vaš hosting zahteva da sve bude u `public_html`:

**Opcija A - Subfolder:**
```
public_html/
└── api/
    ├── .htaccess
    ├── index.php (izmenjeni - vidi dole)
    └── ... ostalo iz /public
```

Izmenite `public_html/api/index.php`:
```php
<?php
// Promenite putanje da pokazuju na pravi folder
require __DIR__.'/../../laravel-api/vendor/autoload.php';
$app = require_once __DIR__.'/../../laravel-api/bootstrap/app.php';
// ... ostatak ostaje isto
```

**Opcija B - Direktno u public_html:**
Uploadujte sve u `public_html` i podesite `.htaccess` da preusmerava na `/public/index.php`

### 3. Konfiguracija Environment-a

1. Kopirajte `env.example.txt` kao `.env`:
   ```bash
   cp env.example.txt .env
   ```

2. Editujte `.env` fajl i unesite:
   ```env
   APP_NAME="NPM Enterijeri API"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://npmenterijeri.rs
   
   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=ime_baze
   DB_USERNAME=korisnik_baze
   DB_PASSWORD=lozinka_baze
   
   SANCTUM_STATEFUL_DOMAINS=npmenterijeri.rs,npmenterijeri.rs,www.npmenterijeri.rs
   ```

### 4. Instalacija Zavisnosti

Preko SSH ili cPanel Terminal:
```bash
cd /putanja/do/laravel-api
composer install --optimize-autoloader --no-dev
```

### 5. Generisanje Ključa

```bash
php artisan key:generate
```

### 6. Migracija Baze

```bash
php artisan migrate --force
```

### 7. Optimizacija za Produkciju

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 8. Podešavanje Dozvola

```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

---

## 🔧 cPanel Specifične Instrukcije

### Kreiranje MySQL Baze

1. Idite na **MySQL Databases** u cPanel-u
2. Kreirajte novu bazu (npr. `username_npm`)
3. Kreirajte MySQL korisnika
4. Dodelite korisnika bazi sa **ALL PRIVILEGES**

### Pristup preko SSH

1. Omogućite SSH pristup u cPanel-u
2. Konektujte se: `ssh username@vasdomen.rs`
3. Navigirajte do foldera: `cd ~/laravel-api`

### Cron Job za Queue (opciono)

Ako koristite queue jobs, dodajte cron:
```
* * * * * cd /home/username/laravel-api && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🌐 API Endpoint-i Nakon Deploy-a

Vaš API će biti dostupan na:

| Endpoint | URL |
|----------|-----|
| Login | `https://npmenterijeri.rs/api/auth/login` |
| Klijenti | `https://npmenterijeri.rs/api/klijenti` |
| Ponude | `https://npmenterijeri.rs/api/ponude` |
| Obračuni | `https://npmenterijeri.rs/api/obracuni` |
| Projekti | `https://npmenterijeri.rs/api/projekti` |

---

## ⚠️ Troubleshooting

### 500 Internal Server Error
- Proverite `.htaccess` fajl
- Proverite dozvole na `storage/` i `bootstrap/cache/`
- Proverite `storage/logs/laravel.log` za greške

### 404 Not Found za API rute
- Proverite da li je `mod_rewrite` omogućen
- Proverite `APP_URL` u `.env`

### Database Connection Error
- Proverite kredencijale u `.env`
- Proverite da li je MySQL server pokrenut
- Proverite da li korisnik ima prava pristupa bazi

---

## 📞 Podrška

Za pomoć kontaktirajte: npmmontaza@gmail.com

