<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';

// Indica si hay una sesión iniciada (lo usa la página de inicio para el menú).
if (empty($_SESSION['usuario_id'])) {
    responder(200, ['autenticado' => false]);
}

responder(200, ['autenticado' => true, 'nombre' => $_SESSION['nombre'] ?? '']);
