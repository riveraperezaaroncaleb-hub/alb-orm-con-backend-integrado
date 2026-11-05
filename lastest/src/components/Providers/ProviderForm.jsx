import { useId, useState } from 'react'
import Icon from '../Icon/Icon'
import Modal from '../Modal/Modal'
import ui from '../../styles/ui.module.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ProviderForm({ provider, onClose, onSubmit }) {
  const formId = useId()
  const [values, setValues] = useState(() => ({
    nombre: provider?.nombre ?? '',
    contacto: provider?.contacto ?? '',
    telefono: provider?.telefono ?? '',
    email: provider?.email ?? '',
    direccion: provider?.direccion ?? '',
    ciudad: provider?.ciudad ?? '',
    pais: provider?.pais ?? '',
    activo: provider?.activo ?? true,
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
      nextErrors.nombre = 'Ingresa el nombre del proveedor.'
    }

    if (values.email.trim() && !EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = 'Ingresa un email válido.'
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
        contacto: values.contacto.trim() || null,
        telefono: values.telefono.trim() || null,
        email: values.email.trim() || null,
        direccion: values.direccion.trim() || null,
        ciudad: values.ciudad.trim() || null,
        pais: values.pais.trim() || null,
        activo: values.activo,
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
      title={provider ? 'Editar proveedor' : 'Nuevo proveedor'}
      subtitle={
        provider
          ? 'Actualiza los datos de contacto del proveedor.'
          : 'Registra una empresa o contacto proveedor.'
      }
      size="lg"
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
            {submitting ? 'Guardando…' : provider ? 'Guardar cambios' : 'Crear proveedor'}
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
          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-nombre`}>
              Nombre *
            </label>
            <input
              id={`${formId}-nombre`}
              className={`${ui.input} ${errors.nombre ? ui.inputError : ''}`}
              value={values.nombre}
              onChange={(event) => updateField('nombre', event.target.value)}
              placeholder="Ej. Distribuidora Sur"
            />
            {errors.nombre ? <span className={ui.fieldError}>{errors.nombre}</span> : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-contacto`}>
              Persona de contacto
            </label>
            <input
              id={`${formId}-contacto`}
              className={ui.input}
              value={values.contacto}
              onChange={(event) => updateField('contacto', event.target.value)}
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-email`}>
              Email
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              className={`${ui.input} ${errors.email ? ui.inputError : ''}`}
              value={values.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="contacto@empresa.com"
            />
            {errors.email ? <span className={ui.fieldError}>{errors.email}</span> : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-telefono`}>
              Teléfono
            </label>
            <input
              id={`${formId}-telefono`}
              className={ui.input}
              value={values.telefono}
              onChange={(event) => updateField('telefono', event.target.value)}
              placeholder="+54 11 1234-5678"
            />
          </div>

          <div className={`${ui.field} ${ui.full}`}>
            <label className={ui.label} htmlFor={`${formId}-direccion`}>
              Dirección
            </label>
            <input
              id={`${formId}-direccion`}
              className={ui.input}
              value={values.direccion}
              onChange={(event) => updateField('direccion', event.target.value)}
              placeholder="Calle y número"
            />
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-ciudad`}>
              Ciudad
            </label>
            <input
              id={`${formId}-ciudad`}
              className={ui.input}
              value={values.ciudad}
              onChange={(event) => updateField('ciudad', event.target.value)}
              placeholder="Ej. Buenos Aires"
            />
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-pais`}>
              País
            </label>
            <input
              id={`${formId}-pais`}
              className={ui.input}
              value={values.pais}
              onChange={(event) => updateField('pais', event.target.value)}
              placeholder="Ej. Argentina"
            />
          </div>

          <div className={ui.checkField}>
            <input
              id={`${formId}-activo`}
              type="checkbox"
              className={ui.checkbox}
              checked={values.activo}
              onChange={(event) => updateField('activo', event.target.checked)}
            />
            <label className={ui.checkLabel} htmlFor={`${formId}-activo`}>
              Proveedor activo
            </label>
          </div>
        </div>
      </form>
    </Modal>
  )
}
