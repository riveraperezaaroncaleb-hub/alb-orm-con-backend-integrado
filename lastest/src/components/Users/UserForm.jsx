import { useId, useState } from 'react'
import Icon from '../Icon/Icon'
import Modal from '../Modal/Modal'
import ui from '../../styles/ui.module.css'

export default function UserForm({ user, onClose, onSubmit }) {
  const formId = useId()
  const [values, setValues] = useState(() => ({
    nombre: user?.nombre ?? '',
    edad: user?.edad ?? '',
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

    if (values.edad === '' || Number.isNaN(Number(values.edad))) {
      nextErrors.edad = 'Ingresa la edad.'
    } else if (Number(values.edad) < 0 || !Number.isInteger(Number(values.edad))) {
      nextErrors.edad = 'La edad debe ser un número entero positivo.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    setFormError('')
    let success = false

    try {
      await onSubmit({
        nombre: values.nombre.trim(),
        edad: Number(values.edad),
      })
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
        user ? 'Actualiza los datos del usuario.' : 'Registra una nueva persona en el sistema.'
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
            />
            {errors.nombre ? <span className={ui.fieldError}>{errors.nombre}</span> : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-edad`}>
              Edad *
            </label>
            <input
              id={`${formId}-edad`}
              type="number"
              min="0"
              step="1"
              className={`${ui.input} ${errors.edad ? ui.inputError : ''}`}
              value={values.edad}
              onChange={(event) => updateField('edad', event.target.value)}
              placeholder="Ej. 28"
            />
            {errors.edad ? <span className={ui.fieldError}>{errors.edad}</span> : null}
          </div>
        </div>
      </form>
    </Modal>
  )
}
