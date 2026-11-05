const { Lote, Producto, Almacen, Compra } = require('../models');
const crearControladorCrud = require('./crudFactory');

module.exports = crearControladorCrud({
  Modelo: Lote,
  entidad: 'lotes',
  mensajeNoEncontrado: 'Lote no encontrado.',
  campos: [
    'codigoLote', 'fechaFabricacion', 'fechaVencimiento', 'cantidadInicial',
    'cantidadDisponible', 'activo', 'productoId', 'almacenId', 'compraId'
  ],
  filtros: ['productoId', 'almacenId', 'compraId', 'activo'],
  filtrosBooleanos: ['activo'],
  incluir: [
    { model: Producto, as: 'producto', attributes: ['id', 'nombre', 'sku'] },
    { model: Almacen, as: 'almacen', attributes: ['id', 'nombre', 'codigo'] },
    { model: Compra, as: 'compra', attributes: ['id', 'numeroCompra'] }
  ]
});
