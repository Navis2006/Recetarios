-- Base de datos para el Recetario Colaborativo

-- Tabla de Usuarios
-- Almacena las credenciales de los usuarios.
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Recetas
-- Almacena la información principal de cada receta.
CREATE TABLE recetas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT, -- Puede ser una URL externa o una ruta a un archivo subido
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de Ingredientes
-- Almacena los ingredientes de cada receta.
CREATE TABLE ingredientes (
    id SERIAL PRIMARY KEY,
    receta_id INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    cantidad VARCHAR(50),
    unidad VARCHAR(50),
    FOREIGN KEY (receta_id) REFERENCES recetas(id) ON DELETE CASCADE
);

-- Tabla de Pasos
-- Almacena los pasos de preparación de cada receta.
CREATE TABLE pasos (
    id SERIAL PRIMARY KEY,
    receta_id INTEGER NOT NULL,
    numero_paso INTEGER NOT NULL,
    descripcion TEXT NOT NULL,
    FOREIGN KEY (receta_id) REFERENCES recetas(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento de las búsquedas
CREATE INDEX idx_recetas_user_id ON recetas(user_id);
CREATE INDEX idx_ingredientes_receta_id ON ingredientes(receta_id);
CREATE INDEX idx_pasos_receta_id ON pasos(receta_id);
