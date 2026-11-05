const { Impuesto } = require('../models');
const crearControladorCrud = require('./crudFactory');

module.exports = crearControladorCrud({
  Modelo: Impuesto,
  entidad: 'impuestos',
  mensajeNoEncontrado: 'Impuesto no encontrado.',
  campos: ['nombre', 'codigo', 'porcentaje', 'descripcion', 'activo'],
  filtros: ['activo'],
  filtrosBooleanos: ['activo']
});
