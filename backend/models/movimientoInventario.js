'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MovimientoInventario extends Model {
    static associate(models) {
      MovimientoInventario.belongsTo(models.Almacen, { foreignKey: 'almacenId', as: 'almacen', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      MovimientoInventario.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
      MovimientoInventario.hasMany(models.DetalleMovimiento, { foreignKey: 'movimientoId', as: 'detalles', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
    }
  }

  MovimientoInventario.init({
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    tipo: {
      type: DataTypes.ENUM('entrada', 'salida', 'ajuste'),
      allowNull: false,
      validate: { isIn: [['entrada', 'salida', 'ajuste']] }
    },
    referencia: { type: DataTypes.STRING(100), allowNull: true },
    observaciones: { type: DataTypes.STRING(500), allowNull: true },
    almacenId: { type: DataTypes.INTEGER, allowNull: false },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'MovimientoInventario',
    tableName: 'movimientos_inventario',
    timestamps: true
  });

  return MovimientoInventario;
};
