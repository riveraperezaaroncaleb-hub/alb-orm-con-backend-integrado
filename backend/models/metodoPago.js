'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MetodoPago extends Model {
    static associate(models) {
      MetodoPago.hasMany(models.Compra, { foreignKey: 'metodoPagoId', as: 'compras' });
      MetodoPago.hasMany(models.Venta, { foreignKey: 'metodoPagoId', as: 'ventas' });
    }
  }

  MetodoPago.init({
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'El nombre del método de pago es obligatorio.' } }
    },
    descripcion: { type: DataTypes.STRING(255), allowNull: true },
    requiereReferencia: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    sequelize,
    modelName: 'MetodoPago',
    tableName: 'metodos_pago',
    timestamps: true
  });

  return MetodoPago;
};
