'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Factura extends Model {
    static associate(models) {
      Factura.belongsTo(models.Venta, { foreignKey: 'ventaId', as: 'venta', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
    }
  }

  Factura.init({
    numeroFactura: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'El número de factura es obligatorio.' } }
    },
    fechaEmision: { type: DataTypes.DATEONLY, allowNull: false },
    fechaVencimiento: { type: DataTypes.DATEONLY, allowNull: true },
    estado: {
      type: DataTypes.ENUM('borrador', 'emitida', 'anulada'),
      allowNull: false,
      defaultValue: 'borrador',
      validate: { isIn: [['borrador', 'emitida', 'anulada']] }
    },
    moneda: {
      type: DataTypes.STRING(3),
      allowNull: false,
      validate: { is: /^[A-Z]{3}$/ }
    },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
    impuestoTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
    nombreFiscal: { type: DataTypes.STRING(150), allowNull: true },
    identificacionFiscal: { type: DataTypes.STRING(50), allowNull: true },
    direccionFiscal: { type: DataTypes.STRING(255), allowNull: true },
    ventaId: { type: DataTypes.INTEGER, allowNull: false, unique: true }
  }, {
    sequelize,
    modelName: 'Factura',
    tableName: 'facturas',
    timestamps: true
  });

  return Factura;
};
