-- 1. Creación de las tablas
-- Tabla Libros
CREATE TABLE Libros (
  ID_Libro   SERIAL PRIMARY KEY,
  Titulo     VARCHAR(100) NOT NULL,
  Autor      VARCHAR(50)  NOT NULL,
  Disponible BOOLEAN      NOT NULL DEFAULT TRUE
);

-- Tabla Miembros
CREATE TABLE Miembros (
  ID_Miembro SERIAL PRIMARY KEY,
  Nombre     VARCHAR(50)  NOT NULL,
  Correo     VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla Prestamos
CREATE TABLE Prestamos (
  ID_Prestamo      SERIAL PRIMARY KEY,
  ID_Libro         INTEGER REFERENCES Libros(ID_Libro),
  ID_Miembro       INTEGER REFERENCES Miembros(ID_Miembro),
  Fecha_Prestamo   DATE    NOT NULL,
  Fecha_Devolucion DATE
);

-- 2. Inserción de datos iniciales
-- Tres libros
INSERT INTO Libros (Titulo, Autor) VALUES
  ('El Quijote',               'Miguel de Cervantes'),
  ('1984',                     'George Orwell'),
  ('Cien Años de Soledad',     'Gabriel García Márquez');

-- Dos miembros
INSERT INTO Miembros (Nombre, Correo) VALUES
  ('Laura Gómez',   'laura@example.com'),
  ('Pedro Jiménez','pedro@example.com');

-- 3. Registro de préstamo y actualización de disponibilidad
-- Registro del préstamo de Laura Gómez
INSERT INTO Prestamos (ID_Libro, ID_Miembro, Fecha_Prestamo)
VALUES (
  (SELECT ID_Libro FROM Libros WHERE Titulo = 'Cien Años de Soledad'),
  (SELECT ID_Miembro FROM Miembros WHERE Nombre = 'Laura Gómez'),
  '2025-07-15'
);

-- Marcar el libro como no disponible
UPDATE Libros
SET Disponible = FALSE
WHERE Titulo = 'Cien Años de Soledad';

-- 4. Creación de usuario y asignación de permisos
-- Crear usuario bibliotecario
CREATE USER bibliotecario WITH PASSWORD 'bibliotecario123';

-- Privilegios en Prestamos
GRANT INSERT, UPDATE ON Prestamos TO bibliotecario;

-- Privilegios de consulta en Libros
GRANT SELECT ON Libros TO bibliotecario;

-- 5. Transacción para préstamo de “El Quijote”
BEGIN;

-- 1) Insertar registro de préstamo
INSERT INTO Prestamos (ID_Libro, ID_Miembro, Fecha_Prestamo)
VALUES (
  (SELECT ID_Libro FROM Libros WHERE Titulo = 'El Quijote'),
  (SELECT ID_Miembro FROM Miembros WHERE Nombre = 'Pedro Jiménez'),
  '2025-07-17'
);

-- 2) Actualizar disponibilidad
UPDATE Libros
SET Disponible = FALSE
WHERE Titulo = 'El Quijote';

-- 3) Confirmar o deshacer
COMMIT;
-- si ocurre algún error: ROLLBACK;

