<?php
declare(strict_types=1);
require __DIR__ . '/../_lib.php';

solo_post();
$d = leer_json();
$correo = validar_correo(texto($d, 'correo', 150, 1));

function enviar_enlace(array $config, string $correo, string $nombre, string $enlace): void
{
    $asunto = 'Recupera tu contraseña - FIT LIFE.GYM';
    $cuerpo = "Hola $nombre,\n\n"
            . "Para crear una nueva contraseña entra al siguiente enlace (válido por 1 hora):\n$enlace\n\n"
            . "Si no lo pediste, ignora este mensaje.";

    if ($config['dev']) {
        $dir = __DIR__ . '/../../storage';
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }
        file_put_contents($dir . '/correos.log', '[' . date('c') . "] Para: $correo\n$cuerpo\n\n", FILE_APPEND | LOCK_EX);
        return;
    }

    $cabeceras = "From: {$config['correo_remitente']}\r\nContent-Type: text/plain; charset=UTF-8";
    @mail($correo, '=?UTF-8?B?' . base64_encode($asunto) . '?=', $cuerpo, $cabeceras);
}

$pdo = db();
$st = $pdo->prepare('SELECT id, nombre FROM usuarios WHERE correo = ?');
$st->execute([$correo]);
$usuario = $st->fetch();

if ($usuario) {
    // Máximo 3 solicitudes por hora para el mismo usuario.
    $st = $pdo->prepare('SELECT COUNT(*) FROM password_resets WHERE usuario_id = ? AND creado_en > NOW() - INTERVAL 1 HOUR');
    $st->execute([$usuario['id']]);

    if ((int) $st->fetchColumn() < 3) {
        $token = bin2hex(random_bytes(32));

        // Los enlaces anteriores sin usar dejan de servir.
        $pdo->prepare('UPDATE password_resets SET usado = 1 WHERE usuario_id = ? AND usado = 0')
            ->execute([$usuario['id']]);

        $pdo->prepare(
            'INSERT INTO password_resets (usuario_id, token_hash, expira_en)
             VALUES (?, ?, NOW() + INTERVAL 1 HOUR)'
        )->execute([$usuario['id'], hash('sha256', $token)]);

        $enlace = rtrim($config['url_sitio'], '/') . '/Cambio%20de%20contrase%C3%B1a.html?token=' . $token;
        enviar_enlace($config, $correo, $usuario['nombre'], $enlace);
    }
}

// Respuesta idéntica exista o no el correo.
responder(200, ['ok' => true]);
