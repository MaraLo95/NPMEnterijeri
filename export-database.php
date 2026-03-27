<?php
/**
 * Skripta za izvoz baze u jedan SQL fajl
 * Pokreni lokalno: php export-database.php
 * Rezultat: database-export.sql u root folderu
 */

$envFile = __DIR__ . '/.env';
if (!file_exists($envFile)) {
    die("Fajl .env nije pronađen. Pokreni iz root foldera projekta.\n");
}

$env = [];
foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    if (strpos(trim($line), '#') === 0) continue;
    if (strpos($line, '=') === false) continue;
    [$key, $val] = explode('=', $line, 2);
    $env[trim($key)] = trim($val, " \t\n\r\0\x0B\"'");
}

$host = $env['DB_HOST'] ?? '127.0.0.1';
$port = $env['DB_PORT'] ?? '3306';
$database = $env['DB_DATABASE'] ?? 'npm_enterijeri';
$username = $env['DB_USERNAME'] ?? 'root';
$password = $env['DB_PASSWORD'] ?? '';

$outputFile = __DIR__ . '/database-export.sql';

// Pokušaj mysqldump prvo (brže i pouzdanije)
$mysqldump = 'mysqldump';
$cmd = sprintf(
    '"%s" --host=%s --port=%s --user=%s --password=%s --single-transaction --routines --triggers --no-tablespaces %s > "%s" 2>&1',
    $mysqldump,
    escapeshellarg($host),
    escapeshellarg($port),
    escapeshellarg($username),
    escapeshellarg($password),
    escapeshellarg($database),
    $outputFile
);

exec($cmd, $output, $returnCode);

if ($returnCode === 0 && file_exists($outputFile) && filesize($outputFile) > 0) {
    echo "Baza uspešno izvezena u: database-export.sql\n";
    echo "Veličina: " . round(filesize($outputFile) / 1024, 2) . " KB\n";
    exit(0);
}

// Fallback: PHP export (ako mysqldump nije dostupan)
echo "mysqldump nije dostupan, koristim PHP export...\n";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $sql = "-- NPM Enterijeri - izvoz baze\n";
    $sql .= "-- Datum: " . date('Y-m-d H:i:s') . "\n\n";
    $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

    foreach ($tables as $table) {
        $sql .= "DROP TABLE IF EXISTS `$table`;\n";
        $create = $pdo->query("SHOW CREATE TABLE `$table`")->fetch(PDO::FETCH_NUM);
        $sql .= $create[1] . ";\n\n";

        $rows = $pdo->query("SELECT * FROM `$table`")->fetchAll(PDO::FETCH_ASSOC);
        if (!empty($rows)) {
            $columns = array_keys($rows[0]);
            $colList = '`' . implode('`, `', $columns) . '`';
            foreach ($rows as $row) {
                $values = array_map(function ($v) use ($pdo) {
                    return $pdo->quote($v);
                }, $row);
                $sql .= "INSERT INTO `$table` ($colList) VALUES (" . implode(', ', $values) . ");\n";
            }
            $sql .= "\n";
        }
    }

    $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

    file_put_contents($outputFile, $sql);
    echo "Baza uspešno izvezena u: database-export.sql\n";
    echo "Veličina: " . round(strlen($sql) / 1024, 2) . " KB\n";

} catch (PDOException $e) {
    die("Greška pri izvozu: " . $e->getMessage() . "\nProveri podatke u .env (DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD).\n");
}
