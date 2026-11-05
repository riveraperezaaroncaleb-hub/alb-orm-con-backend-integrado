import { useState } from 'react'
import CategoriesView from './components/Categories/CategoriesView'
import Dashboard from './components/Dashboard/Dashboard'
import ErrorState from './components/ErrorState/ErrorState'
import ProductsView from './components/Products/ProductsView'
import ProvidersView from './components/Providers/ProvidersView'
import Sidebar from './components/Sidebar/Sidebar'
import ToastProvider from './components/Toast/ToastProvider'
import Topbar from './components/Topbar/Topbar'
import UsersView from './components/Users/UsersView'
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
  usuarios: {
    title: 'Usuarios',
    subtitle: 'Personas registradas en el sistema',
  },
}

export default function App() {
  const [activeView, setActiveView] = useState('panel')
  const [mobileOpen, setMobileOpen] = useState(false)

  const products = useCollection('productos')
  const categories = useCollection('categorias')
  const providers = useCollection('proveedores')
  const users = useCollection('usuarios')

  const globalError =
    products.error ?? categories.error ?? providers.error ?? users.error
  const isRefreshing =
    products.isLoading ||
    categories.isLoading ||
    providers.isLoading ||
    users.isLoading

  const refreshAll = () => {
    products.refetch()
    categories.refetch()
    providers.refetch()
    users.refetch()
  }

  const handleNavigate = (view) => {
    setActiveView(view)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const meta = VIEW_META[activeView] ?? VIEW_META.panel

  return (
    <ToastProvider>
      <div className={styles.shell}>
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigate}
          counts={{
            productos: products.items.length,
            categorias: categories.items.length,
            proveedores: providers.items.length,
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
          />

          <main className={styles.content}>
            {globalError ? (
              <ErrorState message={globalError.message} onRetry={refreshAll} />
            ) : activeView === 'productos' ? (
              <ProductsView
                products={products.items}
                categories={categories.items}
                providers={providers.items}
                isLoading={products.isLoading}
                onRefresh={products.refetch}
              />
            ) : activeView === 'categorias' ? (
              <CategoriesView
                categories={categories.items}
                products={products.items}
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
                isLoading={providers.isLoading}
                onRefresh={() => {
                  providers.refetch()
                  products.refetch()
                }}
              />
            ) : activeView === 'usuarios' ? (
              <UsersView
                users={users.items}
                isLoading={users.isLoading}
                onRefresh={users.refetch}
              />
            ) : (
              <Dashboard
                products={products.items}
                categories={categories.items}
                providers={providers.items}
                users={users.items}
                isLoading={isRefreshing}
                onNavigate={handleNavigate}
              />
            )}
          </main>

          <footer className={styles.footer}>
            <span>Inventario ORM · React + API REST</span>
            <span>Gestión de productos, categorías y proveedores</span>
          </footer>
        </div>
      </div>
    </ToastProvider>
  )
}
