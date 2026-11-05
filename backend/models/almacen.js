'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Almacen extends Model {
    static associate(models) {
      Almacen.belongsTo(models.Sucursal, {
        foreignKey: 'sucursalId',
        as: 'sucursal',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Almacen.hasMany(models.Producto, {
        foreignKey: 'almacenId',
        as: 'productos',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Almacen.hasMany(models.Compra, {
        foreignKey: 'almacenId',
        as: 'compras',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Almacen.hasMany(models.Venta, {
        foreignKey: 'almacenId',
        as: 'ventas',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Almacen.hasMany(models.Lote, {
        foreignKey: 'almacenId',
        as: 'lotes',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Almacen.hasMany(models.MovimientoInventario, {
        foreignKey: 'almacenId',
        as: 'movimientosInventario',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }
  Almacen.init({
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del almacén es obligatorio.'
        }
      }
    },
    codigo: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El código del almacén es obligatorio.'
        }
      }
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    sucursalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sucursales',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Almacen',
    tableName: 'almacenes',
    timestamps: true
  });
  return Almacen;
};
