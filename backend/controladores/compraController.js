const { Compra, Proveedor, Almacen, Usuario, MetodoPago, DetalleCompra, Lote } = require('../models');
const crearControladorCrud = require('./crudFactory');

module.exports = crearControladorCrud({
  Modelo: Compra,
  entidad: 'compras',
  mensajeNoEncontrado: 'Compra no encontrada.',
  campos: [
    'numeroCompra', 'fechaCompra', 'estado', 'subtotal', 'impuestoTotal', 'total',
    'observaciones', 'proveedorId', 'almacenId', 'usuarioId', 'metodoPagoId'
  ],
  filtros: ['estado', 'proveedorId', 'almacenId', 'usuarioId', 'metodoPagoId'],
  incluirLista: [
    { model: Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] },
    { model: Almacen, as: 'almacen', attributes: ['id', 'nombre', 'codigo'] },
    { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] },
    { model: MetodoPago, as: 'metodoPago', attributes: ['id', 'nombre'] }
  ],
  incluirDetalle: [
    { model: Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] },
    { model: Almacen, as: 'almacen', attributes: ['id', 'nombre', 'codigo'] },
    { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] },
    { model: MetodoPago, as: 'metodoPago', attributes: ['id', 'nombre'] },
    { model: DetalleCompra, as: 'detalles' },
    { model: Lote, as: 'lotes' }
  ]
});
