import { useId, useState } from 'react'
import Icon from '../Icon/Icon'
import Modal from '../Modal/Modal'
import ui from '../../styles/ui.module.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function UserForm({ user, branches, onClose, onSubmit }) {
  const formId = useId()
  const [values, setValues] = useState(() => ({
    nombre: user?.nombre ?? '',
    correo: user?.correo ?? '',
    password: '',
    sucursalId: user?.sucursalId ? String(user.sucursalId) : '',
  }))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!values.nombre.trim()) {
      nextErrors.nombre = 'Ingresa el nombre del usuario.'
    }

    if (!values.correo.trim()) {
      nextErrors.correo = 'Ingresa el correo del usuario.'
    } else if (!EMAIL_PATTERN.test(values.correo.trim())) {
      nextErrors.correo = 'Ingresa un correo válido.'
    }

    if (!user && values.password.length < 6) {
      nextErrors.password = 'La contraseña debe tener al menos 6 caracteres.'
    } else if (user && values.password && values.password.length < 6) {
      nextErrors.password = 'La nueva contraseña debe tener al menos 6 caracteres.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    setFormError('')
    let success = false

    try {
      const payload = {
        nombre: values.nombre.trim(),
        correo: values.correo.trim().toLowerCase(),
        sucursalId: values.sucursalId ? Number(values.sucursalId) : null,
      }

      if (values.password) {
        payload.password = values.password
      }

      await onSubmit(payload)
      success = true
    } catch (error) {
      setFormError(error.message)
    } finally {
      if (!success) setSubmitting(false)
    }
  }

  return (
    <Modal
      open
      onClose={submitting ? () => {} : onClose}
      title={user ? 'Editar usuario' : 'Nuevo usuario'}
      subtitle={
        user
          ? 'Actualiza los datos del usuario. Deja la contraseña vacía para conservarla.'
          : 'Registra una nueva persona habilitada para acceder al sistema.'
      }
      footer={
        <>
          <button
            type="button"
            className={`${ui.btn} ${ui.btnGhost}`}
            onClick={onClose}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form={formId}
            className={`${ui.btn} ${ui.btnPrimary}`}
            disabled={submitting}
          >
            {submitting ? 'Guardando…' : user ? 'Guardar cambios' : 'Crear usuario'}
          </button>
        </>
      }
    >
      <form id={formId} className={ui.page} onSubmit={handleSubmit} noValidate>
        {formError ? (
          <div className={ui.formAlert}>
            <Icon name="alert" size={16} />
            <span>{formError}</span>
          </div>
        ) : null}

        <div className={ui.formGrid}>
          <div className={`${ui.field} ${ui.full}`}>
            <label className={ui.label} htmlFor={`${formId}-nombre`}>
              Nombre completo *
            </label>
            <input
              id={`${formId}-nombre`}
              className={`${ui.input} ${errors.nombre ? ui.inputError : ''}`}
              value={values.nombre}
              onChange={(event) => updateField('nombre', event.target.value)}
              placeholder="Ej. Ana Martínez"
              autoComplete="name"
            />
            {errors.nombre ? <span className={ui.fieldError}>{errors.nombre}</span> : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-correo`}>
              Correo electrónico *
            </label>
            <input
              id={`${formId}-correo`}
              type="email"
              className={`${ui.input} ${errors.correo ? ui.inputError : ''}`}
              value={values.correo}
              onChange={(event) => updateField('correo', event.target.value)}
              placeholder="usuario@correo.com"
              autoComplete="email"
            />
            {errors.correo ? <span className={ui.fieldError}>{errors.correo}</span> : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-sucursal`}>
              Sucursal
            </label>
            <select
              id={`${formId}-sucursal`}
              className={ui.select}
              value={values.sucursalId}
              onChange={(event) => updateField('sucursalId', event.target.value)}
            >
              <option value="">Sin sucursal asignada</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.nombre} · {branch.codigo}
                </option>
              ))}
            </select>
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-password`}>
              {user ? 'Nueva contraseña' : 'Contraseña *'}
            </label>
            <input
              id={`${formId}-password`}
              type="password"
              className={`${ui.input} ${errors.password ? ui.inputError : ''}`}
              value={values.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder={user ? 'Opcional' : 'Mínimo 6 caracteres'}
              autoComplete="new-password"
            />
            {errors.password ? (
              <span className={ui.fieldError}>{errors.password}</span>
            ) : null}
          </div>
        </div>
      </form>
    </Modal>
  )
}
