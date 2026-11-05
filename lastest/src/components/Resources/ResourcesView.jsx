import { useMemo, useState, useId } from 'react'
import { api } from '../../services/api'
import { useToast } from '../../hooks/useToast'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import EmptyState from '../EmptyState/EmptyState'
import Icon from '../Icon/Icon'
import Loader from '../Loader/Loader'
import Modal from '../Modal/Modal'
import ui from '../../styles/ui.module.css'
import { RESOURCE_CONFIG, RESOURCE_FIELD_OPTIONS } from './resourceConfig'

const formatDateInput = (value, includeTime = false) => {
  if (!value) return ''
  if (!includeTime && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, includeTime ? 16 : 10)
}

const initialFieldValue = (field, value) => {
  if (value !== undefined && value !== null) {
    if (field.type === 'checkbox') return Boolean(value)
    if (field.type === 'select') return String(value)
    if (field.type === 'date' || field.type === 'datetime-local') {
      return formatDateInput(value, field.type === 'datetime-local')
    }
    return String(value)
  }

  if (field.type === 'checkbox') return field.defaultValue ?? false
  if (field.defaultNow) return formatDateInput(new Date(), field.type === 'datetime-local')
  return ''
}

const makeInitialValues = (config, record) =>
  Object.fromEntries(
    Object.entries(config.fields).map(([key, field]) => [
      key,
      initialFieldValue(field, record?.[key]),
    ]),
  )

const makePayload = (config, values) =>
  Object.fromEntries(
    Object.entries(config.fields).flatMap(([key, field]) => {
      const value = values[key]
      if (field.type === 'checkbox') return [[key, Boolean(value)]]
      if (value === '') {
        if (field.required) return [[key, value]]
        return field.nullable ? [[key, null]] : []
      }
      if (field.type === 'number') return [[key, Number(value)]]
      if (field.optionsKey) return [[key, Number(value)]]
      return [[key, typeof value === 'string' ? value.trim() : value]]
    }),
  )

const displayValue = (value, field, collections) => {
  if (value === null || value === undefined || value === '') return '—'
  if (field.type === 'checkbox') return value ? 'Sí' : 'No'

  if (field.optionsKey) {
    const option = (collections[field.optionsKey] ?? []).find(
      (item) => String(item.id) === String(value),
    )
    if (!option) return `#${value}`
    const optionField = RESOURCE_FIELD_OPTIONS[field.optionsKey]?.label ?? field.optionLabel
    const secondaryField = RESOURCE_FIELD_OPTIONS[field.optionsKey]?.secondary
    const label = option[optionField] ?? `#${option.id}`
    return secondaryField && option[secondaryField]
      ? `${label} · ${option[secondaryField]}`
      : label
  }

  if (field.type === 'date' || field.type === 'datetime-local') {
    const parsed = new Date(
      field.type === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? `${value}T12:00:00`
        : value,
    )
    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'medium',
        ...(field.type === 'datetime-local' ? { timeStyle: 'short' } : {}),
      }).format(parsed)
    }
  }

  return String(value)
}

function ResourceForm({ config, record, collections, onClose, onSubmit }) {
  const formId = useId()
  const [values, setValues] = useState(() => makeInitialValues(config, record))
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const missing = Object.entries(config.fields)
      .filter(([key, field]) => field.required && !String(values[key] ?? '').trim())
      .map(([, field]) => field.label)

    if (missing.length) {
      setFormError(`Completa los campos obligatorios: ${missing.join(', ')}.`)
      return
    }

    setSubmitting(true)
    setFormError('')
    try {
      await onSubmit(makePayload(config, values))
    } catch (error) {
      setFormError(error.message)
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open
      onClose={submitting ? () => {} : onClose}
      title={`${record ? 'Editar' : 'Nuevo'} ${config.singular}`}
      subtitle={config.description}
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
            {submitting ? 'Guardando…' : record ? 'Guardar cambios' : 'Crear'}
          </button>
        </>
      }
    >
      <form id={formId} className={ui.page} onSubmit={handleSubmit} noValidate>
        {formError ? (
          <div className={ui.formAlert} role="alert">
            <Icon name="alert" size={16} />
            <span>{formError}</span>
          </div>
        ) : null}
        <div className={ui.formGrid}>
          {Object.entries(config.fields).map(([key, field]) => {
            const inputId = `${formId}-${key}`
            const value = values[key]
            const options = field.optionsKey ? collections[field.optionsKey] ?? [] : []

            if (field.type === 'checkbox') {
              return (
                <label key={key} className={`${ui.checkField} ${ui.full}`} htmlFor={inputId}>
                  <input
                    id={inputId}
                    className={ui.checkbox}
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [key]: event.target.checked }))
                    }
                  />
                  <span className={ui.checkLabel}>{field.label}</span>
                </label>
              )
            }

            return (
              <div key={key} className={ui.field}>
                <label className={ui.label} htmlFor={inputId}>
                  {field.label}{field.required ? ' *' : ''}
                </label>
                {field.type === 'select' ? (
                  <select
                    id={inputId}
                    className={ui.select}
                    value={value}
                    required={field.required}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [key]: event.target.value }))
                    }
                  >
                    <option value="">
                      {field.optionsKey
                        ? field.required
                          ? 'Seleccionar…'
                          : 'Sin asignar'
                        : 'Seleccionar…'}
                    </option>
                    {field.optionsKey
                      ? options.map((option) => {
                          const optionConfig = RESOURCE_FIELD_OPTIONS[field.optionsKey]
                          const label = option[optionConfig?.label ?? field.optionLabel] ?? option.id
                          const secondary = optionConfig?.secondary
                            ? option[optionConfig.secondary]
                            : null
                          return (
                            <option key={option.id} value={option.id}>
                              {label}{secondary ? ` · ${secondary}` : ''}
                            </option>
                          )
                        })
                      : field.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                  </select>
                ) : (
                  <input
                    id={inputId}
                    className={ui.input}
                    type={field.type ?? 'text'}
                    value={value}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    maxLength={field.maxLength}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [key]: event.target.value }))
                    }
                  />
                )}
              </div>
            )
          })}
        </div>
      </form>
    </Modal>
  )
}

export default function ResourcesView({
  resource,
  records,
  collections,
  isLoading,
  onRefresh,
}) {
  const config = RESOURCE_CONFIG[resource]
  const { notify } = useToast()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return records
    return records.filter((record) =>
      [record.id, ...Object.entries(config.fields).map(([key, field]) =>
        displayValue(record[key], field, collections),
      )]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(query)),
    )
  }, [records, search, config.fields, collections])

  const handleSave = async (payload) => {
    if (editing === 'new') {
      await api.create(config.endpoint, payload)
      notify(`${config.singular} creado correctamente.`)
    } else {
      await api.update(config.endpoint, editing.id, payload)
      notify(`${config.singular} actualizado correctamente.`)
    }
    setEditing(null)
    onRefresh()
  }

  const handleDelete = async () => {
    setBusy(true)
    try {
      await api.remove(config.endpoint, deleting.id)
      notify(`${config.singular} eliminado correctamente.`)
      setDeleting(null)
      onRefresh()
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) return <Loader label={`Cargando ${config.label.toLowerCase()}…`} />

  return (
    <div className={ui.page}>
      <div className={ui.pageHeader}>
        <div>
          <h2 className={ui.pageTitle}>{config.label}</h2>
          <p className={ui.pageSubtitle}>{config.description}</p>
        </div>
        <div className={ui.headerActions}>
          <button
            type="button"
            className={`${ui.btn} ${ui.btnPrimary}`}
            onClick={() => setEditing('new')}
          >
            <Icon name="plus" size={16} />
            Nuevo {config.singular}
          </button>
        </div>
      </div>

      <div className={ui.toolbar}>
        <div className={ui.filters}>
          <div className={ui.searchField}>
            <Icon name="search" size={17} className={ui.searchIcon} />
            <input
              type="search"
              className={`${ui.input} ${ui.searchInput}`}
              placeholder={`Buscar ${config.label.toLowerCase()}…`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label={`Buscar ${config.label.toLowerCase()}`}
            />
          </div>
          {search ? (
            <button
              type="button"
              className={`${ui.btn} ${ui.btnGhost} ${ui.btnSm}`}
              onClick={() => setSearch('')}
            >
              <Icon name="close" size={14} />
              Limpiar
            </button>
          ) : null}
        </div>
      </div>

      <div className={ui.pageMeta}>
        <span><strong>{filtered.length}</strong> de {records.length} registros</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={config.icon}
          title={records.length === 0 ? `Sin ${config.label.toLowerCase()}` : 'Sin resultados'}
          message={
            records.length === 0
              ? `Crea el primer registro de ${config.label.toLowerCase()}.`
              : 'No hay registros que coincidan con la búsqueda.'
          }
          actionLabel={records.length === 0 ? `Crear ${config.singular}` : 'Limpiar búsqueda'}
          onAction={
            records.length === 0 ? () => setEditing('new') : () => setSearch('')
          }
        />
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th>{config.fields[config.primary]?.label ?? 'Registro'}</th>
                {config.columns.map((key) => (
                  <th key={key}>{config.fields[key]?.label ?? key}</th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id}>
                  <td data-label={config.fields[config.primary]?.label ?? 'Registro'} data-primary="true">
                    <span className={ui.cellName}>
                      {displayValue(record[config.primary], config.fields[config.primary], collections)}
                    </span>
                    <span className={ui.cellSub}>ID {record.id}</span>
                  </td>
                  {config.columns.map((key) => (
                    <td key={key} data-label={config.fields[key]?.label ?? key}>
                      {displayValue(record[key], config.fields[key], collections)}
                    </td>
                  ))}
                  <td data-label="Acciones" data-actions="true">
                    <div className={ui.actions}>
                      <button
                        type="button"
                        className={ui.iconBtn}
                        onClick={() => setEditing(record)}
                        aria-label={`Editar ${config.singular}`}
                        title="Editar"
                      >
                        <Icon name="edit" size={15} />
                      </button>
                      <button
                        type="button"
                        className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                        onClick={() => setDeleting(record)}
                        aria-label={`Eliminar ${config.singular}`}
                        title="Eliminar"
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing ? (
        <ResourceForm
          key={`${resource}-${editing === 'new' ? 'new' : editing.id}`}
          config={config}
          record={editing === 'new' ? null : editing}
          collections={collections}
          onClose={() => setEditing(null)}
          onSubmit={handleSave}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Eliminar ${config.singular}`}
        message={`¿Seguro que deseas eliminar este registro de ${config.label.toLowerCase()}? Si tiene registros relacionados, el servidor rechazará la operación.`}
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
