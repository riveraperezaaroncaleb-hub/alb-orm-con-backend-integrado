'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DetalleVenta extends Model {
    static associate(models) {
      DetalleVenta.belongsTo(models.Venta, { foreignKey: 'ventaId', as: 'venta', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      DetalleVenta.belongsTo(models.Producto, { foreignKey: 'productoId', as: 'producto', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      DetalleVenta.belongsTo(models.Lote, { foreignKey: 'loteId', as: 'lote', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      DetalleVenta.belongsTo(models.Impuesto, { foreignKey: 'impuestoId', as: 'impuestoTipo', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
    }
  }

  DetalleVenta.init({
    cantidad: { type: DataTypes.DECIMAL(12, 3), allowNull: false, validate: { min: 0.001 } },
    precioUnitario: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
    descuento: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    impuestoPorcentaje: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0, validate: { min: 0, max: 100 } },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    impuesto: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    ventaId: { type: DataTypes.INTEGER, allowNull: false },
    productoId: { type: DataTypes.INTEGER, allowNull: false },
    loteId: { type: DataTypes.INTEGER, allowNull: true },
    impuestoId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'DetalleVenta',
    tableName: 'detalle_ventas',
    timestamps: true
  });

  return DetalleVenta;
};
