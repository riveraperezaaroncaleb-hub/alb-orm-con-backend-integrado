'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sku: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      costo: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      stockMinimo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      unidadMedida: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'unidad',
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      categoriaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categorias',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      proveedorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'proveedores',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addConstraint('productos', {
      fields: ['precio'],
      type: 'check',
      where: { precio: { [Sequelize.Op.gte]: 0 } },
      name: 'productos_precio_check',
    });

    await queryInterface.addConstraint('productos', {
      fields: ['costo'],
      type: 'check',
      where: { costo: { [Sequelize.Op.gte]: 0 } },
      name: 'productos_costo_check',
    });

    await queryInterface.addConstraint('productos', {
      fields: ['stock'],
      type: 'check',
      where: { stock: { [Sequelize.Op.gte]: 0 } },
      name: 'productos_stock_check',
    });

    await queryInterface.addConstraint('productos', {
      fields: ['stockMinimo'],
      type: 'check',
      where: { stockMinimo: { [Sequelize.Op.gte]: 0 } },
      name: 'productos_stock_minimo_check',
    });

    await queryInterface.addIndex('productos', ['sku'], {
      unique: true,
      name: 'productos_sku_unique',
    });

    await queryInterface.addIndex('productos', ['categoriaId'], {
      name: 'productos_categoria_id_index',
    });

    await queryInterface.addIndex('productos', ['proveedorId'], {
      name: 'productos_proveedor_id_index',
    });

    await queryInterface.addIndex('productos', ['activo', 'stock'], {
      name: 'productos_activo_stock_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('productos');
  },
};
