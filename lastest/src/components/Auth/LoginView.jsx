import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../Icon/Icon'
import AuthLayout from './AuthLayout'
import ui from '../../styles/ui.module.css'
import styles from './Auth.module.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginView({ onShowRegister }) {
  const { login } = useAuth()
  const [values, setValues] = useState({ correo: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!values.correo.trim()) {
      nextErrors.correo = 'Ingresa tu correo.'
    } else if (!EMAIL_PATTERN.test(values.correo.trim())) {
      nextErrors.correo = 'Ingresa un correo válido.'
    }

    if (!values.password) {
      nextErrors.password = 'Ingresa tu contraseña.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
      await login({
        correo: values.correo.trim(),
        password: values.password,
      })
    } catch (error) {
      setFormError(error.message)
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Accede con tu correo y contraseña para administrar el inventario."
      footer={
        <p>
          ¿No tienes una cuenta?{' '}
          <button type="button" className={styles.link} onClick={onShowRegister}>
            Crear una cuenta
          </button>
        </p>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {formError ? (
          <div className={ui.formAlert}>
            <Icon name="alert" size={16} />
            <span>{formError}</span>
          </div>
        ) : null}

        <div className={ui.field}>
          <label className={ui.label} htmlFor="login-correo">
            Correo electrónico
          </label>
          <div className={styles.inputGroup}>
            <Icon name="mail" size={17} className={styles.inputIcon} />
            <input
              id="login-correo"
              type="email"
              autoComplete="email"
              className={`${ui.input} ${styles.inputWithIcon} ${
                errors.correo ? ui.inputError : ''
              }`}
              value={values.correo}
              onChange={(event) => updateField('correo', event.target.value)}
              placeholder="tu@correo.com"
            />
          </div>
          {errors.correo ? (
            <span className={ui.fieldError}>{errors.correo}</span>
          ) : null}
        </div>

        <div className={ui.field}>
          <label className={ui.label} htmlFor="login-password">
            Contraseña
          </label>
          <div className={styles.inputGroup}>
            <Icon name="lock" size={17} className={styles.inputIcon} />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`${ui.input} ${styles.inputWithIcon} ${styles.inputWithAction} ${
                errors.password ? ui.inputError : ''
              }`}
              value={values.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Tu contraseña"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <Icon name={showPassword ? 'eyeOff' : 'eye'} size={17} />
            </button>
          </div>
          {errors.password ? (
            <span className={ui.fieldError}>{errors.password}</span>
          ) : null}
        </div>

        <button
          type="submit"
          className={`${ui.btn} ${ui.btnPrimary} ${styles.submit}`}
          disabled={submitting}
        >
          {submitting ? 'Ingresando…' : 'Ingresar al panel'}
        </button>
      </form>
    </AuthLayout>
  )
}
