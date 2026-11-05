'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('almacenes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },
      codigo: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(30),
      },
      descripcion: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },
      direccion: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },
      capacidad: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      activo: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      sucursalId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'sucursales',
          key: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('almacenes', ['sucursalId'], {
      name: 'almacenes_sucursal_id_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('almacenes', 'almacenes_sucursal_id_index');
    await queryInterface.dropTable('almacenes');
  },
};
