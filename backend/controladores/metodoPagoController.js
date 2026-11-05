const { MetodoPago } = require('../models');
const crearControladorCrud = require('./crudFactory');

module.exports = crearControladorCrud({
  Modelo: MetodoPago,
  entidad: 'métodos de pago',
  mensajeNoEncontrado: 'Método de pago no encontrado.',
  campos: ['nombre', 'descripcion', 'requiereReferencia', 'activo'],
  filtros: ['activo'],
  filtrosBooleanos: ['activo']
});
