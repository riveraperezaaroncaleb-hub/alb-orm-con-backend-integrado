const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat('es-AR')

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0)
}

export function formatNumber(value) {
  return numberFormatter.format(Number(value) || 0)
}

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export function formatUnit(value) {
  return value || 'unidad'
}

export function getStockState(stock, stockMinimo) {
  const current = Number(stock) || 0
  const minimum = Number(stockMinimo) || 0

  if (current <= 0) {
    return { label: 'Sin stock', tone: 'danger' }
  }
  if (current <= minimum) {
    return { label: 'Stock bajo', tone: 'warn' }
  }
  return { label: 'Disponible', tone: 'success' }
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}
