'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sucursal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sucursal.hasMany(models.Categoria, {
        foreignKey: 'sucursalId',
        as: 'categorias'
      });
      Sucursal.hasMany(models.Proveedor, {
        foreignKey: 'sucursalId',
        as: 'proveedores'
      });
      Sucursal.hasMany(models.Producto, {
        foreignKey: 'sucursalId',
        as: 'productos'
      });
      Sucursal.hasMany(models.Usuario, {
        foreignKey: 'sucursalId',
        as: 'usuarios'
      });
      Sucursal.hasMany(models.Almacen, {
        foreignKey: 'sucursalId',
        as: 'almacenes'
      });
      Sucursal.hasMany(models.Cliente, {
        foreignKey: 'sucursalId',
        as: 'clientes'
      });
    }
  }
  Sucursal.init({
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre de la sucursal es obligatorio.'
        }
      }
    },
    codigo: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El código de la sucursal es obligatorio.'
        }
      }
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'El email de la sucursal no tiene un formato válido.'
        }
      }
    },
    gerente: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Sucursal',
    tableName: 'sucursales',
    timestamps: true
  });
  return Sucursal;
};
