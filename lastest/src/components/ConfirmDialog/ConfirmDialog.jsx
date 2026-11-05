import Icon from '../Icon/Icon'
import Modal from '../Modal/Modal'
import styles from './ConfirmDialog.module.css'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Eliminar',
  busy = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onCancel}
      title={title}
      footer={
        <>
          <button
            type="button"
            className={styles.cancel}
            onClick={onCancel}
            disabled={busy}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.confirm}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Eliminando…' : confirmLabel}
          </button>
        </>
      }
    >
      <div className={styles.content}>
        <span className={styles.icon}>
          <Icon name="alert" size={22} />
        </span>
        <p className={styles.message}>{message}</p>
      </div>
    </Modal>
  )
}
