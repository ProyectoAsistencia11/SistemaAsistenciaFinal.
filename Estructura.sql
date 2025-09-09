CREATE DATABASE IF NOT EXISTS sistemadeasistencia_db;
USE sistemadeasistencia_db;

CREATE TABLE IF NOT EXISTS config (
  id INT PRIMARY KEY,
  clave VARCHAR(255)
);

INSERT INTO config (id, clave) VALUES (1, '1234');

-- Tabla para alumnos
CREATE TABLE IF NOT EXISTS alumnos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  tutor VARCHAR(255) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  aula VARCHAR(50),
  imagen VARCHAR(255), -- ruta de la imagen subida
  qr VARCHAR(255)      -- ruta de la imagen QR generada
);

