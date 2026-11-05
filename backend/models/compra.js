'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Compra extends Model {
    static associate(models) {
      Compra.belongsTo(models.Proveedor, { foreignKey: 'proveedorId', as: 'proveedor', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Compra.belongsTo(models.Almacen, { foreignKey: 'almacenId', as: 'almacen', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Compra.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Compra.belongsTo(models.MetodoPago, { foreignKey: 'metodoPagoId', as: 'metodoPago', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Compra.hasMany(models.DetalleCompra, { foreignKey: 'compraId', as: 'detalles', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      Compra.hasMany(models.Lote, { foreignKey: 'compraId', as: 'lotes', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
    }
  }

  Compra.init({
    numeroCompra: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'El número de compra es obligatorio.' } }
    },
    fechaCompra: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    estado: {
      type: DataTypes.ENUM('borrador', 'recibida', 'cancelada'),
      allowNull: false,
      defaultValue: 'borrador',
      validate: { isIn: [['borrador', 'recibida', 'cancelada']] }
    },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    impuestoTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, validate: { min: 0 } },
    observaciones: { type: DataTypes.STRING(500), allowNull: true },
    proveedorId: { type: DataTypes.INTEGER, allowNull: false },
    almacenId: { type: DataTypes.INTEGER, allowNull: false },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
    metodoPagoId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'Compra',
    tableName: 'compras',
    timestamps: true
  });

  return Compra;
};
