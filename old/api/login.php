<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';

solo_post();
$d = leer_json();

$correo   = strtolower(texto($d, 'correo', 150, 1));
$password = (string) ($d['password'] ?? '');
if ($password === '' || strlen($password) > 1000) {
    fallar(422, 'Ingresa tu correo y tu contraseña.');
}

$pdo = db();
$ip  = $_SERVER['REMOTE_ADDR'] ?? '';

// Límite de intentos fallidos en los últimos 15 minutos.
$st = $pdo->prepare('SELECT COUNT(*) FROM intentos_login WHERE correo = ? AND creado_en > NOW() - INTERVAL 15 MINUTE');
$st->execute([$correo]);
$porCorreo = (int) $st->fetchColumn();

$st = $pdo->prepare('SELECT COUNT(*) FROM intentos_login WHERE ip = ? AND creado_en > NOW() - INTERVAL 15 MINUTE');
$st->execute([$ip]);
$porIp = (int) $st->fetchColumn();

if ($porCorreo >= 5 || $porIp >= 20) {
    fallar(429, 'Demasiados intentos fallidos. Espera 15 minutos e inténtalo de nuevo.');
}

$st = $pdo->prepare('SELECT id, nombre, password_hash FROM usuarios WHERE correo = ?');
$st->execute([$correo]);
$usuario = $st->fetch();

// Si el correo no existe se compara igualmente contra un hash falso,
// para que el tiempo de respuesta no delate qué correos están registrados.
$hashFalso = '$2y$10$.vGA1O9wmRjrwAVXD98HNOgsNpDczlqm3Jq7KnEd1rVAGv3Fykk1a';
$valido = password_verify($password, $usuario['password_hash'] ?? $hashFalso) && $usuario;

if (!$valido) {
    $pdo->prepare('INSERT INTO intentos_login (correo, ip) VALUES (?, ?)')->execute([$correo, $ip]);
    $pdo->exec('DELETE FROM intentos_login WHERE creado_en < NOW() - INTERVAL 1 DAY');
    fallar(401, 'Correo o contraseña incorrectos.');
}

$pdo->prepare('DELETE FROM intentos_login WHERE correo = ?')->execute([$correo]);

if (password_needs_rehash($usuario['password_hash'], PASSWORD_DEFAULT)) {
    $pdo->prepare('UPDATE usuarios SET password_hash = ? WHERE id = ?')
        ->execute([password_hash($password, PASSWORD_DEFAULT), $usuario['id']]);
}

session_regenerate_id(true);
$_SESSION['usuario_id'] = (int) $usuario['id'];
$_SESSION['nombre']     = $usuario['nombre'];

responder(200, ['ok' => true, 'usuario' => ['nombre' => $usuario['nombre']]]);
