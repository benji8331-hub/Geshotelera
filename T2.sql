--1. ejercicio 1
-- Crear tabla libros
CREATE TABLE libros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100),
    autor VARCHAR(100),
    stock INTEGER
);

-- Crear tabla usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100)
);

-- Crear tabla prestamos con claves foráneas
CREATE TABLE prestamos (
    id SERIAL PRIMARY KEY,
    id_libro INT REFERENCES libros(id),
    id_usuario INT REFERENCES usuarios(id),
    fecha DATE
);

--2. incersion delos datos
-- Insertar libros
INSERT INTO libros (titulo, autor, stock) VALUES
('Cien años de soledad', 'Gabriel García Márquez', 5),
('1984', 'George Orwell', 4),
('Don Quijote', 'Miguel de Cervantes', 3),
('Rayuela', 'Julio Cortázar', 2),
('El Principito', 'Antoine de Saint-Exupéry', 6);

-- Insertar usuarios
INSERT INTO usuarios (nombre, email) VALUES
('Juan Pérez', 'juan@example.com'),
('María López', 'maria@example.com'),
('Carlos Ruiz', 'carlos@example.com');

-- Insertar préstamos
INSERT INTO prestamos (id_libro, id_usuario, fecha) VALUES
(1, 1, '2025-07-15'),
(2, 2, '2025-07-16'),
(3, 3, '2025-07-17');

--3. creacion de roles y permisos de lectura en tabla libros
-- Crear rol lector_bc
CREATE ROLE lector_bc LOGIN PASSWORD 'lectorpwd';

-- Dar permisos de solo lectura sobre libros
GRANT CONNECT ON DATABASE biblioteca_bc TO lector_bc;
GRANT USAGE ON SCHEMA public TO lector_bc;
GRANT SELECT ON libros TO lector_bc;

--4. inicio de transaccion con begin
-- Iniciar transacción
BEGIN;

-- Insertar un préstamo válido
INSERT INTO prestamos (id_libro, id_usuario, fecha) VALUES
(1, 2, '2025-07-18');

-- Insertar un préstamo con error (libro id 999 no existe)
INSERT INTO prestamos (id_libro, id_usuario, fecha) VALUES
(999, 2, '2025-07-18');

-- Como hay error, hacemos rollback
ROLLBACK;

-- Volvemos a iniciar y corregimos
BEGIN;

-- Insertamos uno correcto
INSERT INTO prestamos (id_libro, id_usuario, fecha) VALUES
(2, 2, '2025-07-18');

-- Finalizamos correctamente
COMMIT;

SELECT * FROM LIBROS;