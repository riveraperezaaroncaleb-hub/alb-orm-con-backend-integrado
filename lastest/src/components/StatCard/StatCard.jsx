import Icon from '../Icon/Icon'
import styles from './StatCard.module.css'

export default function StatCard({ label, value, helper, icon = 'box', tone = 'mint' }) {
  return (
    <article className={`${styles.card} ${styles[tone] ?? ''}`}>
      <div className={styles.top}>
        <span className={styles.icon}>
          <Icon name={icon} size={20} />
        </span>
        <span className={styles.label}>{label}</span>
      </div>
      <p className={styles.value}>{value}</p>
      {helper ? <p className={styles.helper}>{helper}</p> : null}
    </article>
  )
}
