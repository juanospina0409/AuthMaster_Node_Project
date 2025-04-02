# AuthMaster_Node_Project

🔐 AuthMaster - API de Autenticación con Bun y TypeScript

AuthMaster es un sistema de autenticación basado en Bun, TypeScript, bcrypt, jsonwebtoken y valibot, diseñado para manejar registro, login y logout de usuarios de forma segura y eficiente. 🚀
📌 Características

    ✅ Registro, inicio de sesión y cierre de sesión de usuarios

    ✅ Hashing de contraseñas con bcrypt 🔒

    ✅ Autenticación basada en tokens JWT

    ✅ Validación de datos con valibot

    ✅ Uso de Bun para un rendimiento ultrarrápido

🚀 Instalación y Configuración:

1️⃣ Instalar Bun por si aún no tienes Bun instalado, usa el siguiente comando:

curl -fsSL https://bun.sh/install | bash

Verifica la instalación con:

bun -v

2️⃣ Inicializar el proyecto y configurar ESLint

npx eslint --init

Configuración recomendada:

    ✅ "To check syntax and find problems"

    ✅ "JavaScript modules (import/export)"

    ✅ "None (se usará Node)"

    ✅ "TypeScript"

    ✅ "Node"

    ✅ "Yes" (usar Bun)

📦 Instalar dependencias

Ejecuta el siguiente comando para instalar todas las dependencias necesarias:

bun install bcrypt cors jsonwebtoken valibot

📌 Explicación de las librerías:

    bcrypt ➝ Para hashear y verificar contraseñas 🔒

    cors ➝ Permite compartir recursos entre diferentes dominios 🌎

    jsonwebtoken ➝ Manejo de tokens de autenticación JWT 🛡

    valibot ➝ Validación de datos de entrada

🛠 Instalar dependencias de desarrollo

bun add -D @eslint/js @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-airbnb-base eslint-config-airbnb-base-typescript eslint-plugin-import eslint-plugin @types/bcrypt @types/cors @types/jsonwebtoken


🏗 Configuración de Scripts en package.json

Para facilitar la ejecución, agrega los siguientes scripts en package.json:

"scripts": {
  "lint": "eslint .",
  "dev": "bun run index.ts"
}

Para iniciar la aplicación en modo desarrollo, usa:

bun dev

📌 Esto ejecutará index.ts y levantará el servidor en el puerto 4000.
🔥 Uso de la API
1️⃣ Registro de usuario (/auth/register)

CURL:

curl -X POST http://localhost:4000/auth/register -H "Content-Type: application/json" -d '{"email": "test@test.com", "password": "12341234"}'

📌 Respuesta esperada (201 Created):

{
  "id": 1743528394453,
  "email": "test@test.com",
  "password": "$2b$10$...",
  "role": "user"
}

2️⃣ Inicio de sesión (/auth/login)

CURL:

curl -X POST http://localhost:4000/auth/login -H "Content-Type: application/json" -d '{"email": "test@test.com", "password": "12341234"}'

📌 Respuesta esperada (200 OK):

{
  "accessToken": "<TOKEN_JWT>",
  "refreshToken": "<TOKEN_REFRESH>"
}

Guarda el accessToken, ya que lo necesitarás para cerrar sesión.
3️⃣ Cerrar sesión (/auth/logout)

Para cerrar sesión, debes incluir el accessToken en la cabecera Authorization.
CURL:

curl -X POST http://localhost:4000/auth/logout -H "Authorization: Bearer <VALID_TOKEN>"

📌 Respuesta esperada (200 OK):

{
  "Message": "Logged out"
}

Esto revoca el token del usuario y lo desconecta del sistema.
🔑 Seguridad y Manejo de Tokens

    Las contraseñas se almacenan de forma segura usando bcrypt.

    Cada usuario recibe un JWT (JSON Web Token) en el login, el cual debe enviarse en cada petición protegida.

    Los tokens expiran después de 1 hora (accessToken) y 1 día (refreshToken).

🚀 Tecnologías Utilizadas
Bun - Servidor backend ultrarrápido ⚡
TypeScript - Tipado estático y desarrollo seguro 🔍
bcrypt - Hashing seguro de contraseñas 🔐
jsonwebtoken (JWT) - Manejo de tokens de autenticación 🔑
valibot - Validación de datos del usuario ✅
CORS - Permite peticiones entre dominios 🌎
ESLint - Estilo de código y buenas prácticas 🛠


To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.5. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
