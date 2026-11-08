<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if (!function_exists('generateJWT')) {
    /**
     * Genera un token JWT con los datos del usuario.
     */
    function generateJWT(array $payload): string
    {
        $key = env('JWT_SECRET');
        $time = time();
        $expire = $time + (int) env('JWT_EXPIRE', 3600);

        $tokenPayload = [
            'iat' => $time,          // Emitido en
            'exp' => $expire,        // Expira en
            'data' => $payload       // Datos del usuario (id, username, roles, etc.)
        ];

        return JWT::encode($tokenPayload, $key, 'HS256');
    }
}

if (!function_exists('validateJWT')) {
    /**
     * Valida el token y retorna el payload, o retorna false si es inválido.
     */
    function validateJWT(string $token)
    {
        $key = env('JWT_SECRET');
        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            return (array) $decoded->data;
        } catch (\Exception $e) {
            return false;
        }
    }
}

if (!function_exists('getBearerToken')) {
    /**
     * Extrae el token del header Authorization: Bearer <token>
     */
    function getBearerToken(): ?string
    {
        $request = \Config\Services::request();
        $authHeader = $request->getHeaderLine('Authorization');
  
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
