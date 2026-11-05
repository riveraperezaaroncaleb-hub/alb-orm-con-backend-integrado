'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.hasMany(models.Compra, {
        foreignKey: 'usuarioId',
        as: 'compras',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Usuario.hasMany(models.Venta, {
        foreignKey: 'usuarioId',
        as: 'ventas',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Usuario.hasMany(models.MovimientoInventario, {
        foreignKey: 'usuarioId',
        as: 'movimientosInventario',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
      Usuario.belongsTo(models.Sucursal, {
        foreignKey: 'sucursalId',
        as: 'sucursal',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }

    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      return values;
    }
  }
  Usuario.init({
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre es obligatorio.'
        }
      }
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El correo es obligatorio.'
        },
        isEmail: {
          msg: 'El correo no tiene un formato válido.'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La contraseña es obligatoria.'
        }
      }
    },
    sucursalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sucursales',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true
  });
  return Usuario;
};
