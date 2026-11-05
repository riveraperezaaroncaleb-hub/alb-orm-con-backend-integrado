const bcrypt = require('bcryptjs');
const { Usuario, Sucursal } = require('../models');

const SALT_ROUNDS = 10;

const incluirRelaciones = [
  { model: Sucursal, as: 'sucursal', attributes: ['id', 'nombre', 'codigo'] }
];

const manejarError = (res, error) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      mensaje: 'Ya existe un usuario con ese correo.',
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

const normalizarCorreo = (correo) => String(correo).trim().toLowerCase();

const listar = async (req, res) => {
  try {
    const where = {};

    if (req.query.sucursalId) {
      where.sucursalId = req.query.sucursalId;
    }

    const usuarios = await Usuario.findAll({
      where,
      include: incluirRelaciones,
      order: [['id', 'ASC']]
    });

    return res.json(usuarios);
  } catch (error) {
    return manejarError(res, error);
  }
};

const obtener = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: incluirRelaciones
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    return res.json(usuario);
  } catch (error) {
    return manejarError(res, error);
  }
};

const crear = async (req, res) => {
  try {
    const { nombre, correo, password, sucursalId } = req.body;

    if (!password || String(password).length < 6) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 6 caracteres.'
      });
    }

    const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);

    const usuario = await Usuario.create({
      nombre,
      correo: correo ? normalizarCorreo(correo) : correo,
      password: passwordHash,
      sucursalId: sucursalId || null
    });

    return res.status(201).json(usuario);
  } catch (error) {
    return manejarError(res, error);
  }
};

const actualizar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const { nombre, correo, password, sucursalId } = req.body;
    const cambios = {};

    if (nombre !== undefined) {
      cambios.nombre = nombre;
    }

    if (correo !== undefined) {
      cambios.correo = normalizarCorreo(correo);
    }

    if (sucursalId !== undefined) {
      cambios.sucursalId = sucursalId || null;
    }

    if (password) {
      if (String(password).length < 6) {
        return res.status(400).json({
          mensaje: 'La contraseña debe tener al menos 6 caracteres.'
        });
      }

      cambios.password = await bcrypt.hash(String(password), SALT_ROUNDS);
    }

    await usuario.update(cambios);

    return res.json(usuario);
  } catch (error) {
    return manejarError(res, error);
  }
};

const eliminar = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    await usuario.destroy();

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
