import Icon from '../Icon/Icon'
import styles from './Auth.module.css'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className={styles.screen}>
      <section className={styles.brandPanel}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <Icon name="box" size={26} />
          </span>
          <div className={styles.brandText}>
            <strong>Inventario</strong>
            <span>ORM</span>
          </div>
        </div>

        <div className={styles.hero}>
          <span className={styles.eyebrow}>
            <Icon name="sparkles" size={14} />
            Panel seguro
          </span>
          <h1 className={styles.heroTitle}>Todo tu inventario, bajo control.</h1>
          <p className={styles.heroText}>
            Gestiona productos, categorías, proveedores y usuarios con acceso
            protegido mediante token JWT.
          </p>
          <ul className={styles.features}>
            <li>
              <Icon name="check" size={16} />
              Autenticación con token JWT
            </li>
            <li>
              <Icon name="check" size={16} />
              CRUDs protegidos por middleware
            </li>
            <li>
              <Icon name="check" size={16} />
              Relaciones entre productos, categorías y proveedores
            </li>
          </ul>
        </div>

        <p className={styles.brandFooter}>React · Express · MySQL · Sequelize</p>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formCard}>
          <header className={styles.formHeader}>
            <h2 className={styles.formTitle}>{title}</h2>
            <p className={styles.formSubtitle}>{subtitle}</p>
          </header>

          {children}

          <footer className={styles.formFooter}>{footer}</footer>
        </div>
      </section>
    </div>
  )
}
