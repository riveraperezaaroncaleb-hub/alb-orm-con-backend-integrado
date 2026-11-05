'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DetalleCompra extends Model {
    static associate(models) {
      DetalleCompra.belongsTo(models.Compra, { foreignKey: 'compraId', as: 'compra', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      DetalleCompra.belongsTo(models.Producto, { foreignKey: 'productoId', as: 'producto', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      DetalleCompra.belongsTo(models.Impuesto, { foreignKey: 'impuestoId', as: 'impuestoTipo', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
    }
  }

  DetalleCompra.init({
    cantidad: { type: DataTypes.DECIMAL(12, 3), allowNull: false, validate: { min: 0.001 } },
    costoUnitario: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
    descuento: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    impuestoPorcentaje: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0, validate: { min: 0, max: 100 } },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    impuesto: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    compraId: { type: DataTypes.INTEGER, allowNull: false },
    productoId: { type: DataTypes.INTEGER, allowNull: false },
    impuestoId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'DetalleCompra',
    tableName: 'detalle_compras',
    timestamps: true
  });

  return DetalleCompra;
};
