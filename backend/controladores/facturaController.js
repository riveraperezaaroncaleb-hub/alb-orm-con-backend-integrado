const { Factura, Venta } = require('../models');
const crearControladorCrud = require('./crudFactory');

module.exports = crearControladorCrud({
  Modelo: Factura,
  entidad: 'facturas',
  mensajeNoEncontrado: 'Factura no encontrada.',
  campos: [
    'numeroFactura', 'fechaEmision', 'fechaVencimiento', 'estado', 'moneda',
    'subtotal', 'impuestoTotal', 'total', 'nombreFiscal', 'identificacionFiscal',
    'direccionFiscal', 'ventaId'
  ],
  filtros: ['estado', 'ventaId'],
  incluir: [{ model: Venta, as: 'venta', attributes: ['id', 'numeroVenta', 'clienteId', 'total', 'estado'] }]
});
