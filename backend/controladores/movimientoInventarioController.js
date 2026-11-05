const { MovimientoInventario, Almacen, Usuario, DetalleMovimiento } = require('../models');
const crearControladorCrud = require('./crudFactory');

module.exports = crearControladorCrud({
  Modelo: MovimientoInventario,
  entidad: 'movimientos de inventario',
  mensajeNoEncontrado: 'Movimiento de inventario no encontrado.',
  campos: ['fecha', 'tipo', 'referencia', 'observaciones', 'almacenId', 'usuarioId'],
  filtros: ['tipo', 'almacenId', 'usuarioId'],
  incluirLista: [
    { model: Almacen, as: 'almacen', attributes: ['id', 'nombre', 'codigo'] },
    { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] }
  ],
  incluirDetalle: [
    { model: Almacen, as: 'almacen', attributes: ['id', 'nombre', 'codigo'] },
    { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] },
    { model: DetalleMovimiento, as: 'detalles' }
  ]
});
