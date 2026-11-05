'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lote extends Model {
    static associate(models) {
      Lote.belongsTo(models.Producto, { foreignKey: 'productoId', as: 'producto', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Lote.belongsTo(models.Almacen, { foreignKey: 'almacenId', as: 'almacen', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Lote.belongsTo(models.Compra, { foreignKey: 'compraId', as: 'compra', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Lote.hasMany(models.DetalleVenta, { foreignKey: 'loteId', as: 'detallesVenta', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Lote.hasMany(models.DetalleMovimiento, { foreignKey: 'loteId', as: 'detallesMovimiento', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
    }
  }

  Lote.init({
    codigoLote: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: { notEmpty: { msg: 'El código de lote es obligatorio.' } }
    },
    fechaFabricacion: { type: DataTypes.DATEONLY, allowNull: true },
    fechaVencimiento: { type: DataTypes.DATEONLY, allowNull: true },
    cantidadInicial: { type: DataTypes.DECIMAL(12, 3), allowNull: false, validate: { min: 0.001 } },
    cantidadDisponible: { type: DataTypes.DECIMAL(12, 3), allowNull: false, validate: { min: 0 } },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    productoId: { type: DataTypes.INTEGER, allowNull: false },
    almacenId: { type: DataTypes.INTEGER, allowNull: false },
    compraId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'Lote',
    tableName: 'lotes',
    timestamps: true,
    indexes: [{ unique: true, fields: ['codigoLote', 'productoId', 'almacenId'], name: 'lotes_codigo_producto_almacen_unique' }]
  });

  return Lote;
};
