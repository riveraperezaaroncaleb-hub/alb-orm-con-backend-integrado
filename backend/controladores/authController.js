const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

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

  return res.status(500).json({ mensaje: 'Error interno del servidor.' });
};

const normalizarCorreo = (correo) => String(correo).trim().toLowerCase();

const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, correo: usuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

const registrar = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    const errores = [];

    if (!nombre || !String(nombre).trim()) {
      errores.push('El nombre es obligatorio.');
    }

    if (!correo || !String(correo).trim()) {
      errores.push('El correo es obligatorio.');
    }

    if (!password || String(password).length < 6) {
      errores.push('La contraseña debe tener al menos 6 caracteres.');
    }

    if (errores.length > 0) {
      return res.status(400).json({
        mensaje: 'Los datos enviados no son válidos.',
        errores
      });
    }

    const correoNormalizado = normalizarCorreo(correo);

    const existente = await Usuario.findOne({
      where: { correo: correoNormalizado }
    });

    if (existente) {
      return res.status(409).json({
        mensaje: 'Ya existe un usuario con ese correo.'
      });
    }

    const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);

    const usuario = await Usuario.create({
      nombre: String(nombre).trim(),
      correo: correoNormalizado,
      password: passwordHash
    });

    return res.status(201).json({
      mensaje: 'Usuario registrado correctamente.',
      usuario
    });
  } catch (error) {
    return manejarError(res, error);
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: 'El correo y la contraseña son obligatorios.'
      });
    }

    const usuario = await Usuario.findOne({
      where: { correo: normalizarCorreo(correo) }
    });

    if (!usuario) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos.'
      });
    }

    const passwordValido = await bcrypt.compare(
      String(password),
      usuario.password
    );

    if (!passwordValido) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos.'
      });
    }

    const token = generarToken(usuario);

    return res.json({
      mensaje: 'Inicio de sesión correcto.',
      token,
      usuario
    });
  } catch (error) {
    return manejarError(res, error);
  }
};

const perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    return res.json(usuario);
  } catch (error) {
    return manejarError(res, error);
  }
};

module.exports = {
  registrar,
  iniciarSesion,
  perfil
};
