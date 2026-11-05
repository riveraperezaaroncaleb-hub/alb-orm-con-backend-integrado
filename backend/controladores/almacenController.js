const { Almacen, Sucursal } = require('../models');

const incluirRelaciones = [
  { model: Sucursal, as: 'sucursal', attributes: ['id', 'nombre', 'codigo'] }
];

const manejarError = (res, error) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      mensaje: 'Ya existe un almacén con ese código.',
      errores: error.errors.map((e) => e.message)
    });
  }

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      mensaje: 'Los datos enviados no son válidos.',
      errores: error.errors.map((e) => e.message)
    });
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({
      mensaje: 'La sucursal indicada no existe o tiene registros asociados.'
    });
  }

  return res.status(500).json({ mensaje: 'Error interno del servidor.' });
};

const normalizarCodigo = (codigo) =>
  codigo ? String(codigo).trim().toUpperCase() : codigo;

const listar = async (req, res) => {
  try {
    const where = {};

    if (req.query.sucursalId) {
      where.sucursalId = req.query.sucursalId;
    }

    if (req.query.activo !== undefined) {
      where.activo = req.query.activo === 'true' || req.query.activo === '1';
    }

    const almacenes = await Almacen.findAll({
      where,
      include: incluirRelaciones,
      order: [['id', 'ASC']]
    });

    return res.json(almacenes);
  } catch (error) {
    return manejarError(res, error);
  }
};

const obtener = async (req, res) => {
  try {
    const almacen = await Almacen.findByPk(req.params.id, {
      include: incluirRelaciones
    });

    if (!almacen) {
      return res.status(404).json({ mensaje: 'Almacén no encontrado.' });
    }

    return res.json(almacen);
  } catch (error) {
    return manejarError(res, error);
  }
};

const crear = async (req, res) => {
  try {
    const {
      nombre,
      codigo,
      descripcion,
      direccion,
      capacidad,
      activo,
      sucursalId
    } = req.body;

    const almacen = await Almacen.create({
      nombre,
      codigo: normalizarCodigo(codigo),
      descripcion,
      direccion,
      capacidad,
      activo,
      sucursalId
    });

    return res.status(201).json(almacen);
  } catch (error) {
    return manejarError(res, error);
  }
};

const actualizar = async (req, res) => {
  try {
    const almacen = await Almacen.findByPk(req.params.id);

    if (!almacen) {
      return res.status(404).json({ mensaje: 'Almacén no encontrado.' });
    }

    const {
      nombre,
      codigo,
      descripcion,
      direccion,
      capacidad,
      activo,
      sucursalId
    } = req.body;

    await almacen.update({
      nombre,
      codigo: normalizarCodigo(codigo),
      descripcion,
      direccion,
      capacidad,
      activo,
      sucursalId
    });

    return res.json(almacen);
  } catch (error) {
    return manejarError(res, error);
  }
};

const eliminar = async (req, res) => {
  try {
    const almacen = await Almacen.findByPk(req.params.id);

    if (!almacen) {
      return res.status(404).json({ mensaje: 'Almacén no encontrado.' });
    }

    await almacen.destroy();

    return res.status(204).send();
  } catch (error) {
    return manejarError(res, error);
  }
};

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
};
