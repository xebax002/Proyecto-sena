-- =====================================================================
-- FIT LIFE.GYM — esquema de base de datos (MySQL 8 / MariaDB 10.4+)
-- En MySQL Workbench: File > Open SQL Script... > este archivo >
-- botón del rayo (Execute).
-- =====================================================================

CREATE DATABASE IF NOT EXISTS fitlife_gym
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE fitlife_gym;

CREATE TABLE IF NOT EXISTS usuarios (
    id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre        VARCHAR(100) NOT NULL,
    pais          VARCHAR(60)  NOT NULL,
    ciudad        VARCHAR(60)  NOT NULL,
    telefono      VARCHAR(25)  NOT NULL,
    correo        VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    creado_en     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_usuarios_correo (correo)
) ENGINE=InnoDB;

-- Tokens de recuperación: se guarda solo el hash (SHA-256), nunca el token.
CREATE TABLE IF NOT EXISTS password_resets (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    usuario_id  INT UNSIGNED NOT NULL,
    token_hash  CHAR(64)     NOT NULL,
    expira_en   DATETIME     NOT NULL,
    usado       TINYINT(1)   NOT NULL DEFAULT 0,
    creado_en   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_reset_token (token_hash),
    KEY idx_reset_usuario (usuario_id, creado_en),
    CONSTRAINT fk_reset_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Intentos fallidos de login (límite de intentos por correo e IP).
CREATE TABLE IF NOT EXISTS intentos_login (
    id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
    correo    VARCHAR(150) NOT NULL,
    ip        VARCHAR(45)  NOT NULL,
    creado_en TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_intentos_correo (correo, creado_en),
    KEY idx_intentos_ip (ip, creado_en)
) ENGINE=InnoDB;

-- OPCIONAL (recomendado fuera de tu computador): un usuario propio
-- en lugar de "root". Si lo creas, usa estos datos en api/config.php.
-- CREATE USER 'fitlife'@'localhost' IDENTIFIED BY 'cambia-esta-clave';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON fitlife_gym.* TO 'fitlife'@'localhost';
