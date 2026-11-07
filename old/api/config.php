<?php
// Configuración del backend. Ajusta estos valores a tu entorno.
return [
    'db' => [
        'host'    => '127.0.0.1',
        'port'    => 3306,
        'nombre'  => 'fitlife_gym',
        'usuario' => 'root',   // XAMPP: root. En producción usa un usuario propio.
        'clave'   => '',       // XAMPP: vacía por defecto. Con Workbench, la que definiste al instalar MySQL.
    ],

    // true  = los correos de recuperación se guardan en storage/correos.log (para desarrollar sin servidor de correo)
    // false = se envían con mail() (necesita un servidor de correo configurado)
    'dev' => true,

    // URL donde se publica el sitio (sin barra final). Se usa en el enlace de recuperación.
    'url_sitio' => 'http://localhost/PROYECTO',

    'correo_remitente' => 'no-reply@fitlife.gym',
];
