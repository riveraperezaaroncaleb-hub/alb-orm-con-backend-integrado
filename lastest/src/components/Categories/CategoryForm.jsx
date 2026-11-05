import { useId, useState } from 'react'
import Icon from '../Icon/Icon'
import Modal from '../Modal/Modal'
import ui from '../../styles/ui.module.css'

export default function CategoryForm({ category, branches, onClose, onSubmit }) {
  const formId = useId()
  const [values, setValues] = useState(() => ({
    nombre: category?.nombre ?? '',
    descripcion: category?.descripcion ?? '',
    activa: category?.activa ?? true,
    sucursalId: category?.sucursalId ? String(category.sucursalId) : '',
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
      nextErrors.nombre = 'Ingresa el nombre de la categoría.'
    }

    if (!values.sucursalId) {
      nextErrors.sucursalId = 'Selecciona una sucursal.'
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
        descripcion: values.descripcion.trim() || null,
        activa: values.activa,
        sucursalId: Number(values.sucursalId),
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
      title={category ? 'Editar categoría' : 'Nueva categoría'}
      subtitle={
        category
          ? 'Actualiza la información de la categoría.'
          : 'Agrupa productos bajo una nueva categoría.'
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
            {submitting ? 'Guardando…' : category ? 'Guardar cambios' : 'Crear categoría'}
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

        <div className={ui.field}>
          <label className={ui.label} htmlFor={`${formId}-sucursal`}>
            Sucursal *
          </label>
          <select
            id={`${formId}-sucursal`}
            className={`${ui.select} ${errors.sucursalId ? ui.inputError : ''}`}
            value={values.sucursalId}
            onChange={(event) => updateField('sucursalId', event.target.value)}
          >
            <option value="">Seleccionar sucursal</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.nombre} · {branch.codigo}
              </option>
            ))}
          </select>
          {errors.sucursalId ? (
            <span className={ui.fieldError}>{errors.sucursalId}</span>
          ) : null}
        </div>

        <div className={ui.field}>
          <label className={ui.label} htmlFor={`${formId}-nombre`}>
            Nombre *
          </label>
          <input
            id={`${formId}-nombre`}
            className={`${ui.input} ${errors.nombre ? ui.inputError : ''}`}
            value={values.nombre}
            onChange={(event) => updateField('nombre', event.target.value)}
            placeholder="Ej. Bebidas"
          />
          {errors.nombre ? <span className={ui.fieldError}>{errors.nombre}</span> : null}
        </div>

        <div className={ui.field}>
          <label className={ui.label} htmlFor={`${formId}-descripcion`}>
            Descripción
          </label>
          <textarea
            id={`${formId}-descripcion`}
            className={ui.textarea}
            value={values.descripcion}
            onChange={(event) => updateField('descripcion', event.target.value)}
            placeholder="Describe qué productos agrupa esta categoría"
          />
        </div>

        <div className={ui.checkField}>
          <input
            id={`${formId}-activa`}
            type="checkbox"
            className={ui.checkbox}
            checked={values.activa}
            onChange={(event) => updateField('activa', event.target.checked)}
          />
          <label className={ui.checkLabel} htmlFor={`${formId}-activa`}>
            Categoría activa
          </label>
        </div>
      </form>
    </Modal>
  )
}
