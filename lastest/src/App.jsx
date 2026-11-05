import { useState } from 'react'
import AccessibilityView from './components/Accessibility/AccessibilityView'
import AssistantWidget from './components/Assistant/AssistantWidget'
import LoginView from './components/Auth/LoginView'
import RegisterView from './components/Auth/RegisterView'
import BranchesView from './components/Branches/BranchesView'
import CategoriesView from './components/Categories/CategoriesView'
import Dashboard from './components/Dashboard/Dashboard'
import ErrorState from './components/ErrorState/ErrorState'
import Loader from './components/Loader/Loader'
import ProductsView from './components/Products/ProductsView'
import ProvidersView from './components/Providers/ProvidersView'
import ResourcesView from './components/Resources/ResourcesView'
import { RESOURCE_CONFIG } from './components/Resources/resourceConfig'
import Sidebar from './components/Sidebar/Sidebar'
import ToastProvider from './components/Toast/ToastProvider'
import Topbar from './components/Topbar/Topbar'
import UsersView from './components/Users/UsersView'
import WarehousesView from './components/Warehouses/WarehousesView'
import { useAuth } from './hooks/useAuth'
import { useAccessibilityPreferences } from './hooks/useAccessibilityPreferences'
import { useCollection } from './hooks/useCollection'
import styles from './App.module.css'

const VIEW_META = {
  panel: {
    title: 'Panel de control',
    subtitle: 'Resumen general del inventario',
  },
  productos: {
    title: 'Productos',
    subtitle: 'Catálogo, precios y existencias',
  },
  categorias: {
    title: 'Categorías',
    subtitle: 'Organización del catálogo',
  },
  proveedores: {
    title: 'Proveedores',
    subtitle: 'Contactos y empresas de abastecimiento',
  },
  sucursales: {
    title: 'Sucursales',
    subtitle: 'Tiendas y sedes físicas de la empresa',
  },
  almacenes: {
    title: 'Almacenes',
    subtitle: 'Depósitos específicos dentro de las sucursales',
  },
  usuarios: {
    title: 'Usuarios',
    subtitle: 'Personas registradas en el sistema',
  },
  accesibilidad: {
    title: 'Accesibilidad',
    subtitle: 'Preferencias de visualización y movimiento',
  },
}

function InventoryApp({ accessibility }) {
  const { user, logout } = useAuth()
  const { preferences, updatePreference, resetPreferences } = accessibility
  const [activeView, setActiveView] = useState('panel')
  const [mobileOpen, setMobileOpen] = useState(false)

  const products = useCollection('productos')
  const categories = useCollection('categorias')
  const providers = useCollection('proveedores')
  const branches = useCollection('sucursales')
  const warehouses = useCollection('almacenes')
  const users = useCollection('usuarios')
  const clients = useCollection('clientes')
  const paymentMethods = useCollection('metodos-pago')
  const taxes = useCollection('impuestos')
  const purchases = useCollection('compras')
  const purchaseDetails = useCollection('detalle-compras')
  const sales = useCollection('ventas')
  const saleDetails = useCollection('detalle-ventas')
  const lots = useCollection('lotes')
  const inventoryMovements = useCollection('movimientos-inventario')
  const movementDetails = useCollection('detalle-movimientos')
  const invoices = useCollection('facturas')

  const collections = {
    productos: products.items,
    categorias: categories.items,
    proveedores: providers.items,
    sucursales: branches.items,
    almacenes: warehouses.items,
    usuarios: users.items,
    clientes: clients.items,
    'metodos-pago': paymentMethods.items,
    impuestos: taxes.items,
    compras: purchases.items,
    'detalle-compras': purchaseDetails.items,
    ventas: sales.items,
    'detalle-ventas': saleDetails.items,
    lotes: lots.items,
    'movimientos-inventario': inventoryMovements.items,
    'detalle-movimientos': movementDetails.items,
    facturas: invoices.items,
  }
  const allCollections = [
    products,
    categories,
    providers,
    branches,
    warehouses,
    users,
    clients,
    paymentMethods,
    taxes,
    purchases,
    purchaseDetails,
    sales,
    saleDetails,
    lots,
    inventoryMovements,
    movementDetails,
    invoices,
  ]
  const collectionsByResource = {
    clientes: clients.refetch,
    'metodos-pago': paymentMethods.refetch,
    impuestos: taxes.refetch,
    compras: purchases.refetch,
    'detalle-compras': purchaseDetails.refetch,
    ventas: sales.refetch,
    'detalle-ventas': saleDetails.refetch,
    lotes: lots.refetch,
    'movimientos-inventario': inventoryMovements.refetch,
    'detalle-movimientos': movementDetails.refetch,
    facturas: invoices.refetch,
  }

  const globalError =
    allCollections.find((collection) => collection.error)?.error ?? null
  const isRefreshing = allCollections.some((collection) => collection.isLoading)

  const refreshAll = () => {
    allCollections.forEach((collection) => collection.refetch())
  }

  const handleNavigate = (view) => {
    setActiveView(view)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const meta = VIEW_META[activeView] ?? (
    RESOURCE_CONFIG[activeView]
      ? {
          title: RESOURCE_CONFIG[activeView].label,
          subtitle: RESOURCE_CONFIG[activeView].description,
        }
      : VIEW_META.panel
  )

  return (
    <div className={styles.shell}>
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        counts={{
          productos: products.items.length,
          categorias: categories.items.length,
          proveedores: providers.items.length,
          sucursales: branches.items.length,
          almacenes: warehouses.items.length,
          usuarios: users.items.length,
          clientes: clients.items.length,
          'metodos-pago': paymentMethods.items.length,
          impuestos: taxes.items.length,
          compras: purchases.items.length,
          'detalle-compras': purchaseDetails.items.length,
          ventas: sales.items.length,
          'detalle-ventas': saleDetails.items.length,
          lotes: lots.items.length,
          'movimientos-inventario': inventoryMovements.items.length,
          'detalle-movimientos': movementDetails.items.length,
          facturas: invoices.items.length,
        }}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className={styles.main}>
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          refreshing={isRefreshing}
          onRefresh={refreshAll}
          onOpenMenu={() => setMobileOpen(true)}
          user={user}
          onLogout={logout}
        />

        <main className={styles.content}>
          {globalError ? (
            <ErrorState message={globalError.message} onRetry={refreshAll} />
          ) : activeView === 'productos' ? (
            <ProductsView
              products={products.items}
              categories={categories.items}
              providers={providers.items}
              branches={branches.items}
              warehouses={warehouses.items}
              isLoading={products.isLoading}
              onRefresh={products.refetch}
            />
          ) : activeView === 'categorias' ? (
            <CategoriesView
              categories={categories.items}
              products={products.items}
              branches={branches.items}
              isLoading={categories.isLoading}
              onRefresh={() => {
                categories.refetch()
                products.refetch()
              }}
            />
          ) : activeView === 'proveedores' ? (
            <ProvidersView
              providers={providers.items}
              products={products.items}
              branches={branches.items}
              isLoading={providers.isLoading}
              onRefresh={() => {
                providers.refetch()
                products.refetch()
              }}
            />
          ) : activeView === 'sucursales' ? (
            <BranchesView
              branches={branches.items}
              products={products.items}
              categories={categories.items}
              providers={providers.items}
              users={users.items}
              isLoading={branches.isLoading}
              onRefresh={branches.refetch}
            />
          ) : activeView === 'almacenes' ? (
            <WarehousesView
              warehouses={warehouses.items}
              branches={branches.items}
              products={products.items}
              isLoading={warehouses.isLoading}
              onRefresh={warehouses.refetch}
            />
          ) : activeView === 'usuarios' ? (
            <UsersView
              users={users.items}
              branches={branches.items}
              isLoading={users.isLoading}
              onRefresh={users.refetch}
            />
          ) : activeView === 'accesibilidad' ? (
            <AccessibilityView
              preferences={preferences}
              onPreferenceChange={updatePreference}
              onReset={resetPreferences}
            />
          ) : RESOURCE_CONFIG[activeView] ? (
            <ResourcesView
              resource={activeView}
              records={collections[activeView]}
              collections={collections}
              isLoading={allCollections.some((collection) => collection.isLoading)}
              onRefresh={collectionsByResource[activeView]}
            />
          ) : (
            <Dashboard
              products={products.items}
              categories={categories.items}
              providers={providers.items}
              branches={branches.items}
              warehouses={warehouses.items}
              users={users.items}
              isLoading={isRefreshing}
              onNavigate={handleNavigate}
            />
          )}
        </main>

        <footer className={styles.footer}>
          <span>Inventario ORM · React + API REST</span>
          <span>Gestión integral de compras, ventas e inventario</span>
        </footer>
      </div>
      <AssistantWidget
        mode="app"
        collections={collections}
        activeView={activeView}
        onNavigate={handleNavigate}
        onRefresh={refreshAll}
      />
    </div>
  )
}

export default function App() {
  const { isAuthenticated, isInitializing } = useAuth()
  const accessibility = useAccessibilityPreferences()
  const [authView, setAuthView] = useState('login')

  if (isInitializing) {
    return (
      <div className={styles.boot}>
        <Loader label="Verificando sesión…" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        {authView === 'login' ? (
          <LoginView onShowRegister={() => setAuthView('register')} />
        ) : (
          <RegisterView onShowLogin={() => setAuthView('login')} />
        )}
        <AssistantWidget
          mode="public"
          onAuthAction={(view) => setAuthView(view)}
        />
      </>
    )
  }

  return (
    <ToastProvider>
      <InventoryApp accessibility={accessibility} />
    </ToastProvider>
  )
}
