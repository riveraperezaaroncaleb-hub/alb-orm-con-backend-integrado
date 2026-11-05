const { Sucursal } = require('../models');

const manejarError = (res, error) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      mensaje: 'Ya existe una sucursal con ese código.',
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
      mensaje: 'No se puede eliminar la sucursal porque tiene registros asociados.'
    });
  }

  return res.status(500).json({ mensaje: 'Error interno del servidor.' });
};

const normalizarCodigo = (codigo) =>
  codigo ? String(codigo).trim().toUpperCase() : codigo;

const normalizarEmail = (email) =>
  email ? String(email).trim().toLowerCase() : email;

const listar = async (req, res) => {
  try {
    const where = {};

    if (req.query.activo !== undefined) {
      where.activo = req.query.activo === 'true' || req.query.activo === '1';
    }

    if (req.query.ciudad) {
      where.ciudad = req.query.ciudad;
    }

    const sucursales = await Sucursal.findAll({
      where,
      order: [['id', 'ASC']]
    });

    return res.json(sucursales);
  } catch (error) {
    return manejarError(res, error);
  }
};

const obtener = async (req, res) => {
  try {
    const sucursal = await Sucursal.findByPk(req.params.id);

    if (!sucursal) {
      return res.status(404).json({ mensaje: 'Sucursal no encontrada.' });
    }

    return res.json(sucursal);
  } catch (error) {
    return manejarError(res, error);
  }
};

const crear = async (req, res) => {
  try {
    const {
      nombre,
      codigo,
      direccion,
      ciudad,
      telefono,
      email,
      gerente,
      activo
    } = req.body;

    const sucursal = await Sucursal.create({
      nombre,
      codigo: normalizarCodigo(codigo),
      direccion,
      ciudad,
      telefono,
      email: normalizarEmail(email),
      gerente,
      activo
    });

    return res.status(201).json(sucursal);
  } catch (error) {
    return manejarError(res, error);
  }
};

const actualizar = async (req, res) => {
  try {
    const sucursal = await Sucursal.findByPk(req.params.id);

    if (!sucursal) {
      return res.status(404).json({ mensaje: 'Sucursal no encontrada.' });
    }

    const {
      nombre,
      codigo,
      direccion,
      ciudad,
      telefono,
      email,
      gerente,
      activo
    } = req.body;

    await sucursal.update({
      nombre,
      codigo: normalizarCodigo(codigo),
      direccion,
      ciudad,
      telefono,
      email: normalizarEmail(email),
      gerente,
      activo
    });

    return res.json(sucursal);
  } catch (error) {
    return manejarError(res, error);
  }
};

const eliminar = async (req, res) => {
  try {
    const sucursal = await Sucursal.findByPk(req.params.id);

    if (!sucursal) {
      return res.status(404).json({ mensaje: 'Sucursal no encontrada.' });
    }

    await sucursal.destroy();

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
