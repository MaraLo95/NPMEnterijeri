# NPM Enterijeri - Laravel API Backend

## Pregled

Laravel API backend za NPM Enterijeri admin panel. Obezbeđuje API endpoint-e za:

- **Autentifikaciju** (login, register, logout)
- **Klijente** (CRUD operacije)
- **Cenovnik** (upravljanje cenama usluga)
- **Obračune ponuda** (kreiranje kalkulacija sa automatskim kreiranjem ponude)
- **Ponude** (CRUD operacije, PDF generisanje)
- **Projekte** (upravljanje projektima, fazama, radnicima)

## Instalacija

### 1. Klonirajte repozitorijum i instalirajte zavisnosti

```bash
cd laravel-api
composer install
```

### 2. Konfiguracija okruženja

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Konfigurišite bazu podataka

Editujte `.env` fajl i unesite podatke za MySQL bazu:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=npm_enterijeri
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 4. Pokrenite migracije

```bash
php artisan migrate
```

### 5. (Opciono) Seed baze sa test podacima

```bash
php artisan db:seed
```

### 6. Pokrenite server

```bash
php artisan serve
```

Server će biti dostupan na `http://localhost:8000`

## API Endpoint-i

### Autentifikacija

| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/api/auth/register` | Registracija korisnika |
| POST | `/api/auth/login` | Logovanje |
| POST | `/api/auth/logout` | Odjavljivanje (potreban token) |
| GET | `/api/auth/me` | Dobijanje info o ulogovanom korisniku |
| PUT | `/api/auth/change-password` | Promena lozinke |

### Klijenti

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/klijenti` | Lista svih klijenata |
| POST | `/api/klijenti` | Kreiranje klijenta |
| GET | `/api/klijenti/{id}` | Detalji klijenta |
| PUT | `/api/klijenti/{id}` | Ažuriranje klijenta |
| DELETE | `/api/klijenti/{id}` | Brisanje klijenta |

### Cenovnik

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/cenovnik` | Lista stavki cenovnika |
| POST | `/api/cenovnik` | Dodavanje stavke |
| PUT | `/api/cenovnik/{id}` | Ažuriranje stavke |
| DELETE | `/api/cenovnik/{id}` | Brisanje stavke |

### Obračuni ponuda

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/obracuni` | Lista obračuna |
| POST | `/api/obracuni` | Kreiranje obračuna (auto-kreira ponudu) |
| GET | `/api/obracuni/{id}` | Detalji obračuna |
| PUT | `/api/obracuni/{id}` | Ažuriranje obračuna |
| DELETE | `/api/obracuni/{id}` | Brisanje obračuna |
| PATCH | `/api/obracuni/{id}/status` | Promena statusa |
| POST | `/api/obracuni/calculate-profit` | Kalkulacija profita |

### Ponude

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/ponude` | Lista ponuda |
| POST | `/api/ponude` | Kreiranje ponude |
| GET | `/api/ponude/{id}` | Detalji ponude |
| PUT | `/api/ponude/{id}` | Ažuriranje ponude |
| DELETE | `/api/ponude/{id}` | Brisanje ponude |
| PATCH | `/api/ponude/{id}/status` | Promena statusa |
| GET | `/api/ponude/{id}/pdf` | Generisanje PDF-a |

### Projekti

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/projekti` | Lista projekata |
| POST | `/api/projekti` | Kreiranje projekta |
| GET | `/api/projekti/{id}` | Detalji projekta |
| PUT | `/api/projekti/{id}` | Ažuriranje projekta |
| DELETE | `/api/projekti/{id}` | Brisanje projekta |
| PATCH | `/api/projekti/{id}/status` | Promena statusa |
| POST | `/api/projekti/{id}/radnici` | Dodavanje radnika |
| DELETE | `/api/projekti/{id}/radnici/{radnikId}` | Uklanjanje radnika |

## Autentifikacija

API koristi Laravel Sanctum za autentifikaciju. 

### Dobijanje tokena

```bash
POST /api/auth/login
Content-Type: application/json

{
    "email": "admin@npm.rs",
    "password": "password123"
}
```

### Korišćenje tokena

```bash
GET /api/ponude
Authorization: Bearer {your_token}
```

## Struktura Projekta

```
laravel-api/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── AuthController.php
│   │           ├── CenovnikController.php
│   │           ├── KlijentController.php
│   │           ├── ObracunPonudeController.php
│   │           ├── PonudaController.php
│   │           └── ProjekatController.php
│   └── Models/
│       ├── Cenovnik.php
│       ├── Klijent.php
│       ├── ObracunPonude.php
│       ├── ObracunStavka.php
│       ├── Ponuda.php
│       ├── PonudaStavka.php
│       ├── Projekat.php
│       ├── ProjekatFaza.php
│       ├── Radnik.php
│       └── User.php
├── database/
│   └── migrations/
│       ├── 2025_01_01_000001_create_klijenti_table.php
│       ├── 2025_01_01_000002_create_cenovnik_table.php
│       ├── 2025_01_01_000003_create_obracuni_ponuda_table.php
│       ├── 2025_01_01_000004_create_ponude_table.php
│       ├── 2025_01_01_000005_create_ponude_stavke_table.php
│       ├── 2025_01_01_000006_create_obracuni_stavke_table.php
│       ├── 2025_01_01_000007_create_radnici_table.php
│       ├── 2025_01_01_000008_create_projekti_table.php
│       ├── 2025_01_01_000009_create_projekat_faze_table.php
│       └── 2025_01_01_000010_create_projekat_radnik_table.php
└── routes/
    └── api.php
```

## Automatsko kreiranje ponude

Kada se kreira novi obračun (`POST /api/obracuni`), sistem automatski kreira povezanu ponudu sa:
- Istim brojem kao obračun
- Istim klijentom i nazivom projekta
- Ukupnom cenom sa uračunatim profitom
- Statusom "nacrt" i oznakom "NOVO"

## Tehnologije

- PHP 8.1+
- Laravel 10.x
- Laravel Sanctum (autentifikacija)
- MySQL 8.0+
- DomPDF (generisanje PDF-a)

## Licenca

Vlasništvo NPM Enterijeri.

