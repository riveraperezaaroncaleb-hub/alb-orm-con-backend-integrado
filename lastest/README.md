# Inventario ORM

Frontend en React para administrar un sistema de inventario conectado a la API REST del backend (Express + Sequelize + MySQL). Permite gestionar productos, categorías, proveedores y usuarios, con panel de indicadores, búsqueda, filtros, alertas de stock y operaciones CRUD completas.

## Tecnologías

- React 19 + Vite
- JavaScript (componentes funcionales y hooks)
- `fetch` nativo a través de una capa de servicios
- CSS Modules + variables CSS
- Sin librerías de UI, router, axios ni manejadores de estado externos

## Requisitos previos

- Node.js 18 o superior
- MySQL en ejecución con la base `laboratorioORM` creada y migrada
- Backend disponible en `http://localhost:3000`

## Instalación y ejecución

### 1. Backend

```bash
cd backend
npm install
npm run start
```

La configuración de la base de datos se encuentra en `backend/config/config.json`.

### 2. Frontend

```bash
cd lastest
npm install
cp .env.example .env
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Build de producción

```bash
npm run build
npm run preview
```

## Variables de entorno

| Variable | Valor por defecto | Descripción |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Ruta base de la API. En desarrollo, Vite redirige `/api` a `http://localhost:3000` mediante proxy. |

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción en `dist/` |
| `npm run preview` | Sirve la build de producción |
| `npm run lint` | Ejecuta ESLint |

## Funcionalidades

- Panel de control con indicadores: productos, unidades, valor de inventario, stock bajo, categorías y proveedores.
- Alertas de stock y distribución de unidades por categoría.
- Productos: listado, búsqueda por nombre/SKU, filtros por categoría, proveedor, estado y stock, alta, edición y eliminación.
- Categorías: tarjetas con conteo de productos y unidades, alta, edición y eliminación.
- Proveedores: directorio con datos de contacto y ubicación, alta, edición y eliminación.
- Usuarios: listado y CRUD básico.
- Validación de formularios y notificaciones de éxito/error.
- Estados de carga, error con reintento y listas vacías.
- Diseño responsive con navegación lateral adaptada a móvil.

## Estructura del proyecto

```text
lastest/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Categories/
│   │   ├── ConfirmDialog/
│   │   ├── Dashboard/
│   │   ├── EmptyState/
│   │   ├── ErrorState/
│   │   ├── Icon/
│   │   ├── Loader/
│   │   ├── Modal/
│   │   ├── Products/
│   │   ├── Providers/
│   │   ├── Sidebar/
│   │   ├── StatCard/
│   │   ├── Toast/
│   │   ├── Topbar/
│   │   └── Users/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   ├── config.js
│   └── main.jsx
├── .env.example
├── index.html
└── vite.config.js
```

## API utilizada

| Recurso | Endpoints |
| --- | --- |
| Productos | `GET/POST /api/productos`, `GET/PUT/DELETE /api/productos/:id` |
| Categorías | `GET/POST /api/categorias`, `GET/PUT/DELETE /api/categorias/:id` |
| Proveedores | `GET/POST /api/proveedores`, `GET/PUT/DELETE /api/proveedores/:id` |
| Usuarios | `GET/POST /api/usuarios`, `GET/PUT/DELETE /api/usuarios/:id` |

Los errores del backend se muestran en español y las operaciones de escritura refrescan automáticamente los datos.
