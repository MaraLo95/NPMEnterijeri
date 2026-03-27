-- NPM Enterijeri - izvoz baze
-- Datum: 2026-03-24 00:36:52

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE `activity_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `log_name` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `subject_id` bigint(20) unsigned DEFAULT NULL,
  `causer_type` varchar(255) DEFAULT NULL,
  `causer_id` bigint(20) unsigned DEFAULT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`properties`)),
  `batch_uuid` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subject` (`subject_type`,`subject_id`),
  KEY `causer` (`causer_type`,`causer_id`),
  KEY `activity_log_log_name_index` (`log_name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('1', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-22 01:07:18', '2026-03-22 01:07:18');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('2', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-22 01:32:40', '2026-03-22 01:32:40');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('3', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-22 01:35:04', '2026-03-22 01:35:04');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('4', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-22 01:42:03', '2026-03-22 01:42:03');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('5', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-22 01:48:23', '2026-03-22 01:48:23');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('6', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 19:17:25', '2026-03-23 19:17:25');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('7', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 20:06:29', '2026-03-23 20:06:29');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('8', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 20:07:50', '2026-03-23 20:07:50');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('9', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 20:12:39', '2026-03-23 20:12:39');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('10', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 20:18:55', '2026-03-23 20:18:55');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('11', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 20:50:29', '2026-03-23 20:50:29');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('12', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 20:52:02', '2026-03-23 20:52:02');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('13', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 20:55:32', '2026-03-23 20:55:32');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('14', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 21:05:03', '2026-03-23 21:05:03');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('15', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 23:04:19', '2026-03-23 23:04:19');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('16', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 23:07:59', '2026-03-23 23:07:59');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('17', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 23:10:29', '2026-03-23 23:10:29');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('18', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 23:12:51', '2026-03-23 23:12:51');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('19', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 23:14:53', '2026-03-23 23:14:53');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('20', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 23:19:22', '2026-03-23 23:19:22');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('21', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 23:54:19', '2026-03-23 23:54:19');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('22', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 23:54:29', '2026-03-23 23:54:29');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('23', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 23:55:00', '2026-03-23 23:55:00');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('24', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-23 23:58:09', '2026-03-23 23:58:09');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('25', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-24 00:03:12', '2026-03-24 00:03:12');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('26', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-24 00:03:27', '2026-03-24 00:03:27');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('27', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-24 00:06:19', '2026-03-24 00:06:19');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('28', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-24 00:11:20', '2026-03-24 00:11:20');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('29', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-24 00:16:03', '2026-03-24 00:16:03');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES ('30', 'default', 'Korisnik se ulogovao', '', '', '', 'App\\Models\\User', '1', '[]', '', '2026-03-24 00:19:14', '2026-03-24 00:19:14');

DROP TABLE IF EXISTS `cenovnik`;
CREATE TABLE `cenovnik` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vrsta_usluge` varchar(255) NOT NULL,
  `opis_usluge` text DEFAULT NULL,
  `jedinica_mere` enum('KOM','M','M2','H','PAK') NOT NULL DEFAULT 'KOM',
  `cena_eur` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cenovnik_vrsta_usluge_index` (`vrsta_usluge`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `klijenti`;
CREATE TABLE `klijenti` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `naziv` varchar(255) NOT NULL,
  `tip` enum('fizicko_lice','pravno_lice') NOT NULL DEFAULT 'pravno_lice',
  `email` varchar(255) DEFAULT NULL,
  `telefon` varchar(50) DEFAULT NULL,
  `adresa` varchar(255) DEFAULT NULL,
  `grad` varchar(100) DEFAULT NULL,
  `postanski_broj` varchar(20) DEFAULT NULL,
  `pib` varchar(20) DEFAULT NULL,
  `maticni_broj` varchar(20) DEFAULT NULL,
  `kontakt_osoba` varchar(255) DEFAULT NULL,
  `napomena` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `klijenti_naziv_index` (`naziv`),
  KEY `klijenti_pib_index` (`pib`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `klijenti` (`id`, `naziv`, `tip`, `email`, `telefon`, `adresa`, `grad`, `postanski_broj`, `pib`, `maticni_broj`, `kontakt_osoba`, `napomena`, `created_at`, `updated_at`, `deleted_at`) VALUES ('2', 'Test K', 'pravno_lice', '', '', '', '', '', '', '', '', '', '2026-03-23 20:32:07', '2026-03-23 20:32:07', '');
INSERT INTO `klijenti` (`id`, `naziv`, `tip`, `email`, `telefon`, `adresa`, `grad`, `postanski_broj`, `pib`, `maticni_broj`, `kontakt_osoba`, `napomena`, `created_at`, `updated_at`, `deleted_at`) VALUES ('3', 'Test Klijent 1774295102', 'pravno_lice', '', '', '', '', '', '', '', '', '', '2026-03-23 20:45:02', '2026-03-23 20:45:02', '');

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('1', '2019_12_14_000001_create_personal_access_tokens_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('2', '2025_01_01_000001_create_klijenti_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('3', '2025_01_01_000002_create_cenovnik_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('4', '2025_01_01_000003_create_obracuni_ponuda_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('5', '2025_01_01_000004_create_ponude_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('6', '2025_01_01_000005_create_ponude_stavke_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('7', '2025_01_01_000006_create_obracuni_stavke_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('8', '2025_01_01_000007_create_radnici_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('9', '2025_01_01_000008_create_projekti_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('10', '2025_01_01_000009_create_projekat_faze_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('11', '2025_01_01_000010_create_projekat_radnik_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('12', '2026_03_21_175556_create_activity_log_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('13', '2026_03_21_175557_add_event_column_to_activity_log_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('14', '2026_03_21_175558_add_batch_uuid_column_to_activity_log_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('15', '2024_01_01_000000_create_users_table', '2');

DROP TABLE IF EXISTS `obracuni_ponuda`;
CREATE TABLE `obracuni_ponuda` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `broj_obracuna` varchar(50) NOT NULL,
  `klijent_id` bigint(20) unsigned DEFAULT NULL,
  `ponuda_id` bigint(20) unsigned DEFAULT NULL,
  `naziv_projekta` varchar(255) NOT NULL,
  `datum_obracuna` date NOT NULL,
  `ukupna_cena_materijala` decimal(12,2) NOT NULL DEFAULT 0.00,
  `profit_procenat` int(11) DEFAULT NULL,
  `profit_iznos` decimal(12,2) NOT NULL DEFAULT 0.00,
  `ukupna_cena_ponude` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` enum('nacrt','poslata','prihvacena','odbijena','realizovana') NOT NULL DEFAULT 'nacrt',
  `is_novo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `obracuni_ponuda_broj_obracuna_unique` (`broj_obracuna`),
  KEY `obracuni_ponuda_klijent_id_foreign` (`klijent_id`),
  KEY `obracuni_ponuda_broj_obracuna_index` (`broj_obracuna`),
  KEY `obracuni_ponuda_status_index` (`status`),
  KEY `obracuni_ponuda_datum_obracuna_index` (`datum_obracuna`),
  KEY `obracuni_ponuda_ponuda_id_foreign` (`ponuda_id`),
  CONSTRAINT `obracuni_ponuda_klijent_id_foreign` FOREIGN KEY (`klijent_id`) REFERENCES `klijenti` (`id`) ON DELETE SET NULL,
  CONSTRAINT `obracuni_ponuda_ponuda_id_foreign` FOREIGN KEY (`ponuda_id`) REFERENCES `ponude` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `obracuni_stavke`;
CREATE TABLE `obracuni_stavke` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `obracun_id` bigint(20) unsigned NOT NULL,
  `cenovnik_id` bigint(20) unsigned DEFAULT NULL,
  `naziv_usluge` varchar(255) NOT NULL,
  `opis` text DEFAULT NULL,
  `jedinica_mere` enum('KOM','M','M2','H','PAK') NOT NULL DEFAULT 'KOM',
  `kolicina` decimal(10,2) NOT NULL,
  `cena_po_jm` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `obracuni_stavke_cenovnik_id_foreign` (`cenovnik_id`),
  KEY `obracuni_stavke_obracun_id_index` (`obracun_id`),
  CONSTRAINT `obracuni_stavke_cenovnik_id_foreign` FOREIGN KEY (`cenovnik_id`) REFERENCES `cenovnik` (`id`) ON DELETE SET NULL,
  CONSTRAINT `obracuni_stavke_obracun_id_foreign` FOREIGN KEY (`obracun_id`) REFERENCES `obracuni_ponuda` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('1', 'App\\Models\\User', '1', 'auth_token', 'cca9e16eaf1997ba0325c8836a4ffe27464f1a1821ae196ea76675ec23bcc197', '[\"*\"]', '2026-03-22 01:12:21', '', '2026-03-22 01:07:18', '2026-03-22 01:12:21');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('2', 'App\\Models\\User', '1', 'auth_token', '2f8abef1ed0dd55bfe0ba5e2eadef7b9d9b384d535b727061877361736a891a5', '[\"*\"]', '2026-03-22 01:34:54', '', '2026-03-22 01:32:40', '2026-03-22 01:34:54');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('3', 'App\\Models\\User', '1', 'auth_token', '45dde1e7b3c44cf06e3918cc37384ce0b9635b58cd0d824940980787263c24a6', '[\"*\"]', '2026-03-22 01:41:40', '', '2026-03-22 01:35:04', '2026-03-22 01:41:40');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('4', 'App\\Models\\User', '1', 'auth_token', 'c6a687c7556ff4bf772f727f95bb5ed5d3882e730d28f1be8a2f5fbbe0822d0d', '[\"*\"]', '', '', '2026-03-22 01:42:03', '2026-03-22 01:42:03');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('5', 'App\\Models\\User', '1', 'auth_token', 'd5c2325f3ee5f58a8adf6473c1a8bb52b9b6475a851f02456d5f0fce6cbb4cd8', '[\"*\"]', '', '', '2026-03-22 01:48:23', '2026-03-22 01:48:23');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('6', 'App\\Models\\User', '1', 'auth_token', '12abd91c823c592bbfc49068100d1f950d880133b214eb39af3d6d8ec1b2ebeb', '[\"*\"]', '2026-03-23 20:06:11', '', '2026-03-23 19:17:25', '2026-03-23 20:06:11');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('7', 'App\\Models\\User', '1', 'auth_token', 'ca13c1ecf3e8c4ecf43dca4b222ee65bdac65fc8127ddb8adeb55230c7203b18', '[\"*\"]', '2026-03-23 20:12:13', '', '2026-03-23 20:06:29', '2026-03-23 20:12:13');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('8', 'App\\Models\\User', '1', 'auth_token', '2de9f0d29166df5927251bb07c349f9380ba72aee92cd811a1e2ecdd8deb46fb', '[\"*\"]', '2026-03-23 20:51:44', '', '2026-03-23 20:07:50', '2026-03-23 20:51:44');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('9', 'App\\Models\\User', '1', 'auth_token', '5fead1f4879faf4f6401eb3f8803cb781f8d37750e34d15459785fd7f8e73231', '[\"*\"]', '2026-03-23 20:50:06', '', '2026-03-23 20:12:39', '2026-03-23 20:50:06');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('10', 'App\\Models\\User', '1', 'auth_token', 'af52e9e0943f2c05dbb61146fc4e08bfab7b683506df4327b53f3d6aa70c3c1b', '[\"*\"]', '2026-03-23 20:24:12', '', '2026-03-23 20:18:55', '2026-03-23 20:24:12');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('11', 'App\\Models\\User', '1', 'auth_token', '390006aa49c7f1eba0626cf27dd779dc44d2215fbcf0f95e34009d36ed313f86', '[\"*\"]', '2026-03-23 23:07:18', '', '2026-03-23 20:50:29', '2026-03-23 23:07:18');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('12', 'App\\Models\\User', '1', 'auth_token', 'b7748fce3432d947ec0837cafa54b84544e3753dc63f0a4769aaae281d059219', '[\"*\"]', '2026-03-23 20:55:12', '', '2026-03-23 20:52:02', '2026-03-23 20:55:12');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('13', 'App\\Models\\User', '1', 'auth_token', '8b0adc7b2bcbdc67edf4f84f52f129d0b410d679ca4e9f6cdddf6cc38e3bb89f', '[\"*\"]', '2026-03-23 23:08:41', '', '2026-03-23 20:55:32', '2026-03-23 23:08:41');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('14', 'App\\Models\\User', '1', 'auth_token', '8602608cc5d5e77ae73e3aa3a51733ec08951b61357bc21209b0f3d67cde1288', '[\"*\"]', '2026-03-23 21:47:37', '', '2026-03-23 21:05:03', '2026-03-23 21:47:37');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('15', 'App\\Models\\User', '1', 'auth_token', '767a08da6cd2ce9433caed19db6ff860d2312317461df9eecec0c1aaf5bfd987', '[\"*\"]', '', '', '2026-03-23 23:04:19', '2026-03-23 23:04:19');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('16', 'App\\Models\\User', '1', 'auth_token', '5645bdb701cbc5075c8c06ff28cef2bee4543d77f865f94cb5f87e100063fa64', '[\"*\"]', '2026-03-23 23:08:45', '', '2026-03-23 23:07:59', '2026-03-23 23:08:45');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('17', 'App\\Models\\User', '1', 'auth_token', 'a9e25366ec6356e2a55edca98764684330bca9bfdbf0187b0c4a0809439538f8', '[\"*\"]', '2026-03-23 23:10:40', '', '2026-03-23 23:10:29', '2026-03-23 23:10:40');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('18', 'App\\Models\\User', '1', 'auth_token', 'fc1606a301b0c5164083931ccc8a807d2d8deec35e39a842f047ad24094e609b', '[\"*\"]', '2026-03-23 23:13:19', '', '2026-03-23 23:12:51', '2026-03-23 23:13:19');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('19', 'App\\Models\\User', '1', 'auth_token', '6d5a174c8e3d6c12ef5dbcb7d76e166d005c54a0a7a4e300e3f14c17677eb004', '[\"*\"]', '2026-03-23 23:17:18', '', '2026-03-23 23:14:53', '2026-03-23 23:17:18');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('20', 'App\\Models\\User', '1', 'auth_token', 'b6b3bdc334071403dda35ab3419c9b73995b59241ae2bf8b030c7138b47072e6', '[\"*\"]', '2026-03-23 23:54:43', '', '2026-03-23 23:19:22', '2026-03-23 23:54:43');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('21', 'App\\Models\\User', '1', 'auth_token', 'efcdc09b412a7a021829f89a79d9672258b3d9ecf9b18443d1208b500af8c590', '[\"*\"]', '', '', '2026-03-23 23:54:19', '2026-03-23 23:54:19');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('22', 'App\\Models\\User', '1', 'auth_token', 'cb40a25a51f6ff239db25684f0a9de196366c7fc76837183fbbcdecd94a837e7', '[\"*\"]', '', '', '2026-03-23 23:54:29', '2026-03-23 23:54:29');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('23', 'App\\Models\\User', '1', 'auth_token', '5f2b4ad46f124d5844b5abd474b4d8530889d2633327cb0a4466bafe9b56b260', '[\"*\"]', '2026-03-23 23:57:54', '', '2026-03-23 23:55:00', '2026-03-23 23:57:54');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('24', 'App\\Models\\User', '1', 'auth_token', 'ad320fefedf52332dc4377b7390b531dc89c5853c0ce5782ceb8f6912e754d2a', '[\"*\"]', '2026-03-24 00:03:45', '', '2026-03-23 23:58:09', '2026-03-24 00:03:45');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('25', 'App\\Models\\User', '1', 'auth_token', '6d6c9ce737912760e17c421627e650fa210ff0227b63c3c44b185623219e6fb6', '[\"*\"]', '2026-03-24 00:03:46', '', '2026-03-24 00:03:12', '2026-03-24 00:03:46');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('26', 'App\\Models\\User', '1', 'auth_token', '6a599d808941796472397997e2746ad3a650de2703048c0ae3b266025841ed35', '[\"*\"]', '', '', '2026-03-24 00:03:27', '2026-03-24 00:03:27');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('27', 'App\\Models\\User', '1', 'auth_token', '830c452bbd0cf2ecec2fadd63158052c4be06bcf5e86879ba1dba646d96299f9', '[\"*\"]', '2026-03-24 00:11:04', '', '2026-03-24 00:06:19', '2026-03-24 00:11:04');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('28', 'App\\Models\\User', '1', 'auth_token', 'e545705ad824f2c6568904a8feba02c841ee8d52bf373325b3e545579ca7965d', '[\"*\"]', '2026-03-24 00:15:51', '', '2026-03-24 00:11:20', '2026-03-24 00:15:51');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('29', 'App\\Models\\User', '1', 'auth_token', '9f230a1a955c72d329916d9f2603a871849cd6ff9cf8b31eb0d0e64e0e7d571c', '[\"*\"]', '2026-03-24 00:18:57', '', '2026-03-24 00:16:03', '2026-03-24 00:18:57');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('30', 'App\\Models\\User', '1', 'auth_token', 'e926d704d1754f56188b420030eda42c20725e56bc0c3ff1ab50576dedda3760', '[\"*\"]', '2026-03-24 00:24:16', '', '2026-03-24 00:19:14', '2026-03-24 00:24:16');

DROP TABLE IF EXISTS `ponude`;
CREATE TABLE `ponude` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `broj_ponude` varchar(50) NOT NULL,
  `klijent_id` bigint(20) unsigned DEFAULT NULL,
  `obracun_id` bigint(20) unsigned DEFAULT NULL,
  `naziv_ponude` varchar(255) NOT NULL,
  `naziv_projekta` varchar(255) DEFAULT NULL,
  `datum_ponude` date NOT NULL,
  `datum_vazenja` date DEFAULT NULL,
  `rok_isporuke` varchar(255) DEFAULT NULL,
  `nacin_placanja` varchar(255) DEFAULT NULL,
  `napomena` text DEFAULT NULL,
  `napomena_pdv` text DEFAULT NULL,
  `status` enum('nacrt','poslata','prihvacena','odbijena','istekla','realizovana') NOT NULL DEFAULT 'nacrt',
  `ukupna_cena` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_novo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ponude_broj_ponude_unique` (`broj_ponude`),
  KEY `ponude_klijent_id_foreign` (`klijent_id`),
  KEY `ponude_broj_ponude_index` (`broj_ponude`),
  KEY `ponude_status_index` (`status`),
  KEY `ponude_datum_ponude_index` (`datum_ponude`),
  KEY `ponude_obracun_id_foreign` (`obracun_id`),
  CONSTRAINT `ponude_klijent_id_foreign` FOREIGN KEY (`klijent_id`) REFERENCES `klijenti` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ponude_obracun_id_foreign` FOREIGN KEY (`obracun_id`) REFERENCES `obracuni_ponuda` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ponude_stavke`;
CREATE TABLE `ponude_stavke` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ponuda_id` bigint(20) unsigned NOT NULL,
  `cenovnik_id` bigint(20) unsigned DEFAULT NULL,
  `naziv_usluge` varchar(255) NOT NULL,
  `opis` text DEFAULT NULL,
  `jedinica_mere` enum('KOM','M','M2','H','PAK') NOT NULL DEFAULT 'KOM',
  `kolicina` decimal(10,2) NOT NULL,
  `cena_po_jm` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ponude_stavke_cenovnik_id_foreign` (`cenovnik_id`),
  KEY `ponude_stavke_ponuda_id_index` (`ponuda_id`),
  CONSTRAINT `ponude_stavke_cenovnik_id_foreign` FOREIGN KEY (`cenovnik_id`) REFERENCES `cenovnik` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ponude_stavke_ponuda_id_foreign` FOREIGN KEY (`ponuda_id`) REFERENCES `ponude` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `projekat_faze`;
CREATE TABLE `projekat_faze` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `projekat_id` bigint(20) unsigned NOT NULL,
  `naziv` varchar(255) NOT NULL,
  `opis` text DEFAULT NULL,
  `redosled` int(11) NOT NULL DEFAULT 1,
  `status` enum('na_cekanju','u_toku','zavrsena') NOT NULL DEFAULT 'na_cekanju',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projekat_faze_projekat_id_index` (`projekat_id`),
  CONSTRAINT `projekat_faze_projekat_id_foreign` FOREIGN KEY (`projekat_id`) REFERENCES `projekti` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `projekat_radnik`;
CREATE TABLE `projekat_radnik` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `projekat_id` bigint(20) unsigned NOT NULL,
  `radnik_id` bigint(20) unsigned NOT NULL,
  `uloga` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projekat_radnik_projekat_id_radnik_id_unique` (`projekat_id`,`radnik_id`),
  KEY `projekat_radnik_radnik_id_foreign` (`radnik_id`),
  CONSTRAINT `projekat_radnik_projekat_id_foreign` FOREIGN KEY (`projekat_id`) REFERENCES `projekti` (`id`) ON DELETE CASCADE,
  CONSTRAINT `projekat_radnik_radnik_id_foreign` FOREIGN KEY (`radnik_id`) REFERENCES `radnici` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `projekti`;
CREATE TABLE `projekti` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `broj_projekta` varchar(50) NOT NULL,
  `naziv` varchar(255) NOT NULL,
  `opis` text DEFAULT NULL,
  `klijent_id` bigint(20) unsigned DEFAULT NULL,
  `ponuda_id` bigint(20) unsigned DEFAULT NULL,
  `datum_pocetka` date NOT NULL,
  `datum_zavrsetka` date DEFAULT NULL,
  `prioritet` enum('nizak','srednji','visok','hitan') NOT NULL DEFAULT 'srednji',
  `status` enum('na_cekanju','aktivan','pauziran','zavrsen','otkazan') NOT NULL DEFAULT 'na_cekanju',
  `ukupna_vrednost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `adresa_lokacije` varchar(255) DEFAULT NULL,
  `napomene` text DEFAULT NULL,
  `procenat_zavrsenosti` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projekti_broj_projekta_unique` (`broj_projekta`),
  KEY `projekti_klijent_id_foreign` (`klijent_id`),
  KEY `projekti_ponuda_id_foreign` (`ponuda_id`),
  KEY `projekti_broj_projekta_index` (`broj_projekta`),
  KEY `projekti_status_index` (`status`),
  KEY `projekti_prioritet_index` (`prioritet`),
  CONSTRAINT `projekti_klijent_id_foreign` FOREIGN KEY (`klijent_id`) REFERENCES `klijenti` (`id`) ON DELETE SET NULL,
  CONSTRAINT `projekti_ponuda_id_foreign` FOREIGN KEY (`ponuda_id`) REFERENCES `ponude` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `projekti` (`id`, `broj_projekta`, `naziv`, `opis`, `klijent_id`, `ponuda_id`, `datum_pocetka`, `datum_zavrsetka`, `prioritet`, `status`, `ukupna_vrednost`, `adresa_lokacije`, `napomene`, `procenat_zavrsenosti`, `created_at`, `updated_at`, `deleted_at`) VALUES ('2', 'PRJ-1774294327', 'Test P', '', '2', '', '2026-03-23', '', 'srednji', 'na_cekanju', '0.00', '', '', '0', '2026-03-23 20:32:07', '2026-03-23 20:32:07', '');
INSERT INTO `projekti` (`id`, `broj_projekta`, `naziv`, `opis`, `klijent_id`, `ponuda_id`, `datum_pocetka`, `datum_zavrsetka`, `prioritet`, `status`, `ukupna_vrednost`, `adresa_lokacije`, `napomene`, `procenat_zavrsenosti`, `created_at`, `updated_at`, `deleted_at`) VALUES ('3', 'PRJ-1774295102', 'Test Projekat 1774295102', '', '3', '', '2026-03-23', '', 'srednji', 'na_cekanju', '0.00', '', '', '0', '2026-03-23 20:45:02', '2026-03-23 20:45:02', '');

DROP TABLE IF EXISTS `radnici`;
CREATE TABLE `radnici` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ime` varchar(255) NOT NULL,
  `prezime` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefon` varchar(50) DEFAULT NULL,
  `adresa` varchar(255) DEFAULT NULL,
  `jmbg` varchar(13) DEFAULT NULL,
  `datum_zaposlenja` date DEFAULT NULL,
  `pozicija` varchar(100) DEFAULT NULL,
  `satnica` decimal(10,2) DEFAULT NULL,
  `status` enum('aktivan','neaktivan','na_odsustvu') NOT NULL DEFAULT 'aktivan',
  `napomena` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `radnici_ime_prezime_index` (`ime`,`prezime`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `radnici` (`id`, `ime`, `prezime`, `email`, `telefon`, `adresa`, `jmbg`, `datum_zaposlenja`, `pozicija`, `satnica`, `status`, `napomena`, `created_at`, `updated_at`, `deleted_at`) VALUES ('1', 'marija', 'eric', 'maki.eric@npm.rs', '', '', '1111111111111', '2026-02-26', 'Dizajner', '600.00', 'aktivan', '', '2026-03-22 01:09:04', '2026-03-22 01:09:13', '');
INSERT INTO `radnici` (`id`, `ime`, `prezime`, `email`, `telefon`, `adresa`, `jmbg`, `datum_zaposlenja`, `pozicija`, `satnica`, `status`, `napomena`, `created_at`, `updated_at`, `deleted_at`) VALUES ('2', 'Test', 'testic', 'test12@npm.rs', '', '', '1111111111111', '2025-06-30', 'Stolar', '600.00', 'aktivan', '', '2026-03-23 19:18:49', '2026-03-23 19:19:08', '');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'worker',
  `avatar` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `avatar`, `phone`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES ('1', 'Admin', 'admin@npm.rs', '', '$2y$12$IRVep.uCo67YFYCxjsArD.8iVPwY6RKW.hUet5l5NB/4DVGG5At7u', 'admin', '', '', '1', '', '2026-03-22 01:06:43', '2026-03-22 01:06:43');

SET FOREIGN_KEY_CHECKS=1;
