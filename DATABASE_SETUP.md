
# Guía de Configuración de Base de Datos y Servidor

Esta guía te ayudará a configurar una base de datos PostgreSQL y un servidor backend básico con Node.js y Express para tu aplicación de recetas.

## Paso 1: Instalar PostgreSQL (La Base de Datos)

1.  **Descarga e Instala:** Ve a la [página oficial de PostgreSQL](https://www.postgresql.org/download/) y descarga el instalador para Windows.
2.  **Durante la instalación:**
    *   Se te pedirá establecer una **contraseña** para el superusuario `postgres`. **Guárdala bien, la necesitarás.**
    *   Puedes dejar los demás ajustes (puerto `5432`, etc.) con sus valores por defecto.
    *   Al final, el instalador podría ofrecerte instalar "Stack Builder". No es necesario para este proyecto, puedes desmarcarlo.
3.  **Verifica la instalación:** Busca en tus aplicaciones "SQL Shell (psql)". Ábrelo, presiona Enter varias veces para aceptar los valores por defecto y, cuando te pida la contraseña, introduce la que creaste. Si te conectas, ¡todo está correcto!

## Paso 2: Crear la Base de Datos y las Tablas

1.  **Abre SQL Shell (psql):**
2.  **Crea un usuario (opcional pero recomendado):**
    ```sql
    CREATE USER mi_usuario WITH PASSWORD 'mi_contraseña_segura';
    ```
3.  **Crea la base de datos:**
    ```sql
    CREATE DATABASE recetario_db OWNER mi_usuario;
    ```
4.  **Conéctate a tu nueva base de datos:**
    ```sql
    \c recetario_db
    ```
5.  **Ejecuta el script SQL:** Ahora, desde esta consola, necesitas ejecutar el script que generé. La forma más fácil es copiar todo el contenido del archivo `db_recetas.sql` y pegarlo directamente en la terminal de `psql`. Esto creará todas las tablas (`usuarios`, `recetas`, etc.).

## Paso 3: Configurar el Servidor Backend (Node.js)

Tu aplicación de React (el "frontend") necesita comunicarse con un "backend" (un servidor) para hablar con la base de datos.

1.  **Instala Node.js:** Si no lo tienes, descárgalo desde la [página oficial de Node.js](https://nodejs.org/).
2.  **Crea una carpeta para el servidor:** Dentro de tu proyecto, crea una nueva carpeta llamada `server`.
3.  **Abre una terminal en la carpeta `server`** y ejecuta:
    ```bash
    npm init -y
    ```
4.  **Instala las dependencias del servidor:**
    ```bash
    npm install express pg cors dotenv
    ```
    *   `express`: Para crear el servidor.
    *   `pg`: Para conectar Node.js con PostgreSQL.
    *   `cors`: Para permitir que tu app de React se comunique con el servidor.
    *   `dotenv`: Para gestionar variables de entorno (como la contraseña de la BD).

5.  **Crea un archivo `.env`** dentro de la carpeta `server` para guardar tus credenciales de forma segura:
    ```
    DB_USER=mi_usuario
    DB_PASSWORD=mi_contraseña_segura
    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE=recetario_db
    ```

6.  **Crea el archivo principal del servidor:** Dentro de `server`, crea un archivo llamado `index.js`. Este será tu punto de partida para el backend. **Más adelante te ayudaré a escribir el código para este archivo**, que incluirá los endpoints para el registro, login y gestión de recetas.

---

**Resumen:**

*   **Lo que has hecho:** Has instalado el software de la base de datos y has creado la estructura de tablas.
*   **Lo que sigue:** Ahora modificaré el código del frontend. Luego, necesitarás crear y ejecutar el código del servidor que se conectará a esta base de datos.
