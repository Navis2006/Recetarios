Paso 3: Desplegar el Backend en Render (La misma persona)

   1. En el Dashboard de Render, haz clic en New + y selecciona Web Service.
   2. Conecta tu repositorio de GitHub y selecciona el que creaste en el paso 1.
   3. Dale un nombre a tu servicio (ej. recetario-api).
   4. Configura los siguientes campos:
       * Environment: Node.
       * Build Command: npm install.
       * Start Command: node server/index.js (o la ruta a tu archivo de servidor).
   5. Haz clic en Advanced y ve a Environment Variables. Aquí es donde conectarás el backend        
      con la base de datos:
       * Haz clic en Add Environment Variable.
       * Key: DATABASE_URL
       * Value: Pega aquí la "External Connection String" que obtuviste en el paso anterior.
       * (Tu código de Node.js deberá ser ajustado para leer esta variable DATABASE_URL en
         lugar de las variables separadas).
   6. Haz clic en Create Web Service. Render instalará las dependencias y pondrá en marcha tu       
       servidor.

  Al terminar, Render te dará la URL pública de tu backend, por ejemplo:
  https://recetario-api.onrender.com.

  Paso 4: Conectar el Frontend de React (Todo el equipo)

   1. Comparte la URL del Backend: La persona que configuró Render debe compartir la URL
      (https://recetario-api.onrender.com) con todo el equipo.
   2. Actualiza el código del Frontend: En App.tsx, dentro del objeto api, reemplaza las URLs       
       locales (http://localhost:3001) por la URL pública de Render.

    1     // En App.tsx
    2     const API_URL = 'https://recetario-api.onrender.com';
    3
    4     const api = {
    5       getRecipes: async () => {
    6         const response = await fetch(`${API_URL}/recipes`);
    7         // ...etc
    8       },
    9       login: async (nombre, contrasena) => {
   10         const response = await fetch(`${API_URL}/login`, { /* ... */ });
   11         // ...etc
   12       }
   13       // ...y así para todas las funciones
   14     };
   3. Trabajo en Equipo: Ahora, cada miembro del equipo solo necesita ejecutar el frontend en       
       su máquina (npm run dev). Como el código apunta a la API en Render, y esa API está
      conectada a la base de datos en la nube, todos estarán viendo y modificando los mismos        
      datos en tiempo real.