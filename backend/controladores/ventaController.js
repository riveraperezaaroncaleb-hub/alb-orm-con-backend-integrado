const { Venta, Cliente, Almacen, Usuario, MetodoPago, DetalleVenta, Factura } = require('../models');
const crearControladorCrud = require('./crudFactory');

module.exports = crearControladorCrud({
  Modelo: Venta,
  entidad: 'ventas',
  mensajeNoEncontrado: 'Venta no encontrada.',
  campos: [
    'numeroVenta', 'fechaVenta', 'estado', 'subtotal', 'descuentoTotal', 'impuestoTotal',
    'total', 'observaciones', 'clienteId', 'almacenId', 'usuarioId', 'metodoPagoId'
  ],
  filtros: ['estado', 'clienteId', 'almacenId', 'usuarioId', 'metodoPagoId'],
  incluirLista: [
    { model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'documento'] },
    { model: Almacen, as: 'almacen', attributes: ['id', 'nombre', 'codigo'] },
    { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] },
    { model: MetodoPago, as: 'metodoPago', attributes: ['id', 'nombre'] }
  ],
  incluirDetalle: [
    { model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'documento'] },
    { model: Almacen, as: 'almacen', attributes: ['id', 'nombre', 'codigo'] },
    { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] },
    { model: MetodoPago, as: 'metodoPago', attributes: ['id', 'nombre'] },
    { model: DetalleVenta, as: 'detalles' },
    { model: Factura, as: 'factura' }
  ]
});
