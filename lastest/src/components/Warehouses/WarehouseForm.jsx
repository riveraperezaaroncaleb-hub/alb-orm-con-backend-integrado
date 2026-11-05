import { useId, useState } from 'react'
import Icon from '../Icon/Icon'
import Modal from '../Modal/Modal'
import ui from '../../styles/ui.module.css'

export default function WarehouseForm({ warehouse, branches, onClose, onSubmit }) {
  const formId = useId()
  const [values, setValues] = useState(() => ({
    nombre: warehouse?.nombre ?? '',
    codigo: warehouse?.codigo ?? '',
    sucursalId: warehouse?.sucursalId ? String(warehouse.sucursalId) : '',
    descripcion: warehouse?.descripcion ?? '',
    direccion: warehouse?.direccion ?? '',
    capacidad: warehouse?.capacidad ?? '',
    activo: warehouse?.activo ?? true,
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
      nextErrors.nombre = 'Ingresa el nombre del almacén.'
    }

    if (!values.codigo.trim()) {
      nextErrors.codigo = 'Ingresa el código del almacén.'
    }

    if (!values.sucursalId) {
      nextErrors.sucursalId = 'Selecciona una sucursal.'
    }

    if (values.capacidad !== '') {
      const capacity = Number(values.capacidad)

      if (!Number.isInteger(capacity) || capacity < 0) {
        nextErrors.capacidad = 'La capacidad debe ser un número entero no negativo.'
      }
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
        codigo: values.codigo.trim().toUpperCase(),
        sucursalId: Number(values.sucursalId),
        descripcion: values.descripcion.trim() || null,
        direccion: values.direccion.trim() || null,
        capacidad: values.capacidad === '' ? null : Number(values.capacidad),
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
      title={warehouse ? 'Editar almacén' : 'Nuevo almacén'}
      subtitle={
        warehouse
          ? 'Actualiza los datos del depósito seleccionado.'
          : 'Registra un depósito específico dentro de una sucursal.'
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
            {submitting ? 'Guardando…' : warehouse ? 'Guardar cambios' : 'Crear almacén'}
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
              placeholder="Ej. Depósito Central"
            />
            {errors.nombre ? <span className={ui.fieldError}>{errors.nombre}</span> : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-codigo`}>
              Código *
            </label>
            <input
              id={`${formId}-codigo`}
              className={`${ui.input} ${errors.codigo ? ui.inputError : ''}`}
              value={values.codigo}
              onChange={(event) => updateField('codigo', event.target.value)}
              placeholder="Ej. ALM-CENTRO"
            />
            {errors.codigo ? <span className={ui.fieldError}>{errors.codigo}</span> : null}
          </div>

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
            <label className={ui.label} htmlFor={`${formId}-capacidad`}>
              Capacidad
            </label>
            <input
              id={`${formId}-capacidad`}
              type="number"
              min="0"
              step="1"
              className={`${ui.input} ${errors.capacidad ? ui.inputError : ''}`}
              value={values.capacidad}
              onChange={(event) => updateField('capacidad', event.target.value)}
              placeholder="Unidades que puede almacenar"
            />
            {errors.capacidad ? (
              <span className={ui.fieldError}>{errors.capacidad}</span>
            ) : null}
          </div>

          <div className={`${ui.field} ${ui.full}`}>
            <label className={ui.label} htmlFor={`${formId}-descripcion`}>
              Descripción
            </label>
            <textarea
              id={`${formId}-descripcion`}
              className={ui.textarea}
              value={values.descripcion}
              onChange={(event) => updateField('descripcion', event.target.value)}
              placeholder="Detalle opcional del almacén"
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
              placeholder="Calle, número y referencias"
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
              Almacén activo
            </label>
          </div>
        </div>
      </form>
    </Modal>
  )
}
