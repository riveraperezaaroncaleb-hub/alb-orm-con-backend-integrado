const { Producto, Categoria, Proveedor } = require('../models');

const incluirRelaciones = [
  { model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] },
  { model: Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] }
];

const manejarError = (res, error) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      mensaje: 'Ya existe un producto con ese SKU.',
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
      mensaje: 'La categoría o el proveedor indicado no existe.'
    });
  }

  return res.status(500).json({ mensaje: 'Error interno del servidor.' });
};

const listar = async (req, res) => {
  try {
    const where = {};

    if (req.query.categoriaId) {
      where.categoriaId = req.query.categoriaId;
    }

    if (req.query.proveedorId) {
      where.proveedorId = req.query.proveedorId;
    }

    if (req.query.activo !== undefined) {
      where.activo = req.query.activo === 'true' || req.query.activo === '1';
    }

    const productos = await Producto.findAll({
      where,
      include: incluirRelaciones,
      order: [['id', 'ASC']]
    });

    return res.json(productos);
  } catch (error) {
    return manejarError(res, error);
  }
};

const obtener = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: incluirRelaciones
    });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    return res.json(producto);
  } catch (error) {
    return manejarError(res, error);
  }
};

const crear = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      sku,
      precio,
      costo,
      stock,
      stockMinimo,
      unidadMedida,
      activo,
      categoriaId,
      proveedorId
    } = req.body;

    const producto = await Producto.create({
      nombre,
      descripcion,
      sku,
      precio,
      costo,
      stock,
      stockMinimo,
      unidadMedida,
      activo,
      categoriaId,
      proveedorId
    });

    return res.status(201).json(producto);
  } catch (error) {
    return manejarError(res, error);
  }
};

const actualizar = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    const {
      nombre,
      descripcion,
      sku,
      precio,
      costo,
      stock,
      stockMinimo,
      unidadMedida,
      activo,
      categoriaId,
      proveedorId
    } = req.body;

    await producto.update({
      nombre,
      descripcion,
      sku,
      precio,
      costo,
      stock,
      stockMinimo,
      unidadMedida,
      activo,
      categoriaId,
      proveedorId
    });

    return res.json(producto);
  } catch (error) {
    return manejarError(res, error);
  }
};

const eliminar = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    await producto.destroy();

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
