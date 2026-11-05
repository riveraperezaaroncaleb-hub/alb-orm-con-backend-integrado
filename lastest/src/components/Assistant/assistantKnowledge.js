const PUBLIC_SUGGESTIONS = [
  '¿Cómo inicio sesión?',
  '¿Cómo creo una cuenta?',
  '¿Qué puedo hacer aquí?',
]

const APP_SUGGESTIONS = [
  '¿Dónde consulto mis responsabilidades?',
  'Tengo una dificultad con la carga de trabajo',
  '¿Cómo se asignan las prioridades?',
]

const APP_MODULES = [
  { id: 'productos', names: ['producto', 'productos', 'stock', 'existencia', 'inventario'] },
  { id: 'categorias', names: ['categoria', 'categorias'] },
  { id: 'proveedores', names: ['proveedor', 'proveedores'] },
  { id: 'sucursales', names: ['sucursal', 'sucursales', 'sede'] },
  { id: 'almacenes', names: ['almacen', 'almacenes', 'deposito', 'depositos'] },
  { id: 'usuarios', names: ['usuario', 'usuarios', 'cuenta'] },
  { id: 'clientes', names: ['cliente', 'clientes'] },
  { id: 'metodos-pago', names: ['metodo de pago', 'metodos de pago', 'forma de pago'] },
  { id: 'impuestos', names: ['impuesto', 'impuestos', 'iva'] },
  { id: 'detalle-compras', names: ['detalle de compra', 'detalles de compra'] },
  { id: 'compras', names: ['compra', 'compras'] },
  { id: 'detalle-ventas', names: ['detalle de venta', 'detalles de venta'] },
  { id: 'ventas', names: ['venta', 'ventas'] },
  { id: 'lotes', names: ['lote', 'lotes'] },
  { id: 'detalle-movimientos', names: ['detalle de movimiento', 'detalles de movimiento'] },
  {
    id: 'movimientos-inventario',
    names: ['movimiento de inventario', 'movimientos de inventario', 'movimiento', 'movimientos'],
  },
  { id: 'facturas', names: ['factura', 'facturas'] },
]

const APP_MODULE_LABELS = {
  panel: 'Panel',
  productos: 'Productos',
  categorias: 'Categorías',
  proveedores: 'Proveedores',
  sucursales: 'Sucursales',
  almacenes: 'Almacenes',
  usuarios: 'Usuarios',
  accesibilidad: 'Accesibilidad',
  clientes: 'Clientes',
  'metodos-pago': 'Métodos de pago',
  impuestos: 'Impuestos',
  compras: 'Compras',
  'detalle-compras': 'Detalle de compras',
  ventas: 'Ventas',
  'detalle-ventas': 'Detalle de ventas',
  lotes: 'Lotes',
  'movimientos-inventario': 'Movimientos de inventario',
  'detalle-movimientos': 'Detalle de movimientos',
  facturas: 'Facturas',
}

const normalizeText = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const findModule = (message) => {
  const normalized = normalizeText(message)
  return APP_MODULES.find((module) =>
    module.names.some((name) => normalized.includes(name)),
  )
}

const formatNumber = (value) =>
  new Intl.NumberFormat('es-MX').format(Number(value) || 0)

const getCount = (collections, resource) => {
  if (resource === 'stock') {
    const products = collections.productos ?? []
    const units = products.reduce((sum, product) => sum + Number(product.stock || 0), 0)
    const low = products.filter(
      (product) =>
        product.activo && Number(product.stock || 0) <= Number(product.stockMinimo || 0),
    ).length
    return `Hay ${formatNumber(products.length)} productos registrados, ${formatNumber(units)} unidades en stock y ${formatNumber(low)} productos con stock bajo.`
  }

  const items = collections[resource] ?? []
  const label = APP_MODULE_LABELS[resource]?.toLowerCase() ?? 'registros'
  return `Hay ${formatNumber(items.length)} ${label} cargados en la vista actual.`
}

const getPublicReply = (message) => {
  const normalized = normalizeText(message)

  if (/\b(registr|cre(?:ar|o|a) (?:una )?cuenta|nueva cuenta)\b/.test(normalized)) {
    return {
      text: 'Claro. Pulsa «Crear una cuenta» debajo del formulario y completa tu nombre, correo y contraseña. Recuerda que debe tener al menos 6 caracteres.',
      action: { label: 'Abrir registro', type: 'register' },
    }
  }

  if (/\b(entrar|inicio(?: de)? sesion|iniciar sesion|acceso|login)\b/.test(normalized)) {
    return {
      text: 'Escribe el correo y la contraseña de tu cuenta y pulsa «Ingresar al panel». Si no funciona, revisa que el correo esté bien escrito.',
    }
  }

  if (/\b(olvide|olvidada|recuper|restable|cambiar contrasena)\b/.test(normalized)) {
    return {
      text: 'La recuperación de contraseña aún no está disponible desde aquí. Pídele ayuda al administrador y no compartas tu contraseña en este chat.',
    }
  }

  if (/\b(error|502|servidor|conectar|api)\b/.test(normalized)) {
    return {
      text: 'Primero revisa que el servidor esté encendido. Si el problema continúa, comparte el código de error con el administrador; no envíes contraseñas ni credenciales.',
    }
  }

  if (/\b(hacer|sistema|inventario|modulo|modulos|funcionalidad|ayuda)\b/.test(normalized)) {
    return {
      text: 'Aquí puedes llevar el inventario, las compras y ventas, y administrar clientes, proveedores, sucursales y más. Inicia sesión para ver los módulos.',
      action: { label: 'Ir a iniciar sesión', type: 'login' },
    }
  }

  return {
    text: 'Puedo ayudarte a entrar, crear una cuenta o encontrar una función. ¿Qué necesitas? No compartas contraseñas por aquí.',
  }
}

const getAppReply = (message, { collections, activeView }) => {
  const normalized = normalizeText(message)
  const module = findModule(message)
  const asksCount = /\b(cuant|cuantos|cuantas|total|cuenta|conteo|hay|stock)\b/.test(normalized)

  if (/\b(ayuda|como funciona|que puedes hacer|que haces)\b/.test(normalized)) {
    return {
      text: 'Puedo buscar un conteo, explicarte cómo usar un módulo o llevarte a él. No guardo cambios por ti; eso lo haces desde el formulario. ¿Qué te gustaría hacer?',
    }
  }

  if (module && (asksCount || /\b(stock|existencia|inventario)\b/.test(normalized))) {
    return { text: getCount(collections, module.id === 'productos' ? 'stock' : module.id) }
  }

  if (/\b(stock bajo|bajo de stock|poco stock)\b/.test(normalized)) {
    return { text: getCount(collections, 'stock') }
  }

  if (/\b(actualiz|recarg|refres)\b/.test(normalized)) {
    return {
      text: 'Pulsa «Actualizar» en la barra de arriba para traer los datos más recientes. Los conteos que te doy usan lo que está cargado ahora.',
    }
  }

  if (module) {
    const label = APP_MODULE_LABELS[module.id]
    const alreadyThere = activeView === module.id
    return {
      text: alreadyThere
        ? `Ya estás en ${label}. Pulsa «Nuevo» para agregar un registro; también puedes editar o eliminar desde cada fila.`
        : `Te llevo a ${label}. Ahí puedes consultar los registros y agregar, editar o eliminar desde la tabla.`,
      action: alreadyThere ? undefined : { label: `Abrir ${label}`, type: 'navigate', view: module.id },
    }
  }

  if (/\b(elimin|borrar|dependenc)\b/.test(normalized)) {
    return {
      text: 'Pulsa eliminar en la fila que quieras quitar. Si otro registro depende de ese, el sistema no permitirá borrarlo para proteger tus datos.',
    }
  }

  if (/\b(compr|vent|factur|movimiento|lote)\b/.test(normalized)) {
    return {
      text: 'Puedes registrar y editar esos datos desde su módulo. Ten en cuenta que guardar una compra, venta o movimiento no cambia el stock automáticamente.',
    }
  }

  return {
    text: 'Puedo ayudarte a encontrar un módulo o revisar algunos conteos. Por ejemplo: «¿Cuántos productos hay?» o «Llévame a ventas».',
  }
}

export function getAssistantGreeting(mode) {
  if (mode === 'public') {
    return '¡Hola! ¿Necesitas entrar o crear una cuenta? Te echo una mano.'
  }

  return '¡Hola! Puedo orientarte sobre funciones, prioridades o ayudarte a ordenar una dificultad del trabajo. ¿Qué necesitas?'
}

export function getAssistantSuggestions(mode) {
  return mode === 'public' ? PUBLIC_SUGGESTIONS : APP_SUGGESTIONS
}

export function getAssistantReply(message, context) {
  if (context.mode === 'public') return getPublicReply(message)
  return getAppReply(message, context)
}
