const { DetalleVenta, Venta, Producto, Lote, Impuesto } = require('../models');
const crearControladorCrud = require('./crudFactory');

module.exports = crearControladorCrud({
  Modelo: DetalleVenta,
  entidad: 'detalles de venta',
  mensajeNoEncontrado: 'Detalle de venta no encontrado.',
  campos: [
    'cantidad', 'precioUnitario', 'descuento', 'impuestoPorcentaje', 'subtotal',
    'impuesto', 'total', 'ventaId', 'productoId', 'loteId', 'impuestoId'
  ],
  filtros: ['ventaId', 'productoId', 'loteId', 'impuestoId'],
  incluir: [
    { model: Venta, as: 'venta', attributes: ['id', 'numeroVenta', 'estado'] },
    { model: Producto, as: 'producto', attributes: ['id', 'nombre', 'sku'] },
    { model: Lote, as: 'lote', attributes: ['id', 'codigoLote'] },
    { model: Impuesto, as: 'impuestoTipo', attributes: ['id', 'nombre', 'porcentaje'] }
  ]
});
