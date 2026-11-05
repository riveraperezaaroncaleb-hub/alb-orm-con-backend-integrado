'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Impuesto extends Model {
    static associate(models) {
      Impuesto.hasMany(models.DetalleCompra, { foreignKey: 'impuestoId', as: 'detallesCompra', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Impuesto.hasMany(models.DetalleVenta, { foreignKey: 'impuestoId', as: 'detallesVenta', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
    }
  }

  Impuesto.init({
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'El nombre del impuesto es obligatorio.' } }
    },
    codigo: { type: DataTypes.STRING(30), allowNull: true, unique: true },
    porcentaje: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: { min: 0, max: 100 }
    },
    descripcion: { type: DataTypes.STRING(255), allowNull: true },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Impuesto',
    tableName: 'impuestos',
    timestamps: true
  });

  return Impuesto;
};
