import { useState } from 'react'
import LoginView from './components/Auth/LoginView'
import RegisterView from './components/Auth/RegisterView'
import BranchesView from './components/Branches/BranchesView'
import CategoriesView from './components/Categories/CategoriesView'
import Dashboard from './components/Dashboard/Dashboard'
import ErrorState from './components/ErrorState/ErrorState'
import Loader from './components/Loader/Loader'
import ProductsView from './components/Products/ProductsView'
import ProvidersView from './components/Providers/ProvidersView'
import Sidebar from './components/Sidebar/Sidebar'
import ToastProvider from './components/Toast/ToastProvider'
import Topbar from './components/Topbar/Topbar'
import UsersView from './components/Users/UsersView'
import WarehousesView from './components/Warehouses/WarehousesView'
import { useAuth } from './hooks/useAuth'
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
}

function InventoryApp() {
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState('panel')
  const [mobileOpen, setMobileOpen] = useState(false)

  const products = useCollection('productos')
  const categories = useCollection('categorias')
  const providers = useCollection('proveedores')
  const branches = useCollection('sucursales')
  const warehouses = useCollection('almacenes')
  const users = useCollection('usuarios')

  const globalError =
    products.error ??
    categories.error ??
    providers.error ??
    branches.error ??
    warehouses.error ??
    users.error
  const isRefreshing =
    products.isLoading ||
    categories.isLoading ||
    providers.isLoading ||
    branches.isLoading ||
    warehouses.isLoading ||
    users.isLoading

  const refreshAll = () => {
    products.refetch()
    categories.refetch()
    providers.refetch()
    branches.refetch()
    warehouses.refetch()
    users.refetch()
  }

  const handleNavigate = (view) => {
    setActiveView(view)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const meta = VIEW_META[activeView] ?? VIEW_META.panel

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
          <span>Gestión de sucursales, almacenes, productos, categorías y proveedores</span>
        </footer>
      </div>
    </div>
  )
}

export default function App() {
  const { isAuthenticated, isInitializing } = useAuth()
  const [authView, setAuthView] = useState('login')

  if (isInitializing) {
    return (
      <div className={styles.boot}>
        <Loader label="Verificando sesión…" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginView onShowRegister={() => setAuthView('register')} />
    ) : (
      <RegisterView onShowLogin={() => setAuthView('login')} />
    )
  }

  return (
    <ToastProvider>
      <InventoryApp />
    </ToastProvider>
  )
}
