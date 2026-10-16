<div align="center">

# 💰 Finance App

**Aplicación web para llevar el control de tus finanzas personales: registra ingresos y gastos, define límites de gasto por categoría y visualiza en qué se va tu dinero.**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?logo=drizzle&logoColor=black)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)

</div>

---

## 📋 Tabla de contenido

- [Funcionalidades](#-funcionalidades)
- [Stack tecnológico](#️-stack-tecnológico)
- [Arquitectura](#️-arquitectura)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Scripts disponibles](#-scripts-disponibles)
- [Testing](#-testing)
- [Autor](#-autor)

---

## ✨ Funcionalidades

### 🔐 Autenticación
- Registro e inicio de sesión con email y contraseña (Better Auth).
- Rutas protegidas: `/home` y `/perfil` redirigen a `/auth/signin` si no hay sesión.
- Cambio de contraseña desde el perfil del usuario.
- Cierre de sesión.

### 💸 Transacciones
- Crear, editar y eliminar **gastos** e **ingresos**.
- Clasificación por categorías (restaurantes, transporte, hogar, salud, educación y más).
- Filtros por **tipo**, **categoría**, **rango de fechas** y **búsqueda por texto**.
- Paginación configurable (3, 5, 10, 15 o 20 elementos por página) con *prefetch* de la página siguiente.
- Montos almacenados en centavos para evitar errores de precisión con decimales.

### 🎯 Límites de gasto
- Define un presupuesto máximo por categoría para un mes y año específicos.
- Barra de progreso con el porcentaje consumido y el monto restante:
  - 🟢 **Verde:** consumo menor al 80 %.
  - 🟡 **Ámbar:** consumo igual o mayor al 80 %.
  - 🔴 **Rojo:** límite excedido, con el monto excedente.
- Editar y eliminar límites existentes.

### 📊 Visualización
- Gráfica de barras con el total gastado por categoría (Recharts).

---

## 🛠️ Stack tecnológico

| Área | Tecnologías |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions) · [React 19](https://react.dev) |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org) |
| **Estilos y UI** | [Tailwind CSS 4](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com) · [Base UI](https://base-ui.com) · [Headless UI](https://headlessui.com) · [Tabler Icons](https://tabler.io/icons) |
| **Base de datos** | [PostgreSQL](https://www.postgresql.org) en [Neon](https://neon.tech) (serverless) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team) + Drizzle Kit (migraciones) |
| **Autenticación** | [Better Auth](https://www.better-auth.com) |
| **Estado y datos** | [TanStack Query](https://tanstack.com/query) (estado del servidor) · [Zustand](https://zustand.docs.pmnd.rs) (estado de la UI) |
| **Formularios y validación** | [React Hook Form](https://react-hook-form.com) · [Zod](https://zod.dev) · drizzle-zod |
| **Gráficas** | [Recharts](https://recharts.org) |
| **Testing** | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) (unitarias) · [Playwright](https://playwright.dev) (E2E) |

---

## 🏗️ Arquitectura

El proyecto está organizado **por funcionalidad** (`src/features`) y cada funcionalidad sigue una **arquitectura por capas**, de modo que cada capa tiene una sola responsabilidad y se puede probar de forma aislada:

```
Componente (UI)  →  Server Action  →  Service  →  Repository  →  Base de datos
```

| Capa | Responsabilidad |
|---|---|
| **Components** | Interfaz y formularios. Llaman a las Server Actions. |
| **Actions** | Punto de entrada desde el cliente (`'use server'`). Validan la sesión del usuario. |
| **Services** | Lógica de negocio y forma de la respuesta (`{ success, message, ... }`). |
| **Repository** | Acceso a datos con Drizzle. Todas las consultas filtran por `userId`. |
| **Schemas / Types** | Validación con Zod y tipos derivados del esquema de la base de datos. |

---

## 📁 Estructura del proyecto

```
├── app/                      # Rutas (App Router)
│   ├── (dashboard)/          # Rutas protegidas: home, perfil
│   ├── auth/                 # signin y signup
│   └── api/auth/             # Endpoint de Better Auth
├── src/
│   ├── features/
│   │   ├── auth/             # Login, registro y cambio de contraseña
│   │   ├── transaction/      # CRUD de ingresos y gastos, filtros
│   │   └── gastos/           # Límites de gasto y gráfica
│   │       ├── actions/
│   │       ├── components/
│   │       ├── helper/
│   │       ├── schemas/
│   │       ├── services/
│   │       └── types/
│   ├── shared/               # Componentes, stores (Zustand), helpers y UI compartidos
│   ├── db/                   # Conexión y esquemas de Drizzle
│   └── lib/                  # Configuración de Better Auth y TanStack Query
├── drizzle/                  # Migraciones generadas
└── tests/                    # Tests E2E con Playwright
    ├── auth/
    ├── transactions/
    └── gastosLimit/
```

---

## 🚀 Instalación

### Requisitos previos

- [Node.js](https://nodejs.org) 20 o superior
- [pnpm](https://pnpm.io) (el proyecto usa `pnpm@11`)
- Una base de datos PostgreSQL (por ejemplo, un proyecto gratuito en [Neon](https://neon.tech))

### Pasos

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/MarcoReL575/Finanzas-App.git
   cd Finanzas-App
   ```

2. **Instala las dependencias**

   ```bash
   pnpm install
   ```

3. **Configura las variables de entorno** creando un archivo `.env` en la raíz (ver [Variables de entorno](#-variables-de-entorno)).

4. **Aplica las migraciones** a la base de datos

   ```bash
   pnpm drizzle-kit migrate
   ```

5. **Inicia el servidor de desarrollo**

   ```bash
   pnpm dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔑 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Cadena de conexión a PostgreSQL (Neon)
DATABASE_URL="postgresql://usuario:password@host/base_de_datos?sslmode=require"

# Clave secreta de Better Auth (genera una con: openssl rand -base64 32)
BETTER_AUTH_SECRET="tu_clave_secreta"

# URL base de la aplicación
BETTER_AUTH_URL="http://localhost:3000"
```

> ⚠️ El archivo `.env` está en `.gitignore`. Nunca subas tus credenciales al repositorio.

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Genera el build de producción |
| `pnpm start` | Inicia el servidor de producción |
| `pnpm lint` | Ejecuta ESLint |
| `pnpm vitest` | Ejecuta las pruebas unitarias en modo *watch* |
| `pnpm exec playwright test` | Ejecuta las pruebas E2E |
| `pnpm drizzle-kit generate` | Genera una migración a partir de los cambios en el esquema |
| `pnpm drizzle-kit migrate` | Aplica las migraciones pendientes |

---

## 🧪 Testing

El proyecto cuenta con dos niveles de pruebas.

### Pruebas unitarias y de componentes — Vitest + Testing Library

Cubren componentes, Server Actions, servicios y repositorios, simulando las dependencias externas (sesión, base de datos, notificaciones).

```bash
pnpm vitest            # modo watch
pnpm vitest run        # una sola ejecución
pnpm vitest --ui       # interfaz visual
```

### Pruebas End-to-End — Playwright

Prueban los flujos completos en un navegador real (Chromium, Firefox y WebKit):

| Suite | Flujos cubiertos |
|---|---|
| `tests/auth` | Registro, login con credenciales inválidas, logout, navegación y rutas protegidas |
| `tests/transactions` | Crear gasto e ingreso, editar y eliminar (confirmar y cancelar) |
| `tests/gastosLimit` | Crear límites, aumento del porcentaje consumido y límite excedido |

Requieren la aplicación corriendo en `http://localhost:3000` y un usuario de prueba registrado (`prueba@test.com`).

```bash
pnpm dev                                    # en otra terminal
pnpm exec playwright test --workers=1       # todos los navegadores
pnpm exec playwright test --project=chromium
pnpm exec playwright show-report            # ver el reporte HTML
```

> 💡 Se recomienda `--workers=1`: los tests comparten el mismo usuario de prueba y modifican sus datos.

---

## 👤 Autor

**Marco Reyes**

- GitHub: [@MarcoReL575](https://github.com/MarcoReL575)

---

<div align="center">

⭐ Si este proyecto te resultó útil, ¡dale una estrella en GitHub!

</div>
