const { Proveedor, Sucursal } = require('../models');

const incluirRelaciones = [
  { model: Sucursal, as: 'sucursal', attributes: ['id', 'nombre', 'codigo'] }
];

const manejarError = (res, error) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      mensaje: 'Ya existe un proveedor con ese email.',
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
      mensaje:
        'No se pudo completar la operación: la sucursal indicada no existe o el proveedor tiene productos asociados.'
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

    if (req.query.pais) {
      where.pais = req.query.pais;
    }

    if (req.query.ciudad) {
      where.ciudad = req.query.ciudad;
    }

    if (req.query.sucursalId) {
      where.sucursalId = req.query.sucursalId;
    }

    const proveedores = await Proveedor.findAll({
      where,
      include: incluirRelaciones,
      order: [['id', 'ASC']]
    });

    return res.json(proveedores);
  } catch (error) {
    return manejarError(res, error);
  }
};

const obtener = async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id, {
      include: incluirRelaciones
    });

    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado.' });
    }

    return res.json(proveedor);
  } catch (error) {
    return manejarError(res, error);
  }
};

const crear = async (req, res) => {
  try {
    const {
      nombre,
      contacto,
      telefono,
      email,
      direccion,
      ciudad,
      pais,
      activo,
      sucursalId
    } = req.body;

    const proveedor = await Proveedor.create({
      nombre,
      contacto,
      telefono,
      email,
      direccion,
      ciudad,
      pais,
      activo,
      sucursalId
    });

    return res.status(201).json(proveedor);
  } catch (error) {
    return manejarError(res, error);
  }
};

const actualizar = async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);

    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado.' });
    }

    const {
      nombre,
      contacto,
      telefono,
      email,
      direccion,
      ciudad,
      pais,
      activo,
      sucursalId
    } = req.body;

    await proveedor.update({
      nombre,
      contacto,
      telefono,
      email,
      direccion,
      ciudad,
      pais,
      activo,
      sucursalId
    });

    return res.json(proveedor);
  } catch (error) {
    return manejarError(res, error);
  }
};

const eliminar = async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);

    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado.' });
    }

    await proveedor.destroy();

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
