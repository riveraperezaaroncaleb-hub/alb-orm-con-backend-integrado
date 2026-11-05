const manejarError = (res, error, entidad) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      mensaje: `Ya existe un registro con uno de los valores únicos de ${entidad}.`,
      errores: error.errors.map((item) => item.message)
    });
  }

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      mensaje: 'Los datos enviados no son válidos.',
      errores: error.errors.map((item) => item.message)
    });
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({
      mensaje: `No se puede completar la operación de ${entidad}: una referencia no existe o el registro tiene dependencias.`
    });
  }

  return res.status(500).json({ mensaje: 'Error interno del servidor.' });
};

const crearControladorCrud = ({
  Modelo,
  entidad,
  campos,
  filtros = [],
  filtrosBooleanos = [],
  incluir = [],
  incluirLista = incluir,
  incluirDetalle = incluir,
  mensajeNoEncontrado
}) => {
  const seleccionarCampos = (body = {}) => {
    const contenido = body && typeof body === 'object' ? body : {};
    return Object.fromEntries(
      campos
        .filter((campo) => Object.prototype.hasOwnProperty.call(contenido, campo))
        .map((campo) => [campo, contenido[campo]])
    );
  };

  const listar = async (req, res) => {
    try {
      const where = {};

      for (const filtro of filtros) {
        if (req.query[filtro] === undefined || req.query[filtro] === '') {
          continue;
        }

        const valor = req.query[filtro];
        if (filtrosBooleanos.includes(filtro)) {
          if (!['true', 'false', '1', '0'].includes(valor)) {
            return res.status(400).json({ mensaje: `El filtro ${filtro} debe ser true, false, 1 o 0.` });
          }
          where[filtro] = valor === 'true' || valor === '1';
        } else {
          where[filtro] = valor;
        }
      }

      const registros = await Modelo.findAll({
        where,
        include: incluirLista,
        order: [['id', 'ASC']]
      });

      return res.json(registros);
    } catch (error) {
      return manejarError(res, error, entidad);
    }
  };

  const obtener = async (req, res) => {
    try {
      const registro = await Modelo.findByPk(req.params.id, { include: incluirDetalle });
      if (!registro) {
        return res.status(404).json({ mensaje: mensajeNoEncontrado });
      }
      return res.json(registro);
    } catch (error) {
      return manejarError(res, error, entidad);
    }
  };

  const crear = async (req, res) => {
    try {
      const registro = await Modelo.create(seleccionarCampos(req.body));
      const resultado = incluirDetalle.length
        ? await Modelo.findByPk(registro.id, { include: incluirDetalle })
        : registro;
      return res.status(201).json(resultado);
    } catch (error) {
      return manejarError(res, error, entidad);
    }
  };

  const actualizar = async (req, res) => {
    try {
      const registro = await Modelo.findByPk(req.params.id);
      if (!registro) {
        return res.status(404).json({ mensaje: mensajeNoEncontrado });
      }

      await registro.update(seleccionarCampos(req.body));
      if (incluirDetalle.length) {
        await registro.reload({ include: incluirDetalle });
      }
      return res.json(registro);
    } catch (error) {
      return manejarError(res, error, entidad);
    }
  };

  const eliminar = async (req, res) => {
    try {
      const registro = await Modelo.findByPk(req.params.id);
      if (!registro) {
        return res.status(404).json({ mensaje: mensajeNoEncontrado });
      }

      await registro.destroy();
      return res.status(204).send();
    } catch (error) {
      return manejarError(res, error, entidad);
    }
  };

  return { listar, obtener, crear, actualizar, eliminar };
};

module.exports = crearControladorCrud;
