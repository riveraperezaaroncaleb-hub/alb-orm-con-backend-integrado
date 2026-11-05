'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DetalleMovimiento extends Model {
    static associate(models) {
      DetalleMovimiento.belongsTo(models.MovimientoInventario, { foreignKey: 'movimientoId', as: 'movimiento', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      DetalleMovimiento.belongsTo(models.Producto, { foreignKey: 'productoId', as: 'producto', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      DetalleMovimiento.belongsTo(models.Lote, { foreignKey: 'loteId', as: 'lote', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
    }
  }

  DetalleMovimiento.init({
    cantidad: { type: DataTypes.DECIMAL(12, 3), allowNull: false, validate: { min: 0.001 } },
    costoUnitario: { type: DataTypes.DECIMAL(12, 2), allowNull: true, validate: { min: 0 } },
    observaciones: { type: DataTypes.STRING(255), allowNull: true },
    movimientoId: { type: DataTypes.INTEGER, allowNull: false },
    productoId: { type: DataTypes.INTEGER, allowNull: false },
    loteId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'DetalleMovimiento',
    tableName: 'detalle_movimientos',
    timestamps: true
  });

  return DetalleMovimiento;
};
