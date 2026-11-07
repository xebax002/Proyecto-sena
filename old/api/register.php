<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';

solo_post();
$d = leer_json();

$nombre   = texto($d, 'nombre', 100, 2);
$pais     = texto($d, 'pais', 60, 1);
$ciudad   = texto($d, 'ciudad', 60, 1);
$telefono = texto($d, 'telefono', 25, 7);
$correo   = validar_correo(texto($d, 'correo', 150, 1));
$password = (string) ($d['password'] ?? '');

if (!preg_match('/^\+?[0-9\s().\-]{7,20}$/', $telefono)) {
    fallar(422, 'Formato de teléfono inválido.');
}
validar_password($password);

try {
    $st = db()->prepare(
        'INSERT INTO usuarios (nombre, pais, ciudad, telefono, correo, password_hash)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $st->execute([$nombre, $pais, $ciudad, $telefono, $correo, password_hash($password, PASSWORD_DEFAULT)]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') { // correo duplicado (clave única)
        fallar(409, 'Ya existe una cuenta con ese correo.');
    }
    throw $e;
}

responder(201, ['ok' => true]);
