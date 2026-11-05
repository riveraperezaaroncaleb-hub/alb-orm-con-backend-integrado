'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Producto.hasMany(models.DetalleCompra, {
        foreignKey: 'productoId',
        as: 'detallesCompra',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Producto.hasMany(models.DetalleVenta, {
        foreignKey: 'productoId',
        as: 'detallesVenta',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Producto.hasMany(models.Lote, {
        foreignKey: 'productoId',
        as: 'lotes',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Producto.hasMany(models.DetalleMovimiento, {
        foreignKey: 'productoId',
        as: 'detallesMovimiento',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Producto.belongsTo(models.Categoria, {
        foreignKey: 'categoriaId',
        as: 'categoria',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Producto.belongsTo(models.Proveedor, {
        foreignKey: 'proveedorId',
        as: 'proveedor',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Producto.belongsTo(models.Sucursal, {
        foreignKey: 'sucursalId',
        as: 'sucursal',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Producto.belongsTo(models.Almacen, {
        foreignKey: 'almacenId',
        as: 'almacen',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }
  Producto.init({
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    costo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    stockMinimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    unidadMedida: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'unidad'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    },
    proveedorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'proveedores',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
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
    },
    almacenId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'almacenes',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Producto',
    tableName: 'productos',
    timestamps: true
  });
  return Producto;
};
