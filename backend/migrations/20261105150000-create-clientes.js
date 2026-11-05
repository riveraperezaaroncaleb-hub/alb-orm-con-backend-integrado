'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clientes', {
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
      documento: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      telefono: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      direccion: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      ciudad: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      sucursalId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sucursales',
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

    await queryInterface.addIndex('clientes', ['documento'], {
      unique: true,
      name: 'clientes_documento_unique',
    });

    await queryInterface.addIndex('clientes', ['email'], {
      unique: true,
      name: 'clientes_email_unique',
    });

    await queryInterface.addIndex('clientes', ['nombre'], {
      name: 'clientes_nombre_index',
    });

    await queryInterface.addIndex('clientes', ['sucursalId'], {
      name: 'clientes_sucursal_id_index',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('clientes');
  },
};
