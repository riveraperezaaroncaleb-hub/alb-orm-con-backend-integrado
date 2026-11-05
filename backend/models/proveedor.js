'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proveedor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Proveedor.hasMany(models.Producto, {
        foreignKey: 'proveedorId',
        as: 'productos',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Proveedor.hasMany(models.Compra, {
        foreignKey: 'proveedorId',
        as: 'compras',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Proveedor.belongsTo(models.Sucursal, {
        foreignKey: 'sucursalId',
        as: 'sucursal',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }
  Proveedor.init({
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    contacto: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      unique: true
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pais: {
      type: DataTypes.STRING(100),
      allowNull: true
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
    modelName: 'Proveedor',
    tableName: 'proveedores',
    timestamps: true
  });
  return Proveedor;
};
