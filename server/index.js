const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config(); // Carga las variables de .env para desarrollo local

// --- CREACIÓN DE LA APP DE EXPRESS ---
const app = express(); // ¡Esta es la línea que faltaba!

// --- MIDDLEWARE ---
app.use(cors()); // Permite que tu frontend se comunique con este backend
app.use(express.json()); // Permite al servidor entender datos en formato JSON

// --- CONEXIÓN A LA BASE DE DATOS ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones a Render
  }
});

// --- RUTAS (ENDPOINTS) ---

// Ruta de prueba para saber si el servidor funciona
app.get('/', (req, res) => {
  res.send('¡La API del Recetario está funcionando!');
});

// --- ¡AQUÍ AÑADIRÁS LAS RUTAS PARA LOGIN, REGISTRO, RECETAS, ETC! ---
// Ejemplo:
// app.post('/register', async (req, res) => { ... });
// app.post('/login', async (req, res) => { ... });
// app.get('/recipes', async (req, res) => { ... });


// --- INICIAR EL SERVIDOR ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
