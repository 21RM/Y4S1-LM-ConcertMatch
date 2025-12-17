<?php
// db.php
$host = 'localhost';
$db   = 'concert_match';
$user = 'root';
$pass = ''; // Default password (often empty for dev, or check your MariaDB setup)
$charset = 'utf8mb4';

// Note: 'mysql:host' works for MariaDB as it is a drop-in replacement
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // In a real app, log this. For dev, we might verify connection.
    // For now, if it fails, the app will just error out visibly or handle it in the UI.
    // We won't die() here to allow pages to potentially handle the error gracefully or show a setup message.
    $pdo = null;
}

