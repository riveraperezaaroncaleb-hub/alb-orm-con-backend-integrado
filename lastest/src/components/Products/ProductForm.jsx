import { useId, useState } from 'react'
import Icon from '../Icon/Icon'
import Modal from '../Modal/Modal'
import ui from '../../styles/ui.module.css'

const UNITS = ['unidad', 'caja', 'paquete', 'kg', 'litro', 'metro', 'par']

function buildInitialValues(product) {
  return {
    nombre: product?.nombre ?? '',
    descripcion: product?.descripcion ?? '',
    sku: product?.sku ?? '',
    categoriaId: product?.categoriaId ? String(product.categoriaId) : '',
    proveedorId: product?.proveedorId ? String(product.proveedorId) : '',
    precio: product?.precio ?? '',
    costo: product?.costo ?? '',
    stock: product?.stock ?? 0,
    stockMinimo: product?.stockMinimo ?? 0,
    unidadMedida: product?.unidadMedida ?? 'unidad',
    activo: product?.activo ?? true,
  }
}

function validate(values) {
  const errors = {}

  if (!values.nombre.trim()) errors.nombre = 'Ingresa el nombre del producto.'
  if (!values.sku.trim()) errors.sku = 'Ingresa el SKU.'
  if (!values.categoriaId) errors.categoriaId = 'Selecciona una categoría.'
  if (!values.proveedorId) errors.proveedorId = 'Selecciona un proveedor.'

  const numericFields = [
    ['precio', 'el precio'],
    ['costo', 'el costo'],
    ['stock', 'el stock'],
    ['stockMinimo', 'el stock mínimo'],
  ]

  numericFields.forEach(([field, label]) => {
    if (values[field] === '' || Number.isNaN(Number(values[field]))) {
      errors[field] = `Ingresa ${label}.`
    } else if (Number(values[field]) < 0) {
      errors[field] = 'El valor no puede ser negativo.'
    }
  })

  if (!errors.stock && (!Number.isInteger(Number(values.stock)) || Number(values.stock) < 0)) {
    errors.stock = 'El stock debe ser un número entero.'
  }

  if (
    !errors.stockMinimo &&
    (!Number.isInteger(Number(values.stockMinimo)) || Number(values.stockMinimo) < 0)
  ) {
    errors.stockMinimo = 'El stock mínimo debe ser un número entero.'
  }

  return errors
}

export default function ProductForm({ product, categories, providers, onClose, onSubmit }) {
  const formId = useId()
  const [values, setValues] = useState(() => buildInitialValues(product))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validate(values)
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
        sku: values.sku.trim().toUpperCase(),
        precio: Number(values.precio),
        costo: Number(values.costo),
        stock: Number(values.stock),
        stockMinimo: Number(values.stockMinimo),
        unidadMedida: values.unidadMedida,
        activo: values.activo,
        categoriaId: Number(values.categoriaId),
        proveedorId: Number(values.proveedorId),
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
      title={product ? 'Editar producto' : 'Nuevo producto'}
      subtitle={
        product
          ? 'Actualiza los datos del producto seleccionado.'
          : 'Completa la información para agregar un producto al inventario.'
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
            {submitting ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
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
              placeholder="Ej. Coca-Cola 500 ml"
            />
            {errors.nombre ? <span className={ui.fieldError}>{errors.nombre}</span> : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-sku`}>
              SKU *
            </label>
            <input
              id={`${formId}-sku`}
              className={`${ui.input} ${errors.sku ? ui.inputError : ''}`}
              value={values.sku}
              onChange={(event) => updateField('sku', event.target.value)}
              placeholder="Ej. COCA-500"
            />
            {errors.sku ? <span className={ui.fieldError}>{errors.sku}</span> : null}
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
              placeholder="Detalle opcional del producto"
            />
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-categoria`}>
              Categoría *
            </label>
            <select
              id={`${formId}-categoria`}
              className={`${ui.select} ${errors.categoriaId ? ui.inputError : ''}`}
              value={values.categoriaId}
              onChange={(event) => updateField('categoriaId', event.target.value)}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
            {errors.categoriaId ? (
              <span className={ui.fieldError}>{errors.categoriaId}</span>
            ) : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-proveedor`}>
              Proveedor *
            </label>
            <select
              id={`${formId}-proveedor`}
              className={`${ui.select} ${errors.proveedorId ? ui.inputError : ''}`}
              value={values.proveedorId}
              onChange={(event) => updateField('proveedorId', event.target.value)}
            >
              <option value="">Seleccionar proveedor</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.nombre}
                </option>
              ))}
            </select>
            {errors.proveedorId ? (
              <span className={ui.fieldError}>{errors.proveedorId}</span>
            ) : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-precio`}>
              Precio de venta *
            </label>
            <input
              id={`${formId}-precio`}
              type="number"
              min="0"
              step="0.01"
              className={`${ui.input} ${errors.precio ? ui.inputError : ''}`}
              value={values.precio}
              onChange={(event) => updateField('precio', event.target.value)}
              placeholder="0.00"
            />
            {errors.precio ? <span className={ui.fieldError}>{errors.precio}</span> : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-costo`}>
              Costo *
            </label>
            <input
              id={`${formId}-costo`}
              type="number"
              min="0"
              step="0.01"
              className={`${ui.input} ${errors.costo ? ui.inputError : ''}`}
              value={values.costo}
              onChange={(event) => updateField('costo', event.target.value)}
              placeholder="0.00"
            />
            {errors.costo ? <span className={ui.fieldError}>{errors.costo}</span> : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-stock`}>
              Stock actual *
            </label>
            <input
              id={`${formId}-stock`}
              type="number"
              min="0"
              step="1"
              className={`${ui.input} ${errors.stock ? ui.inputError : ''}`}
              value={values.stock}
              onChange={(event) => updateField('stock', event.target.value)}
            />
            {errors.stock ? <span className={ui.fieldError}>{errors.stock}</span> : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-minimo`}>
              Stock mínimo *
            </label>
            <input
              id={`${formId}-minimo`}
              type="number"
              min="0"
              step="1"
              className={`${ui.input} ${errors.stockMinimo ? ui.inputError : ''}`}
              value={values.stockMinimo}
              onChange={(event) => updateField('stockMinimo', event.target.value)}
            />
            {errors.stockMinimo ? (
              <span className={ui.fieldError}>{errors.stockMinimo}</span>
            ) : null}
          </div>

          <div className={ui.field}>
            <label className={ui.label} htmlFor={`${formId}-unidad`}>
              Unidad de medida
            </label>
            <select
              id={`${formId}-unidad`}
              className={ui.select}
              value={values.unidadMedida}
              onChange={(event) => updateField('unidadMedida', event.target.value)}
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
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
              Producto activo
            </label>
          </div>
        </div>
      </form>
    </Modal>
  )
}
