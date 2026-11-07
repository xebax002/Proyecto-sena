<?php
declare(strict_types=1);
require __DIR__ . '/../_lib.php';

solo_post();
$d = leer_json();

$token    = (string) ($d['token'] ?? '');
$password = (string) ($d['password'] ?? '');

if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
    fallar(400, 'El enlace no es válido o ya expiró. Solicita uno nuevo.');
}
validar_password($password);

$pdo = db();
$pdo->beginTransaction();

$st = $pdo->prepare(
    'SELECT id, usuario_id FROM password_resets
     WHERE token_hash = ? AND usado = 0 AND expira_en > NOW()
     FOR UPDATE'
);
$st->execute([hash('sha256', $token)]);
$reset = $st->fetch();

if (!$reset) {
    $pdo->rollBack();
    fallar(400, 'El enlace no es válido o ya expiró. Solicita uno nuevo.');
}

$pdo->prepare('UPDATE usuarios SET password_hash = ? WHERE id = ?')
    ->execute([password_hash($password, PASSWORD_DEFAULT), $reset['usuario_id']]);

$pdo->prepare('UPDATE password_resets SET usado = 1 WHERE usuario_id = ?')
    ->execute([$reset['usuario_id']]);

$pdo->commit();

responder(200, ['ok' => true]);
