const { Cliente, Sucursal } = require('../models');

const incluirRelaciones = [
  { model: Sucursal, as: 'sucursal', attributes: ['id', 'nombre', 'codigo'] }
];

const manejarError = (res, error) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      mensaje: 'Ya existe un cliente con ese documento o email.',
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
      mensaje: 'La sucursal indicada no existe.'
    });
  }

  return res.status(500).json({ mensaje: 'Error interno del servidor.' });
};

const listar = async (req, res) => {
  try {
    const where = {};

    if (req.query.activo !== undefined) {
      where.activo = req.query.activo === 'true' || req.query.activo === '1';
    }

    if (req.query.ciudad) {
      where.ciudad = req.query.ciudad;
    }

    if (req.query.sucursalId) {
      where.sucursalId = req.query.sucursalId;
    }

    const clientes = await Cliente.findAll({
      where,
      include: incluirRelaciones,
      order: [['id', 'ASC']]
    });

    return res.json(clientes);
  } catch (error) {
    return manejarError(res, error);
  }
};

const obtener = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: incluirRelaciones
    });

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    }

    return res.json(cliente);
  } catch (error) {
    return manejarError(res, error);
  }
};

const crear = async (req, res) => {
  try {
    const {
      nombre,
      documento,
      email,
      telefono,
      direccion,
      ciudad,
      activo,
      sucursalId
    } = req.body;

    const cliente = await Cliente.create({
      nombre,
      documento,
      email,
      telefono,
      direccion,
      ciudad,
      activo,
      sucursalId
    });

    return res.status(201).json(cliente);
  } catch (error) {
    return manejarError(res, error);
  }
};

const actualizar = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    }

    const {
      nombre,
      documento,
      email,
      telefono,
      direccion,
      ciudad,
      activo,
      sucursalId
    } = req.body;

    await cliente.update({
      nombre,
      documento,
      email,
      telefono,
      direccion,
      ciudad,
      activo,
      sucursalId
    });

    return res.json(cliente);
  } catch (error) {
    return manejarError(res, error);
  }
};

const eliminar = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    }

    await cliente.destroy();

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
