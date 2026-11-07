<?php
declare(strict_types=1);

/* Funciones comunes de la API. Se incluye al inicio de cada endpoint. */

$config = require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',
    'secure'   => !empty($_SERVER['HTTPS']),
]);
session_start();

function responder(int $codigo, array $datos)
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

function fallar(int $codigo, string $mensaje)
{
    responder($codigo, ['ok' => false, 'message' => $mensaje]);
}

set_exception_handler(function (Throwable $e) {
    error_log('[fitlife] ' . $e->getMessage() . ' en ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        fallar(500, 'Ocurrió un error en el servidor. Inténtalo de nuevo.');
    }
});

function solo_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        fallar(405, 'Método no permitido.');
    }
}

/* Exige JSON: además de ser lo que envía api.js, evita que un formulario
   de otro sitio pueda enviar peticiones a escondidas (CSRF). */
function leer_json(): array
{
    $tipo = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($tipo, 'application/json') !== 0) {
        fallar(415, 'Se esperaba una petición JSON.');
    }

    $datos = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($datos)) {
        fallar(400, 'El cuerpo de la petición no es un JSON válido.');
    }
    return $datos;
}

function db(): PDO
{
    global $config;
    static $pdo = null;

    if ($pdo === null) {
        $c = $config['db'];
        $dsn = "mysql:host={$c['host']};port={$c['port']};dbname={$c['nombre']};charset=utf8mb4";
        try {
            $pdo = new PDO($dsn, $c['usuario'], $c['clave'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            error_log('[fitlife] conexión BD: ' . $e->getMessage());
            fallar(500, 'No se pudo conectar con la base de datos. Revisa api/config.php y que MySQL esté activo.');
        }
    }
    return $pdo;
}

/* Lee un campo de texto, lo recorta y valida longitud y caracteres de control. */
function texto(array $datos, string $campo, int $max, int $min = 0): string
{
    $valor = trim((string) ($datos[$campo] ?? ''));

    if (preg_match('/[\x00-\x1F\x7F]/', $valor)) {
        fallar(422, "El campo «$campo» contiene caracteres no permitidos.");
    }
    $largo = mb_strlen($valor);
    if ($largo < $min) {
        fallar(422, "El campo «$campo» es obligatorio.");
    }
    if ($largo > $max) {
        fallar(422, "El campo «$campo» no puede superar $max caracteres.");
    }
    return $valor;
}

function validar_correo(string $correo): string
{
    $correo = strtolower($correo);
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        fallar(422, 'Formato de correo electrónico inválido.');
    }
    return $correo;
}

/* Misma regla que el formulario: 8+ caracteres, minúscula, mayúscula y número.
   Máximo 72 bytes porque bcrypt ignora lo que pase de ahí. */
function validar_password(string $password): void
{
    if (
        strlen($password) < 8 ||
        !preg_match('/[a-z]/', $password) ||
        !preg_match('/[A-Z]/', $password) ||
        !preg_match('/[0-9]/', $password)
    ) {
        fallar(422, 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.');
    }
    if (strlen($password) > 72) {
        fallar(422, 'La contraseña no puede superar 72 caracteres.');
    }
}
