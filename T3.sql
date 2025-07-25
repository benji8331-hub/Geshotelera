-- 1. Creación de las tablas

-- Tabla Instructores
CREATE TABLE Instructores (
  ID_Instructor SERIAL PRIMARY KEY,
  Nombre        VARCHAR(100) NOT NULL,
  Email         VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla Cursos
CREATE TABLE Cursos (
  ID_Curso        SERIAL PRIMARY KEY,
  Nombre_Curso    VARCHAR(100) NOT NULL,
  ID_Instructor   INTEGER REFERENCES Instructores(ID_Instructor),
  Cupo_Maximo     INTEGER   NOT NULL,
  Cupo_Disponible INTEGER   NOT NULL,
  Fecha_Inicio    DATE      NOT NULL
);

-- Tabla Estudiantes
CREATE TABLE Estudiantes (
  ID_Estudiante  SERIAL PRIMARY KEY,
  Nombre         VARCHAR(100) NOT NULL,
  Email          VARCHAR(100) NOT NULL UNIQUE,
  Fecha_Registro DATE        NOT NULL
);

-- Tabla Inscripciones
CREATE TABLE Inscripciones (
  ID_Inscripcion     SERIAL PRIMARY KEY,
  ID_Estudiante      INTEGER REFERENCES Estudiantes(ID_Estudiante),
  ID_Curso           INTEGER REFERENCES Cursos(ID_Curso),
  Fecha_Inscripcion  DATE    NOT NULL,
  Estado             VARCHAR(20) NOT NULL CHECK (Estado IN ('Inscrito','Finalizado','Cancelado'))
);

-- 2. Inserción de instructores

INSERT INTO Instructores (Nombre, Email) VALUES
  ('María López',     'maria.lopez@example.com'),
  ('Juan Pérez',      'juan.perez@example.com');

-- 3. Inserción de cursos

INSERT INTO Cursos (Nombre_Curso, ID_Instructor, Cupo_Maximo, Cupo_Disponible, Fecha_Inicio) VALUES
  (
    'Introducción a SQL',
    (SELECT ID_Instructor FROM Instructores WHERE Nombre = 'María López'),
    20, 20, '2025-07-23'
  ),
  (
    'Desarrollo Web con JavaScript',
    (SELECT ID_Instructor FROM Instructores WHERE Nombre = 'Juan Pérez'),
    15, 15, '2025-07-21'
  ),
  (
    'Python para Ciencia de Datos',
    (SELECT ID_Instructor FROM Instructores WHERE Nombre = 'María López'),
    18, 18, '2025-07-19'
  );

-- 4. Inserción de estudiantes

INSERT INTO Estudiantes (Nombre, Email, Fecha_Registro) VALUES
  ('Luis Gómez',   'luis.gomez@example.com',   '2025-07-17'),
  ('Ana Martínez', 'ana.martinez@example.com', '2025-07-17');

-- 5. Registro de inscripción de Luis Gómez y actualización de cupo

-- 5.1 Insertar inscripción
INSERT INTO Inscripciones (ID_Estudiante, ID_Curso, Fecha_Inscripcion, Estado)
VALUES (
  (SELECT ID_Estudiante FROM Estudiantes WHERE Nombre = 'Luis Gómez'),
  (SELECT ID_Curso      FROM Cursos      WHERE Nombre_Curso = 'Introducción a SQL'),
  '2025-07-17',
  'Inscrito'
);

-- 5.2 Disminuir cupo disponible en 1
UPDATE Cursos
SET Cupo_Disponible = Cupo_Disponible - 1
WHERE Nombre_Curso = 'Introducción a SQL';

-- 6. Creación de usuario coordinador y asignación de permisos

CREATE USER coordinador WITH PASSWORD 'coordinador123';

GRANT INSERT, UPDATE, SELECT
  ON Cursos, Inscripciones
  TO coordinador;

-- 7. Revocar DELETE en todas las tablas para coordinador

REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM coordinador;

-- 8. Transacción: inscripción de Ana Martínez en "Python para Ciencia de Datos"

BEGIN;

-- 8.1 Registrar inscripción
INSERT INTO Inscripciones (ID_Estudiante, ID_Curso, Fecha_Inscripcion, Estado)
VALUES (
  (SELECT ID_Estudiante FROM Estudiantes WHERE Nombre = 'Ana Martínez'),
  (SELECT ID_Curso      FROM Cursos      WHERE Nombre_Curso = 'Python para Ciencia de Datos'),
  '2025-07-17',
  'Inscrito'
);

-- 8.2 Actualizar cupo disponible
UPDATE Cursos
SET Cupo_Disponible = Cupo_Disponible - 1
WHERE Nombre_Curso = 'Python para Ciencia de Datos';

-- 8.3 Confirmar cambios
COMMIT;

-- En caso de error, ejecutar:
-- ROLLBACK;
