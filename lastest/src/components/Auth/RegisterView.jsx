import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../Icon/Icon'
import AuthLayout from './AuthLayout'
import ui from '../../styles/ui.module.css'
import styles from './Auth.module.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterView({ onShowLogin }) {
  const { register } = useAuth()
  const [values, setValues] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmarPassword: '',
  })
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

    if (!values.nombre.trim()) {
      nextErrors.nombre = 'Ingresa tu nombre.'
    }

    if (!values.correo.trim()) {
      nextErrors.correo = 'Ingresa tu correo.'
    } else if (!EMAIL_PATTERN.test(values.correo.trim())) {
      nextErrors.correo = 'Ingresa un correo válido.'
    }

    if (values.password.length < 6) {
      nextErrors.password = 'La contraseña debe tener al menos 6 caracteres.'
    }

    if (values.confirmarPassword !== values.password) {
      nextErrors.confirmarPassword = 'Las contraseñas no coinciden.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
      await register({
        nombre: values.nombre.trim(),
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
      title="Crear cuenta"
      subtitle="Regístrate para acceder al panel y gestionar tus recursos."
      footer={
        <p>
          ¿Ya tienes una cuenta?{' '}
          <button type="button" className={styles.link} onClick={onShowLogin}>
            Iniciar sesión
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
          <label className={ui.label} htmlFor="register-nombre">
            Nombre completo
          </label>
          <div className={styles.inputGroup}>
            <Icon name="user" size={17} className={styles.inputIcon} />
            <input
              id="register-nombre"
              autoComplete="name"
              className={`${ui.input} ${styles.inputWithIcon} ${
                errors.nombre ? ui.inputError : ''
              }`}
              value={values.nombre}
              onChange={(event) => updateField('nombre', event.target.value)}
              placeholder="Ej. Ana Martínez"
            />
          </div>
          {errors.nombre ? (
            <span className={ui.fieldError}>{errors.nombre}</span>
          ) : null}
        </div>

        <div className={ui.field}>
          <label className={ui.label} htmlFor="register-correo">
            Correo electrónico
          </label>
          <div className={styles.inputGroup}>
            <Icon name="mail" size={17} className={styles.inputIcon} />
            <input
              id="register-correo"
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
          <label className={ui.label} htmlFor="register-password">
            Contraseña
          </label>
          <div className={styles.inputGroup}>
            <Icon name="lock" size={17} className={styles.inputIcon} />
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`${ui.input} ${styles.inputWithIcon} ${styles.inputWithAction} ${
                errors.password ? ui.inputError : ''
              }`}
              value={values.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Mínimo 6 caracteres"
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

        <div className={ui.field}>
          <label className={ui.label} htmlFor="register-confirmar">
            Confirmar contraseña
          </label>
          <div className={styles.inputGroup}>
            <Icon name="lock" size={17} className={styles.inputIcon} />
            <input
              id="register-confirmar"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`${ui.input} ${styles.inputWithIcon} ${
                errors.confirmarPassword ? ui.inputError : ''
              }`}
              value={values.confirmarPassword}
              onChange={(event) =>
                updateField('confirmarPassword', event.target.value)
              }
              placeholder="Repite la contraseña"
            />
          </div>
          {errors.confirmarPassword ? (
            <span className={ui.fieldError}>{errors.confirmarPassword}</span>
          ) : null}
        </div>

        <button
          type="submit"
          className={`${ui.btn} ${ui.btnPrimary} ${styles.submit}`}
          disabled={submitting}
        >
          {submitting ? 'Creando cuenta…' : 'Crear cuenta y entrar'}
        </button>
      </form>
    </AuthLayout>
  )
}
