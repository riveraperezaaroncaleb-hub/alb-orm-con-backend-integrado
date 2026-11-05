const { DetalleMovimiento, MovimientoInventario, Producto, Lote } = require('../models');
const crearControladorCrud = require('./crudFactory');

module.exports = crearControladorCrud({
  Modelo: DetalleMovimiento,
  entidad: 'detalles de movimiento',
  mensajeNoEncontrado: 'Detalle de movimiento no encontrado.',
  campos: ['cantidad', 'costoUnitario', 'observaciones', 'movimientoId', 'productoId', 'loteId'],
  filtros: ['movimientoId', 'productoId', 'loteId'],
  incluir: [
    { model: MovimientoInventario, as: 'movimiento', attributes: ['id', 'fecha', 'tipo', 'almacenId'] },
    { model: Producto, as: 'producto', attributes: ['id', 'nombre', 'sku'] },
    { model: Lote, as: 'lote', attributes: ['id', 'codigoLote'] }
  ]
});
