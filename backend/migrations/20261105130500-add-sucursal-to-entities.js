'use strict';

const TABLES = ['categorias', 'proveedores', 'productos', 'usuarios'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (const table of TABLES) {
      await queryInterface.addColumn(table, 'sucursalId', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });

      await queryInterface.addConstraint(table, {
        fields: ['sucursalId'],
        type: 'foreign key',
        name: `${table}_sucursal_id_fk`,
        references: {
          table: 'sucursales',
          field: 'id',
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      await queryInterface.addIndex(table, ['sucursalId'], {
        name: `${table}_sucursal_id_index`,
      });
    }
  },

  async down(queryInterface) {
    for (const table of [...TABLES].reverse()) {
      await queryInterface.removeConstraint(table, `${table}_sucursal_id_fk`);
      await queryInterface.removeIndex(table, `${table}_sucursal_id_index`);
      await queryInterface.removeColumn(table, 'sucursalId');
    }
  },
};
