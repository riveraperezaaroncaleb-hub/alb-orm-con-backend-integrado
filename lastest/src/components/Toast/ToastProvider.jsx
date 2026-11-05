import { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ToastContext } from '../../context/ToastContext'
import Icon from '../Icon/Icon'
import styles from './ToastProvider.module.css'

const TOAST_ICONS = {
  success: 'check',
  error: 'alert',
  info: 'info',
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (message, type = 'success') => {
      counter.current += 1
      const id = counter.current
      setToasts((current) => [...current, { id, message, type }])
      setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {createPortal(
        <div className={styles.stack} role="status" aria-live="polite">
          {toasts.map((toast) => (
            <div key={toast.id} className={`${styles.toast} ${styles[toast.type] ?? ''}`}>
              <span className={styles.icon}>
                <Icon name={TOAST_ICONS[toast.type] ?? 'info'} size={16} />
              </span>
              <p className={styles.message}>{toast.message}</p>
              <button
                type="button"
                className={styles.close}
                onClick={() => dismiss(toast.id)}
                aria-label="Cerrar notificación"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}
