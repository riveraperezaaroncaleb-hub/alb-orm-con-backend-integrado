'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    static associate(models) {
      Cliente.hasMany(models.Venta, {
        foreignKey: 'clienteId',
        as: 'ventas',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Cliente.belongsTo(models.Sucursal, {
        foreignKey: 'sucursalId',
        as: 'sucursal',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }
  }

  Cliente.init({
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del cliente es obligatorio.',
        },
      },
    },
    documento: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El documento del cliente es obligatorio.',
        },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: {
          msg: 'El email del cliente no tiene un formato válido.',
        },
      },
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    sucursalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sucursales',
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes',
    timestamps: true,
  });

  return Cliente;
};
