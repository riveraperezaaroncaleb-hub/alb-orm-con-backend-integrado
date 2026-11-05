'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Venta extends Model {
    static associate(models) {
      Venta.belongsTo(models.Cliente, { foreignKey: 'clienteId', as: 'cliente', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Venta.belongsTo(models.Almacen, { foreignKey: 'almacenId', as: 'almacen', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Venta.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Venta.belongsTo(models.MetodoPago, { foreignKey: 'metodoPagoId', as: 'metodoPago', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Venta.hasMany(models.DetalleVenta, { foreignKey: 'ventaId', as: 'detalles', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Venta.hasOne(models.Factura, { foreignKey: 'ventaId', as: 'factura', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
    }
  }

  Venta.init({
    numeroVenta: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'El número de venta es obligatorio.' } }
    },
    fechaVenta: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    estado: {
      type: DataTypes.ENUM('borrador', 'completada', 'cancelada'),
      allowNull: false,
      defaultValue: 'borrador',
      validate: { isIn: [['borrador', 'completada', 'cancelada']] }
    },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    descuentoTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    impuestoTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    observaciones: { type: DataTypes.STRING(500), allowNull: true },
    clienteId: { type: DataTypes.INTEGER, allowNull: true },
    almacenId: { type: DataTypes.INTEGER, allowNull: false },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
    metodoPagoId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'Venta',
    tableName: 'ventas',
    timestamps: true
  });

  return Venta;
};
