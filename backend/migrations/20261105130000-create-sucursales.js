'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sucursales', {
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
      codigo: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      direccion: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      ciudad: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      telefono: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      gerente: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex('sucursales', ['codigo'], {
      unique: true,
      name: 'sucursales_codigo_unique',
    });

    await queryInterface.addIndex('sucursales', ['nombre'], {
      name: 'sucursales_nombre_index',
    });

    await queryInterface.addIndex('sucursales', ['activo', 'ciudad'], {
      name: 'sucursales_activo_ciudad_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sucursales');
  },
};
