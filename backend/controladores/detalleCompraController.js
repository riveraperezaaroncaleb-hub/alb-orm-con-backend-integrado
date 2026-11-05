const { DetalleCompra, Compra, Producto, Impuesto } = require('../models');
const crearControladorCrud = require('./crudFactory');

module.exports = crearControladorCrud({
  Modelo: DetalleCompra,
  entidad: 'detalles de compra',
  mensajeNoEncontrado: 'Detalle de compra no encontrado.',
  campos: [
    'cantidad', 'costoUnitario', 'descuento', 'impuestoPorcentaje', 'subtotal',
    'impuesto', 'total', 'compraId', 'productoId', 'impuestoId'
  ],
  filtros: ['compraId', 'productoId', 'impuestoId'],
  incluir: [
    { model: Compra, as: 'compra', attributes: ['id', 'numeroCompra', 'estado'] },
    { model: Producto, as: 'producto', attributes: ['id', 'nombre', 'sku'] },
    { model: Impuesto, as: 'impuestoTipo', attributes: ['id', 'nombre', 'porcentaje'] }
  ]
});
