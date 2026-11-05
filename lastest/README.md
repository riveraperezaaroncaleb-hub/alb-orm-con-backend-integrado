# Inventario ORM

Frontend en React para administrar un sistema de inventario conectado a la API REST del backend (Express + Sequelize + MySQL). Permite gestionar usuarios, sucursales, almacenes, productos, categorías, proveedores, clientes, compras, ventas, facturas, lotes y movimientos de inventario, con autenticación JWT y operaciones CRUD.

## Tecnologías

- React 19 + Vite
- JavaScript (componentes funcionales y hooks)
- `fetch` nativo a través de una capa de servicios
- CSS Modules + variables CSS
- Sin librerías de UI, router, axios ni manejadores de estado externos

## Requisitos previos

- Node.js 18 o superior
- MySQL en ejecución con la base `laboratorioORM` creada y migrada
- Backend disponible en `http://localhost:5000`

## Instalación y ejecución

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env.local
npm run start
```

La configuración de la base de datos se encuentra en `backend/config/config.json`.
Edita `backend/.env.local` y asigna tu clave a `OPENAI_API_KEY` (opcionalmente define `OPENAI_MODEL`, por defecto `gpt-4o-mini`). El backend también carga `backend/.env` existente como respaldo; se recomienda usar `.env.local`, que está excluido de Git, porque `backend/.env` está versionado en este proyecto. Nunca agregues la clave al frontend ni la compartas en el chat. Reinicia el backend después de cambiarla.

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
| `VITE_API_BASE_URL` | `/api` | Ruta base de la API. En desarrollo, Vite redirige `/api` a `http://localhost:5000` mediante proxy. |

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción en `dist/` |
| `npm run preview` | Sirve la build de producción |
| `npm run lint` | Ejecuta ESLint |

## Funcionalidades

- Autenticación con registro, inicio de sesión y sesión persistida mediante JWT.
- Rutas y pantalla protegidas; cierre de sesión desde la barra superior.
- Panel de control con indicadores: productos, unidades, valor de inventario, stock bajo, categorías, proveedores, sucursales y almacenes.
- Alertas de stock y distribución de unidades por categoría.
- Productos: listado, búsqueda por nombre/SKU, filtros por categoría, proveedor, sucursal, almacén, estado y stock, alta, edición y eliminación.
- Categorías: tarjetas con conteo de productos y unidades, filtro por sucursal, alta, edición y eliminación.
- Proveedores: directorio con datos de contacto y ubicación, filtro por sucursal, alta, edición y eliminación.
- Sucursales: CRUD con código único, datos de contacto, gerente y estado activo; no se puede eliminar una sucursal con registros asociados.
- Almacenes: depósitos específicos dentro de cada sucursal, con código único, capacidad, dirección, estado activo y conteo de productos/unidades; no se puede eliminar un almacén con productos asociados.
- Usuarios: listado y CRUD básico con sucursal opcional.
- Clientes, métodos de pago e impuestos: administración CRUD con búsqueda y relaciones disponibles en formularios.
- Compras, ventas, facturas, lotes y movimientos: listados y formularios CRUD conectados a la API, incluyendo sus referencias a clientes, proveedores, productos, almacenes y usuarios.
- Detalles de compras, ventas y movimientos: mantenimiento de renglones y asociaciones con documentos, productos, impuestos y lotes.
- Los formularios de operaciones registran los datos enviados; cambiar su estado no actualiza automáticamente las existencias.
- Validación de formularios y notificaciones de éxito/error.
- Estados de carga, error con reintento y listas vacías.
- Sección de accesibilidad con tamaño de texto, alto contraste, reducción de movimiento y enlaces subrayados; las preferencias se conservan en el dispositivo.
- Asistente local en la pantalla pública para ayuda de acceso. En el panel autenticado usa OpenAI para orientar sobre puestos, prioridades y dificultades operativas con base en el contexto proporcionado; no consulta la base de datos ni el código fuente. No inventa manuales, canales ni matrices que no se hayan compartido.
- Diseño responsive con navegación lateral adaptada a móvil.

## Estructura del proyecto

```text
lastest/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Assistant/
│   │   ├── Accessibility/
│   │   ├── Branches/
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
│   │   ├── Resources/
│   │   ├── Sidebar/
│   │   ├── StatCard/
│   │   ├── Toast/
│   │   ├── Topbar/
│   │   ├── Users/
│   │   └── Warehouses/
│   ├── context/
│   ├── hooks/
│   │   └── useAccessibilityPreferences.js
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
| Autenticación | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/perfil` |
| Asistente autenticado | `GET /api/asistente/estado`, `POST /api/asistente/chat` |
| Productos | `GET/POST /api/productos`, `GET/PUT/DELETE /api/productos/:id` |
| Categorías | `GET/POST /api/categorias`, `GET/PUT/DELETE /api/categorias/:id` |
| Proveedores | `GET/POST /api/proveedores`, `GET/PUT/DELETE /api/proveedores/:id` |
| Sucursales | `GET/POST /api/sucursales`, `GET/PUT/DELETE /api/sucursales/:id` |
| Almacenes | `GET/POST /api/almacenes`, `GET/PUT/DELETE /api/almacenes/:id` |
| Usuarios | `GET/POST /api/usuarios`, `GET/PUT/DELETE /api/usuarios/:id` |
| Clientes | `GET/POST /api/clientes`, `GET/PUT/DELETE /api/clientes/:id` |
| Métodos de pago | `GET/POST /api/metodos-pago`, `GET/PUT/DELETE /api/metodos-pago/:id` |
| Impuestos | `GET/POST /api/impuestos`, `GET/PUT/DELETE /api/impuestos/:id` |
| Compras y detalles | `GET/POST /api/compras`, `GET/POST /api/detalle-compras` y sus rutas por ID |
| Ventas y detalles | `GET/POST /api/ventas`, `GET/POST /api/detalle-ventas` y sus rutas por ID |
| Lotes | `GET/POST /api/lotes` y rutas por ID |
| Movimientos y detalles | `GET/POST /api/movimientos-inventario`, `GET/POST /api/detalle-movimientos` y sus rutas por ID |
| Facturas | `GET/POST /api/facturas` y rutas por ID |

Todos los recursos, excepto registro y login, requieren `Authorization: Bearer <token>`. Los listados de productos, categorías, proveedores y usuarios aceptan el filtro `sucursalId`; los de productos también aceptan `almacenId`; los de almacenes aceptan `sucursalId` y `activo`; los de sucursales aceptan `activo` y `ciudad`.

Los errores del backend se muestran en español y las operaciones de escritura refrescan automáticamente los datos.
